#!/bin/sh
# File d'attente des voix : attend que l'épisode précédent ait fini ses voix, puis fait celles des suivants. sh file_voix.sh <précédent> ep1 ep2 ...
cd /home/user/malik-; p=$1; shift
until grep -q "VOIX $p FIN" travail_voix.log 2>/dev/null; do sleep 30; done
sh outils_commun/voix_episodes.sh "$@"
