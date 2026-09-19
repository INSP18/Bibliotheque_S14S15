import { creerteAuteur, listeAuteur, listeAuteurs, modifierAuteur, supprimerAuteur } from '../models/auteursModel.js'

const getAllAuteurs = async function(request, response) {
    try{
        const auteurs = await listeAuteurs(request.query.tous === 'true')
        response.json({
            message: "liste des auteurs récupérée",
            data: auteurs
        })
    }
    catch(error)
    {
        response.status(500).json({
            message: 'Erreur lors de la récupération des auteurs'
        })
    }
}

const getAuteursById = async function(request, response){
    try{
        const id = request.params.id
        const auteur = await listeAuteur(id)

        if(!auteur){
            return response.status(404).json({
                message: `L'auteur avec l'id ${id} recherché n'existe pas`
            })
        }
        response.json({
            message: "auteur récupéré",
            data: auteur
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur lors de la récupération de l'auteur"
        })
    }
}

const createAuteur = async function(request, response){
    try{
        const {nom, nationalite} = request.body

        if(!nom || !nationalite){
            return response.status(400).json({
                message: "Le nom et la nationalité sont obligatoires"
            })
        }

        const newAuteur = await creerteAuteur(nom, nationalite)
        response.status(201).json({
            message: "auteur créé avec succès",
            data: newAuteur
        })
    }
    catch(error){
        response.status(400).json({
            message: "Erreur lors de la création de l'auteur"
        })
    }
}

const modifyAuteur = async function(request, response){
    try{
        const id = request.params.id
        const {nom, nationalite} = request.body
        const modifiyingAuteur = await modifierAuteur(id, nom, nationalite)

        if(!modifiyingAuteur){
            return response.status(404).json({
                message: `L'auteur avec l'id ${id} à modifier, n'existe pas`
            })
        }

        response.json({
            message: "Auteur modifié avec succès !",
            data: modifiyingAuteur
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur survenue lors de la modification de l'auteur"
        })
    }
}

const deleteAuteur = async function(request, response){
    try{
        const id = request.params.id
        const deletingAuteur = await supprimerAuteur(id)

        if(!deletingAuteur){
            return response.status(404).json({
                message: `L'auteur avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'auteur supprimé avec succès',
            data: deletingAuteur
        })
    }
    catch(error){
        if(error.code === '23503'){
            return response.status(409).json({
                message: "Impossible de supprimer cet auteur : des livres lui sont associés"
            })
        }
        response.status(500).json({
            message: "Erreur de suppression de l'auteur"
        })
    }
}

export {
    getAllAuteurs,
    getAuteursById,
    createAuteur,
    modifyAuteur,
    deleteAuteur
}