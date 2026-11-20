// SCÈNE 14 — Plan 24 (TV + héros). Le mouton accroche deux cadres vides au mur, en cherche un troisième et les tourne vers l'extérieur :
// « Je veux voir ce qu'il y a hors champ. »
const A = L.s14a, DUREE = A[0] + A[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], R = renardBase(t), M = voix(moutonBase(t), ['s14a'], t);
  R.x = 220; R.y = 800; R.s = .5; R.look = [.8, -.2]; R.sourire = .8; M.x = 760; M.y = 810; M.s = .47; M.look = [-.4, -.6];
  const tr = ease(seg(la, .2, A[1]));
  M.handR = [-120, -900]; M.poseR = 'ouverte'; M.handL = [-260, -620]; M.poseL = 'poing'; M.sourire = .6;
  nbEtCouleur(c, t, [[0, 540, 400, 1.05]], (cc) => {
    briques(cc, 0, 0, W, 640, '#c4c0b6'); paves(cc, 640);
    for (const [k, x] of [[0, 300], [1, 540]]) { cc.save(); cc.translate(x, 260); cc.scale(Math.cos(tr * .9) || .01, 1); F(cc, poly([[-90, -70], [90, -70], [90, 70], [-90, 70]]), GRIS.fonce, 8); F(cc, poly([[-80, -60], [80, -60], [80, 60], [-80, 60]]), 'rgba(255,255,255,.2)', 2); cc.restore(); }
    cc.save(); ink(cc, 4, `rgba(255,255,255,${.5 + .5 * Math.sin(t * 4)})`); cc.setLineDash([10, 8]); cc.strokeRect(700, 190, 180, 140); cc.setLineDash([]); cc.font = 'bold 50px Georgia'; cc.fillStyle = GRIS.blanc; cc.fillText('?', 775, 280); cc.restore();   // le troisième cadre qu'il cherche
  }, (cc) => { for (const P of [R, M]) { cc.save(); cc.translate(0, -P.bob); (P === R ? drawRenard : drawMouton)(cc, P); cc.restore(); } });
  debutFlash(c, t);
}
