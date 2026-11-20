// SCÈNE 06 — Plans 10-11 (TV). s06a : au studio, l'animateur au casque repose l'aiguille sur le même disque ; le compteur « PASSAGES » défile : 3, 4, 5… 9.
// s06b : penché sur le micro, voix de bonimenteur : « Et voici, pour la dixième fois aujourd'hui, le tube du moment ! » — le compteur affiche 10.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    cam(cc, t, [[0, 540, 420, 1.12], [B[0], 560, 430, 1.25], [DUREE, 560, 430, 1.3]]);
    const An = voix(ANIMATEUR(t, 650, { face: -1, look: [-.2, .6], sourire: .8 }), ['s06b'], t);
    const rep = lb < 0 ? 3 + Math.floor(seg(la, 0, A[1]) * 6) : 10;
    if (lb < 0) { const p = (la * 1.4) % 1; An.handR = [lerp(-160, -220, p), lerp(-500, -540, p)]; An.poseR = 'pointe'; }
    else { An.look = [-.3, .1]; An.sourire = 1.2; An.lean = .08; An.handL = [180, -660]; An.poseL = 'ouverte'; }
    studioNB(cc, t, { compteur: rep, notes: 1, derriere: (c2) => dessine(c2, An) });
  });
  debutFlash(c, t);
}
