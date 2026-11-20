// SCÈNE 05 — Plans 08-09 (TV). Deuxième photographe : l'objectif glisse vers la flaque qui mouille le trottoir → « un problème gênant ».
// Puis la caméra s'élargit pour tout réunir : « Les deux images montrent quelque chose de réel. »
const A = L.s05a, B = L.s05b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0], vise = ease(seg(la, .2, .8)) * (1 - ease(seg(lb, 0, .5)));
    cam(cc, t, [[0, 700, 500, 1.2], [B[0], 700, 500, 1.2], [B[0] + .8, 540, 405, 1.0], [DUREE, 540, 405, 1.0]]);
    placeFeteNB(cc, t, {});
    const P = PHOTOGRAPHE(t, 1000, 1, { y: 800, face: -1, look: [.8, .5] }); dessine(cc, P); appareil(cc, 950, 580, .9, Math.PI + lerp(-.1, -.5, ease(seg(la, .2, .8))));
    viseur(cc, CADRES.flaque, vise);
    if (lb > .4) { const k = clamp((lb - .4) * 2); cadreTrait(cc, CADRES.fete, k, 'photo n°1'); cadreTrait(cc, CADRES.flaque, k, 'photo n°2'); }
  });
  debutFlash(c, t);
}
