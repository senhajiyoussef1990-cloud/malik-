#!/bin/sh
# Épisodes 6 à 10 : attend les voix, refait les répliques des personnages de la télé avec les nouvelles voix si besoin, puis rendu HD + montage + zip.
cd /home/user/malik-
tv() { e=$1; shift; for i in "$@"; do rm -f $e/travail/essais/${i}_*.wav; done
  HF_HUB_DISABLE_XET=1 /root/venvs/cb/bin/python outils_commun/prises.py $e "$@" >> $e/travail/reprise.log 2>&1
  HF_HUB_DISABLE_XET=1 python3 outils_commun/choix_prises.py $e "$@" >> $e/travail/reprise.log 2>&1
  for i in "$@"; do ffmpeg -y -v error -i $e/voix/$i.mp3 -af atempo=1.07 -c:a libmp3lame -q:a 2 $e/voix/$i.t.mp3 && mv $e/voix/$i.t.mp3 $e/voix/$i.mp3; done; }
run() { e=$1; shift; until grep -q "VOIX $e FIN" travail_voix.log 2>/dev/null; do sleep 30; done
  [ "$e" = autorite ] && tv autorite s06b s09a s11b
  sh outils_commun/episode.sh $e "$@"; echo "LIVRE2 $e" >> travail_voix.log; }
SCENES="^05$" sh outils_commun/episode.sh urgence EP06_L_urgence_artificielle "ÉPISODE 06" "L’URGENCE ARTIFICIELLE" "« Plus que cinq minutes ! »" "Plus que 5 minutes… vraiment ?"; echo "LIVRE2 urgence" >> travail_voix.log
run autorite EP07_L_autorite_mise_en_scene "ÉPISODE 07" "L’AUTORITÉ MISE EN SCÈNE" "« La blouse ne fait pas la preuve »" "Il porte une blouse… alors il a raison ?"
run recompense EP08_La_recompense_imprevisible "ÉPISODE 08" "LA RÉCOMPENSE IMPRÉVISIBLE" "« Encore un essai »" "Juste un essai de plus…"
run echo EP09_La_chambre_d_echo "ÉPISODE 09" "LA CHAMBRE D’ÉCHO" "« Quand une voix devient une foule »" "Trois échos… ou trois témoins ?"
run indignation EP10_La_colere_contagieuse "ÉPISODE 10" "LA COLÈRE CONTAGIEUSE" "« Le scandale en une image »" "Une photo… et tout le monde s'indigne !"
