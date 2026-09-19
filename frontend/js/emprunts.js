let emprunts = []
let filtreActif = 'tous'

const formulaireEmprunt = $('#emprunt-form')
const livreSelect = $('#emprunt-livre')
const adherentSelect = $('#emprunt-adherent')
const tableEmprunts = $('#tableEmprunts')

const STATUTS = {
    en_cours: { texte: 'En cours', classe: 'badge-info' },
    en_retard: { texte: 'En retard', classe: 'badge-danger' },
    rendu: { texte: 'Rendu', classe: 'badge-ok' }
}

async function chargerFormulaire() {
    try {
        const [livres, adherents] = await Promise.all([
            api('/api/livres'),
            api('/api/adherents')
        ])

        const disponibles = livres.filter((livre) => livre.statut === 'disponible')

        livreSelect.innerHTML = '<option value="">Choisir un livre</option>' + disponibles.map((livre) =>
            `<option value="${livre.id}">${esc(livre.titre)}${livre.auteur ? ' — ' + esc(livre.auteur) : ''}</option>`
        ).join('')

        adherentSelect.innerHTML = '<option value="">Choisir un adhérent</option>' + adherents.map((adherent) =>
            `<option value="${adherent.id}">${esc(adherent.nom)}</option>`
        ).join('')

        if (!disponibles.length) {
            livreSelect.innerHTML = '<option value="">Aucun livre disponible</option>'
        }
    } catch (erreur) {
        livreSelect.innerHTML = '<option value="">Livres indisponibles</option>'
        adherentSelect.innerHTML = '<option value="">Adhérents indisponibles</option>'
        toast(erreur.message, 'error')
    }
}

function afficherEmprunts() {
    const liste = emprunts.filter((emprunt) => filtreActif === 'tous' || emprunt.statut === filtreActif)

    if (!liste.length) {
        tableEmprunts.innerHTML = ligneVide(8, 'Aucun emprunt dans cette catégorie.')
        return
    }

    tableEmprunts.innerHTML = liste.map((emprunt) => {
        const statut = STATUTS[emprunt.statut]
        const action = emprunt.statut === 'rendu'
            ? ''
            : `<button type="button" class="btn btn-ghost btn-sm" data-id="${emprunt.id_emprunt}">Retourner</button>`

        return `
            <tr>
                <td>#${esc(emprunt.id_emprunt)}</td>
                <td class="strong">${esc(emprunt.titre_livre)}</td>
                <td>${esc(emprunt.nom_adherent)}</td>
                <td>${fmtDate(emprunt.date_emprunt)}</td>
                <td>${fmtDate(emprunt.date_retour_prevue)}</td>
                <td>${fmtDate(emprunt.date_retour)}</td>
                <td><span class="badge ${statut.classe}">${statut.texte}</span></td>
                <td class="actions">${action}</td>
            </tr>
        `
    }).join('')
}

async function chargerEmprunts() {
    try {
        emprunts = await api('/api/emprunts')
        afficherEmprunts()
    } catch (erreur) {
        tableEmprunts.innerHTML = ligneVide(8, erreur.message)
        toast(erreur.message, 'error')
    }
}

async function toutRecharger() {
    await Promise.all([chargerEmprunts(), chargerFormulaire()])
}

/* Onglets de filtre */
document.querySelector('.tabs').addEventListener('click', (event) => {
    const onglet = event.target.closest('.tab')
    if (!onglet) return

    filtreActif = onglet.dataset.filtre
    $$('.tab').forEach((element) => element.classList.toggle('active', element === onglet))
    afficherEmprunts()
})

/* Retour d'un livre */
tableEmprunts.addEventListener('click', async (event) => {
    const bouton = event.target.closest('button[data-id]')
    if (!bouton) return

    bouton.disabled = true
    try {
        await api(`/api/emprunts/${bouton.dataset.id}/retour`, { method: 'PATCH' })
        toast('Retour enregistré')
        await toutRecharger()
    } catch (erreur) {
        bouton.disabled = false
        toast(erreur.message, 'error')
    }
})

/* Nouvel emprunt */
formulaireEmprunt.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (!livreSelect.value || !adherentSelect.value) {
        toast('Choisissez un livre et un adhérent', 'error')
        return
    }

    try {
        await api('/api/emprunts', {
            method: 'POST',
            body: {
                id_livre: Number(livreSelect.value),
                id_adherent: Number(adherentSelect.value)
            }
        })
        formulaireEmprunt.reset()
        toast('Emprunt enregistré')
        await toutRecharger()
    } catch (erreur) {
        toast(erreur.message, 'error')
    }
})

toutRecharger()