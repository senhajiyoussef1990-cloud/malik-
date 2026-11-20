"""Écrit <ep>/sortie/<NOM>_publications.txt à partir d'un petit fichier JSON.
usage : python3 outils_commun/publications.py <pub.json>
pub : ep, nom, num, titre, sous, accroche (1re réplique), resume (FB), points (5 lignes), morale, question, tiktok, yt_titre, yt_desc,
      tags_fb, tags_insta, tags_tiktok, tags_yt, tags_studio, sondage, partage"""
import json, sys, os
P = json.load(open(sys.argv[1])); R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); N = P["nom"]; B = "══════════════════════════════════════════"
emo = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"]
t = f"""NE SUIS PAS LES MOUTONS — ÉPISODE {P['num']}
« {P['titre']} — {P['sous']} »
Vidéo : {N}.mp4 (9:16, 1080×1920, sous-titres incrustés)

{B}
FACEBOOK (Reels + publication de page)
{B}
« {P['accroche']} » {P['emoji']}

{P['resume']}

👉 {P['morale']}

{P['question']} 👇
{P['partage']} 😏

{P['tags_fb']}

{B}
INSTAGRAM (Reel)
{B}
« {P['accroche']} » {P['emoji']} 🦊

""" + "\n".join(f"{emo[k]} {p}" for k, p in enumerate(P["points"])) + f"""

✅ {P['morale2']}

💬 {P['question']} 👇
🔁 Enregistre et partage à ceux qui suivent le troupeau.

.
.
{P['tags_insta']}

{B}
TIKTOK
{B}
{P['tiktok']} Regarde jusqu’à la fin

{P['morale']} 🦊

{P['tags_tiktok']}

{B}
YOUTUBE SHORTS
{B}
TITRE (100 caractères max) :
{P['yt_titre']}

DESCRIPTION :
{P['yt_desc']}

{P['morale']}
Arrête de suivre le troupeau. Suis le renard… et pense par toi-même !

🔔 Abonne-toi pour ne pas suivre le troupeau.

{P['tags_yt']}

TAGS (champ « Tags » de YouTube Studio) :
{P['tags_studio']}

{B}
STORY (Instagram / Facebook)
{B}
• Image : {N}_story.png
• Ajoute le sticker « Lien » vers la vidéo et un sondage : « {P['sondage']} »

{B}
CONSEILS DE PUBLICATION
{B}
• Couverture : {N}_couverture.png
• Les sous-titres sont déjà dans la vidéo : ne pas activer les sous-titres automatiques par-dessus.
• Épingler en commentaire : « {P['question']} 👇 »
"""
open(f"{R}/{P['ep']}/sortie/{N}_publications.txt", "w").write(t); print("ok", N)
