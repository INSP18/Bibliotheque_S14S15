const API_URL = window.location.hostname === 'localhost' 
? 'http://localhost:3000' 
: 'https://bibliotheque-s14s15.onrender.com';

function formaterDate(date) {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('fr-FR')
}

async function chargerStatistiques() {
    try {
        const response = await fetch(`${API_URL}/api/stats`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const stats = resultat.data

        document.querySelector('#total-livres').textContent = stats.total_livres
        document.querySelector('#total-adherents').textContent = stats.total_adherents
        document.querySelector('#emprunts-en-cours').textContent = stats.total_emprunt_encours
        document.querySelector('#emprunts-en-retard').textContent = stats.total_emprunt_enretard
    } catch (error) {
        console.error('Erreur statistiques :', error)
    }
}

async function chargerEmpruntsEnCours() {
    try {
        const response = await fetch(`${API_URL}/api/emprunts/en-cours`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const tbody = document.querySelector('#dashboard-emprunts-body')
        tbody.innerHTML = ''

        resultat.data.forEach(function(emprunt) {
            tbody.innerHTML += `
                <tr>
                    <td>${emprunt.id_emprunt}</td>
                    <td>${emprunt.titre_livre}</td>
                    <td>${emprunt.nom_adherent}</td>
                    <td>${formaterDate(emprunt.date_emprunt)}</td>
                    <td>${formaterDate(emprunt.date_retour_prevue)}</td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Erreur emprunts en cours :', error)
    }
}

async function chargerEmpruntsEnRetard() {
    try {
        const response = await fetch(`${API_URL}/api/emprunts/en-retard`)
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

        const resultat = await response.json()
        const tbody = document.querySelector('#dashboard-retards-body')
        tbody.innerHTML = ''

        resultat.data.forEach(function(emprunt) {
            tbody.innerHTML += `
                <tr>
                    <td>${emprunt.id_emprunt}</td>
                    <td>${emprunt.titre_livre}</td>
                    <td>${emprunt.nom_adherent}</td>
                    <td>${emprunt.contact_adherent || '-'}</td>
                    <td>${formaterDate(emprunt.date_retour_prevue)}</td>
                </tr>
            `
        })
    } catch (error) {
        console.error('Erreur emprunts en retard :', error)
    }
}

chargerStatistiques()
chargerEmpruntsEnCours()
chargerEmpruntsEnRetard()