#!/bin/sh
# Pour chaque épisode : attend ses voix et ses scènes (fichier anim_code/<ep>/PRET), puis rendu + montage + zip.
cd /home/user/malik-
run() { e=$1; shift
  until grep -q "VOIX $e FIN" travail_voix.log 2>/dev/null && [ -f anim_code/$e/PRET ]; do sleep 30; done
  if [ "$e" = urgence ]; then rm -f urgence/travail/essais/s08a_*.wav; HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py urgence s08a > urgence/travail/reprise.log 2>&1; HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py urgence s08a >> urgence/travail/reprise.log 2>&1; fi
  if [ "$e" = echo ]; then grep -q "« Le pont est fermé ! »" echo/travail/choix_voix.txt || { rm -f echo/travail/essais/s04a_*.wav; HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py echo s04a > echo/travail/reprise.log 2>&1; HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py echo s04a >> echo/travail/reprise.log 2>&1; }; fi
  sh outils_commun/episode.sh $e "$@"; echo "LIVRE $e" >> travail_voix.log
}
run urgence EP06_L_urgence_artificielle "ÉPISODE 06" "L’URGENCE ARTIFICIELLE" "« Plus que cinq minutes ! »" "Plus que 5 minutes… vraiment ?"
run autorite EP07_L_autorite_mise_en_scene "ÉPISODE 07" "L’AUTORITÉ MISE EN SCÈNE" "« La blouse ne fait pas la preuve »" "Il porte une blouse… alors il a raison ?"
run recompense EP08_La_recompense_imprevisible "ÉPISODE 08" "LA RÉCOMPENSE IMPRÉVISIBLE" "« Encore un essai »" "Juste un essai de plus…"
run echo EP09_La_chambre_d_echo "ÉPISODE 09" "LA CHAMBRE D’ÉCHO" "« Quand une voix devient une foule »" "Trois échos… ou trois témoins ?"
run indignation EP10_La_colere_contagieuse "ÉPISODE 10" "LA COLÈRE CONTAGIEUSE" "« Le scandale en une image »" "Une photo… et tout le monde s'indigne !"
