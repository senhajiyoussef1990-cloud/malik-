#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX abonnement FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 echantillon" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh abonnement EP31_L_essai_gratuit "ÉPISODE 31" "L’ESSAI GRATUIT" "« Ce que tu ne refuses pas, tu le paies »" "Gratuit… jusqu’à quand ?"
echo "LIVRE2 abonnement" >> travail_voix.log
