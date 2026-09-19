import { creerLivres, listeLivre, listeLivres, modifierLivre, supprimerLivre } from '../models/livresModel.js'

const getAllLivres = async function(request, response) {
    try{
        const livres = await listeLivres()
        response.json({
            message: "liste de livres récupérée",
            data: livres
        })
    }
    catch(error)
    {
        response.status(500).json({
            message: 'Erreur lors de la récupération des livres'
        })
    }
}

const getLivresById = async function(request, response){
    try{
        const id = request.params.id
        const livre = await listeLivre(id)

        if(!livre){
            return response.status(404).json({
                message: `Le livre avec l'id ${id} recherché n'existe pas`
            })
        }
        response.json({
            message: "livre récupéré",
            data: livre
        })
    }
    catch(error){
        response.status(500).json({
            message: 'Erreur lors de la récupération du livre'
        })
    }
}

const createLivre = async function(request, response){
    try{
        const {titre, annee_publication, id_auteur} = request.body

        if(!titre || !annee_publication){
            return response.status(400).json({
                message: "Le titre et l'année de publication sont obligatoires"
            })
        }

        const newLivre = await creerLivres(titre, annee_publication, id_auteur)
        response.status(201).json({
            message: "livre créé avec succès",
            data: newLivre
        })
    }
    catch(error){
        return response.status(400).json({
            message:'Erreur lors de la création de livre'
        })
    }
}

const modifyLivre = async function(request, response){
    try{
        const id = request.params.id
        const {titre, annee_publication, id_auteur} = request.body
        const modifiyingLivre = await modifierLivre(id, titre, annee_publication, id_auteur)

        if(!modifiyingLivre){
            return response.status(404).json({
                message:`Le livre avec l'id ${id} à modifier, n'existe pas`
            })
        }
        response.json({
            message: 'livre modifié avec succès',
            data: modifiyingLivre
        })
    }
    catch(error){
        response.status(500).json({
            message:"Erreur survenue lors de la modification du livre"
        })
    }
}

const deleteLivre = async function(request, response){
    try{
        const id = request.params.id
        const deletingLivre = await supprimerLivre(id)

        if(!deletingLivre){
            return response.status(404).json({
                message:`Le livre avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'livre supprimé avec succès',
            data: deletingLivre
        })
    }
    catch(error){
        if(error.code === '23503'){
            return response.status(409).json({
                message: "Impossible de supprimer ce livre : il possède un historique d'emprunts"
            })
        }
        response.status(500).json({
            message: 'Erreur lors de la suppression du livre'
        })
    }
}

export {
    getAllLivres,
    getLivresById,
    createLivre,
    modifyLivre,
    deleteLivre
}