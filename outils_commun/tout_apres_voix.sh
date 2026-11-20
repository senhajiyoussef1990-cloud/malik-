#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX repetition FIN" travail_voix.log 2>/dev/null; do sleep 30; done
sh outils_commun/episode.sh repetition EP02_La_repetition "ÉPISODE 02" "LA RÉPÉTITION" "« À force de l’entendre »" "Tu la connais par cœur… mais est-elle vraie ?"
until grep -q "VOIX peur_rumeur FIN" travail_voix.log 2>/dev/null; do sleep 30; done
sh outils_commun/episode.sh peur_rumeur EP03_La_peur_et_la_rumeur "ÉPISODE 03" "LA PEUR ET LA RUMEUR" "« Le bruit avant les faits »" "Un bruit… et tout le village panique !"
