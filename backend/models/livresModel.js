import pool from '../config/databaseConfig.js'

const listeLivres = async function(){
    try{
        const result = await pool.query(`SELECT * FROM livres`)
        return result.rows
    }
    catch(error){
        throw error
    }
}

const listeLivre = async function(id){
    try{
        const result = await pool.query(`
            SELECT livres.*, ecrire.id_auteur
            FROM livres
            LEFT JOIN ecrire ON ecrire.id_livre = livres.id
            WHERE livres.id = $1
            ORDER BY ecrire.id_auteur
            LIMIT 1
        `, [id])
        return result.rows[0]
    }
    catch(error){
        throw error
    }
}

const creerLivres = async function(titre, annee_publication, id_auteur){
    const client = await pool.connect()
    try{
        await client.query('BEGIN')
        const query = 'INSERT INTO livres(titre, annee_publication) VALUES($1, $2) RETURNING *'
        const values = [titre, annee_publication]
        const result = await client.query(query, values)

        if (id_auteur) {
            await client.query(
                'INSERT INTO ecrire(id_auteur, id_livre) VALUES($1, $2)',
                [id_auteur, result.rows[0].id]
            )
        }

        await client.query('COMMIT')
        return result.rows[0]
    }catch(error){
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

const modifierLivre = async function(id, titre, annee_publication, id_auteur){
    const client = await pool.connect()
    try{
        await client.query('BEGIN')
        const query = 'UPDATE livres SET titre = $1, annee_publication = $2 WHERE id = $3 RETURNING *'
        const values = [titre, annee_publication, id]
        const result = await client.query(query, values)

        if (result.rowCount === 0) {
            await client.query('ROLLBACK')
            return null
        }

        await client.query('DELETE FROM ecrire WHERE id_livre = $1', [id])
        if (id_auteur) {
            await client.query(
                'INSERT INTO ecrire(id_auteur, id_livre) VALUES($1, $2)',
                [id_auteur, id]
            )
        }

        await client.query('COMMIT')
        return result.rows[0]
    }
    catch(error)
    {
        await client.query('ROLLBACK')
        throw error
    } finally {
        client.release()
    }
}

const supprimerLivre = async function(id){
    try{
        const query = 'DELETE FROM livres WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error){
        throw error
    }
}

export {
    listeLivres,
    listeLivre,
    creerLivres,
    modifierLivre,
    supprimerLivre
}
