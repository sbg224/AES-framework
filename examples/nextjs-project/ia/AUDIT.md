AUDIT.md

AI Engineering System (AES)

Structure : issue d’AES v1.1.0

Statut : 🟢 Vivant

Responsable : Développeur

Modification par un agent : Proposition uniquement (validation obligatoire)

Documents liés :

* STANDARDS.md
* CHECKLIST.md
* DECISIONS.md
* CHANGELOG.md
* CONTEXT.md
* ARCHITECTURE.md

⸻

1. Objectif

Ce document centralise les résultats des audits réalisés sur le projet.

Il permet de suivre son niveau de qualité, d’identifier les risques et de mesurer les améliorations au fil du temps.

⸻

2. Portée

L’audit évalue l’état global du projet.

Il permet d’identifier les forces, les faiblesses, les risques et les axes d’amélioration qui dépassent une tâche individuelle.

Un audit peut conduire à des recommandations, des plans d’action ou des décisions d’architecture.

⸻

3. Organisation

Chaque audit doit être enregistré sous un identifiant unique.

Exemple :

* AES-A001
* AES-A002
* AES-A003

Les identifiants ne sont jamais réutilisés.

⸻

4. Structure d’un audit

Chaque audit doit contenir au minimum :

Identifiant

Exemple :

AES-A001

Date

Date de réalisation.

Auteur

Développeur ou agent ayant réalisé l’audit.

Domaine

Exemples :

* Qualité
* Architecture
* Sécurité
* Performance
* Documentation
* Accessibilité

Résumé

Présentation synthétique des conclusions.

Constats

Liste des observations réalisées.

Recommandations

Actions proposées pour améliorer le projet.

Priorité

Par exemple :

* Critique
* Élevée
* Moyenne
* Faible

Statut

Par exemple :

* Ouvert
* En cours
* Corrigé
* Fermé

⸻

5. Bonnes pratiques

Les audits doivent être :

* factuels ;
* vérifiables ;
* reproductibles ;
* argumentés.

Les recommandations doivent être justifiées.

⸻

6. Évolution

Un audit n’est jamais modifié pour masquer son historique.

Si la situation évolue, un nouvel audit ou une mise à jour de son statut est enregistré.

⸻

7. Références

Ce document s’appuie sur :

* STANDARDS.md ;
* CHECKLIST.md.

Les audits peuvent entraîner des mises à jour de :

* DECISIONS.md ;
* CHANGELOG.md ;
* CONTEXT.md ;
* ARCHITECTURE.md.

⸻

8. Conclusion

L’audit complète la checklist.

La checklist valide une tâche.

L’audit évalue durablement la qualité du projet.

⸻

AES-A001

Date

2026-07-20

Auteur

Codex, à la demande du développeur.

Domaine

Qualité, sécurité, performance, accessibilité, documentation et architecture.

Résumé

Le socle Next.js est sain pour le stade actuel : lint, vérification TypeScript et build de production aboutissent. Aucun risque critique n’a été observé dans le code présent. Le projet reste toutefois une vitrine en cours de construction ; les principaux travaux avant mise en production concernent la sécurité des dépendances, les en-têtes de sécurité, les tests, le SEO et la synchronisation de la documentation avec l’état réel du code.

Constats

* Sécurité — priorité moyenne : `npm audit --omit=dev` signale une vulnérabilité modérée dans `postcss@8.4.31`, dépendance transitive de `next@16.2.10` (GHSA-qx2v-qp2m-jg93, XSS lors de la génération CSS). Le rapport npm ne propose pas de correction semver exploitable : il suggère un retour à Next.js 9.3.3, incompatible avec le projet. Aucune mise à jour automatique ne doit donc être exécutée.
* Sécurité — priorité moyenne avant exposition publique : `next.config.ts` ne définit aucun en-tête HTTP de sécurité. Le site actuel ne traite pas encore d’entrée utilisateur, mais une politique CSP, `X-Content-Type-Options`, `Referrer-Policy` et les protections associées devront être définies avant l’arrivée du formulaire de devis.
* Qualité — priorité moyenne : aucune suite de tests automatisés n’est présente. Les contrôles statiques passent, mais les parcours de navigation par ancres, la navbar responsive et le futur formulaire ne sont pas couverts par des tests d’intégration ou E2E.
* SEO et accessibilité — priorité moyenne avant lancement : la langue du document, les titres de sections, les libellés de navigation et la réduction de mouvement sont correctement présents. En revanche, aucun lien d’évitement vers le contenu principal, `robots.ts`, `sitemap.ts` ou métadonnée Open Graph n’est actuellement implémenté.
* Documentation — priorité moyenne : le README est encore celui de create-next-app et mentionne Geist, alors que le projet utilise Outfit et DM Sans. `STACK.md` présente Supabase, Resend, Calendly et MDX comme technologies utilisées alors qu’ils ne figurent pas dans les dépendances ni le code courant ; ils doivent être distingués comme technologies prévues jusqu’à leur implémentation.
* Fiabilité de build — priorité faible : le build dépend de la récupération des polices Google au premier build. Il échoue dans le sandbox isolé par DNS, mais réussit avec accès réseau. Cette dépendance est acceptable pour l’hébergement visé, avec un risque de reproductibilité hors connexion.
* Hygiène des dépendances — priorité faible : `npm ls --depth=0` liste cinq paquets transitifs comme « extraneous ». Le build, TypeScript et lint passent ; l’arbre d’installation doit néanmoins être réconcilié avec `package-lock.json` lors de la prochaine maintenance des dépendances.

Contrôles réalisés

* `npm run lint` : réussi.
* `npx tsc --noEmit` : réussi.
* `npm run build` : réussi avec accès réseau ; toutes les routes actuelles sont générées statiquement.
* `npm audit --omit=dev` : deux alertes modérées, correspondant à la dépendance directe `next` et à son `postcss` transitif vulnérable.
* Revue manuelle du code, de la configuration Next.js/Tailwind, de la navigation et des documents AES pertinents.

Recommandations

1. Surveiller une mise à jour compatible de Next.js corrigeant `postcss`, puis la tester dans une tâche dédiée avant toute mise à niveau.
2. Définir les en-têtes HTTP de sécurité et la stratégie CSP avant d’ajouter le formulaire ou tout script tiers.
3. Ajouter des tests E2E ciblés pour la navigation, le formulaire de devis et les parcours de contact lors de leur implémentation.
4. Avant lancement, ajouter les fichiers SEO (`robots.ts`, `sitemap.ts`) et les métadonnées Open Graph, ainsi qu’un lien d’évitement vers le contenu principal.
5. Mettre à jour le README et distinguer dans `STACK.md` les éléments effectivement installés de ceux seulement projetés.
6. Réinstaller les dépendances à partir du lockfile lors d’une maintenance dédiée, puis vérifier que `npm ls` ne signale plus de paquet extraneous.

Priorité

Moyenne. Aucun correctif urgent n’est requis pour le code actuellement exposé, mais les recommandations de sécurité et de SEO doivent être traitées avant le lancement public.

Statut

Ouvert.
