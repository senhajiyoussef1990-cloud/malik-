// SCÈNE 02 — salon : le mouton tombe dans le piège ; le renard pique ; on plonge dans la télé.
const A = L.s02a, B = L.s02b, ZD = 1.0, Z0 = B[0] + B[1] + .1, DUREE = Z0 + ZD + .05;
const XI = ((cc, t, u) => auberge(cc, t, { plat: 0, derriere: (c2) => dessine(c2, voix(AUBERGISTE(t, 330, { face: 1, look: [.6, 0], sourire: 1.2, handR: [170, -660], poseR: 'ouverte' }), ['s03a'], t)) }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (t > Z0 + ZD) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); XI(cc, t, 0); }); return; }
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.4, .2]; M.sourire = 1; M.sourcil = .9; M.handL = [-150, -640]; M.poseL = 'ouverte';
  if (la > A[1] * .55 && lb < 0) { M.sourire = -.2; M.froncer = .8; M.sourcil = 1.2; M.tilt += Math.sin(t * 22) * .03; }
  R.x = 345; R.look = [.9, .2]; R.lid = .5;
  if (lb >= 0) { const k = ease(seg(lb, 0, .4)); R.lid = .3; R.sourcil = .8 * k; R.sourire = .8; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'pointe'; R.look = [lerp(.9, -1, k), -.1]; M.look = [-1, 0]; }
  const z = ease(seg(t, Z0, Z0 + ZD)), de = [380, 440, 1.3];
  c.save(); if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 600, 440, 1.36], [B[0], 520, 430, 1.34], [Z0, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: clamp((t - B[0]) / .4), ecran: (cc, tt) => { XI(cc, tt, 0); plaqueEpoque(cc, 'Une auberge — autrefois', 1); }, derriere: (cc) => tablePetitDej(cc, { tasse: 1, objet: 1, t }) }, (cc) => { if (lb < 0) { if (lb < 0) { const a = mainScene(M, -1); objetCouleur(cc, a[0], a[1] + 110, .55, -.08); } } });
  c.restore(); flash(c, ease(seg(t, Z0 + ZD - .2, Z0 + ZD)));
}
