"""Génère les 10 scènes d'un épisode au FORMAT COURT (saison 2, ~15 répliques, ~65 s, hook choc).
usage : python3 gen_court.py <params.py>
Répliques : h1 (hook, narr) · s02a mouton / s02b renard (salon, puis plongée dans la télé) · s03a perso / s03b narr ·
s04a perso 2 / s04b mouton (dans la télé) · s05a renard (quiz + compte à rebours) · s06a renard / s06b narr ·
s07a narr (aujourd'hui) · s08a mouton / s08b renard (salon, morale) · s09a renard (question au spectateur) · s16a phrase finale.
Décors TV : expressions JS (cc, t, u) => {...}."""
import sys, os, shutil, json
P = {}; exec(open(sys.argv[1]).read(), P)
EP = P["EP"]; RAC = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); D = f"{RAC}/anim_code/{EP}"
g = lambda k, d="": P.get(k, d)
TABLE = g("TABLE", "{ tasse: 1, t }"); PM = g("PROP_MOUTON", "")
def tv(k): return f"({P[k]})"
HT = json.dumps(P["HOOK_TXT"], ensure_ascii=False); Q = P["QUIZ"]
S = {}
S[1] = f"""// SCÈNE 01 — HOOK : l'image choc de la fable + le chiffre en grand, dès la première seconde.
const A = L.h1, DUREE = A[0] + A[1] + .35;
const X = {tv('X_HOOK')}, HT = {HT};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[0, 540, 405, 1.12], [DUREE, 540, 405, 1.0]]); X(cc, t, seg(t, 0, DUREE)); }});
  c.setTransform(1, 0, 0, 1, 0, 0);
  const k = ease(seg(t, .05, .35)), s = .6 + .4 * k + .03 * Math.sin(t * 7);
  c.save(); c.translate(W / 2, 175); c.scale(s, s); c.globalAlpha = k; c.textAlign = 'center';
  HT.forEach((l, i) => {{ let fs = i ? 52 : 78; c.font = `bold ${{fs}}px Georgia`; while (c.measureText(l).width > 960 && fs > 30) {{ fs -= 2; c.font = `bold ${{fs}}px Georgia`; }} const w = c.measureText(l).width + 50, y = i * 92;
    c.fillStyle = i ? 'rgba(20,18,16,.85)' : '#ffd23a'; c.fillRect(-w / 2, y - (i ? 52 : 74), w, i ? 70 : 96);
    c.fillStyle = i ? '#fff' : '#141210'; c.fillText(l, 0, y); }});
  c.restore();
}}
"""
S[2] = f"""// SCÈNE 02 — salon : le mouton tombe dans le piège ; le renard pique ; on plonge dans la télé.
const A = L.s02a, B = L.s02b, ZD = 1.0, Z0 = B[0] + B[1] + .1, DUREE = Z0 + ZD + .05;
const XI = {tv('X03A')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (t > Z0 + ZD) {{ enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[0, 540, 405, 1.0]]); XI(cc, t, 0); }}); return; }}
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.4, .2]; M.sourire = 1; M.sourcil = .9; {g('POSE_M1', "M.handL = [-150, -620]; M.poseL = 'ouverte';")}
  if (la > A[1] * .55 && lb < 0) {{ M.sourire = -.2; M.froncer = .8; M.sourcil = 1.2; M.tilt += Math.sin(t * 22) * .03; }}
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) {{ const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.sourire = .8; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'pointe'; R.look = [lerp(.9, -1, k), -.1]; M.look = [-1, 0]; }}
  const z = ease(seg(t, Z0, Z0 + ZD)), de = [380, 440, 1.3];
  c.save(); if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 600, 440, 1.36], [B[0], 520, 430, 1.34], [Z0, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, {{ tv: clamp((t - B[0]) / .4), ecran: (cc, tt) => {{ XI(cc, tt, 0); plaqueEpoque(cc, {g('PLAQUE')!r}, 1); }}, derriere: (cc) => tablePetitDej(cc, {TABLE}) }}, (cc) => {{ if (lb < 0) {{ {PM} }} }});
  c.restore(); flash(c, ease(seg(t, Z0 + ZD - .2, Z0 + ZD)));
}}
"""
def deux(n, a, b, xa, xb, com):
    return f"""// SCÈNE {n:02d} — TV. {com}
const A = L.{a}, B = L.{b}, DUREE = B[0] + B[1] + .35;
const XA = {tv(xa)}, XB = {tv(xb)};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {{ if (lb < 0) {{ cam(cc, t, [[0, 540, 405, 1.06], [B[0], 540, 405, 1.0]]); XA(cc, t, seg(la, 0, A[1])); }} else {{ cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.07]]); XB(cc, t, seg(lb, 0, B[1])); }} }});
  debutFlash(c, t);
}}
"""
S[3] = deux(3, "s03a", "s03b", "X03A", "X03B", "le personnage de la fable")
S[4] = f"""// SCÈNE 04 — TV + héros : la victime, le mouton réagit.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .4;
const X = {tv('X04')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, {g('H04', '150, 300')}); voix(M, ['s04b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) {{ M.look = [-.7, -.2]; M.face = -1; M.handR = [140, -620]; M.poseR = 'ouverte'; M.sourcil = 1.2; M.froncer = .3; R.look = [.6, .1]; R.sourire = .5; }}
  nbEtCouleur(c, t, [[0, 600, 420, 1.1], [DUREE, 620, 420, 1.15]], (cc) => X(cc, t, seg(la, 0, A[1])), (cc) => heros(cc, R, M));
  debutFlash(c, t);
}}
"""
S[5] = f"""// SCÈNE 05 — QUIZ : le renard pose la question au spectateur, deux réponses, compte à rebours.
const A = L.s05a, PAUSE = 3.0, DUREE = A[0] + A[1] + PAUSE + .5;
const Q = {json.dumps(Q, ensure_ascii=False)};
function carteQuiz(cc, t, rev) {{
  cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir;
  cc.font = 'bold 46px Georgia'; cc.fillText('À TON AVIS ?', 540, 100); cc.font = 'italic bold 30px Georgia'; Q.q.forEach((l, i) => cc.fillText(l, 540, 160 + i * 40));
  ['A', 'B'].forEach((k, i) => {{ const y = 300 + i * 190, ok = rev && Q.bonne === k;
    F(cc, poly([[150, y], [930, y], [930, y + 150], [150, y + 150]]), ok ? GRIS.noir : GRIS.blanc, 5);
    F(cc, ell(230, y + 75, 46, 46), ok ? GRIS.blanc : GRIS.noir, 0); cc.fillStyle = ok ? GRIS.noir : GRIS.blanc; cc.font = 'bold 50px Georgia'; cc.fillText(k, 230, y + 93);
    cc.textAlign = 'left'; cc.fillStyle = ok ? GRIS.blanc : GRIS.noir; cc.font = 'bold 34px Georgia'; Q[k].forEach((l, j) => cc.fillText(l, 310, y + 70 + j * 42 - (Q[k].length - 1) * 21)); cc.textAlign = 'center'; }});
}}
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], fin = A[0] + A[1], p = t - fin;
  const [R, M] = herosTV(t, 130, 950); voix(R, ['s05a'], t);
  R.face = 1; R.look = [.4, .1]; M.face = -1; M.look = [-.6, -.3]; M.sourcil = 1; M.froncer = .4;
  if (la >= 0 && p < 0) {{ R.handR = [190, -660]; R.poseR = 'pointe'; R.sourcil = .7; }}
  if (p >= 0) {{ M.tilt += Math.sin(t * 5) * .06; R.look = [0, 0]; R.sourire = .9; }}
  nbEtCouleur(c, t, [[0, 540, 405, 1.0], [DUREE, 540, 405, 1.04]], (cc) => carteQuiz(cc, t, false), (cc) => heros(cc, R, M));
  if (p >= 0 && p < PAUSE) {{ const n = 3 - Math.floor(p / (PAUSE / 3)), f = (p % (PAUSE / 3)) / (PAUSE / 3);
    c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.globalAlpha = 1 - f * .6; c.translate(W / 2, H / 2 + 60); c.scale(1.4 - f * .5, 1.4 - f * .5);
    F(c, ell(0, -40, 110, 110), 'rgba(255,210,58,.95)', 6); c.fillStyle = '#141210'; c.font = 'bold 140px Georgia'; c.textAlign = 'center'; c.fillText(String(n), 0, 8); c.restore(); }}
  debutFlash(c, t);
}}
"""
S[6] = f"""// SCÈNE 06 — la réponse (le renard), puis le mécanisme (narrateur).
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .4;
const Q = {json.dumps(Q, ensure_ascii=False)}, XB = {tv('X06B')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {{ const [R, M] = herosTV(t, 130, 950); voix(R, ['s06a'], t); R.face = 1; R.look = [.6, 0]; R.handR = [190, -640]; R.poseR = 'ouverte'; R.sourire = .7; M.face = -1; M.look = [-.6, -.1]; M.sourcil = 1.2; M.sourire = .2;
    nbEtCouleur(c, t, [[0, 540, 405, 1.18], [B[0], 540, 405, 1.1]], (cc) => {{ cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 46px Georgia'; cc.fillText('RÉPONSE ' + Q.bonne, 540, 110);
      F(cc, poly([[150, 260], [930, 260], [930, 470], [150, 470]]), GRIS.noir, 5); cc.fillStyle = GRIS.blanc; cc.font = 'bold 38px Georgia'; Q[Q.bonne].forEach((l, j) => cc.fillText(l, 540, 360 + j * 48 - (Q[Q.bonne].length - 1) * 24)); }}, (cc) => heros(cc, R, M)); }}
  else enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.06]]); XB(cc, t, seg(lb, 0, B[1])); }});
  debutFlash(c, t);
}}
"""
S[7] = f"""// SCÈNE 07 — aujourd'hui.
const A = L.s07a, DUREE = A[0] + A[1] + .5;
const X = {tv('X07')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {{ cam(cc, t, [[0, 540, 405, 1.0], [DUREE, 540, 405, 1.06]]); X(cc, t, seg(t, A[0], A[0] + A[1])); }});
  debutFlash(c, t);
}}
"""
CA = P["CARNET"]
S[8] = f"""// SCÈNE 08 — retour au salon (sans réplique) ; le mouton a compris, la morale du renard + le carnet.
const A = L.s08a, B = L.s08b, ZD = 1.0, DUREE = B[0] + B[1] + .7;
const X = {tv('X07')};
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s08b'], t), M = voix(moutonBase(t), ['s08a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.7, -.1]; M.sourcil = .8; R.x = 345; R.look = [.9, .1];
  if (la >= 0 && lb < 0) {{ M.handL = [-60, -720]; M.poseL = 'pointe'; M.sourire = .5; }}
  if (lb >= 0) {{ R.handR = [200, -600]; R.poseR = 'ouverte'; R.sourire = .8; M.look = [-.9, 0]; M.sourire = .9; }}
  const z = ease(seg(t, 0, ZD)), u = seg(lb, 0, B[1]);
  c.save(); if (z < 1) camEcran(c, 1 - z, [520, 430, 1.3]); else cam(c, t, [[ZD, 520, 430, 1.3], [DUREE, 540, 440, 1.24]]);
  dessineSalon(c, t, R, M, {{ tv: 1, ecran: (cc, tt) => X(cc, tt, 1), derriere: (cc) => tablePetitDej(cc, {TABLE}) }}, (cc) => {{
    if (lb >= 0) {{ const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [[{CA[0]!r}, clamp(u * 3)], [{CA[1]!r}, clamp(u * 3 - .6)], [{CA[2]!r}, clamp(u * 3 - 1.4)], [{CA[3]!r}, clamp(u * 3 - 2)]], 1, -.04); }}
  }});
  c.restore(); flash(c, 1 - ease(seg(t, 0, .25)));
}}
"""
S[9] = f"""// SCÈNE 09 — le renard parle au spectateur : question en commentaire, clin d'œil.
const A = L.s09a, DUREE = A[0] + A[1] + .9;
function frame(c, t) {{
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s09a'], t), M = moutonBase(t), la = t - A[0];
  R.x = 430; R.look = [0, 0]; R.sourire = 1; R.handR = [200, -660]; R.poseR = 'pointe'; M.x = 760; M.look = [-.6, -.1]; M.sourire = 1;
  if (la > A[1] + .1 && la < A[1] + .5) R.wink = 1;
  c.save(); cam(c, t, [[0, 470, 420, 1.45], [DUREE, 470, 400, 1.55]]);
  dessineSalon(c, t, R, M, {{ derriere: (cc) => tablePetitDej(cc, {TABLE}) }});
  c.restore();
  const k = ease(seg(la, A[1] * .4, A[1] * .4 + .4)); if (k > 0) {{ c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.globalAlpha = k; c.translate(W / 2, 95 + (1 - k) * 30);
    c.font = 'bold 40px Georgia'; c.textAlign = 'center'; const s = 'DIS-LE EN COMMENTAIRE ↓', w = c.measureText(s).width + 50; c.fillStyle = '#ffd23a'; c.fillRect(-w / 2, -48, w, 66); c.fillStyle = '#141210'; c.fillText(s, 0, 0); c.restore(); }}
}}
"""
os.makedirs(D, exist_ok=True)
for f in os.listdir(D):
    if f.startswith("scene") and f.endswith(".js"): os.remove(f"{D}/{f}")
for n, s in S.items(): open(f"{D}/scene{n:02d}.js", "w").write(s)
shutil.copy(f"{RAC}/anim_code/bacon/scene16.js", f"{D}/scene10.js")
print("ok", EP, "format court,", len(S) + 1, "scènes")
