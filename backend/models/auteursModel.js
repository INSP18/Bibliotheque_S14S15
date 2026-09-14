const pool = require('../config/databaseConfig')

const getAllAuteurs = async function(){
    try{
        const result = await pool.query(`SELECT * FROM auteurs`)
        return result.rows
    }
    catch(error){
        throw error
    }
}

const getAuteur = async function(id){
    try{
        const auteur = await pool.query('SELECT * FROM auteurs WHERE id = $1', [id])
        return auteur.rows[0]
    }
    catch{

    }
}

const createAuteur = async function(nom, nationalite){
    try{
        const query = 'INSERT INTO auteurs(nom, nationalite) VALUES($1, $2) RETURNING*'
        const values = [nom,nationalite]
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

module.exports = {
    getAllAuteurs,
    getAuteur,
    createAuteur,
    modifierAuteur,
    supprimerAuteur
}