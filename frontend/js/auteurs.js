const API_URL = 'http://localhost:3000/api'

const tbody = document.querySelector('#tableAuteurs')
const formulaire = document.querySelector('#auteur-form')
const idInput = document.querySelector('#auteur-id')
const nomInput = document.querySelector('#auteur-nom')
const nationaliteInput = document.querySelector('#auteur-nationalite')

async function chargerAuteurs() {
    try {
        const response = await fetch(`${API_URL}/auteurs`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        tbody.innerHTML = ''

        resultat.data.forEach(function(auteur) {
            tbody.innerHTML += `
                <tr>
                    <td>${auteur.identifiant}</td>
                    <td>${auteur.auteur}</td>
                    <td>${auteur.livre}</td>
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
        const response = await fetch(`${API_URL}/auteurs/${id}`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const auteur = resultat.data

        idInput.value = auteur.id
        nomInput.value = auteur.nom
        nationaliteInput.value = auteur.nationalite
    } catch (error) {
        console.error('Erreur récupération auteur :', error)
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
            id ? `${API_URL}/auteurs/${id}` : `${API_URL}/auteurs`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donnees)
            }
        )

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        formulaire.reset()
        idInput.value = ''
        await chargerAuteurs()
    } catch (error) {
        console.error('Erreur enregistrement auteur :', error)
    }
})

async function supprimerAuteur(id) {
    if (!confirm('Voulez-vous supprimer cet auteur ?')) return

    try {
        const response = await fetch(`${API_URL}/auteurs/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        await chargerAuteurs()
    } catch (error) {
        console.error('Erreur suppression auteur :', error)
    }
}

chargerAuteurs()
