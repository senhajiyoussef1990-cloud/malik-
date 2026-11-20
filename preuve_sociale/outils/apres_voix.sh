#!/bin/sh
# Attend la fin des prises, choisit/nettoie les voix, calcule le minutage, rend les 17 scènes et monte l'épisode.
E=/home/user/malik-/preuve_sociale
until grep -q "^FIN" $E/travail/prises.log; do sleep 30; done
cd /home/user/malik- && HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py preuve_sociale > $E/travail/choix.log 2>&1 || exit 1
cd $E && HF_HUB_DISABLE_XET=1 python3 outils/minutage.py >> $E/travail/choix.log 2>&1 || exit 2
sh /home/user/malik-/anim_code/preuve_sociale/tout.sh
tail -3 /home/user/malik-/anim_code/travail/preuve_sociale_rendu.log
