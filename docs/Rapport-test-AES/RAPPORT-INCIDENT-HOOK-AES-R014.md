# RAPPORT D'INCIDENT

# AES-A007
## Défaillance du rappel automatique **AES-R014** dans l'intégration Claude Code

**Date du rapport :** 23 juillet 2026

**Version analysée :** AES Framework v1.4.1

---

# Fiche d'identité de l'incident

| Élément | Valeur |
|----------|--------|
| **Référence** | AES-A007 |
| **Type** | Défaut fonctionnel silencieux |
| **Composant concerné** | Intégration Claude Code (`aes-reminder.sh`) |
| **Première version affectée** | v1.3.0 |
| **Dernière version affectée** | v1.4.1 |
| **Version corrigée** | v1.4.2 |
| **Gravité** | Élevée |
| **Impact** | Le rappel automatique AES-R014 n'atteint jamais le contexte de l'agent. |
| **Cause racine** | Utilisation du champ JSON `systemMessage` au lieu de `hookSpecificOutput.additionalContext`. |
| **Détection** | Validation terrain sur le projet AHADI Group. |
| **Statut** | Corrigé et validé. |

---

# Projets ayant permis l'analyse

- AHADI Service
- 3M Drive
- AHADI Group

---

# Chronologie de l'incident

```text
Validation AES v1.4.1
        │
        ▼
Tests sur AHADI Group
        │
        ▼
Comportement inhabituel observé
        │
        ▼
Première hypothèse
        │
        ▼
Recherche documentaire
        │
        ▼
Validation par test empirique
        │
        ▼
Cause racine confirmée
        │
        ▼
Évaluation d'une solution alternative (hook Stop)
        │
        ▼
Solution rejetée
        │
        ▼
Correction du hook UserPromptSubmit
        │
        ▼
Création de l'audit AES-A007
```

---

# 1. Résumé exécutif

Ce rapport retrace le processus ayant conduit à la découverte du défaut **AES-A007**, identifié lors de la campagne de validation d'AES Framework v1.4.1 sur un troisième projet réel : **AHADI Group**.

L'objectif initial était de vérifier le bon fonctionnement du framework dans un environnement existant n'ayant jamais utilisé AES. Les premiers tests ont confirmé le bon comportement de l'installation, de l'intégration Claude Code et des mécanismes de protection Git.

Au cours des validations fonctionnelles, un comportement récurrent a toutefois été observé : certaines vérifications de fin de tâche prévues par le framework n'étaient jamais appliquées spontanément par l'agent.

L'investigation menée a permis d'identifier une défaillance silencieuse présente depuis la version **1.3.0** : le rappel automatique **AES-R014** était correctement exécuté par le hook, mais son contenu n'était jamais transmis au modèle.

La cause exacte a été confirmée selon une démarche en deux temps :

1. une recherche documentaire dans la documentation officielle de Claude Code ;
2. une validation empirique réalisée directement sur le hook.

Une solution alternative utilisant le hook `Stop` a ensuite été étudiée puis volontairement abandonnée après analyse de son comportement.

Le correctif finalement retenu consiste à remplacer l'utilisation du champ `systemMessage` par `hookSpecificOutput.additionalContext`. Cette correction est désormais documentée sous la référence **AES-A007** et destinée à être intégrée dans AES Framework **v1.4.2**.

---

# 2. Éléments validés avant l'incident

Avant de repérer le problème, plusieurs éléments du framework se sont révélés solides en usage réel sur AHADI Group.

L'installation s'est comportée exactement comme documenté, additive et non destructive. Un dossier `.claude/` existait déjà sur ce projet, l'installateur n'a touché qu'à ce qui manquait, sans rien altérer de ce qui était en place.

L'agent a correctement appliqué AES-R014 dès l'ouverture du projet, vérifié que `DECISIONS.md` était vide, et conclu à raison qu'aucune contradiction n'était possible, sans traiter cette absence de contenu comme une erreur.

Le diagnostic honnête « AES tourne à vide tant que les documents vivants restent des gabarits » a été formulé spontanément, correspondant exactement au statut `INSUFFICIENT_CONTEXT` déjà prévu par `/aes-check`.

Le remplissage de `CONTEXT.md`, `STACK.md`, `ARCHITECTURE.md` à partir du `README.md` existant du projet, puis l'audit initial `AES-A001` (sécurité et architecture), ont été menés avec rigueur, vérifiés contre le code réel plutôt que contre les seules affirmations de la documentation.

La mise à jour de Next.js consécutive à cet audit a été traitée avec un vrai diagnostic technique quand le build s'est bloqué (cache `.next/` incompatible après changement de version), documenté ensuite en `LEARNING.md` sous `AES-L001`.

La discipline git est restée fiable tout du long, commits séparés par tâche, validation explicite avant chaque `commit` et chaque `push`, jamais présumée.

---

# 3. Premiers symptômes observés

Deux fois de suite, à la clôture de tâches distinctes de cette même session (le remplissage des documents projet, puis la mise à jour de Next.js), l'agent a répondu à la question « cette tâche est terminée ? » par un résumé narratif de ce qu'il jugeait accompli, plutôt que par le format exact que `CHECKLIST.md` impose (un statut explicite par item, vérifié, non applicable, ou en écart). Dans les deux cas, une entrée `LEARNING.md` pourtant justifiée par le test d'AES-R005 n'avait pas été proposée spontanément.

Face à cette répétition, plutôt que de corriger au coup par coup, la question posée à l'agent a changé de nature, non plus « corrige ceci », mais « pourquoi cela se reproduit-il, malgré un framework bien réorganisé, est-ce un problème d'alignement que je ne perçois pas encore ? »

---

# 4. Première hypothèse

La réponse a distingué deux catégories de règles, avec une précision inédite dans ce test.

Les règles ancrées à un geste précis sur le point d'être exécuté (installer une dépendance, committer, pousser, écrire dans un document) fonctionnent de façon fiable, parce que la règle et l'action coïncident exactement, l'agent s'arrête déjà pour demander une validation à ce moment-là.

Les règles qui décrivent un processus de revue sans action déclenchante (relire `CHECKLIST.md` en fin de tâche, appliquer le test d'`AES-R005` pour `LEARNING.md`) n'ont rien à quoi s'accrocher, elles doivent être déclenchées de mémoire, sans qu'aucun geste imminent ne les rappelle.

Un point technique concret a été relevé au passage, sans preuve encore à ce stade, l'agent n'avait à aucun moment de la conversation vu apparaître le texte du rappel automatique `AES-R014` (le hook `UserPromptSubmit`) dans son propre contexte.

---

# 5. Identification de la cause racine

Une vérification a été menée en deux temps, sans se contenter d'une supposition.

Archéologie des journaux Claude Code, sans résultat concluant, ce mécanisme n'est pas journalisé par l'outil.

Test direct, une ligne de diagnostic ajoutée temporairement au script du hook, confirmant que le hook s'exécutait bien à chaque message (horodatage, PID, variables d'environnement corrects), sans pour autant prouver que son contenu atteignait l'agent.

Recherche documentaire ciblée, menée par un agent spécialisé sur la documentation officielle de Claude Code, plutôt que par inférence. Résultat, le script renvoyait le champ `systemMessage`, qui n'est affiché qu'à l'utilisateur dans l'interface, jamais transmis au contexte du modèle. Seul le champ `hookSpecificOutput.additionalContext` atteint réellement l'agent.

Conséquence, le rappel `AES-R014` n'a jamais fonctionné côté agent depuis la création du hook en version 1.3.0, sur aucun des trois projets testés (AHADI Service, 3M Drive, AHADI Group). Chaque application correcte d'`AES-R014` observée pendant tout le test venait de la lecture directe du socle et des documents, jamais du rappel automatique, qui était silencieusement inopérant depuis le début.

---

# 6. Solution alternative évaluée

Pour couvrir symétriquement la clôture de tâche (`CHECKLIST.md`, `LEARNING.md`), un second hook, déclenché à la fin de chaque réponse (`Stop`), a été proposé et testé, sur le même modèle `additionalContext` non bloquant que le rappel corrigé.

Le test a provoqué une boucle auto-entretenue, sept déclenchements consécutifs du hook sans aucune saisie humaine réelle, la réponse de l'agent semblant relancer automatiquement un nouveau tour. L'agent a détecté l'anomalie, coupé la boucle en désactivant le hook sans attendre de validation préalable, au même titre que l'arrêt d'un build resté bloqué plus tôt dans ce même test, un dysfonctionnement actif justifiant une action immédiate plutôt qu'une attente indéfinie.

Une seconde recherche documentaire, tout aussi rigoureuse que la première, a établi la cause exacte, non pas un bug, mais un comportement documenté et mal maîtrisé. `additionalContext` sur un hook `Stop` force intentionnellement la conversation à continuer, exactement comme `decision: "block"`. Un garde-fou existe, le champ d'entrée `stop_hook_active`, jamais lu par le script, qui aurait dû s'en servir pour ne renvoyer son contenu qu'une seule fois.

Le correctif technique était donc possible. Il a néanmoins été écarté, définitivement, pour une raison de fond, même corrigé, ce hook imposerait un aller-retour supplémentaire après chaque réponse, triviale ou non, en continu, sans aucun moyen de le limiter aux vraies clôtures de tâche, l'événement `Stop` ne supportant aucun filtre. Un coût permanent et diffus, à l'opposé du principe déjà établi dans ce test, concentrer la vigilance mécanique là où le risque existe réellement, pas l'étaler partout.

Cet essai et sa conclusion ont été documentés dans `LEARNING.md` (`AES-L002`), pour que la question ne se repose pas sans cette connaissance acquise.

---

# 7. Correctif retenu

Seul le correctif du hook `UserPromptSubmit` a été retenu, `systemMessage` remplacé par `hookSpecificOutput.additionalContext`. Confirmé empiriquement, à plusieurs reprises, y compris lors de la toute dernière vérification de clôture, où le texte exact du rappel est apparu, cette fois, dans le contexte reçu par l'agent.

Une dernière checklist de clôture a ensuite été appliquée au format exact prescrit par `CHECKLIST.md`, statut explicite pour chaque point, aucun écart laissé caché derrière un résumé, quatre actions restantes explicitement listées plutôt que dissimulées.

---

# 8. Intégration du correctif dans AES Framework

Le correctif a été proposé, à l'identique, pour le fichier source `integrations/claude-code/hooks/aes-reminder.sh`, avec un bump de version (1.4.1 vers 1.4.2), une entrée `CHANGELOG.md`, et une entrée d'audit détaillée, `AES-A007`, retraçant le défaut, sa cause, sa portée (tout projet ayant installé l'intégration Claude Code depuis la v1.3.0), et l'essai du hook `Stop` en tant qu'enseignement annexe. Vérification faite que ni le manifeste d'intégration ni les tests existants ne dépendent du contenu JSON du script, seulement de son déploiement, donc aucune autre modification n'est requise. Aucune entrée `DECISIONS.md`, correction factuelle sans choix d'architecture ou de gouvernance en jeu.

Cette proposition a été appliquée dans le dépôt source (AES Framework v1.4.2, publiée le 24 juillet 2026).

---

# 9. Enseignements

Cet incident met en évidence plusieurs enseignements importants pour le développement d'AES Framework.

Tout d'abord, une configuration techniquement correcte ne garantit pas que le comportement attendu soit réellement observé. Le hook `UserPromptSubmit` s'exécutait bien depuis la version **1.3.0**, mais utilisait un champ JSON qui n'était jamais transmis au modèle. Le mécanisme semblait donc opérationnel alors qu'il était, en pratique, totalement inactif.

Cette investigation confirme également la pertinence d'une démarche fondée sur deux niveaux de validation : la recherche documentaire pour comprendre le comportement attendu, puis la vérification empirique pour confirmer le comportement réellement observé. C'est cette double approche qui a permis de distinguer une véritable panne silencieuse d'un comportement pourtant conforme à la documentation.

L'évaluation du hook `Stop` apporte un second enseignement. Bien qu'un correctif technique ait été envisageable, la solution a été volontairement écartée, car elle introduisait un coût permanent et un comportement non souhaité dans toutes les conversations. Ce choix illustre un principe fondamental d'AES Framework : privilégier les mécanismes les plus simples lorsqu'ils répondent précisément au besoin, plutôt que d'ajouter une complexité générale.

Enfin, l'incident **AES-A007** démontre l'intérêt des validations réalisées sur des projets réels. Malgré plusieurs campagnes de tests antérieures, cette défaillance était restée invisible pendant plusieurs versions, car aucun test ne vérifiait explicitement que le contenu du hook atteignait effectivement le contexte de l'agent. Sa découverte renforce à la fois la robustesse du framework et la méthodologie de validation qui l'accompagne.