// SCÈNE 04 — Plans 06-07 (TV). s04a : la joaillerie est vide, le bijoutier s'ennuie derrière ses vitrines, panneau « SOLDES » ; un passant détourne les yeux.
// s04b : coupe : dans le coffre du diamantaire, des diamants par centaines ; sur la carte, les mines se noircissent une à une : presque toutes à lui.
const A = L.s04a, B = L.s04b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 540, 420, 1.12], [B[0], 540, 410, 1.15]]);
      const Bj = figurant(t, 540, 3, { face: 1, s: .5, y: 790, look: [.2, .6], froncer: .5, habit: (c2, shY) => F(c2, ell(0, shY + 30, 10, 6), GRIS.noir, 0) });
      Bj.tilt += Math.sin(t * 1.4) * .05; Bj.handR = [60, -560]; Bj.poseR = 'poing';
      const Ps = marche(figurant(t, lerp(1150, -150, seg(la, 0, A[1] + .6)), 2, { face: -1, s: .5, y: 790, look: [-.8, 0] }), t, 8);
      bijouterieNB(cc, t, { vide: 1, panneau: 'SOLDES — 50 %', derriere: (c2) => dessine(c2, Bj), devant: (c2) => dessine(c2, Ps) });
    } else { cam(cc, t, [[B[0], 540, 405, 1.0], [DUREE, 520, 380, 1.08]]); coffreNB(cc, t, { mines: seg(lb, .3, B[1]) }); }
  });
  debutFlash(c, t);
}
