// SCÈNE 08 — Plans 13-14 (salon). Le dessin du monstre, placardé sur le mur du village, passe à l'écran. Le mouton : « Personne n'a vu ce monstre ! »
// Le renard trace trois colonnes à la craie : VU / ENTENDU / SUPPOSÉ.
const A = L.s08a, B = L.s08b, DUREE = B[0] + B[1] + .8;
const [AX, AY] = ARDOISE;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), R = voix(renardBase(t), ['s08b'], t), M = voix(moutonBase(t), ['s08a'], t), la = t - A[0], lb = t - B[0], u = seg(lb, 0, B[1]);
  M.x = 560; M.look = [-1, .2];
  if (la >= 0) { M.handR = [200, -620]; M.poseR = 'pointe'; M.froncer = .9; M.sourire = -.2; M.oreille = .2; if (lb >= 0) { M.handR = [104, -366]; M.poseR = 'repos'; M.look = [-1, -.3]; M.froncer = .3; } }
  R.x = 330; R.look = [-.8, .1];
  if (lb >= 0) { const col = Math.min(2, Math.floor(u * 3)); R.handL = [-260 + col * 40, -720 + (u * 3 % 1) * 90]; R.poseL = 'pointe'; R.look = [-1, -.3]; R.lean = -.04; }
  c.save(); cam(c, t, [[0, 330, 450, 1.5], [A[0] + A[1], 330, 440, 1.5], [B[0], 300, 340, 1.5], [DUREE, 320, 350, 1.45]]);
  dessineSalon(c, t, R, M, { tv: 1, ecran: (cc, tt) => { placeNB(cc, tt, { affiche: true }); }, derriere: (cc) => {
    ['VU', 'ENTENDU', 'SUPPOSÉ'].forEach((m, k) => { const x = AX + 28 + k * 52; texteCraie(cc, m, x, AY + 34, clamp(u * 3 - k), k === 1 ? 11 : 13); craie(cc, [[x + 26, AY + 14], [x + 26, AY + 196]], clamp(u * 3 - k) * (k < 2), 2); });
    craie(cc, [[AX + 10, AY + 44], [AX + 150, AY + 44]], clamp(u * 3), 2);
  } });
  c.restore();
}
