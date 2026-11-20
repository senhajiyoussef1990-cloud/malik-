"""Enlève le souffle et les bruits parasites des répliques (durée inchangée, pour garder la synchro).
usage : python3 nettoie_voix.py ep01/voix   (originaux gardés dans voix/brut/)"""
import sys, os, glob, shutil, subprocess, numpy as np, noisereduce as nr
from scipy.io import wavfile
d = sys.argv[1]; os.makedirs(f"{d}/brut", exist_ok=True)
for f in sorted(glob.glob(f"{d}/*.mp3")):
    b = f"{d}/brut/" + os.path.basename(f)
    if not os.path.exists(b): shutil.copy(f, b)
    tmp = f + ".tmp.wav"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", b, "-ac", "1", "-ar", "44100", tmp], check=True)
    sr, y = wavfile.read(tmp); y = y.astype(np.float32) / 32768
    # profil de bruit : les passages les plus calmes de la réplique
    fr = 1024; e = np.array([np.sqrt(np.mean(y[i:i+fr]**2)) for i in range(0, len(y)-fr, fr)])
    calme = np.concatenate([y[i*fr:(i+1)*fr] for i in np.argsort(e)[:max(4, len(e)//8)]])
    z = nr.reduce_noise(y=y, sr=sr, y_noise=calme, prop_decrease=.85, stationary=True)
    z = nr.reduce_noise(y=z, sr=sr, prop_decrease=.5, stationary=False)
    # porte douce : silence vrai entre les mots, fondu aux bords
    env = np.convolve(np.abs(z), np.ones(441)/441, mode="same"); seuil = np.percentile(env, 95) * .04
    g = np.clip((env - seuil) / seuil, 0, 1); g = np.convolve(g, np.ones(882)/882, mode="same"); z = z * g
    n = int(.012*sr); z[:n] *= np.linspace(0, 1, n); z[-n:] *= np.linspace(1, 0, n)
    wavfile.write(tmp, sr, (np.clip(z, -1, 1) * 32767).astype(np.int16))
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "highpass=f=75,lowpass=f=12000", "-t", f"{len(y)/sr:.3f}", "-c:a", "libmp3lame", "-q:a", "2", f + ".n.mp3"], check=True)
    os.replace(f + ".n.mp3", f); os.remove(tmp); print("ok", os.path.basename(f))
