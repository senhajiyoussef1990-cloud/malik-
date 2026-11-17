import json, os, glob, subprocess, difflib, shutil, numpy as np
from faster_whisper import WhisperModel
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
L = {l["id"]: l for l in json.load(open(f"{R}/lignes.json"))}
wm = WhisperModel("small", device="cpu", compute_type="int8")
norm = lambda s: "".join(c for c in s.lower() if c.isalnum() or c == " ")
best = {}
for f in sorted(glob.glob(f"{R}/travail/essais/*.wav")):
    lid = os.path.basename(f).split("_")[0]
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout
    txt = " ".join(s.text for s in wm.transcribe(np.frombuffer(raw, np.int16).astype(np.float32) / 32768, language="fr", condition_on_previous_text=False)[0])
    sc = difflib.SequenceMatcher(None, norm(txt), norm(L[lid]["text"])).ratio()
    print(f"{os.path.basename(f)} {sc:.2f} | {txt}")
    if sc > best.get(lid, (0, ""))[0]: best[lid] = (sc, f)
for lid, (sc, f) in best.items():
    shutil.copy(f, f"{R}/voix/{lid}.wav"); print("GARDÉ", lid, os.path.basename(f), round(sc, 2))
