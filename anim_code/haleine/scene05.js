// SCÈNE 05 — Plans 08-09 (TV). s05a : au tableau noir de l'agence, le publicitaire biffe « sols », « plaies »… et écrit, triomphant, « pour… l'haleine ! » : « Et si on en faisait un remède contre la mauvaise haleine ? »
// s05b : ils ouvrent un vieux dictionnaire poussiéreux : HALITOSE, entouré au crayon.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 640, 400, 1.15], [B[0], 680, 390, 1.2]]); const P = voix(PUBLICITAIRE(t, 560, { face: 1, look: [.7, -.4], sourire: 1, handR: [180, -760], poseR: 'pointe' }), ['s05a'], t); agenceNB(cc, t, { lignes: 1 + Math.floor(seg(la, 0, A[1]) * 3.99), derriere: (c2) => dessine(c2, P, drawVendeur) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 700, 380, 1.3]]); dictionnaire(cc, t, seg(lb, .3, 1.3)); }
  });
  debutFlash(c, t);
}
