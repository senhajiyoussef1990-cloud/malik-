// SCÈNE 03 — le poste s'allume ; on plonge dans l'écran. 
const A = L.s03a, ZD = 1.2, DUREE = A[0] + A[1] + .3, Z0 = Math.max(1.2, DUREE - ZD - .05);
const XI = ((cc, t, u) => villageNB(cc, t, {}));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (t > Z0 + ZD) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); XI(cc, t, 1); }); return; }
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 345; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 718; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => { XI(cc, tt, 1); plaqueEpoque(cc, 'Un village, avant l’élection', 1); }, derriere: (cc) => tablePetitDej(cc, { tasse: 1, affiche: 1, t }) });
  c.restore(); flash(c, ease(seg(t, Z0 + ZD - .25, Z0 + ZD)));
}
