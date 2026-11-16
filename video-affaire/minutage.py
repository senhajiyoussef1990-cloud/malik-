import os; os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
"""Minutage mot à mot des voix (faster-whisper) -> audio/<id>.json pour les sous-titres.

Usage : python3 minutage.py [id ...]
"""
import json, os, sys, difflib, subprocess
import numpy as np
from faster_whisper import WhisperModel

P = os.path.dirname(os.path.abspath(__file__))
lines = json.load(open(f"{P}/lines.json"))
only = sys.argv[1:]
def load(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

model = WhisperModel("small", device="cpu", compute_type="int8")
for L in lines:
    if only and L["id"] not in only: continue
    f = f"{P}/audio/{L['id']}.mp3"
    if not os.path.exists(f): continue
    segs, _ = model.transcribe(load(f), language="fr", word_timestamps=True, initial_prompt=L["text"])
    words = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    text = L["text"]; tw = text.split()
    # aligne les mots reconnus sur les mots du texte
    norm = lambda w: "".join(c for c in w.lower() if c.isalnum())
    sm = difflib.SequenceMatcher(a=[norm(w) for w in tw], b=[norm(w[0]) for w in words], autojunk=False)
    times = [None] * len(tw)
    for a, b, n in sm.get_matching_blocks():
        for k in range(n): times[a + k] = words[b + k][1:]
    end = words[-1][2] if words else 1.0
    # mots parasites ajoutés en fin de phrase par la synthèse : on coupe l'audio
    blocks = [b for b in sm.get_matching_blocks() if b.size]
    if blocks:
        lb = blocks[-1]; last_b = lb.b + lb.size - 1
        if last_b < len(words) - 1:
            cut = words[last_b][2] + 0.25
            tmp = f + ".tmp.mp3"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-t", f"{cut:.2f}", "-af", "afade=t=out:st=%.2f:d=0.12" % (cut - 0.12), "-b:a", "160k", tmp], check=True)
            os.replace(tmp, f); end = words[last_b][2]
            print("  coupé :", " ".join(w[0] for w in words[last_b + 1:]))
    known = [i for i, x in enumerate(times) if x]
    for i in range(len(tw)):           # interpole les mots non reconnus
        if times[i] is None:
            prev = max([k for k in known if k < i], default=None); nxt = min([k for k in known if k > i], default=None)
            a = times[prev][1] if prev is not None else 0.0; b = times[nxt][0] if nxt is not None else end
            times[i] = (a, b)
    st, en, pos = [0.0] * len(text), [0.0] * len(text), 0
    for w, (a, b) in zip(tw, times):
        i = text.find(w, pos)
        for k in range(pos, i): st[k] = en[k] = a
        for k in range(i, i + len(w)): st[k] = a + (b - a) * (k - i) / len(w); en[k] = a + (b - a) * (k - i + 1) / len(w)
        pos = i + len(w)
    for k in range(pos, len(text)): st[k] = en[k] = end
    json.dump({"characters": list(text), "character_start_times_seconds": st, "character_end_times_seconds": en},
              open(f"{P}/audio/{L['id']}.json", "w"))
    print("ok", L["id"], f"{len(known)}/{len(tw)} mots reconnus")
