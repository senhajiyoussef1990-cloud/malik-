"""Refait la bande-son d'un épisode déjà monté (après remplacement d'une voix dans voix/), sans refaire les images,
puis remet l'écran de fin « Abonne-toi ».   usage : python3 refait_son.py <dossier_episode>"""
import sys, os, glob, subprocess, importlib.util
R = os.path.abspath(sys.argv[1]); O = os.path.dirname(os.path.abspath(__file__))
run = lambda c: subprocess.run(c, check=True, capture_output=True, text=True)
duree = lambda f: float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)
mp4 = [f for f in glob.glob(f"{R}/sortie/EP*.mp4") if "sans_sous" not in f][0]
dur = float(open(mp4 + ".fin").read()) if os.path.exists(mp4 + ".fin") else duree(mp4)
sp = importlib.util.spec_from_file_location("montage", f"{R}/outils/montage.py"); m = importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
m.son()                                                                                    # -> travail/mix.wav
tmp = mp4[:-4] + ".son.mp4"
run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-i", f"{R}/travail/mix.wav", "-map", "0:v", "-map", "1:a", "-t", f"{dur:.3f}", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", tmp])
os.replace(tmp, mp4); os.remove(f"{R}/travail/mix.wav")
for f in (mp4 + ".fin", mp4 + ".long"):
    if os.path.exists(f): os.remove(f)
print(subprocess.run(["python3", f"{O}/allonge_fin.py", R], capture_output=True, text=True).stdout.strip())
