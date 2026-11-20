// SCÈNE 09 — Plans 16-17 (TV + héros). Dans un coin calme, le mouton demande au joueur : « Tu t'amuses toujours, ou tu attends le prochain ? »
// Le joueur regarde sa poignée de jetons presque vide : « Je crois que j'attends surtout la surprise. »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 180, 420); voix(M, ['s09a'], t); M.face = 1; M.look = [.9, 0]; R.look = [.9, 0]; M.handR = [150, -520]; M.poseR = 'ouverte';
  nbEtCouleur(c, t, [[0, 520, 460, 1.2]], (cc) => {
    feteNB(cc, t, {}); machine(cc, 960, 760, .8, t, { clignote: true });
    const J = JOUEUR(t, 680, { face: -1, look: [.8, 0] }); if (lb >= 0) { voix(J, ['s09b'], t); J.look = [0, .9]; J.handR = [120, -480]; J.poseR = 'ouverte'; J.sourire = -.2; } dessine(cc, J);
    if (lb >= 0) { const [hx, hy] = mainF(J, 1); jetons(cc, hx - 10, hy - 10, 2); }
  }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
