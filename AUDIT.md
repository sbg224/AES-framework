AUDIT.md

AI Engineering System (AES)

Version : 1.3.0

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

6. Bonnes pratiques

Les audits doivent être factuels, vérifiables, reproductibles et argumentés.

⸻

7. Évolution

Un audit n’est jamais modifié pour masquer son historique. Si la situation évolue, un nouvel audit ou une mise à jour de son statut est enregistré.

⸻

8. Références

Ce document s’appuie sur SYSTEM.md et peut entraîner des mises à jour de DECISIONS.md et CHANGELOG.md.
