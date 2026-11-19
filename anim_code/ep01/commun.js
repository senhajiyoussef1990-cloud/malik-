// Épisode 01 — éléments communs aux scènes de la boutique.
const BOITES = [[350, 560], [470, 560], [590, 560]];

function boite(c, x, y, s, t, k, ouvert = 0, deco = 0) {   // boîte à biscuits décorée ; ouvert 0..1 soulève le couvercle ; deco = mise en valeur
  c.save(); c.translate(x, y); c.scale(s, s);
  const corps = smooth([[-52, 0], [-56, -70], [56, -70], [52, 0]]);
  F(c, ell(0, 0, 54, 12), '#7a1e14', 4);
  F(c, corps, '#b8341c', 5); ombre(c, corps, -50, 0, 56, 0, .35); reflet(c, corps, -30, -40, 10, 26, .2, 0);
  ink(c, 3, '#e0a83a'); c.beginPath(); c.moveTo(-54, -18); c.lineTo(54, -18); c.moveTo(-55, -52); c.lineTo(55, -52); c.stroke();   // filets dorés
  F(c, ell(0, -35, 18, 14), '#f2e0b4', 3); ink(c, 2, '#b8341c'); c.beginPath(); c.arc(0, -35, 8, .4, 2.7); c.stroke();             // médaillon
  for (const sd of [-1, 1]) { c.fillStyle = '#e0a83a'; c.beginPath(); c.arc(sd * 34, -35, 4, 0, 7); c.fill(); }
  if (ouvert > 0) {                                                                                                                    // biscuits identiques visibles
    F(c, ell(0, -70, 52, 11), '#3a1208', 3); for (let q = -2; q <= 2; q++) { F(c, ell(q * 18, -74 + Math.abs(q) * 2, 12, 7), '#e0a85a', 2); ink(c, 1.4, '#a8682a'); c.beginPath(); c.arc(q * 18, -74 + Math.abs(q) * 2, 6, 0, 7); c.stroke(); }
    c.translate(0, -ouvert * 70); c.rotate(-ouvert * .5);
  }
  if (deco > 0) { const g = c.createRadialGradient(0, -60, 10, 0, -60, 170); g.addColorStop(0, `rgba(255,226,150,${.5 * deco})`); g.addColorStop(1, 'rgba(255,226,150,0)'); c.fillStyle = g; c.fillRect(-180, -230, 360, 280); }
  F(c, ell(0, -70, 56, 13), '#c8442a', 4);                                                                                             // couvercle
  F(c, poly([[-58, -84], [58, -84], [56, -70], [-56, -70]]), '#9a2814', 4);
  F(c, ell(0, -84, 58, 13), '#d4553a', 4); reflet(c, ell(0, -84, 58, 13), -18, -88, 26, 5, .25, 0);
  F(c, ell(0, -92, 12, 7), '#e0a83a', 3);                                                                                              // bouton du couvercle
  // nœud de ruban
  F(c, smooth([[0, -86], [-26, -100], [-24, -78]]), '#f2e0b4', 2.5); F(c, smooth([[0, -86], [26, -100], [24, -78]]), '#f2e0b4', 2.5);
  c.restore();
}

const AUDIO = Object.keys(L).map(id => [id, L[id][0]]);
const FIN = (extra = 1.4) => Math.max(...Object.values(L).map(l => l[0] + l[1])) + extra;
const POS = { renard: [250, 760, .6], mouton: [830, 790, .56] };
function renardBase(t) { const tq = step(t); return { x: POS.renard[0], y: POS.renard[1], s: POS.renard[2], t: tq, lid: .5, look: [.7, 0], blink: (t % 3.4) < .1 ? 1 : 0, tilt: wob(tq, .35, .035), handL: [-104, -440], handR: [104, -440], bob: bnc(tq, .5) * 2.5 }; }
function moutonBase(t) { const tq = step(t); return { x: POS.mouton[0], y: POS.mouton[1], s: POS.mouton[2], t: tq, face: -1, look: [-.7, 0], blink: (t % 2.9) < .1 ? 1 : 0, froncer: .5, sourire: .2, handL: [-104, -366], handR: [104, -366], bob: bnc(tq, .25) * 3 }; }
function voix(P, ids, t) { for (const id of ids) if (parle(id, t)) { P.talk = bouchePour(id, L[id][0], t); P.bob = Math.max(P.bob, bnc(step(t), .5) * 7); } return P; }
function dessineBoutique(c, t, R, M, extra) {
  boutique(c, t);
  if (R) { c.save(); c.translate(0, -R.bob); drawRenard(c, R); c.restore(); }
  comptoir(c, 150, 720, 560);
  if (extra) extra(c);
  if (M) { c.save(); c.translate(0, -M.bob); drawMouton(c, M); c.restore(); }
}
