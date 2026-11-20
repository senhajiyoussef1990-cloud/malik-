// SCÈNE 10 — Plans 18-19. Le mécanisme en coupe : « La récompense n'arrive pas à chaque essai. »
// Le renard compare un jeu choisi librement et l'attente automatique du prochain tirage : « Le plaisir compte. La perte de contrôle aussi. »
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); coupeMachine(cc, t); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 540, 880); voix(R, ['s10b'], t); R.handL = [-200, -620]; R.handR = [200, -620]; R.poseL = R.poseR = 'ouverte'; R.look = [Math.sin(t * 2) * .9, 0]; M.look = [-.8, 0];
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { feteNB(cc, t, { manege: 220 }); machine(cc, 860, 760, .8, t, { clignote: true }); cc.font = 'bold 24px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.blanc; cc.fillText('jeu choisi', 220, 140); cc.fillText('attente du prochain tirage', 860, 360); }, (cc) => heros(cc, R, M));
  debutFlash(c, t);
}
