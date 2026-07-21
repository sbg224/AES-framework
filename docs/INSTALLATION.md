INSTALLATION.md

AI Engineering System (AES)

Guide d’installation

⸻

1. Objectif

Ce document explique comment intégrer l’AI Engineering System (AES) dans un nouveau projet ou dans un projet existant.

⸻

2. Prérequis

Avant de commencer, vérifier que :

* le dépôt du projet est initialisé ;
* un système de gestion de versions est utilisé ;
* les outils de développement nécessaires sont installés.

Les prérequis spécifiques au projet doivent être documentés ici.

⸻

3. Installation

AES possède une politique officielle d’installation unique. Une seule procédure est recommandée ; aucune alternative officielle n’est maintenue.

Étape 1

Créer le dossier `ia/` à la racine du projet. C’est le nom officiel retenu par AES (voir DECISIONS.md racine, AES-D007, pour la justification de ce choix). Un projet peut le renommer si une convention interne l’exige, mais `ia/` est le nom par défaut recommandé dans toute documentation, exemple ou échange autour d’AES.

Étape 2

Copier dans `ia/` la liste fermée des documents suivants, et uniquement ceux-ci.

Depuis la racine du framework :

* SYSTEM.md

Depuis `templates/` :

* RULES_OF_ENGAGEMENT.md
* AGENT.md
* WORKFLOW.md
* STANDARDS.md
* STACK.md
* CONTEXT.md
* ARCHITECTURE.md
* PROMPTS.md
* CHECKLIST.md
* AUDIT.md
* DECISIONS.md
* LEARNING.md
* CHANGELOG.md

Soit 14 fichiers au total. Cette liste est fermée. Aucun autre élément du dépôt AES n’est copié. Sont explicitement exclus :

* `docs/` (PHILOSOPHY.md, INSTALLATION.md, UTILISATION.md), qui expliquent AES et n’ont aucune utilité une fois copiés dans un projet ;
* `examples/` et README.md d’AES ;
* le DECISIONS.md et l’AUDIT.md présents à la racine du dépôt AES, qui documentent la gouvernance du framework lui-même et non celle d’un projet (voir SYSTEM.md §8).

SYSTEM.md reste à la racine du framework plutôt que dans `templates/` car il définit la gouvernance du framework lui-même, et non un gabarit propre à un projet. Il est néanmoins copié dans chaque projet au même titre que les autres documents de référence.

Une fois copiés, ces 14 fichiers appartiennent immédiatement et entièrement au projet (voir SYSTEM.md §8, « Frontière entre le framework et un projet »).

Étape 3

Remplir CONTEXT.md en premier, même sommairement (nom du projet, objectif, périmètre). C’est le point de départ fonctionnel réel du projet. Les autres documents vivants dépendent de lui pour avoir un sens.

Ce document ne peut pas être extrait du code : les objectifs métier, le public cible et les règles métier n’existent que dans la connaissance du développeur, sur un projet neuf comme sur un projet déjà en cours. Seul le champ « État du projet » peut être pré-rempli par déduction (présence d’une configuration de déploiement, par exemple).

Étape 4

Compléter STACK.md et ARCHITECTURE.md. Ces deux documents peuvent rester volontairement incomplets à ce stade et se préciser progressivement. Ce ne sont pas des bloquants avant de commencer à travailler.

Sur un projet déjà en cours, l’agent peut produire un premier jet à partir du code existant : le manifeste de dépendances (package.json ou équivalent) et la structure des dossiers permettent de préremplir STACK.md (champs Nom, Catégorie, Utilisation) et ARCHITECTURE.md §2-3 (organisation du dépôt). Les champs Justification et Alternatives de STACK.md ne sont jamais devinés ; ils restent marqués « non documenté à l’origine » tant que le développeur ne les complète pas. Ce premier jet est toujours présenté pour correction et validation avant d’être considéré acquis (AES-R001, AES-R012).

Étape 5

Démarrer le cycle normal défini par WORKFLOW.md. DECISIONS.md, AUDIT.md, LEARNING.md et CHANGELOG.md restent vides à l’installation ; ils se remplissent naturellement, tâche après tâche, au fil de ce cycle, jamais en une seule fois.

Sur un projet déjà en cours, une reconstitution ciblée de DECISIONS.md reste possible à la demande du développeur (voir templates/DECISIONS.md §4).

⸻

4. Vérification

Une installation est considérée comme terminée lorsque :

* le dossier `ia/` contient les 14 fichiers prévus, sans ajout ni omission ;
* CONTEXT.md contient au minimum le nom, l’objectif et le périmètre du projet ;
* les documents vivants (DECISIONS.md, AUDIT.md, LEARNING.md, CHANGELOG.md) sont présents mais peuvent rester vides, et se rempliront au fil des tâches plutôt qu’à l’installation ;
* les agents peuvent accéder à la documentation du projet.

⸻

5. Mise à jour

Un projet est indépendant d’AES dès son installation. Aucune synchronisation automatique n’existe entre un projet et les évolutions ultérieures du framework.

Chaque document de `ia/` porte un champ « Structure : issue d’AES vX.Y.Z », qui indique la version d’AES dont sa structure est originaire (voir SYSTEM.md §7). Pour évaluer une mise à jour éventuelle :

* comparer cette version à la version courante d’AES (SYSTEM.md) ;
* consulter le CHANGELOG.md racine d’AES pour identifier ce qui a changé depuis ;
* décider, au cas par cas, s’il est pertinent de porter manuellement une évolution structurelle dans un document déjà rempli de contenu propre au projet.

Aucune mise à jour n’est jamais appliquée automatiquement. Elle relève toujours d’une décision explicite du développeur.

⸻

6. Intégration selon l’agent utilisé

AES est indépendant de tout agent ou modèle d’intelligence artificielle.

Le framework ne prescrit aucun mécanisme d’intégration spécifique à un outil, à l’exception d’une exigence : le socle (voir ci-dessous) doit être chargé automatiquement, quel que soit le moyen technique retenu.

Chaque agent dispose de son propre mécanisme pour charger du contexte : fichier de configuration dédié, instructions système, mémoire de projet, ou tout autre moyen propre à l’outil utilisé.

Il revient au développeur d’adapter le rattachement du dossier `ia/` (ou du dossier retenu par le projet) au mécanisme de l’agent utilisé, sans modifier le contenu ni la structure des documents du framework.

Rattachement du socle

Les quatre documents socle (SYSTEM.md, RULES_OF_ENGAGEMENT.md, WORKFLOW.md, AGENT.md, voir SYSTEM.md §4) doivent être chargés automatiquement, pas à la demande :

* Claude Code, à titre d’exemple : référencer les quatre fichiers dans CLAUDE.md ;
* autres agents : utiliser le mécanisme de contexte permanent propre à l’outil (fichier de configuration, instructions système, mémoire de projet).

Les autres documents de `ia/` restent consultés sélectivement.

Ce principe garantit qu’AES reste utilisable, sans adaptation de fond, avec tout agent présent ou futur.

⸻

7. Références

Pour apprendre à utiliser le framework après son installation, consulter UTILISATION.md.