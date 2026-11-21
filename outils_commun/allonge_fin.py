"""Ajoute l'écran de fin « Abonne-toi » (outils_commun/fin_abonne.mp4, 6 s) à la fin d'un épisode, à la place du fondu au noir.
La musique de l'épisode continue, une cloche sonne au clic, puis tout s'éteint en fondu.
usage : python3 allonge_fin.py <dossier_episode>      (refait le MP4 final et le zip ; un fichier .fin garde la durée d'origine)"""
import sys, os, glob, subprocess, numpy as np
R = os.path.abspath(sys.argv[1]); O = os.path.dirname(os.path.abspath(__file__)); CARTE = f"{O}/fin_abonne.mp4"
run = lambda c: subprocess.run(c, check=True, capture_output=True, text=True)
duree = lambda f: float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)
mp4 = [f for f in glob.glob(f"{R}/sortie/EP*.mp4") if "sans_sous" not in f][0]
dur = float(open(mp4 + ".fin").read()) if os.path.exists(mp4 + ".fin") else duree(mp4)   # déjà fait : on repart de la partie d'origine
if os.path.exists(mp4 + ".long"): dur -= float(open(mp4 + ".long").read()); os.remove(mp4 + ".long")   # ancien essai (image figée) : on le retire
coupe = dur - 0.45                                                                                    # on retire le fondu au noir final
N = duree(CARTE)
def pcm(args): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", *args, "-ac", "1", "-ar", "48000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
rms = lambda a: float(np.sqrt(np.mean(a ** 2)) + 1e-6) if len(a) else 1.0
mus = f"{R}/audio/musique.wav"; md = duree(mus); st = coupe % md
g = min(6.0, 10 ** (-24 / 20) * 32768 / rms(pcm(["-ss", f"{st:.2f}", "-t", f"{N:.2f}", "-i", mus])))   # musique de fin à un niveau fixe (~ -24 dB)
ding = f"{R}/audio/sfx_ding.wav" if os.path.exists(f"{R}/audio/sfx_ding.wav") else glob.glob(f"{R}/../*/audio/sfx_ding.wav")[0]
out = mp4[:-4] + ".tmp.mp4"
fc = (f"[0:v]trim=0:{coupe:.3f},setpts=PTS-STARTPTS,fps=30,format=yuv420p[v0];"
      f"[0:v]trim=start={dur - 0.9:.3f}:duration=0.04,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={N},fps=30[fond];"
      f"[1:v]fps=30,setsar=1[carte];[fond][carte]overlay=0:540:shortest=1,format=yuv420p,trim=0:{N},setpts=PTS-STARTPTS[v1];"
      f"[v0][v1]concat=n=2:v=1:a=0[v];"
      f"[0:a]atrim=0:{coupe:.3f},asetpts=PTS-STARTPTS,aformat=channel_layouts=stereo:sample_rates=48000[a0];"
      f"[2:a]atrim=start={st:.3f},asetpts=PTS-STARTPTS,atrim=0:{N},volume={g:.3f},afade=t=out:st={N - 1.8}:d=1.8,aformat=channel_layouts=stereo:sample_rates=48000[m];"
      f"[3:a]volume=0.5,adelay=2050|2050,apad,atrim=0:{N},aformat=channel_layouts=stereo:sample_rates=48000[d];"
      f"[m][d]amix=inputs=2:normalize=0[a1];[a0][a1]concat=n=2:v=0:a=1[a]")
run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-i", CARTE, "-i", mus, "-i", ding, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-maxrate", "4500k", "-bufsize", "9M", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
os.replace(out, mp4); open(mp4 + ".fin", "w").write(f"{dur:.3f}")
nom = os.path.basename(mp4)[:-4]; os.chdir(f"{R}/sortie")
if os.path.exists(f"{nom}.zip"): os.remove(f"{nom}.zip")
run(["zip", "-q", "-0", f"{nom}.zip", f"{nom}.mp4", f"{nom}_publications.txt", f"{nom}_story.png", f"{nom}_couverture.png"])
print(f"ok {nom} : {dur:.1f}s -> {coupe + N:.1f}s (musique x{g:.2f})")
