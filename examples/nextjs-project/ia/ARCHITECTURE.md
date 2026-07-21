ARCHITECTURE.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟡 Référence

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* CONTEXT.md
* STACK.md
* DECISIONS.md
* STANDARDS.md
* AUDIT.md

⸻

1. Objectif

Ce document décrit l’architecture technique du projet.

Il présente son organisation, ses principaux composants et les relations entre eux.

Son objectif est de permettre à tout développeur ou agent IA de comprendre rapidement la structure globale du projet avant d’intervenir.

⸻

2. Vue d’ensemble

Site vitrine Next.js (App Router). Page d’accueil en one-page avec sections consultables via navigation par ancres et scroll fluide (services, réalisations, devis, contact). Chaque réalisation dispose en complément d’une route dédiée pour le référencement individuel. Le formulaire de devis est traité par une API route Next.js, sans backend séparé : écriture dans Supabase puis notification par email via Resend. La prise de rendez-vous est déléguée à Calendly. Hébergement sur Vercel.

Voir CONTEXT.md §2 et §4 pour le détail fonctionnel.

⸻

3. Organisation du projet

Structure projetée (le scaffold actuel est encore le défaut create-next-app, à affiner à l’implémentation) :

* `app/` — page d’accueil one-page, routes dédiées `/realisations/[slug]`, API route `/api/devis` ;
* `app/manifest.ts`, `app/apple-icon.png` — manifest et icône PWA (installation sur écran d’accueil mobile), construits à partir du bloc logo complet (symbole + AHADI + Service), jamais recadrés au symbole seul ;
* `public/icons/pwa-icon-*.png` — icônes du manifest (192, 512, 512 maskable) ;
* `public/icons/icon-512.png`, `icon-dark.png` — favicon clair/sombre (`prefers-color-scheme`), distinct des icônes PWA ci-dessus ;
* contenu MDX des réalisations ;
* composants de sections (services, réalisations, devis, contact) et navbar ;
* clients Supabase et Resend.

⸻

4. Architecture applicative

* Interface utilisateur : composants React des sections + navbar.
* Contenu : fichiers MDX des réalisations, génération de métadonnées SEO/Open Graph.
* Traitement : API route Next.js pour le formulaire de devis.
* Accès aux données : Supabase.
* Intégrations externes : Resend (email), Calendly (rendez-vous).

⸻

5. Flux principaux

* Soumission d’une demande de devis : formulaire → API route → écriture Supabase → notification Resend.
* Consultation d’une réalisation : route dédiée → contenu MDX → métadonnées SEO/OG générées automatiquement.
* Prise de rendez-vous : widget Calendly intégré à la section dédiée.

⸻

6. Découpage des responsabilités

* Navbar : responsive — fixe en bas de page sur mobile (ergonomie tactile, liens seuls, pleine largeur), fixe proche du haut sur desktop (large conteneur centré avec marge visible de chaque côté, coins arrondis modérés, fond légèrement transparent, logo centré et CTA détaché des liens). Une barre de progression visuelle, sans pourcentage, indique la section visible et s’anime lors du changement de section. Aucun affichage d’heure/fuseau horaire dans les deux cas.
* Sections page d’accueil : présentation one-page.
* Fiches réalisations (MDX + route dédiée) : détail projet, résultat chiffré quand disponible, process de collaboration en étapes.
* API route devis : validation, écriture Supabase, déclenchement Resend.
* Intégration Calendly : entièrement déléguée au service externe.

⸻

7. Évolutivité

Voir CONTEXT.md §7 Évolution (suivi commercial avec relances automatiques, formation seniors, application mobile).

Note architecture : le choix Supabase + API route laisse la voie ouverte à un suivi commercial plus poussé sans changer de fondation technique.

⸻

8. Contraintes d’architecture

* Pas de backend séparé : toute logique serveur passe par les API routes Next.js.
* Hébergement visé sur offres gratuites au démarrage (Vercel, Supabase, Resend, Calendly).
* Architecture hybride imposée : one-page + routes dédiées par réalisation.
* Navbar : responsive — fixe en bas de page sur mobile (ergonomie tactile, liens seuls, pleine largeur), fixe proche du haut sur desktop (large conteneur centré avec marge visible de chaque côté, coins arrondis modérés, fond légèrement transparent, logo centré et CTA détaché des liens). Une barre de progression visuelle, sans pourcentage, indique la section visible et s’anime lors du changement de section. Aucun affichage d’heure/fuseau horaire dans les deux cas.

⸻

9. Mise à jour

Toute évolution importante de l’architecture doit entraîner une proposition de mise à jour de ce document.

Les modifications restent soumises à la validation du développeur.

⸻

10. Références

Pour une compréhension complète du projet, consulter également :

* SYSTEM.md
* CONTEXT.md
* STACK.md
* DECISIONS.md
* STANDARDS.md
* AUDIT.md
