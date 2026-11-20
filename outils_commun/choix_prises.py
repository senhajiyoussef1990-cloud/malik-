"""Phase 2 : garde la prise la plus fidèle au texte (Whisper), coupe tout ce qui suit le dernier mot (bruits parasites),
accélère le narrateur (x1.12), puis nettoie le souffle.  usage : python3 choix_prises.py <dossier_episode>"""
import json, os, sys, glob, re, difflib, subprocess, numpy as np
from faster_whisper import WhisperModel
R = os.path.abspath(sys.argv[1]); m = WhisperModel("small", device="cpu", compute_type="int8")
norm = lambda s: re.sub(r"[^a-zàâçéèêëîïôûùüÿœ' ]", " ", s.lower().replace("’", "'")).split()
def audio(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
rap = []
for L in json.load(open(f"{R}/lignes.json")):
    best = None
    for f in sorted(glob.glob(f"{R}/travail/essais/{L['id']}_*.wav")):
        a = audio(f); segs = list(m.transcribe(a, language="fr", word_timestamps=True)[0])
        mots = [w for s in segs for w in s.words]; txt = " ".join(s.text for s in segs)
        A, B = norm(L["text"]), norm(txt); r = difflib.SequenceMatcher(None, A, B).ratio()
        # pénalité pour mots en trop à la fin (parasites) ou fin manquante
        fin = mots[-1].end if mots else len(a) / 16000
        sc = r - .15 * (A[-1:] != B[-1:]) - .02 * max(0, len(B) - len(A))
        if best is None or sc > best[0]: best = (sc, f, fin, txt, r)
    sc, f, fin, txt, r = best
    # couper juste après le dernier mot reconnu du texte
    d = len(audio(f)) / 16000; fin = min(d, fin + .18)
    af = f"afade=t=in:d=0.01,afade=t=out:st={max(0, fin - .08):.2f}:d=0.08" + (",atempo=1.12" if L["who"] == "narr" else "")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-t", f"{fin:.2f}", "-af", af, "-c:a", "libmp3lame", "-q:a", "2", f"{R}/voix/{L['id']}.mp3"], check=True)
    rap.append(f"{L['id']} {r:.2f} {os.path.basename(f)} | {L['text']}  ->  {txt.strip()}"); print(rap[-1], flush=True)
open(f"{R}/travail/choix_voix.txt", "w").write("\n".join(rap))
import shutil; shutil.rmtree(f"{R}/voix/brut", ignore_errors=True)
subprocess.run(["python3", os.path.join(os.path.dirname(os.path.abspath(__file__)), "nettoie_voix.py"), f"{R}/voix"], check=True)
