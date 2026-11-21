// SCÈNE 03 — Plan 05. « Pendant longtemps, l’eau en bouteille se vend surtout comme un remède, dans les villes d’eau. » Le poste s’allume sur les THERMES, leur buvette et l’affiche « EAU MINÉRALE — foie · reins · nerfs » ; on plonge dans l’écran.
const A = L.s03a, ZD = 1.2, DUREE = A[0] + A[1] + .3, Z0 = Math.max(1.4, DUREE - ZD - 2.2);
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const ecran = (cc, tt) => { villeEauNB(cc, tt, { derriere: (c2) => { dessine(c2, figurant(tt, 300, 1, { s: .44, y: 760, face: 1, look: [.6, 0], handR: [80, -560], poseR: 'poing' })); dessine(c2, figurant(tt, 780, 0, { s: .46, y: 780, face: -1, look: [-.6, 0], handL: [-80, -560], poseL: 'poing' })); } }); };
  if (t > Z0 + ZD) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[Z0 + ZD, 540, 420, 1.0], [DUREE, 560, 460, 1.12]]); ecran(cc, t); }); return; }
  const R = renardBase(t), M = moutonBase(t), on = clamp((t - .15) / .4);
  R.x = 345; R.handL = [-150, -560]; R.poseL = 'ouverte'; R.look = [-1, .3]; M.x = 718; M.look = [-1, .2]; M.oreille = .2;
  c.save(); const z = ease(seg(t, Z0, Z0 + ZD)), de = [360, 450, 1.25];
  if (z > 0) camEcran(c, z, de); else cam(c, t, [[0, 420, 430, 1.15], [.5, de[0], de[1], de[2]]]);
  dessineSalon(c, t, R, M, { tv: on, ecran: (cc, tt) => { ecran(cc, tt); plaqueEpoque(cc, 'Les villes d’eau', 1); }, derriere: (cc) => tablePetitDej(cc, { tasse: 1, bouteilles: 3, t }) });
  c.restore(); flash(c, ease(seg(t, Z0 + ZD - .25, Z0 + ZD)) * (1 - ease(seg(t, Z0 + ZD, Z0 + ZD + .3))));
}
