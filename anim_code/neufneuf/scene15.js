// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton : « Alors je dois arrondir tous les prix dans ma tête ? » ; s15b : le renard : « Au moins pour les grosses dépenses. Arrondis toujours au-dessus. »
// s15c : au carnet : « Combien ça coûte vraiment, si j’arrondis ? » ; s15d : « Voilà. Le premier chiffre n’est pas le seul qui compte. » — le mouton corrige l’étiquette du grille-pain : « ≈ 10 € » ; clin d’œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.look = [-.6, 0]; M.sourcil = .7;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -660]; R.poseR = 'pointe'; R.sourire = .6; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  if (ld >= 0) { M.sourire = 1; M.look = [-.6, .6]; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .6 && ld < D[1] * .6 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 440, 1.22]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { tablePetitDej(cc, { tasse: 1, grillepain: ld >= 0 ? 0 : 1, t }); if (ld >= 0) { grillePain(cc, TABLE[0] - 40, TABLE[1] - 177, .55, 0); cc.save(); cc.translate(TABLE[0] + 40, TABLE[1] - 188); cc.rotate(.2); F(cc, poly([[-26, -12], [26, -12], [34, 0], [26, 12], [-26, 12]]), '#fff1c0', 2); cc.font = 'bold 13px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#1a6a2a'; cc.fillText('≈ 10 €', 2, 5); cc.restore(); } } }, (cc) => {
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['combien ça', clamp(u * 3)], ['coûte', clamp(u * 3 - .6)], ['vraiment ?', clamp(u * 3 - 1.4)], ['9,99 ≈ 10 !', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
