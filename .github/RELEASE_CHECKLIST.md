# Checklist de publication AES Framework

Ce document n'appartient pas à la gouvernance du framework (SYSTEM.md §4). C'est un outil opérationnel pour le mainteneur, à parcourir avant de créer un tag Git et une Release GitHub. Il n'est ni chargé par un agent, ni copié dans un projet utilisant AES.

## Avant de committer

- [ ] Les quatre documents racine (SYSTEM.md, AUDIT.md, CHANGELOG.md, DECISIONS.md) portent exactement la même version.
- [ ] CHANGELOG.md contient une entrée à jour pour la version publiée.
- [ ] AUDIT.md reflète les audits réellement conclus, sans entrée manquante ni obsolète.
- [ ] `node install/validate_manifest.js` est valide.
- [ ] `node --test install/tests/test_installer.js install/tests/test_claude_code_integration.js` passe entièrement.
- [ ] `git status` ne révèle aucun fichier sensible (identifiants, tokens, chemins personnels) avant `git add`.
- [ ] README.md reflète l'état réel du dépôt (structure, version, liens).
- [ ] LICENSE est présent et à jour.

## Commit et tag

- [ ] Commit final créé avec un message conforme aux conventions du dépôt.
- [ ] Push vers `origin/main`.
- [ ] Tag Git créé sur la version publiée (ex. `v1.4.0`), correspondant exactement au champ Version de SYSTEM.md.

## Release GitHub

- [ ] Release GitHub créée à partir du tag.
- [ ] Notes de version reprenant le contenu de la section correspondante de CHANGELOG.md, sans le réécrire.
- [ ] Vérification que la CI (`.github/workflows/ci.yml`) est verte sur le commit taggé.

## Après publication

- [ ] Vérifier que le dépôt est accessible publiquement et que les liens internes (README, docs/) fonctionnent depuis GitHub.
- [ ] Consigner dans DECISIONS.md ou AUDIT.md toute décision ou tout audit qui aurait été omis avant la publication.
