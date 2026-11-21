// SCÈNE 05 — Plans 08-09 (TV). s05a : à l’agence, le publicitaire montre le tableau « NOUVEAU MARCHÉ ? — les dames : rien… — à convaincre ! » : « Les dames aussi ont des poils. Il suffit de les en convaincre ! »
// s05b : en vitrine, l’étui élégant « Pour Madame » s’ouvre sur un rasoir fin, sous les guirlandes.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 640, 400, 1.15], [B[0], 680, 390, 1.2]]); const P = voix(PUBLICITAIRE(t, 560, { face: 1, look: [.7, -.4], sourire: 1, handR: [180, -760], poseR: 'pointe' }), ['s05a'], t); agenceNB(cc, t, { lignes: 1 + Math.floor(seg(la, 0, A[1]) * 3.99), derriere: (c2) => dessine(c2, P, drawVendeur) }); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 470, 1.3]]); vitrineDame(cc, t, seg(lb, .3, 1.5)); }
  });
  debutFlash(c, t);
}
