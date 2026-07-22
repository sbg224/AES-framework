#!/bin/sh
cat <<'JSON'
{
  "continue": true,
  "suppressOutput": true,
  "systemMessage": "Rappel AES (AES-R014) : si cette tache touche l'architecture, les donnees ou une decision deja prise, lancer /aes-check avant de continuer."
}
JSON
