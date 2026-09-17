import pool from '../config/databaseConfig.js'
const statsBibliotheque = async function(){
    try{
        const stats = `
            SELECT 
                (SELECT COUNT(*) FROM livres) AS total_livres,
                (SELECT COUNT(*) FROM adherents) AS total_adherents,
                (SELECT COUNT(*) FROM auteurs) AS total_auteurs,
                (SELECT COUNT(*) FROM emprunter WHERE date_retour IS NULL AND date_retour_prevue >=CURRENT_DATE) AS total_emprunt_encours,
                (SELECT COUNT(*) FROM emprunter WHERE date_retour IS NULL AND date_retour_prevue<CURRENT_DATE) AS total_emprunt_enretard
        `
        const statsRequete = await pool.query(stats)
        return statsRequete.rows[0]
    }
    catch(error){
        throw error
    }
}

export default statsBibliotheque