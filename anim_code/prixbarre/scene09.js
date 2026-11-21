// SCÈNE 09 — Plans 16-17 (TV). s09a : la vitrine se couvre d’affiches : –30 %, –40 %, –70 %, SOLDES, AFFAIRE !
// s09b : le marchand, bras écartés devant ses affiches : « Je ne vends plus des manteaux. Je vends des affaires ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0]]); boutiqueNB(cc, t, { soldes: seg(la, 0, A[1]) }); }
    else { cam(cc, t, [[B[0], 600, 420, 1.12]]); boutiqueNB(cc, t, { soldes: 1, derriere: (c2) => dessine(c2, voix(MARCHAND(t, 620, { face: 1, look: [.3, -.2], sourire: 1.3, handR: [190, -640], poseR: 'ouverte', handL: [-190, -640], poseL: 'ouverte' }), ['s09b'], t)) }); }
  });
  debutFlash(c, t);
}
