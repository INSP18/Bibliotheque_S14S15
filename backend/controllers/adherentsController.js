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
            data:adherents
        })
    }
    catch(error){
        response.json({
            message:'Erreur lors de la récupération des auteurs'
        })
    }
}

const getAdherentsById = async function(request, response){
    try{
        const id = await request.params.id
        const adherent = await listeAdherent(id)

        if(!adherent){
            return response.json({
                message:`L'adhérent avec l'id ${id} recherché n'existe pas`,
                data: adherent
            })
        }
    }
    catch(error){
        response.json({
            mesage:'Erreur lors de la récupérartion de données auteurs'
        })
    }
}

const createAdherent = async function(request, response){
    try{
        const {nom, contact} = request.body
        const newAdherent = await creerAdherent(nom, contact)
        response.json({
            message: "adhérent créer avec succès",
            data:newAdherent
        })
    }
    catch(error){
        return response.json({
            message:'Erreur de récupération de données'
        })
    }
}

const modifyAdherent = async function(request, response){
    try{
        const id = await request.params.id
        const {nom, contact} = request.body
        const modifiyingAdherent = await modifierAdherent(id, nom, contact)

        if(!modifiyingAdherent){
            return response.json({
                message:`L'adhérent avec l'id ${id} à modifier, n'existe pas`,
                data: modifiyingAdherent
            })
        }
    }
    catch(error){
        response.json({
            message:"Erreur survenue lors de la modification de l'adhérent"
        })
    }
}

const deleteAdherent = async function(request, response){
    try{
        const id = await request.params.id
        const deletingAdherent = await supprimerAdherent(id)

        if(!deletingAdherent){
            return response.json({
                message:`L'adhérent avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'adhérent supprimé avec succès',
            data: deletingAdherent
        })
    }
    catch(error){

    }
}

export {
    getAllAdherents,
    getAdherentsById,
    createAdherent,
    modifyAdherent,
    deleteAdherent
}