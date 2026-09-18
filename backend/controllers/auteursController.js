import { creerteAuteur, listeAuteur, listeAuteurs, modifierAuteur, supprimerAuteur } from '../models/auteursModel.js'

const getAllAuteurs = async function(request, response) {
    try{
        const auteurs = await listeAuteurs(request.query.tous === 'true')
        response.json({
            message: "liste des auteurs récupérée",
            data:auteurs
        })
    }
    catch(error)
    {
        response.json({
            message:'Erreur lors de la récupération des auteurs'
        })
    }
}

const getAuteursById = async function(request, response){
    try{
        const id = await request.params.id
        const auteur = await listeAuteur(id)

        if(!auteur){
            return response.json(`L'auteur avec l'id ${id} recherché n'existe pas`)
        }
        response.json({
            message: "liste de l'auteur récupérée",
            data:auteur
        })
    }
    catch(error){
        response.json({
            mesage:'Erreur lors de la récupérartion de données auteurs'
        })
    }
}

const createAuteur = async function(request, response){
    try{
        const {nom, nationalite} = request.body
        const newAuteur = await creerteAuteur(nom, nationalite)
        response.json(newAuteur)
    }
    catch(error){
        response.json({
            message:'Erreur de récupération de données'
        })
    }
}

const modifyAuteur = async function(request, response){
    try{
        const id = await request.params.id
        const {nom, nationalite} = request.body
        const modifiyingAuteur = await modifierAuteur(id, nom, nationalite)

        response.json({
            message: "Auteur modifié avec succès !",
            data: modifiyingAuteur
        })

        if(!modifiyingAuteur){
            return response.json({
                message:`L'auteur avec l'id ${id} à modifier, n'existe pas`,
            })
        }
    }
    catch(error){
        response.json({
            message:"Erreur survenue lors de la modification de l'auteur"
        })
    }
}

const deleteAuteur = async function(request, response){
    try{
        const id = await request.params.id
        const deletingAuteur = await supprimerAuteur(id)

        if(!deletingAuteur){
            return response.json({
                message:`L'auteur avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'auteur supprimé avec succès',
            data: deletingAuteur
        })
    }
    catch(error){
        response.json({
            message: "Erreur de suppression de données"
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
