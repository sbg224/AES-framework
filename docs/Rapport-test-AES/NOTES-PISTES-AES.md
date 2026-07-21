NOTES-PISTES-AES.md

Notes et pistes d'amélioration, prises à part pendant le test AES v1.1

Ce document n'est pas le rapport final. C'est un catalogue des idées et remarques
notées en parallèle des exercices, à trier et développer plus tard.

⸻

1. Piste d'évolution, gestion du cycle de vie de la connaissance

Reprise telle que rédigée, sans modification. C'est une réflexion prospective,
pas une analyse déjà faite, elle mérite d'être soumise à un agent comme prompt
d'analyse quand le moment sera venu, pas traitée à la va-vite maintenant.

Contexte
Les documents vivants (DECISIONS.md, AUDIT.md, LEARNING.md, CHANGELOG.md) sont
faits pour s'enrichir en continu. Un projet long peut produire des centaines de
décisions, d'audits et de retours d'expérience. Question à anticiper, comment
AES gère cette croissance sans alourdir le travail du développeur ni de l'agent.
Analyse prospective uniquement, aucune modification du framework à ce stade.

Sujet 1, Horodatage
Plusieurs décisions/audits/learnings peuvent partager la même date, ordre
chronologique ambigu. Étudier l'intérêt d'un horodatage complet (ISO 8601,
date + heure + fuseau), quels documents devraient l'utiliser, quel format,
et si l'évolution a un réel intérêt.

Sujet 2, Politique d'archivage
Les documents vivants grandissent sans limite. Étudier une politique
d'archivage, garder seulement le récent dans les documents actifs, déplacer
l'historique vers un dossier archive/, laisser l'agent consulter l'historique
seulement si nécessaire. Comparer avantages et inconvénients.

Sujet 3, Critère d'archivage
Si une politique existait, quelle stratégie, archivage annuel, par version
majeure, par taille de fichier, par nombre de décisions/audits. Ne recommander
une stratégie que si elle est justifiable.

Sujet 4, Documents concernés
Potentiellement archivables, DECISIONS.md, AUDIT.md, LEARNING.md.
Probablement toujours actifs, CONTEXT.md, STACK.md, ARCHITECTURE.md,
WORKFLOW.md, STANDARDS.md, AGENT.md, RULES_OF_ENGAGEMENT.md.
Cas particulier à étudier, CHANGELOG.md.

Sujet 5, Impact sur les agents IA
Qualité du contexte, rapidité de compréhension, coût en tokens, capacité à
retrouver une décision ancienne. Déterminer si l'archivage améliore ces points.

Contraintes de cette réflexion, ne modifier aucun document du framework, ne
créer aucune nouvelle règle de gouvernance à ce stade, s'appuyer sur des
arguments techniques et l'expérience acquise avec les agents.

Rapport attendu le moment venu, analyse du besoin réel, avantages et risques
d'une politique d'archivage, recommandation argumentée, conditions préalables
à réunir, et une conclusion nette, abandonner, reporter à une future version,
ou préparer dès maintenant.

Remarque, à ce jour cette réflexion reste hypothétique. DECISIONS.md n'a
encore qu'une seule entrée (ADR-001), AUDIT.md une seule (AES-A001). Le besoin
réel ne pourra être évalué qu'après une croissance effective de ces documents
sur un projet qui dure. À reprendre plus tard avec des chiffres réels plutôt
que par anticipation pure.

⸻

2. Correction de texte, tirets/caractères

Note prise en cours de test, présence de tirets ou caractères à corriger dans
un texte (probablement des tirets cadratins « — », cohérent avec la préférence
déjà connue d'éviter ce caractère). Le texte précis concerné n'a pas été
identifié dans cette note, à préciser avant correction, quel document, quelle
occurrence.

⸻

3. Version antérieure de CLAUDE.md, changement de session

Version notée à part, antérieure aux ajustements faits en cours de test
(avant l'ajout de RULES_OF_ENGAGEMENT.md au socle et du déclencheur explicite
pour CHECKLIST.md) :

## Socle obligatoire
Charge systématiquement ces deux documents au démarrage de chaque session.

@ia/SYSTEM.md
@ia/templates/CONTEXT.md

## Comportement de l'agent
Applique RULES_OF_ENGAGEMENT.md dans son intégralité (AES-R001 à AES-R011),
notamment AES-R007 et AES-R006.

## Autres documents
Consulte ia/templates/ à la demande, ne les charge pas systématiquement.

Point associé, une question sur le changement de session et le renouvellement
de CONTEXT.md en lien avec la présence de ce fichier CLAUDE.md. Ce point
recoupe ce qui a été traité en détail dans le rapport final (section
branchement technique), notamment la nécessité de recharger un contexte à jour
à chaque nouvelle session. Gardé ici comme trace de la version de départ, pour
comparaison avec la version finale actuellement en place dans le projet.

⸻

4. Idées fragmentaires à développer

Le gain de temps
Précisé après coup, ce point souligne une tension à surveiller, pas encore
un problème constaté. Le framework est censé faire gagner du temps, tout en
restant rigoureux et discipliné (plan avant code, revue complète, checklist
de clôture). Ces deux objectifs peuvent entrer en tension, plus de rigueur
signifie plus d'étapes, donc potentiellement moins de gain de temps immédiat.
À surveiller sur la durée, le gain de temps doit rester net une fois la
discipline appliquée, pas seulement en théorie.

Penser à un fichier skills
Précisé après coup, hypothèse seulement, pas encore développée. L'idée est
qu'un fichier de compétences pourrait être nécessaire pour les agents,
séparé de ce qui existe déjà (WORKFLOW.md, STANDARDS.md). Reste à définir,
si le besoin se confirme, ce que ce fichier contiendrait précisément et en
quoi il différerait des documents actuels.

⸻

Ces quatre points sont volontairement laissés ouverts et non tranchés. Ils ne
font pas partie des conclusions du rapport final, ce sont des pistes à
reprendre et clarifier lors d'une prochaine session de travail sur AES.
