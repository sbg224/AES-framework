Installateur AES

Documentation opérationnelle de l’installateur AES Framework.

⸻

1. À quoi sert cet installateur ?

L’installateur permet d’ajouter le socle AES dans un projet existant de manière sécurisée.

Avant toute écriture, il analyse le projet, vérifie les conflits éventuels et détermine précisément ce qui peut être installé.

L’installation est conçue pour :

* ne jamais remplacer automatiquement des fichiers protégés ;
* créer uniquement les éléments manquants ;
* pouvoir être relancée sans créer de doublons (idempotence) ;
* limiter les risques grâce aux vérifications préalables.

⸻

2. Prérequis

Avant de commencer, assurez-vous de disposer de :

* Node.js installé sur votre machine ;
* une copie du dépôt AES Framework ;
* un projet cible dans lequel vous souhaitez installer AES.

Aucune dépendance supplémentaire n’est nécessaire : l’installateur utilise uniquement les modules natifs de Node.js.

L’utilisation d’un dépôt Git dans le projet cible est fortement recommandée pour bénéficier de toutes les garanties de sécurité.

⸻

3. Où lancer les commandes ?

Toutes les commandes doivent être exécutées depuis un terminal :

* Terminal intégré de VS Code ;
* PowerShell (Windows) ;
* Terminal macOS ;
* Terminal Linux.

Placez-vous d’abord à la racine du dépôt AES Framework.

Exemple :

cd AES-Framework

Toutes les commandes suivantes sont lancées depuis cet emplacement.

⸻

4. Installation en trois étapes

Étape 1 — Analyser le projet

Cette commande est totalement sûre.

Elle :

* n’écrit aucun fichier ;
* vérifie la cohérence du projet ;
* affiche exactement ce qui serait installé.

node install/installer.js analyze <chemin_projet>

Exemple :

node install/installer.js analyze ../3M-Drive

Vous pouvez lancer cette commande autant de fois que nécessaire.

⸻

Étape 2 — Vérifier le résultat

Analysez les statuts affichés.

S’il existe des conflits (CONFLICT) ou des erreurs (ERROR), ils doivent être résolus avant de poursuivre.

⸻

Étape 3 — Installer AES

Une fois l’analyse validée, lancez l’installation réelle :

node install/installer.js apply <chemin_projet>

Exemple :

node install/installer.js apply ../3M-Drive

Avant toute écriture, apply effectue automatiquement une nouvelle analyse afin de garantir que le plan d’installation correspond toujours à l’état réel du projet.

⸻

5. Intégrations d'agents (Claude Code)

Le socle `ia/` (sections 1 à 4 ci-dessus) est indépendant de tout agent. Le rattachement à un agent précis (chargement du socle, `/aes-check`, rappel non bloquant) relève d'une commande séparée, `integration`, décrite dans docs/INSTALLATION.md §6 et fondée sur AES-D012 (DECISIONS.md).

Pour Claude Code :

node install/installer.js integration analyze claude-code <chemin_projet>
node install/installer.js integration apply   claude-code <chemin_projet> [--allow-no-git] [--allow-dirty]

Cette commande installe quatre artefacts, décrits dans `install/integrations/claude_code.manifest.json` :

* le skill `/aes-check` (`.claude/skills/aes-check/SKILL.md`), copié depuis le gabarit ;
* le script exécuté par le hook (`.claude/hooks/aes-reminder.sh`), copié avec restauration du bit exécutable ;
* l'entrée du hook dans `.claude/settings.json`, fusionnée de façon strictement additive, jamais un remplacement du fichier ;
* un bloc minimal dans CLAUDE.md référençant le socle par import natif (`@ia/SYSTEM.md`, etc.), délimité par les marqueurs `<!-- AES:SOCLE:BEGIN -->` / `<!-- AES:SOCLE:END -->`, jamais de contenu hors de ce bloc modifié.

Les mêmes garanties que pour le socle s'appliquent : `analyze` n'écrit jamais rien, `apply` réanalyse systématiquement avant d'écrire, les mêmes préconditions Git et options (`--allow-no-git`, `--allow-dirty`) s'appliquent, et l'exécution répétée est idempotente.

Aucune commande équivalente n'existe encore pour Codex ou un autre agent (voir §13 « Limites connues »).

⸻

6. Options disponibles

–allow-no-git

Autorise l’installation sur un projet qui ne possède pas de dépôt Git.

⚠️ Cette option réduit les garanties de sécurité puisqu’il devient impossible d’annuler facilement les modifications via Git.

⸻

–allow-dirty

Autorise l’installation dans un dépôt Git contenant déjà des modifications non enregistrées.

⚠️ Cette option réduit également les garanties puisque les modifications de l’installateur seront mélangées avec vos modifications locales.

Ces deux options ne sont jamais activées automatiquement, pour le socle comme pour une intégration d'agent.

⸻

7. Comprendre les statuts

Statuts par fichier ou artefact

Statut	Signification
CREATE	L'élément sera créé ou son contenu fusionné (première écriture).
SKIP	L'élément existe déjà et ne nécessite aucune action.
REVIEW	Une vérification humaine est nécessaire.
CONFLICT	Un conflit bloque l’installation (socle uniquement, voir §9).
ERROR	Une erreur est survenue.

⸻

État global de l’installation

Statut	Signification
OK	Installation valide.
COMPLETED_WITH_REVIEW	Installation terminée mais certains éléments doivent être vérifiés.
BLOCKED_BY_CONFLICT	L’installation est bloquée par un conflit.
ERROR	Une erreur empêche la poursuite de l’installation.

Un état BLOCKED_BY_CONFLICT ou ERROR empêche toute écriture.

Pour l'intégration Claude Code, BLOCKED_BY_CONFLICT n'est produit par aucun scénario connu : aucun des quatre artefacts n'est en statut gouvernance (voir AES-D012).

Remarque

Ces statuts concernent uniquement l’installateur (socle et intégrations).

Les statuts de /aes-check (OK, CONTRADICTION, REVIEW_REQUIRED, INSUFFICIENT_CONTEXT, ERROR) sont documentés dans :

integrations/claude-code/skills/aes-check/SKILL.md

⸻

8. Codes de sortie

Code	Signification
0	Exécution réussie (y compris COMPLETED_WITH_REVIEW).
1	Refus ou échec (conflit, erreur ou précondition non respectée).

⸻

9. Protection des fichiers existants

L’installateur respecte le niveau de protection défini pour chaque document.

Niveau	Comportement
🟢 Vivant	Jamais remplacé automatiquement.
🟡 Référence	Jamais remplacé automatiquement s’il diffère du modèle. Une revue est demandée (REVIEW).
🔒 Gouvernance	Toute différence bloque l’installation (CONFLICT) jusqu’à résolution explicite.

Une installation partielle crée uniquement les fichiers manquants et ne modifie jamais un fichier déjà présent.

Pour l'intégration Claude Code, `.claude/settings.json` et CLAUDE.md ne sont jamais des fichiers que AES possède entièrement : toute configuration ou tout contenu déjà présent, hors de l'entrée ou du bloc propres à AES, est préservé à l'identique.

⸻

10. Source de vérité

Le fichier :

install/installation.manifest.json

est la seule source de vérité décrivant :

* les fichiers installables ;
* leur statut ;
* leur destination ;
* le socle AES.

Pour l'intégration Claude Code, `install/integrations/claude_code.manifest.json` joue le même rôle sur son propre périmètre, avec un champ `type` explicite par artefact (`copie`, `fusion_json`, `fusion_markdown`).

INSTALLATION.md constitue uniquement une documentation destinée aux utilisateurs et ne doit jamais devenir une seconde source de vérité.

⸻

11. Validation et tests

Vérifier le manifeste du socle

node install/validate_manifest.js

Cette commande vérifie la cohérence entre :

* le manifeste ;
* les fichiers présents ;
* les statuts déclarés ;
* la documentation.

⸻

Exécuter les tests

node --test install/tests/test_installer.js
node --test install/tests/test_claude_code_integration.js

Les tests déterministes permettent de vérifier le bon fonctionnement de l’installateur, du socle comme de l'intégration Claude Code.

⸻

12. Installation interrompue

Chaque fichier est écrit de manière atomique.

Cela signifie qu’un fichier individuel ne peut jamais être laissé dans un état corrompu.

En revanche, l’installation complète n’est pas une transaction globale. Une interruption (coupure électrique, arrêt du processus, etc.) peut laisser une installation incomplète.

Dans ce cas :

1. relancez analyze ;
2. l’installateur détectera automatiquement :
    * les fichiers déjà installés (SKIP) ;
    * les fichiers encore manquants (CREATE) ;
3. relancez apply pour terminer l’installation.

Aucun doublon n’est créé et aucun fichier existant n’est écrasé. Le même principe s'applique à `integration analyze`/`integration apply`.

⸻

13. Limites connues

Les limitations actuelles sont les suivantes :

* l’intégration Codex n’a pas encore été validée officiellement, et aucune commande `integration` équivalente n'existe pour cet agent ;
* aucune généralisation multi-agents (registre, système de plugins) n'est construite tant qu'un deuxième agent réel n'est pas validé (voir AES-D012) ;
* l’architecture est compatible avec une future exécution via npx, mais aucun package n’est encore publié ;
* le champ schema_version est réservé aux futures évolutions du manifeste ;
* l’installation n’est pas transactionnelle à l’échelle de l’ensemble du projet ;
* les options --allow-no-git et --allow-dirty diminuent les garanties de sécurité ;
* les tests de /aes-check sont comportementaux et non déterministes, car ils reposent sur un agent génératif, contrairement aux tests de l’installateur qui sont entièrement déterministes.
