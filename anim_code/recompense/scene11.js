// SCÈNE 11 — Plans 20-21 (TV). Le joueur inscrit une limite de temps et de jetons dans un carnet : « Une règle décidée avant peut aider. »
// Il s'éloigne alors que la machine clignote encore : « La lumière clignote. Il garde son choix. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 520, 460, 1.25], [DUREE, 480, 440, 1.1]]);
    feteNB(cc, t, {}); machine(cc, 800, 760, .95, t, { clignote: true });
    const J = JOUEUR(t, lb >= 0 ? lerp(540, 120, ease(seg(lb, .2, B[1] + .4))) : 540, { face: lb >= 0 ? -1 : 1, look: [.2, .7] });
    if (la >= 0 && lb < 0) { J.handL = [-60, -520]; J.handR = [40 + Math.sin(t * 14) * 6, -540]; J.poseL = 'ouverte'; J.poseR = 'poing'; }
    if (lb >= 0) { marche(J, t); J.look = [.8, 0]; J.sourire = .8; }
    dessine(cc, J);
    if (la >= 0 && lb < 0) { const [hx, hy] = mainF(J, -1); cc.save(); cc.translate(hx + 30, hy - 20); F(cc, poly([[-46, -30], [46, -30], [46, 30], [-46, 30]]), GRIS.blanc, 2); cc.font = 'italic 12px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('max 5 jetons', 0, -6); cc.fillText('20 minutes', 0, 14); cc.restore(); }
  });
  debutFlash(c, t);
}
