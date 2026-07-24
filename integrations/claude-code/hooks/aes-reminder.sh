#!/bin/sh
# Hook Claude Code déclenché à chaque message envoyé par l'utilisateur
# (événement "UserPromptSubmit"). Rôle unique : rappeler à l'agent
# d'appliquer AES-R014 (vérification de conformité avant une tâche
# structurante), sans jamais bloquer la conversation.
#
# Claude Code exécute ce script et lit le JSON qu'il affiche sur sa sortie
# standard (stdout) pour savoir comment réagir. Le bloc `cat <<'JSON' ... JSON`
# ci-dessous est un "heredoc" : tout ce qui se trouve entre les deux
# marqueurs JSON est renvoyé tel quel sur stdout. Les guillemets simples
# autour du premier marqueur ('JSON') empêchent le shell d'essayer
# d'interpréter quoi que ce soit à l'intérieur (variables, guillemets) :
# le contenu est envoyé strictement tel qu'écrit ici.
cat <<'JSON'
{
  "continue": true,
  "suppressOutput": true,
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Rappel AES (AES-R014) : si cette tache touche l'architecture, les donnees ou une decision deja prise, lancer /aes-check avant de continuer."
  }
}
JSON
# Détail des champs, tels que définis par la documentation officielle de
# Claude Code (voir AES-A007, AUDIT.md racine, pour l'historique complet) :
#
#   "continue"      : true  -> ne bloque jamais la conversation.
#   "suppressOutput" : true  -> ce JSON n'est pas affiché dans l'interface,
#                     seul l'agent le reçoit.
#   "hookSpecificOutput.hookEventName" : doit valoir exactement le nom de
#                     l'événement traité ("UserPromptSubmit"), sinon le
#                     champ additionalContext est ignoré par Claude Code.
#   "hookSpecificOutput.additionalContext" : SEUL champ réellement transmis
#                     au contexte du modèle pour cet événement. Avant
#                     AES-A007, ce script utilisait le champ "systemMessage",
#                     qui n'est affiché que dans l'interface utilisateur et
#                     n'atteint jamais l'agent : le rappel AES-R014 était
#                     donc silencieusement inopérant depuis sa création en
#                     version 1.3.0.
