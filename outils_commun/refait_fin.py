"""Refait la dernière scène (logo + phrase finale) d'un épisode déjà monté, avec la nouvelle voix voix/s16a.mp3 et le texte
de lignes.json : nouvelle image, nouveau sous-titre, nouvelle bande-son ; puis remet l'écran de fin « Abonne-toi » et refait le zip.
usage : python3 refait_fin.py <dossier_episode>"""
import sys, os, glob, json, re, subprocess, importlib.util
R = os.path.abspath(sys.argv[1]); EP = os.path.basename(R); N = EP.upper(); O = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(os.path.dirname(O), "anim_code")
run = lambda c, **k: subprocess.run(c, check=True, capture_output=True, text=True, **k)
duree = lambda f: float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)
mp4 = [f for f in glob.glob(f"{R}/sortie/EP*.mp4") if "sans_sous" not in f][0]
dfin = float(open(mp4 + ".fin").read()) if os.path.exists(mp4 + ".fin") else duree(mp4)
sc = sorted(glob.glob(f"{A}/{EP}/scene*.js"))[-1]; num = re.search(r"scene(\d+)", sc).group(1)
# 1) nouvelle dernière scène
env = dict(os.environ, STYLE="1", DESSIN="1", HD="2"); env.pop("VOIX_DIR", None)
run(["node", "rendu_scene.js", EP, num], cwd=A, env=env)
j = json.load(open(f"{A}/travail/{N}_scene{num}.json")); muet = f"{A}/travail/{N}_scene{num}_muet.mp4"
# 2) plans et minutage mis à jour
plans = json.load(open(f"{R}/travail/plans.json")); t0 = plans[-1]["t0"]; plans[-1]["dur"] = j["dur"]; plans[-1]["lignes"] = j["lignes"]
json.dump(plans, open(f"{R}/travail/plans.json", "w"), indent=1)
mn = json.load(open(f"{R}/travail/minutage.json")); L = {l["id"]: l for l in json.load(open(f"{R}/lignes.json"))}
for lid in j["lignes"]:
    mots = L[lid]["text"].split(); d = duree(f"{R}/voix/{lid}.mp3"); tot = sum(len(w) + 2 for w in mots); t = 0.0; mm = []
    for w in mots: dw = d * 0.92 * (len(w) + 2) / tot; mm.append([w, round(t, 3), round(t + dw, 3)]); t += dw + (0.25 if w[-1] in ".…!?" else 0) * 0.3
    mn[lid] = {"dur": d, "mots": mm}
json.dump(mn, open(f"{R}/travail/minutage.json", "w"), ensure_ascii=False, indent=1)
# 3) montage : son complet + sous-titres, puis segment vidéo de la dernière scène
sp = importlib.util.spec_from_file_location("montage", f"{R}/outils/montage.py"); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
m.son(); m.sous_titres()
ass = open(f"{R}/travail/sous_titres.ass").read().split("[Events]")
def sec(s): h, mi, x = s.split(":"); return int(h) * 3600 + int(mi) * 60 + float(x)
ev = []
for l in ass[1].splitlines():
    if l.startswith("Dialogue:"):
        p = l.split(",", 9); a, b = sec(p[1]), sec(p[2])
        if a >= t0 - 0.01: p[1], p[2] = m.tc(a - t0), m.tc(b - t0); ev.append(",".join(p))
open(f"{R}/travail/fin.ass", "w").write(ass[0] + "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n" + "\n".join(ev) + "\n")
seg = f"{R}/travail/fin_seg.mp4"
vf = (f"[0:v]setsar=1,fps={m.FPS}[b];color=black:s={m.W}x{m.H}:r={m.FPS}[bg];[bg][b]overlay=0:{m.BAND_Y}:shortest=1[v1];[v1][1:v]overlay=0:0[v3];"
      f"[v3]ass={R}/travail/fin.ass:fontsdir={R}/fonts,format=yuv420p[v]")
run(["ffmpeg", "-y", "-v", "error", "-i", muet, "-loop", "1", "-i", f"{R}/travail/calque.png", "-filter_complex", vf, "-map", "[v]", "-t", f"{j['dur']:.3f}", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-r", str(m.FPS), seg])
tot = t0 + j["dur"]; tmp = mp4[:-4] + ".tmp.mp4"
fc = f"[0:v]trim=0:{t0:.3f},setpts=PTS-STARTPTS,fps={m.FPS},format=yuv420p[a];[1:v]fps={m.FPS},format=yuv420p,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]"
run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-i", seg, "-i", f"{R}/travail/mix.wav", "-filter_complex", fc, "-map", "[v]", "-map", "2:a", "-t", f"{tot:.3f}",
     "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-maxrate", "4500k", "-bufsize", "9M", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp])
os.replace(tmp, mp4)
for f in (mp4 + ".fin", mp4 + ".long", seg, f"{R}/travail/mix.wav", muet, f"{A}/sortie/{N}_scene{num}.mp4"):
    if os.path.exists(f): os.remove(f)
m.script()
print(subprocess.run(["python3", f"{O}/allonge_fin.py", R], capture_output=True, text=True).stdout.strip())
