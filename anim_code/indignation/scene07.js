// SCÈNE 07 — Plans 12-13. Le renard isole la marge tronquée de la photo avec un cadre transparent : « La photo ne montre pas ce qui suit. »
// Une vendeuse distribue le journal à des clients sans avoir vu la fin : « La colère pousse à transmettre vite. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < -.1) { const [R, M] = herosTV(t, 160, 900); voix(R, ['s07a'], t); R.handR = [260, -640]; R.poseR = 'pointe'; M.look = [-.6, 0]; M.froncer = .5;
    nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); photoMoment(cc, 470, 360, 460, 1, 0); const k = ease(seg(la, .2, A[1])); cc.save(); cc.globalAlpha = k; photoMoment(cc, 790, 360, 300, 2, .04); cc.restore(); ink(cc, 5, GRIS.blanc); cc.setLineDash([12, 8]); cc.strokeRect(640, 200, 300 * k + 1, 330); cc.setLineDash([]); cc.font = 'bold 24px Georgia'; cc.fillStyle = GRIS.noir; cc.textAlign = 'center'; cc.fillText('… et ensuite ?', 790, 580); }, (cc) => heros(cc, R, M)); debutFlash(c, t); return; }
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 460, 1.15]]); placeFeteNB(cc, t, { enfants: false, flaque: false, travaux: false, foule: false });
    const V = figurant(t, 420, 1, { s: .48, y: 790, face: 1, tablier: 'blanc', chapeau: COIFFE.foulard, look: [.8, 0], handR: [200, -560 + Math.sin(t * 6) * 20], poseR: 'poing' }); dessine(cc, V); une(cc, ...mainF(V, 1), .25, 'AGRESSION !', 1);
    for (let k = 0; k < 3; k++) dessine(cc, figurant(t, 640 + k * 120, k + 2, { s: .46, y: 800, face: -1, look: [.8, .3], froncer: .8, chapeau: [COIFFE.casquette, COIFFE.foulard][k % 2], handR: [120, -520], poseR: 'poing' })); });
  debutFlash(c, t);
}
