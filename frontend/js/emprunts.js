const API_URL = window.location.hostname === 'localhost' 
? 'http://localhost:3000' 
: 'https://bibliotheque-s14s15.onrender.com';

async function chargerEmprunts(){
    try{
        const response = await fetch(`${API_URL}/emprunts`)
        const resultat = await response.json()

        const tableEmprunts = document.querySelector('#tableEmprunts')
        tableEmprunts.innerHTML = ''
        resultat.data.forEach(function(emprunt){
            tableEmprunts.innerHTML +=`
            <tr>
                <td>${emprunt.id_emprunt}</td>
                <td>${emprunt.livre_titre}</td>
                <td>${emprunt.adherent_nom}</td>
                <td>${new Date(emprunt.date_emprunt).toLocaleDateString('fr-FR')}</td>
                <td>${new Date(emprunt.date_retour_prevue).toLocaleDateString('fr-FR')}</td>
                <td>
                    <button>Modifier</button>
                    <button>Supprimer</button>
                </td>
            </tr>
            `
        })
    }
    catch(error){
        console.error(error)
    }
}

chargerEmprunts()