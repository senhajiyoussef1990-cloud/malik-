// ÉPISODE 01 — SCÈNE 01 : le renard présente trois boîtes identiques ; le mouton entre et s'approche, intrigué.
// Répliques (renard) : s01a « Tu crois choisir tout seul ? Intéressant… alors regarde bien. »
//                      s01b « Trois possibilités, mon cher. Laquelle te tente ? »
// L = { id: [début, durée] } est injecté par le rendu (calé sur les vraies voix).
const T1 = L.s01a[0], D1 = L.s01a[1], T2 = L.s01b[0], D2 = L.s01b[1];
const DUREE = T2 + D2 + 1.6;
function camera(c, t) {
  // plan large ; rapproché sur le renard pendant s01a ; recadrage sur les trois boîtes pendant s01b ; plan moyen à la fin
  const keys = [[0, 560, 405, 1.0], [T1 + .6, 430, 380, 1.2], [T2 - .2, 480, 420, 1.16], [T2 + D2, 520, 410, 1.08], [DUREE, 540, 405, 1.04]];
  let k = keys[0];
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= b[0]) { k = b; continue; } const u = ease((t - a[0]) / Math.min(1.3, b[0] - a[0])); k = [0, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; break; }
  let [, cx, cy, z] = k; cx = clamp(cx, W / (2 * z), W - W / (2 * z)); cy = clamp(cy, H / (2 * z), H - H / (2 * z));
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
}
function renardPose(t) {
  const tq = step(t), p1 = t >= T1 && t < T1 + D1, p2 = t >= T2 && t < T2 + D2;
  const P = { x: 250, y: 760, s: .6, t: tq, lid: .5, look: [.7, 0], blink: (t % 3.4) < .1 ? 1 : 0, tilt: wob(tq, .35, .035) };
  P.talk = p1 ? bouchePour('s01a', T1, t) : p2 ? bouchePour('s01b', T2, t) : 0;
  P.handL = [-104, -440]; P.handR = [104, -440];
  const l1 = t - T1, l2 = t - T2;
  if (l1 >= 0 && l1 < D1 * .45) {                         // « Tu crois choisir tout seul ? » : index levé, sourcil relevé
    const u = ease(seg(l1, 0, .4)); P.handR = [lerp(104, 150, u), lerp(-440, -760, u) + wob(tq, 2.2, 6 * u)]; P.poseR = 'pointe'; P.sourcil = 1; P.tilt = -.05; P.look = [.9, 0];
  } else if (l1 >= D1 * .45 && t < T2) {                  // « Intéressant… alors regarde bien. » : paupières plus basses, main qui retombe sur le comptoir
    const u = ease(seg(l1, D1 * .45, D1 * .45 + .5)); P.handR = [lerp(150, 200, u), lerp(-760, -560, u)]; P.poseR = 'ouverte'; P.lid = .62; P.sourcil = .4; P.look = [1, .3];
  } else if (l2 >= 0 && l2 < D2 + .8) {                    // « Trois possibilités, mon cher… » : la main survole les trois boîtes
    const u = clamp(l2 / (D2 * .75)), bx = lerp(BOITES[0][0], BOITES[2][0], ease(u));
    P.handR = [lerp(190, 360, ease(u)), -610 + Math.sin(u * Math.PI * 3) * -22]; P.lean = .06 * ease(u); P.poseR = 'ouverte'; P.look = [1, .4];
    if (l2 > D2 * .75) { P.handR = [360, -610]; P.lean = .06; P.look = [1, 0]; P.sourcil = .7; P.lid = .55; }          // « Laquelle te tente ? » : il regarde le mouton
  }
  P.bob = (p1 || p2) ? bnc(tq, .5) * 7 : bnc(tq, .5) * 2.5;
  return P;
}
function moutonPose(t) {
  const tq = step(t), arrivee = 2.4;
  const u = ease(seg(t, 0, arrivee));
  const P = { x: lerp(1180, 830, u), y: 790, s: .56, t: tq, face: -1, look: [-.6, 0], blink: (t % 2.9) < .1 ? 1 : 0, froncer: .5, sourire: .2 };
  P.handL = [-104, -366]; P.handR = [104, -366];
  if (t < arrivee) { P.walk = t * 9; P.bob = Math.abs(Math.sin(t * 9)) * 10; P.tilt = wob(tq, 1.4, .03); return P; }   // il entre en marchant
  P.walk = 0; P.bob = bnc(tq, .25) * 3;
  const l2 = t - T2;
  if (t < T2) { P.look = [-.9, 0]; P.froncer = .7; }                                    // il écoute, méfiant
  else {                                                                                // intrigué : il se penche et se gratte le menton en suivant les boîtes du regard
    const k = ease(seg(l2, 0, .6));
    P.lean = .09 * k; P.handR = [lerp(104, 40, k), lerp(-366, -650, k)]; P.poseR = 'poing'; P.froncer = .2 + .6 * (1 - k);
    P.look = [-1, .5]; P.oreille = .12 * k; P.tilt = .06 * k + wob(tq, .8, .02);
    if (l2 > D2 * .75) { P.look = [-.4, 0]; P.froncer = .1; P.sourire = .4; }         // « Laquelle te tente ? » : il relève la tête
  }
  return P;
}
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H);
  c.save(); camera(c, t);
  boutique(c, t);
  const R = renardPose(t), M = moutonPose(t);
  c.save(); c.translate(0, -R.bob); drawRenard(c, R); c.restore();
  comptoir(c, 150, 720, 560);
  BOITES.forEach(([x, y], k) => boite(c, x, y, .82, t, k));
  c.save(); c.translate(0, -M.bob); drawMouton(c, M); c.restore();
  c.restore();
  pellicule(c, t);
}
