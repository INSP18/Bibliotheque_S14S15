let adherents = []

const tableAdherents = $('#tableAdherents')
const champRecherche = $('#recherche')
const fenetre = $('#modal')
const formulaireAdherent = $('#adherent-form')
const idInput = $('#adherent-id')
const nomInput = $('#adherent-nom')
const contactInput = $('#adherent-contact')
const titreFenetre = $('#modal-title')

function afficherAdherents() {
    const recherche = champRecherche.value.trim().toLowerCase()

    const liste = adherents.filter((adherent) =>
        !recherche || `${adherent.nom} ${adherent.contact || ''}`.toLowerCase().includes(recherche)
    )

    if (!liste.length) {
        tableAdherents.innerHTML = ligneVide(4, 'Aucun adhérent trouvé.')
        return
    }

    tableAdherents.innerHTML = liste.map((adherent) => `
        <tr>
            <td>#${esc(adherent.id)}</td>
            <td class="strong">${esc(adherent.nom)}</td>
            <td>${esc(adherent.contact || '—')}</td>
            <td class="actions">
                <button type="button" class="btn btn-ghost btn-sm" data-action="modifier" data-id="${adherent.id}">Modifier</button>
                <button type="button" class="btn btn-danger-ghost btn-sm" data-action="supprimer" data-id="${adherent.id}">Supprimer</button>
            </td>
        </tr>
    `).join('')
}

async function charger() {
    try {
        adherents = await api('/api/adherents')
        afficherAdherents()
    } catch (erreur) {
        tableAdherents.innerHTML = ligneVide(4, erreur.message)
        toast(erreur.message, 'error')
    }
}

function ouvrirFenetre(adherent = null) {
    formulaireAdherent.reset()
    idInput.value = adherent ? adherent.id : ''
    titreFenetre.textContent = adherent ? "Modifier l'adhérent" : 'Nouvel adhérent'

    if (adherent) {
        nomInput.value = adherent.nom
        contactInput.value = adherent.contact || ''
    }
    fenetre.showModal()
    nomInput.focus()
}

$('#btn-nouveau').addEventListener('click', () => ouvrirFenetre())
champRecherche.addEventListener('input', afficherAdherents)

tableAdherents.addEventListener('click', async (event) => {
    const bouton = event.target.closest('button[data-action]')
    if (!bouton) return

    const id = Number(bouton.dataset.id)
    const adherent = adherents.find((element) => element.id === id)

    if (bouton.dataset.action === 'modifier') {
        ouvrirFenetre(adherent)
        return
    }

    if (!confirm(`Supprimer l'adhérent « ${adherent.nom} » ?`)) return
    try {
        await api(`/api/adherents/${id}`, { method: 'DELETE' })
        toast('Adhérent supprimé')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

formulaireAdherent.addEventListener('submit', async (event) => {
    event.preventDefault()

    const id = idInput.value
    const corps = {
        nom: nomInput.value.trim(),
        contact: contactInput.value.trim() || null
    }

    try {
        await api(id ? `/api/adherents/${id}` : '/api/adherents', {
            method: id ? 'PUT' : 'POST',
            body: corps
        })
        fenetre.close()
        toast(id ? 'Adhérent modifié' : 'Adhérent ajouté')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

charger()