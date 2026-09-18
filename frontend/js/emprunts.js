const API_URL = window.location.hostname === 'localhost' 
? 'http://localhost:3000' 
: 'https://bibliotheque-s14s15.onrender.com';

const formulaireEmprunt = document.querySelector('#emprunt-form')
const livreInput = document.querySelector('#emprunt-livre')
const adherentInput = document.querySelector('#emprunt-adherent')
const retourForm = document.querySelector('#retour-form')
const tableEmprunts = document.querySelector('#tableEmprunts')
const boutonTous = document.querySelector('#btn-tous')
const boutonEnCours = document.querySelector('#btn-en-cours')
const boutonEnRetard = document.querySelector('#btn-en-retard')

function formaterDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR')
}

async function chargerOptionsEmprunt() {
    try {
        const [reponseLivres, reponseAdherents] = await Promise.all([
            fetch(`${API_URL}/api/livres`),
            fetch(`${API_URL}/api/adherents`)
        ])

        if (!reponseLivres.ok || !reponseAdherents.ok) {
            throw new Error('Impossible de récupérer les données du formulaire')
        }

        const [livres, adherents] = await Promise.all([
            reponseLivres.json(),
            reponseAdherents.json()
        ])

        livreInput.innerHTML = '<option value="">Sélectionner un livre</option>'
        livres.data
            .filter(livre => livre.statut === 'disponible')
            .forEach(livre => {
                livreInput.innerHTML += `<option value="${livre.id}">${livre.titre} (${livre.annee_publication})</option>`
            })

        adherentInput.innerHTML = '<option value="">Sélectionner un adhérent</option>'
        adherents.data.forEach(adherent => {
            const contact = adherent.contact ? ` — ${adherent.contact}` : ''
            adherentInput.innerHTML += `<option value="${adherent.id}">${adherent.nom}${contact}</option>`
        })
    } catch (error) {
        livreInput.innerHTML = '<option value="">Livres indisponibles</option>'
        adherentInput.innerHTML = '<option value="">Adhérents indisponibles</option>'
        console.error('Erreur chargement formulaire emprunt :', error)
    }
}

async function chargerEmprunts(filtre = 'tous') {
    try {
        const filtres = {
            tous: `${API_URL}/api/emprunts`,
            'en-cours': `${API_URL}/api/emprunts/en-cours`,
            'en-retard': `${API_URL}/api/emprunts/en-retard`
        }

        const response = await fetch(filtres[filtre] || filtres.tous)
        const resultat = await response.json()

        if (!response.ok) {
            throw new Error(resultat.message || 'Impossible de charger la liste des emprunts')
        }

        tableEmprunts.innerHTML = ''

        if (!Array.isArray(resultat.data) || resultat.data.length === 0) {
            tableEmprunts.innerHTML = '<tr><td colspan="6">Aucun emprunt trouvé.</td></tr>'
            return
        }

        resultat.data.forEach(function(emprunt) {
            const id = emprunt.id_emprunt ?? emprunt.id
            const livre = emprunt.livre_titre ?? emprunt.titre_livre
            const adherent = emprunt.adherent_nom ?? emprunt.nom_adherent
            const dateEmprunt = formaterDate(emprunt.date_emprunt)
            const dateRetour = formaterDate(emprunt.date_retour_prevue)

            tableEmprunts.innerHTML += `
                <tr>
                    <td>${id}</td>
                    <td>${livre}</td>
                    <td>${adherent}</td>
                    <td>${dateEmprunt}</td>
                    <td>${dateRetour}</td>
                    <td>
                        <button type="button" class="btn-secondary btn-retour" data-id="${id}">Retourner</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        tableEmprunts.innerHTML = '<tr><td colspan="6">Erreur lors du chargement des emprunts.</td></tr>'
        console.error('Erreur chargement emprunts :', error)
    }
}

async function retournerEmprunt(idEmprunt) {
    try {
        const response = await fetch(`${API_URL}/api/emprunts/${idEmprunt}/retour`, {
            method: 'PATCH'
        })

        const resultat = await response.json()
        if (!response.ok) throw new Error(resultat.message || 'Impossible d\'enregistrer le retour')

        alert(resultat.message || 'Retour enregistré avec succès !')
        await Promise.all([chargerEmprunts(), chargerOptionsEmprunt()])
    } catch (error) {
        console.error('Erreur retour emprunt :', error)
        alert(error.message || 'Impossible d\'enregistrer le retour')
    }
}

chargerEmprunts()
chargerOptionsEmprunt()

if (boutonTous) {
    boutonTous.addEventListener('click', () => chargerEmprunts('tous'))
}

if (boutonEnCours) {
    boutonEnCours.addEventListener('click', () => chargerEmprunts('en-cours'))
}

if (boutonEnRetard) {
    boutonEnRetard.addEventListener('click', () => chargerEmprunts('en-retard'))
}

tableEmprunts.addEventListener('click', async function(event) {
    const boutonRetour = event.target.closest('.btn-retour')
    if (!boutonRetour) return

    const idEmprunt = Number(boutonRetour.dataset.id)
    if (!idEmprunt) return

    await retournerEmprunt(idEmprunt)
})

formulaireEmprunt.addEventListener('submit', async function(event) {
    event.preventDefault()

    try {
        const response = await fetch(`${API_URL}/api/emprunts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_livre: Number(livreInput.value),
                id_adherent: Number(adherentInput.value)
            })
        })
        const resultat = await response.json()

        if (!response.ok) throw new Error(resultat.message)

        formulaireEmprunt.reset()
        await Promise.all([chargerEmprunts(), chargerOptionsEmprunt()])
    } catch (error) {
        console.error('Erreur création emprunt :', error)
        alert(error.message || "Impossible de créer l'emprunt")
    }
})

if (retourForm) {
    retourForm.addEventListener('submit', async function(event) {
        event.preventDefault()

        const idEmprunt = Number(document.querySelector('#retour-emprunt').value)
        if (!idEmprunt) {
            alert('Veuillez saisir un identifiant d\'emprunt valide.')
            return
        }

        await retournerEmprunt(idEmprunt)
        retourForm.reset()
    })
}
