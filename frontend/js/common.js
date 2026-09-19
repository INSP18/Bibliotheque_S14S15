const API_URL = (
    window.location.protocol === 'file:' ||
    ['localhost', '127.0.0.1'].includes(window.location.hostname)
)
    ? 'http://localhost:3000'
    : 'https://bibliotheque-s14s15.onrender.com'

const $ = (selecteur, racine = document) => racine.querySelector(selecteur)
const $$ = (selecteur, racine = document) => [...racine.querySelectorAll(selecteur)]

/* Appel à l'API : renvoie directement "data" ou lève une erreur lisible */
async function api(chemin, options = {}) {
    const config = { method: options.method || 'GET', headers: {} }

    if (options.body !== undefined) {
        config.headers['Content-Type'] = 'application/json'
        config.body = JSON.stringify(options.body)
    }

    let reponse
    try {
        reponse = await fetch(`${API_URL}${chemin}`, config)
    } catch (erreur) {
        throw new Error("Impossible de contacter le serveur. Vérifiez qu'il est démarré.")
    }

    const contenu = await reponse.json().catch(() => ({}))
    if (!reponse.ok) {
        throw new Error(contenu.message || `Erreur HTTP ${reponse.status}`)
    }
    return contenu.data
}

/* Protège l'affichage contre le HTML injecté dans les données */
function esc(valeur) {
    return String(valeur ?? '').replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]))
}

/* Les dates arrivent au format AAAA-MM-JJ */
function fmtDate(date) {
    if (!date) return '—'
    const [annee, mois, jour] = String(date).slice(0, 10).split('-')
    return `${jour}/${mois}/${annee}`
}

function joursRetard(datePrevue) {
    const [annee, mois, jour] = String(datePrevue).slice(0, 10).split('-').map(Number)
    const aujourdhui = new Date()
    aujourdhui.setHours(0, 0, 0, 0)
    const difference = Math.round((aujourdhui - new Date(annee, mois - 1, jour)) / 86400000)
    return Math.max(difference, 1)
}

function ligneVide(colonnes, message) {
    return `<tr><td colspan="${colonnes}" class="empty">${esc(message)}</td></tr>`
}

function toast(message, type = 'success') {
    const conteneur = $('#toasts')
    const element = document.createElement('div')
    element.className = `toast ${type}`
    element.textContent = message
    conteneur.appendChild(element)
    setTimeout(() => element.remove(), 3500)
}

/* ---------- Menu latéral ---------- */
const PAGES = [
    { id: 'index', lien: 'index.html', nom: 'Tableau de bord' },
    { id: 'livres', lien: 'livres.html', nom: 'Livres' },
    { id: 'auteurs', lien: 'auteurs.html', nom: 'Auteurs' },
    { id: 'adherents', lien: 'adherents.html', nom: 'Adhérents' },
    { id: 'emprunts', lien: 'emprunts.html', nom: 'Emprunts' }
]

function construireMenu() {
    const pageActive = document.body.dataset.page
    const liens = PAGES.map((page) => `
        <a href="${page.lien}" class="${page.id === pageActive ? 'active' : ''}">${page.nom}</a>
    `).join('')

    $('#sidebar').innerHTML = `
        <header class="brand">
            <strong>Bibliothèque</strong>
            <span>Gestion des prêts</span>
        </header>
        <nav class="nav" aria-label="Navigation principale">${liens}</nav>
        <footer class="sidebar-foot">Projet S14 · S15</footer>
    `

    const menu = $('#sidebar')
    const fond = $('#backdrop')
    const basculer = (ouvert) => {
        menu.classList.toggle('open', ouvert)
        fond.classList.toggle('show', ouvert)
    }

    $('#burger').addEventListener('click', () => basculer(true))
    fond.addEventListener('click', () => basculer(false))
}

/* ---------- Fenêtres modales : boutons "Fermer" et clic à l'extérieur ---------- */
function activerModales() {
    document.addEventListener('click', (event) => {
        const dialogue = event.target.closest('dialog')
        if (event.target.closest('[data-close]') && dialogue) {
            dialogue.close()
            return
        }
        if (event.target instanceof HTMLDialogElement) {
            event.target.close()
        }
    })
}

construireMenu()
activerModales()