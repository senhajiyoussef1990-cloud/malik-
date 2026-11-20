#!/bin/sh
cd /home/user/malik-
until grep -q "VOIX prixbarre FIN" travail_voix.log 2>/dev/null && grep -q "LIVRE2 neufneuf" travail_voix.log; do sleep 30; done
sh outils_commun/episode.sh prixbarre EP16_Le_prix_barre "ÉPISODE 16" "LE PRIX BARRÉ" "« Une affaire, par rapport à quoi ? »" "Moins cinquante pour cent… de quoi ?"
echo "LIVRE2 prixbarre" >> travail_voix.log
