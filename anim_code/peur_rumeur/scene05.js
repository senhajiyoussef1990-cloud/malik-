// SCÈNE 05 — Plans 08-09 (TV). Le veilleur sursaute devant une ombre sur le mur : « J'ai entendu quelque chose près de l'entrepôt ! »
// « Il raconte un bruit, pas une menace » : la voisine se rapproche pour écouter, il porte la main près de l'oreille.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 820, 430, 1.55], [B[0], 640, 430, 1.4], [DUREE, 660, 430, 1.45]]);
    placeNB(cc, t, { nuit: .65 });
    if (lb < 0) { cc.fillStyle = 'rgba(0,0,0,.45)'; const o = Math.sin(t * 2) * 20; cc.beginPath(); cc.ellipse(940 + o, 330, 60, 110, .1, 0, 7); cc.fill(); }   // l'ombre sur le mur
    const V = VEILLEUR(t, 820, { face: 1, look: [.9, -.2] });
    if (la >= 0 && lb < 0) { voix(V, ['s05a'], t); const k = ease(seg(la, 0, .3)); V.x = 820 - 40 * k; V.handR = [140, -620]; V.poseR = 'ouverte'; V.sourcil = 1; V.sourire = -.6; V.tilt = -.1; V.bob += Math.abs(Math.sin(la * 30)) * 6 * (la < .3); }
    if (lb >= 0) { V.x = 760; V.face = -1; V.look = [.8, 0]; V.handR = [80, -760]; V.poseR = 'ouverte'; V.talk = .3 * Math.abs(Math.sin(t * 9)); }
    dessine(cc, V); const [lx, ly] = mainF(V, -1); lanterne(cc, lx, ly + 30);
    if (lb >= 0) { const Vo = VOISINE(t, lerp(400, 600, ease(seg(lb, 0, .8))), { face: 1, look: [.9, 0], lean: .1, sourcil: .8 }); if (lb < .8) marche(Vo, t); dessine(cc, Vo); }
  });
  debutFlash(c, t);
}
