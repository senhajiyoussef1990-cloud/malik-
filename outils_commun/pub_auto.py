"""Écrit le fichier de publications d'un épisode à partir de sa specification.json et de quelques champs courts.
usage (en Python) : from pub_auto import pub ; pub("rarete", emoji, resume, points, question, partage, tiktok, yt_titre, yt_desc, mots, sondage)"""
import json, os, subprocess, unicodedata
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def sans_acc(s): return "".join(ch for ch in unicodedata.normalize("NFD", s) if unicodedata.category(ch) != "Mn")
def pub(ep, emoji, resume, points, question, partage, tiktok, yt_titre, yt_desc, mots, sondage):
    S = json.load(open(f"{R}/{ep}/specification.json")); L = {l[0]: l[4] for l in S["lignes"]}
    num = S["badge"].split()[-1]; titre = S["titre"]; sous = S["sous"].strip("« »")
    M = [m.replace(" ", "") for m in mots]
    P = {"ep": ep, "nom": S["nom"], "num": num, "titre": titre, "sous": sous, "emoji": emoji, "accroche": S["accroche"], "resume": resume, "points": points,
         "morale": L["s13a"], "morale2": L["s15d"].replace("Voilà. ", ""), "question": question, "partage": partage, "tiktok": tiktok, "yt_titre": yt_titre + " #Shorts", "yt_desc": yt_desc,
         "tags_fb": " ".join(["#NeSuisPasLesMoutons"] + ["#" + m for m in M] + ["#HistoireVraie", "#EspritCritique", "#DessinAnimé", "#PenseParToiMême", "#LeSaviezVous"]),
         "tags_insta": " ".join(["#nesuispaslesmoutons"] + ["#" + sans_acc(m).lower() for m in M] + ["#histoirevraie", "#lesaviezvous", "#espritcritique", "#dessinanime", "#animation", "#pensepartoimeme", "#reelsfrance", "#lerenardetlemouton"]),
         "tags_tiktok": " ".join(["#NeSuisPasLesMoutons"] + ["#" + m for m in M] + ["#LeSaviezVous", "#EspritCritique", "#DessinAnimé", "#ApprendreSurTikTok", "#PourToi", "#fyp", "#foryou"]),
         "tags_yt": " ".join(["#Shorts", "#NeSuisPasLesMoutons"] + ["#" + m for m in M[:3]] + ["#EspritCritique", "#DessinAnimé"]),
         "tags_studio": ", ".join(["ne suis pas les moutons"] + [m.lower() for m in mots] + ["esprit critique", "dessin animé", "renard et mouton", "shorts"]), "sondage": sondage}
    f = f"/tmp/claude-0/pub_{ep}.json"; json.dump(P, open(f, "w"), ensure_ascii=False, indent=1)
    print(subprocess.run(["python3", f"{R}/outils_commun/publications.py", f], capture_output=True, text=True).stdout.strip())
