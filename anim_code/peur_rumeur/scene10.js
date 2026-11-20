// SCÈNE 10 — Plans 17-18 (TV). Une habitante baisse son store : « Vite, fermez tout ! » — alors que rien de nouveau n'est observé.
// « L'auteur du premier récit est lui-même surpris » : le veilleur regarde la foule et se gratte la tête.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 760, 430, 1.55], [B[0], 600, 430, 1.15], [DUREE, 560, 440, 1.2]]);
    placeNB(cc, t, { affiche: true, store: seg(la, .2, A[1] + .3), nuit: .1 });
    const Hb = figurant(t, 760, 4, { s: .48, y: 760, chapeau: COIFFE.foulard, face: -1, look: [-.4, -1] });
    if (la >= 0) { voix(Hb, ['s10a'], t); const s = seg(la, .2, A[1] + .3); Hb.handL = [-40, -900 + s * 300]; Hb.handR = [40, -900 + s * 300]; Hb.poseL = Hb.poseR = 'poing'; Hb.froncer = 1; Hb.sourire = -.8; }
    dessine(cc, Hb);
    if (lb >= 0) {
      for (let k = 0; k < 6; k++) { const P = figurant(t, 120 + k * 80, k + 1, { s: .42, y: 800, face: k % 2 ? 1 : -1, sourire: -.6, froncer: 1, look: [hash(k + Math.floor(t * 2)) > .5 ? .9 : -.9, 0] }); P.chapeau = [COIFFE.casquette, COIFFE.foulard][k % 2]; P.bob += Math.abs(Math.sin(t * 6 + k)) * 5; dessine(cc, P); }
      const V = VEILLEUR(t, 900, { face: -1, look: [.9, 0], sourcil: 1, sourire: -.2 }); V.handR = [40, -820 + Math.sin(t * 12) * 12]; V.poseR = 'poing'; V.tilt = .1; dessine(cc, V);   // il se gratte la tête
    }
  });
  debutFlash(c, t);
}
