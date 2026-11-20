// SCÈNE 02 — Plans 03-04 (salon). Le mouton vide les biscuits sur la table et les compte du doigt : « Douze… Avant, il y en avait quinze ! » ; à côté, l'ancien paquet trouvé dans le buffet.
// Le renard sourit et se tourne vers le poste : « Bienvenue dans la réduflation. Allons voir comment ça marche. »
const A = L.s02a, B = L.s02b, DUREE = B[0] + B[1] + .5;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const R = voix(renardBase(t), ['s02b'], t), M = voix(moutonBase(t), ['s02a'], t), la = t - A[0], lb = t - B[0];
  M.x = 718; M.look = [-.6, .7]; M.froncer = .3;
  const compte = Math.min(12, Math.floor(seg(la, 0, A[1] * .6) * 12));
  if (la >= 0 && lb < 0) { M.handL = [-160 + (compte % 6) * 10, -460]; M.poseL = 'pointe'; if (la > A[1] * .6) { M.look = [-.8, 0]; M.sourcil = 1; M.froncer = .8; M.handL = [-130, -620]; M.poseL = 'ouverte'; } }
  R.x = 345; R.look = [.9, .1];
  if (lb >= 0) { const k = ease(seg(lb, .1, .6)); R.look = [lerp(.9, -1, k), -.1]; R.handL = [lerp(-104, -260, k), lerp(-440, -620, k)]; R.poseL = 'ouverte'; R.sourire = .7; M.look = [-1, -.1]; }
  c.save(); cam(c, t, [[0, 560, 450, 1.32], [B[0], 470, 430, 1.28]]);
  dessineSalon(c, t, R, M, { derriere: (cc) => { tablePetitDej(cc, { tasse: 1, biscuits: 12, t }); paquetBiscuits(cc, 590, 560, .24, { n: 0, rot: .1 }); paquetBiscuits(cc, 960, 470, .3, { n: 15, rot: -.05 }); cc.font = 'bold 14px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff2b0'; cc.fillText('l’ancien', 960, 420); } }, (cc) => { if (la >= 0 && lb < 0 && compte > 0) { cc.font = 'bold 30px Georgia'; cc.textAlign = 'center'; cc.fillStyle = '#fff2b0'; cc.strokeStyle = '#3a1a0a'; cc.lineWidth = 5; cc.strokeText(String(compte), 520, 540); cc.fillText(String(compte), 520, 540); } });
  c.restore();
}
