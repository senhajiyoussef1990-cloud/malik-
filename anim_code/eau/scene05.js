// SCÈNE 05 — Plans 08-09 (TV). s05a : le vendeur au tableau : « Il nous faut une source, une montagne, et une belle histoire ! »
// s05b : les étiquettes défilent : GLACIER, SOMMET, SOURCE cachée sous les arbres.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 640, 400, 1.15], [B[0], 680, 390, 1.2]]); const P = voix(VENDEUR(t, 560, { face: 1, look: [.7, -.4], sourire: 1, handR: [180, -760], poseR: 'pointe' }), ['s05a'], t); agenceNB(cc, t, { tableau: ['IL NOUS FAUT :', '— une source', '— une montagne', '— une belle histoire'], lignes: 1 + Math.floor(seg(la, 0, A[1]) * 3.99), derriere: (c2) => dessine(c2, P, drawVendeur) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); etiquettesNB(cc, t, seg(lb, .1, B[1])); }
  });
  debutFlash(c, t);
}
