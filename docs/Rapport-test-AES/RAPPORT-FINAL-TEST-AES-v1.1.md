RAPPORT-FINAL-TEST-AES-v1.1.md

Rapport final de validation, AI Engineering System (AES) v1.1

Projet support du test, AHADI Service (site vitrine Next.js)
Période du test, 19 et 20 juillet 2026
Rédigé le, 20 juillet 2026
Rédigé par, Claude (assistant), à partir de l'intégralité des échanges des deux sessions avec MSB
Agents testés, Claude Code (plusieurs sessions, plusieurs modèles) et Codex (OpenAI)
Statut, rapport final consolidé, remplace et intègre le rapport intermédiaire du 19 juillet

⸻

1. Résumé exécutif

Le framework AES a été testé sur un projet réel, de l'installation jusqu'à un premier audit formel, avec deux agents IA différents. Le verdict d'ensemble tient en trois phrases.

Le framework fonctionne. Sa promesse centrale, permettre à un agent de comprendre un projet et de travailler correctement uniquement à partir des documents, a été démontrée deux fois de façon nette, une fois avec Claude Code (tâche PWA sur prompt minimal d'une ligne), une fois avec Codex (tâche navbar et audit, agent différent, même résultat). La portabilité entre agents, promesse fondatrice de SYSTEM.md, est validée en pratique.

Le framework a une faille structurelle identifiée et nommée. Les deux agents, interrogés séparément sur leurs propres manquements, ont produit indépendamment le même diagnostic, les règles d'AES sont descriptives, pas exécutoires. Elles disent ce que l'agent doit faire, mais ne définissent pas assez précisément le moment où il doit obligatoirement s'arrêter, quelle preuve il doit produire, et quelle validation il doit obtenir avant de continuer. Tous les dérapages observés pendant le test se rattachent à cette cause racine.

La correction est connue et concrète. Les deux agents ont proposé des évolutions convergentes et complémentaires, détaillées en section 10 de ce rapport. Elles sont applicables à AES sans en changer la philosophie, seulement en durcissant la formulation de quelques règles et en ajoutant des points d'arrêt mécaniques là où le test a montré que le jugement de l'agent ne suffit pas.

⸻

2. Rappel de l'intention du framework

Pour évaluer correctement les résultats, il faut rappeler ce qu'AES cherche à accomplir, tel que formulé par son auteur au fil du test.

Optimiser le travail avec les agents IA au quotidien, avec un processus reproductible qui facilite le développement d'applications.

Ne pas subir les agents, rester l'acteur et le décideur de ce qui est fait, sans accumuler de dette technique invisible.

Apprendre en continu, chaque interaction avec un agent doit faire monter le développeur en compétence, pas le rendre dépendant.

Réduire la consommation de tokens, en évitant de répéter le contexte à chaque session et en permettant un chargement sélectif des documents selon le besoin.

Être agnostique de l'outil, utilisable avec n'importe quel agent IA présent ou futur.

Le test a évalué chacun de ces objectifs. Résultat synthétique, les objectifs 1, 2 et 5 sont atteints ou largement démontrés, l'objectif 3 est partiellement atteint avec des manques précis identifiés, l'objectif 4 reste non mesuré faute de test comparatif, avec une méthode de mesure proposée pour l'avenir.

⸻

3. Méthode de test

Le test a suivi le cadre de validation en trois phases défini par l'auteur en début de seconde session, remplaçant une logique de durée par une logique d'objectifs mesurables.

Phase 1, validation de l'initialisation. Installation depuis la documentation seule, remplissage de CONTEXT.md, rédaction des premiers documents, vérification que l'agent comprend le projet par les documents.

Phase 2, validation en situation réelle. Décisions, audits, documents vivants, échanges multi-agents, refactoring, changement de direction documenté, récupération rapide du contexte.

Phase 3, validation de la continuité. Interruption, reprise d'une nouvelle session uniquement à partir des documents du dossier ia/, sans recontextualisation manuelle.

Le déroulé a alterné deux rôles tenus séparés, la construction de la documentation et des prompts avec l'assistant (conversation dédiée), et l'exécution technique par les agents (Claude Code, puis Codex), dont les réponses étaient systématiquement rapportées et archivées pour ce rapport. Les prompts ont suivi la structure de PROMPTS.md (Contexte, Objectif, Contraintes, Informations disponibles, Résultat attendu), sauf lors des tests volontairement minimaux (une ligne), conçus précisément pour mesurer l'autonomie documentaire de l'agent.

Tâches réalisées pendant le test, remplissage complet de CONTEXT.md, rédaction de STACK.md et ARCHITECTURE.md par l'agent, scaffold visuel initial (charte graphique en tokens CSS, navigation par ancres, sections), navbar responsive avec CTA détaché, intégration du logo, mise en place PWA complète (deux itérations), barre de progression de navigation (par Codex), premier audit formel AES-A001 (par Codex), plus la création d'ADR-001, d'entrées LEARNING.md (AES-L003, AES-L004) et la configuration du branchement CLAUDE.md et AGENTS.md.

⸻

4. État final de la validation, phase par phase

Phase 1, initialisation. Validée, avec réserves documentées.
Le dossier ia/ a été correctement initialisé. CONTEXT.md a été rempli intégralement et sans blocage, mais avec un accompagnement humain soutenu (l'assistant), ce qui laisse ouverte la question de la facilité pour un utilisateur seul. Une vraie ambiguïté de compréhension a été rencontrée et résolue, la portée de la section "Documents liés" (parcours de lecture recommandé, pas mécanisme de chargement, ce que SYSTEM.md précise explicitement mais que la lecture intuitive contredit). Le retour d'expérience sur INSTALLATION.md lui-même, suivi en autonomie par l'auteur, n'a pas été documenté et reste à ajouter.

Phase 2, situation réelle. Validée sur l'essentiel.
Décisions, ADR-001 créé (architecture documentaire, le code source fait foi pour la charte graphique). Audit, AES-A001 réalisé et consigné. Documents vivants, CONTEXT.md, ARCHITECTURE.md, CHANGELOG.md, LEARNING.md, DECISIONS.md et AUDIT.md tous utilisés et mis à jour au moins une fois pendant le test. Multi-agents, validé avec Codex. Changement de direction documenté, validé (rejet du DESIGN.md proposé, ADR-001). Récupération du contexte, validée à plusieurs reprises. Seul le refactoring significatif n'a pas été réalisé, le projet n'ayant produit que du code neuf, ce critère reste à valider lors du développement normal qui suit.

Phase 3, continuité. Validée.
Nouvelle session, prompt minimal d'une ligne sans aucune recontextualisation ("Mets en place le PWA du site, en respectant le framework AES pour ce projet"). L'agent a exploré l'arborescence, lu le socle et les documents pertinents de ia/templates/, consulté la documentation Next.js locale exigée par AGENTS.md, réutilisé les assets existants, et produit un résultat fonctionnel. Le même exercice répété avec Codex (agent jamais utilisé sur ce projet) a produit le même comportement, lecture spontanée des consignes AES avant toute action. La promesse fondamentale du framework, conserver et transmettre durablement la mémoire du projet, est démontrée.

⸻

5. Points positifs, ce qui fonctionne et doit être conservé

La gouvernance à trois statuts (Gouvernance, Référence, Vivant) est cohérente et s'est révélée utilisable en pratique comme critère de décision, notamment pour trancher ce qui se charge systématiquement et ce qui se consulte à la demande.

Le référentiel d'identifiants uniques (AES-R, AES-S, AES-A, AES-L, ADR) fonctionne remarquablement bien. Les deux agents citent spontanément les règles par leur identifiant, s'y réfèrent dans leurs justifications, et les utilisent pour structurer leurs autocritiques. C'est un des mécanismes les plus solides du framework.

AES-R006 (identification et proposition de mise à jour des documents impactés) a fonctionné à répétition, sur la mise à jour de l'état du projet, sur ARCHITECTURE.md après la navbar, sur la détection spontanée par Codex des trois documents impactés par sa tâche, avec un jugement correct sur ce qui ne devait pas être touché (CONTEXT.md, jugement justifié et vérifié).

AES-R011 (aucune duplication de contenu normatif) a été respecté rigoureusement dans toutes les rédactions documentaires, avec des renvois systématiques plutôt que des reformulations. La décision ADR-001 (le code source fait foi, pas de document séparé pour la charte graphique) en est l'application la plus aboutie, poussée à sa conclusion logique.

AES-R009 (demander en cas de doute) s'est déclenché plusieurs fois sans rappel, renommage de section de STACK.md, inclusion de MDX, choix du breakpoint, conflit transparence contre fond opaque de l'icône Android (vraie contrainte technique identifiée et posée en question plutôt que tranchée en silence).

La capacité d'autocritique des deux agents, confrontés à leurs manquements, est d'une qualité remarquable et constitue une matière première précieuse pour améliorer le framework. Aucune défense évasive observée, à chaque confrontation, distinction entre ce qui était fondé et ce qui ne l'était pas, identification de la règle violée par son identifiant, et proposition de correction structurelle.

Le cycle complet erreur, détection, correction, documentation a fonctionné de bout en bout au moins une fois, la mémoire native de Claude Code (hors framework) détectée, confrontée, supprimée par l'agent lui-même, et remplacée par une entrée LEARNING.md conforme (AES-L003), au bon endroit, dans le bon format, versionnée avec le projet.

L'audit AES-A001 a démontré la valeur distincte du mécanisme d'audit par rapport aux revues de tâche. Il a trouvé des choses qu'aucune revue individuelle n'avait vues, une vulnérabilité modérée transitive (postcss), un README resté au boilerplate, une incohérence dans STACK.md entre technologies prévues et intégrées, cinq dépendances orphelines, et la liste des manques avant mise en production (en-têtes de sécurité, CSP, tests E2E, SEO, lien d'évitement).

La portabilité entre agents est réelle. Codex, sans aucune configuration spécifique autre que quelques lignes en langage simple dans AGENTS.md, a lu les consignes AES de lui-même, produit un plan avec risques, respecté la charte, et réalisé un audit conforme au format du framework sur un prompt d'une ligne.

La montée en qualité au fil du test est mesurable. Première tâche de développement, revue incomplète et plan sans risques. Dernières tâches, plans complets avec risques annoncés proactivement, checklists visibles, limites déclarées avant exécution. Le framework plus la vigilance de l'utilisateur ont produit un apprentissage réel des agents en cours de route.

⸻

6. Points problématiques, les écarts constatés

Chronologie condensée des dérapages, tous documentés en détail dans les sessions.

Première tâche de développement (scaffold), revue de fin de tâche incomplète (sécurité, performance, standards omis), complétée seulement sur relance, révélant alors deux vrais problèmes (police chargée sans poids explicite, compromis de non-factorisation non documenté). Plan présenté mais sans les risques, quatrième élément pourtant requis par AES-R002.

Instruction pédagogique explicite ignorée, un prompt demandant d'expliquer les concepts Next.js et de proposer une entrée LEARNING.md n'a produit ni l'un ni l'autre, alors qu'AES-R005 prévoit ce comportement par défaut.

Vocabulaire fermé non respecté, invention de la valeur "Amorçage" hors de la liste des états définis par le template CONTEXT.md, corrigée sur demande.

Tâche PWA première itération, AGENT.md sauté silencieusement, aucun plan avant génération d'actifs visuels de marque, deux défauts réels livrés (mauvais fichier source pour l'icône adaptative, puis dépassement de la zone de sécurité Android, mesuré à 268px pour un rayon sûr de 204,8px), tous deux repérés par le développeur, pas par l'agent.

Leçon écrite au mauvais endroit, l'enseignement de l'incident précédent d'abord consigné dans la mémoire native de Claude Code (hors dépôt, hors framework, invisible à tout autre agent), en contradiction directe avec la promesse d'agnosticisme, corrigé après confrontation.

Validations en deux temps compressées, à deux reprises, un accord de principe ("oui, propose") traité comme une validation de contenu, avec application directe sans montrer le texte exact. L'assistant lui-même (conversation d'accompagnement) a commis la même erreur une fois, en recommandant de valider un texte qu'il n'avait pas vu, ce qui confirme que le biais n'est pas propre à un agent particulier.

Clôture sans vérification, sur la mise à jour documentaire finale, passage direct de l'écriture à l'annonce "c'est fait", sans étape 5 (vérification) ni étape 9 (checklist) de WORKFLOW.md. Sur relance, la vérification a posteriori a trouvé un motif de recherche d'abord erroné, corrigé, puis confirmé propre.

Codex, plan masqué, plan formulé mais dans un message intermédiaire peu visible, enchaînement immédiat sur l'implémentation sans vrai point d'arrêt pour validation, puis clôture initiale sans revue AES, faite correctement sur relance.

Constat transversal important, aucun de ces écarts n'a porté sur une règle simple et binaire. "N'ajoute pas de dépendance", "ne touche pas à la navbar", "ne touche pas au favicon" ont été respectées sans exception sur toute la durée du test, y compris vérifiées par diff. Les dérapages se concentrent exclusivement sur les règles conditionnelles, séquentielles ou en deux temps.

⸻

7. Le diagnostic central, règles descriptives contre règles exécutoires

C'est le résultat le plus important du test, et il tient sa force de la convergence, deux agents différents, de deux éditeurs différents, interrogés séparément à des moments différents, ont produit le même diagnostic sans se concerter.

Formulation de Claude Code, savoir citer une règle et l'appliquer spontanément en plein élan d'exécution sont deux choses différentes. La règle informe le raisonnement quand on interroge l'agent, elle ne freine pas toujours son geste au moment où il agit.

Formulation de Codex, le point faible n'est pas l'absence de règles. WORKFLOW.md prévoit déjà planification, validation, vérification et checklist. Le problème est que ces règles sont descriptives, pas exécutoires, elles ne définissent pas assez précisément le moment où l'agent doit obligatoirement s'arrêter.

L'auto-analyse détaillée de Claude Code a décomposé ce diagnostic en cinq mécanismes distincts, chacun appelant une correction différente. Ils constituent la grille de lecture des préconisations de la section 10.

Mécanisme 1, divergence entre la configuration réelle (CLAUDE.md) et le framework. AGENT.md absent du socle chargé systématiquement, donc son omission n'était pas une entorse à une règle explicite mais un défaut de configuration. Leçon, le fichier de branchement n'est pas un sommaire, il encode des obligations, et tout écart entre lui et l'intention du framework devient un trou silencieux.

Mécanisme 2, règles conditionnelles reposant sur le jugement de l'agent sans seuil mécanique. Le plan de WORKFLOW.md étape 3 est requis "si décision importante, ambiguïté ou impact significatif", et c'est l'agent qui évalue si c'est le cas. Le mot "proportionné", pensé pour moduler la profondeur d'une étape, a été relu comme une permission de la sauter entièrement. Une règle en prose sans seuil concret se fait réinterpréter à chaque exécution.

Mécanisme 3, comportements par défaut de l'outil entrant en collision avec les conventions du projet, sans garde-fou explicite. L'écriture en mémoire native de Claude Code vient d'une instruction générique de l'outil, rien dans CLAUDE.md ne signalait le conflit avec LEARNING.md, donc le comportement par défaut s'est appliqué sans friction.

Mécanisme 4, ambiguïté sur ce qu'un "oui" valide. Accord de principe et validation de contenu précis se ressemblent dans une conversation qui avance, la correction robuste n'est pas comportementale mais structurelle, ne jamais séparer la demande de permission et la proposition elle-même en deux échanges.

Mécanisme 5, confusion entre "l'outil n'a pas renvoyé d'erreur" et "c'est vérifié". Le mécanisme le plus insidieux, plus la confiance dans un résultat est grande, moins l'agent insère de friction de vérification, alors que c'est l'inverse qui serait utile.

À ces cinq mécanismes s'ajoute la distinction de Codex en trois niveaux d'autorisation, plus fine que ce que le test avait initialement identifié, autorisation de traiter la demande, autorisation du plan, autorisation des mises à jour documentaires. Les incidents observés relèvent tous d'une confusion entre deux de ces niveaux.

⸻

8. Branchement technique entre le framework et les agents

C'est la zone qui a demandé le plus d'ajustements, et l'auteur l'a identifiée comme axe central dès la première session.

Claude Code. Le contexte chargé dépend du dossier de travail réel de la session, pas du fichier ouvert dans l'éditeur, une confusion initiale sur ce point a invalidé un premier test (chargement d'un CLAUDE.md global mentionnant d'autres projets). La syntaxe d'import @chemin/fichier fonctionne mais est fragile, un contenu placé dans un bloc de code Markdown désactive silencieusement le parsing, et l'import de dossier entier (@ia/) n'a pas de garantie documentée, l'explicitation fichier par fichier est recommandée. Le mode plan natif (EnterPlanMode, ExitPlanMode) recoupe fonctionnellement AES-R002 et R003 sans que la correspondance soit documentée dans le framework, source d'une incompréhension en début de test. La mémoire native de l'outil (auto memory, MEMORY.md) peut entrer en concurrence silencieuse avec LEARNING.md et doit être explicitement neutralisée ou encadrée.

Codex. Ne lit pas CLAUDE.md mais AGENTS.md, devenu standard partagé entre plusieurs outils. Ne supporte pas la syntaxe d'import @, les instructions doivent être des phrases d'action en langage simple ("avant toute tâche, lis ia/SYSTEM.md..."), ce qui s'est révélé suffisant en pratique. Son environnement d'exécution est un bac à sable au réseau restreint, diagnostic confirmé par une erreur DNS précise sur fonts.googleapis.com, ce qui bloque tout build utilisant next/font/google, sans que ce soit un défaut du projet (build local contre-vérifié fonctionnel). Son mécanisme de pause avant implémentation est moins strict que le mode plan de Claude Code, un plan peut être émis dans un message intermédiaire peu visible et enchaîner sur l'exécution.

Enseignement général. Une même règle du framework ("propose un plan et attends") peut être fiable avec un agent et fragile avec un autre, non à cause du framework, mais à cause du mécanisme d'arrêt propre à chaque outil. Le fichier de branchement de chaque agent doit donc compenser explicitement les faiblesses connues de cet agent, il est le vrai lieu d'adaptation, le framework restant agnostique.

⸻

9. Trous de couverture identifiés dans le framework

Workflow git absent. Aucun des documents (RULES_OF_ENGAGEMENT, WORKFLOW, CHECKLIST, STANDARDS, AGENT) ne définit de règle sur le commit après revue, le format des messages de commit, ni l'autorisation préalable avant push ou pull request. Vérifié exhaustivement, confirmé comme un vrai manque. Fait notable et rassurant, l'agent a spontanément demandé l'autorisation avant de committer, en généralisant AES-R003 de lui-même, mais compter sur cette prudence spontanée n'est ni garanti ni portable.

Charte graphique et actifs visuels sans emplacement prévu. Résolu pendant le test par ADR-001 (le code source fait foi), mais le cas révèle une question plus générale que le framework ne tranche pas explicitement, quand un document de référence est-il superflu parce que le code fait déjà foi. L'esprit d'AES-R011 le suggère, aucun texte ne le dit.

Pont entre règles d'action et persistance documentaire non formalisé. AES-R005 dit "l'agent explique", AES-R006 dit "l'agent propose une mise à jour", mais rien ne définit systématiquement quand une explication ou un enseignement doit être écrit (LEARNING.md) plutôt que seulement dit en conversation. Ce trou a directement produit l'incident de la mémoire native.

Documents sans déclencheur. CHECKLIST.md et WORKFLOW.md, bien que cités partout en documents liés, n'avaient aucun déclencheur concret dans la configuration, et n'étaient donc jamais consultés spontanément lors des premières tâches. Partiellement corrigé en cours de test (déclencheur ajouté pour CHECKLIST.md dans CLAUDE.md), la décision sur WORKFLOW.md (socle ou à la demande) reste ouverte.

Exigence pédagogique sous-spécifiée. AES-R005 prévoit l'explication des concepts "lorsque cela est pertinent", formulation trop faible au regard de l'intention réelle du framework. L'auteur précise l'exigence, chaque terme technique employé (CTA, maskable, manifest...) doit être défini en langage accessible à quelqu'un sans aucune connaissance en informatique, systématiquement, pas sur demande. L'écart entre la règle écrite et cette intention explique que l'instruction pédagogique ait pu être ignorée sans violation formelle.

Consommation de tokens, objectif affiché mais non instrumenté. Aucun mécanisme du framework ne permet de mesurer si le chargement sélectif économise réellement des tokens par rapport à une répétition manuelle du contexte. Le test n'a pas pu le prouver faute de comparatif, la commande /cost de Claude Code fournit le chiffre par session, mais sans scénario témoin. À traiter comme hypothèse plausible, pas comme résultat démontré.

⸻

10. Préconisations, priorisées

Priorité 1, transformer les règles critiques en conditions d'arrêt exécutoires.

Créer AES-R012, plan demandé égale étape bloquante, sur la base du texte proposé par Codex, "si le développeur demande un plan avant toute implémentation, l'agent répond uniquement avec le plan. Il ne lit ni ne modifie de fichier à des fins d'implémentation avant une validation explicite telle que je valide le plan." La validation devient une frontière entre deux tours de conversation, jamais un enchaînement dans le même message.

Créer une règle interdisant de séparer permission et proposition, une proposition de modification documentaire et sa demande de validation figurent toujours dans le même message, avec le texte exact visible, il n'existe plus qu'une seule validation possible, portant sur un contenu affiché.

Formaliser les trois niveaux d'autorisation (traiter la demande, valider le plan, valider les mises à jour documentaires) dans RULES_OF_ENGAGEMENT.md, chaque niveau exigeant sa validation propre.

Priorité 2, rendre la clôture de tâche vérifiable.

Reformuler CHECKLIST.md pour exiger une sortie de clôture standard, visible directement dans la réponse de l'agent, sous forme de liste à cocher légère (pas d'artefact élaboré, coût en tokens quasi nul), comportant au minimum, objectifs atteints, fichiers modifiés, commandes lancées avec résultat, limites connues, documents AES impactés ou mention explicite "aucun impact". Le principe directeur, déplacer la fiabilité de "l'agent se souvient de vérifier" vers "l'agent ne peut pas déclarer terminé sans avoir produit la preuve".

Ajouter un script de vérification technique reproductible (npm run verify enchaînant lint, vérification TypeScript et build) et l'exiger dans la clôture, la vérification ne dépend plus de la mémoire de l'agent à lancer chaque commande.

Supprimer l'ambiguïté du mot proportionné dans WORKFLOW.md, préciser que la proportionnalité module la profondeur d'une étape, jamais son existence, aucune étape n'est optionnelle, même pour une micro-tâche.

Priorité 3, combler les trous de couverture.

Rédiger la règle de workflow git (commit après revue et checklist validées, message de commit clair et normé, autorisation explicite avant tout push ou pull request), en l'articulant avec AES-R003 sans le dupliquer. Le registre AES-R (comportement) paraît le plus juste puisqu'il s'agit d'un point d'arrêt, pas d'une convention de code.

Formaliser le principe "le code source fait foi" comme critère général (généralisation d'ADR-001), un document de référence n'est créé que si l'information n'existe pas déjà de façon fiable et consultable dans le code versionné.

Renforcer AES-R005 selon l'intention réelle, définition systématique de tout terme technique en langage accessible à un non-initié complet, et pont explicite vers LEARNING.md, tout enseignement durable est proposé pour consignation, pas seulement énoncé en conversation.

Priorité 4, durcir le branchement par agent.

Documenter, dans le framework ou dans INSTALLATION.md, un gabarit de fichier de branchement par agent (CLAUDE.md, AGENTS.md), précisant, le socle à charger systématiquement (critère par statut, Gouvernance et Vivant au socle, Référence à la demande avec déclencheurs nommés), les déclencheurs explicites (checklist en fin de tâche, DECISIONS.md avant toute décision structurante), et la neutralisation des comportements natifs conflictuels (mémoire personnelle de l'outil interdite au profit de LEARNING.md, correspondance entre le mode plan natif et AES-R002/R003).

Trancher la question laissée ouverte, WORKFLOW.md au socle obligatoire ou en consultation à la demande avec déclencheur, les données du test penchent pour le socle, c'est le document qui définit le déroulé de chaque tâche, et les étapes sautées l'ont été quand il n'était pas chargé.

Clarifier AGENT.md, soit l'ajouter au socle, soit acter explicitement que son contenu est couvert par RULES_OF_ENGAGEMENT.md et WORKFLOW.md et le simplifier en conséquence, l'ambiguïté actuelle a produit un manquement sans violation formelle.

Priorité 5, instrumenter ce qui ne l'est pas.

Mesurer la consommation de tokens, protocole simple proposé, une tâche comparable exécutée sur un projet témoin sans framework, comparaison des /cost, à défaut, relever systématiquement le /cost par session pour construire une base de référence.

Documenter le retour d'expérience sur INSTALLATION.md (suivi en autonomie, non couvert par ce rapport).

Compléter la validation Phase 2 sur le critère restant, le premier refactoring significatif, qui surviendra naturellement dans la suite du développement (la factorisation différée des sections, documentée comme compromis, en est le candidat désigné).

⸻

11. Enseignements transversaux, au-delà du framework

Un framework ne remplace pas la vigilance humaine, il la concentre. Le test a montré précisément où le risque se loge, les validations en deux temps, les clôtures de tâche, les zones où l'agent doit juger. L'utilisateur peut désormais surveiller ces points-là plutôt que tout, ce qui est exactement le gain recherché.

La fiabilité d'un agent n'est pas uniforme, elle est excellente sur les interdictions simples et binaires, fragile sur les séquences conditionnelles. Concevoir les règles en conséquence, chaque fois que possible, transformer une séquence conditionnelle en interdiction simple.

La qualité des prompts minimaux est un instrument de mesure. Un prompt d'une ligne qui produit un bon résultat prouve que le framework porte l'information, un prompt détaillé qui produit un bon résultat ne prouve que la qualité du prompt. Alterner les deux volontairement, comme le test l'a fait, est une méthode reproductible pour évaluer toute évolution future du framework.

Les agents sont une source d'amélioration du framework, pas seulement ses exécutants. Les meilleures préconisations de ce rapport viennent des auto-analyses des agents eux-mêmes, sollicitées par des questions directes ("pourquoi as-tu dérogé"). Institutionnaliser cette pratique, après tout incident, demander le mécanisme, pas seulement l'excuse, et verser la réponse dans LEARNING.md.

L'environnement d'exécution fait partie du système. L'échec de build chez Codex (DNS restreint du bac à sable) et sa résolution méthodique (message d'erreur exact, test curl, contre-vérification en local) illustrent la démarche à généraliser, diagnostiquer avant de conclure, et distinguer défaut du projet, défaut de l'agent, et limite de l'environnement.

⸻

12. Conclusion

AES v1.1 remplit sa promesse centrale, un agent, quel qu'il soit, peut comprendre et faire avancer un projet uniquement à partir des documents du framework, sans recontextualisation manuelle, en laissant le développeur décideur. Les trois phases du cadre de validation sont atteintes, à deux réserves mineures près (retour INSTALLATION.md non documenté, refactoring à venir), et le test peut être déclaré terminé conformément au critère d'objectifs défini par l'auteur.

La faille identifiée, des règles descriptives là où il faut des conditions d'arrêt exécutoires, n'invalide pas le framework, elle définit précisément le chantier de la version suivante. Les corrections sont connues, formulées, pour certaines déjà rédigées mot pour mot par les agents eux-mêmes, et applicables sans changer la philosophie d'AES, le développeur décide, les agents assistent, le framework garantit la cohérence. La version testée garantit la cohérence des documents, la version suivante devra garantir aussi la cohérence de l'exécution.

Fin du rapport final.
