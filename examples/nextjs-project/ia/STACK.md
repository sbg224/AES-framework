STACK.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟡 Référence

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* STANDARDS.md
* ARCHITECTURE.md
* CONTEXT.md
* DECISIONS.md

⸻

1. Objectif

Ce document recense l’ensemble des technologies, bibliothèques, frameworks, services et outils utilisés par le projet.

Il explique leur rôle, leur justification et leur périmètre d’utilisation.

Il constitue la référence technique de la stack du projet.

⸻

2. Organisation

Chaque technologie documentée suit la même structure.

Nom

Nom officiel de la technologie.

Catégorie

Exemples :

* Langage
* Framework
* Bibliothèque
* Base de données
* API
* Service
* Outil
* Infrastructure
* DevOps
* Tests

Rôle

Quel problème cette technologie résout-elle ?

Justification

Pourquoi ce choix a-t-il été retenu ?

Utilisation

Dans quelles parties du projet est-elle utilisée ?

Alternatives

Quelles solutions auraient pu être retenues ?

Documentation officielle

Lien vers la documentation officielle.

⸻

3. Règles

Chaque technologie utilisée dans le projet doit être documentée.

L’ajout d’une nouvelle dépendance doit entraîner une proposition de mise à jour de ce document.

Les technologies obsolètes doivent être retirées lorsqu’elles ne sont plus utilisées.

⸻

4. Contenu attendu

Le document peut notamment contenir :

* les langages ;
* les frameworks ;
* les bibliothèques ;
* les API externes ;
* les bases de données ;
* les outils de développement ;
* les outils DevOps ;
* les services cloud ;
* les solutions d’authentification ;
* les solutions de paiement ;
* les outils de tests ;
* les outils d’observabilité.

⸻

5. Technologies utilisées

Nom

Next.js

Catégorie

Framework

Rôle

Rendu et routage du site (App Router, API routes).

Justification

Permet de gérer le one-page, les routes dédiées aux réalisations et l’API route du formulaire de devis sans backend séparé (cf. CONTEXT.md §4 Contraintes techniques).

Utilisation

Ensemble du site.

Alternatives

Remix, Astro.

Documentation officielle

https://nextjs.org/docs

⸻

Nom

Supabase

Catégorie

Base de données

Rôle

Stockage et suivi des demandes de devis.

Justification

Offre gratuite, aucune infrastructure à gérer, cohérent avec l’objectif d’hébergement gratuit au démarrage (cf. CONTEXT.md §4 Contraintes budgétaires).

Utilisation

Écriture des demandes de devis depuis l’API route.

Alternatives

Firebase, PlanetScale.

Documentation officielle

https://supabase.com/docs

⸻

Nom

Resend

Catégorie

Service (email transactionnel)

Rôle

Notification immédiate d’une nouvelle demande de devis.

Justification

Condition du délai de traitement de 24h (cf. CONTEXT.md §5 Règles métier).

Utilisation

Déclenché par l’API route devis, après écriture Supabase.

Alternatives

SendGrid, Postmark.

Documentation officielle

https://resend.com/docs

⸻

Nom

Calendly

Catégorie

Service (prise de rendez-vous)

Rôle

Réservation d’un créneau directement depuis le site.

Justification

Solution externe éprouvée, évite le développement d’un système dédié (cf. CONTEXT.md §6 Dépendances fonctionnelles).

Utilisation

Intégré à la section prise de rendez-vous de la page d’accueil.

Alternatives

Cal.com, Google Calendar Appointment Schedules.

Documentation officielle

https://developer.calendly.com/

⸻

Nom

Vercel

Catégorie

Infrastructure / hébergement

Rôle

Hébergement et déploiement du site.

Justification

Intégration native Next.js, offre gratuite au démarrage (cf. CONTEXT.md §4 Contraintes budgétaires).

Utilisation

Hébergement du site complet (frontend + API routes).

Alternatives

Netlify, Railway.

Documentation officielle

https://vercel.com/docs

⸻

Nom

MDX

Catégorie

Bibliothèque / format de contenu

Rôle

Rédaction du contenu des fiches réalisations.

Justification

Contenu structuré et versionné dans le code, permettant la génération automatique des métadonnées SEO/Open Graph.

Utilisation

Fiches réalisations (routes dédiées).

Alternatives

CMS headless (Sanity, Contentful), Markdown simple.

Documentation officielle

https://mdxjs.com/

⸻

6. Références

Ce document s’appuie sur :

* SYSTEM.md
* STANDARDS.md
* ARCHITECTURE.md
* CONTEXT.md
* DECISIONS.md

Un choix de technologie découle souvent d’une décision documentée dans DECISIONS.md ; à l’inverse, une décision peut entraîner une mise à jour de ce document.

Il permet aux agents et aux développeurs de comprendre rapidement l’environnement technique du projet.