"""Génère les 16 scènes d'un épisode « standard » (structure à 30 répliques) à partir d'un petit fichier de paramètres.
usage : python3 gen_scenes.py <params.py>   (le fichier définit EP, et les chaînes JS ci-dessous)
Chaque décor TV est une expression JS de la forme (cc, t, u) => {...}  (u = avancement 0..1 de la réplique)."""
import sys, os, shutil
P = {}; exec(open(sys.argv[1]).read(), P)
EP = P["EP"]; D = f"{os.path.dirname(os.path.dirname(os.path.abspath(__file__)))}/anim_code/{EP}"
g = lambda k, d="": P.get(k, d)
TABLE = g("TABLE", "{ tasse: 1, t }"); PM = g("PROP_MOUTON", ""); PR = g("PROP_RENARD", "")
def tv(k): return f"({P[k]})"
S = {}
S[1] = f"""// SCÈNE 01 — salon. {g('C01')}
const A = L.s01a, B = L.s01b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s01b'], t), M = voix(moutonBase(t), ['s01a'], t), lb = t - B[0];
  M.x = 718; M.look = [-.5, .2]; M.sourire = .8; {g('POSE_M1', "M.handL = [-150, -540]; M.poseL = 'ouverte';")}
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) {{ const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.handL = [lerp(-104, -40, k), lerp(-440, -640, k)]; R.poseL = 'pointe'; M.look = [-1, 0]; M.sourire = .3; }}
  c.save(); cam(c, t, [[0, 600, 440, 1.38], [B[0], 520, 420, 1.36], [DUREE, 520, 420, 1.4]]);
  dessineSalon(c, t, R, M, {{ derriere: (cc) => tablePetitDej(cc, {TABLE}) }}, (cc) => {{ {PM} }});
  c.restore();
}}
"""
S[2] = f"""// SCÈNE 02 — salon. {g('C02')}
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, 0]; M.sourcil = .6;
  if (la >= 0 && lb < 0) {{ M.handL = [-130, -560]; M.poseL = 'ouverte'; }}
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) {{ const k = ease(seg(lb, B[1] * .5, B[1] * .5 + .5)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }}
  c.save(); cam(c, t, [[0, 600, 440, 1.3], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, {{ derriere: (cc) => tablePetitDej(cc, {TABLE}) }}, (cc) => {{ {g('PROP_MOUTON2', '')} }});
  c.restore();
}}
"""
S[3] = f"""// SCÈNE 03 — le poste s'allume ; on plonge dans l'écran. {g('C03')}
const A = L.s03a, ZD = 1.2, DUREE = A[0] + A[1] + .3, Z0 = Math.max(1.2, DUREE - ZD - .05);
const XI = {tv('X_INTRO')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (t > Z0 + ZD) {{ enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[0, 540, 405, 1.0]]); XI(cc, t, 1); }}); return; }}
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 345; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 718; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, {{ tv: on, ecran: (cc, tt) => {{ XI(cc, tt, 1); plaqueEpoque(cc, {g('PLAQUE')!r}, 1); }}, derriere: (cc) => tablePetitDej(cc, {TABLE}) }});
  c.restore(); flash(c, ease(seg(t, Z0 + ZD - .25, Z0 + ZD)));
}}
"""
def deux(n, a, b, xa, xb, ca, cb, com):
    return f"""// SCÈNE {n:02d} — TV. {com}
const A = L.{a}, B = L.{b}, DUREE = B[0] + B[1] + .7;
const XA = {tv(xa)}, XB = {tv(xb)};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {{ if (lb < 0) {{ cam(cc, t, {ca}); XA(cc, t, seg(la, 0, A[1])); }} else {{ cam(cc, t, {cb}); XB(cc, t, seg(lb, 0, B[1])); }} }});
  debutFlash(c, t);
}}
"""
CAM0 = "[[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]"; CAM1 = "[[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]"
S[4] = deux(4, "s04a", "s04b", "X04A", "X04B", g("CAM04A", CAM0), g("CAM04B", CAM1), g("C04"))
S[5] = deux(5, "s05a", "s05b", "X05A", "X05B", g("CAM05A", CAM0), g("CAM05B", CAM1), g("C05"))
S[6] = deux(6, "s06a", "s06b", "X06A", "X06B", g("CAM06A", CAM0), g("CAM06B", CAM1), g("C06"))
S[9] = deux(9, "s09a", "s09b", "X09A", "X09B", g("CAM09A", CAM0), g("CAM09B", CAM1), g("C09"))
S[10] = deux(10, "s10a", "s10b", "X10A", "X10B", g("CAM10A", CAM0), g("CAM10B", CAM1), g("C10"))
S[12] = deux(12, "s12a", "s12b", "X12A", "X12B", g("CAM12A", CAM0), g("CAM12B", CAM1), g("C12"))
S[7] = f"""// SCÈNE 07 — TV + héros. {g('C07')}
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
const X = {tv('X07')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, {g('H07', '150, 300')}); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) {{ M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [.6, .1]; R.sourire = .4; }}
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.14]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}}
"""
S[8] = f"""// SCÈNE 08 — TV + héros, puis TV. {g('C08')}
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
const XA = {tv('X08A')}, XB = {tv('X08B')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {{ const [R, M] = herosTV(t, {g('H08', '150, 300')}); voix(R, ['s08a'], t); R.face = 1; M.face = 1; R.look = [.8, 0]; M.look = [.8, 0]; if (la >= 0) {{ R.handR = [200, -640]; R.poseR = 'pointe'; R.sourire = .5; }}
    nbEtCouleur(c, t, [[0, 600, 405, 1.08]], (cc) => XA(cc, t, 1), (cc) => heros(cc, R, M)); }}
  else enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); }});
  debutFlash(c, t);
}}
"""
S[11] = f"""// SCÈNE 11 — TV + héros. {g('C11')}
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .8;
const X = {tv('X11')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, {g('H11', '640, 400')}); voix(R, ['s11b'], t); voix(M, ['s11a'], t);
  R.face = -1; M.face = 1; M.look = [.8, -.1]; R.look = [-.8, 0];
  if (la >= 0 && lb < 0) {{ M.handR = [150, -560]; M.poseR = 'ouverte'; M.sourcil = .9; M.froncer = .4; }}
  if (lb >= 0) {{ R.handR = [150, -560 + Math.sin(lb * 6) * 30]; R.poseR = 'ouverte'; R.tilt += Math.sin(lb * 6) * .04; R.sourcil = .5; M.look = [.9, -.2]; }}
  nbEtCouleur(c, t, [[0, 600, 400, 1.12], [DUREE, 620, 400, 1.15]], (cc) => X(cc, t, 1), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}}
"""
S[13] = f"""// SCÈNE 13 — la morale du renard. {g('C13')}
const A = L.s13a, DUREE = A[0] + A[1] + .9;
const X = {tv('X13')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0];
  const [R, M] = herosTV(t, 420, 700); voix(R, ['s13a'], t);
  R.look = [.8, 0]; M.look = [-.8, -.1]; R.handR = [150, -620]; R.poseR = 'poing'; R.handL = [-150, -620]; R.poseL = 'ouverte';
  if (la > A[1] * .6) {{ M.tilt += Math.sin(t * 6) * .05; M.sourire = .6; R.sourire = .6; }}
  nbEtCouleur(c, t, [[0, 540, 400, 1.18], [DUREE, 540, 410, 1.22]], (cc) => X(cc, t, 1), (cc) => {{ heros(cc, R, M); {PR} }});
  debutFlash(c, t);
}}
"""
S[14] = f"""// SCÈNE 14 — « Retour au salon. »
const A = L.s14a, ZD = 1.2, DUREE = A[0] + A[1] + .7, Z0 = A[0] + A[1] * .2;
const X = {tv('X14')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const ecran = (cc, tt) => X(cc, tt, 1);
  if (t < Z0) {{ enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[0, 540, 405, 1.0]]); ecran(cc, t); }}); debutFlash(c, t); return; }}
  const z = ease(seg(t, Z0, Z0 + ZD)), R = renardBase(t), M = moutonBase(t); R.x = 345; R.look = [-.6, -.3]; M.x = 718; M.look = [-.8, -.4];
  c.save(); camEcran(c, 1 - z, [470, 330, 1.25]); dessineSalon(c, t, R, M, {{ tv: 1, ecran, derriere: (cc) => tablePetitDej(cc, {TABLE}) }}); c.restore();
  flash(c, 1 - ease(seg(t, Z0, Z0 + .3)));
}}
"""
CA = P["CARNET"]
S[15] = f"""// SCÈNE 15 — salon, le carnet et le clin d'œil. {g('C15')}
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourire = .6;
  if (la >= 0 && lb < 0) {{ M.handL = [-60, -720]; M.poseL = 'pointe'; }}
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) {{ R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .7; M.look = [-.9, 0]; }}
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) {{ M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }}
  if (ld >= 0) {{ M.sourire = 1; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }}
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, {{ derriere: (cc) => tablePetitDej(cc, {TABLE}) }}, (cc) => {{
    if (lc >= 0) {{ const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [[{CA[0]!r}, clamp(u * 3)], [{CA[1]!r}, clamp(u * 3 - .6)], [{CA[2]!r}, clamp(u * 3 - 1.4)], [{CA[3]!r}, clamp(u * 3 - 2)]], 1, -.04); }}
  }});
  c.restore();
}}
"""
os.makedirs(D, exist_ok=True)
for n, s in S.items(): open(f"{D}/scene{n:02d}.js", "w").write(s)
shutil.copy(f"{os.path.dirname(D)}/bacon/scene16.js", f"{D}/scene16.js")
print("ok", EP, len(S) + 1, "scènes")
