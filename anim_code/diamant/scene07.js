// SCÈNE 07 — Plans 12-13 (TV + héros). Sur le plateau de tournage, l'acteur à genoux, la vedette éblouie montre sa bague à la caméra : « Une vraie demande en mariage, c'est un diamant, mon chéri ! »
// Le mouton (en couleur, à côté de la caméra) chuchote : « Mais elle récite une réclame ! »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 300, 170); voix(M, ['s07b'], t);
  R.look = [.9, 0]; M.look = [.9, 0];
  if (lb >= 0) { M.look = [-.7, 0]; M.handR = [-90, -620]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [-.6, .1]; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.12], [DUREE, 540, 420, 1.15]], (cc) => {
    cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H); for (let k = 0; k < 7; k++) { cc.fillStyle = k % 2 ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.04)'; cc.fillRect(400 + k * 100, 0, 50, 640); } cc.fillStyle = '#86827a'; cc.fillRect(0, 640, W, H - 640);
    projecteur2(cc, 700, 1);
    const Vd = voix(VEDETTE(t, 760, { face: -1, look: [-.6, 0], sourire: 1.2, handR: [-200, -660], poseR: 'ouverte' }), ['s07a'], t);
    const Ac = figurant(t, 600, 0, { face: 1, s: .5, y: 840, look: [.6, -.6], sourire: 1, handR: [140, -560], poseR: 'ouverte' });
    dessine(cc, Ac); dessine(cc, Vd); const h = mainF(Vd, 1); bagueNB(cc, h[0], h[1] - 8, .36, t);
    cc.save(); cc.translate(470, 600); F(cc, poly([[-60, -60], [40, -60], [40, 20], [-60, 20]]), GRIS.noir, 3); F(cc, ell(-30, -80, 30, 30), GRIS.fonce, 3); F(cc, ell(20, -80, 30, 30), GRIS.fonce, 3); F(cc, poly([[40, -40], [90, -60], [90, 0], [40, -20]]), GRIS.noir, 2); ink(cc, 6, GRIS.noir); cc.beginPath(); cc.moveTo(-10, 20); cc.lineTo(-50, 200); cc.moveTo(-10, 20); cc.lineTo(30, 200); cc.stroke(); cc.restore();   // caméra
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
