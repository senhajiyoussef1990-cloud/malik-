// SCÈNE 08 — Plans 14-15 (TV + héros). Le renard montre trois fiches vides : méthode, preuve, source. « Demandons la méthode, les preuves et la source. »
// L'orateur fouille un dossier trop épais : « Les beaux dossiers ne remplacent pas les résultats. »
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 180, 920); voix(R, ['s08a'], t); R.y = 830; M.y = 830; M.look = [-.6, -.5];
  if (la >= 0 && lb < 0) { R.handR = [200, -640]; R.poseR = 'ouverte'; R.look = [.4, -.2]; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.05]], (cc) => {
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8, spot: 1 });
    const O = ORATEUR(t, 540, { face: 1, look: [0, .9], sourire: -.2, sourcil: .8, habit: habitBlouse, chapeau: LUNETTES(true) });
    if (lb >= 0) { O.lean = .1; O.handR = [100, -460 + Math.sin(t * 10) * 30]; O.handL = [-100, -460 - Math.sin(t * 10) * 30]; O.poseR = O.poseL = 'ouverte'; }
    dessine(cc, O);
    if (la >= 0 && lb < 0) ['MÉTHODE', 'PREUVE', 'SOURCE'].forEach((n, k) => fiche(cc, 300 + k * 160, 300, .8 * ease(clamp((la - k * .3) * 3)), n, (k - 1) * .05));
    if (lb >= 0) for (let k = 0; k < 4; k++) { const u = (lb * 1.5 + k * .3) % 1; cc.save(); cc.translate(540 + (k - 1.5) * 60 + u * 80, 300 - u * 120); cc.rotate(u * 3); F(cc, poly([[-24, -32], [24, -32], [24, 32], [-24, 32]]), GRIS.blanc, 2); cc.restore(); }   // des feuilles qui volent
  }, (cc) => { heros(cc, R, M); lunettesMouton(cc, M); });
  debutFlash(c, t);
}
