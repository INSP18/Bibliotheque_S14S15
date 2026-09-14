const pool = require('../config/databaseConfig')

const getAllAdherents = async function(){
    try{
        const result = await pool.query(`SELECT * FROM adherents`)
        return result.rows
    }
    catch(error){
        throw error
    }
}

const getAdherent = async function(id){
    try{
        const auteur = await pool.query('SELECT * FROM adherents WHERE id = $1', [id])
        return auteur.rows[0]
    }
    catch{

    }
}

const createAdherent = async function(nom, contact){
    try{
        const query = 'INSERT INTO adherents(nom, contact) VALUES($1, $2) RETURNING*'
        const values = [nom,contact]
        const result = await pool.query(query, values)
        return result.rows[0]
    }catch(error){
        throw error
    }
}

const modifierAdherent = async function(id, nom, contact){
    try{
        const query = 'UPDATE adherents SET nom = $1, contact = $2 WHERE id = $3 RETURNING *'
        const values = [nom, contact, id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error)
    {
        throw error
    }
}

const supprimerAdherent = async function(id){
    try{
        const query = 'DELETE FROM adherents WHERE id = $1 RETURNING *'
        const values = [id]
        const result = await pool.query(query, values)
        return result.rows[0]
    }
    catch(error){
        throw error
    }
}

module.exports = {
    getAllAdherents,
    getAdherent,
    createAdherent,
    modifierAdherent,
    supprimerAdherent
}