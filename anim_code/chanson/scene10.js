// SCÈNE 10 — Plans 18-19 (TV). s10a : la salle d'audience du Congrès ; des animateurs témoignent devant les micros ; les flashs des photographes crépitent.
// s10b : une une de journal tournoie : « SCANDALE DE LA PAYOLA : LES TUBES ÉTAIENT ACHETÉS ».
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.08]]); congresNB(cc, t, { flash: 1, derriere: (c2) => { for (let k = 0; k < 5; k++) { const P = figurant(t, 180 + k * 180, [0, 3, 2, 0, 3][k], { s: .42, y: 560, face: 1, look: [0, .3], chapeau: false, froncer: .6 }); dessine(c2, P); } } }); const An = ANIMATEUR(t, 540, { s: .44, y: 790, face: 1, look: [0, -.4], froncer: .8, sourcil: .2 }); An.tilt -= .05; dessine(cc, An); }
    else {
      cam(cc, t, [[B[0], 540, 405, 1.0]]); cc.fillStyle = GRIS.fonce; cc.fillRect(0, 0, W, H); for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12 + t * .3; cc.fillStyle = k % 2 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,0)'; cc.beginPath(); cc.moveTo(540, 405); cc.arc(540, 405, 900, a, a + Math.PI / 12); cc.fill(); }
      const v = ease(seg(lb, 0, 1.1)); cc.save(); cc.translate(540, 420); cc.rotate((1 - v) * 9); cc.scale(.2 + .8 * v, .2 + .8 * v);
      F(cc, poly([[-260, -300], [260, -300], [260, 300], [-260, 300]]), GRIS.blanc, 4); cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.font = 'bold 38px Georgia'; cc.fillText('THE EVENING STAR', 0, -246); F(cc, poly([[-240, -226], [240, -226], [240, -220], [-240, -220]]), GRIS.noir, 0);
      cc.font = 'bold 50px Georgia'; ['SCANDALE', 'DE LA PAYOLA'].forEach((l, k) => cc.fillText(l, 0, -160 + k * 56)); cc.font = 'bold 30px Georgia'; cc.fillText('« Les tubes étaient achetés »', 0, -36);
      F(cc, poly([[-230, 0], [-20, 0], [-20, 260], [-230, 260]]), GRIS.clair, 2); disqueNB(cc, -125, 110, 70); enveloppeBillets(cc, -110, 200, .7, -.2, 1); ink(cc, 1.2, 'rgba(0,0,0,.35)'); for (let r = 0; r < 14; r++) { cc.beginPath(); cc.moveTo(0, 10 + r * 18); cc.lineTo(236, 10 + r * 18); cc.stroke(); } cc.restore();
    }
  });
  debutFlash(c, t);
}
