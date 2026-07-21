DECISIONS.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* ARCHITECTURE.md
* CONTEXT.md
* AUDIT.md
* CHANGELOG.md
* STACK.md

⸻

1. Objectif

Ce document conserve l’historique des décisions importantes prises au cours du projet.

Il permet de comprendre les choix réalisés, leur contexte et leur justification.

⸻

2. Organisation

Chaque décision reçoit un identifiant unique.

Exemple :

* ADR-001
* ADR-002
* ADR-003

Les identifiants ne sont jamais réutilisés.

⸻

3. Structure d’une décision

Chaque décision doit contenir au minimum :

Identifiant

Exemple :

ADR-001

Date

Date de validation.

Auteur

Développeur ou équipe ayant validé la décision.

Contexte

Pourquoi cette décision était-elle nécessaire ?

Décision

Description du choix retenu.

Justification

Pourquoi cette solution a-t-elle été préférée aux autres ?

Alternatives étudiées

Présenter les principales options envisagées.

Conséquences

Décrire les impacts positifs, les limites et les compromis associés à cette décision.

Statut

Par exemple :

* Proposée
* Validée
* Remplacée
* Abandonnée

⸻

4. Historique des décisions

ADR-001

Date

2026-07-19

Auteur

Développeur

Contexte

La charte graphique du site AHADI Service reprend l’identité visuelle d’AHADI Group, déjà implémentée en tokens CSS natifs (18 variables couleur, 2 familles de police) dans app/globals.css et app/layout.tsx, réexposés à Tailwind via @theme inline. Il fallait décider si cette charte devait être documentée dans un fichier AES séparé.

Décision

Ne pas dupliquer la charte graphique dans un document AES séparé. app/globals.css fait foi comme source unique des tokens de style. CONTEXT.md §4 Design référence ce fichier et documente uniquement les deux contraintes d’accessibilité WCAG AA à ne jamais franchir (--gris-leger 4,53:1 sur blanc, --gris-sur-sombre 4,50:1 sur --noir).

Justification

Respecte AES-R011 (aucune duplication de contenu normatif) ; évite la dérive entre documentation et code source, ce dernier étant systématiquement à jour par construction.

Alternatives étudiées

Création d’un DESIGN.md dédié consignant l’ensemble des tokens (couleurs, typographie, rayons, ombres) — écartée pour éviter une duplication avec le fichier source.

Conséquences

Les tokens de style ne sont consultables qu’en lisant directement app/globals.css / app/layout.tsx, sans vue d’ensemble packagée en documentation. Les deux contraintes d’accessibilité restent néanmoins visibles dans CONTEXT.md pour rester actionnables sans lecture du code.

Statut

Validée

⸻

5. Bonnes pratiques

Une décision doit :

* être claire ;
* être justifiée ;
* être traçable ;
* pouvoir être comprise plusieurs mois ou années plus tard.

Les décisions mineures ne sont pas documentées.

Seuls les choix ayant un impact significatif sur le projet sont enregistrés.

⸻

6. Évolution

Une décision validée n’est jamais supprimée.

Si elle devient obsolète, son statut est mis à jour et une nouvelle décision est créée pour la remplacer.

⸻

7. Références

Ce document s’appuie notamment sur AUDIT.md, lorsqu’un audit conduit à une décision.

Les décisions peuvent entraîner des mises à jour de :

* ARCHITECTURE.md ;
* STACK.md ;
* CONTEXT.md ;
* CHANGELOG.md.

Elles peuvent également être citées dans les audits (AUDIT.md) lorsqu’un choix d’architecture ou d’organisation est évalué.