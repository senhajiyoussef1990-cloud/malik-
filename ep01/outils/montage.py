"""EP01 — montage final et livrables.

Usage : python3 outils/montage.py
Sorties (sortie/) : MP4 final, version sans sous-titres, SRT, script des voix, couverture 9:16, bande-annonce.
"""
import json, os, subprocess
from PIL import Image, ImageDraw, ImageFont

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(R, *a)
W, H, FPS = 1080, 1920, 30
BAND_Y = 540; BW, BH = 1080, 810
TITRE, SOUS = "TU CROIS CHOISIR ?", "(ou quelqu'un a déjà choisi pour toi)"
FILIGRANE = "© Ne suis pas les moutons"
F_T, F_C = P("fonts/oswald-latin-700-normal.ttf"), P("fonts/inter-latin-700-normal.ttf")
F_I = P("fonts/roboto-latin-500-italic.ttf")
NOMS = {"narr": "NARRATEUR", "renard": "RENARD", "mouton": "MOUTON", "vendeur": "VENDEUR", "client": "CLIENT",
        "passant": "PASSANT", "passante": "PASSANTE", "foule": "FOULE"}

def run(c): subprocess.run(c, check=True)
def fnt(f, s): return ImageFont.truetype(f, s)
def centre(d, y, txt, f, fill="white", stroke=2):
    d.text(((W - d.textlength(txt, font=f)) / 2, y), txt, font=f, fill=fill, stroke_width=stroke, stroke_fill="black")

plans = json.load(open(P("travail/plans.json")))
mn = json.load(open(P("travail/minutage.json")))
lignes = {l["id"]: l for l in json.load(open(P("lignes.json")))}
TOTAL = sum(s["dur"] for s in plans)
os.makedirs(P("sortie"), exist_ok=True)

# ------------------------------------------------ calque fixe : titre, sous-titre, filigrane
def calque():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sz = 110
    while d.textlength(TITRE, font=fnt(F_T, sz)) > W - 110: sz -= 2
    centre(d, 255, TITRE, fnt(F_T, sz)); centre(d, 400, SOUS, fnt(F_I, 54))
    f = fnt(F_C, 28); tw = d.textlength(FILIGRANE, font=f)
    d.text((W - tw - 36, BAND_Y + BH + 22), FILIGRANE, font=f, fill=(255, 255, 255, 150))
    im.save(P("travail/calque.png"))
    # carton final
    c = Image.new("RGBA", (BW, BH), (8, 8, 8, 255)); d = ImageDraw.Draw(c)
    for txt, y, ft in (("NE SUIS PAS", 230, fnt(F_T, 120)), ("LES MOUTONS", 370, fnt(F_T, 120))):
        d.text(((BW - d.textlength(txt, font=ft)) / 2, y), txt, font=ft, fill=(240, 236, 228))
    q = "« Qui a dessiné le décor de ton choix ? »"; ft = fnt(F_I, 44)
    d.text(((BW - d.textlength(q, font=ft)) / 2, 560), q, font=ft, fill=(255, 225, 77))
    c.save(P("travail/carton.png"))

# ------------------------------------------------ sous-titres (ASS + SRT)
def morceaux(mots, maxw=4, maxc=28):
    out, cur = [], []
    for w, a, b in mots:
        if cur and (len(cur) >= maxw or len(" ".join(x[0] for x in cur + [[w]])) > maxc):
            out.append(cur); cur = []
        cur.append([w, a, b])
        if w[-1] in ".?!…" and len(cur) >= 2: out.append(cur); cur = []
    if cur: out.append(cur)
    res = []
    for c in out:   # « ? », « ! », « : » ne restent jamais seuls en début de ligne
        if res and len(c) == 1 and c[0][0] in "?!:;": res[-1].append(c[0]); continue
        res.append(c)
    return res

def tc(t, srt=False):
    h, m, s = int(t // 3600), int(t % 3600 // 60), t % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(s % 1 * 1000):03d}" if srt else f"{h}:{m:02d}:{s:05.2f}"

def sous_titres():
    ev, srt = [], []
    for s in plans:
        for lid, (st, du, who) in s["lignes"].items():
            t0 = s["t0"] + st
            cs = morceaux(mn[lid]["mots"])
            for j, c in enumerate(cs):
                a = t0 + c[0][1]; b = t0 + (cs[j + 1][0][1] - 0.02 if j + 1 < len(cs) else c[-1][2] + 0.25)
                txt = " ".join(x[0] for x in c).replace(" ?", " ?").replace(" !", " !").replace(" :", " :")
                ev.append(f"Dialogue: 0,{tc(a)},{tc(b)},{'Narr' if who == 'narr' else 'Perso'},,0,0,0,,{txt}")
                srt.append((a, b, txt))
    mv = H - (BAND_Y + BH) + 40
    ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Narr,Inter,48,&H004DE1FF,&H004DE1FF,&H78000000,&H00000000,-1,0,0,0,100,100,0,0,3,9,0,2,40,40,{mv},1
Style: Perso,Inter,48,&H00FFFFFF,&H00FFFFFF,&H78000000,&H00000000,-1,0,0,0,100,100,0,0,3,9,0,2,40,40,{mv},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(ev) + "\n"
    open(P("travail/sous_titres.ass"), "w").write(ass)
    with open(P("sortie/EP05_Tu_crois_choisir.srt"), "w") as f:
        for i, (a, b, t) in enumerate(srt, 1): f.write(f"{i}\n{tc(a, True)} --> {tc(b, True)}\n{t}\n\n")

# ------------------------------------------------ script des voix
def script():
    out = [f"# NE SUIS PAS LES MOUTONS — Épisode 05 : {TITRE}", f"*{SOUS}*", "",
           f"Durée finale : {int(TOTAL // 60)} min {TOTAL % 60:04.1f} s", ""]
    titres = [f"SCÈNE {k:02d}" for k in range(1, 16)]
    for s in plans:
        n = s["n"]; out += [f"## Scène {n:02d} — {titres[n - 1]}  ({tc(s['t0'], True)[3:8]} – {tc(s['t0'] + s['dur'], True)[3:8]})", ""]
        for lid, (st, du, who) in s["lignes"].items():
            out.append(f"- `{tc(s['t0'] + st, True)[3:11]}` **{NOMS[who]}** : « {lignes[lid]['text']} »")
        out.append("")
    out += ["**ÉCRAN FINAL** : NE SUIS PAS LES MOUTONS — « Qui a dessiné le décor de ton choix ? »", "",
            "Voix : Chatterbox multilingue (clonage à partir de courtes références) — narrateur : `voix/refs/ref-narrateur.wav`."]
    open(P("sortie/EP05_script_voix.md"), "w").write("\n".join(out))

# ------------------------------------------------ son : voix + musique + bruitages
def son():
    inp, flt, k = [], [], 0
    for s in plans:
        for lid, (st, du, who) in s["lignes"].items():
            inp += ["-i", P(f"voix/{lid}.mp3")]; d = int((s["t0"] + st) * 1000)
            flt.append(f"[{k}]adelay={d}|{d},aformat=channel_layouts=stereo[v{k}]"); k += 1
    nv = k
    sfx = []
    for s in plans:
        n, t0 = s["n"], s["t0"]
        if n not in (1, 5, 13): sfx.append(("swish", t0, 0.5))
        if n == 4: sfx.append(("tele", t0 + s["dur"] - 1.2, 0.5))
        if n == 13: sfx.append(("swish", t0 + 0.2, 0.5))
        if n in (5, 9, 14): sfx.append(("ding", t0 + 1.0, 0.45))
        if n == 3: sfx.append(("boing", t0 + 0.6, 0.5))
        if n == 11: sfx.append(("grillons", t0 + s["dur"] - 3.0, 0.4))
    for name, t, g in sfx:
        inp += ["-i", P(f"audio/sfx_{name}.wav")]; d = int(t * 1000)
        flt.append(f"[{k}]volume={g},adelay={d}|{d},aformat=channel_layouts=stereo[x{k}]"); k += 1
    inp += ["-i", P("audio/musique.wav")]; mi = k
    voix = "".join(f"[v{i}]" for i in range(nv)); fx = "".join(f"[x{i}]" for i in range(nv, k))
    flt.append(f"{voix}amix=inputs={nv}:normalize=0,asplit=2[vx][sc]")
    flt.append(f"[{mi}]volume=0.32,aformat=channel_layouts=stereo[mu];[mu][sc]sidechaincompress=threshold=0.02:ratio=8:attack=15:release=350[mud]")
    flt.append(f"[vx][mud]{fx}amix=inputs={2 + k - nv}:normalize=0,atrim=0:{TOTAL:.2f},loudnorm=I=-14:TP=-1.5:LRA=11[a]")
    run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", ";".join(flt), "-map", "[a]", "-ar", "48000", P("travail/mix.wav")])

# ------------------------------------------------ vidéo
def video(subs, out):
    fin = next(s for s in plans if s["n"] == 15)
    st15 = fin["t0"] + fin["lignes"]["s15b"][0] + fin["lignes"]["s15b"][1] + 0.4
    vf = (f"[0:v]setsar=1[b];color=black:s={W}x{H}:r={FPS}[bg];[bg][b]overlay=0:{BAND_Y}:shortest=1[v1];"
          f"[v1][1:v]overlay=0:0[v2];[v2][2:v]overlay=0:{BAND_Y}:enable='gte(t,{st15:.2f})'[v3]")
    vf += f";[v3]ass={P('travail/sous_titres.ass')}:fontsdir={P('fonts')}[v]" if subs else ";[v3]null[v]"
    run(["ffmpeg", "-y", "-v", "error", "-i", P("travail/bande.mp4"), "-loop", "1", "-i", P("travail/calque.png"),
         "-loop", "1", "-i", P("travail/carton.png"), "-i", P("travail/mix.wav"), "-filter_complex", vf,
         "-map", "[v]", "-map", "3:a", "-t", f"{TOTAL:.2f}", "-c:v", "libx264", "-preset", "medium", "-crf", "17",
         "-maxrate", "4500k", "-bufsize", "9M", "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", out])

def couverture():
    s2 = next(s for s in plans if s["n"] == 2)
    t = s2["t0"] + s2["lignes"]["s02a"][0] + 0.8
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.2f}", "-i", P("sortie/EP05_sans_sous_titres.mp4"), "-frames:v", "1", P("travail/cover_src.png")])
    im = Image.open(P("travail/cover_src.png")).convert("RGB"); d = ImageDraw.Draw(im)
    badge = "ÉPISODE 05"; f = fnt(F_T, 64); w = d.textlength(badge, font=f)
    d.rounded_rectangle([(W - w) / 2 - 30, 1430, (W + w) / 2 + 30, 1530], 18, fill=(200, 30, 30))
    d.text(((W - w) / 2, 1440), badge, font=f, fill="white")
    centre(d, 1580, "NE SUIS PAS LES MOUTONS", fnt(F_T, 70), fill=(255, 225, 77), stroke=3)
    im.save(P("sortie/EP05_couverture.png"))

def bande_annonce():
    # accroche (scènes 1-2) + dernier piège (14), env. 40 s
    parts = [(1, 3), (14, 15)]; segs = []
    for a, b in parts:
        s0 = next(s for s in plans if s["n"] == a); s1 = next(s for s in plans if s["n"] == b)
        segs.append((s0["t0"], s1["t0"] + s1["dur"]))
    fl, cat = [], ""
    for i, (a, b) in enumerate(segs):
        fl.append(f"[0:v]trim={a:.2f}:{b:.2f},setpts=PTS-STARTPTS,fade=t=in:st=0:d=0.2,fade=t=out:st={b - a - 0.25:.2f}:d=0.25[v{i}];"
                  f"[0:a]atrim={a:.2f}:{b:.2f},asetpts=PTS-STARTPTS,afade=t=in:d=0.15,afade=t=out:st={b - a - 0.3:.2f}:d=0.3[a{i}]")
        cat += f"[v{i}][a{i}]"
    fl.append(f"{cat}concat=n={len(segs)}:v=1:a=1[v][a]")
    run(["ffmpeg", "-y", "-v", "error", "-i", P("sortie/EP05_Tu_crois_choisir.mp4"), "-filter_complex", ";".join(fl),
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", P("sortie/EP05_bande_annonce.mp4")])
    return sum(b - a for a, b in segs)

if __name__ == "__main__":
    calque(); sous_titres(); script(); son()
    video(True, P("sortie/EP05_Tu_crois_choisir.mp4"))
    video(False, P("sortie/EP05_sans_sous_titres.mp4"))
    couverture()
    print(f"OK  durée {TOTAL:.1f}s")
