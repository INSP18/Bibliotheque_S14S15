import pool from '../config/databaseConfig.js'

const listeEmprunts = async function(){
    try{
        const result = await pool.query(`
            SELECT 
                emprunter.id AS id_emprunt,
                livres.titre AS livre_titre,
                adherents.nom AS adherent_nom,
                emprunter.date_emprunt,
                emprunter.date_retour_prevue
            FROM emprunter
            JOIN livres ON emprunter.id_livre = livres.id
            JOIN adherents ON emprunter.id_adherent = adherents.id
            WHERE emprunter.date_retour IS NULL;
            `)
        return result.rows
    }
    catch (error){
        throw error
    }
}

const creerEmprunts = async function (id_livre, id_adherent){
    const client = await pool.connect()
    try{
        await client.query('BEGIN')

        const livre = await client.query(`
            SELECT * FROM livres WHERE id = $1 AND statut = 'disponible' FOR UPDATE`, [id_livre])
        if(livre.rowCount===0){
            throw new Error ("livre non disponible")
        }

        const requeteEmprunt =`
            INSERT INTO emprunter(id_livre, id_adherent, date_emprunt, date_retour_prevue)
            VALUES($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days')
            RETURNING *`

        const result = await client.query(requeteEmprunt, [id_livre, id_adherent])
        const nouvelEmprunt = result.rows[0]

        const requeteMisAjour =`
            UPDATE livres
            SET statut = 'emprunte' 
            WHERE id=$1`

        await client.query(requeteMisAjour, [id_livre])

        await client.query('COMMIT')
        return nouvelEmprunt
    }
    catch(error){
        client.query('ROLLBACK')
        throw error
    }
    finally{
        client.release()
    }
}

const retourEmprunt = async function(id_emprunt){
    const client = await pool.connect()
    try{
        await client.query('BEGIN')

        const requeteRetour = `
            UPDATE emprunter 
            SET date_retour = CURRENT_DATE
            WHERE id = $1 AND date_retour IS NULL
            RETURNING id_livre
        `
        const EmpruntRetourne = await client.query(requeteRetour, [id_emprunt])

        if(EmpruntRetourne.rowCount===0){
            throw new error("L'emprunt est indisponible ou le livre a déjà été rendu")
        }

        const id_livre = EmpruntRetourne.rows[0].id_livre
        const requeteDispoLivre = `
            UPDATE livres
            SET statut = 'disponible'
            WHERE id = $1
        `
        await client.query(requeteDispoLivre, [id_livre])

        await client.query('COMMIT')
        return {message:"Retour enregistré avec succès !"}
    }
    catch(error){
        client.query('ROLLBACK')
        throw error
    }
    finally{
        client.release()
    }
}

const empruntEncours = async function(){
    try{
        const requeteEncours = `
            SELECT 
                emprunter.id as id_emprunt,
                livres.titre as titre_livre,
                adherents.nom as nom_adherent,
                emprunter.date_emprunt,
                emprunter.date_retour_prevue
            FROM emprunter
            JOIN livres ON emprunter.id_livre = livres.id
            JOIN adherents ON emprunter.id_adherent = adherents.id
            WHERE emprunter.date_retour IS NULL
            AND emprunter.date_retour_prevue > CURRENT_DATE
            ORDER BY emprunter.date_emprunt DESC
        `
        const resultat = await pool.query(requeteEncours)
        return resultat.rows
    }
    catch(error){
        throw error
    }
}

const empruntEnretard = async function(){
    try{
        const requeteEnretard = `
            SELECT 
                emprunter.id as id_emprunt,
                livres.titre as titre_livre,
                adherents.nom as nom_adherent,
                adherents.contact as contact.adherent,
                emprunter.date_emprunt,
                emprunter.date_retour_prevue,
            FROM emprunter
            JOIN livres ON emprunter.id_livre = livres.id
            JOIN adherents ON emprunter.id_adherent = adherents.id
            WHERE emprunter.date_retour IS NULL
            AND emprunter.date_retour_prevue < CURRENT_DATE
            ORDER BY emprunter.date_retour_prevue ASC
        `
        const resultatEnretard = await pool.query(requeteEnretard)
        return resultatEnretard.rows
    }
    catch(error){
        throw error
    }
}

export {
    listeEmprunts,
    creerEmprunts,
    retourEmprunt,
    empruntEncours,
    empruntEnretard
}

