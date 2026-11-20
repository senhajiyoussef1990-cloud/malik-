// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard, malicieux : « Et le vendeur, lui, en vend trois fois plus. »
// s08b : gros plan sur le bureau : un presse-agrumes en verre, étiquette « 10 cents » ; une demi-orange s'écrase, le jus coule.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) {
    const [R, M] = herosTV(t, 330, 190); voix(R, ['s08a'], t); R.look = [-.8, 0]; M.look = [.8, 0];
    if (la >= 0) { R.handR = [220, -640]; R.poseR = 'pointe'; R.sourire = .9; R.lid = .5; M.oreille = .3; }
    nbEtCouleur(c, t, [[0, 600, 400, 1.1]], (cc) => agenceNB(cc, t, { affiche: 1, presse: 1, derriere: (c2) => dessine(c2, PUBLICITAIRE(t, 520, { face: 1, look: [.6, 0], sourire: 1 }), drawVendeur) }), (cc) => heros(cc, R, M));
  } else {
    enNoirEtBlanc(c, t, (cc) => {
      cam(cc, t, [[B[0], 540, 430, 1.0], [DUREE, 540, 420, 1.06]]);
      cc.fillStyle = '#cfcbc1'; cc.fillRect(0, 0, W, H); F(cc, poly([[0, 520], [W, 520], [W, H], [0, H]]), GRIS.fonce, 0); ink(cc, 1.5, 'rgba(255,255,255,.15)'); for (let y = 540; y < H; y += 30) { cc.beginPath(); cc.moveTo(0, y); cc.lineTo(W, y); cc.stroke(); }
      presseAgrumes(cc, 520, 560, 2.4, t, seg(lb, .5, 2.2));
      etiquette(cc, 860, 470, '10 c', 1.6, .2);
      cc.font = 'bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('PRESSE-AGRUMES EN VERRE', 540, 120); cc.font = 'italic 24px Georgia'; cc.fillText('« vendu presque à prix coûtant »', 540, 160);
    });
  }
  debutFlash(c, t);
}
