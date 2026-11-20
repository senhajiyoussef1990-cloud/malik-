// SCÈNE 15 — Plans 26-29 (salon). s15a : le mouton reprend l'affiche et la regarde autrement : « Alors quand une publicité me parle de liberté… »
// s15b : « Demande-toi qui la paie, et ce qu'elle vend vraiment. » ; s15c : les deux questions s'écrivent au carnet ;
// s15d : « Voilà. Un symbole ne remplace pas le produit. » — le mouton retourne l'affiche face au mur… on lit au dos « payé par TABACS DE LUXE & Cie » ; clin d'œil du renard.
const A = L.s15a, B = L.s15b, C = L.s15c, D = L.s15d, DUREE = D[0] + D[1] + .9;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s15b', 's15d'], t), M = voix(moutonBase(t), ['s15a', 's15c'], t);
  const la = t - A[0], lb = t - B[0], lc = t - C[0], ld = t - D[0];
  M.x = 718; M.handL = [-170, -420]; M.handR = [40, -420]; M.poseL = M.poseR = 'poing'; M.look = [-.3, .3]; M.froncer = .4;
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0 && lc < 0) { R.handR = [200, -560]; R.poseR = 'ouverte'; R.sourire = .6; M.look = [-.9, 0]; }
  const u = seg(lc, 0, C[1]);
  if (lc >= 0 && ld < 0) { M.look = [-.3, -.4]; M.froncer = 0; R.look = [.6, .6]; R.handL = [-120, -500]; R.poseL = 'poing'; }
  const tourne = ld >= 0 ? ease(seg(ld, .2, 1)) : 0;
  if (ld >= 0) { M.sourire = 1; M.look = [-.6, .1]; R.look = [1, 0]; R.sourire = 1.1; R.wink = (ld > D[1] * .55 && ld < D[1] * .55 + .4) ? 1 : 0; }
  c.save(); cam(c, t, [[0, 560, 440, 1.3], [C[0], 520, 420, 1.26], [DUREE, 540, 430, 1.24]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => tablePetitDej(cc, { tasse: 1, journaux: 1, t }) }, (cc) => {
    const a = mainScene(M, -1), b = mainScene(M, 1), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2 - 10;
    if (tourne < .5) { cc.save(); cc.translate(x, y); cc.scale(Math.cos(tourne * Math.PI) || .01, 1); afficheLiberte(cc, 0, 20, .55, 0, t); cc.restore(); }
    else { cc.save(); cc.translate(x, y); cc.scale(-Math.cos(tourne * Math.PI), 1); cc.translate(0, 20); cc.scale(.9, .9); F(cc, poly([[-68, -99], [68, -99], [68, 99], [-68, 99]]), '#efe6d0', 3); cc.font = 'italic bold 15px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#5a3a1a'; cc.fillText('payé par', 0, -10); cc.font = 'bold 16px Georgia'; cc.fillText('TABACS DE LUXE', 0, 14); cc.fillText('& Cie', 0, 34); cc.restore(); }
    if (lc >= 0) { const r = mainScene(R, -1); carnet(cc, r[0] + 40, r[1] + 40, .6, [['qui a', clamp(u * 3)], ['organisé ?', clamp(u * 3 - .6)], ['qui en', clamp(u * 3 - 1.4)], ['profite ?', clamp(u * 3 - 2)]], 1, -.04); }
  });
  c.restore();
}
