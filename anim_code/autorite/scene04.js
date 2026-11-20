// SCÈNE 04 — Plans 06-07 (TV). Derrière le rideau, un présentateur ordinaire attend, une feuille blanche à la main.
// Un costumier lui présente une belle veste, une blouse et de grosses lunettes.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 540, 430, 1.25], [DUREE, 540, 420, 1.3]]);
    auditoriumNB(cc, t, { rideau: .15 });
    const O = ORATEUR(t, 470, { look: [.4, .3], sourire: 0, handR: [80, -560], poseR: 'poing' });
    if (lb >= 0) { O.look = [.9, 0]; O.sourcil = .8; O.sourire = .6; }
    dessine(cc, O); const [hx, hy] = mainF(O, 1); F(cc, poly([[hx - 20, hy - 30], [hx + 20, hy - 30], [hx + 20, hy + 20], [hx - 20, hy + 20]]), GRIS.blanc, 2);   // la feuille blanche
    if (lb >= 0) { const Co = figurant(t, lerp(800, 640, ease(seg(lb, 0, .6))), 2, { s: .46, y: 540, face: -1, look: [.8, 0], sourire: 1.2, chapeau: COIFFE.casquette, tablier: 'noir' }); Co.handR = [200, -620]; Co.handL = [-60, -500]; Co.poseR = Co.poseL = 'poing'; dessine(cc, Co);
      const [cx, cy] = mainF(Co, 1); cc.save(); cc.translate(cx, cy); habitBlouse2(cc); cc.restore(); LUNETTES(true)(cc, cy - 120 + 712 * 0); }
  });
  debutFlash(c, t);
}
function habitBlouse2(c) { c.save(); c.scale(.4, .4); F(c, smooth([[-70, -40], [70, -40], [86, 300], [-86, 300]]), GRIS.blanc, 5); F(c, poly([[-18, -40], [18, -40], [0, 30]]), GRIS.fonce, 2); c.restore(); }
