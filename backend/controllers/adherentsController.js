import { 
    creerAdherent, 
    listeAdherent, 
    listeAdherents, 
    modifierAdherent, 
    supprimerAdherent 
} from '../models/adherentsModel.js'

const getAllAdherents = async function(request, response) {
    try{
        const adherents = await listeAdherents()
        response.json({
            message: "liste des adhérents récupérée",
            data: adherents
        })
    }
    catch(error){
        response.status(500).json({
            message: 'Erreur lors de la récupération des adhérents'
        })
    }
}

const getAdherentsById = async function(request, response){
    try{
        const id = request.params.id
        const adherent = await listeAdherent(id)

        if(!adherent){
            return response.status(404).json({
                message: `L'adhérent avec l'id ${id} recherché n'existe pas`
            })
        }
        response.json({
            message: "adhérent récupéré",
            data: adherent
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur lors de la récupération de l'adhérent"
        })
    }
}

const createAdherent = async function(request, response){
    try{
        const {nom, contact} = request.body

        if(!nom){
            return response.status(400).json({
                message: "Le nom de l'adhérent est obligatoire"
            })
        }

        const newAdherent = await creerAdherent(nom, contact)
        response.status(201).json({
            message: "adhérent créé avec succès",
            data: newAdherent
        })
    }
    catch(error){
        response.status(400).json({
            message: "Erreur lors de la création de l'adhérent"
        })
    }
}

const modifyAdherent = async function(request, response){
    try{
        const id = request.params.id
        const {nom, contact} = request.body
        const modifiyingAdherent = await modifierAdherent(id, nom, contact)

        if(!modifiyingAdherent){
            return response.status(404).json({
                message: `L'adhérent avec l'id ${id} à modifier, n'existe pas`
            })
        }
        response.json({
            message: 'adhérent modifié avec succès',
            data: modifiyingAdherent
        })
    }
    catch(error){
        response.status(500).json({
            message: "Erreur survenue lors de la modification de l'adhérent"
        })
    }
}

const deleteAdherent = async function(request, response){
    try{
        const id = request.params.id
        const deletingAdherent = await supprimerAdherent(id)

        if(!deletingAdherent){
            return response.status(404).json({
                message: `L'adhérent avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'adhérent supprimé avec succès',
            data: deletingAdherent
        })
    }
    catch(error){
        if(error.code === '23503'){
            return response.status(409).json({
                message: "Impossible de supprimer cet adhérent : il possède un historique d'emprunts"
            })
        }
        response.status(500).json({
            message: "Erreur de suppression de l'adhérent"
        })
    }
}

export {
    getAllAdherents,
    getAdherentsById,
    createAdherent,
    modifyAdherent,
    deleteAdherent
}