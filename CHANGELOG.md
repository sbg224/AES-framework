CHANGELOG.md

AI Engineering System (AES)

Version : 1.2.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* DECISIONS.md
* AUDIT.md

⸻

1. Objectif

Ce document conserve l’historique officiel des évolutions de l’AI Engineering System (AES).

Il retrace les nouvelles fonctionnalités, les corrections, les améliorations, les évolutions de gouvernance et les changements significatifs apportés au framework.

Il constitue la référence historique officielle du projet AES.

⸻

2. Portée

Ce document concerne exclusivement le framework AI Engineering System (AES).

Les projets utilisant AES disposent de leur propre CHANGELOG.md, indépendant de celui-ci.

Les deux documents ne doivent jamais être confondus.

⸻

3. Contenu

Le changelog du framework peut notamment contenir :

* les nouvelles fonctionnalités du framework ;
* les évolutions de la gouvernance ;
* les modifications des documents de référence ;
* les améliorations de conception ;
* les corrections importantes ;
* les changements susceptibles d’impacter les utilisateurs du framework.

Les modifications mineures ou expérimentales n’ont pas vocation à y être consignées.

⸻

4. Bonnes pratiques

Chaque entrée doit être :

* versionnée ;
* datée (AAAA-MM-JJ), avec l’heure ajoutée (AAAA-MM-JJ HH:MM) lorsque plusieurs entrées peuvent survenir le même jour ;
* concise ;
* factuelle ;
* compréhensible sans consulter l’historique Git.

Le changelog décrit les évolutions du framework, et non le détail de leur implémentation.

⸻

5. Relations avec les autres documents

Le changelog complète les autres documents vivants du framework :

* DECISIONS.md explique les choix d’architecture.
* AUDIT.md évalue l’état du framework.
* CHANGELOG.md retrace les évolutions réalisées.

Ces documents sont complémentaires et ne doivent pas être utilisés de manière interchangeable.

⸻

6. Mise à jour

Lorsqu’une évolution significative du framework est réalisée, un agent peut proposer une mise à jour du changelog.

La validation et la publication des modifications appartiennent au développeur.

⸻

7. Structure recommandée

Les entrées sont organisées par version.

Une structure inspirée de Keep a Changelog est recommandée.

Exemple :

## [Unreleased]
### Added
### Changed
### Fixed
### Removed

⸻

8. Historique

## [1.2.0] - 2026-07-20

### Added
- AES-R012 : validation d’un plan comme étape bloquante, trois niveaux d’autorisation distincts (RULES_OF_ENGAGEMENT.md).
- AES-R013 : interdiction absolue de committer une donnée sensible, avec vérification systématique avant tout commit.
- Concept de « socle » : SYSTEM.md, RULES_OF_ENGAGEMENT.md, WORKFLOW.md et AGENT.md chargés automatiquement, plutôt que consultés sélectivement (voir AES-D008).
- Rattachement du socle par agent documenté dans INSTALLATION.md §6.
- Préfixe d’identifiant AES-L pour les apprentissages, ajouté au référentiel SYSTEM.md §5.
- Parcours d’onboarding pour projet existant (brownfield) dans INSTALLATION.md §3 : premier jet de STACK.md et ARCHITECTURE.md à partir du code, politique de reconstitution ciblée pour DECISIONS.md (voir AES-D009).
- Exemple réel populé dans `examples/nextjs-project/ia/`, issu d’un projet de test (AHADI Service).
- README.md et LICENSE (MIT).

### Changed
- AES-R003 étendue aux actions git (commit, push, force-push, suppression de branche).
- AES-R005 étendue : pont explicite vers LEARNING.md pour les enseignements réutilisables.
- AES-R011 étendue au code source versionné, pas seulement aux documents de référence.
- WORKFLOW.md : séquence git explicite en fin de tâche, clarification du terme « proportionné ».
- CHECKLIST.md : conditions de clôture explicites, exigence de vérification par exécution réelle.
- UTILISATION.md §4 renvoie désormais à WORKFLOW.md Étape 9 plutôt que de dupliquer une liste devenue obsolète.
- Nettoyage systématique des deux-points injustifiés en milieu de phrase, dans l’ensemble du corpus.

### Fixed
- Référence à LEARNING.md retirée de CHANGELOG.md racine, ce document n’existant pas au niveau de l’auto-application du framework (voir AES-D005).

## [1.1.0] - 2026-07-18

### Added
- Auto-application partielle du framework à sa propre gouvernance : DECISIONS.md et AUDIT.md à la racine (voir AES-D005).
- AES-R011 : formalisation du principe de source de vérité unique dans RULES_OF_ENGAGEMENT.md.
- Définition officielle de « Documents liés » dans SYSTEM.md (voir AES-D003).
- Préfixe d’identifiant AES-D pour les décisions propres à la gouvernance du framework.

### Changed
- Le champ « Version » des gabarits de `templates/` est remplacé par « Structure : issue d’AES vX.Y.Z », qui énonce une origine structurelle plutôt qu’une compatibilité continue (voir AES-D006).
- SYSTEM.md §4 clarifie explicitement l’organisation du dépôt (racine / `templates/` / `docs/`).
- AGENT.md §3 cite désormais AES-R011 plutôt que de reformuler la règle.
- Politique officielle d’installation formalisée dans INSTALLATION.md : dossier dédié `ia/` (voir AES-D007), liste fermée de 14 fichiers avec exclusions explicites, séquence précise (CONTEXT.md, puis STACK.md/ARCHITECTURE.md, puis cycle WORKFLOW.md), politique de mise à jour fondée sur le champ « Structure : issue d’AES vX.Y.Z ».
- Nouvelle section SYSTEM.md §8 « Frontière entre le framework et un projet », formalisant l’indépendance d’un projet dès son installation.
- Correction de l’incohérence `.ai/`/`.ia/` préexistante dans INSTALLATION.md ; uniformisation sur `ia/`.

⸻

9. Résultat attendu

Le CHANGELOG.md constitue l’historique officiel du framework AES.

Il permet de comprendre rapidement l’évolution du framework, son niveau de maturité et les changements apportés entre chaque version.