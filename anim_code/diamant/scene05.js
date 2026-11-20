// SCÈNE 05 — Plans 08-09 (TV). s05a : le diamantaire en haut-de-forme, devant son coffre, lève une bague : « Il faut que chaque fiancé se sente obligé d'en acheter un ! »
// s05b : il serre la main d'un publicitaire qui entre ; carton « UNE AGENCE DE PUBLICITÉ » ; mission : « changer les mœurs ».
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 480, 430, 1.2], [B[0], 560, 420, 1.1]]);
    coffreNB(cc, t, { mines: 1 });
    const D = voix(DIAMANTAIRE(t, 420, { face: 1, look: [.4, -.3], sourire: .8 }), ['s05a'], t);
    if (la >= 0 && lb < 0) { D.handR = [130, -700]; D.poseR = 'poing'; D.handL = [-150, -560]; D.poseL = 'ouverte'; }
    const ag = ease(seg(lb, 0, 1.1));
    const Pu = PUBLICITAIRE(t, lerp(1100, 720, ag), { face: -1, look: [-.8, 0], sourire: 1, chapeau: lb < 1.2 });
    if (lb >= 0) { if (ag < 1) marche(Pu, t, 8); else { Pu.handL = [-150, -560]; Pu.poseL = 'ouverte'; } D.look = [1, 0]; D.handR = [180, -560]; D.poseR = 'ouverte'; }
    dessine(cc, D); if (lb >= 0) dessine(cc, Pu, drawVendeur);
    if (la >= 0 && lb < 0) { const h = mainF(D, 1); bagueNB(cc, h[0], h[1] - 20, .8, t); }
    const k = ease(seg(lb, 1.2, 1.7)); if (k > 0) { cc.save(); cc.globalAlpha = k; F(cc, poly([[100, 690], [600, 690], [600, 780], [100, 780]]), GRIS.noir, 3); ink(cc, 2, GRIS.blanc); cc.strokeRect(110, 700, 480, 70); cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.font = 'bold 26px Georgia'; cc.fillText('UNE AGENCE DE PUBLICITÉ', 350, 732); cc.font = 'italic 18px Georgia'; cc.fillText('mission : changer les mœurs', 350, 758); cc.restore(); }
  });
  debutFlash(c, t);
}
