const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3000': 'https://bibliotheque-s14s15.onrender.com';

const tbody = document.querySelector('#tableAdherents')
const formulaire = document.querySelector('#adherent-form')
const idInput = document.querySelector('#adherent-id')
const nomInput = document.querySelector('#adherent-nom')
const contactInput = document.querySelector('#adherent-contact')

async function chargerAdherents() {
    try {
        const response = await fetch(`${API_URL}/api/adherents`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        tbody.innerHTML = ''

        resultat.data.forEach(function(adherent) {
            tbody.innerHTML += `
                <tr>
                    <td>${adherent.id}</td>
                    <td>${adherent.nom}</td>
                    <td>${adherent.contact}</td>
                    <td class="action-cell">
                        <button type="button" class="btn-secondary" onclick="modifierAdherent(${adherent.id})">Modifier</button>
                        <button type="button" class="btn-danger" onclick="supprimerAdherent(${adherent.id})">Supprimer</button>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Erreur adhérents :', error)
    }
}

async function modifierAdherent(id) {
    try {
        const response = await fetch(`${API_URL}/api/adherents/${id}`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const adherent = resultat.data

        idInput.value = adherent.id
        nomInput.value = adherent.nom
        contactInput.value = adherent.contact
    } catch (error) {
        console.error('Erreur récupération adhérent :', error)
    }
}

formulaire.addEventListener('submit', async function(event) {
    event.preventDefault()

    const id = idInput.value
    const donnees = {
        nom: nomInput.value,
        contact: contactInput.value
    }

    try {
        const response = await fetch(
            id ? `${API_URL}/api/adherents/${id}` : `${API_URL}/api/adherents`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(donnees)
            }
        )

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        formulaire.reset()
        idInput.value = ''
        await chargerAdherents()
    } catch (error) {
        console.error('Erreur enregistrement adhérent :', error)
    }
})

async function supprimerAdherent(id) {
    if (!confirm('Voulez-vous supprimer cet adhérent ?')) return

    try {
        const response = await fetch(`${API_URL}/api/adherents/${id}`, { method: 'DELETE' })
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        await chargerAdherents()
    } catch (error) {
        console.error('Erreur suppression adhérent :', error)
    }
}

chargerAdherents()
