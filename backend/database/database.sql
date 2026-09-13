CREATE TABLE auteurs(
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    nationalite VARCHAR(100) NOT NULL
);

CREATE TABLE livres(
    id SERIAL PRIMARY KEY,
    titre VARCHAR(225) NOT NULL,
    statut VARCHAR(20) NOT NULL DEFAULT 'disponible',
    annee_publication INTEGER NOT NULL,

    CONSTRAINT livres_statut_check
    CHECK (statut IN ('disponible', 'emprunte'))
);

CREATE TABLE ecrire(
    id_auteur INTEGER REFERENCES auteurs(id),
    id_livre INTEGER REFERENCES livres(id),

    PRIMARY KEY(id_auteur, id_livre)
);

CREATE TABLE adherents(
    id SERIAL PRIMARY KEY,
    nom VARCHAR(200) NOT NULL,
    contact VARCHAR(50)
);

CREATE TABLE emprunter(
    id SERIAL PRIMARY KEY,

    id_livre INTEGER NOT NULL REFERENCES livres(id),
    id_adherent INTEGER NOT NULL REFERENCES adherents(id),

    date_emprunt DATE NOT NULL DEFAULT CURRENT_DATE,
    date_retour_prevue DATE NOT NULL,
    date_retour DATE
)