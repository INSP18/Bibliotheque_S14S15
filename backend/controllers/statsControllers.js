import statsBibliotheque from "../models/statistiquesModel.js"
const getStats = async function(request, response){
    try{
        const biblioStats = await statsBibliotheque()
        response.json({
        message:"Statistiques récupérées avec succès !",
        data: biblioStats
        })
    }
    catch(error){
        response.json({
            message:"Erreur de récupération des statistiques"
        })
    }
}

export default getStats