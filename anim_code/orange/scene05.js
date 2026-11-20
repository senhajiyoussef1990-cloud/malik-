// SCÈNE 05 — Plans 08-09 (TV). s05a : à la réunion des producteurs, l'un d'eux tape sur la table : « Les gens mangent une orange de temps en temps. Ce n'est pas assez ! »
// s05b : poignée de main avec un homme élégant — carton : « une agence de réclame ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 520, 420, 1.15], [B[0], 600, 420, 1.1]]);
    const P = voix(PRODUCTEUR(t, 450, { face: 1, look: [.6, .2], froncer: .8, sourcil: .8 }), ['s05a'], t);
    if (la >= 0 && lb < 0) { const k = Math.abs(Math.sin(la * 5)); P.handR = [140, lerp(-520, -680, k)]; P.poseR = 'poing'; }
    const P2 = PRODUCTEUR(t, 250, { v: 0, face: 1, look: [.8, 0], sourire: 0 }), P3 = figurant(t, 640, 3, { face: -1, s: .5, y: 790, look: [-.8, 0], chapeau: COIFFE.casquette });
    if (la > 1) { P2.tilt += Math.sin(t * 6) * .04; P3.tilt += Math.sin(t * 6 + 1) * .04; }
    const ag = ease(seg(lb, 0, 1));
    const Pu = PUBLICITAIRE(t, lerp(1000, 800, ag), { face: -1, look: [-.8, 0], sourire: 1, chapeau: lb < 1.2 });
    if (lb >= 0) { if (ag < 1) marche(Pu, t, 8); else { Pu.handL = [-150, -560]; Pu.poseL = 'ouverte'; } P.look = [1, 0]; P.sourire = .8; P.froncer = 0; P.handR = [180, -560]; P.poseR = 'ouverte'; }
    reunionNB(cc, t, { derriere: (c2) => { dessine(c2, P2); dessine(c2, P3); dessine(c2, P); if (lb >= 0) dessine(c2, Pu, drawVendeur); } });
    const k = ease(seg(lb, 1.2, 1.7)); if (k > 0) { cc.save(); cc.globalAlpha = k; F(cc, poly([[560, 690], [1040, 690], [1040, 770], [560, 770]]), GRIS.noir, 3); ink(cc, 2, GRIS.blanc); cc.strokeRect(570, 700, 460, 60); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 28px Georgia'; cc.fillText('UNE AGENCE DE RÉCLAME', 800, 740); cc.restore(); }
  });
  debutFlash(c, t);
}
