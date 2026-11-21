// SCÈNE 09 — Plans 16-17 (TV). s09a : l’affiche « L’HOMME LIBRE » : le cow-boy à cheval dans les grands espaces.
// s09b : au tabac, un petit employé en costume serre son paquet et se voit en cow-boy dans le miroir : « Avec celle-là, je me sens comme lui. Libre ! »
const A = L.s09a, B = L.s09b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => {
    if (lb < 0) { cam(cc, t, [[0, 540, 405, 1.0], [B[0], 540, 380, 1.1]]); afficheLibre(cc, t, seg(la, 0, A[1])); }
    else { cam(cc, t, [[B[0], 540, 405, 1.0]]); miroirReve(cc, t, seg(lb, .2, B[1] * .7)); }
  });
  debutFlash(c, t);
}
