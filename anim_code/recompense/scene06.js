// SCÈNE 06 — Plans 10-11 (TV). Troisième essai : vide ; le joueur reste planté devant la machine. Quatrième essai : un ticket doré… sans utilité.
const A = L.s06a, B = L.s06b, DUREE = B[0] + B[1] + .6;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  enNoirEtBlanc(c, t, (cc) => {
    const la = t - A[0], lb = t - B[0];
    cam(cc, t, [[0, 640, 480, 1.35], [DUREE, 640, 480, 1.35]]);
    feteNB(cc, t, {}); machine(cc, 700, 760, 1.0, t, { clignote: true, tiroir: lb < 0 ? seg(la, .1, .5) : seg(lb, .1, .5), contenu: lb < 0 ? 'vide' : 'or' });
    const J = JOUEUR(t, 470, { look: [.7, .7], sourire: -.3, froncer: .5 }); if (lb >= 0) { J.sourire = 1.2; J.sourcil = 1; J.handR = [200, -700]; J.poseR = 'ouverte'; }
    dessine(cc, J);
  });
  debutFlash(c, t);
}
