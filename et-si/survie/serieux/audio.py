"""Ambiance sonore du style sérieux, calée sur timing.json.
Usage : python audio.py --out sortie/EP001 --profil feu|etouffement"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); ap.add_argument('--profil', default='feu'); a = ap.parse_args()
tm = json.load(open(f'{a.out}/timing.json'))
S = [s['start'] for s in tm['scenes']]; DU = [s['dur'] for s in tm['scenes']]; C = tm['cues']
SR = 48000; D = tm['duration']; N = int(SR * D); t = np.arange(N) / SR
rng = np.random.default_rng(5); L = np.zeros(N); R = np.zeros(N)
def filt(x, kind, f): return sosfilt(butter(2, f, kind, fs=SR, output='sos'), x)
def nrm(x): return x / (np.max(np.abs(x)) + 1e-9)
def noise(sec): return rng.standard_normal(max(1, int(sec * SR)))
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
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
        for d in (-0.002, 0, 0.002):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 4): s += np.sin(2 * np.pi * f * (1 + d) * h * tt + ph) / h ** 2
    return nrm(filt(s, 'low', 600)) * (0.85 + 0.15 * np.sin(2 * np.pi * 0.1 * tt))
def thump(g=1.0):
    tt = np.arange(int(0.35 * SR)) / SR; return np.sin(2 * np.pi * np.cumsum(45 + 60 * np.exp(-tt * 25)) / SR) * np.exp(-tt * 12) * g

# nappe grave continue, résolution à l'outro
x = pad([55.0, 82.4, 130.8], S[-1] + 0.5); add(x * env(len(x), 2.0, 1.0), 0, 0.10)
x = pad([55.0, 82.4, 110.0, 138.6, 164.8], D - S[-1] + 0.3); add(x * env(len(x), 0.8, 1.5), S[-1] - 0.3, 0.12)
# impact d'ouverture + souffle à chaque changement de plan
tt = np.arange(int(2.0 * SR)) / SR
add(nrm(np.sin(2 * np.pi * np.cumsum(38 + 40 * np.exp(-tt * 4)) / SR) * np.exp(-tt * 2) + filt(noise(2.0), 'low', 300) * np.exp(-tt * 6) * 0.4), 0.02, 0.55)
for st in S[1:]:
    w = filt(noise(0.7), 'band', [200, 1500]); w *= np.sin(np.pi * np.arange(len(w)) / len(w)) ** 2; add(nrm(w), st - 0.35, 0.05)

if a.profil == 'feu':
    end_fire = S[6] + C.get('ferme', 1.6) + 1.0
    f = filt(noise(end_fire), 'low', 450) * 0.6
    pops = np.zeros(len(f)); idx = rng.choice(len(f), int(len(f) / SR * 12), replace=False)
    for i in idx:
        k = min(len(f) - i, 600); pops[i:i + k] += rng.uniform(0.3, 1) * np.exp(-np.arange(k) / 60)
    f = nrm(f + filt(pops * rng.standard_normal(len(pops)), 'high', 1500) * 0.7)
    fe = env(len(f), 0.3, 0.6); fe[:int((S[1] + C.get('soudain', 2.0)) * SR)] *= 0.0  # pas de feu avant « Soudain » (scène 2)
    fe[:int(S[1] * SR)] = 1.0                                                          # sauf l'accroche
    add(f * fe, 0, 0.22)
    # scène 4 (schéma) : souffle de la projection
    w = filt(noise(1.2), 'low', 800) * np.exp(-np.arange(int(1.2 * SR)) / SR * 3); add(nrm(w), S[3] + 2.4, 0.35)
    # porte qui se ferme
    add(nrm(filt(noise(0.4), 'low', 160)) * np.exp(-np.arange(int(0.4 * SR)) / SR * 14), S[6] + C.get('ferme', 1.6) + 1.0, 0.5)
    # dehors : rumeur de rue
    n2 = filt(noise(DU[8]), 'band', [200, 1200]); add(nrm(n2) * env(len(n2), 0.5, 0.5), S[8], 0.06)
else:
    # couverts au début, puis battements de cœur sous l'action
    for i in range(6): add(tone(2400 + rng.uniform(-300, 300), 0.15, 40) * 0.5, S[1] + 0.3 + i * 0.7, 0.05, rng.uniform(-0.5, 0.5))
    hb = S[1] + C.get('parler', 2.0)
    while hb < S[10] - 0.5:
        add(thump(0.8), hb, 0.18); add(thump(0.5), hb + 0.22, 0.12); hb += 0.95
    # tapes dans le dos (scène 5) et poussées (scène 8), mêmes instants que l'animation
    t0 = C.get('tapes', 2.2); gap = max(0.5, (DU[4] - t0 - 0.6) / 5)
    for i in range(5): add(nrm(filt(noise(0.08), 'low', 900)) * np.exp(-np.arange(int(0.08 * SR)) / SR * 40), S[4] + t0 + i * gap + gap * 0.25, 0.25)
    gap = max(0.6, (DU[7] - 0.9 - 0.6) / 5)
    for i in range(5): add(nrm(filt(noise(0.12), 'low', 400)) * np.exp(-np.arange(int(0.12 * SR)) / SR * 25), S[7] + 0.9 + i * gap + gap * 0.15, 0.2)
    # tonalité d'appel (scène 10)
    for i in range(2): add(tone(440, 0.9, 0.5) * env(int(0.9 * SR), 0.02, 0.05), S[9] + C.get('appelle', 2.8) + 0.3 + i * 1.6, 0.05)
# fin : ding sur ABONNE-TOI
add(tone(1318.5, 1.5, 3.5) + 0.5 * tone(1975.5, 1.5, 3.5), S[-1] + C.get('abonne', 4.0), 0.16)

mix = np.stack([L, R], 1); mix *= np.minimum(1, (D - t) / 1.0)[:, None]; mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16)); print('son ok')
