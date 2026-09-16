import { 
    getAllLivres, 
    getLivres, 
    createLivres, 
    modifierLivre, 
    supprimerLivre
} from '../models/livresModel.js'

const getAllLivre = async function(request, response) {
    try{
        const livres = await getAllLivres()
        response.json(livres)
    }
    catch(error)
    {
        response.json('Erreur lors de la récupération des livres')
    }
}

const getLivresById = async function(request, response){
    try{
        const id = await request.params.id
        const livre = await getLivres(id)

        if(!livre){
            return response.json(`Le livre avec l'id ${id} recherché n'existe pas`)
        }
        response.json(livre)
    }
    catch(error){
        response.json('Erreur lors de la récupérartion de données livres')
    }
}

const createLivre = async function(request, response){
    try{
        const {titre, annee_publication} = request.body
        const newLivre = await createLivres(titre, annee_publication)
        response.json(newLivre)
    }
    catch(error){
        return response.json('Erreur de récupération de données')
    }
}

const modifyLivre = async function(request, response){
    try{
        const id = await request.params.id
        const {titre, annee_publication} = request.body
        const modifiyingLivre= await modifierLivre(id, titre, annee_publication)

        if(!modifiyingLivre){
            return response.json(`Le livre avec l'id ${id} à modifier, n'existe pas`)
        }
        response.json(modifiyingLivre)
    }
    catch(error){
        response.json("Erreur survenue lors de la modification du livre")
    }
}

const deleteLivre = async function(request, response){
    try{
        const id = await request.params.id
        const deletingLivre = await supprimerLivre(id)

        if(!deletingLivre){
            return response.json({
                message:`Le livre avec l'id ${id} à supprimer, n'existe pas`
            })
        }
        response.json({
            message: 'livre supprimé avec succès',
            data: deletingAdherent
        })
    }
    catch(error){

    }
}

export {
    getAllLivre,
    getLivresById,
    createLivre,
    modifyLivre,
    deleteLivre
}