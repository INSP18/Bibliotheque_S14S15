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
        const result = await pool.query('SELECT * FROM livres WHERE id = $1', [id])
        return result.rows[0]
    }
    catch(error){
        throw error
    }
}

const creerLivres = async function(titre, annee_publication){
    try{
        const query = 'INSERT INTO livres(titre, annee_publication) VALUES($1, $2) RETURNING*'
        const values = [titre, annee_publication]
        const result = await pool.query(query, values)
        return result.rows[0]
    }catch(error){
        throw error
    }
}

const modifierLivre = async function(id, titre, annee_publication){
    try{
        const query = 'UPDATE livres SET titre = $1, annee_publication = $2 WHERE id = $3 RETURNING *'
        const values = [titre, annee_publication, id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error)
    {
        throw error
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