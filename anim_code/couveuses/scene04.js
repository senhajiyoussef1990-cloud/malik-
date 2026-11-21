// SCÈNE 04 — TV. 
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .7;
const XA = ((cc, t, u) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); cc.font = 'bold 40px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('UN PAYS EN ENVAHIT UN AUTRE', 540, 130); cc.font = 'italic bold 34px Georgia'; if (u > .4) cc.fillText('faut-il intervenir ?', 540, 230); for (let k = 0; k < 5; k++) dessine(cc, figurant(t, 150 + k * 195, k, { s: .44, y: 760, face: k % 2 ? -1 : 1, look: [k % 2 ? -.5 : .5, 0], froncer: .5, handR: [100, -600], poseR: k % 2 ? 'pointe' : 'ouverte' })); }), XB = ((cc, t, u) => auditionNB(cc, t, { flash: 1, derriere: (c2) => { dessine(c2, TEMOIN(t, 540, { y: 700, face: 1, look: [0, .3], froncer: .7, sourcil: .8 })); larmes(c2, 532, 400, t); } }));
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.04]]); XA(cc, t, seg(la, 0, A[1])); } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 540, 405, 1.05]]); XB(cc, t, seg(lb, 0, B[1])); } });
  debutFlash(c, t);
}
