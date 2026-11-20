// SCÈNE 05 — Plans 08-09 (TV). s05a : gros plan sur le speaker, la main sur l'oreille, voix d'alerte : « Nous interrompons notre programme : une explosion est signalée sur Mars ! »
// s05b : le bruiteur s'active : il dévisse lentement un couvercle de casserole (le « cylindre » qui s'ouvre), froisse une tôle ; une actrice crie dans un micro ; des sirènes enregistrées.
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 600, 380, 1.45], [B[0], 600, 380, 1.55]]); const S = voix(SPEAKER(t, 600, { look: [.4, .3], froncer: .8, sourcil: 1, handL: [-30, -730], poseL: 'ouverte' }), ['s05a'], t); studio38NB(cc, t, { micros: [700], derriere: (c2) => dessine(c2, S) }); }
    else {
      cam(cc, t, [[B[0], 300, 470, 1.3], [DUREE, 360, 460, 1.2]]);
      const Br = BRUITEUR(t, 220, { look: [.4, .6], handL: [40, -520], handR: [140, -520], poseL: 'poing', poseR: 'poing' }), Act = figurant(t, 560, 1, { s: .46, y: 790, face: 1, look: [.5, -.2], sourcil: 1, talk: Math.abs(Math.sin(t * 14)) });
      studio38NB(cc, t, { micros: [660], derriere: (c2) => { dessine(c2, Br); dessine(c2, Act); } });
      const r = seg(lb, 0, B[1]); cc.save(); cc.translate(260, 548); cc.rotate(r * 6); F(cc, ell(0, 0, 34, 10), GRIS.clair, 2); F(cc, ell(0, -4, 6, 4), GRIS.noir, 0); cc.restore();
      for (let k = 0; k < 3; k++) { const u = (lb * 1.4 + k / 3) % 1; ink(cc, 4, `rgba(0,0,0,${.6 * (1 - u)})`); cc.beginPath(); cc.arc(660, 380, 30 + u * 160, -2.6, -.5); cc.stroke(); }
    }
  });
  debutFlash(c, t);
}
