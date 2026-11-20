// SCÈNE 07 — Plans 12-13 (TV + héros). Le mouton observe l'alternance vide, surprise, vide… sur un tableau : « Impossible de prévoir le prochain résultat. »
// Le renard montre l'horloge de la foire et les jetons accumulés : « L'incertitude peut prolonger le jeu. »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 200, 880); voix(R, ['s07b'], t); voix(M, ['s07a'], t); M.look = [-.5, -.3]; M.froncer = .6;
  if (lb >= 0) { R.handR = [200, -820]; R.poseR = 'pointe'; R.look = [.4, -.6]; }
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { tableauEssais(cc, t, seg(la, 0, A[1] + .4)); if (lb >= 0) { F(cc, ell(380, 100, 50, 50), GRIS.blanc, 4); ink(cc, 3); cc.beginPath(); cc.moveTo(380, 100); cc.lineTo(380 + Math.sin(t * 4) * 34, 100 - Math.cos(t * 4) * 34); cc.stroke(); jetons(cc, 640, 700, 12); } }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
