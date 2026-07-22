DECISIONS.md (fixture de test, ne représente pas un vrai projet)

⸻

ADR-001 — Choix de PostgreSQL auto-hébergé sur Proxmox

Date : 2026-07-01

Auteur : Développeur, avec l’agent

Contexte : le projet nécessite une base de données relationnelle. Une option managée (Supabase) et une option auto-hébergée (PostgreSQL sur l’infrastructure Proxmox déjà exploitée pour d’autres services) ont été comparées.

Décision : PostgreSQL est déployé auto-hébergé sur l’infrastructure Proxmox existante, pas via Supabase.

Justification : l’infrastructure Proxmox est déjà en place et maîtrisée, évite une dépendance à un service tiers managé et ses coûts récurrents.

Alternatives étudiées : Supabase (managé), écartée pour dépendance externe et coût récurrent non justifié au vu de l’infrastructure déjà disponible.

Statut : Validée
