// SCÈNE 06 — Plans 10-11 (TV). s06a : Bernays lit l'idée du charcutier « Mangez du BACON » et la raye d'un trait ; il écrit « parler de SANTÉ ».
// s06b : coupe — il frappe à la porte d'un cabinet médical ; le médecin, en blouse, le fait entrer.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) {
      cam(cc, t, [[0, 420, 520, 1.5], [DUREE, 430, 520, 1.55]]);
      const Bn = BERNAYS(t, 560, { face: -1, look: [-.4, .8], chapeau: false, handR: [-140, -540], poseR: 'pointe', sourire: .3 });
      if (la > A[1] * .5) { Bn.look = [.6, .2]; Bn.sourire = 1; Bn.sourcil = .6; }
      const C = CHARCUTIER(t, 230, { face: 1, look: [.8, .3], sourcil: .4 });
      bureauNB(cc, t, { ventes: 0, feuille: [430, 560], rature: seg(la, .5, 1.4), derriere: (c2) => { dessine(c2, C); dessine(c2, Bn, drawVendeur); } });
      if (la > .5 && la < 1.6) { const r = clamp((la - .5) / .9); crayonNB(cc, 346 + 170 * r, 560 - 8 + Math.sin(r * 12) * 6); }
    } else {
      cam(cc, t, [[B[0], 600, 420, 1.15], [DUREE, 560, 420, 1.18]]);
      const D = DOCTEUR(t, 680, { face: -1, look: [-.8, 0], sourire: .6, handL: [-160, -600], poseL: 'ouverte' });
      const Bn = BERNAYS(t, lerp(120, 330, ease(seg(lb, 0, 1.4))), { face: 1, look: [.8, 0], sourire: .8 });
      if (lb < 1.4) marche(Bn, t, 8); else { Bn.chapeau = false; Bn.handR = [130, -620]; Bn.poseR = 'ouverte'; }
      cabinetNB(cc, t, { derriere: (c2) => dessine(c2, D) }); dessine(cc, Bn, drawVendeur);
    }
  });
  debutFlash(c, t);
}
function crayonNB(c, x, y) { c.save(); c.translate(x, y); c.rotate(.7); F(c, poly([[-4, 0], [4, 0], [4, -70], [-4, -70]]), GRIS.clair, 1.5); F(c, poly([[-4, 0], [4, 0], [0, 12]]), GRIS.fonce, 1.2); c.restore(); }
