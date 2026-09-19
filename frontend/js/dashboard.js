async function chargerStatistiques() {
    const stats = await api('/api/stats')

    $('#total-livres').textContent = stats.total_livres
    $('#total-auteurs').textContent = stats.total_auteurs
    $('#total-adherents').textContent = stats.total_adherents
    $('#emprunts-en-cours').textContent = stats.total_emprunt_encours
    $('#emprunts-en-retard').textContent = stats.total_emprunt_enretard
}

async function chargerEmpruntsEnCours() {
    const corps = $('#dashboard-emprunts-body')
    const emprunts = await api('/api/emprunts/en-cours')

    if (!emprunts.length) {
        corps.innerHTML = ligneVide(5, 'Aucun emprunt en cours.')
        return
    }

    corps.innerHTML = emprunts.map((emprunt) => `
        <tr>
            <td>#${esc(emprunt.id_emprunt)}</td>
            <td class="strong">${esc(emprunt.titre_livre)}</td>
            <td>${esc(emprunt.nom_adherent)}</td>
            <td>${fmtDate(emprunt.date_emprunt)}</td>
            <td>${fmtDate(emprunt.date_retour_prevue)}</td>
        </tr>
    `).join('')
}

async function chargerEmpruntsEnRetard() {
    const corps = $('#dashboard-retards-body')
    const emprunts = await api('/api/emprunts/en-retard')

    if (!emprunts.length) {
        corps.innerHTML = ligneVide(6, 'Aucun retard. Tout est en ordre.')
        return
    }

    corps.innerHTML = emprunts.map((emprunt) => `
        <tr>
            <td>#${esc(emprunt.id_emprunt)}</td>
            <td class="strong">${esc(emprunt.titre_livre)}</td>
            <td>${esc(emprunt.nom_adherent)}</td>
            <td>${esc(emprunt.contact_adherent || '—')}</td>
            <td>${fmtDate(emprunt.date_retour_prevue)}</td>
            <td><span class="badge badge-danger">${joursRetard(emprunt.date_retour_prevue)} j</span></td>
        </tr>
    `).join('')
}

async function initialiser() {
    const resultats = await Promise.allSettled([
        chargerStatistiques(),
        chargerEmpruntsEnCours(),
        chargerEmpruntsEnRetard()
    ])

    const echec = resultats.find((resultat) => resultat.status === 'rejected')
    if (echec) {
        toast(echec.reason.message, 'error')
        $('#dashboard-emprunts-body').innerHTML = ligneVide(5, 'Données indisponibles.')
        $('#dashboard-retards-body').innerHTML = ligneVide(6, 'Données indisponibles.')
    }
}

initialiser()