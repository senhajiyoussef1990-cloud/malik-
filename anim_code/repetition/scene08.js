// SCÈNE 08 — Plans 14-17 (TV). s08a : le message apparaît sur une boîte, un ticket, une enseigne. s08b : la marchande le répète machinalement.
// s08c (client) : « Quelle étude le démontre ? » — il tend un papier et attend. s08d : elle n'a que d'autres affiches à montrer.
const A = L.s08a, B = L.s08b, C = L.s08c, D = L.s08d, DUREE = D[0] + D[1] + .6;
function supports(c, t, la) {                                        // boîte, ticket, enseigne qui surgissent tour à tour
  const ap = (k) => ease(clamp((la - k * A[1] / 3.2) * 3));
  let u = ap(0); if (u > 0) { c.save(); c.translate(250, 520); c.scale(u, u); F(c, poly([[-60, 0], [60, 0], [60, -90], [-60, -90]]), GRIS.blanc, 3); F(c, poly([[-60, -90], [60, -90], [40, -110], [-80, -110]]), GRIS.clair, 3); afficheNB(c, 0, -82, .38); c.restore(); }
  u = ap(1); if (u > 0) { c.save(); c.translate(540, 500); c.rotate(-.1); c.scale(u, u); F(c, poly([[-50, -24], [50, -24], [50, 24], [-50, 24]]), GRIS.blanc, 3); ink(c, 1.4, GRIS.moyen); c.setLineDash([4, 3]); c.strokeRect(-44, -18, 88, 36); c.setLineDash([]); c.font = 'bold 11px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('LA BOISSON', 0, -2); c.fillText('DES VAINQUEURS', 0, 12); c.restore(); }
  u = ap(2); if (u > 0) { c.save(); c.translate(840, 90); c.scale(u, u); ink(c, 4); c.beginPath(); c.moveTo(-60, -40); c.lineTo(-60, 0); c.moveTo(60, -40); c.lineTo(60, 0); c.stroke(); F(c, poly([[-130, 0], [130, 0], [130, 60], [-130, 60]]), GRIS.noir, 4); c.font = 'bold 22px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.blanc; c.fillText('LA BOISSON DES VAINQUEURS', 0, 38); c.restore(); }
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
    cam(cc, t, [[0, 540, 405, 1.0], [A[0] + A[1], 540, 405, 1.0], [B[0], 430, 390, 1.4], [C[0], 560, 390, 1.3], [D[0], 420, 400, 1.4], [DUREE, 420, 410, 1.35]]);
    boutiqueNB(cc, t);
    const Ma = figurant(t, 380, 1, { s: .5, y: 640, tablier: 'blanc', look: [.6, 0] });
    if (lb >= 0) { Ma.talk = lc < 0 ? .25 + .25 * Math.abs(Math.sin(t * 11)) : 0; Ma.lid = .8; Ma.look = [0, .2]; if (lb > B[1] * .5 && lc < 0) { Ma.handL = [-150, -560]; Ma.handR = [150, -560]; Ma.poseL = Ma.poseR = 'ouverte'; Ma.tilt = -.1; } }   // la ritournelle, puis haussement d'épaules
    if (lc >= 0) { Ma.look = [.8, -.1]; Ma.sourcil = .8; Ma.sourire = 0; }
    if (ld >= 0) { const s = Math.sin(ld * 5); Ma.lean = .12 * (ld < D[1] * .5); Ma.look = [-.5, 1]; Ma.handR = [120, -480 + s * 20]; Ma.poseR = 'ouverte';
      if (ld > D[1] * .5) { Ma.lean = 0; Ma.look = [.8, 0]; Ma.handR = [160, -700]; Ma.poseR = 'poing'; Ma.sourire = 1; } }
    dessine(cc, Ma);
    if (ld > D[1] * .5) { const [hx, hy] = mainF(Ma, 1); afficheNB(cc, hx, hy - 30, .45); afficheNB(cc, hx + 50, hy - 20, .45, .15); }   // elle brandit… d'autres affiches
    comptoirMarchande(cc, 160, 740, 560);
    for (let k = 0; k < 5; k++) bouteille(cc, 220 + k * 46, 560, .62, k % 2);
    if (la >= 0 && lb < 0) supports(cc, t, la);
    const Cl = figurant(t, 860, 3, { s: .54, y: 790, face: -1, chapeau: COIFFE.casquette, look: [.6, 0] });
    if (lc >= 0) { voix(Cl, ['s08c'], t); const k = ease(seg(lc, 0, .4)); Cl.handR = [lerp(80, 220, k), lerp(-420, -560, k)]; Cl.poseR = 'poing'; Cl.sourcil = .9; Cl.lean = .05; }
    if (ld >= 0) { Cl.handR = [220, -560]; Cl.poseR = 'poing'; Cl.look = [.6, .1]; Cl.froncer = 1; }
    dessine(cc, Cl);
    if (lc >= 0) { const [hx, hy] = mainF(Cl, 1); cc.save(); cc.translate(hx - 20, hy - 40); cc.rotate(.1); F(cc, poly([[-36, -46], [36, -46], [36, 46], [-36, 46]]), GRIS.blanc, 3); ink(cc, 1.4, GRIS.moyen); for (let r = 0; r < 5; r++) { cc.beginPath(); cc.moveTo(-26, -30 + r * 14); cc.lineTo(26, -30 + r * 14); cc.stroke(); } cc.font = 'bold 13px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('ÉTUDE ?', 0, 40); cc.restore(); }
  });
  debutFlash(c, t);
}
