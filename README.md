# AI Engineering System (AES)

AES vous aide à mener un projet logiciel avec une IA de façon organisée et fiable, que vous soyez développeur expérimenté, débutant, ou adepte du vibe coding (construire un projet en dialoguant avec une IA sans nécessairement écrire ou lire soi-même le code produit). Aucune expérience préalable de programmation n'est nécessaire pour commencer.

Le développeur décide. Les agents assistent. Le framework garantit la cohérence.

## Pour qui ?

Concrètement, voici ce qu'AES fait et ne fait pas.

Ce qu'AES fait :
- garder une trace fiable de ce que fait l'IA et pourquoi ;
- vous permettre de comprendre et de valider chaque changement important, plutôt que de simplement le subir ;
- éviter qu'un agent oublie ou contredise une décision déjà prise ;
- fonctionner de la même façon avec Claude Code, Codex, ou tout autre assistant IA.

Ce qu'AES ne fait pas :
- il n'écrit pas de code à votre place, ce rôle reste celui de votre agent IA ;
- il ne remplace pas l'apprentissage de la programmation, il rend le travail avec une IA plus organisé et plus transparent ;
- il n'impose aucune technologie particulière.

## Qu'est-ce qu'AES ?

AES fournit une méthode de travail commune pour collaborer avec une IA sur un projet logiciel : des règles de comportement claires pour l'agent, un processus de travail étape par étape, et une documentation qui évolue avec le projet plutôt que de devenir obsolète.

Le framework est agnostique de tout agent IA (Claude Code, Codex, ou tout autre outil présent ou futur). Pour comprendre les principes qui le fondent, voir [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md), la lecture la plus accessible pour commencer.

## Démarrage rapide

1. Ouvrez le dossier de votre projet avec votre agent IA (Claude Code, ChatGPT, Codex, ou un autre).
2. Dites-lui simplement : « installe AES Framework dans ce projet », en lui indiquant ce dépôt. Il lira [docs/INSTALLATION.md](docs/INSTALLATION.md) et se chargera de la mécanique technique.
3. Quand il vous le demandera, décrivez votre projet en quelques phrases (nom, objectif, périmètre) : c'est la seule chose qu'il ne peut pas deviner à votre place.

Vous préférez suivre la procédure vous-même, en détail ? Voir « Suivre la procédure vous-même » ci-dessous.

## Suivre la procédure vous-même

Pour comprendre l'esprit du framework avant de vous lancer, voir [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md).

Pour installer AES dans un projet, voir [docs/INSTALLATION.md](docs/INSTALLATION.md).

Pour l'utiliser au quotidien une fois installé, voir [docs/UTILISATION.md](docs/UTILISATION.md).

Pour les termes techniques rencontrés en chemin, un glossaire court se trouve dans [SYSTEM.md](SYSTEM.md).

## Structure du dépôt

- `SYSTEM.md`, `CHANGELOG.md`, `DECISIONS.md`, `AUDIT.md` : gouvernance du framework lui-même.
- `templates/` : les 13 gabarits copiés dans chaque projet utilisant AES.
- `docs/` : guides d'installation et d'utilisation.
- `examples/` : un exemple réel d'installation, issu d'un projet de test.

## Validation réelle

AES a été testé sur un projet réel (site vitrine Next.js), avec Claude Code et Codex. Le `ia/` réel qui en résulte est disponible dans [examples/nextjs-project](examples/nextjs-project), le récit complet du test dans [docs/Rapport-test-AES](docs/Rapport-test-AES).

## Auto-évaluation

Trois questions permettent à un développeur indépendant de vérifier, sur chaque projet, si AES tient encore ses promesses.

**Cohérence sur tous les projets**
Est-ce que ce projet suit la même méthode, les mêmes standards et la même structure que mes autres projets utilisant AES, ou est-ce que chacun a fini par vivre sa propre logique ?

**Avoir la main sur l'IA**
Est-ce que je comprends et je décide chaque changement important, ou est-ce que je laisse l'agent avancer sans vraiment regarder ce qu'il fait ?

**Gain de temps, éviter la répétition**
Est-ce qu'un nouvel agent, ou une nouvelle session, retrouve le contexte du projet sans que j'aie besoin de tout réexpliquer moi-même ?

## Version

Version actuelle : voir [SYSTEM.md](SYSTEM.md). Historique complet : voir [CHANGELOG.md](CHANGELOG.md).

## Licence

MIT, voir [LICENSE](LICENSE).
