const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000' 
: 'https://bibliotheque-s14s15.onrender.com';

const tbody = document.querySelector('#tableAuteurs')
const formulaire = document.querySelector('#auteur-form')
const idInput = document.querySelector('#auteur-id')
const nomInput = document.querySelector('#auteur-nom')
const nationaliteInput = document.querySelector('#auteur-nationalite')

async function verifierReponse(response) {
    if (!response.ok) {
        const erreur = await response.json().catch(() => ({}))
        throw new Error(erreur.message || `Erreur HTTP : ${response.status}`)
    }
}

async function chargerAuteurs() {
    try {
        const response = await fetch(`${API_URL}/api/auteurs`)
        await verifierReponse(response)

        const resultat = await response.json()
        tbody.innerHTML = ''

        resultat.data.forEach(function(auteur) {
            tbody.innerHTML += `
                <tr>
                    <td>${auteur.identifiant}</td>
                    <td>${auteur.auteur}</td>
                    <td>${auteur.livre || '-'}</td>
                    <td>${auteur.nationalite}</td>
                    <td class="action-cell">
                        <button type="button" class="btn-secondary" onclick="modifierAuteur(${auteur.id})">Modifier</button>
                        <button type="button" class="btn-danger" onclick="supprimerAuteur(${auteur.id})">Supprimer</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Erreur auteurs :', error)
    }
}

async function modifierAuteur(id) {
    try {
        const response = await fetch(`${API_URL}/api/auteurs/${id}`)
        await verifierReponse(response)

        const resultat = await response.json()
        const auteur = resultat.data

        idInput.value = auteur.id
        nomInput.value = auteur.nom
        nationaliteInput.value = auteur.nationalite
    } catch (error) {
        console.error('Erreur récupération auteur :', error)
        alert(error.message)
    }
}

formulaire.addEventListener('submit', async function(event) {
    event.preventDefault()

    const id = idInput.value
    const donnees = {
        nom: nomInput.value,
        nationalite: nationaliteInput.value
    }

    try {
        const response = await fetch(
            id ? `${API_URL}/api/auteurs/${id}` : `${API_URL}/api/auteurs`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donnees)
            }
        )

        await verifierReponse(response)

        formulaire.reset()
        idInput.value = ''
        await chargerAuteurs()
    } catch (error) {
        console.error('Erreur enregistrement auteur :', error)
        alert(error.message)
    }
})

async function supprimerAuteur(id) {
    if (!confirm('Voulez-vous supprimer cet auteur ?')) return

    try {
        const response = await fetch(`${API_URL}/api/auteurs/${id}`, { method: 'DELETE' })
        await verifierReponse(response)

        await chargerAuteurs()
    } catch (error) {
        console.error('Erreur suppression auteur :', error)
        alert(error.message)
    }
}

chargerAuteurs()