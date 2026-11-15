"""Contrôle qualité des répliques : Whisper réécoute chaque fichier.

Usage : python3 tools/qc.py job.json  → écrit job.qc.json
job.json = [{"wav": "...", "text": "..."}]
Résultat : [{"score": 0..1, "end": fin du dernier mot (s), "heard": "..."}]
"""
import difflib, json, os, re, subprocess, sys
import numpy as np

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
from faster_whisper import WhisperModel


def norm(s):
    s = s.lower().replace("’", "'")
    return re.sub(r"[^a-zàâçéèêëîïôûùüÿœ' -]", " ", s).split()


job = json.load(open(sys.argv[1]))
m = WhisperModel("small", device="cpu", compute_type="int8")
res = []
for j in job:
    raw = subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-i", j["wav"], "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True).stdout
    segs, _ = m.transcribe(np.frombuffer(raw, np.float32), language="fr", word_timestamps=True)
    words = [w for s in segs for w in (s.words or [])]
    heard = " ".join(w.word.strip() for w in words)
    score = difflib.SequenceMatcher(None, norm(j["text"].replace("|", " ")), norm(heard)).ratio()
    res.append({"score": round(score, 3), "end": round(words[-1].end, 3) if words else 0, "heard": heard})
json.dump(res, open(sys.argv[1].replace(".json", ".qc.json"), "w"), ensure_ascii=False)
