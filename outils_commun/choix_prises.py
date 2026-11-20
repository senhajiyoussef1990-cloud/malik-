"""Phase 2 : garde la prise la plus fidèle au texte (Whisper), coupe tout ce qui suit le dernier mot (bruits parasites),
accélère le narrateur (x1.12), puis nettoie le souffle.  usage : python3 choix_prises.py <dossier_episode>"""
import json, os, sys, glob, re, difflib, subprocess, numpy as np
from faster_whisper import WhisperModel
R = os.path.abspath(sys.argv[1]); SEUL = sys.argv[2:]; m = WhisperModel("small", device="cpu", compute_type="int8")
norm = lambda s: re.sub(r"[^a-zàâçéèêëîïôûùüÿœ' ]", " ", s.lower().replace("’", "'")).split()
def audio(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
rap = []
for L in json.load(open(f"{R}/lignes.json")):
    if SEUL and L["id"] not in SEUL: continue
    best = None
    for f in sorted(glob.glob(f"{R}/travail/essais/{L['id']}_*.wav")):
        a = audio(f); segs = list(m.transcribe(a, language="fr", word_timestamps=True)[0])
        mots = []
        for s in segs:
            for w in s.words:                                          # recolle « l » + « 'histoire »
                if mots and (w.word.strip()[:1] in "'’-" or mots[-1].word.strip()[-1:] in "'’"): mots[-1].word += w.word.strip(); mots[-1].end = w.end
                else: mots.append(w)
        txt = " ".join(s.text for s in segs)
        A, B = norm(L["text"]), norm(txt); r = difflib.SequenceMatcher(None, A, B).ratio()
        # pénalité pour mots en trop à la fin (parasites) ou fin manquante
        fin = mots[-1].end if mots else len(a) / 16000
        # couper après le mot qui correspond au DERNIER mot du texte (première occurrence), pas après une répétition parasite
        nb = [norm(w.word) for w in mots]; nb = [x[0] if x else "" for x in nb]
        bl = [b for b in difflib.SequenceMatcher(None, A, nb, autojunk=False).get_matching_blocks() if b.size]
        if bl:
            j = bl[-1].b + bl[-1].size - 1
            if bl[-1].a + bl[-1].size < len(A):                        # les derniers mots ne collent pas exactement (pluriel…) : on cherche le mot final le plus proche
                cand = [k for k in range(j + 1, len(nb)) if difflib.SequenceMatcher(None, nb[k], A[-1]).ratio() > .6]
                j = cand[0] if cand else len(mots) - 1
            fin = mots[j].end; B2 = nb[:j + 1]
        else: B2 = B
        sc = r - .15 * (A[-1:] != B2[-1:]) - .03 * max(0, len(B) - len(A)) + .05 * difflib.SequenceMatcher(None, A, B2).ratio()
        if best is None or sc > best[0]: best = (sc, f, fin, txt, r)
    sc, f, fin, txt, r = best
    # couper juste après le dernier mot reconnu du texte
    d = len(audio(f)) / 16000; fin = min(d, fin + .3)
    af = f"afade=t=in:d=0.01,afade=t=out:st={max(0, fin - .08):.2f}:d=0.08" + (",atempo=1.12" if L["who"] == "narr" else "")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-t", f"{fin:.2f}", "-af", af, "-c:a", "libmp3lame", "-q:a", "2", f"{R}/voix/{L['id']}.mp3"], check=True)
    rap.append(f"{L['id']} {r:.2f} {os.path.basename(f)} | {L['text']}  ->  {txt.strip()}"); print(rap[-1], flush=True)
open(f"{R}/travail/choix_voix.txt", "a" if SEUL else "w").write("\n".join(rap) + "\n")
import shutil
if not SEUL: shutil.rmtree(f"{R}/voix/brut", ignore_errors=True)
else:
    for i in SEUL:
        try: os.remove(f"{R}/voix/brut/{i}.mp3")
        except FileNotFoundError: pass
subprocess.run(["python3", os.path.join(os.path.dirname(os.path.abspath(__file__)), "nettoie_voix.py"), f"{R}/voix", *SEUL], check=True)
