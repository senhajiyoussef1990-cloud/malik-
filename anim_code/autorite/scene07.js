// SCÈNE 07 — Plans 12-13 (TV + héros). L'orateur brandit une boisson censée améliorer la mémoire. Le mouton, au bord de la scène : « Sur quelles mesures repose sa promesse ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const tq = step(t), la = t - A[0], lb = t - B[0];
  const [R, M] = herosTV(t, 160, 900); voix(M, ['s07b'], t); M.y = 830; R.y = 830; M.look = [-.6, -.5]; R.look = [.6, -.5];
  if (lb >= 0) { M.lean = .08; M.handR = [200, -560]; M.poseR = 'ouverte'; M.froncer = .5; }
  nbEtCouleur(c, t, [[0, 540, 420, 1.05]], (cc) => {
    auditoriumNB(cc, t, { rideau: 1, diplome: 1, pupitre: 1, dossiers: 8, spot: 1 });
    const O = ORATEUR(t, 540, { face: 1, look: [0, .2], sourire: 1.2, habit: habitBlouse, chapeau: LUNETTES(true), handR: [160, -820], poseR: 'poing' });
    if (la >= 0 && lb < 0) { O.talk = .3 * Math.abs(Math.sin(t * 9)); O.handL = [-160, -700]; O.poseL = 'ouverte'; }
    dessine(cc, O); const [hx, hy] = mainF(O, 1); bouteilleMemoire(cc, hx, hy + 20, .6);
  }, (cc) => { heros(cc, R, M); lunettesMouton(cc, M); });
  debutFlash(c, t);
}
