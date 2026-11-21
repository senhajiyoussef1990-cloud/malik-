// SCÈNE 08 — Plans 14-15 (TV + héros). s08a : le renard pose le doigt sur l’étiquette : « Non. Seule l’étiquette a changé. Et ta façon de le regarder. »
// s08b : le marchand court de portant en portant et barre tous les prix l’un après l’autre.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) { const [R, M] = herosTV(t, 500, 300); voix(R, ['s08a'], t); R.face = 1; R.look = [.8, -.2]; M.face = 1; M.look = [.8, 0]; if (la >= 0) { R.handR = [200, -660]; R.poseR = 'pointe'; R.sourire = .5; }
    nbEtCouleur(c, t, [[0, 660, 405, 1.12]], (cc) => boutiqueNB(cc, t, { etiq: 1 }), (cc) => heros(cc, R, M)); }
  else enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[B[0], 400, 420, 1.1]]); boutiqueNB(cc, t, { etiq: 1, derriere: (c2) => { const u = seg(lb, 0, B[1]); const P = marche(MARCHAND(t, lerp(100, 480, u), { face: 1, look: [-.2, -.5], sourire: 1, handR: [60, -700], poseR: 'pointe' }), t, 7); dessine(c2, P); for (let k = 0; k < 5; k++) if (u * 5 > k) etiquetteBarree(c2, 110 + k * 92, 300, .45, 1, { haut: ['80 F', '150 F', '300 F', '60 F', '120 F'][k], bas: ['40 F', '75 F', '150 F', '30 F', '60 F'][k] }); } }); });
  debutFlash(c, t);
}
