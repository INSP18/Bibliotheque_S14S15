let auteurs = []

const tableAuteurs = $('#tableAuteurs')
const champRecherche = $('#recherche')
const fenetre = $('#modal')
const formulaireAuteur = $('#auteur-form')
const idInput = $('#auteur-id')
const nomInput = $('#auteur-nom')
const nationaliteInput = $('#auteur-nationalite')
const titreFenetre = $('#modal-title')

function afficherAuteurs() {
    const recherche = champRecherche.value.trim().toLowerCase()

    const liste = auteurs.filter((auteur) =>
        !recherche || `${auteur.auteur} ${auteur.nationalite}`.toLowerCase().includes(recherche)
    )

    if (!liste.length) {
        tableAuteurs.innerHTML = ligneVide(5, 'Aucun auteur trouvé.')
        return
    }

    tableAuteurs.innerHTML = liste.map((auteur) => `
        <tr>
            <td>#${esc(auteur.id)}</td>
            <td class="strong">${esc(auteur.auteur)}</td>
            <td>${esc(auteur.nationalite)}</td>
            <td>${esc(auteur.livre || '—')}</td>
            <td class="actions">
                <button type="button" class="btn btn-ghost btn-sm" data-action="modifier" data-id="${auteur.id}">Modifier</button>
                <button type="button" class="btn btn-danger-ghost btn-sm" data-action="supprimer" data-id="${auteur.id}">Supprimer</button>
            </td>
        </tr>
    `).join('')
}

async function charger() {
    try {
        auteurs = await api('/api/auteurs')
        afficherAuteurs()
    } catch (erreur) {
        tableAuteurs.innerHTML = ligneVide(5, erreur.message)
        toast(erreur.message, 'error')
    }
}

function ouvrirFenetre(auteur = null) {
    formulaireAuteur.reset()
    idInput.value = auteur ? auteur.id : ''
    titreFenetre.textContent = auteur ? "Modifier l'auteur" : 'Nouvel auteur'

    if (auteur) {
        nomInput.value = auteur.auteur
        nationaliteInput.value = auteur.nationalite
    }
    fenetre.showModal()
    nomInput.focus()
}

$('#btn-nouveau').addEventListener('click', () => ouvrirFenetre())
champRecherche.addEventListener('input', afficherAuteurs)

tableAuteurs.addEventListener('click', async (event) => {
    const bouton = event.target.closest('button[data-action]')
    if (!bouton) return

    const id = Number(bouton.dataset.id)
    const auteur = auteurs.find((element) => element.id === id)

    if (bouton.dataset.action === 'modifier') {
        ouvrirFenetre(auteur)
        return
    }

    if (!confirm(`Supprimer l'auteur « ${auteur.auteur} » ?`)) return
    try {
        await api(`/api/auteurs/${id}`, { method: 'DELETE' })
        toast('Auteur supprimé')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

formulaireAuteur.addEventListener('submit', async (event) => {
    event.preventDefault()

    const id = idInput.value
    const corps = {
        nom: nomInput.value.trim(),
        nationalite: nationaliteInput.value.trim()
    }

    try {
        await api(id ? `/api/auteurs/${id}` : '/api/auteurs', {
            method: id ? 'PUT' : 'POST',
            body: corps
        })
        fenetre.close()
        toast(id ? 'Auteur modifié' : 'Auteur ajouté')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

charger()