// SCÈNE 12 — Plans 22-23 (TV). s12a : une tête de profil : un grand nuage de rêve (cheval, grands espaces) éclipse la petite case « la raison ».
// s12b : devant le miroir du tabac, l’acheteur ne voit plus le paquet, mais l’image de lui-même en cow-boy.
const A = L.s12a, B = L.s12b, DUREE = B[0] + B[1] + .8;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 540, 405, 1.0]]); if (lb < 0) reveRaison(cc, t, seg(la, .2, A[1] * .8)); else miroirReve(cc, t, seg(lb, .2, B[1] * .7)); });
  debutFlash(c, t);
}
