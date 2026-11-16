#!/usr/bin/env python3
"""Monteur vidéo « ne.suit.pas.lesmoutons ».

Usage : python3 build.py            -> sortie/video.mp4

Entrées (toutes optionnelles sauf img/) :
  audio/<id>.mp3 (+ <id>.json)  voix générées par tts.py ; sinon silence à durée estimée
  clips/<id>.mp4                 clip années 30 pour chaque réplique narrateur (n01..n15)
  img/renard_telephone.png       renard qui tend le smartphone (sinon placeholder)
"""
import json, os, subprocess, shutil, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(ROOT, *a)
W, H, FPS = 1080, 1920, 30
TITLE, SUBTITLE = "T'AS FAIT UNE AFFAIRE ?", "(oui… lui)"
HANDLE = "@ne.suit.pas.lesmoutons"
BAND_Y, BAND_H = 560, 608          # bande 16:9 de la partie smartphone
GAP = 0.25                         # silence entre répliques
F_TITLE = P("fonts/oswald-latin-700-normal.ttf")
F_SUB = P("fonts/roboto-latin-500-italic.ttf")
F_CAP = P("fonts/inter-latin-700-normal.ttf")
TMP = P("build_tmp")
OUT = P("sortie")

# visuel de chaque réplique
INTRO = {"i1": "mouton_content", "i2": "renard_face", "i3": "mouton_doute", "i4": "PHONE",
         "f1": "mouton_doute", "f2": "renard_profil"}
CLIP_DESC = {
 "n01": "Mouton les yeux en cœur, étiquette « 100 € » barrée en rouge",
 "n02": "Un énorme « 100 » flotte au-dessus de sa tête comme un nuage",
 "n03": "Une ancre « 100 € » enchaînée à la patte du mouton",
 "n04": "Deux savants en blouse font tourner une roue de la fortune",
 "n05": "Un savant tient un globe, la foule se gratte la tête",
 "n06": "Deux groupes brandissent des pancartes « 25 % » et « 45 % »",
 "n07": "Un petit cerveau s'accroche à un chiffre géant",
 "n08": "Le renard ricane et barre une étiquette au feutre rouge",
 "n09": "Vitrine : une montre hors de prix sur un piédestal",
 "n10": "Horloge géante qui tique, renard avec « PLUS QUE 2 »",
 "n11": "Le renard tourne la manivelle d'une machine à prix",
 "n12": "Le mouton tend ses pièces au comptoir",
 "n13": "Le renard emballe une boîte vide « SENTIMENT »",
 "n14": "Le mouton regarde la montre, une bulle de pensée apparaît",
 "n15": "Gros plan : le prix barré s'efface, il ne reste que « 39 € »",
}

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        print(" ".join(cmd)); print(r.stderr[-2500:]); raise SystemExit(1)
    return r.stdout

def dur(path):
    return float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]).strip())

def font(f, s): return ImageFont.truetype(f, s)

def centered(d, y, txt, f, fill="white", stroke=0):
    w = d.textlength(txt, font=f)
    d.text(((W - w) / 2, y), txt, font=f, fill=fill, stroke_width=stroke, stroke_fill="black")

# ---------- calques fixes ----------
def make_overlays():
    # titre + pseudo (identique sur toute la vidéo)
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    sz = 104
    while d.textlength(TITLE, font=font(F_TITLE, sz)) > W - 120: sz -= 2
    centered(d, 225, TITLE, font(F_TITLE, sz), stroke=2)
    centered(d, 372, SUBTITLE, font(F_SUB, 56), stroke=2)
    f = font(F_CAP, 30); tw = d.textlength(HANDLE, font=f)
    d.text((W - tw - 40, 1560), HANDLE, font=f, fill="white", stroke_width=2, stroke_fill="black")
    im.save(P(TMP, "ov_title.png"))
    # dégradé sombre haut/bas pour les plans plein écran
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    for y in range(620):
        gd.line([(0, y), (W, y)], fill=(0, 0, 0, int(235 * (1 - y / 620) ** 1.4)))
    for y in range(1250, H):
        gd.line([(0, y), (W, y)], fill=(0, 0, 0, int(170 * ((y - 1250) / (H - 1250)) ** 1.6)))
    g.save(P(TMP, "ov_grad.png"))

def placeholder_card(sid, path):
    im = Image.new("RGB", (W, BAND_H), (58, 58, 58)); d = ImageDraw.Draw(im)
    d.rectangle([12, 12, W - 13, BAND_H - 13], outline=(150, 150, 150), width=4)
    centered(d, 150, f"CLIP {sid.upper()}  ·  années 30", font(F_TITLE, 70), fill=(230, 230, 230))
    y = 270
    for ln in textwrap.wrap(CLIP_DESC.get(sid, ""), 34):
        centered(d, y, ln, font(F_CAP, 40), fill=(200, 200, 200)); y += 54
    centered(d, y + 20, f"déposer : clips/{sid}.mp4", font(F_CAP, 30), fill=(150, 150, 150))
    im.save(path)

def phone_placeholder(path):
    """renard_face + patte qui tend un smartphone ; l'écran montre le 1er plan du clip n01"""
    base = Image.open(P("img/renard_face.png")).convert("RGBA").resize((W, H))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    fur, fur2, ol = (190, 96, 44), (225, 160, 110), (55, 26, 10)
    X, Y, PW, PH = 600, 1020, 380, 700                       # téléphone
    # manche + paume (derrière le téléphone)
    d.polygon([(250, H), (520, H), (800, 1760), (700, 1640)], fill=(36, 28, 24), outline=(12, 10, 8))
    d.polygon([(690, 1650), (735, 1615), (820, 1735), (785, 1775)], fill=(238, 230, 212), outline=(12, 10, 8))
    d.ellipse([700, 1600, 920, 1790], fill=fur, outline=ol, width=5)
    # téléphone
    ph = Image.new("RGBA", (PW, PH), (0, 0, 0, 0)); pd = ImageDraw.Draw(ph)
    pd.rounded_rectangle([0, 0, PW - 1, PH - 1], 50, fill=(16, 16, 16), outline=(90, 90, 90), width=5)
    sw, sh = PW - 36, PH - 90
    scr = Image.new("RGB", (sw, sh), (20, 20, 20))
    clip = P("clips", "n01.mp4")
    if os.path.exists(clip):
        run(["ffmpeg", "-y", "-v", "error", "-ss", "0.5", "-i", clip, "-frames:v", "1", P(TMP, "phone_frame.png")])
        fr = Image.open(P(TMP, "phone_frame.png")).convert("RGB")
        fr = fr.resize((sw, int(fr.height * sw / fr.width)))
        scr.paste(fr, (0, (sh - fr.height) // 2))
    m = Image.new("L", (sw, sh), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, sw - 1, sh - 1], 32, fill=255)
    ph.paste(scr, (18, 48), m)
    pd.rounded_rectangle([PW // 2 - 50, 18, PW // 2 + 50, 32], 7, fill=(45, 45, 45))
    lay.alpha_composite(ph, (X, Y))
    d = ImageDraw.Draw(lay)
    # pouce sur le bord gauche, bouts des doigts sur le bord droit
    d.rounded_rectangle([X - 30, Y + 520, X + 26, Y + 660], 26, fill=fur, outline=ol, width=5)
    d.ellipse([X - 18, Y + 535, X + 14, Y + 565], fill=fur2)
    for k in range(3):
        y = Y + 470 + k * 62
        d.rounded_rectangle([X + PW - 26, y, X + PW + 34, y + 54], 26, fill=fur, outline=ol, width=5)
    d.rounded_rectangle([X + 60, Y + PH - 14, X + 300, Y + PH + 40], 26, fill=fur, outline=ol, width=5)
    base.alpha_composite(lay)
    base.convert("RGB").save(path)
    return (X + PW / 2, Y + PH / 2)  # centre de l'écran du téléphone

# ---------- durées & sous-titres ----------
def seg_timing(L):
    a = P("audio", L["id"] + ".mp3")
    if os.path.exists(a):
        d = dur(a); al = json.load(open(P("audio", L["id"] + ".json")))
        st = al["character_start_times_seconds"]; en = al["character_end_times_seconds"]
        return d, al, (st[0], en[-1])
    d = len(L["text"].split()) / 2.6 + 0.4
    return d, None, (0.0, d)

def chunks(text, maxw=4, maxc=30):
    out, cur, words = [], [], []
    for w in text.split():   # garde « 100 € », « 25 % », « ? » collés au mot précédent
        if words and w in ("€", "%", "?", "!", ":", ";", "»"): words[-1] += "\u00a0" + w
        elif words and words[-1] == "«": words[-1] += "\u00a0" + w
        else: words.append(w)
    for w in words:
        if cur and (len(cur) >= maxw or len(" ".join(cur + [w])) > maxc):
            out.append(" ".join(cur)); cur = []
        cur.append(w)
        if w[-1] in ".?!" and len(cur) >= 2:
            out.append(" ".join(cur)); cur = []
    if cur: out.append(" ".join(cur))
    return out

def chunk_times(L, al, span):
    cap = L.get("cap", L["text"]); cs = chunks(cap)
    if al and cap == L["text"]:
        chars = al["characters"]; st = al["character_start_times_seconds"]; en = al["character_end_times_seconds"]
        s = "".join(chars); res, pos = [], 0
        for c in cs:
            i = s.find(c.split()[0], pos); i = pos if i < 0 else i
            j = i + len(c); res.append((c, st[min(i, len(st) - 1)], en[min(j, len(en)) - 1])); pos = j
        return res
    a, b = span; tot = sum(len(c) for c in cs); t = a; res = []
    for c in cs:
        dt = (b - a) * len(c) / tot; res.append((c, t, t + dt)); t += dt
    return res

def ass_time(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"

# ---------- segments vidéo ----------
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", str(FPS)]

def render_still(img, d, out, zoom_to=1.08, focus=None, punch=0.0):
    n = int(round(d * FPS)); fx, fy = focus or (W / 2, H / 2)
    # zoom lent ; « punch » = zoom rapide final (entrée dans le téléphone)
    if punch:
        pn = int(punch * FPS)
        z = f"if(lt(on,{n - pn}),1+{zoom_to - 1}*on/{n},{zoom_to}+3*pow((on-{n - pn})/{pn},2))"
    else:
        z = f"1+{zoom_to - 1}*on/{n}"
    vf = (f"scale={W * 2}:{H * 2},zoompan=z='{z}':d={n}:s={W}x{H}:fps={FPS}"
          f":x='({fx * 2})-({fx * 2})/zoom':y='({fy * 2})-({fy * 2})/zoom'")
    if punch: vf += f",fade=t=out:st={d - 0.25:.3f}:d=0.25:color=white"
    run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", img, "-i", P(TMP, "ov_grad.png"),
         "-filter_complex", f"[0:v]{vf}[b];[b][1:v]overlay=0:0,format=yuv420p",
         "-t", f"{d:.3f}", *ENC, out])

def render_band(sid, d, out, first=False):
    clip = P("clips", sid + ".mp4"); n = d
    if os.path.exists(clip):
        src = ["-stream_loop", "-1", "-i", clip]
        band = f"[0:v]scale={W}:{BAND_H}:force_original_aspect_ratio=increase,crop={W}:{BAND_H},setsar=1,fps={FPS}"
    else:
        card = P(TMP, f"card_{sid}.png"); placeholder_card(sid, card)
        src = ["-loop", "1", "-i", card]
        band = f"[0:v]scale={W}:{BAND_H},noise=alls=8:allf=t,fps={FPS}"
    vf = (f"{band}[c];color=black:s={W}x{H}:r={FPS}[bg];[bg][c]overlay=0:{BAND_Y}:shortest=1,format=yuv420p")
    if first: vf += ",fade=t=in:st=0:d=0.3:color=white"
    run(["ffmpeg", "-y", "-v", "error", *src, "-filter_complex", vf, "-t", f"{n:.3f}", *ENC, out])

def main():
    shutil.rmtree(TMP, ignore_errors=True); os.makedirs(TMP); os.makedirs(OUT, exist_ok=True)
    make_overlays()
    lines = json.load(open(P("lines.json")))
    phone_img = P("img/renard_telephone.png"); phone_focus = (W / 2, H * 0.62)
    if not os.path.exists(phone_img):
        phone_img = P(TMP, "phone_placeholder.png"); phone_focus = phone_placeholder(phone_img)

    vids, auds, ass_ev, t0, first_band = [], [], [], 0.0, True
    for k, L in enumerate(lines):
        sid = L["id"]; d_audio, al, span = seg_timing(L)
        d = d_audio + GAP + (0.7 if sid == "i4" else 0)
        v = P(TMP, f"v_{k:02d}.mp4"); a = P(TMP, f"a_{k:02d}.wav")
        if sid.startswith("n"):
            render_band(sid, d, v, first=first_band); first_band = False
            style = "Narr"
        else:
            vis = INTRO[sid]
            if vis == "PHONE": render_still(phone_img, d, v, 1.06, phone_focus, punch=0.7)
            else: render_still(P("img", vis + ".png"), d, v, 1.07)
            style = "Dial"
        ap = P("audio", sid + ".mp3")
        if os.path.exists(ap):
            run(["ffmpeg", "-y", "-v", "error", "-i", ap, "-af", f"apad", "-t", f"{d:.3f}", "-ar", "44100", "-ac", "2", a])
        else:
            run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", f"{d:.3f}", a])
        ct = chunk_times(L, al, span)
        for j, (c, s, e) in enumerate(ct):
            e = ct[j + 1][1] - 0.02 if j + 1 < len(ct) else min(e + 0.15, d - 0.02)
            ass_ev.append(f"Dialogue: 0,{ass_time(t0 + s)},{ass_time(t0 + e)},{style},,0,0,0,,{c}")
        vids.append(v); auds.append(a); t0 += d
        print(f"  {sid:4s} {d:5.2f}s  ({'audio' if al else 'estimé'})")

    # plan final : renard qui ajuste sa cravate, fondu au noir
    v = P(TMP, "v_99.mp4"); a = P(TMP, "a_99.wav")
    render_still(P("img/renard_cravate.png"), 2.0, v, 1.05)
    run(["ffmpeg", "-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-t", "2.0", a])
    vids.append(v); auds.append(a); t0 += 2.0

    ass = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Narr,Inter,46,&H004DE1FF,&H004DE1FF,&H70000000,&H00000000,-1,0,0,0,100,100,0,0,3,8,0,2,40,40,{H - (BAND_Y + BAND_H) + 40},1
Style: Dial,Inter,54,&H00FFFFFF,&H00FFFFFF,&H70000000,&H00000000,-1,0,0,0,100,100,0,0,3,10,0,2,60,60,210,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""" + "\n".join(ass_ev) + "\n"
    open(P(TMP, "subs.ass"), "w").write(ass)

    with open(P(TMP, "v.txt"), "w") as f: f.writelines(f"file '{x}'\n" for x in vids)
    with open(P(TMP, "a.txt"), "w") as f: f.writelines(f"file '{x}'\n" for x in auds)
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", P(TMP, "v.txt"), "-c", "copy", P(TMP, "all.mp4")])
    run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", P(TMP, "a.txt"), P(TMP, "all.wav")])
    fd = t0 - 2.0 + 1.2
    run(["ffmpeg", "-y", "-v", "error", "-i", P(TMP, "all.mp4"), "-i", P(TMP, "ov_title.png"), "-i", P(TMP, "all.wav"),
         "-filter_complex", f"[0:v][1:v]overlay=0:0,ass={P(TMP, 'subs.ass')}:fontsdir={P('fonts')},fade=t=out:st={fd:.2f}:d=0.8[v];[2:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]",
         "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "medium", "-crf", "22", "-maxrate", "8M",
         "-bufsize", "16M", "-pix_fmt", "yuv420p", "-r", str(FPS), "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart",
         P(OUT, "video.mp4")])
    print(f"OK -> sortie/video.mp4  ({t0:.1f}s)")

if __name__ == "__main__":
    main()
