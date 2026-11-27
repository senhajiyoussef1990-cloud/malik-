"""Son générique des épisodes « Et si ? » : nappe, accroche, signature, transitions, fin douce, plus les
bruitages listés dans sons.json : [{"s": scène (0..), "a": repère ou secondes, "type": …, "g": gain, "n": répétitions, "gap": écart}].
Usage : python audio.py --out DOSSIER --sons EPISODE/sons.json"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); ap.add_argument('--sons'); a = ap.parse_args()
tm = json.load(open(f'{a.out}/timing.json')); S = [s['start'] for s in tm['scenes']]; DU = [s['dur'] for s in tm['scenes']]; C = tm['cues']
SR = 48000; D = tm['duration']; N = int(SR * D); rng = np.random.default_rng(2); L = np.zeros(N); R = np.zeros(N)
def cue(k, d): return C.get(k, d)
def clamp(x, lo, hi): return max(lo, min(hi, x))
def cuts(d, lst):  # identique à cutsOf() dans anim.html
    o = [0.0]
    for x in lst: o.append(clamp(max(x, o[-1] + 0.7), 0, d - 0.4))
    return o + [d]
def filt(x, k, f): return sosfilt(butter(2, f, k, fs=SR, output='sos'), x)
def nrm(x): return x / (np.max(np.abs(x)) + 1e-9)
def noise(s): return rng.standard_normal(max(1, int(s * SR)))
def add(sig, st, g=1.0, pan=0.0):
    i = int(st * SR)
    if i >= N or i < 0: return
    j = min(N, i + len(sig)); s = sig[:j - i] * g; L[i:j] += s * (1 - pan) ** 0.5; R[i:j] += s * (1 + pan) ** 0.5
def env(n, a_, r):
    e = np.ones(n); na, nr = min(n, int(a_ * SR)), min(n, int(r * SR))
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
def tone(fq, sec, dec=2.2):
    tt = np.arange(int(sec * SR)) / SR; return np.sin(2 * np.pi * fq * tt) * np.exp(-tt * dec) * env(len(tt), 0.01, 0.2)
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
def metal(sec=0.9, f0=820):  # couvercle : frottement + petit tintement
    sc = filt(noise(sec), 'band', [1800, 6000]) * env(int(sec * SR), 0.05, 0.3) * 0.5
    return nrm(sc + sum(tone(f0 * m, sec, 5) * w for m, w in [(1, 1), (2.76, 0.5), (5.4, 0.25)]))
def thud(): tt = np.arange(int(0.5 * SR)) / SR; return nrm(filt(noise(0.5), 'low', 160) * np.exp(-tt * 18) + np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 14))
def fire_bed(t0, t1, g, seed, fade=0.3):
    if t1 - t0 < 0.1: return
    f = fire(t1 - t0, seed); add(f * env(len(f), 0.15, fade), t0, g)

def tap(): tt = np.arange(int(0.18 * SR)) / SR; return nrm(filt(noise(0.18), 'band', [150, 1200]) * np.exp(-tt * 40) + np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 30))
def clink(): return nrm(sum(tone(f, 0.5, 9) * w for f, w in [(2400, 1), (3700, 0.6), (5200, 0.3)]))
def beep3(): return np.concatenate([np.concatenate([tone(950, 0.12, 8) + tone(1400, 0.12, 8), np.zeros(int(0.06 * SR))]) for _ in range(3)])
def alarme(sec=1.6):
    n = int(sec * SR); tt = np.arange(n) / SR; return nrm(np.sign(np.sin(2 * np.pi * 3100 * tt)) * (np.sin(2 * np.pi * 2.5 * tt) > 0) * 0.5)
def eau(sec=2.0): x = filt(noise(sec), 'band', [400, 5000]); return nrm(x * env(len(x), 0.15, 0.3) * (0.8 + 0.2 * np.sin(np.arange(len(x)) / SR * 23)))
def gaz(sec=1.5): x = filt(noise(sec), 'high', 3500); return nrm(x * env(len(x), 0.3, 0.5))
def tic(): tt = np.arange(int(0.05 * SR)) / SR; return nrm(np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 90))
def porte():
    x = thud(); y = filt(noise(0.3), 'band', [200, 2000]) * np.exp(-np.arange(int(0.3 * SR)) / SR * 10); x[:len(y)] += 0.3 * y; return nrm(x)
def coeur(): return hit(0.25)
GEN = {'hit': lambda: hit(0.8), 'whoosh': lambda: whoosh(0.6), 'tap': tap, 'clink': clink, 'bip': beep3, 'alarme': alarme, 'eau': eau, 'gaz': gaz,
       'tic': tic, 'porte': porte, 'thud': thud, 'metal': lambda: metal(0.8), 'feu': lambda: fire(2.5, 3), 'vapeur': lambda: nrm(filt(noise(0.8), 'high', 4000) * np.exp(-np.arange(int(0.8 * SR)) / SR * 3)), 'coeur': coeur}
# nappe, accroche, signature
x = pad([55.0, 82.4, 110.0, 130.8], D + 0.2); add(x * env(len(x), 1.5, 1.5), 0, 0.08)
add(hit(0.8), 0.0, 0.5); sg = cue('saurais', 2.0)
for i, fq in enumerate([196.0, 293.7, 392.0]): add(tone(fq, 1.8), sg + i * 0.02, 0.10)
add(hit(0.6), sg, 0.30)
# bruitages de l'épisode
for ev in (json.load(open(a.sons)) if a.sons else []):
    t0 = S[ev['s']] + (cue(ev['a'], 0) if isinstance(ev['a'], str) else ev['a']) + ev.get('dt', 0)
    if ev['type'] == 'coeur_bed':
        t1 = S[ev['s2']] + (cue(ev['a2'], 0) if isinstance(ev.get('a2'), str) else ev.get('a2', 0))
        for b in np.arange(t0, t1, 0.62): add(hit(0.25), b, ev.get('g', 0.1))
        continue
    for k in range(ev.get('n', 1)): add(GEN[ev['type']](), t0 + k * ev.get('gap', 0.5), ev.get('g', 0.25), ev.get('pan', 0))
# transitions et fin douce
for si in range(1, len(S)): add(whoosh(0.6, False), S[si] - 0.3, 0.08)
L_ = len(S) - 1
for k, dflt in [('partage', 4.0), ('abonne', 5.2)]: add(tone(659.3, 0.9) + tone(987.8, 0.9) * 0.5, S[L_] + cue(k, dflt), 0.08)
y = pad([65.4, 98.0, 130.8, 164.8], D - S[L_] + 0.2); add(y * env(len(y), 1.0, 1.2), S[L_], 0.08)
fin = S[L_] + 0.25 + tm['scenes'][L_]['voix_dur']
for fq, g in [(130.8, 1.0), (196.0, 0.7), (261.6, 0.5), (329.6, 0.35)]: add(tone(fq, max(0.5, D - fin + 0.5), 0.9) * g, fin - 0.1, 0.07)
mix = np.stack([L, R], 1); t = np.arange(N) / SR; mix *= np.clip((D - t) / 1.8, 0, 1)[:, None] ** 1.5; mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16)); print('son ok')
