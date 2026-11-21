// SCÈNE 05 — Plans 08-09 (TV). s05a : le quêteur glisse la fleur dans la main d’un voyageur surpris : « Tenez, c’est un cadeau. Pour vous, gratuitement. »
// s05b : le voyageur tient la fleur… et le quêteur tend aussitôt son bol à dons.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 560, 440, 1.15], [DUREE, 560, 440, 1.2]]); aeroportNB(cc, t, { voyageurs: 0, derriere: (c2) => { const don = lb > B[1] * .4; const Q = voix(QUETEUR(t, 420, { face: 1, look: [.6, 0], sourire: 1, handR: [170, -560], poseR: don ? 'ouverte' : 'poing' }), ['s05a'], t); const V = VOYAGEUR(t, 720, { face: -1, look: [-.6, .2], sourcil: .7, handR: [-120, -560], poseR: 'poing', handL: [-60, -420], poseL: 'poing' }); dessine(c2, Q); dessine(c2, V); const hv = mainF(V, 1), hl = mainF(V, -1), hq = mainF(Q, 1); valiseNB(c2, hl[0], hl[1] + 30, .7); const p = lb >= 0 ? hv : [lerp(hq[0], hv[0], seg(la, A[1] * .5, A[1] * .8)), hq[1]]; fleurNB(c2, p[0], p[1] + 20, .6, -.2); if (don) bolDons(c2, hq[0], hq[1] + 10, .9, 3); } }); });
  debutFlash(c, t);
}
