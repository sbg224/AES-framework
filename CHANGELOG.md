CHANGELOG.md

AI Engineering System (AES)

Version : 1.4.1

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

## [1.4.1] - 2026-07-23

### Fixed
- `install/README.md` §2-5 et `docs/INSTALLATION.md` §2 : le parcours d'installation ne documentait ni comment obtenir AES (`git clone`), ni comment invoquer l'installateur en partant du projet cible plutôt que du dépôt AES, un scénario pourtant réel et déjà supporté techniquement (`install/installer.js` résout son propre emplacement depuis son chemin de fichier, jamais depuis le dossier courant). Ajout de la commande de clonage, d'une structure recommandée (dossiers voisins, non obligatoire), et des commandes `analyze`/`apply`/`integration` dans les deux sens.

## [1.4.0] - 2026-07-23

### Added
- AES-A004/AES-A005 (AUDIT.md racine) : audit documentaire global avant clôture du chantier conformité/installation, puis revue contradictoire requalifiant ses deux constats non triviaux après confrontation à l'architecture existante et à la documentation officielle de Claude Code.
- AES-D012 (DECISIONS.md racine) : architecture d'installation des intégrations d'agents, un point d'entrée CLI unique, des garanties transverses partagées, une intégration Claude Code isolée dans son propre module et son propre manifeste, jamais mêlée au manifeste du socle `ia/`.
- `install/lib/core.js` : garanties transverses (préconditions git, écriture atomique, agrégation d'état global) extraites de `install/installer.js` pour être partagées sans dépendance circulaire avec les intégrations d'agents.
- `install/integrations/claude_code.manifest.json` et `install/integrations/claude_code.js` : intégration Claude Code complète, quatre artefacts (skill `/aes-check`, script du hook avec bit exécutable, entrée fusionnée dans `.claude/settings.json`, bloc `@import` fusionné dans CLAUDE.md référençant le socle sans dupliquer son contenu), fusion strictement additive pour les fichiers de configuration partagés, jamais de remplacement.
- Nouvelle sous-commande `node install/installer.js integration analyze|apply claude-code <projet>`, mêmes garanties et vocabulaire de statuts que l'installateur du socle.
- `install/tests/test_claude_code_integration.js` (`node --test`, 13 scénarios) : matrice complète des statuts pour les trois natures d'opération (copie, fusion JSON, fusion Markdown), idempotence, préconditions git, préservation à l'identique d'un CLAUDE.md fortement personnalisé.
- AES-A006 (AUDIT.md racine) : audit d'accessibilité et d'expérience utilisateur sur dix points, avant la première publication publique du framework.
- `.github/workflows/ci.yml` : vérification automatique sur chaque push et pull request vers `main` (validation du manifeste, exécution des 22 tests), sans dépendance à installer, l'installateur n'en ayant aucune.
- `.github/RELEASE_CHECKLIST.md` : checklist opérationnelle de publication à l'usage du mainteneur, hors gouvernance du framework (SYSTEM.md §4).

### Changed
- INSTALLATION.md §6 : ajout d'une instruction actionnable pour Claude Code (« Intégration outillée »), remplaçant le simple pointeur vers `integrations/claude-code/` qui ne décrivait pas comment ces fichiers atteignaient réellement un projet cible.
- `install/README.md` : nouvelle section 5 documentant la commande `integration`, ses statuts et ses limites, numérotation des sections suivantes décalée en conséquence.
- SYSTEM.md, README.md, docs/PHILOSOPHY.md, docs/INSTALLATION.md : améliorations issues d'AES-A006. Redéfinition explicite de « développeur » et glossaire court dans SYSTEM.md ; restructuration de README.md autour du public visé (« Pour qui ? », « Démarrage rapide », parcours agent-médié séparé de la procédure détaillée) ; cadrage explicite d'un parcours délégué à un agent IA dès l'introduction de docs/INSTALLATION.md ; phrase d'ouverture accessible ajoutée dans docs/PHILOSOPHY.md.

### Fixed
- `install/README.md` : référence de section devenue incorrecte après l'ajout de la section 5 (Intégrations d'agents), corrigée sur l'ensemble du document.
- Incohérence entre docs/INSTALLATION.md et `install/README.md` sur le caractère obligatoire de Git, clarifiée : fortement recommandé, jamais strictement obligatoire, voir `--allow-no-git`.

## [1.3.0] - 2026-07-22

### Added
- AES-R014 : vérification de conformité obligatoire avant une tâche structurante, procédure détaillée dans WORKFLOW.md, Étape 1 (voir AES-D010).
- `integrations/claude-code/skills/aes-check/` et `integrations/claude-code/hooks/` : compétence `/aes-check` (cinq statuts stables, ligne `REFERENCES:`) et rappel léger non bloquant, tous deux de simples déclencheurs d'AES-R014, sans duplication de la procédure.
- `install/installation.manifest.json` : source de vérité unique des 14 fichiers installables et du socle, remplaçant toute liste implicite ou dupliquée.
- `install/installer.js` (Node.js, modules natifs uniquement, voir AES-D011) : installateur en deux phases strictes (analyse, toujours sûre ; application, avec préconditions git, écritures atomiques, protection à trois niveaux selon le statut de chaque document).
- `install/validate_manifest.js` et `install/tests/test_installer.js` (`node --test`) : vérification automatique que le manifeste, INSTALLATION.md et les statuts déclarés ne divergent jamais ; tests déterministes de l'installateur (idempotence, non-écrasement, conflits, préconditions git, erreurs).
- `install/tests/aes_check_protocole.md` : protocole comportemental reconstituant l'incident fondateur (contradiction Postgres/Proxmox non détectée), explicitement qualifié de semi-automatisé, pas déterministe.

### Changed
- INSTALLATION.md §3 et §6 : renvoient au manifeste et à AES-R014 plutôt que de dupliquer leur contenu.
- Installateur réécrit en Node.js après une première implémentation Python jamais soumise à validation (voir AES-D011). Parité vérifiée avant suppression du code Python.

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