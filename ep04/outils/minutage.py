"""Minutage mot à mot des voix (faster-whisper) + nettoyage (silences, mots parasites en fin).

Usage : python3 outils/minutage.py   -> voix/<id>.mp3 (propres) + travail/minutage.json
"""
import json, os, subprocess, difflib
os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
import numpy as np
from faster_whisper import WhisperModel

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
lines = json.load(open(f"{R}/lignes.json"))
model = WhisperModel("small", device="cpu", compute_type="int8")

def load(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

norm = lambda w: "".join(c for c in w.lower() if c.isalnum())
out = {}
for L in lines:
    src = f"{R}/voix/{L['id']}.wav"
    if not os.path.exists(src): continue
    clean = f"{R}/voix/{L['id']}.mp3"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-af",
                    "silenceremove=start_periods=1:start_threshold=-42dB,areverse,silenceremove=start_periods=1:start_threshold=-42dB,areverse,"
                    "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80", "-ar", "44100", "-b:a", "192k", clean], check=True)
    segs, _ = model.transcribe(load(clean), language="fr", word_timestamps=True, initial_prompt=L["text"])
    words = [(w.word.strip(), w.start, w.end) for s in segs for w in s.words]
    tw = L["text"].split()
    sm = difflib.SequenceMatcher(a=[norm(w) for w in tw], b=[norm(w[0]) for w in words], autojunk=False)
    blocks = [b for b in sm.get_matching_blocks() if b.size]
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", clean], capture_output=True, text=True).stdout)
    if blocks and blocks[-1].b + blocks[-1].size < len(words):          # mots ajoutés par la synthèse : on coupe
        cut = words[blocks[-1].b + blocks[-1].size - 1][2] + 0.25
        tmp = clean + ".tmp.mp3"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", clean, "-t", f"{cut:.2f}", "-af", f"afade=t=out:st={cut - .12:.2f}:d=0.12", "-b:a", "192k", tmp], check=True)
        os.replace(tmp, clean); dur = cut
        print("  coupé :", L["id"], " ".join(w[0] for w in words[blocks[-1].b + blocks[-1].size:]))
    times = [None] * len(tw)
    for b in blocks:
        for k in range(b.size): times[b.a + k] = words[b.b + k][1:]
    known = [i for i, x in enumerate(times) if x]
    for i in range(len(tw)):
        if times[i] is None:
            p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
            times[i] = (times[p][1] if p is not None else 0.0, times[q][0] if q is not None else dur)
    out[L["id"]] = {"dur": round(dur, 3), "mots": [[w, round(a, 3), round(b, 3)] for w, (a, b) in zip(tw, times)],
                    "reconnu": " ".join(w[0] for w in words)}
    print(f"ok {L['id']:5s} {dur:5.2f}s  {len(known)}/{len(tw)} mots", flush=True)
json.dump(out, open(f"{R}/travail/minutage.json", "w"), ensure_ascii=False, indent=1)
