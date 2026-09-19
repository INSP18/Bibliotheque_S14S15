import { creerEmprunts, empruntEncours, empruntEnretard, listeEmprunts, retourEmprunt } from '../models/empruntsModel.js'

const getAllEmprunts = async function(request, response){
    try{
        const Emprunts = await listeEmprunts()
        response.json({
            message: "liste des emprunts récupérée",
            data: Emprunts
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur de récupération de liste d'emprunts"
        })
    }
}

const createEmprunts = async function(request, response){
    try{
        const {id_livre, id_adherent} = request.body

        if(!id_livre || !id_adherent){
            return response.status(400).json({
                message: "Le livre et l'adhérent sont obligatoires"
            })
        }

        const empruntCreating = await creerEmprunts(id_livre, id_adherent)
        response.status(201).json({
            message: "Emprunt créé avec succès!",
            data: empruntCreating
        })
    }
    catch(error){
        response.status(400).json({
            message: error.message || "Erreur survenue lors de la création d'emprunt"
        })
    }
}

const returningEmprunt = async function(request, response){
    try{
        const id_emprunt = Number(request.params.id)

        if (!Number.isInteger(id_emprunt) || id_emprunt <= 0) {
            return response.status(400).json({ message: 'Identifiant d\'emprunt invalide' })
        }

        const returnEmprunt = await retourEmprunt(id_emprunt)
        response.json({
            message: "Emprunt retourné avec succès !",
            data: returnEmprunt
        })
    }
    catch(error){
        response.status(400).json({
            message: error.message || "erreur, impossible de consulter l'emprunt sélectionné"
        })
    }
}

const getBorrowing = async function(request, response){
    try{
        const listBorrow = await empruntEncours()
        response.json({
            message: "liste d'emprunts en cours récupérée",
            data: listBorrow
        })
    }
    catch(error)
    {
        response.status(500).json({
            message: "Erreur survenue lors de la récupération de la liste des emprunts en cours"
        })
    }
}

const getLateBorrow = async function(request, response){
    try{
        const listLateBorrow = await empruntEnretard()
        response.json({
            message: "liste des emprunts en retard récupérée",
            data: listLateBorrow
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur survenue lors de la récupération de la liste des emprunts en retard"
        })
    }
}

export {
    getAllEmprunts,
    createEmprunts,
    getBorrowing, 
    getLateBorrow,
    returningEmprunt
}