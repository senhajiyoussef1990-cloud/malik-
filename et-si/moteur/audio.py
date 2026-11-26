"""Musique + bruitages de l'EP01, calés sur timing.json. Usage : python audio.py --out sortie/ep01"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile

ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); a = ap.parse_args()
tm = json.load(open(f'{a.out}/timing.json'))
S = [s['start'] for s in tm['scenes']]; DU = [s['dur'] for s in tm['scenes']]
CUE = {int(k): v for k, v in tm['cues'].items()}
SR = 48000; D = tm['duration']; N = int(SR * D)
rng = np.random.default_rng(1)
t = np.arange(N) / SR
L = np.zeros(N); R = np.zeros(N)

def bp(x, lo, hi): return sosfilt(butter(2, [lo, hi], 'band', fs=SR, output='sos'), x)
def lp(x, f): return sosfilt(butter(2, f, 'low', fs=SR, output='sos'), x)
def hp(x, f): return sosfilt(butter(2, f, 'high', fs=SR, output='sos'), x)
def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N: return
    j = min(N, i + len(sig)); s = sig[:j - i] * gain
    L[i:j] += s * (1 - pan) ** 0.5; R[i:j] += s * (1 + pan) ** 0.5
def env(n, a_, r):
    e = np.ones(n); na = int(a_ * SR); nr = int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e
def noise(sec): return rng.standard_normal(max(1, int(sec * SR)))
def nrm(x): return x / (np.max(np.abs(x)) + 1e-9)
def pad(freqs, sec, det=0.003):
    n = int(sec * SR); tt = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for d in (-det, 0, det):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 6): s += np.sin(2 * np.pi * f * (1 + d) * h * tt + ph) / h ** 1.6
    s = lp(s, 900); s *= 0.8 + 0.2 * np.sin(2 * np.pi * 0.15 * tt)
    return nrm(s)

stop = CUE.get(0, 1.3)
# --- nappe : coupée net à l'arrêt, reprend en scène 2, change en scène 6, résout à l'outro
x = pad([73.4, 110, 146.8, 174.6], stop); add(x * env(len(x), 0.2, 0.05), 0, 0.16)
d = S[5] - S[1] + 1; x = pad([73.4, 110, 146.8, 174.6], d); add(x * env(len(x), 1.5, 1.0), S[1], 0.13)
d = S[9] - S[5] + 1; x = pad([58.3, 87.3, 116.5, 174.6], d); add(x * env(len(x), 1.0, 1.5), S[5], 0.13)
d = D - S[9] + 0.5; x = pad([73.4, 110, 146.8, 185.0, 220], d); add(x * env(len(x), 0.8, 2.0), S[9] - 0.5, 0.17)

def kick():
    n = int(0.35 * SR); tt = np.arange(n) / SR; f = 50 + 70 * np.exp(-tt * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9)
k = kick(); bt = S[1]
while bt < S[9] - 0.2: add(k, bt, 0.22); bt += 0.6

# s1 impact à l'arrêt
n = int(2.5 * SR); tt = np.arange(n) / SR
imp = nrm(np.sin(2 * np.pi * np.cumsum(30 + 60 * np.exp(-tt * 6)) / SR) * np.exp(-tt * 1.6) + lp(noise(2.5), 400) * np.exp(-tt * 5) * 0.6)
add(imp, stop, 0.9)
# s2 souffle ascendant
w = bp(noise(2.0), 300, 3000); tt = np.arange(len(w)) / SR; w *= np.sin(np.pi * tt / 2.0) ** 2; add(nrm(w), S[1] - 0.2, 0.35, 0.3)
# s3 roulement de train
r = nrm(lp(noise(DU[2]), 180)); add(r * env(len(r), 0.5, 0.8), S[2], 0.35)
for c in np.arange(S[2] + 0.3, S[2] + DU[2] - 0.2, 0.55):
    cl = bp(noise(0.08), 800, 3000) * np.exp(-np.arange(int(0.08 * SR)) / SR * 60); add(nrm(cl), c, 0.12, -0.2)
# s4 freinage
b = bp(noise(1.4), 2200, 3600); b *= np.exp(-np.arange(len(b)) / SR * 2.5); add(nrm(b), S[3] + 0.7, 0.25, 0.4)
add(imp[:SR], S[3] + 0.7, 0.45)
# s5 vent intense
wd = noise(DU[4] + 0.3); tt = np.arange(len(wd)) / SR
wd = nrm(bp(wd, 250, 1400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * tt)) * env(len(wd), 0.6, 0.8))
add(wd, S[4], 0.45, -0.3); add(wd[::-1], S[4], 0.3, 0.4)
# s6 vague sourde
wv = lp(noise(DU[5]), 300); tt = np.arange(len(wv)) / SR; wv *= np.sin(np.pi * np.clip(tt / max(1, DU[5] - 1), 0, 1)) ** 1.5
add(nrm(wv), S[5] + 0.1, 0.6)
# s7 transition douce
n = int(2.5 * SR); tt = np.arange(n) / SR
add((np.sin(2 * np.pi * 880 * tt) + 0.6 * np.sin(2 * np.pi * 1318.5 * tt) + 0.3 * np.sin(2 * np.pi * 1760 * tt)) * np.exp(-tt * 2.2) / 2, S[6] + 0.05, 0.12, 0.2)
# s8 pulsation
for b0 in np.arange(S[7] + 0.1, S[7] + DU[7] - 0.3, 0.9):
    add(k, b0, 0.35); add(k, b0 + 0.22, 0.22)
# s9 horloge qui accélère
tk = S[8] + 0.1; gap = 0.45
while tk < S[8] + DU[8] - 0.2:
    c = hp(noise(0.03), 2500) * np.exp(-np.arange(int(0.03 * SR)) / SR * 150); add(nrm(c), tk, 0.18, 0.1)
    tk += gap; gap = max(0.07, gap * 0.86)
# s10 ding sur ABONNE-TOI
n = int(1.5 * SR); tt = np.arange(n) / SR
add((np.sin(2 * np.pi * 1318.5 * tt) + 0.5 * np.sin(2 * np.pi * 1975.5 * tt)) * np.exp(-tt * 3.5) / 1.5, S[9] + CUE.get(9, 3.0), 0.22, 0.1)

mix = np.stack([L, R], 1)
mix *= np.minimum(1, (D - t) / 1.2)[:, None]
mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16))
print('musique ok')
