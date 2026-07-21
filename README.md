# AI Engineering System (AES)

Un référentiel d'ingénierie pour encadrer la collaboration entre un développeur et un ou plusieurs agents d'intelligence artificielle.

Le développeur décide. Les agents assistent. Le framework garantit la cohérence.

## Qu'est-ce qu'AES ?

AES fournit une méthode de travail unique, reproductible et indépendante des outils utilisés des règles de comportement pour les agents, un processus de travail en neuf étapes, des standards techniques, et une documentation vivante qui évolue avec chaque projet.

Le framework est agnostique de tout agent IA (Claude Code, Codex, ou tout autre outil présent ou futur). Pour comprendre les principes qui le fondent, voir [docs/PHILOSOPHY.md](docs/PHILOSOPHY.md).

## Structure du dépôt

- `SYSTEM.md`, `CHANGELOG.md`, `DECISIONS.md`, `AUDIT.md` : gouvernance du framework lui-même.
- `templates/` : les 13 gabarits copiés dans chaque projet utilisant AES.
- `docs/` : guides d'installation et d'utilisation.
- `examples/` : un exemple réel d'installation, issu d'un projet de test.

## Démarrer

Pour installer AES dans un projet, voir [docs/INSTALLATION.md](docs/INSTALLATION.md).

Pour l'utiliser au quotidien une fois installé, voir [docs/UTILISATION.md](docs/UTILISATION.md).

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
