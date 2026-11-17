"""Musique ragtime et bruitages années 30, synthétisés en code (numpy).

Usage : python3 outils/sons.py DUREE      -> audio/musique.wav + audio/sfx_*.wav
"""
import os, sys, wave
import numpy as np

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 44100
BPM = 128; BEAT = 60 / BPM
rng = np.random.default_rng(1930)

def save(name, x):
    x = np.clip(x / (np.abs(x).max() + 1e-9) * 0.9, -1, 1)
    with wave.open(f"{R}/audio/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())

def pluck(f, d, bright=0.5):
    """corde pincée Karplus-Strong (piano de bastringue)"""
    n = int(SR * d); p = max(2, int(SR / f)); buf = rng.uniform(-1, 1, p); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = 0.5 * (buf[i % p] + buf[(i + 1) % p]) * (0.994 + 0.004 * bright)
    return out * np.exp(-np.linspace(0, 3, n))

def note(m): return 440 * 2 ** ((m - 69) / 12)

def musique(dur):
    # grille d'accords (do majeur, ragtime) : C C7 F Fm C G7 C G7
    prog = [(48, [64, 67, 72]), (48, [64, 67, 70]), (53, [65, 69, 72]), (53, [65, 68, 72]),
            (48, [64, 67, 72]), (55, [65, 71, 74]), (48, [64, 67, 72]), (55, [65, 71, 74])]
    mel = [76, 79, 81, 79, 76, 74, 72, 74, 76, 76, 77, 79, 81, 79, 77, 76]
    bar = 4 * BEAT; n = int(SR * dur) + SR; out = np.zeros(n)
    cache = {}
    def add(m, t, d, g, b=0.5):
        k = (m, round(d, 3), b)
        if k not in cache: cache[k] = pluck(note(m), d, b)
        s = cache[k]; i = int(t * SR)
        if i >= n: return
        j = min(n, i + len(s)); out[i:j] += g * s[: j - i]
    t, k = 0.0, 0
    while t < dur:
        root, ch = prog[k % len(prog)]
        for b in range(4):                                   # « oum-pa » : basse sur 1 et 3, accord sur 2 et 4
            tb = t + b * BEAT
            if b % 2 == 0: add(root - 12 + (7 if b == 2 else 0), tb, BEAT * 0.9, 0.55, 0.2)
            else:
                for m in ch: add(m, tb, BEAT * 0.5, 0.18, 0.7)
        for j in range(4):                                   # mélodie syncopée
            m = mel[(k * 4 + j) % len(mel)]
            add(m, t + j * BEAT + (0.5 * BEAT if j % 2 else 0), BEAT * 0.8, 0.22, 0.9)
        t += bar; k += 1
    out = out[: int(SR * dur)]
    # couleur gramophone : passe-bande + souffle + craquements
    f = np.fft.rfft(out); fr = np.fft.rfftfreq(len(out), 1 / SR)
    f *= ((fr > 180) & (fr < 4500)); out = np.fft.irfft(f, len(out))
    out += rng.normal(0, 0.004, len(out))
    for _ in range(int(dur * 3)):
        i = rng.integers(0, len(out) - 50); out[i:i + 30] += rng.normal(0, 0.15, 30)
    fade = int(SR * 1.5); out[-fade:] *= np.linspace(1, 0, fade)
    return out

def env(n, a=0.002, r=0.3):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / r)

def cloche(f=1760, d=1.2):
    n = int(SR * d); t = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * k * t) * g for k, g in ((1, 1), (2.76, .5), (5.4, .25))) * env(n, r=0.35)

def bruit(d, lo, hi, r=0.2):
    n = int(SR * d); x = rng.normal(0, 1, n); f = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    f *= (fr > lo) & (fr < hi); return np.fft.irfft(f, n) * env(n, a=0.01, r=r)

def sfx():
    save("sfx_ding", cloche(2093, 1.0))                                         # ampoule / idée
    kc = np.concatenate([bruit(0.12, 800, 5000, 0.04), np.zeros(int(SR * .05))])
    save("sfx_caisse", np.concatenate([kc, kc[: len(kc) // 2] * .7, cloche(1568, 1.0) + cloche(2349, 1.0) * .6]))
    t = np.arange(int(SR * .45)) / SR
    save("sfx_swish", bruit(0.45, 400, 6000, 0.5) * np.sin(np.pi * t / .45))   # changement de plan
    n = int(SR * .5); tt = np.arange(n) / SR
    save("sfx_boing", np.sin(2 * np.pi * (180 + 220 * np.exp(-tt * 6)) * tt * (1 + 0.15 * np.sin(2 * np.pi * 14 * tt))) * env(n, r=0.25))
    save("sfx_billets", sum(np.roll(bruit(1.5, 1500, 9000, 0.06), int(SR * s)) for s in rng.uniform(0, 1.3, 14)))
    c = np.zeros(int(SR * 3))                                                   # grillons (le silence gêné)
    for k in range(6):
        i = int(SR * (0.2 + k * 0.45)); n2 = int(SR * .12); tt = np.arange(n2) / SR
        c[i:i + n2] += np.sin(2 * np.pi * 4300 * tt) * (np.sin(2 * np.pi * 45 * tt) > 0) * 0.5
    save("sfx_grillons", c)
    n = int(SR * 1.2); tt = np.arange(n) / SR                                    # télé qui s'allume
    save("sfx_tele", np.concatenate([bruit(0.03, 200, 8000, 0.01), (np.sin(2 * np.pi * 60 * tt) * .3 + rng.normal(0, .15, n)) * np.exp(-tt * 2)]))
    save("sfx_pas", sum(np.roll(bruit(0.08, 100, 1200, 0.03), int(SR * k * BEAT / 2)) for k in range(16)) if True else 0)

if __name__ == "__main__":
    os.makedirs(f"{R}/audio", exist_ok=True)
    save("musique", musique(float(sys.argv[1]) if len(sys.argv) > 1 else 160))
    sfx(); print("ok")
