// SCÈNE 06 — Plans 10-11 (TV). La voisine chuchote au boulanger en pointant l'entrepôt : « On dit qu'il y a du danger là-bas. »
// Le boulanger avertit les clients sous l'enseigne : « Le bruit devient une histoire plus inquiétante. »
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const tq = step(t), la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 340, 440, 1.6], [B[0], 360, 440, 1.3], [DUREE, 380, 440, 1.25]]);
    placeNB(cc, t, { nuit: .2 });
    const Bo = BOULANGER(t, 300, { face: 1, look: [.9, 0] });
    const Vo = VOISINE(t, 420, { face: -1, look: [.9, 0], lean: .08 });
    if (la >= 0 && lb < 0) { voix(Vo, ['s06a'], t); Vo.talk *= .6; Vo.handL = [-60, -640]; Vo.poseL = 'ouverte'; Vo.handR = [-200, -620]; Vo.poseR = 'pointe'; Bo.sourcil = 1; Bo.lid = .1; Bo.look = [.9, -.1]; Bo.froncer = 1; }
    if (lb >= 0) { Vo.x = 470; Bo.x = 280; Bo.face = 1; Bo.handR = [150, -700]; Bo.poseR = 'ouverte'; Bo.handL = [-150, -700]; Bo.poseL = 'ouverte'; Bo.talk = .3 * Math.abs(Math.sin(t * 10)); Bo.look = [.6, 0]; Bo.sourcil = 1; }
    dessine(cc, Bo); dessine(cc, Vo);
    if (lb >= 0) for (let k = 0; k < 3; k++) { const P = figurant(t, 100 + k * 70 - (k === 1 ? 0 : 0), k + 2, { s: .44, y: 790, face: 1, look: [hash(k + Math.floor(t * 1.5)) > .5 ? .9 : -.9, 0], sourire: -.4, froncer: .8 }); P.chapeau = k === 1 ? COIFFE.foulard : COIFFE.casquette; dessine(cc, P); }   // les clients échangent des regards
  });
  debutFlash(c, t);
}
