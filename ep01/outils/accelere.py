#!/usr/bin/env python3
"""Accélère l'épisode monté (image + son, sans changer la hauteur des voix) pour atteindre une durée cible.

Usage : python3 outils/accelere.py 138     -> réécrit les MP4, le SRT et le script dans sortie/
"""
import os, re, subprocess, sys
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); S = f"{R}/sortie"
cible = float(sys.argv[1])
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
f = dur(f"{S}/EP04_Tout_le_monde_le_fait.mp4") / cible
print("facteur de vitesse :", round(f, 3))
if f > 1.005:
    for n in ("EP04_Tout_le_monde_le_fait", "EP04_sans_sous_titres", "EP04_bande_annonce"):
        src, tmp = f"{S}/{n}.mp4", f"{S}/{n}.tmp.mp4"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-filter_complex", f"[0:v]setpts=PTS/{f:.5f}[v];[0:a]atempo={f:.5f}[a]",
                        "-map", "[v]", "-map", "[a]", "-r", "30", "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-maxrate", "4500k",
                        "-bufsize", "9M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp], check=True)
        os.replace(tmp, src); print(n, round(dur(src), 1), "s")
    def sc(h, m, s, ms): t = (int(h) * 3600 + int(m) * 60 + int(s) + int(ms) / 1000) / f; return t
    p = f"{S}/EP04_Tout_le_monde_le_fait.srt"
    def r1(m):
        t = sc(*m.groups()); return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{int(t % 60):02d},{int(t % 1 * 1000):03d}"
    open(p, "w").write(re.sub(r"(\d\d):(\d\d):(\d\d),(\d\d\d)", r1, open(p).read()))
    p = f"{S}/EP04_script_voix.md"; txt = open(p).read()
    def r2(m):
        t = sc(0, m.group(1), m.group(2), m.group(3)); return f"`{int(t // 60):02d}:{int(t % 60):02d},{int(t % 1 * 1000):02d}`"
    txt = re.sub(r"`(\d\d):(\d\d),(\d\d)`", lambda m: r2(type("M", (), {"group": lambda s, i: (m.group(1), m.group(2), m.group(3) + "0")[i - 1]})()), txt)
    def r3(m):
        a = (int(m.group(1)) * 60 + int(m.group(2))) / f; b = (int(m.group(3)) * 60 + int(m.group(4))) / f
        return f"({int(a // 60):02d}:{int(a % 60):02d} – {int(b // 60):02d}:{int(b % 60):02d})"
    txt = re.sub(r"\((\d\d):(\d\d) – (\d\d):(\d\d)\)", r3, txt)
    t = cible; txt = re.sub(r"Durée finale : .*", f"Durée finale : {int(t // 60)} min {int(t % 60):02d} s (vitesse ×{f:.2f})", txt)
    open(p, "w").write(txt)
