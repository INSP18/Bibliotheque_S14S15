import { 
    getAllAuteurs, 
    getAuteur, 
    createAuteur as _createAuteur, 
    modifierAuteur as _modifierAuteur, 
    supprimerAuteur as _supprimerAuteur } from '../models/auteursModel.js'

const getAuteurs = async function(request, response) {
    try{
        const auteurs = await getAllAuteurs()
        response.json(auteurs)
    }
    catch(error)
    {
        response.json('Erreur lors de la récupération des auteurs')
    }
}

const getAuteursById = async function(request, response){
    try{
        const id = await request.params.id
        const auteur = await getAuteur(id)

        if(!auteur){
            return response.json(`L'auteur avec l'id ${id} recherché n'existe pas`)
        }
        response.json(auteur)
    }
    catch(error){
        response.json('Erreur lors de la récupérartion de données auteurs')
    }
}

const createAuteur = async function(request, response){
    try{
        const {nom, nationalite} = request.body
        const newAuteur = await _createAuteur(nom, nationalite)
        response.json(newAuteur)
    }
    catch(error){
        return response.json('Erreur de récupération de données')
    }
}

const modifierAuteur = async function(request, response){
    try{
        const id = await request.params.id
        const {nom, nationalite} = request.body
        const modifiyingAuteur = await _modifierAuteur(id, nom, nationalite)

        if(!modifiyingAuteur){
            return response.json(`L'auteur avec l'id ${id} à modifier, n'existe pas`)
        }
        response.json(modifiyingAuteur)
    }
    catch(error){
        response.json("Erreur survenue lors de la modification de l'auteur")
    }
}

const supprimerAuteur = async function(request, response){
    try{
        const id = await request.params.id
        const deletingAuteur = await _supprimerAuteur(id)

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

    }
}

export {
    getAuteurs,
    getAuteursById,
    createAuteur,
    modifierAuteur,
    supprimerAuteur
}