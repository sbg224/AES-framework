---
description: Vérifie la conformité d’une tâche structurante (architecture, données, dépendances, décision technique) avec DECISIONS.md et les documents pertinents, avant de continuer. Applique AES-R014.
---

# /aes-check

Applique la procédure définie par AES-R014 (RULES_OF_ENGAGEMENT.md) et détaillée dans WORKFLOW.md, Étape 1. Ce fichier ne redéfinit pas cette procédure, il en déclenche l’exécution.

Se termine toujours par une sortie sur deux lignes :

```
AES-CHECK: <statut>
REFERENCES: <référence1>, <référence2>, ...
```

Statuts possibles :

* `OK` : documents pertinents consultés, aucune contradiction trouvée.
* `CONTRADICTION` : contradiction réelle avec une décision, une règle ou un constat déjà enregistré. Bloque la tâche, conformément à AES-R014.
* `REVIEW_REQUIRED` : pas de contradiction nette, mais un lien avec l’existant mérite l’attention du développeur avant de continuer (AES-R009).
* `INSUFFICIENT_CONTEXT` : les documents pertinents ne contiennent pas assez d’information pour trancher.
* `ERROR` : la vérification elle-même a échoué (document illisible ou absent). Ne vaut jamais `OK` par défaut.

La ligne `REFERENCES:` cite chaque élément pertinent (AES-D00X, AES-A00X, ou `Fichier.md §N`), séparés par des virgules. Si aucune référence ne s’applique, indiquer `REFERENCES: aucune`.
