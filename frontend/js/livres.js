const API_URL = 'http://localhost:3000/api'

const tbody = document.querySelector('#tableLivres')
const formulaire = document.querySelector('#livre-form')
const idInput = document.querySelector('#livre-id')
const titreInput = document.querySelector('#livre-titre')
const statutInput = document.querySelector('#livre-statut')
const anneeInput = document.querySelector('#livre-annee')

async function chargerLivres() {
    try {
        const response = await fetch(`${API_URL}/livres`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        tbody.innerHTML = ''

        resultat.data.forEach(function(livre) {
            tbody.innerHTML += `
                <tr>
                    <td>${livre.id}</td>
                    <td>${livre.titre}</td>
                    <td>${livre.statut}</td>
                    <td>${livre.annee_publication}</td>
                    <td class="action-cell">
                        <button type="button" class="btn-secondary" onclick="modifierLivre(${livre.id})">Modifier</button>
                        <button type="button" class="btn-danger" onclick="supprimerLivre(${livre.id})">Supprimer</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Erreur livres :', error)
    }
}

async function modifierLivre(id) {
    try {
        const response = await fetch(`${API_URL}/livres/${id}`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const livre = resultat.data

        idInput.value = livre.id
        titreInput.value = livre.titre
        statutInput.value = livre.statut
        anneeInput.value = livre.annee_publication
    } catch (error) {
        console.error('Erreur récupération livre :', error)
    }
}

formulaire.addEventListener('submit', async function(event) {
    event.preventDefault()

    const id = idInput.value
    const donnees = {
        titre: titreInput.value,
        statut: statutInput.value,
        annee_publication: Number(anneeInput.value)
    }

    try {
        const response = await fetch(
            id ? `${API_URL}/livres/${id}` : `${API_URL}/livres`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donnees)
            }
        )

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        formulaire.reset()
        idInput.value = ''
        await chargerLivres()
    } catch (error) {
        console.error('Erreur enregistrement livre :', error)
    }
})

async function supprimerLivre(id) {
    if (!confirm('Voulez-vous supprimer ce livre ?')) return

    try {
        const response = await fetch(`${API_URL}/livres/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        await chargerLivres()
    } catch (error) {
        console.error('Erreur suppression livre :', error)
    }
}

chargerLivres()
