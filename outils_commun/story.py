"""Image de story 1080x1920 à partir d'une image de l'épisode.
usage : python3 story.py <video_sans_sous_titres.mp4> <seconde> <badge> <titre> <sous-titre> <accroche> <sortie.png> <dossier_polices>"""
import sys, subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
vid, t, badge, titre, sous, accroche, out, fd = sys.argv[1:9]
W, H = 1080, 1920; tmp = out + ".src.png"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", t, "-i", vid, "-frames:v", "1", tmp], check=True)
src = Image.open(tmp).convert("RGB"); os.remove(tmp)
band = src.crop((0, 540, 1080, 1350))                          # l'image du dessin animé dans la vidéo verticale
fond = band.resize((2560, 1920)).crop((740, 0, 740 + W, H))
fond = fond.filter(ImageFilter.GaussianBlur(28)); fond = Image.blend(fond, Image.new("RGB", (W, H), (10, 8, 6)), .45)
im = fond.copy(); d = ImageDraw.Draw(im)
F = lambda n, s: ImageFont.truetype(os.path.join(fd, n), s)
T, C, I = "oswald-latin-700-normal.ttf", "inter-latin-700-normal.ttf", "roboto-latin-500-italic.ttf"
def centre(y, txt, f, fill="white", st=3):
    d.text(((W - d.textlength(txt, font=f)) / 2, y), txt, font=f, fill=fill, stroke_width=st, stroke_fill="black")
f = F(T, 60); w = d.textlength(badge, font=f); d.rounded_rectangle([(W - w) / 2 - 34, 170, (W + w) / 2 + 34, 270], 22, fill=(200, 30, 30)); d.text(((W - w) / 2, 178), badge, font=f, fill="white")
sz = 120
while d.textlength(titre, font=F(T, sz)) > W - 100: sz -= 4
centre(320, titre, F(T, sz)); centre(320 + sz + 30, sous, F(I, 52))
# l'image du dessin animé, encadrée et légèrement inclinée
cad = band.resize((960, 720)); cv = Image.new("RGBA", (1000, 760), (255, 255, 255, 255)); cv.paste(cad, (20, 20))
cv = cv.rotate(-2.5, expand=True, resample=Image.BICUBIC); im.paste(cv, ((W - cv.width) // 2, 700), cv)
sz = 54
while d.textlength(accroche, font=F(C, sz)) > W - 90: sz -= 2
centre(1530, accroche, F(C, sz), fill=(255, 225, 77))
f = F(C, 44); txt = "NOUVEL ÉPISODE  ·  LIEN EN BIO"; w = d.textlength(txt, font=f) + 60; x0 = (W - w) / 2
d.rounded_rectangle([x0 - 40, 1640, x0 + w + 40, 1740], 50, fill=(255, 255, 255)); d.polygon([(x0, 1668), (x0, 1712), (x0 + 36, 1690)], fill=(200, 30, 30)); d.text((x0 + 60, 1660), txt, font=f, fill=(20, 20, 20))
centre(1800, "© Ne suis pas les moutons", F(C, 32), fill=(230, 230, 230), st=2)
im.save(out); print("ok", out)
