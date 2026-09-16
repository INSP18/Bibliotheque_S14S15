import pool from '../config/databaseConfig.js'

const getAllLivres = async function(){
    try{
        const result = await pool.query(`SELECT * FROM livres`)
        return result.rows
    }
    catch(error){
        throw error
    }
}

const getLivres = async function(id){
    try{
        const livres = await pool.query('SELECT * FROM livres WHERE id = $1', [id])
        return livres.rows[0]
    }
    catch(error){
        throw error
    }
}

const createLivres = async function(titre, annee_publication){
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
    getAllLivres,
    getLivres,
    createLivres,
    modifierLivre,
    supprimerLivre
}