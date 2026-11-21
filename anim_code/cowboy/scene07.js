// SCÈNE 07 — Plans 12-13 (TV + héros). s07a : à l’agence, le publicitaire au tableau : « LE FILTRE ? — trop féminin… — il nous faut : — un COW-BOY ! » : « Il nous faut le symbole le plus viril d’Amérique. Un cow-boy ! »
// s07b : le mouton (en couleur), interloqué : « Ils ont pris une cigarette pour femmes… et l’ont donnée à un cow-boy ? »
const A = L.s07a, B = L.s07b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const la = t - A[0], lb = t - B[0];
  if (lb < 0) enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 640, 400, 1.15], [B[0], 680, 390, 1.2]]); const P = voix(PUBLICITAIRE(t, 560, { face: 1, look: [.7, -.4], sourire: 1, handR: [180, -760], poseR: 'pointe' }), ['s07a'], t); agenceNB(cc, t, { lignes: 1 + Math.floor(seg(la, 0, A[1]) * 3.99), derriere: (c2) => dessine(c2, P, drawVendeur) }); });
  else { const [R, M] = herosTV(t, 200, 400); voix(M, ['s07b'], t); R.look = [.9, 0]; M.look = [-.8, -.2]; M.face = -1; M.handR = [150, -600]; M.poseR = 'ouverte'; M.sourcil = 1; M.froncer = .5; R.sourire = .6; nbEtCouleur(c, t, [[B[0], 600, 400, 1.12]], (cc) => agenceNB(cc, t, {}), (cc) => heros(cc, R, M)); }
  debutFlash(c, t);
}
