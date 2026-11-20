// SCÈNE 05 — Plans 08-09 (TV). s05a : le producteur de « DISQUES ÉTOILE », cigare et nœud papillon, brandit le disque : « Il faut que notre chanson passe dix fois par jour ! »
// s05b : dans un couloir sombre de la radio, une enveloppe gonflée de billets glisse de sa main à celle de l'animateur.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 460, 420, 1.2], [B[0], 460, 410, 1.25]]);
      const P = voix(PRODUCTEUR(t, 360, { face: 1, look: [.6, -.3], sourire: 1, chapeau: false }), ['s05a'], t);
      if (la >= 0) { P.handR = [140, -720]; P.poseR = 'poing'; P.handL = [-160, -600]; P.poseL = 'ouverte'; }
      labelNB(cc, t, { derriere: (c2) => dessine(c2, P, drawVendeur) }); const h = mainF(P, 1); disqueNB(cc, h[0] + 10, h[1] - 30, 46, t * 2);
      if (la > A[1] * .5) { cc.font = 'bold 60px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('× 10', 640, 340); }
    } else {
      cam(cc, t, [[B[0], 540, 430, 1.25], [DUREE, 540, 440, 1.35]]);
      cc.fillStyle = '#4a4640'; cc.fillRect(0, 0, W, H); const g = cc.createRadialGradient(540, 120, 10, 540, 400, 500); g.addColorStop(0, 'rgba(255,255,240,.5)'); g.addColorStop(1, 'rgba(255,255,240,0)'); cc.fillStyle = g; cc.fillRect(0, 0, W, H); F(cc, ell(540, 90, 40, 12), GRIS.blanc, 2);
      F(cc, poly([[800, 120], [960, 120], [960, 640], [800, 640]]), GRIS.noir, 4); F(cc, poly([[820, 160], [940, 160], [940, 230], [820, 230]]), GRIS.clair, 2); cc.font = 'bold 18px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('STUDIO', 880, 202);
      const P = PRODUCTEUR(t, 380, { face: 1, look: [.6, 0], sourire: .8, chapeau: true, handR: [180, -560], poseR: 'poing' }), An = ANIMATEUR(t, 680, { face: -1, look: [-.6, .4], sourire: .6, handR: [-160, -560], poseR: 'ouverte' });
      An.look = [-.3, -.1]; dessine(cc, P, drawVendeur); dessine(cc, An);
      const u = ease(seg(lb, .5, 1.6)), a = mainF(P, 1), b = mainF(An, 1); enveloppeBillets(cc, lerp(a[0], b[0], u), lerp(a[1], b[1], u) - 20, .7, -.1, u > .95 ? 1 : 0);
    }
  });
  debutFlash(c, t);
}
