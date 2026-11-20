// SCÈNE 07 — Plans 12-13 (TV + héros). Au ministère, le saumon trône sur la table ; on lui change tour à tour l'étiquette, le ruban, la lumière : « Alors les Norvégiens changent tout… sauf le poisson. »
// Le mouton (en couleur) penche la tête : « Comment ça, tout sauf le poisson ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 330, 190); voix(M, ['s07b'], t);
  R.look = [.9, .1]; M.look = [.9, .1];
  if (lb >= 0) { M.look = [.7, -.2]; M.tilt += .1; M.handR = [140, -580]; M.poseR = 'ouverte'; M.sourcil = 1; R.look = [-.6, .1]; R.sourire = .6; }
  nbEtCouleur(c, t, [[0, 540, 450, 1.15], [DUREE, 540, 450, 1.18]], (cc) => {
    const D = DELEGUE(t, 760, { face: -1, look: [-.6, .6], sourire: 1, handL: [-150, -560], poseL: 'ouverte' });
    ministereNB(cc, t, { derriere: (c2) => dessine(c2, D, drawVendeur) });
    const ph = Math.floor(seg(la, 0, A[1] + .4) * 3);
    if (ph >= 1) { F(cc, poly([[500, 600], [520, 560], [540, 600]]), GRIS.noir, 1.5); F(cc, poly([[540, 600], [560, 560], [580, 600]]), GRIS.noir, 1.5); }   // un nœud
    if (ph >= 2) { const g = cc.createRadialGradient(540, 590, 10, 540, 590, 200); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cc.fillStyle = g; cc.fillRect(300, 400, 480, 300); for (const sd of [-1, 1]) etoile(cc, 540 + sd * 150, 530, 14); }
    if (ph >= 0 && la >= 0) etiquette(cc, 640, 620, ph >= 1 ? '?' : '…', 1.1, .15);
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
