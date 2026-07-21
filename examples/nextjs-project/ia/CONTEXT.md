CONTEXT.md

AI Engineering System (AES)

Structure : issue d'AES v1.1.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* STACK.md
* ARCHITECTURE.md
* DECISIONS.md
* AUDIT.md

⸻

1. Objectif

Ce document présente le contexte global du projet.

Il permet à un développeur ou à un agent IA de comprendre rapidement le projet, ses objectifs, son périmètre et ses contraintes.

Il constitue le point d'entrée fonctionnel du projet.

⸻

2. Présentation du projet

Nom

AHADI Service

Description

Site vitrine de l'activité numérique d'AHADI Service, présentant l'offre de prestations freelance en développement web, développement d'applications web, dépannage informatique et support technique.

Objectifs

Générer des demandes de devis qualifiées, servir de preuve de compétence et de crédibilité professionnelle, permettre une prise de rendez-vous directe.

Public cible

Professionnels et entreprises (TPE/PME notamment) ayant besoin de développement web, d'assistance informatique ou de support technique.

État du projet

Développement. Repo git initialisé, socle Next.js (App Router, TypeScript, Tailwind) mis en place via create-next-app (page d'accueil et layout par défaut). Framework AES installé. Aucune section fonctionnelle du site (devis, RDV, réalisations, contact) codée à ce jour.

⸻

3. Fonctionnalités principales

* Développement site web
* Développement application web
* Dépannage informatique
* Support technique
* Devis gratuit (formulaire structuré : type de service, budget, description du besoin)
* Prise de rendez-vous
* Réalisations (fiches projets détaillées, résultats/preuves quand disponibles)
* Contact

⸻

4. Contraintes

Techniques

Architecture hybride : page d'accueil en one-page avec navigation par ancres/scroll fluide entre les sections, chaque réalisation disposant de sa propre route dédiée (fiche projet détaillée). Pas de backend applicatif lourd.

Réglementaires

RGPD, consentement explicite, politique de confidentialité et mentions légales rédigées sur une base générique adaptée à la réglementation en vigueur, puis affinées pour l'activité. Données collectées limitées à prénom, email, téléphone.

Design

Identité visuelle (couleurs, typographie, branding) : reprend la charte
graphique AHADI Group existante, déjà définie. Implémentée en tokens CSS
natifs (18 variables couleur, 2 familles de police via next/font/google)
dans app/globals.css, réexposée à Tailwind via @theme inline. Ce fichier
fait foi, non dupliqué en documentation séparée.

Deux tokens sous contrainte d'accessibilité stricte (WCAG AA), à ne jamais
franchir sans revérifier le contraste : --gris-leger (4,53:1 sur blanc) et
--gris-sur-sombre (4,50:1 sur --noir).

Logo (bloc indissociable marque + AHADI + Service, jamais scindé) :
fichiers sources dans public/ (logo-ahadi-service-*.png,
symbole-ahadi-service-*.png), chacun en deux versions à choisir selon le
fond d'affichage (black = fond clair, cream = fond sombre). Navbar
desktop : logo-ahadi-service-black-crop.png, inchangé depuis sa mise en
place initiale. Site installable sur écran d'accueil mobile (PWA) :
favicon (clair/sombre selon le thème du navigateur) et icônes PWA
(manifest, apple-icon, icône maskable, sur la version claire du bloc
complet) en place, détail dans ARCHITECTURE.md §3. Mise en cache
hors-ligne (service worker) non traitée, hors périmètre de cette tâche.

Disposition/structure de page et UX : s'inspire de références externes
(structure de contenu et patterns de conversion), sans reprise de leur
identité visuelle.

Priorités transverses

SEO, performance, sécurité.

Budgétaires

Coûts non encore chiffrés. Objectif d'hébergement gratuit au démarrage.

⸻

5. Règles métier

* Le développement d'application mobile n'est pas proposé au lancement, y compris en sous-traitance.
* La formation numérique pour seniors n'entre pas dans le périmètre des services affichés au lancement.
* Délai de traitement des demandes de devis : 24h.
* Priorité de traitement des devis : premier arrivé, premier servi, sauf urgence signalée par le client.
* Conditions d'acceptation d'un projet : à définir.

⸻

6. Dépendances fonctionnelles

* Service d'envoi d'email — notification immédiate des demandes de devis.
* Base de données — stockage et suivi des demandes de devis.
* Service de prise de rendez-vous — permet au client de réserver un créneau directement.
* Hébergement — mise en ligne du site.

(Le détail technique de chaque dépendance, catégorie, justification du choix, alternatives, est documenté dans STACK.md.)

⸻

7. Évolution

Court/moyen terme

Mise en place d'un suivi commercial complet des demandes de devis, avec relances automatiques, au-delà du simple email de notification.

Moyen/long terme

Formation numérique pour seniors, envisagée en branche potentiellement séparée (cible et logique commerciale distinctes du reste de l'offre).

Développement d'application mobile, laissé ouvert selon compétence acquise ou partenariat solide trouvé.

⸻

8. Mise à jour

Ce document est vivant.

Les agents doivent signaler toute information devenue obsolète ou incomplète.

Toute mise à jour reste soumise à la validation du développeur.

⸻

9. Références

Pour compléter la compréhension du projet, consulter également :

* SYSTEM.md
* STACK.md
* ARCHITECTURE.md
* DECISIONS.md
* AUDIT.md