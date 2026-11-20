// SCÈNE 13 — Plan 23 (TV). « Une vraie scène tient rarement dans un seul angle. » La place au complet, activité ordinaire ; travelling d'un bord à l'autre.
const A = L.s13a, DUREE = A[0] + A[1] + .8;
function frame(c, t) { c.setTransform(1, 0, 0, 1, 0, 0); enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 360, 430, 1.4], [DUREE, 720, 430, 1.4]]); placeFeteNB(cc, t, {}); const P = figurant(t, lerp(-60, 1140, seg(t, 0, DUREE)), 3, { s: .42, y: 800, chapeau: COIFFE.casquette }); marche(P, t); dessine(cc, P); }); debutFlash(c, t); }
