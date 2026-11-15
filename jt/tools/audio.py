"""Bande son synthétique de L'Écho du Jour (aucune voix).

Jingle cuivres + piano (opening), musique légère façon ragtime sous les rubriques,
télégraphe à chaque bandeau, tapotement des feuilles, crépitement de projecteur.
Usage : python3 -I tools/audio.py out/audio.wav
"""
import sys, wave
import numpy as np

SR = 44100
T_OPEN, T_RUB, RUB, = 3.0, 4.5, 13.0
T_OUTRO = T_RUB + 3 * RUB
DUR = T_OUTRO + 3.5
N = int(DUR * SR)
mix = np.zeros(N)
rs = np.random.default_rng(1930)


def hz(note):
    names = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}
    n, o = note[:-1], int(note[-1])
    return 440.0 * 2 ** ((names[n] + 12 * (o + 1) - 69) / 12)


def add(sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= N:
        return
    j = min(N, i + len(sig))
    mix[i:j] += sig[: j - i] * gain


def piano(f, dur=0.6):
    t = np.arange(int(dur * SR)) / SR
    s = sum(np.sin(2 * np.pi * f * k * t) * a * np.exp(-t * (3 + k * 1.5)) for k, a in [(1, 1), (2, 0.5), (3, 0.25), (4, 0.12)])
    att = np.minimum(1, t / 0.004)
    return s * att * 0.5


def brass(f, dur=0.4):
    t = np.arange(int(dur * SR)) / SR
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t)
    s = sum(np.sin(2 * np.pi * f * k * vib * t) / k * (0.9 ** k) for k in range(1, 12))
    env = np.minimum(1, t / 0.03) * np.minimum(1, (dur - t) / 0.08) * (1 - 0.3 * t / dur)
    return s * env * 0.35


def beep(f, dur):
    t = np.arange(int(dur * SR)) / SR
    return np.sign(np.sin(2 * np.pi * f * t)) * 0.25 * np.minimum(1, t / 0.003) * np.minimum(1, (dur - t) / 0.003)


def thump(dur=0.06):
    n = rs.normal(0, 1, int(dur * SR))
    n = np.convolve(n, np.ones(30) / 30, mode="same")
    return n * np.exp(-np.arange(len(n)) / SR * 60) * 1.2


def slide(f0, f1, dur):
    t = np.arange(int(dur * SR)) / SR
    f = np.geomspace(f0, f1, len(t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 4) * 0.5


# --- crépitement de projecteur (tout le long)
hiss = rs.normal(0, 1, N)
hiss = np.convolve(hiss, np.ones(8) / 8, mode="same") * 0.012
mix += hiss
for _ in range(int(DUR * 9)):
    add(rs.normal(0, 1, 60) * np.exp(-np.arange(60) / 10), rs.uniform(0, DUR), 0.08)
tt = np.arange(N) / SR
mix += 0.006 * np.sin(2 * np.pi * 24 * tt) * (np.sin(2 * np.pi * 48 * tt) > 0.6)

# --- accroche : petit « boing » du sourcil
add(slide(300, 900, 0.5), 0.35, 0.35)
add(piano(hz("G4")), 0.4, 0.3)
add(piano(hz("C5")), 1.2, 0.25)

# --- opening : bips du compte à rebours puis fanfare
for k in range(3):
    add(beep(1000, 0.07), T_OPEN + k * 0.25, 0.5)
fan = T_OPEN + 0.75
for i, (n, d) in enumerate([("G4", 0.12), ("G4", 0.12), ("C5", 0.18), ("E5", 0.18), ("G5", 0.55)]):
    t0 = fan + sum(x[1] for x in [("G4", 0.12), ("G4", 0.12), ("C5", 0.18), ("E5", 0.18)][:i])
    add(brass(hz(n), d + 0.05), t0, 0.55)
    add(brass(hz(n) / 2, d + 0.05), t0, 0.25)
for n in ["C3", "E4", "G4", "C5"]:
    add(piano(hz(n), 1.6), fan + 0.6, 0.35)

# --- musique légère sous les rubriques (stride piano, 116 bpm)
beat = 60 / 116
prog = [("C3", "G2", ["E4", "G4", "C5"]), ("A2", "E2", ["C#4", "G4", "A4"]),
        ("D3", "A2", ["F4", "A4", "D5"]), ("G2", "D3", ["F4", "B4", "D5"])]
mel = ["E5", "G5", "A5", "G5", "E5", "D5", "C5", "D5", "C#5", "E5", "A5", "G5", "F5", "E5", "D5", "A4",
       "F5", "A5", "D6", "A5", "F5", "E5", "D5", "C5", "B4", "D5", "G5", "F5", "D5", "B4", "G4", "B4"]
t0, end = T_RUB, T_OUTRO + 1.4
b = 0
while t0 + b * beat < end:
    bar = (b // 4) % 4
    root, fifth, chord = prog[bar]
    tb = t0 + b * beat
    if b % 2 == 0:
        add(piano(hz(root if b % 4 == 0 else fifth), 0.5), tb, 0.28)
    else:
        for n in chord:
            add(piano(hz(n), 0.3), tb, 0.12)
    for h in (0, 0.5):
        m = mel[(b * 2 + int(h * 2)) % len(mel)]
        if (b * 2 + int(h * 2)) % 8 not in (7,):
            add(piano(hz(m), 0.35), tb + h * beat, 0.13)
    b += 1

# --- par rubrique : tapotement des feuilles + télégraphe + collure
for i in range(3):
    S = T_RUB + i * RUB
    for k in (0.1, 0.38, 0.66):
        add(thump(), S + k, 0.5)
    tm = S + 0.2
    for d in [0.05, 0.05, 0.15, 0.05]:
        add(beep(1250, d), tm, 0.35)
        tm += d + 0.05
    if i == 2:
        add(slide(250, 1100, 0.6), S + 2.8, 0.3)
    add(rs.normal(0, 1, 800) * np.exp(-np.arange(800) / 150), S, 0.2)

# --- outro : petite cadence, « ta-da » au salut, iris
O = T_OUTRO
for k, n in enumerate(["G4", "A4", "B4"]):
    add(piano(hz(n), 0.4), O + 1.4 + k * 0.18, 0.25)
add(brass(hz("C5"), 0.15), O + 2.5, 0.5)
add(brass(hz("G5"), 0.6), O + 2.68, 0.5)
for n in ["C3", "G3", "E4", "C5"]:
    add(piano(hz(n), 1.2), O + 2.68, 0.3)

# --- finalisation
fade = np.ones(N)
fl = int(0.5 * SR)
fade[-fl:] = np.linspace(1, 0, fl)
mix *= fade
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix = mix / (np.abs(mix).max() + 1e-9) * 0.85
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("audio ok", DUR)
