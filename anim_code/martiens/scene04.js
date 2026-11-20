// SCÈNE 04 — Plans 06-07 (TV). s04a : au studio « THÉÂTRE RADIOPHONIQUE », lampe « EN ONDES » allumée, les acteurs lisent leur texte devant les micros ; l'orchestre joue une musique douce.
// s04b : le metteur en scène lève la main : la musique s'arrête net, un speaker en costume se penche sur le micro du « flash spécial ».
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 430, 1.08], [B[0], 600, 420, 1.15], [DUREE, 620, 410, 1.2]]);
    const Ac = [figurant(t, 420, 4, { s: .46, y: 790, face: 1, look: [.3, .6], handL: [-20, -560], handR: [70, -560], poseL: 'poing', poseR: 'poing' }), figurant(t, 640, 0, { s: .48, y: 790, face: -1, look: [-.3, .6], handL: [-20, -560], handR: [70, -560], poseL: 'poing', poseR: 'poing' })];
    const Ms = figurant(t, 880, 3, { s: .48, y: 790, face: -1, look: [-.8, 0] }); if (lb >= 0) { Ms.handL = [-60, -780]; Ms.poseL = 'ouverte'; Ac.forEach(a => { a.look = [0, -.2]; a.sourcil = .8; }); }
    studio38NB(cc, t, { micros: [480, 700], derriere: (c2) => { Ac.forEach(a => dessine(c2, a)); dessine(c2, Ms); } });
    Ac.forEach(a => { const h = mainF(a, 1); F(cc, poly([[h[0] - 26, h[1] - 34], [h[0] + 26, h[1] - 34], [h[0] + 26, h[1] + 4], [h[0] - 26, h[1] + 4]]), GRIS.blanc, 2); });
    if (lb < 0) notesNB(cc, 200, 520, t, 4, .8);
  });
  debutFlash(c, t);
}
