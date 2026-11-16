#!/usr/bin/env python3
"""Monteur vidéo « ne.suit.pas.lesmoutons ».

Usage : python3 build.py            -> sortie/video.mp4

Entrées (toutes optionnelles sauf img/) :
  audio/<id>.mp3 (+ <id>.json)  voix générées par tts.py ; sinon silence à durée estimée
  clips/<id>.mp4                 clip années 30 pour chaque réplique narrateur (n01..n15)
"""
import json, os, subprocess, shutil, textwrap
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(ROOT, *a)
W, H, FPS = 1080, 1920, 30
TITLE, SUBTITLE = "T'AS FAIT UNE AFFAIRE ?", "(oui… lui)"
HANDLE = "@ne.suit.pas.lesmoutons"
BAND_Y, BAND_H = 560, 608          # bande 16:9 de la partie téléviseur
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

def first_frame(path_out):
    """1re image du dessin animé (clip n01 : .png ou .mp4) pour l'écran du téléviseur"""
    for ext in ("png", "mp4"):
        src = P("clips", "n01." + ext)
        if os.path.exists(src):
            run(["ffmpeg", "-y", "-v", "error", "-ss", "0" if ext == "png" else "0.5", "-i", src, "-frames:v", "1", path_out])
            return Image.open(path_out).convert("L").convert("RGB")
    return Image.new("RGB", (640, 360), (40, 40, 40))

def tv_image(path):
    """renard_face + téléviseur en bois années 30 posé sur le comptoir ; l'écran montre le dessin animé"""
    base = Image.open(P("img/renard_face.png")).convert("RGBA").resize((W, H))
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    # meuble télé d'époque posé au sol (pieds sur le plancher, en bas à droite)
    X, TW, TH, LEG = 560, 470, 640, 90
    FLOOR = 1895; Y = FLOOR - LEG - TH
    wood, wood2, dark, brass = (112, 66, 34), (140, 86, 46), (40, 22, 10), (196, 158, 82)
    d.ellipse([X - 40, FLOOR - 25, X + TW + 40, FLOOR + 25], fill=(0, 0, 0, 130))                  # ombre au sol
    for k in (0, 1):                                                                                # pieds galbés
        lx = X + 40 + k * (TW - 110)
        d.polygon([(lx, Y + TH - 5), (lx + 30, Y + TH - 5), (lx + 22 + k * 8, FLOOR), (lx + 8 - k * 0, FLOOR)], fill=dark)
    d.rounded_rectangle([X, Y, X + TW, Y + TH], 40, fill=wood, outline=dark, width=7)
    for k in range(10):                                                                             # veinage
        yy = Y + 30 + k * 62
        d.arc([X + 20, yy - 30, X + TW - 20, yy + 30], 190, 350, fill=wood2, width=3)
    d.rounded_rectangle([X + 24, Y + 24, X + TW - 24, Y + 330], 34, fill=dark)                      # cadre écran
    sx0, sy0, sx1, sy1 = X + 46, Y + 46, X + TW - 46, Y + 308
    fr = first_frame(P(TMP, "tv_frame.png")).resize((sx1 - sx0, int((sx1 - sx0) * 9 / 16)))
    scr = Image.new("RGB", (sx1 - sx0, sy1 - sy0), (25, 25, 25))
    scr.paste(fr, (0, (sy1 - sy0 - fr.height) // 2))
    m = Image.new("L", scr.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, scr.width - 1, scr.height - 1], 40, fill=255)
    lay.paste(scr, (sx0, sy0), m)
    glow = Image.new("RGBA", scr.size, (0, 0, 0, 0)); gd = ImageDraw.Draw(glow)               # reflet écran bombé
    gd.ellipse([20, 10, scr.width * 0.55, scr.height * 0.45], fill=(255, 255, 255, 38))
    lay.alpha_composite(glow, (sx0, sy0))
    d = ImageDraw.Draw(lay)
    d.rounded_rectangle([X + 50, Y + 365, X + 300, Y + 600], 16, fill=(70, 42, 22), outline=dark, width=5)  # grille
    for k in range(11): d.line([(X + 68 + k * 21, Y + 378), (X + 68 + k * 21, Y + 588)], fill=(150, 110, 60), width=6)
    for k in range(3):                                                                              # boutons
        cx, cy = X + 380, Y + 400 + k * 85
        d.ellipse([cx - 32, cy - 32, cx + 32, cy + 32], fill=brass, outline=dark, width=5)
        d.line([(cx, cy), (cx + 19, cy - 19)], fill=dark, width=6)
    base.alpha_composite(lay)
    base.convert("RGB").save(path)
    return ((sx0 + sx1) / 2, (sy0 + sy1) / 2)  # centre de l'écran du téléviseur

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
    # zoom lent ; « punch » = zoom rapide final (entrée dans le téléviseur)
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
    clip = P("clips", sid + ".mp4"); still = P("clips", sid + ".png"); n = d
    if os.path.exists(still):   # image fixe animée : zoom lent + léger panoramique + grain
        nf = int(round(d * FPS)); dx = (-1) ** int(sid[1:]) * 60
        src = ["-loop", "1", "-i", still]
        band = (f"[0:v]scale={W * 2}:{BAND_H * 2},zoompan=z='1.04+0.10*on/{nf}':d={nf}:s={W}x{BAND_H}:fps={FPS}"
                f":x='iw/2-(iw/zoom/2)+{dx}*on/{nf}':y='ih/2-(ih/zoom/2)',"
                f"colorchannelmixer=rr=0.93:gg=0.97:bb=1.06,noise=alls=10:allf=t,vignette=PI/4.5,setsar=1")
    elif os.path.exists(clip):
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
    phone_img = P(TMP, "tv.png"); phone_focus = tv_image(phone_img)

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
