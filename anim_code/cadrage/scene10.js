// SCÈNE 10 — Plans 18-19 (TV). Une habitante, chaussures mouillées, désigne prudemment la flaque : « J'aime la fontaine, mais le sol glisse. »
// Un parent tient la main d'un enfant qui rit : « Nous sommes contents d'avoir ce lieu. » — il sourit sans nier la flaque.
const A = L.s10a, B = L.s10b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 820, 480, 1.45], [B[0] - .1, 820, 480, 1.45], [B[0] + .4, 420, 480, 1.45], [DUREE, 420, 480, 1.45]]);
    placeFeteNB(cc, t, { enfants: false, foule: false });
    const H1 = figurant(t, 760, 1, { s: .46, y: 790, face: 1, chapeau: COIFFE.foulard, look: [.6, .6] });
    if (la >= 0) { voix(H1, ['s10a'], t); H1.handR = [180, -480]; H1.poseR = 'pointe'; H1.sourire = .3; H1.froncer = .5; }
    dessine(cc, H1); c.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 3; k++) { cc.fillStyle = 'rgba(255,255,255,.6)'; cc.beginPath(); cc.arc(740 + k * 20, 795 + ((t * 40 + k * 7) % 12), 3, 0, 7); cc.fill(); }   // gouttes des chaussures mouillées
    const Pa = figurant(t, 420, 0, { s: .5, y: 790, face: 1, look: [.6, 0], sourire: 1.1, handR: [110, -380], poseR: 'poing' });
    if (lb >= 0) { voix(Pa, ['s10b'], t); Pa.look = [.9, .3]; }
    dessine(cc, Pa); dessine(cc, enfant(t, 490, 1, { y: 790, face: 1, handL: [-120, -430], poseL: 'poing' }));
  });
  debutFlash(c, t);
}
