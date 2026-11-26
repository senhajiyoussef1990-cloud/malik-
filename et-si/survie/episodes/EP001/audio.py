"""EP001 — ambiance, bruitages et musique calés sur timing.json. Usage : python audio.py --out sortie/EP001"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); a = ap.parse_args()
tm = json.load(open(f'{a.out}/timing.json'))
S = [s['start'] for s in tm['scenes']]; DU = [s['dur'] for s in tm['scenes']]; C = tm['cues']
SR = 48000; D = tm['duration']; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(3); L = np.zeros(N); R = np.zeros(N)
def filt(x, kind, f): return sosfilt(butter(2, f, kind, fs=SR, output='sos'), x)
def nrm(x): return x / (np.max(np.abs(x)) + 1e-9)
def noise(sec): return rng.standard_normal(max(1, int(sec * SR)))
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N or i + len(sig) <= 0: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * (1 - pan) ** 0.5; R[i:j] += s * (1 + pan) ** 0.5
def env(n, a_, r):
    e = np.ones(n); na, nr = int(a_ * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def tone(f, sec, dec):
    tt = np.arange(int(sec * SR)) / SR; return np.sin(2 * np.pi * f * tt) * np.exp(-tt * dec)
def pad(freqs, sec):
    n = int(sec * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-0.003, 0, 0.003):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 5): s += np.sin(2 * np.pi * f * (1 + d) * h * tt + ph) / h ** 1.7
    return nrm(filt(s, 'low', 800)) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.2 * tt))

# feu : crépitement + souffle grave (cuisine), étouffé derrière la porte, absent dehors
end_kitchen = S[4] + C.get('porte', 1.2) + 0.5
fire = filt(noise(end_kitchen + 0.5), 'low', 500) * 0.6
pops = np.zeros(len(fire)); idx = rng.choice(len(fire), int(len(fire) / SR * 14), replace=False)
for i in idx:
    k = min(len(fire) - i, 600); pops[i:i + k] += rng.uniform(0.3, 1) * np.exp(-np.arange(k) / 60)
fire = nrm(fire + filt(pops * rng.standard_normal(len(pops)), 'high', 1500) * 0.8)
add(fire * env(len(fire), 0.3, 0.4), 0, 0.28)
muff = nrm(filt(noise(S[4] + C.get('sors', 3.0) - end_kitchen + 0.3), 'low', 220))
add(muff * env(len(muff), 0.2, 0.3), end_kitchen, 0.12)
# musique : nappe tendue puis résolution à l'outro
x = pad([65.4, 98.0, 155.6], S[5]); add(x * env(len(x), 1.0, 0.8), 0, 0.10)
x = pad([65.4, 98.0, 130.8, 164.8, 196.0], D - S[5] + 0.3); add(x * env(len(x), 0.6, 1.5), S[5] - 0.3, 0.14)
# s1 accent dramatique discret
tt = np.arange(int(1.8 * SR)) / SR
add(nrm(np.sin(2 * np.pi * np.cumsum(40 + 50 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 2.2)), 0.05, 0.6)
# s2/s3 : ton d'avertissement sur chaque croix
for st in (S[1] + 0.15, S[1] + C.get('recule', 1.6), S[2] + C.get('croix', 0.9)):
    add(tone(330, 0.5, 6) + 0.6 * tone(311, 0.5, 6), st, 0.18)
# s4 : clic de la commande, coche
add(nrm(filt(noise(0.03), 'high', 3000)) * np.exp(-np.arange(int(0.03 * SR)) / SR * 120), S[3] + C.get('coupe', 0.4) + 1.3, 0.3)
add(tone(880, 0.6, 7) + 0.5 * tone(1320, 0.6, 7), S[3] + C.get('coupe', 0.4) + 1.35, 0.12)
# s5 : porte qui se ferme, dehors, numérotation
add(nrm(filt(noise(0.4), 'low', 160)) * np.exp(-np.arange(int(0.4 * SR)) / SR * 14), S[4] + C.get('porte', 1.1) + 0.45, 0.6)
night = nrm(filt(noise(D - S[4] - C.get('sors', 3.0)), 'band', [300, 2000])) * 0.3
add(night * env(len(night), 0.5, 0.5), S[4] + C.get('sors', 3.0), 0.12)
for i in range(3): add(tone(1209 if i != 1 else 1336, 0.12, 25) + tone(697, 0.12, 25), S[4] + C.get('appel', 3.6) + 0.1 + i * 0.16, 0.12)
# s6 : signature douce + ding sur ABONNE-TOI
for i, f in enumerate([523.3, 659.3, 784.0]): add(tone(f, 1.5, 2.5), S[5] + 0.1 + i * 0.12, 0.10)
add(tone(1318.5, 1.5, 3.5) + 0.5 * tone(1975.5, 1.5, 3.5), S[5] + C.get('abonne', 3.6), 0.2)

mix = np.stack([L, R], 1); mix *= np.minimum(1, (D - t) / 1.0)[:, None]; mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16)); print('musique ok')
