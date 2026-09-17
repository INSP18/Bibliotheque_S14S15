# Biblioth-que_S14S15
# Application de gestion de bibliothèque

## 1. Technologies utilisées

**Backend**

- Node.js
- Express.js
- PostgreSQL
- pg
- cors
- dotenv

**Frontend**

- HTML5
- CSS3
- JavaScript (Fetch API)

**Outils**

- Visual Studio Code
- pgAdmin 4
- Git / GitHub
- Postman (pour tester l'API)

---

## 2. Fonctionnalités

- Consulter les statistiques de la bibliothèque (tableau de bord)
- Gérer les auteurs (ajouter, modifier, supprimer, consulter)
- Gérer les livres
- Gérer les adhérents
- Enregistrer un emprunt
- Consulter les emprunts en cours
- Consulter les emprunts en retard
- Enregistrer le retour d'un livre

---

## 3. Prérequis

Les logiciels suivants doivent être installés sur l'ordinateur :

| Logiciel | Rôle |
|---|---|
| Node.js | exécute le serveur Express |
| PostgreSQL | héberge la base de données |
| pgAdmin 4 | gestion graphique de la base (facultatif) |
| Visual Studio Code | édition du code |
| Live Server (extension VS Code) | ouvre le frontend dans le navigateur |

Vérifier l'installation de Node.js et npm :

```bash
node -v
npm -v
```

Si les deux commandes affichent un numéro de version, l'installation est correcte.

---

## 5. Installation

### Étape 1 — Récupérer le projet

```bash
git clone URL_DU_DEPOT_GITHUB
cd Bibliotheque_S14S15
```

### Étape 2 — Installer les dépendances du backend

```bash
cd backend
npm install
```

---

## 6. Configuration de la base de données

### Étape 1 — Créer la base

Ouvrir pgAdmin 4 (ou le terminal `psql`) et créer une base de données nommée :

```text
bibliotheque
```

### Étape 2 — Exécuter le script SQL

Ouvrir le fichier :

```text
backend/schema.sql
```

Copier son contenu dans l'outil de requête SQL de pgAdmin, puis l'exécuter.

Ce script crée les tables suivantes :

- `auteurs`
- `livres`
- `ecrire`
- `adherents`
- `emprunter`

> **Remarque :** `schema.sql` crée uniquement la **structure** de la base, pas les données. Après l'installation, les tables sont vides. Les enregistrements peuvent ensuite être ajoutés depuis l'application ou directement dans pgAdmin.
>

---

## 7. Configuration du fichier .env

Le fichier `.env` contient les informations de connexion à PostgreSQL. Il est propre à chaque ordinateur.

Dans le dossier `backend/`, créer un fichier nommé `.env` (ou copier `.env.example` et le renommer), puis y renseigner ses propres informations :

```env
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=bibliotheque
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
```

Remplacer `votre_mot_de_passe` par le mot de passe de l'utilisateur `postgres` défini lors de l'installation de PostgreSQL.

---

## 8. Démarrer le backend

Depuis le dossier `backend/` :

```bash
npm start
```

ou, si le script `start` n'est pas défini dans `package.json` :

```bash
node app.js
```

## 9. Démarrer le frontend

Le frontend est indépendant du serveur Express : il s'ouvre avec Live Server.

1. Ouvrir le projet dans Visual Studio Code.
2. Aller dans `frontend/pages/`.
3. Clic droit sur `index.html` → **Open with Live Server**.


Le frontend envoie des requêtes HTTP au backend. Le backend interroge PostgreSQL et renvoie les données au format JSON, que le JavaScript affiche dans les pages.
