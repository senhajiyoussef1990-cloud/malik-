"""Prototype — bruitages et musique calés sur timing.json. Usage : python audio.py --out DOSSIER"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); a = ap.parse_args()
tm = json.load(open(f'{a.out}/timing.json')); S = [s['start'] for s in tm['scenes']]; DU = [s['dur'] for s in tm['scenes']]; C = tm['cues']
SR = 48000; D = tm['duration']; N = int(SR * D); t = np.arange(N) / SR; rng = np.random.default_rng(2); L = np.zeros(N); R = np.zeros(N)
def filt(x, k, f): return sosfilt(butter(2, f, k, fs=SR, output='sos'), x)
def nrm(x): return x / (np.max(np.abs(x)) + 1e-9)
def noise(s): return rng.standard_normal(max(1, int(s * SR)))
def add(sig, st, g=1.0, pan=0.0):
    i = int(st * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * g; L[i:j] += s * (1 - pan) ** 0.5; R[i:j] += s * (1 + pan) ** 0.5
def env(n, a_, r):
    e = np.ones(n); na, nr = int(a_ * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def crackle(sec, dens, hp=1200, seed=0):
    r = np.random.default_rng(seed); n = int(sec * SR); x = np.zeros(n)
    for i in r.choice(n, int(sec * dens), replace=False):
        k = min(n - i, 400); x[i:i + k] += r.uniform(0.2, 1) * np.exp(-np.arange(k) / r.uniform(15, 60)) * r.choice([-1, 1])
    return nrm(filt(x, 'high', hp))
def fire(sec, seed): return nrm(filt(noise(sec), 'low', 380) * 0.8 + crackle(sec, 18, 1500, seed) * 0.6)
def sizzle(sec, seed): return nrm(filt(noise(sec), 'band', [2500, 9000]) * 0.35 + crackle(sec, 220, 3000, seed))
def pad(fr, sec):
    n = int(sec * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for f in fr:
        for d in (-0.002, 0, 0.002):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 4): s += np.sin(2 * np.pi * f * (1 + d) * h * tt + ph) / h ** 2
    return nrm(filt(s, 'low', 500))
def hit(g=1):
    tt = np.arange(int(1.6 * SR)) / SR
    return nrm(np.sin(2 * np.pi * np.cumsum(36 + 50 * np.exp(-tt * 5)) / SR) * np.exp(-tt * 2.2) + filt(noise(1.6), 'low', 250) * np.exp(-tt * 6) * 0.5) * g
def whoosh(sec, up=True):
    x = noise(sec); n = len(x); out = np.zeros(n); seg = int(0.02 * SR)
    for i in range(0, n, seg):
        k = i / n; f = 300 + 3500 * (k if up else 1 - k); out[i:i + seg] = filt(x[i:i + seg], 'band', [f * 0.6, f * 1.4])
    return nrm(out * np.sin(np.pi * np.arange(n) / n) ** 1.5)
# musique de tension : nappe grave + pulsation lente
x = pad([49.0, 73.4, 98.0, 116.5], D + 0.2); add(x * env(len(x), 1.2, 1.2), 0, 0.10)
for b in np.arange(S[1], D - 0.5, 0.75): tt = np.arange(int(0.3 * SR)) / SR; add(np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 14), b, 0.10)
# signature sonore sur « Saurais-tu quoi faire ? »
sg = S[0] + C.get('saurais', 1.6)
for i, fq in enumerate([196.0, 293.7, 392.0]):
    tt = np.arange(int(1.8 * SR)) / SR; add(np.sin(2 * np.pi * fq * tt) * np.exp(-tt * 2.2) * env(len(tt), 0.01, 0.2), sg + i * 0.02, 0.10)
add(hit(0.6), sg, 0.35)
# A : accroche — impact + feu
add(hit(), 0.0, 0.7); f = fire(S[1] + 0.3, 1); add(f * env(len(f), 0.05, 0.3), 0, 0.30)
# B : grésillement de cuisson qui monte (plus fort sur le gros plan)
cutB = S[1] + DU[1] * 0.5; z = sizzle(DU[1] + DU[2], 3); e = env(len(z), 0.3, 0.2) * np.clip(np.linspace(0.6, 1.0, len(z)), 0, 1)
e[int((cutB - S[1]) * SR):] *= 1.4; ig = S[2] + C.get('flammes', 1.4) * 0.45; e[int((ig - S[1]) * SR):] *= np.linspace(1, 0, len(e) - int((ig - S[1]) * SR)) ** 4
add(z * e, S[1], 0.16, 0.1)
# C : embrasement — souffle + impact sourd, puis feu continu
add(whoosh(0.9), ig - 0.25, 0.45); add(hit(0.8), ig + 0.05, 0.5); f = fire(D - ig, 5); add(f * env(len(f), 0.15, 0.5), ig, 0.32, -0.1)
# transitions de plan
for st in [cutB, S[2] + DU[2] * 0.5, S[3] + min(1.6, DU[3] * 0.32)]: add(whoosh(0.5, False), st - 0.25, 0.10)
# D : schéma — goutte, sifflement de vapeur, boule de feu (non graphique)
s0 = S[3] + min(1.6, DU[3] * 0.32)
tt = np.arange(int(0.15 * SR)) / SR; add(np.sin(2 * np.pi * (900 - 2500 * tt) * tt) * np.exp(-tt * 30), s0 + 0.9, 0.25)
hs = filt(noise(0.7), 'high', 4000) * np.exp(-np.arange(int(0.7 * SR)) / SR * 3); add(nrm(hs), s0 + 1.35, 0.25)
add(whoosh(1.2), s0 + 1.35, 0.6); add(hit(1.0), s0 + 1.55, 0.7)
mix = np.stack([L, R], 1); mix *= np.minimum(1, (D - t) / 0.6)[:, None]; mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16)); print('son ok')
