import pool from '../config/databaseConfig.js'

const listeAuteurs = async function(tous = false){
    try{
        if (tous) {
            const result = await pool.query(`
                SELECT id AS identifiant, nom AS auteur, nationalite
                FROM auteurs
                ORDER BY nom
            `)
            return result.rows
        }

        const result = await pool.query(`
            SELECT
                auteurs.id AS identifiant,
                auteurs.id AS id,
                auteurs.nom AS auteur,
                auteurs.nationalite AS nationalite,
                COALESCE(STRING_AGG(livres.titre, ', ' ORDER BY livres.titre), '') AS livre
            FROM auteurs
            LEFT JOIN ecrire ON auteurs.id = ecrire.id_auteur
            LEFT JOIN livres ON ecrire.id_livre = livres.id
            GROUP BY auteurs.id, auteurs.nom, auteurs.nationalite
            ORDER BY auteurs.nom
        `)
        return result.rows
    }
    catch(error){
        throw error
    }
}

const listeAuteur = async function(id){
    try{
        const auteur = await pool.query('SELECT * FROM auteurs WHERE id = $1', [id])
        return auteur.rows[0]
    }
    catch(error){
        throw error
    }
}

const creerteAuteur = async function(nom, nationalite){
    try{
        const query = 'INSERT INTO auteurs(nom, nationalite) VALUES($1, $2) RETURNING *'
        const values = [nom, nationalite]
        const result = await pool.query(query, values)
        return result.rows[0]
    }catch(error){
        throw error
    }
}

const modifierAuteur = async function(id, nom, nationalite){
    try{
        const query = 'UPDATE auteurs SET nom = $1, nationalite = $2 WHERE id = $3 RETURNING *'
        const values = [nom, nationalite, id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error)
    {
        throw error
    }
}

const supprimerAuteur = async function(id){
    try{
        const query = 'DELETE FROM auteurs WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error){
        throw error
    }
}

export {
    listeAuteurs,
    listeAuteur,
    creerteAuteur,
    modifierAuteur,
    supprimerAuteur
}