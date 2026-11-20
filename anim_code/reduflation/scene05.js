// SCÈNE 05 — Plans 08-09 (TV). s05a : à son établi, le biscuitier ouvre un paquet, en retire un biscuit en douce (15 → 14) et le croque, l'œil malin.
// s05b : vue en coupe du paquet : même carton, même taille… et un espace vide là où était le biscuit (« de l'air »).
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 560, 440, 1.25], [B[0], 560, 430, 1.3]]);
      const Bs = BISCUITIER(t, 460, { face: 1, look: [.6, .6], sourire: .3 }), tire = ease(seg(la, .4, 1.2));
      Bs.handR = [lerp(150, 60, tire), lerp(-500, -700, tire)]; Bs.poseR = 'poing'; if (tire >= 1) { Bs.look = [.6, -.2]; Bs.sourire = 1; Bs.lid = .5; }
      biscuiterieNB(cc, t, { prix: ['1,40 F', '1,30 F'], tapis: 0, derriere: (c2) => dessine(c2, Bs), devant: (c2) => paquetNB(c2, 640, 520, .6, { n: tire > .3 ? 14 : 15, air: tire > .3 }) });
      const h = mainF(Bs, 1); if (tire > .3) biscuitNB(cc, h[0], h[1] - 4, 13);
    } else {
      cam(cc, t, [[B[0], 540, 405, 1.0]]); cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
      paquetNB(cc, 320, 420, 1.3, { n: 15 }); paquetNB(cc, 760, 420, 1.3, { n: 14, air: 1 }); cc.font = 'bold 34px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('AVANT', 320, 120); cc.fillText('APRÈS', 760, 120);
      if (lb > .6) { ink(cc, 5, GRIS.noir); cc.setLineDash([10, 8]); cc.strokeRect(760 + 1.3 * 20 - 10, 420 + 1.3 * 28 - 10, 1.3 * 40 + 20, 1.3 * 24 + 20); cc.setLineDash([]); cc.font = 'italic bold 28px Georgia'; cc.fillText('même taille !', 540, 740); }
    }
  });
  debutFlash(c, t);
}
