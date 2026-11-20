// SCÈNE 14 — Plan 23 (TV). « On peut regarder ce qui est mesurable. » Deux boissons, composition et prix lisibles ; la caméra passe de l'une à l'autre.
const A = L.s14a, DUREE = A[0] + A[1] + .8;
function frame(c, t) { c.setTransform(1, 0, 0, 1, 0, 0); enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); deuxBoissons(cc, t, seg(t, A[0] + A[1] * .4, DUREE - .2)); }); debutFlash(c, t); }
