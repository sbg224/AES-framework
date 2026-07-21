CHANGELOG.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* DECISIONS.md
* AUDIT.md
* LEARNING.md

⸻

1. Objectif

Ce document conserve l’historique des évolutions du projet.

Il permet de suivre les changements importants réalisés au fil du temps afin d’améliorer la compréhension, la maintenance et la traçabilité du projet.

Chaque projet utilisant l’AI Engineering System (AES) possède son propre CHANGELOG.md.

⸻

2. Portée

Le changelog documente exclusivement le projet dans lequel il est présent.

Il ne décrit jamais les évolutions du framework AES.

Le dépôt officiel d’AES possède son propre historique indépendant.

⸻

3. Contenu

Le changelog recense les évolutions significatives du projet, notamment :

* les nouvelles fonctionnalités ;
* les corrections de bugs ;
* les améliorations techniques ;
* les évolutions d’architecture ;
* les changements susceptibles d’impacter les utilisateurs ou les développeurs.

Les modifications mineures, temporaires ou sans impact durable n’ont pas vocation à y être consignées.

⸻

4. Bonnes pratiques

Chaque entrée doit être :

* datée ou versionnée ;
* concise ;
* factuelle ;
* compréhensible sans consulter le code source.

Le changelog décrit le résultat des évolutions, et non le détail de leur implémentation.

⸻

5. Relations avec les autres documents

Le changelog complète les autres documents du framework :

* DECISIONS.md explique pourquoi une décision a été prise.
* AUDIT.md évalue l’état global du projet.
* LEARNING.md capitalise les enseignements.
* CHANGELOG.md retrace les évolutions réalisées.

Ces documents sont complémentaires et ne doivent pas être utilisés de manière interchangeable.

⸻

6. Mise à jour

Lorsqu’une évolution importante est réalisée, l’agent peut proposer une mise à jour du changelog.

La validation et la publication des modifications appartiennent au développeur.

⸻

7. Structure recommandée

Une organisation par versions est recommandée.

Exemple :

## [Unreleased]
### Added
### Changed
### Fixed
### Removed
---
## [1.0.0]

La structure peut être adaptée aux besoins du projet, à condition de conserver un historique clair et cohérent.

⸻

8. Historique

## [Unreleased]

### Added

* Socle Next.js avec charte graphique AHADI (tokens couleur, polices Outfit/DM Sans) dans app/globals.css.
* Structure one-page à ancres (Hero, Services, Réalisations, Devis, Contact) en coquilles vides.
* Navbar responsive : barre basse liens seuls sur mobile, large conteneur centré avec logo et CTA détaché sur desktop.
* Indicateur de progression visuel dans la navbar : remplissage animé selon la section actuellement visible, sans pourcentage affiché.
* Logo AHADI Service et favicon intégrés (assets dans public/, app/icon.png).

### Fixed

* Poids de police DM Sans restreint (400/500) pour éviter le chargement inutile de la police variable complète.
* Cadrage du logo navbar corrigé (asset pré-rogné + object-contain) pour éviter que "Service" soit coupé.

⸻

9. Résultat attendu

Le CHANGELOG.md constitue l’historique de référence du projet.

Il permet de comprendre rapidement ce qui a évolué, à quel moment et dans quel objectif, sans avoir à analyser l’historique complet du code.
