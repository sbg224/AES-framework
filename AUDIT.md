AUDIT.md

AI Engineering System (AES)

Version : 1.4.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* SYSTEM.md
* CHANGELOG.md
* DECISIONS.md

⸻

1. Objectif

Ce document centralise les résultats des audits réalisés sur le framework AI Engineering System (AES) lui-même.

Il permet de suivre son niveau de cohérence, d’identifier les risques documentaires et de mesurer les améliorations au fil du temps.

⸻

2. Portée

Ce document documente exclusivement les audits portant sur le framework AES lui-même : sa cohérence documentaire, sa gouvernance, son architecture.

Il ne doit pas être confondu avec l’AUDIT.md d’un projet utilisant AES, qui évalue ce projet à partir du gabarit `templates/AUDIT.md`.

⸻

3. Organisation

Chaque audit reçoit un identifiant unique, préfixé AES-A comme dans `templates/AUDIT.md`.

Les identifiants ne sont jamais réutilisés. Aucune ambiguïté de préfixe n’existe ici, contrairement à DECISIONS.md. Les audits du framework et ceux d’un projet utilisent le même préfixe AES-A, mais vivent dans des documents distincts (racine vs `templates/`), ce qui suffit à les distinguer.

⸻

4. Structure d’un audit

Identifiant, Date, Auteur, Domaine, Résumé, Constats, Recommandations, Priorité, Statut.

Cette structure est identique à celle définie dans `templates/AUDIT.md`.

⸻

5. Audits

AES-A001 — Audit de cohérence documentaire globale

Date : 2026-07-18

Auteur : Agent, à la demande du développeur

Domaine : Documentation, Architecture

Résumé : audit de cohérence de l’ensemble des documents du framework (métadonnées, structure, références croisées, terminologie, gouvernance) avant publication de la version 1.0.

Constats :

* désynchronisation systémique entre les listes « Documents liés » (en-tête) et les sections « Références » (pied de document) sur 9 documents sur 11 ;
* CHANGELOG.md sans bloc de métadonnées et absent de la liste de copie d’INSTALLATION.md ;
* SYSTEM.md classé avec les gabarits `templates/` dans INSTALLATION.md alors que physiquement à la racine ;
* duplication du contenu normatif entre AGENT.md et RULES_OF_ENGAGEMENT.md ;
* incohérences mineures de numérotation et de terminologie (Mission / Objet / Objectif).

Recommandations :

* resynchroniser les références croisées document par document ;
* séparer les deux CHANGELOG.md par portée ;
* corriger INSTALLATION.md plutôt que déplacer SYSTEM.md ;
* faire renvoyer AGENT.md à RULES_OF_ENGAGEMENT.md plutôt que reformuler.

Priorité : Élevée

Statut : Corrigé (voir AES-D001, AES-D002 dans DECISIONS.md)

⸻

AES-A002 — Revue contradictoire des arbitrages de gouvernance

Date : 2026-07-18

Auteur : Agent, à la demande du développeur, en confrontant une seconde analyse indépendante

Domaine : Gouvernance, Documentation

Résumé : contre-analyse critique des conclusions d’AES-A001, destinée à distinguer les incohérences réelles des différences d’interprétation avant de clore la phase de conception.

Constats :

* la sémantique de « Documents liés » n’était pas définie, malgré la resynchronisation des listes réalisée sous AES-A001 (la forme avait été corrigée, pas le fond) ;
* la discipline de versionnement par document n’était pas tenue (plusieurs fichiers modifiés en profondeur restés en version 1.0.0) ;
* AES ne s’appliquait pas à lui-même malgré des décisions structurantes prises sans emplacement durable pour les consigner.

Recommandations :

* formaliser la définition de « Documents liés » ;
* réévaluer la politique de versionnement ;
* envisager une auto-application partielle du framework.

Priorité : Élevée

Statut : Corrigé (voir AES-D003, AES-D004, AES-D005 et AES-D006 dans DECISIONS.md). La politique de versionnement, alors ouverte, a été tranchée sous AES-D006.

⸻

AES-A003 — Campagne de durcissement comportemental des règles

Date : 2026-07-20

Auteur : Agent, à la demande du développeur, à partir des constats du rapport de test réel (RAPPORT-FINAL-TEST-AES-v1.1.md)

Domaine : Gouvernance, Comportement des agents, Documentation

Résumé : mise en œuvre de la feuille de route issue du test réel d’AES v1.1 sur un projet concret, pour rendre les règles réellement exécutoires, pas seulement descriptives.

Constats :

* les règles comportementales n’étaient pas garanties d’être chargées avant qu’un agent agisse ;
* la validation d’un plan pouvait être ambiguë, sans distinction entre traiter la demande, valider le plan et valider la documentation ;
* aucune règle ne couvrait les actions git ni la détection de données sensibles avant un commit ;
* les vérifications techniques pouvaient être cochées sans être réellement exécutées ;
* le premier nettoyage des tirets cadratins n’avait pas couvert les deux-points injustifiés, laissant des occurrences non corrigées.

Recommandations :

* mesurer empiriquement l’effet d’AES sur la consommation de tokens : 3 à 5 tâches comparables, exécutées avec et sans AES sur un même projet, mesure des tokens consommés, des allers-retours de clarification et des corrections après coup, résultats consignés dans un futur AES-A ;
* revalider périodiquement, par recherche systématique, l’absence de tirets cadratins et de deux-points injustifiés dans le corpus.

Priorité : Élevée

Statut : Corrigé (voir AES-R012, AES-R013, AES-D008 dans DECISIONS.md). Le protocole de mesure de la consommation de tokens reste à exécuter.

⸻

AES-A004 — Audit documentaire global avant clôture du chantier conformité/installation

Date : 2026-07-22

Auteur : Agent, à la demande du développeur

Domaine : Documentation, Installation, Gouvernance

Résumé : audit de cohérence de l'ensemble du corpus (racine, `templates/`, `docs/`, `install/`, `integrations/`, `examples/`) avant de considérer le framework stabilisé en version 1.3.0 : liens cassés, références vers des fichiers inexistants, règles contradictoires, doublons, documents obsolètes. Exécution de `install/validate_manifest.js` (résultat : valide) et de `node --test install/tests/test_installer.js` (résultat : 9/9) en complément de la lecture.

Constats :

* aucun lien cassé, aucune référence pendante, aucun identifiant AES-R/AES-D/AES-A/AES-S dupliqué ou réutilisé n'a été trouvé ; le manifeste, INSTALLATION.md, le système de fichiers et les statuts déclarés concordent exactement ;
* trou opérationnel entre ce qui est décrit et ce qui est outillé : INSTALLATION.md §6 et CHANGELOG.md 1.3.0 présentent `integrations/claude-code/skills/aes-check/` et `integrations/claude-code/hooks/` comme le mécanisme actif d'AES-R014, mais aucun document ni script (`install/installer.js` inclus) ne décrit comment ces fichiers sont effectivement déployés dans un projet cible ; ce manque n'est pas non plus recensé dans les « Limites connues » d'`install/README.md` §9 ;
* duplication structurelle de la liste « Documents liés » dans sa propre section de clôture (« Références » ou équivalent), verbatim, au sein d'un même document, constatée dans SYSTEM.md, RULES_OF_ENGAGEMENT.md, WORKFLOW.md et STANDARDS.md ; les deux listes sont aujourd'hui synchronisées partout, mais aucun mécanisme automatique ne garantit qu'elles le restent, contrairement au manifeste ;
* incohérence mineure et cosmétique d'apostrophes droites au lieu de courbes, notamment dans `examples/nextjs-project/ia/CONTEXT.md` et plusieurs documents de `docs/Rapport-test-AES/`.

Recommandations :

* documenter, dans INSTALLATION.md §6 ou `install/README.md`, une procédure explicite (manuelle ou outillée) de déploiement d'`integrations/claude-code/` dans un projet cible, ou à défaut consigner ce manque dans les « Limites connues » ;
* trancher entre supprimer la duplication (ne garder que « Documents liés ») ou la conserver en l'assortissant d'une vérification automatique comparable à `validate_manifest.js` ;
* corriger les apostrophes droites relevées, sans urgence.

Priorité : Élevée pour le premier constat, Moyenne pour les deux suivants.

Statut : Corrigé (voir AES-A005, revue contradictoire ayant requalifié ces constats, et AES-D012 dans DECISIONS.md pour l'architecture retenue et son implémentation)

⸻

AES-A005 — Revue contradictoire d'AES-A004

Date : 2026-07-22

Auteur : Agent, à la demande du développeur, en confrontant une seconde analyse d'architecture avant toute correction

Domaine : Gouvernance, Documentation, Installation

Résumé : contre-analyse critique des deux constats non triviaux d'AES-A004, demandée explicitement par le développeur pour distinguer une réelle lacune d'architecture d'un comportement volontaire, avant d'appliquer la moindre correction. Mêmes méthode et posture qu'AES-A002 vis-à-vis d'AES-A001 : l'entrée d'origine n'est pas réécrite, ses constats sont requalifiés ici.

Constats :

* le second constat d'AES-A004 (trou entre INSTALLATION.md/CHANGELOG.md et l'installateur autour de `/aes-check`) est réel, mais sa gravité était surestimée. INSTALLATION.md §6 assume déjà que le rattachement à un agent est manuel ; l'asymétrie précise est que la sous-section « Rattachement du socle » donne un exemple concret et actionnable (référencer les quatre fichiers du socle dans CLAUDE.md) alors que « Vérification de conformité » n'en donne pas d'équivalent pour `integrations/claude-code/`. Surtout, AES-R014 et sa procédure vivent dans RULES_OF_ENGAGEMENT.md et WORKFLOW.md Étape 1, deux documents du socle chargés automatiquement indépendamment de `/aes-check` ; ce dernier n'est qu'un déclencheur ergonomique et un rappel non bloquant (le hook renvoie `suppressOutput: true`). Le manque porte sur le confort d'installation, pas sur la garantie elle-même ;
* le troisième constat d'AES-A004 (duplication « Documents liés » / « Références ») mélangeait deux notions distinctes : la duplication de contenu normatif, que vise AES-R011, et la duplication de navigation documentaire, qui n'entre pas dans son périmètre. Or AES-D003 prévoit explicitement qu'une section de clôture ajoute, en prose, la nature de la relation que le header ne formalise pas (« explicitée en prose dans le document lui-même, pas dans l'intitulé de la liste »). Relecture document par document : SYSTEM.md, RULES_OF_ENGAGEMENT.md, WORKFLOW.md et STANDARDS.md ajoutent chacun une phrase relationnelle distincte, conforme à AES-D003, pas une simple répétition. Seuls CONTEXT.md §9 et ARCHITECTURE.md §10 répètent la liste sans nuance ajoutée, sans qu'aucune divergence entre les deux listes n'ait été observée en 3 versions majeures (1.1.0 à 1.3.0) ;
* le précédent cité par AES-A004 (AES-A001) portait sur un problème plus grave et différent, désynchronisation totale, absence de section de clôture sur plusieurs documents, déjà corrigé par AES-D003. Le comparer au motif actuel, résiduel et largement conforme, surestimait la portée du constat.

Recommandations :

* ajouter à INSTALLATION.md §6, sous « Vérification de conformité », une instruction de rattachement aussi concrète que celle déjà donnée pour le socle (chemin cible dans `.claude/` pour Claude Code) ; ne pas étendre `install/installer.js` à ce périmètre, ce qui couplerait un installateur volontairement agnostique aux conventions d'un outil précis, pour un bénéfice marginal et alors qu'une seule intégration (Claude Code) est aujourd'hui vérifiée ;
* aucune action requise sur la structure « Documents liés » / « Références » ; ne pas fusionner, ne pas généraliser une vérification automatique, une correction serait disproportionnée par rapport à un risque resté théorique. Amélioration rédactionnelle mineure possible sur CONTEXT.md et ARCHITECTURE.md, sans urgence.

Priorité : Moyenne pour le premier constat (requalifié depuis Élevée), Faible pour le second (requalifié depuis Moyenne, non-problématique dans la majorité des cas examinés).

Statut : Corrigé (voir AES-D012, DECISIONS.md ; recommandations implémentées : `install/integrations/claude_code.js`, `install/lib/core.js`, sous-commande `integration analyze|apply`, tests dédiés 13/13, INSTALLATION.md §6 et install/README.md mis à jour)

⸻

AES-A006 — Audit d'accessibilité et d'expérience utilisateur

Date : 2026-07-23

Auteur : Agent, à la demande du développeur

Domaine : Accessibilité, Expérience utilisateur, Documentation

Résumé : audit sur dix points (public cible, lisibilité, vocabulaire, parcours d'entrée, charge cognitive, cohérence des exemples, ton, structure de navigation, accessibilité du glossaire, cohérence entre promesse et registre) portant sur l'ensemble du corpus destiné à un lecteur externe (README.md, SYSTEM.md, docs/PHILOSOPHY.md, docs/INSTALLATION.md, docs/UTILISATION.md), avant la première publication publique du framework.

Constats :

* le mot « développeur », employé sans définition dans tout le corpus, et le registre technique général du framework contredisaient l'ambition affichée d'un outil accessible à un public débutant ou pratiquant le vibe coding (construire un projet en dialoguant avec une IA sans nécessairement écrire ou lire soi-même le code produit) ;
* aucun document n'énonçait explicitement ce qu'AES fait et ne fait pas, ni pour qui il est pensé, avant de détailler sa mécanique interne ;
* README.md ouvrait directement sur une description technique (« référentiel d'ingénierie ») sans point d'entrée progressif pour un lecteur non technique ;
* docs/INSTALLATION.md décrivait la procédure complète sans indiquer, dès l'introduction, qu'elle peut être entièrement déléguée à un agent IA ;
* aucun glossaire des termes récurrents (gouvernance, socle, conformité, référentiel, manifeste, idempotence) n'existait pour un lecteur découvrant le framework.

Recommandations :

* redéfinir explicitement « développeur » dans SYSTEM.md et l'appliquer implicitement à l'ensemble du corpus plutôt que de le répéter document par document ;
* ajouter un glossaire court dans SYSTEM.md, référencé depuis README.md ;
* restructurer README.md avec un point d'entrée par public (« Pour qui ? ») et un parcours guidé (« Démarrage rapide ») avant la description technique détaillée ;
* cadrer docs/INSTALLATION.md dès son introduction comme une référence pouvant être déléguée à un agent IA ;
* ajouter une phrase d'ouverture accessible dans docs/PHILOSOPHY.md.

Priorité : Élevée.

Statut : Corrigé. SYSTEM.md §2 (redéfinition de « développeur ») et §5 (glossaire) ; README.md restructuré (sections « Pour qui ? », « Démarrage rapide », « Suivre la procédure vous-même ») ; docs/INSTALLATION.md §1 et §2 cadrés pour un parcours agent-médié ; docs/PHILOSOPHY.md §1 complété. Ces corrections sont éditoriales, elles ne modifient ni l'architecture ni la gouvernance du framework et n'ont donc donné lieu à aucune nouvelle décision dans DECISIONS.md.

⸻

6. Bonnes pratiques

Les audits doivent être factuels, vérifiables, reproductibles et argumentés.

⸻

7. Évolution

Un audit n’est jamais modifié pour masquer son historique. Si la situation évolue, un nouvel audit ou une mise à jour de son statut est enregistré.

⸻

8. Références

Ce document s’appuie sur SYSTEM.md et peut entraîner des mises à jour de DECISIONS.md et CHANGELOG.md.
