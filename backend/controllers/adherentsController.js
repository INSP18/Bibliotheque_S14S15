const Adherents = require('../models/adherentsModel')

const getAdherent = async function(request, response) {
    try{
        const adherents = await Adherents.getAllAdherents()
        response.json(adherents)
    }
    catch(error)
    {
        response.json('Erreur lors de la récupération des auteurs')
    }
}

const getAdherentsById = async function(request, response){
    try{
        const id = await request.params.id
        const adherent = await Adherents.getAdherent()

        if(!adherent){
            return response.json(`L'adhérent avec l'id ${id} recherché n'existe pas`)
        }
        response.json(adherent)
    }
    catch(error){
        response.json('Erreur lors de la récupérartion de données auteurs')
    }
}

const createAdherent = async function(request, response){
    try{
        const {nom, contact} = request.body
        const newAdherent = await Adherents.createAdherent(nom, contact)
        response.json(newAdherent)
    }
    catch(error){
        return response.json('Erreur de récupération de données')
    }
}

const modifierAdherent = async function(request, response){
    try{
        const id = await request.params.id
        const {nom, contact} = request.body
        const modifiyingAdherent = await Adherents.modifierAdherent(id, nom, contact)

        if(!modifiyingAdherent){
            return response.json(`L'adhérent avec l'id ${id} à modifier, n'existe pas`)
        }
        response.json(modifiyingAdherent)
    }
    catch(error){
        response.json("Erreur survenue lors de la modification de l'adhérent")
    }
}

const supprimerAdherent = async function(request, response){
    try{
        const id = await request.params.id
        const deletingAdherent = await Adherents.supprimerAdherent(id)

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

module.exports = {
    getAdherent,
    getAdherentsById,
    createAdherent,
    modifierAdherent,
    supprimerAdherent
}