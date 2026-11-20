// SCÈNE 05 — Plans 08-09 (TV). s05a : le charcutier frappe du poing sur son bureau : « Il faut que les gens mangent du bacon le matin ! »
// s05b : la porte s'ouvre, un homme élégant entre, chapeau à la main — un carton le présente : « Edward Bernays, conseiller en relations publiques ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 460, 430, 1.25], [B[0], 600, 420, 1.12], [DUREE, 640, 410, 1.15]]);
    const C = CHARCUTIER(t, 420, { face: 1, look: [.3, .3], froncer: 1, sourcil: 1 }); voix(C, ['s05a'], t);
    const coup = la >= 0 && lb < 0 ? Math.abs(Math.sin(la * 5.5)) : 0;
    if (la >= 0 && lb < 0) { C.handR = [150, lerp(-520, -680, coup)]; C.poseR = 'poing'; C.lean = .05; C.bob += (1 - coup) * 4; }
    if (lb >= 0) { C.look = [1, 0]; C.froncer = .2; C.sourcil = .6; C.handR = [96, -400]; C.poseR = 'repos'; }
    const porte = ease(seg(lb, 0, .6)), entre = ease(seg(lb, .4, 2.2));
    bureauNB(cc, t, { ventes: 0, porte, derriere: (c2) => dessine(c2, C) });
    if (coup > .95) { ink(cc, 4, GRIS.noir); for (let k = 0; k < 5; k++) { const a = -2.6 + k * .5; cc.beginPath(); cc.moveTo(420 + 150 * .54 + Math.cos(a) * 30, 610 + Math.sin(a) * 30); cc.lineTo(420 + 150 * .54 + Math.cos(a) * 60, 610 + Math.sin(a) * 60); cc.stroke(); } }
    if (lb >= 0) {
      const Bn = BERNAYS(t, lerp(980, 790, entre), { face: -1, look: [-.8, 0], sourire: .6, chapeau: lb < 2.4 });
      if (entre < 1) marche(Bn, t, 8); else { Bn.handL = [-60, -720]; Bn.poseL = 'ouverte'; }
      if (lb >= 2.4) { Bn.handR = [-40, -660]; Bn.poseR = 'poing'; }
      dessine(cc, Bn, drawVendeur);
      if (lb >= 2.4) { const h = mainF(Bn, 1); cc.save(); cc.translate(h[0], h[1] - 20); F(cc, ell(0, 0, 36, 6), GRIS.noir, 3); F(cc, smooth([[-22, 0], [-20, -30], [20, -30], [22, 0]]), GRIS.noir, 3); cc.restore(); }
      const k = ease(seg(lb, 1.2, 1.7)); if (k > 0) { cc.save(); cc.globalAlpha = k; F(cc, poly([[560, 690], [1040, 690], [1040, 780], [560, 780]]), GRIS.noir, 3); ink(cc, 2, GRIS.blanc); cc.strokeRect(570, 700, 460, 70); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 30px Georgia'; cc.fillText('EDWARD BERNAYS', 800, 734); cc.font = 'italic 18px Georgia'; cc.fillText('conseiller en relations publiques', 800, 760); cc.restore(); }
    }
  });
  debutFlash(c, t);
}
