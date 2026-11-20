// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard, l'œil malin : « Exactement. Il prépare le terrain. »
// s08b : le médecin écrit à 5 000 confrères — les lettres s'empilent et s'envolent ; les réponses reviennent, tamponnées « OUI », et le compteur grimpe.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(R, ['s08a'], t);
  R.look = [-.8, 0]; M.look = [.8, 0]; M.oreille = .3;
  if (la >= 0 && lb < 0) { R.handL = [-200, -640]; R.poseL = 'pointe'; R.sourcil = .7; R.lid = .5; R.sourire = .8; }
  if (lb >= 0) { R.look = [.9, -.1]; M.look = [.9, -.2]; M.sourcil = .4 + .6 * seg(lb, B[1] * .6, B[1]); }
  const env = seg(lb, 0, B[1] * .5), rep = seg(lb, B[1] * .45, B[1]);
  nbEtCouleur(c, t, [[0, 520, 420, 1.12], [B[0], 600, 400, 1.08], [DUREE, 640, 400, 1.1]], (cc) => {
    const D = DOCTEUR(t, 640, { face: -1, look: [.3, .8], handR: [-120 + Math.sin(t * 16) * 12 * (lb >= 0 && env < 1), -560], poseR: 'poing' });
    if (rep > 0) { D.look = [-.6, -.2]; D.sourire = 1; D.handR = [96, -400]; D.poseR = 'repos'; }
    cabinetNB(cc, t, { lettres: env * 18 * (1 - rep), oui: rep * 18, derriere: (c2) => dessine(c2, D) });
    if (lb >= 0 && env < 1) for (let k = 0; k < 4; k++) { const u = (lb * 1.6 + k * .25) % 1; enveloppe(cc, 760 + u * 400, 520 - u * 380 + Math.sin(u * 8 + k) * 30, .7 - u * .3, u * 2); }
    if (rep > 0) for (let k = 0; k < 4; k++) { const u = (lb * 1.6 + k * .25) % 1; enveloppe(cc, 1160 - u * 340, 140 + u * 400 + Math.sin(u * 7 + k) * 24, .4 + u * .4, -u * 2, 1); }
    if (lb >= 0) { cc.save(); F(cc, poly([[700, 40], [1040, 40], [1040, 170], [700, 170]]), GRIS.blanc, 4); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 30px Georgia'; cc.fillText(Math.round(5000 * env) + ' lettres', 870, 92); cc.font = 'bold 36px Georgia'; cc.fillText(Math.round(4500 * rep) + ' « OUI »', 870, 146); cc.restore(); }
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
