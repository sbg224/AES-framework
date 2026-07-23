INSTALLATION.md

AI Engineering System (AES)

Guide d’installation

⸻

1. Objectif

Ce document explique comment intégrer l’AI Engineering System (AES) dans un nouveau projet ou dans un projet existant.

Ce guide décrit la mécanique complète, utile à qui veut la comprendre en détail. Si vous découvrez la programmation assistée par l’IA, vous n’avez pas besoin de tout lire vous-même : la façon la plus simple de procéder est de demander directement à votre agent IA (Claude Code, ChatGPT, Codex ou un autre) d’installer AES dans votre projet, en lui indiquant ce document. Il effectuera les étapes techniques à votre place ; votre seule tâche réelle reste de décrire votre projet (Étape 3 ci-dessous).

⸻

2. Prérequis

Avant de commencer, vérifier que :

* le projet dispose si possible d’un dépôt Git, l’outil qui garde l’historique des modifications ([git-scm.com](https://git-scm.com) si besoin de l’installer) ; fortement recommandé, mais pas strictement obligatoire, voir `--allow-no-git` dans [`install/README.md`](../install/README.md) ;
* Node.js est installé sur la machine ([nodejs.org](https://nodejs.org)), nécessaire à l’installateur AES ;
* une copie locale du dépôt AES Framework existe déjà sur la machine, obtenue par exemple avec `git clone https://github.com/sbg224/AES-framework.git` (aucun package npm n’est encore publié) ; son emplacement exact n’importe pas, l’installateur peut être invoqué aussi bien depuis la racine du dépôt AES que depuis celle du projet cible, voir [`install/README.md`](../install/README.md) §3 pour la structure recommandée et les deux façons équivalentes de l’invoquer ;
* les autres outils de développement propres au projet sont installés.

Si l’un de ces éléments manque ou si vous ne savez pas comment vérifier leur présence, demandez à votre agent IA de le faire pour vous, il sait interroger la machine et guider l’installation si nécessaire.

Les prérequis spécifiques au projet doivent être documentés ici.

⸻

3. Installation

AES possède une politique officielle d’installation unique. Une seule procédure est recommandée ; aucune alternative officielle n’est maintenue.

Les Étapes 1 et 2 ci-dessous (créer le dossier, copier les fichiers) sont mécaniques et peuvent être entièrement déléguées à votre agent IA ou à l’installateur (voir plus bas). Ce qui suit sert de référence détaillée, pas d’instructions à exécuter soi-même à la main.

Étape 1

Créer le dossier `ia/` à la racine du projet. C’est le nom officiel retenu par AES ; la justification complète du choix se trouve dans DECISIONS.md racine, AES-D007, mais elle n’est pas nécessaire pour installer AES. Un projet peut renommer ce dossier si une convention interne l’exige, mais `ia/` reste le nom par défaut recommandé dans toute documentation, exemple ou échange autour d’AES.

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

Cette liste est la représentation en prose d'une source de vérité unique, `install/installation.manifest.json`, à la racine du dépôt AES. Le manifeste est le seul endroit qui fait autorité pour un script d'installation ; cette liste en est un reflet, vérifié automatiquement par `install/validate_manifest.js`, jamais une seconde liste indépendante.

La copie peut être faite à la main, ou via un installateur écrit en Node.js, modules natifs uniquement, sans dépendance ajoutée au projet cible (voir AES-D011). Par défaut, seule l'analyse est possible, `node install/installer.js analyze <projet>`, qui n'écrit jamais rien. L'écriture réelle nécessite une commande distincte et explicite, `node install/installer.js apply <projet>`, qui ne crée que ce qui manque et ne remplace jamais un document déjà présent.

Deux options existent pour les cas où git est absent ou l'arbre non propre, `--allow-no-git` et `--allow-dirty`. Elles réduisent les garanties de sécurité de l'installateur et ne sont jamais activées par défaut. Documentation complète du CLI, de ses statuts et de ses limites connues : voir [`install/README.md`](../install/README.md).

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

* Claude Code : automatisé (voir « Intégration outillée » ci-dessous) ; à défaut, référencer manuellement les quatre fichiers dans CLAUDE.md via la syntaxe d'import native de l'outil (`@ia/SYSTEM.md`, etc.) ;
* autres agents : utiliser le mécanisme de contexte permanent propre à l’outil (fichier de configuration, instructions système, mémoire de projet).

Les autres documents de `ia/` restent consultés sélectivement.

Vérification de conformité

Au-delà du chargement du socle, AES fournit un mécanisme actif de vérification, défini par AES-R014 (RULES_OF_ENGAGEMENT.md) et détaillé dans WORKFLOW.md, Étape 1 : avant une tâche structurante (architecture, données, dépendances, décision technique), la tâche envisagée est comparée à DECISIONS.md et aux documents pertinents, plutôt que de dépendre d’une lecture spontanée.

Le principe retenu n’est pas un mécanisme technique unique à répliquer à l’identique sur chaque outil, mais un contenu de vérification identique, installé à l’endroit propre à chaque agent :

* Claude Code : une compétence `/aes-check` (voir `integrations/claude-code/skills/aes-check/`), accompagnée d’un rappel léger et non bloquant déclenché à chaque message (voir `integrations/claude-code/hooks/`) ;
* Codex : commande personnalisée équivalente, associée au Guardian natif de l’outil ;
* autres agents : le même contenu de vérification, porté par le mécanisme de commande ou de rappel propre à l’outil.

Cette vérification complète le socle, elle ne le remplace pas.

Intégration outillée (Claude Code)

Pour Claude Code, le rattachement du socle et la vérification de conformité ci-dessus sont tous deux automatisés par une commande dédiée, distincte de l'installation du socle `ia/` (voir AES-D012, DECISIONS.md) :

```
node install/installer.js integration analyze claude-code <chemin_projet>
node install/installer.js integration apply   claude-code <chemin_projet> [--allow-no-git] [--allow-dirty]
```

Cette commande installe quatre artefacts en une seule opération : le skill `/aes-check` (`.claude/skills/aes-check/`), le script exécuté par le hook (`.claude/hooks/aes-reminder.sh`, bit exécutable inclus), l'entrée du hook fusionnée dans `.claude/settings.json`, et un bloc minimal dans CLAUDE.md référençant le socle par import natif, jamais par duplication de contenu. Toute configuration déjà présente (permissions, autres hooks, contenu existant de CLAUDE.md) est préservée à l'identique, la fusion est strictement additive. Documentation complète, statuts et limites : voir [`install/README.md`](../install/README.md).

Aucune commande équivalente n'existe encore pour Codex ou un autre agent ; le rattachement manuel décrit ci-dessus reste la voie applicable jusqu'à ce qu'une intégration outillée soit validée pour cet agent (voir AES-D012, « aucune généralisation multi-agents tant qu'un deuxième agent réel n'est pas validé »).

Ce principe garantit qu’AES reste utilisable, sans adaptation de fond, avec tout agent présent ou futur.

⸻

7. Références

Pour apprendre à utiliser le framework après son installation, consulter UTILISATION.md.