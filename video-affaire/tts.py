#!/usr/bin/env python3
"""Génère les voix avec edge-tts (gratuit, aucune clé).

Usage : python3 tts.py [id ...]     -> audio/<id>.mp3 + audio/<id>.json (minutage)
        sans argument : toutes les répliques de lines.json
"""
import asyncio, json, os, sys
import edge_tts

P = os.path.dirname(os.path.abspath(__file__))
# voix, vitesse, hauteur
VOIX = {
    "renard": ("fr-FR-RemyMultilingualNeural", "-8%", "-6Hz"),   # suave, sûr de lui
    "mouton": ("fr-FR-HenriNeural", "+6%", "+28Hz"),             # naïf, plus aigu
    "narr":   ("fr-FR-HenriNeural", "-10%", "-12Hz"),            # grave et posé
}
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")

async def one(L):
    voice, rate, pitch = VOIX[L["who"]]
    c = edge_tts.Communicate(L["text"], voice, rate=rate, pitch=pitch, proxy=PROXY, boundary="WordBoundary")
    audio, words = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary":
            words.append((ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7))
    open(f"{P}/audio/{L['id']}.mp3", "wb").write(audio)
    # minutage au caractère (même format que build.py attend)
    text = L["text"]; st = [0.0] * len(text); en = [0.0] * len(text); pos = 0; last = 0.0
    for w, a, b in words:
        i = text.find(w, pos)
        if i < 0: continue
        for k in range(pos, i): st[k] = en[k] = last
        for k in range(i, i + len(w)):
            st[k] = a + (b - a) * (k - i) / len(w); en[k] = a + (b - a) * (k - i + 1) / len(w)
        pos = i + len(w); last = b
    for k in range(pos, len(text)): st[k] = en[k] = last
    json.dump({"characters": list(text), "character_start_times_seconds": st,
               "character_end_times_seconds": en}, open(f"{P}/audio/{L['id']}.json", "w"))
    print("ok", L["id"], f"{last:.2f}s")

async def main():
    os.makedirs(f"{P}/audio", exist_ok=True)
    lines = json.load(open(f"{P}/lines.json"))
    only = sys.argv[1:]
    for L in lines:
        if not only or L["id"] in only:
            await one(L)

asyncio.run(main())
