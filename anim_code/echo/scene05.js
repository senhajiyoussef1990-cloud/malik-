// SCÈNE 05 — Plans 08-09 (TV). Plusieurs habitants réentendent la phrase en divers points de la vallée : « Chacun croit entendre plusieurs témoins. »
// Une marchande montre les trois côtés d'où vient la voix : « Trois personnes l'ont annoncé ! »
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 405, 1.0], [B[0] + .4, 400, 500, 1.4], [DUREE, 400, 500, 1.4]]);
    valleeNB(cc, t, {});
    ECHOS.forEach(([x, y, txt], k) => echo(cc, 620, 420, x, y, ((t * .5 + k * .33) % 1), txt));
    for (const [x, v] of [[150, 2], [700, 4], [940, 3]]) dessine(cc, figurant(t, x, v, { s: .42, y: 780, face: x < 540 ? 1 : -1, look: [.3, -.6], sourcil: .9, handR: [60, -760], poseR: 'ouverte', chapeau: [COIFFE.casquette, COIFFE.foulard][v % 2] }));
    const Ma = figurant(t, 400, 1, { s: .48, y: 800, face: 1, tablier: 'blanc', chapeau: COIFFE.foulard, look: [.6, -.4] });
    if (lb >= 0) { voix(Ma, ['s05b'], t); const k = Math.floor(seg(lb, 0, B[1]) * 3); Ma.handR = [[-260, -760], [0, -900], [260, -760]][Math.min(2, k)]; Ma.poseR = 'pointe'; Ma.sourcil = 1; }
    dessine(cc, Ma);
  });
  debutFlash(c, t);
}
