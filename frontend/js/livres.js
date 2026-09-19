let livres = []
let auteurs = []

const tableLivres = $('#tableLivres')
const champRecherche = $('#recherche')
const filtreStatut = $('#filtre-statut')
const fenetre = $('#modal')
const formulaireLivre = $('#livre-form')
const idInput = $('#livre-id')
const titreInput = $('#livre-titre')
const auteurSelect = $('#livre-auteur')
const anneeInput = $('#livre-annee')
const titreFenetre = $('#modal-title')

function afficherLivres() {
    const recherche = champRecherche.value.trim().toLowerCase()
    const statut = filtreStatut.value

    const liste = livres.filter((livre) => {
        const texte = `${livre.titre} ${livre.auteur || ''}`.toLowerCase()
        return (!statut || livre.statut === statut) && (!recherche || texte.includes(recherche))
    })

    if (!liste.length) {
        tableLivres.innerHTML = ligneVide(6, 'Aucun livre trouvé.')
        return
    }

    tableLivres.innerHTML = liste.map((livre) => {
        const badge = livre.statut === 'disponible'
            ? '<span class="badge badge-ok">Disponible</span>'
            : '<span class="badge badge-warn">Emprunté</span>'

        return `
            <tr>
                <td>#${esc(livre.id)}</td>
                <td class="strong">${esc(livre.titre)}</td>
                <td>${esc(livre.auteur || '—')}</td>
                <td>${esc(livre.annee_publication)}</td>
                <td>${badge}</td>
                <td class="actions">
                    <button type="button" class="btn btn-ghost btn-sm" data-action="modifier" data-id="${livre.id}">Modifier</button>
                    <button type="button" class="btn btn-danger-ghost btn-sm" data-action="supprimer" data-id="${livre.id}">Supprimer</button>
                </td>
            </tr>
        `
    }).join('')
}

function remplirAuteurs() {
    auteurSelect.innerHTML = '<option value="">Aucun auteur</option>' + auteurs.map((auteur) =>
        `<option value="${auteur.identifiant}">${esc(auteur.auteur)}</option>`
    ).join('')
}

async function charger() {
    try {
        const [listeLivres, listeAuteurs] = await Promise.all([
            api('/api/livres'),
            api('/api/auteurs?tous=true')
        ])
        livres = listeLivres
        auteurs = listeAuteurs
        remplirAuteurs()
        afficherLivres()
    } catch (erreur) {
        tableLivres.innerHTML = ligneVide(6, erreur.message)
        toast(erreur.message, 'error')
    }
}

function ouvrirFenetre(livre = null) {
    formulaireLivre.reset()
    idInput.value = livre ? livre.id : ''
    titreFenetre.textContent = livre ? 'Modifier le livre' : 'Nouveau livre'

    if (livre) {
        titreInput.value = livre.titre
        auteurSelect.value = livre.id_auteur ?? ''
        anneeInput.value = livre.annee_publication
    }
    fenetre.showModal()
    titreInput.focus()
}

$('#btn-nouveau').addEventListener('click', () => ouvrirFenetre())
champRecherche.addEventListener('input', afficherLivres)
filtreStatut.addEventListener('change', afficherLivres)

tableLivres.addEventListener('click', async (event) => {
    const bouton = event.target.closest('button[data-action]')
    if (!bouton) return

    const id = Number(bouton.dataset.id)
    const livre = livres.find((element) => element.id === id)

    if (bouton.dataset.action === 'modifier') {
        ouvrirFenetre(livre)
        return
    }

    if (!confirm(`Supprimer le livre « ${livre.titre} » ?`)) return
    try {
        await api(`/api/livres/${id}`, { method: 'DELETE' })
        toast('Livre supprimé')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

formulaireLivre.addEventListener('submit', async (event) => {
    event.preventDefault()

    const id = idInput.value
    const corps = {
        titre: titreInput.value.trim(),
        id_auteur: auteurSelect.value ? Number(auteurSelect.value) : null,
        annee_publication: Number(anneeInput.value)
    }

    try {
        await api(id ? `/api/livres/${id}` : '/api/livres', {
            method: id ? 'PUT' : 'POST',
            body: corps
        })
        fenetre.close()
        toast(id ? 'Livre modifié' : 'Livre ajouté')
        await charger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

charger()