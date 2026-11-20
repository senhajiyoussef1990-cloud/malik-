// SCÈNE 09 — Plans 16-17. Les habitants parlent tous en même temps et couvrent la voix de la factrice : « Le vacarme masque ce qui contredit le groupe. »
// Le mouton propose de faire silence : « Écoutons-la avant de conclure. »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .6;
function bruit(cc, t) { for (let k = 0; k < 8; k++) { cc.save(); cc.font = `bold ${18 + (k % 3) * 8}px Georgia`; cc.fillStyle = GRIS.noir; cc.globalAlpha = .6; cc.fillText(['FERMÉ !', 'bla bla', 'LE PONT !', 'fermé…'][k % 4], 80 + k * 120 + Math.sin(t * 7 + k) * 10, 420 - (k % 3) * 50 + Math.cos(t * 6 + k) * 8); cc.restore(); } }
function foule(cc, t, parle) { placeNB(cc, t, {}); for (let k = 0; k < 6; k++) dessine(cc, figurant(t, 100 + k * 110, k + 1, { s: .44, y: 800, face: k % 2 ? 1 : -1, look: [k % 2 ? .7 : -.7, 0], talk: parle ? .4 * Math.abs(Math.sin(t * 11 + k)) : 0, handR: parle ? [80, -620 + Math.sin(t * 8 + k) * 40] : [80, -420], poseR: 'ouverte', chapeau: [COIFFE.casquette, COIFFE.foulard, COIFFE.toque][k % 3] })); }
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 600, 460, 1.15]]); foule(cc, t, true); bruit(cc, t); const Fa = FACTRICE(t, 860, { talk: .3 * Math.abs(Math.sin(t * 9)), sourire: -.4, froncer: .7 }); dessine(cc, Fa); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 940, 760); voix(M, ['s09b'], t); M.face = -1; M.look = [.7, 0]; M.handR = [-40, -760]; M.poseR = 'pointe'; R.face = -1; R.look = [.7, 0];
  nbEtCouleur(c, t, [[0, 560, 460, 1.1]], (cc) => { foule(cc, t, lb < .4); dessine(cc, FACTRICE(t, 620, { face: -1 })); }, (cc) => heros(cc, R, M));
}
