// SCÈNE 10 — Plan 19 (TV). « Un souvenir fort n'est pas une preuve solide. » Deux colonnes : « vu souvent » / « vérifié ».
const A = L.s10a, DUREE = A[0] + A[1] + .7;
function frame(c, t) { c.setTransform(1, 0, 0, 1, 0, 0); enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.05], [DUREE, 540, 405, 1.0]]); deuxColonnes(cc, t, seg(t, A[0] + .2, A[0] + A[1])); }); debutFlash(c, t); }
