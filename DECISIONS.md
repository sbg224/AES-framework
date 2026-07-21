DECISIONS.md

AI Engineering System (AES)

Version : 1.2.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* CHANGELOG.md
* AUDIT.md

⸻

1. Objectif

Ce document conserve l’historique des décisions importantes prises sur le framework AI Engineering System (AES) lui-même.

Il permet de comprendre les choix structurants réalisés sur AES, leur contexte et leur justification.

⸻

2. Portée

Ce document documente exclusivement les décisions concernant le framework AES lui-même : sa gouvernance, sa structure documentaire, ses conventions.

Il ne doit pas être confondu avec le DECISIONS.md d’un projet utilisant AES, qui documente les décisions propres à ce projet à partir du gabarit `templates/DECISIONS.md`.

⸻

3. Organisation

Chaque décision reçoit un identifiant unique, préfixé AES-D pour le distinguer des identifiants ADR utilisés par les projets.

Exemple :

* AES-D001
* AES-D002
* AES-D003

Les identifiants ne sont jamais réutilisés.

⸻

4. Structure d’une décision

Chaque décision doit contenir au minimum :

Identifiant, Date, Auteur, Contexte, Décision, Justification, Alternatives étudiées, Conséquences, Statut.

Cette structure est identique à celle définie dans `templates/DECISIONS.md`.

⸻

5. Décisions

AES-D001 — SYSTEM.md reste à la racine du framework

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : INSTALLATION.md incluait SYSTEM.md dans la liste de copie destinée aux projets, au même titre que les fichiers de `templates/`, alors que SYSTEM.md est physiquement à la racine du dépôt. Cette divergence entre l’arborescence et les instructions d’installation constituait une incohérence architecturale relevée lors de l’audit de cohérence documentaire (AES-A001).

Décision : SYSTEM.md reste à la racine du framework, hors de `templates/`, tout en continuant d’être copié dans chaque projet au même titre que les documents de référence.

Justification : SYSTEM.md définit la gouvernance du framework lui-même, pas un gabarit propre à un projet particulier. Sa place naturelle est à la racine, aux côtés de CHANGELOG.md. Corriger INSTALLATION.md pour expliciter cette distinction est plus cohérent que déplacer le fichier dans `templates/`, qui aurait dilué sa nature de document fondateur parmi les gabarits.

Alternatives étudiées : déplacer SYSTEM.md dans `templates/` pour uniformiser la liste de copie.

Conséquences : INSTALLATION.md §3 distingue désormais explicitement les documents copiés depuis la racine et ceux copiés depuis `templates/`.

Statut : Validée

⸻

AES-D002 — CHANGELOG.md existe en deux instances distinctes

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : CHANGELOG.md n’existait qu’à la racine du dépôt, mais était référencé par AUDIT.md, DECISIONS.md et LEARNING.md comme un document vivant propre à chaque projet. INSTALLATION.md ne le proposait pourtant pas dans sa liste de copie, laissant un projet installé selon la procédure sans CHANGELOG.md alors que plusieurs documents supposaient son existence.

Décision : CHANGELOG.md existe en deux instances distinctes et non interchangeables : celui de la racine documente l’évolution du framework AES lui-même ; `templates/CHANGELOG.md` est le gabarit copié dans chaque projet pour documenter l’évolution de ce projet.

Justification : un seul fichier ne peut pas honnêtement documenter à la fois l’évolution du framework et celle de chaque projet qui l’utilise. Deux instances suivant la même convention (SemVer, catégories Added/Changed/…) préservent la cohérence sans forcer un contenu unique à jouer deux rôles.

Alternatives étudiées : un unique CHANGELOG.md générique, adapté au cas par cas selon le contexte.

Conséquences : `templates/CHANGELOG.md` ajouté à la liste de copie d’INSTALLATION.md §3.

Statut : Validée

⸻

AES-D003 — Définition officielle de « Documents liés »

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : la section « Documents liés », présente dans chaque document du framework, n’avait jamais de définition explicite. L’analyse a montré qu’au moins trois significations différentes coexistaient implicitement (dépendance normative, impact potentiel, proximité de lecture), ce qui rendait la liste ambiguë pour quiconque devrait en créer une nouvelle.

Décision : « Documents liés » désigne un parcours de lecture recommandé pour comprendre, utiliser, modifier ou faire évoluer correctement le document courant. Ce n’est pas un graphe de dépendances formel, et aucune relation bidirectionnelle n’est obligatoire.

Justification : cette définition reste compatible avec tous les usages déjà observés dans le corpus, sans imposer une taxonomie plus complexe (dépendance amont / impact aval / proximité) qui contredirait le principe de simplicité du framework.

Alternatives étudiées : typer formellement chaque relation (dépendance, impact, complémentarité) dans des listes séparées.

Conséquences : définition intégrée à SYSTEM.md §6.

Statut : Validée

⸻

AES-D004 — Formalisation du principe de source de vérité unique

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : le principe « une information importante ne doit exister qu’à un seul endroit » existait déjà dans PHILOSOPHY.md (l’esprit) et dans AGENT.md (l’instruction opérationnelle), mais sans identifiant, contrairement aux dix autres règles de comportement de l’agent.

Décision : le principe est formalisé en AES-R011 dans RULES_OF_ENGAGEMENT.md ; AGENT.md cite désormais AES-R011 plutôt que de reformuler la règle en prose libre.

Justification : le principe était déjà normatif dans les faits ; lui donner un identifiant le rend traçable et citable au même titre que les dix autres règles, et réduit le risque qu’un futur éditeur le reformule sans s’apercevoir qu’il s’écarte d’une règle du framework. C’est déjà arrivé une fois avec AGENT.md, avant sa correction.

Alternatives étudiées : laisser le principe non formalisé, en s’appuyant uniquement sur PHILOSOPHY.md et AGENT.md.

Conséquences : RULES_OF_ENGAGEMENT.md gagne un onzième identifiant (AES-R011) ; AGENT.md §3 reformulé pour le citer.

Statut : Validée

⸻

AES-D005 — Auto-application partielle d’AES à sa propre gouvernance

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : le framework impose à tout projet de tenir un CONTEXT.md, un DECISIONS.md, un AUDIT.md, un LEARNING.md et un CHANGELOG.md, mais AES lui-même n’appliquait cette discipline qu’à CHANGELOG.md (AES-D002). Plusieurs décisions structurantes prises sur AES au cours de cette conversation (AES-D001 à AES-D004) n’avaient aucun emplacement durable où être consignées.

Décision : AES applique à sa propre gouvernance uniquement DECISIONS.md et AUDIT.md à la racine du dépôt, en plus de CHANGELOG.md déjà existant. CONTEXT.md, ARCHITECTURE.md, STACK.md et LEARNING.md ne sont pas dupliqués à la racine.

Justification : DECISIONS.md et AUDIT.md ont une valeur immédiate et démontrée (consigner les arbitrages de cette conversation, tracer les audits déjà réalisés) ; CONTEXT.md, ARCHITECTURE.md et STACK.md supposent un contexte métier, une architecture applicative et une stack technique qu’un framework purement documentaire n’a pas. Les appliquer aurait été un remplissage artificiel.

Alternatives étudiées : auto-application intégrale des cinq documents vivants ; aucune auto-application ; création d’un dossier `governance/` dédié plutôt que d’utiliser la racine du dépôt.

Conséquences : création de DECISIONS.md et AUDIT.md à la racine, distincts des gabarits `templates/` ; SYSTEM.md §11 documente ce principe ; INSTALLATION.md exclut ces deux fichiers de la liste de copie, au même titre que CHANGELOG.md racine.

Statut : Validée

⸻

AES-D006 — Politique de versionnement des gabarits

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : le champ « Version » des gabarits de `templates/` n’était pas fiablement mis à jour dans la pratique (plusieurs documents modifiés en profondeur restaient à leur version initiale). Une revue contradictoire (AES-A002) a par ailleurs montré qu’un champ « Compatible avec AES vX.Y.Z » risquait d’être mal interprété comme une affirmation de fraîcheur de contenu, alors que le contenu d’un document vivant diverge fortement de son gabarit d’origine après des années d’usage dans un projet.

Décision : les gabarits de `templates/` n’ont plus de version propre. Ils portent un champ « Structure : issue d’AES vX.Y.Z », qui énonce un fait historique (l’origine structurelle du document), pas une compatibilité continue. SYSTEM.md reste l’unique source du numéro de version faisant autorité pour le framework.

Justification : un fait historique reste vrai indéfiniment, contrairement à une affirmation de compatibilité qui peut devenir trompeuse. Cette formulation conserve la simplicité déjà recherchée (un seul numéro de version à maintenir) tout en répondant précisément à l’ambiguïté relevée.

Alternatives étudiées : conserver une version propre par document (déjà démontrée peu fiable) ; suivre deux axes de version distincts (structure et contenu), jugé disproportionné pour un framework à vocation simple.

Conséquences : renommage du champ dans les 13 fichiers de `templates/` ; nouvelle section « Convention de version » dans SYSTEM.md §7 ; SYSTEM.md passe en version 1.1.0.

Statut : Validée

⸻

AES-D007 — Nom officiel du dossier d’installation : `ia/` plutôt que `.ia/`

Date : 2026-07-18

Auteur : Développeur, avec l’agent

Contexte : la documentation utilisait jusqu’ici deux orthographes incohérentes du dossier d’installation (`.ai/` à une étape d’INSTALLATION.md, `.ia/` ailleurs), sans qu’aucune analyse n’ait jamais comparé ce choix à une alternative sans point. Une réserve a été soulevée : contrairement aux dossiers pointés habituels (`.github/`, `.vscode/`, `.claude/`), qui contiennent de la configuration d’outillage consultée occasionnellement, le dossier d’AES contient des documents vivants (CONTEXT.md, DECISIONS.md, AUDIT.md, LEARNING.md) destinés à être consultés et modifiés en permanence par les développeurs comme par les agents.

Décision : le nom officiel du dossier d’installation est `ia/`, sans point.

Justification : la nature du contenu du dossier ne correspond pas à celle des dossiers pointés habituels. Ce n’est pas de la configuration d’outillage, c’est la base de connaissances vivante du projet (contexte, décisions, apprentissages), au même titre que ce qu’un dossier `docs/` ou `docs/adr/` contient dans la plupart des écosystèmes, conventions qui ne sont jamais cachées. Un dossier caché réduit la découvrabilité pour un humain (absent d’un `ls` sans option, moins visible dans un explorateur de fichiers) au moment précis où AES cherche à centraliser des connaissances importantes du projet, ce qui contredit sa propre mission. Plus significatif encore : plusieurs agents IA appliquent des heuristiques d’exploration qui traitent différemment les fichiers cachés lors d’une recherche large de contexte, ce qui pourrait directement nuire à l’objectif premier d’AES, qui est de rendre son contenu disponible à tout agent. Ce risque ne s’applique à aucun des dossiers pointés cités en comparaison, dont le contenu n’est de toute façon jamais destiné à être chargé comme contexte de travail par un agent.

Alternatives étudiées : `.ia/` (précédent par défaut, en s’appuyant sur la convention `.github/`/`.vscode/`/`.claude/`) ; `.ai/` (orthographe concurrente déjà présente par erreur dans INSTALLATION.md).

Conséquences : uniformisation de toutes les références documentaires sur `ia/` ; correction de l’incohérence `.ai/`/`.ia/` préexistante dans INSTALLATION.md ; renommage du dossier d’exemple `examples/nextjs-project/.ia` en `examples/nextjs-project/ia`.

Statut : Validée

⸻

AES-D008 — Introduction du concept de socle documentaire

Date : 2026-07-20

Auteur : Développeur, avec l’agent

Contexte : la consultation sélective (WORKFLOW.md §3, AGENT.md §3) s’appliquait uniformément à tous les documents du framework, y compris RULES_OF_ENGAGEMENT.md. Le rapport de test réel a montré qu’un agent pouvait ne jamais consulter ce document pendant une session, rendant ses règles inopérantes en pratique malgré leur existence formelle.

Décision : SYSTEM.md, RULES_OF_ENGAGEMENT.md, WORKFLOW.md et AGENT.md forment désormais un socle chargé automatiquement dès le début d’une session, quel que soit l’agent utilisé. Les autres documents restent consultés sélectivement.

Justification : ces quatre documents définissent la gouvernance, les règles de comportement et le processus applicables à toute intervention, indépendamment de la tâche en cours. Ils ne peuvent pas dépendre d’une consultation à la demande sans risquer de ne jamais être lus. Les autres documents (CONTEXT.md, STACK.md, etc.) restent légitimement sélectifs, car leur pertinence dépend de la tâche.

Alternatives étudiées : maintenir la consultation sélective pour tous les documents, en comptant sur la qualité des règles seules pour inciter à leur lecture ; rendu caduque par le constat du test réel.

Conséquences : SYSTEM.md §4 définit le socle ; AGENT.md §3 et WORKFLOW.md §3 y renvoient sans le reformuler (AES-R011) ; INSTALLATION.md §6 précise le rattachement concret par agent.

Statut : Validée

⸻

AES-D009 — Support de l’onboarding sur projet existant

Date : 2026-07-21

Auteur : Développeur, avec l’agent

Contexte : AES supposait un projet neuf sans code ni historique. Rien ne prévoyait l’adoption sur un projet déjà en cours.

Décision : INSTALLATION.md distingue deux parcours. Sur un projet existant, l’agent produit un premier jet de STACK.md et ARCHITECTURE.md à partir du code, jamais de CONTEXT.md, qui reste dialogué. DECISIONS.md reste vide par défaut, avec reconstitution ciblée possible, à la demande du développeur uniquement.

Justification : le code révèle le QUOI, jamais le POURQUOI, qui n’existe que dans la connaissance du développeur. Cette distinction structure toute la proposition.

Alternatives étudiées : extraction automatique complète y compris CONTEXT.md, écartée, impossible à faire honnêtement à partir du seul code ; reconstitution systématique de DECISIONS.md, écartée, risque de justifications fabriquées.

Conséquences : docs/INSTALLATION.md §3 restructuré en deux parcours ; templates/DECISIONS.md §4 précise la reconstitution ciblée.

Statut : Validée

⸻

6. Bonnes pratiques

Une décision doit :

* être claire ;
* être justifiée ;
* être traçable ;
* pouvoir être comprise plusieurs mois ou années plus tard.

Les décisions mineures ne sont pas documentées ici. Seuls les choix ayant un impact structurant sur le framework sont enregistrés.

⸻

7. Évolution

Une décision validée n’est jamais supprimée.

Si elle devient obsolète, son statut est mis à jour et une nouvelle décision est créée pour la remplacer.

⸻

8. Références

Ce document s’appuie sur AUDIT.md (racine), lorsqu’un audit du framework conduit à une décision.

Les décisions peuvent entraîner des mises à jour de :

* SYSTEM.md ;
* CHANGELOG.md.
