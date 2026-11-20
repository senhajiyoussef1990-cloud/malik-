// SCÈNE 05 — Plans 08-09 (TV). Deuxième essai : une petite bille brillante ! Le joueur la montre à son voisin : « Tu as vu ? Ça peut tomber à nouveau ! »
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 640, 480, 1.35], [B[0], 600, 460, 1.2], [DUREE, 560, 460, 1.2]]);
    feteNB(cc, t, {}); machine(cc, 700, 760, 1.0, t, { clignote: true, tiroir: lb < 0 ? seg(la, .1, .5) : 1, contenu: lb < 0 ? 'bille' : 'vide' });
    const J = JOUEUR(t, 470, { look: [.8, .5], sourire: 1.3, sourcil: 1 });
    if (lb >= 0) { voix(J, ['s05b'], t); J.face = -1; J.handR = [200, -660]; J.poseR = 'poing'; J.bob += Math.abs(Math.sin(t * 10)) * 6; }
    dessine(cc, J); if (lb >= 0) { const [hx, hy] = mainF(J, 1); F(cc, ell(hx, hy - 20, 10, 10), GRIS.blanc, 2); }
    if (lb >= 0) dessine(cc, figurant(t, 250, 2, { s: .48, y: 790, face: 1, look: [.8, -.1], sourcil: .7, chapeau: COIFFE.casquette }));
  });
  debutFlash(c, t);
}
