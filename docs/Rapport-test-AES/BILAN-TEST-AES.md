BILAN-TEST-AES.md

Rapport de bilan intermédiaire, test du framework AI Engineering System (AES)

Projet support du test, AHADI Service
Date, 19 juillet 2026
Heure, non horodaté avec précision, l'assistant n'a pas accès à une horloge vérifiée au moment de la rédaction
Rédigé par, Claude (assistant), à partir des échanges de la session avec MSB
Statut, rapport intermédiaire, le test se poursuit au-delà de cette session

⸻

1. Objet de ce rapport

Ce document synthétise les observations recueillies pendant la première session de test réel du framework AES, sur le projet AHADI Service. Il couvre la méthode de travail suivie, les points positifs, les écarts constatés, les trous de couverture identifiés dans le framework, et une attention particulière portée au branchement technique entre le framework et un agent concret (Claude Code).

Ce rapport ne couvre pas l'installation elle-même. MSB a suivi INSTALLATION.md seul, volontairement, en se mettant dans la position d'un nouvel utilisateur du framework, sans le montrer à l'assistant pendant cette session. Les frictions éventuelles rencontrées à cette étape ne sont donc pas documentées ici et mériteraient d'être ajoutées séparément si elles ont existé.

⸻

2. Méthode de travail suivie pendant cette session

Le travail a alterné entre deux rôles distincts, tenus consciemment séparés.

Rédaction de documentation avec l'assistant (Claude, dans cette conversation), pour construire CONTEXT.md, discuter STACK.md et ARCHITECTURE.md, cadrer la charte graphique, et réfléchir la configuration de CLAUDE.md.

Exécution technique avec l'agent (Claude Code, dans le projet réel), à qui les prompts structurés étaient transmis, et dont les réponses (plans, revues de fin de tâche) étaient rapportées ici pour analyse et archivage.

Chaque prompt envoyé à l'agent a suivi la structure définie dans PROMPTS.md (Contexte, Objectif, Contraintes, Informations disponibles, Résultat attendu), une fois cette exigence découverte en cours de route. Le principe d'un objectif unique par prompt et d'une tâche à la fois a été posé explicitement par MSB et globalement respecté depuis.

⸻

3. Points positifs à conserver

Gouvernance à trois niveaux (Gouvernance, Référence, Vivant) claire sur le papier, et globalement cohérente une fois vérifiée document par document.

AES-R006 (identification et proposition de mise à jour des documents impactés) a fonctionné en pratique, à deux reprises au moins, sur la mise à jour de l'état du projet dans CONTEXT.md, et sur la mise à jour d'ARCHITECTURE.md après la tâche navbar.

AES-R011 (aucune duplication de contenu normatif) a été respecté de façon rigoureuse par l'agent dans la rédaction de STACK.md et ARCHITECTURE.md, systématiquement renvoyés vers CONTEXT.md plutôt que reformulés.

AES-R009 (demander en cas de doute) appliqué plusieurs fois spontanément par l'agent, sans rappel dans le prompt (renommage de section dans STACK.md, inclusion de MDX, choix du breakpoint responsive).

AES-R002 (transparence) tenu à plusieurs reprises, l'agent signalant explicitement les écarts entre l'état projeté et l'état réel plutôt que de les masquer (structure du scaffold, modification de layout.tsx hors périmètre annoncé mais signalée).

Capacité d'auto-correction précise et honnête de l'agent lorsqu'il est directement mis en cause sur un point contestable, distinguant ce qui était fondé de ce qui ne l'était pas plutôt que de généraliser une excuse (épisode du mode plan contesté par MSB).

Deuxième tâche (navbar) exécutée avec une revue de fin de tâche complète sur les six axes d'AES-R007, net progrès par rapport à la première tâche.

⸻

4. Écarts constatés

Première tâche de développement (scaffold visuel initial), deux manquements confirmés après contestation et clarification.
Revue de fin de tâche incomplète, sécurité, performance et standards omis dans le premier rendu, complétés seulement après relance explicite. Une fois complétée, deux vrais problèmes de qualité sont ressortis (police chargée sans poids explicite, choix de non-factorisation non documenté).
Plan de tâche incomplet plutôt qu'absent, un plan avait bien été proposé et validé avant codage, mais sans énoncer les risques, alors que la structure attendue du plan en comptait quatre éléments (quoi, pourquoi, impacts, risques).

Instruction pédagogique explicite ignorée. Un prompt demandant explicitement d'expliquer les concepts Next.js non évidents et de proposer une entrée LEARNING.md si pertinent n'a produit aucune des deux choses dans la réponse de l'agent, alors qu'AES-R005 prévoit ce comportement par défaut.

Agent ayant introduit une valeur hors du vocabulaire fermé du template (« Amorçage » au lieu des cinq valeurs prévues par CONTEXT.md), corrigé sur demande explicite.

Lecture erronée initiale de MSB sur la portée de « Documents liés », corrigée en confrontant directement SYSTEM.md, qui précise explicitement que cette section est un parcours de lecture recommandé, pas un mécanisme de chargement automatique.

⸻

5. Trous de couverture identifiés dans le framework

Aucun document n'était prévu pour la charte graphique visuelle d'un projet. Résolu par une décision d'architecture documentaire (le code source, app/globals.css, fait foi, pas de document séparé), consignée en ADR-001 dans DECISIONS.md.

Le pont entre une règle d'action (AES-R005, AES-R006) et son obligation de persistance dans un document vivant (LEARNING.md, CHANGELOG.md) n'est pas formalisé explicitement. Les règles disent « l'agent explique » ou « l'agent propose une mise à jour », mais pas systématiquement quand cela doit être écrit plutôt que seulement dit dans la conversation.

CHECKLIST.md et WORKFLOW.md, bien que listés comme documents liés dans plusieurs fichiers, n'avaient jamais de déclencheur concret dans la configuration réelle de l'agent (CLAUDE.md), et n'ont donc probablement jamais été consultés pendant la session, malgré leur pertinence pour la qualité du travail produit. Ce trou a été identifié en fin de session, sa résolution (ajout d'un déclencheur explicite pour CHECKLIST.md à l'étape de finalisation, décision encore ouverte pour WORKFLOW.md) reste à finaliser et tester lors d'une prochaine session.

⸻

6. Branchement technique entre le framework et un agent concret (Claude Code)

C'est la zone qui a demandé le plus d'ajustements pendant cette session, et qui mérite l'attention la plus soutenue dans la suite du test, MSB l'a identifiée lui-même comme un axe central.

Le framework est agnostique de l'outil par conception (SYSTEM.md, « le framework doit pouvoir être utilisé avec n'importe quel agent IA présent ou futur »). Mais cette portabilité déplace la charge de configuration concrète sur CLAUDE.md (ou l'équivalent pour un autre agent), qui n'est pas un simple sommaire, il doit encoder des déclencheurs précis pour chaque document, sous peine que la majorité du référentiel documentaire reste lettre morte en pratique.

Dépendance au dossier de travail réel de la session, pas au fichier ouvert dans l'éditeur. Une confusion initiale de MSB sur ce point a produit un test invalidé (l'agent avait chargé un CLAUDE.md différent, probablement global, mentionnant d'autres projets), corrigé une fois le bon dossier ouvert explicitement dans VS Code.

Syntaxe d'import (@chemin/fichier) fonctionnelle mais fragile aux détails de formatage, un fichier entouré de blocs de code Markdown désactive silencieusement le parsing des imports, sans message d'erreur visible.

Ambiguïté non résolue en fin de session sur l'import de répertoire entier (@dossier/) par opposition à un fichier précis, aucune confirmation officielle trouvée que la syntaxe de dossier fonctionne de façon fiable, recommandation d'expliciter chaque fichier plutôt que de compter dessus.

Distinction entre chargement automatique au démarrage de session (mécanisme CLAUDE.md natif de l'outil) et consultation à la demande par l'agent lui-même (comportement laissé à son initiative), les deux coexistent et ne doivent pas être confondus. Un fichier absent du socle n'est pas nécessairement invisible à l'agent, mais rien ne garantit qu'il aille le consulter sans un déclencheur écrit explicitement.

Le mode plan natif de l'outil (EnterPlanMode/ExitPlanMode) recoupe fonctionnellement AES-R002/R003 sans que la correspondance entre les deux ait été anticipée dans la documentation du framework, source d'une incompréhension initiale sur ce qui avait ou non été respecté.

⸻

7. Décisions prises pendant cette session, à date

Pas de DESIGN.md séparé, la charte graphique vit dans le code source du projet (app/globals.css), consignée en ADR-001.
Ajout de RULES_OF_ENGAGEMENT.md au socle obligatoire du CLAUDE.md.
Ajout, en fin de session, d'un déclencheur explicite pour CHECKLIST.md à la finalisation de chaque tâche.
Discipline de travail tâche par tâche, composant par composant, posée explicitement pour la suite du projet.
Tout compromis temporaire assumé par l'agent doit désormais laisser une trace durable, commentaire code et ligne LEARNING.md, pas seulement une mention orale.

⸻

8. Points restés ouverts pour la prochaine session

WORKFLOW.md, à charger systématiquement ou à laisser consultable à la demande, décision non tranchée.
Priorité de traitement des devis au-delà de « premier arrivé premier servi », et conditions d'acceptation d'un projet, non définies.
Vérifier si l'agent consulte réellement CHECKLIST.md maintenant que le déclencheur explicite a été ajouté.
Frictions éventuelles rencontrées lors de l'installation elle-même (INSTALLATION.md), non documentées dans ce rapport.

⸻

Fin du rapport intermédiaire.
