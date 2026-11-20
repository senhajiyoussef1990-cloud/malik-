#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX reduflation FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 torches" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh reduflation EP06_La_reduflation "ÉPISODE 6" "LA RÉDUFLATION" "« Le paquet qui rétrécit »" "Même prix… moins de biscuits ?"
echo "LIVRE2 reduflation" >> travail_voix.log
