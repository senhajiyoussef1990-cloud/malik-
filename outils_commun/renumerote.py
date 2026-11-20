"""Renumérote la série : bacon = 1, orange = 2… Met à jour le montage, la fabrication, les publications, la story, la couverture et le zip.
usage : python3 outils_commun/renumerote.py"""
import os, re, json, glob, subprocess, shutil
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORDRE = ["bacon", "orange", "saumon", "diamant", "torches", "reduflation", "chanson", "ampoule", "martiens",
         "cereales", "haleine", "rasoir", "eau", "cowboy", "neufneuf", "prixbarre", "leurre", "lait", "pain", "echantillon", "abonnement"]
import sys
for n, ep in enumerate(ORDRE, 1):
    if sys.argv[1:] and ep not in sys.argv[1:]: continue
    E = f"{R}/{ep}"; mp = f"{E}/outils/montage.py"; s = open(mp).read()
    ancien = re.search(r'NOM = "(EP\d+)_([^"]+)"', s); vieux, reste = ancien.group(1), ancien.group(2); nouveau = f"EP{n:02d}"
    s = s.replace(f'NOM = "{vieux}_{reste}"', f'NOM = "{nouveau}_{reste}"')
    s = re.sub(r'badge = "ÉPISODE \d+"', f'badge = "ÉPISODE {n}"', s)
    if 'sys.argv[1:] == ["couverture"]' not in s:
        s = s.replace('if __name__ == "__main__":\n    calque();', 'import sys\nif __name__ == "__main__" and sys.argv[1:] == ["couverture"]:\n    couverture()\nelif __name__ == "__main__":\n    calque();')
        s = s.replace("def couverture():\n    s2 = next(s for s in plans if s[\"n\"] == 1)\n    t = s2[\"t0\"] + s2[\"lignes\"][\"s01b\"][0] + 0.8",
                      "def couverture():\n    try:\n        s2 = next(s for s in plans if s[\"n\"] == 1); t = s2[\"t0\"] + s2[\"lignes\"][\"s01b\"][0] + 0.8\n    except Exception: t = 3.0")
    open(mp, "w").write(s)
    # fabrication locale et GitHub
    fs = f"{R}/outils_commun/fin_{ep}.sh"
    if os.path.exists(fs): t = open(fs).read(); t = t.replace(f"{vieux}_{reste}", f"{nouveau}_{reste}"); t = re.sub(r'"ÉPISODE \d+"', f'"ÉPISODE {n}"', t); open(fs, "w").write(t)
    lj = f"{R}/lancer/{ep}.json"
    if os.path.exists(lj): d = json.load(open(lj)); d["nom"] = f"{nouveau}_{reste}"; d["badge"] = f"ÉPISODE {n}"; json.dump(d, open(lj, "w"), ensure_ascii=False, indent=1)
    sp = f"{E}/specification.json"
    if os.path.exists(sp): d = json.load(open(sp)); d["nom"] = f"{nouveau}_{reste}"; d["badge"] = f"ÉPISODE {n}"; json.dump(d, open(sp, "w"), ensure_ascii=False, indent=1)
    # sorties déjà faites : renommer, corriger les textes, refaire couverture + story + zip
    for f in glob.glob(f"{E}/sortie/{vieux}_*"): os.rename(f, f.replace(f"/{vieux}_", f"/{nouveau}_"))
    pub = f"{E}/sortie/{nouveau}_{reste}_publications.txt"
    if os.path.exists(pub): t = open(pub).read(); t = re.sub(r"ÉPISODE \d+", f"ÉPISODE {n}", t).replace(f"{vieux}_{reste}", f"{nouveau}_{reste}"); open(pub, "w").write(t)
    vid = f"{E}/sortie/{nouveau}_{reste}_sans_sous_titres.mp4"
    if os.path.exists(vid):
        subprocess.run(["python3", mp, "couverture"], cwd=E, check=True)
        f2 = open(f"{R}/outils_commun/fin_{ep}.sh").read() if os.path.exists(fs) else ""
        m = re.search(r'episode\.sh \S+ \S+ "([^"]*)" "([^"]*)" "([^"]*)" "([^"]*)"', f2)
        if m: subprocess.run(["python3", f"{R}/outils_commun/story.py", f"sortie/{nouveau}_{reste}_sans_sous_titres.mp4", "5" if os.path.exists(f"{E}/travail/plans.json") else "0.15", m.group(1), m.group(2), m.group(3), m.group(4), f"sortie/{nouveau}_{reste}_story.png", "fonts"], cwd=E, check=True)
        z = f"{E}/sortie/{nouveau}_{reste}.zip"
        if os.path.exists(f"{E}/sortie/{vieux}_{reste}.zip") or True:
            for old in glob.glob(f"{E}/sortie/*.zip"): os.remove(old)
            subprocess.run(["zip", "-q", "-0", os.path.basename(z), f"{nouveau}_{reste}.mp4", f"{nouveau}_{reste}_publications.txt", f"{nouveau}_{reste}_story.png", f"{nouveau}_{reste}_couverture.png"], cwd=f"{E}/sortie", check=True)
    print(n, ep, vieux, "→", nouveau)
