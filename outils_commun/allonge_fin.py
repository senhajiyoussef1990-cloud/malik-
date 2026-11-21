"""Allonge la fin d'un épisode : l'image finale reste figée N secondes, la musique continue puis s'éteint en fondu.
usage : python3 allonge_fin.py <dossier_episode> [secondes=5]   (refait le MP4 final et le zip)"""
import sys, os, glob, subprocess, json, numpy as np
R = os.path.abspath(sys.argv[1]); N = float(sys.argv[2]) if len(sys.argv) > 2 else 5.0
run = lambda c: subprocess.run(c, check=True, capture_output=True, text=True)
mp4 = [f for f in glob.glob(f"{R}/sortie/EP*.mp4") if "sans_sous" not in f][0]
dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).stdout)
if os.path.exists(mp4 + ".long"): sys.exit("déjà allongé")
def pcm(args): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", *args, "-ac", "1", "-ar", "48000", "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
rms = lambda a: float(np.sqrt(np.mean(a ** 2)) + 1e-6)
fin = pcm(["-ss", f"{dur - 1.5:.2f}", "-t", "1.2", "-i", mp4])                       # niveau de la musique à la fin
mus = f"{R}/audio/musique.wav"; md = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mus]).stdout)
st = dur % md; ref = pcm(["-ss", f"{max(0, st - 1.5):.2f}", "-t", "1.2", "-i", mus])
g = min(4.0, rms(fin) / rms(ref))
out = mp4[:-4] + ".tmp.mp4"
fc = (f"[0:v]tpad=stop_mode=clone:stop_duration={N}[v];"
      f"[1:a]atrim=start={st:.3f},asetpts=PTS-STARTPTS,aloop=loop=-1:size=2e9,atrim=0:{N},volume={g:.3f},afade=t=in:d=0.3,afade=t=out:st={N - 2.5}:d=2.5,aformat=channel_layouts=stereo:sample_rates=48000[m];"
      f"[0:a]aformat=channel_layouts=stereo:sample_rates=48000[a0];[a0][m]concat=n=2:v=0:a=1[a]")
run(["ffmpeg", "-y", "-v", "error", "-i", mp4, "-i", mus, "-filter_complex", fc, "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-maxrate", "4500k", "-bufsize", "9M", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out])
os.replace(out, mp4); open(mp4 + ".long", "w").write(str(N))
nom = os.path.basename(mp4)[:-4]; os.chdir(f"{R}/sortie")
if os.path.exists(f"{nom}.zip"): os.remove(f"{nom}.zip")
run(["zip", "-q", "-0", f"{nom}.zip", f"{nom}.mp4", f"{nom}_publications.txt", f"{nom}_story.png", f"{nom}_couverture.png"])
print(f"ok {nom} : {dur:.1f}s -> {dur + N:.1f}s (gain musique {g:.2f})")
