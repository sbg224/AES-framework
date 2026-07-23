DECISIONS.md

AI Engineering System (AES)

Version : 1.4.1

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

AES-D010 — Vérification de conformité centralisée et installation outillée

Date : 2026-07-22

Auteur : Développeur, avec l’agent

Contexte : un incident réel (projet 3M Drive) a montré qu’une recommandation technique pouvait être proposée sans consultation effective de DECISIONS.md, malgré une mention en prose dans WORKFLOW.md. Une première architecture fondée sur un hook expérimental et un sous-agent dédié a été écartée, jugée fragile, coûteuse et non portable vers Codex.

Décision : la vérification de conformité est centralisée dans une règle unique, AES-R014 (RULES_OF_ENGAGEMENT.md), détaillée dans WORKFLOW.md, Étape 1. Chaque intégration agent (`integrations/<agent>/`) se limite à déclencher cette procédure dans le format propre à l’outil, sans la redécrire. La liste des fichiers installables et du socle est déplacée dans une source de vérité unique, `install/installation.manifest.json`, dont la synchronisation avec INSTALLATION.md et avec le système de fichiers est vérifiée automatiquement plutôt que supposée. Un installateur (`install/installer.js`) sépare strictement l’analyse, toujours sûre, de l’application, protégée par des préconditions git et une politique de non-écrasement fondée sur le statut de chaque document.

Justification : la première architecture reproduisait, par un mécanisme différent, le même défaut que l’incident initial, une garantie qui dépend du bon vouloir du raisonnement plutôt que d’un mécanisme vérifiable. La centralisation de la procédure évite la duplication qu’une intégration par agent aurait sinon produite (AES-R011). Le manifeste évite qu’un script et la documentation maintiennent chacun leur propre liste, avec le risque de divergence déjà rencontré une fois avec le champ « Version » des gabarits (AES-D006).

Alternatives étudiées : hook `agent` expérimental déclenchant un sous-agent dédié, écartée (voir contexte) ; réécriture de la procédure dans chaque intégration agent, écartée pour duplication ; liste des fichiers installables codée en dur dans le script, écartée pour risque de divergence avec la documentation.

Conséquences : RULES_OF_ENGAGEMENT.md gagne un quatorzième identifiant (AES-R014) ; WORKFLOW.md Étape 1 précise la procédure ; `integrations/claude-code/skills/aes-check/` devient un déclencheur fin ; `install/` regroupe le manifeste, l’installateur, sa validation et ses tests ; SYSTEM.md passe en version 1.3.0.

Statut : Validée

⸻

AES-D011 — Node.js comme runtime de l’installateur

Date : 2026-07-22

Auteur : Développeur, avec l’agent

Contexte : l’installateur (AES-D010) a d’abord été écrit en Python, un choix fait sans être soumis à validation, alors qu’aucune décision documentée ne le fixait. Une fois signalé, le développeur a précisé l’orientation réellement souhaitée : Node.js, pour la cohérence avec l’écosystème des projets cibles (JavaScript/Node), une exécution facilitée via npx à terme, l’absence de dépendance supplémentaire à un autre langage, et une distribution future simplifiée via npm.

Décision : l’installateur AES (`install/installer.js`, `install/validate_manifest.js`, `install/tests/test_installer.js`) est écrit en Node.js, modules natifs uniquement (`fs`, `path`, `child_process`, `node:test`, `node:assert`), sans dépendance ajoutée au projet cible. Son architecture reste compatible avec une future exécution via `npx`.

Justification : les projets cibles (3M Drive, GM_Communication, FrigoCheck) appartiennent à l’écosystème JavaScript/Node ; y ajouter une dépendance à Python pour l’outillage AES aurait introduit une friction sans bénéfice technique démontré. Le manifeste JSON, les fixtures et le protocole comportemental restent indépendants du langage, seule l’implémentation de l’installateur est concernée.

Alternatives étudiées : conserver l’implémentation Python déjà écrite, écartée en l’absence de raison technique forte et par cohérence avec l’écosystème des projets cibles.

Conséquences : `install/installer.py`, `install/validate_manifest.py` et `install/tests/test_installer.py` supprimés après vérification de parité stricte (mêmes 9 scénarios de test, même sortie sur `examples/nextjs-project`, mêmes fichiers produits sur une installation neuve) ; INSTALLATION.md, CHANGELOG.md et DECISIONS.md mis à jour pour référencer les fichiers `.js`.

Statut : Validée

⸻

AES-D012 — Architecture d'installation des intégrations d'agents

Date : 2026-07-22

Auteur : Développeur, avec l'agent

Contexte : AES-A004/AES-A005 (AUDIT.md racine) ont établi que le déploiement de `/aes-check` (skill Claude Code, hook) dans un projet cible n'est ni outillé ni documenté de façon actionnable, contrairement au socle `ia/`. Une analyse d'architecture contradictoire a écarté deux options, étendre le manifeste du socle (mélangerait deux natures de protection différentes) et dupliquer un installateur complet par agent (reproduirait la duplication qu'AES-R011 interdit par ailleurs). Une vérification de bout en bout a ensuite révélé que le périmètre initialement envisagé (skill et hook seuls) était incomplet, sans le script exécuté par le hook ni le rattachement du socle dans CLAUDE.md, le projet cible ne serait pas réellement opérationnel après installation. Une recherche dans la documentation officielle de Claude Code a confirmé l'existence d'un mécanisme natif, la syntaxe d'import `@chemin/vers/fichier` dans CLAUDE.md, chargée au lancement, récursive, sans dupliquer le contenu importé.

Décision : l'installateur AES reste un point d'entrée CLI unique. Les garanties transverses (préconditions git, écriture atomique, vocabulaire de statuts, agrégation d'état global) restent centralisées et partagées. Chaque intégration d'agent est isolée dans son propre module (`install/integrations/<agent>.js`) et son propre manifeste, jamais mêlée au manifeste du socle `ia/`. Pour Claude Code, le périmètre complet de l'intégration comprend quatre artefacts :

* `SKILL.md`, copié dans `.claude/skills/aes-check/`, statut référence (🟡), classifié REVIEW en cas de modification locale, jamais CONFLICT ;
* `aes-reminder.sh`, copié dans `.claude/hooks/`, avec restauration explicite du bit exécutable (chmod 755) après écriture ;
* une entrée de hook dans `.claude/settings.json`, générée par le module d'intégration avec le chemin réellement installé dans le projet cible, jamais copiée telle quelle depuis l'organisation interne du dépôt AES, fusionnée de façon strictement additive (aucun remplacement du fichier, préservation de toute configuration existante, blocage sans tentative de réparation en cas de JSON invalide ou de structure inattendue) ;
* un bloc balisé minimal dans CLAUDE.md, utilisant la syntaxe d'import officielle de Claude Code pour référencer les quatre documents du socle sans dupliquer leur contenu, sans référence à un numéro de section susceptible de devenir obsolète, fusionné selon le même principe additif que `settings.json` (identification par marqueurs, jamais de remplacement du reste du fichier).

Le manifeste `install/integrations/claude_code.manifest.json` décrit explicitement, pour chaque artefact, la nature de l'opération à effectuer (`copie`, `fusion_json`, `fusion_markdown`), pas seulement un chemin de destination. La classification et l'écriture se font en fonction de ce champ, jamais en le déduisant de l'extension ou de l'emplacement du fichier.

L'installateur ne modifie jamais CLAUDE.md en dehors du bloc délimité par ses propres marqueurs (`<!-- AES:SOCLE:BEGIN -->` / `<!-- AES:SOCLE:END -->`). Tout contenu du fichier situé hors de ce bloc, quel qu'il soit, est préservé à l'identique, y compris sa mise en forme et son ordre.

Les dix autres documents `ia/` (STANDARDS, STACK, ARCHITECTURE, CONTEXT, PROMPTS, CHECKLIST, DECISIONS, AUDIT, LEARNING, CHANGELOG) restent consultés à la demande par l'agent, sans mécanisme de chargement automatique supplémentaire. Seule l'intégration Claude Code est implémentée dans cette phase ; aucune généralisation multi-agents (registre, système de plugins) n'est construite tant qu'un deuxième agent réel n'est pas validé.

Justification : préserve l'agnosticisme du cœur, aucune ligne du manifeste `ia/` ni des documents socle ne mentionne un agent précis, tout en évitant la duplication des garanties déjà écrites et testées. Le choix de la fusion additive découle du constat que `settings.json` et CLAUDE.md n'appartiennent jamais entièrement à AES, contrairement aux documents de `ia/`. L'usage de la syntaxe d'import native plutôt qu'une duplication de contenu applique directement AES-R011 par le mécanisme que Claude Code prévoit lui-même à cet effet, plutôt que par une convention propre à AES. La correspondance entre chargement automatique (`@import`, au lancement) et consultation sélective (lecture à la demande par l'agent) reproduit exactement la distinction qu'AES fait déjà entre socle et documents de référence, sans qu'aucune adaptation de fond n'ait été nécessaire.

Alternatives étudiées : extension du manifeste existant, écartée (mélange deux natures de protection) ; un installateur indépendant par agent, écarté (duplication des garanties transverses, contraire à AES-R011 appliqué au code) ; généralisation multi-agents immédiate, écartée (généralité spéculative avec un seul agent réel) ; reproduction du chemin interne au dépôt AES dans le hook installé, écartée (produirait une configuration silencieusement cassée) ; bloc CLAUDE.md en prose dupliquant la description du socle, écarté au profit de l'import natif, qui référence sans dupliquer et reste stable indépendamment de toute renumérotation de section.

Conséquences : nouveau module partagé `install/lib/core.js` (garanties transverses extraites de `install/installer.js` pour éviter toute dépendance circulaire avec les intégrations) ; nouveaux fichiers sous `install/integrations/` (module et manifeste dédiés à Claude Code) ; nouvelle sous-commande `integration analyze|apply claude-code <projet>` ; INSTALLATION.md §6 et `install/README.md` mis à jour pour documenter cette procédure de façon actionnable ; fermeture d'AES-A004/AES-A005 une fois la recommandation appliquée. Les tests d'intégration incluent explicitement un scénario de CLAUDE.md fortement personnalisé (contenu, sections et mise en forme propres à un projet réel), vérifiant qu'il est préservé à l'identique en dehors du seul bloc balisé AES, aussi bien lors d'une première installation que lors d'une réapplication. SYSTEM.md passe en version 1.4.0.

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
