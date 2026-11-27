"""EP001 — bruitages et musique calés sur timing.json (mêmes coupes que anim.html). Usage : python audio.py --out DOSSIER"""
import argparse, json
import numpy as np
from scipy.signal import butter, sosfilt
from scipy.io import wavfile
ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); a = ap.parse_args()
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

# musique : nappe grave + pulsation (plus lente pendant les gestes, calme à la fin)
x = pad([49.0, 73.4, 98.0, 116.5], D + 0.2); add(x * env(len(x), 1.2, 1.5), 0, 0.09)
for b in np.arange(S[1], S[9], 0.75): tt = np.arange(int(0.3 * SR)) / SR; add(np.sin(2 * np.pi * 52 * tt) * np.exp(-tt * 14), b, 0.09)
y = pad([65.4, 98.0, 130.8, 164.8], D - S[9] + 0.2); add(y * env(len(y), 1.0, 1.2), S[9], 0.08)
# 1 — accroche + signature
add(hit(), 0.0, 0.7); fire_bed(0, S[1] + 0.2, 0.30, 1)
sg = cue('saurais', 1.9)
for i, fq in enumerate([196.0, 293.7, 392.0]): add(tone(fq, 1.8), sg + i * 0.02, 0.10)
add(hit(0.6), sg, 0.35)
# 2 — cuisson, surchauffe, embrasement
c2 = cuts(DU[1], [cue('surchauffe', 1.3) - 0.15, cue('enflamme', 2.6) - 0.1, cue('risque', 4.2) - 0.3]); ig = S[1] + c2[2] + 0.05
z = sizzle(ig - S[1], 3); e = env(len(z), 0.3, 0.15) * np.linspace(0.6, 1.0, len(z)); add(z * e, S[1], 0.16, 0.1)
add(whoosh(0.9), ig - 0.25, 0.45); add(hit(0.8), ig + 0.05, 0.5)
fire_bed(ig, S[4] + cuts(DU[4], [cue('glisser', 4.6) - 0.3, cue('dessus', 7.2) - 0.35])[2] + 1.2, 0.30, 5, 1.0)
# 3 — goutte, vapeur, projection (schéma)
tv = cue('vaporise', 3.0); cut3 = clamp(tv - 1.3, 1.3, 2.6); tp = max(tv + 0.6, cue('projeter', 4.2))
tt = np.arange(int(0.15 * SR)) / SR; add(np.sin(2 * np.pi * (900 - 2500 * tt) * tt) * np.exp(-tt * 30), S[2] + tv - 0.45, 0.25)
hs = filt(noise(0.8), 'high', 4000) * np.exp(-np.arange(int(0.8 * SR)) / SR * 3); add(nrm(hs), S[2] + tv, 0.25)
add(whoosh(1.2), S[2] + tp - 0.2, 0.6); add(hit(1.0), S[2] + tp, 0.7)
# 4 — bouton de plaque, interrupteur de hotte
c4 = cuts(DU[3], [cue('coupe', 2.0) - 0.25, cue('hotte', 3.3) - 0.3])
for k in range(6): add(nrm(filt(noise(0.012), 'high', 2000)), S[3] + c4[1] + 0.45 + k * 0.08, 0.10)
add(nrm(filt(noise(0.02), 'band', [1500, 5000])), S[3] + c4[2] + 0.56, 0.30)
fan = nrm(filt(noise(c4[2] + 0.56), 'low', 600)); add(fan * env(len(fan), 0.5, 0.3), S[3], 0.05)
# 5 — couvercle glissé
c5 = cuts(DU[4], [cue('glisser', 4.6) - 0.3, cue('dessus', 7.2) - 0.35])
add(metal(min(2.4, (c5[2] - c5[1]) * 0.8)), S[4] + c5[1] + 0.25, 0.25, 0.2); add(tone(1240, 0.8, 6), S[4] + c5[1] + min(c5[2] - c5[1], 2.4) * 0.8, 0.12)
# 6 — étouffement, refroidissement : silence relatif, petits craquements
add(whoosh(1.0, False), S[5] + min(cue('etouffe', 2.2), DU[5] - 1), 0.18)
for k in range(5): add(nrm(filt(noise(0.03), 'band', [800, 3000])), S[5] + cue('laisse', 3.8) + 0.4 + k * 0.9, 0.05)
# 7 — fantômes : sons graves d'alerte
add(hit(0.5), S[6] + 1.0, 0.25); add(hit(0.5), S[6] + clamp(cue('souleve', 2.4) - 0.25, 1.2, DU[6] - 1) + 1.0, 0.25)
# 8 — propagation, sortie, porte
c8 = cuts(DU[7], [cue('quitte', 4.0) - 0.2, cue('ferme', 6.0) - 0.2]); sp = S[7] + cue('propage', 3.0) - 0.5
fire_bed(S[7], S[7] + c8[1], 0.22, 7); add(whoosh(1.4), sp, 0.4); fire_bed(sp, S[7] + c8[1], 0.32, 8)
for k in np.arange(S[7] + c8[1] + 0.1, S[7] + c8[2], 0.42): add(thud(), k, 0.12)
fire_bed(S[7] + c8[1], S[7] + c8[2] + 0.9, 0.18, 9, 0.6)
add(thud(), S[7] + c8[2] + 0.9, 0.55); add(whoosh(0.5, False), S[7] + c8[2] + 0.4, 0.12)
# 9 — dehors : vent, téléphone
c9 = cuts(DU[8], [cue('evacue', 1.7) - 0.2, cue('appelle', 3.2) - 0.2])
w = nrm(filt(noise(DU[8] - c9[1]), 'band', [150, 900])); add(w * env(len(w), 0.4, 0.5), S[8] + c9[1], 0.07)
for k in range(3): add(tone(950, 0.12, 8) + tone(1400, 0.12, 8), S[8] + c9[2] + 0.5 + k * 0.18, 0.12)
# transitions de plan
for si, cs in [(1, c2), (3, c4), (4, c5), (7, c8), (8, c9)]:
    for x in cs[1:-1]: add(whoosh(0.5, False), S[si] + x - 0.25, 0.10)
for si in range(1, len(S)): add(whoosh(0.6, False), S[si] - 0.3, 0.08)
# 10–11 — récapitulatif et fin : petites ponctuations
for k, dflt in [('eau', 1.0), ('deplacee', 2.2)]: add(tone(523.3, 0.9), S[9] + cue(k, dflt), 0.08)
for k, dflt in [('partage', 4.0), ('abonne', 5.2)]: add(tone(659.3, 0.9) + tone(987.8, 0.9) * 0.5, S[10] + cue(k, dflt), 0.08)
# fin douce : accord qui se pose après la dernière phrase, puis fondu long
fin = S[10] + 0.25 + tm['scenes'][10]['voix_dur']
for fq, g in [(130.8, 1.0), (196.0, 0.7), (261.6, 0.5), (329.6, 0.35)]: add(tone(fq, D - fin + 0.5, 0.9) * g, fin - 0.1, 0.07)
mix = np.stack([L, R], 1); t = np.arange(N) / SR; mix *= np.clip((D - t) / 1.8, 0, 1)[:, None] ** 1.5; mix /= np.max(np.abs(mix)) * 1.12
wavfile.write(f'{a.out}/music_sfx.wav', SR, (mix * 32767).astype(np.int16)); print('son ok')
