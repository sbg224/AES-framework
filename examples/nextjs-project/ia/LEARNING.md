LEARNING.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* AUDIT.md
* DECISIONS.md
* CHANGELOG.md
* CONTEXT.md

⸻

1. Objectif

Ce document conserve les enseignements tirés du projet.

Il centralise les connaissances acquises au cours du développement afin d’améliorer les pratiques et d’éviter de reproduire les mêmes erreurs.

⸻

2. Organisation

Chaque apprentissage reçoit un identifiant unique.

Exemple :

* AES-L001
* AES-L002
* AES-L003

Les identifiants ne sont jamais réutilisés.

⸻

3. Structure d’un apprentissage

Chaque entrée doit contenir au minimum :

Identifiant

Exemple :

AES-L001

Date

Date de validation.

Contexte

Situation ayant conduit à cet apprentissage.

Observation

Ce qui a été constaté.

Enseignement

Ce qui a été appris.

Recommandation

Bonne pratique à appliquer à l’avenir.

Références

Documents, audits ou décisions associés lorsque cela est pertinent.

⸻

4. Apprentissages

AES-L001

Date

2026-07-19

Contexte

Implémentation des fondations visuelles sur Next.js 16 / Tailwind v4, versions dont les conventions diffèrent significativement du Next.js/Tailwind « classique » (cf. AGENTS.md).

Observation

Aucun tailwind.config.js/.ts dans ce projet — la configuration Tailwind est entièrement pilotée depuis app/globals.css via les directives CSS natives @theme inline et @utility. La doc Next.js embarquée (node_modules/next/dist/docs) documente des comportements (ex. graisses en tableau sur police variable) qui peuvent différer de ce qu’on suppose par défaut.

Enseignement

Sur ce projet, toute configuration de thème/police se trouve dans les fichiers CSS globaux, pas dans un fichier JS séparé — son absence n’est pas un oubli mais la norme de cette version. Avant d’écrire du code touchant la configuration ou les conventions de fichiers, vérifier le comportement réel dans node_modules/next/dist/docs plutôt que de se fier à des connaissances génériques, conformément à l’avertissement d’AGENTS.md.

Recommandation

Systématiser la consultation de node_modules/next/dist/docs avant toute tâche touchant la configuration Next.js/Tailwind sur ce projet, et compléter cette entrée si un nouvel écart est constaté.

Références

AGENTS.md, ADR-001 (DECISIONS.md), CONTEXT.md §4 Design.

⸻

AES-L002

Date

2026-07-19

Contexte

La revue de fin de tâche (AES-R007) sur components/sections/{Services,Realisations,Devis,Contact}.tsx a identifié une duplication de structure JSX quasi identique entre les 4 fichiers, assumée sans être documentée initialement (écart à AES-S010).

Observation

Ces sections sont des coquilles vides destinées à être réécrites prochainement avec un contenu final propre à chacune. Factoriser leur structure commune dans un composant partagé (ex. SectionShell) avant de connaître ce contenu final aurait figé une abstraction sur une base provisoire, probablement à défaire dès la prochaine itération.

Enseignement

Factoriser une structure JSX répétée avant que le contenu final de chaque occurrence soit connu est prématuré : l’abstraction est extraite trop tôt et risque de ne pas correspondre aux besoins réels une fois le contenu posé (variations de mise en page, de composants, de logique par section). Une duplication limitée et temporaire, le temps que le contenu se stabilise, est préférable à une factorisation anticipée.

Recommandation

Par défaut sur ce projet, ne pas factoriser une structure répétée tant que le contenu final des occurrences concernées n’est pas connu. Une fois le contenu posé et la structure réellement stabilisée, réévaluer l’opportunité d’une factorisation (AES-S003). Documenter tout nouveau report de ce type par un commentaire bref renvoyant à cette entrée.

Références

AES-S003, AES-S010 (STANDARDS.md), RULES_OF_ENGAGEMENT.md AES-R007.

⸻

AES-L003

Date

2026-07-20

Contexte

Mise en place du PWA (manifest, icônes, favicon) — première tâche de génération d’actifs visuels de marque sur ce projet.

Observation

L’agent n’a pas consulté AGENT.md en début de tâche et n’a pas présenté de plan avant de générer les fichiers d’icônes. Deux défauts concrets ont été livrés avant d’être repérés par le développeur : l’icône PWA « maskable » construite depuis le mauvais fichier source (logo complet avec texte au lieu du symbole seul), puis, après correction, un symbole redimensionné hors de la zone de sécurité Android (rayon sûr 80 %, le tracé dépassait à 268 px sur un rayon de 204,8 px).

Enseignement

Générer un actif visuel de marque (icône, favicon, recadrage de logo) est une décision de design, même quand la tâche globale est par ailleurs bien cadrée, sans nouvelle dépendance et réversible via git. CONTEXT.md §4 traite le design comme un domaine déjà arbitré (« reprend la charte graphique AHADI Group existante, déjà définie ») : cela justifie un plan avant génération, pas seulement une revue après coup (AES-R007 seule ne suffit pas ici).

Recommandation

Avant de générer ou modifier un actif visuel de marque, présenter un plan bref (fichier source, recadrage/échelle envisagés, choix de couleur de fond) pour validation avant de produire les fichiers. Consulter systématiquement AGENT.md en début de tâche au même titre que RULES_OF_ENGAGEMENT.md/WORKFLOW.md, et signaler explicitement les documents du référentiel consultés ou volontairement écartés plutôt que de laisser ce choix implicite.

Références

AES-R002, AES-R007 (RULES_OF_ENGAGEMENT.md), WORKFLOW.md Étape 3, CONTEXT.md §4 Design.

⸻

AES-L004

Date

2026-07-20

Contexte

Ajout d’un indicateur de progression dans la navbar. Le plan a été formulé dans un message intermédiaire, puis l’implémentation a commencé dans le même tour sans laisser au développeur une étape de validation visible.

Observation

Même lorsqu’un plan est techniquement communiqué, l’interface peut le replier ou le masquer à la clôture de la tâche. Le développeur ne dispose alors pas d’une occasion claire de confirmer l’approche avant le code, ce qui ne respecte pas l’intention de la demande ni l’étape 3 du workflow AES.

Enseignement

Lorsqu’un développeur demande un plan avant implémentation, le plan doit être livré dans une réponse autonome et l’agent doit attendre sa validation explicite avant toute modification de code.

Recommandation

Séparer systématiquement les étapes de planification et d’implémentation dans ce cas : présenter l’approche, les fichiers concernés et les risques ; attendre l’accord du développeur ; seulement ensuite modifier et vérifier le code.

Références

AES-R001, AES-R002, AES-R003 (RULES_OF_ENGAGEMENT.md), WORKFLOW.md étapes 2 et 3, CHECKLIST.md.

⸻

5. Bonnes pratiques

Les apprentissages doivent être :

* concrets ;
* vérifiables lorsque cela est possible ;
* utiles pour les développements futurs.

Ils ne doivent pas décrire un simple événement, mais une connaissance réutilisable.

⸻

6. Évolution

Les apprentissages restent conservés afin de constituer une mémoire du projet.

Si un enseignement devient obsolète, il est mis à jour ou complété plutôt que supprimé.

⸻

7. Références

Ce document s’appuie sur AUDIT.md, DECISIONS.md, CHANGELOG.md et CONTEXT.md.

Les apprentissages peuvent également provenir de :

* retours d’expérience ;
* incidents ;
* améliorations réalisées.

Ils peuvent conduire à des évolutions des standards, du workflow ou de l’architecture lorsque cela est justifié.
