// Personnages humains du téléviseur (dessin animé années 30, noir et blanc) + décors N&B + effet vieux film.
// Origine = au sol, entre les pieds. Hauteur ~ 900 unités.
const GRIS = { blanc: '#f4f2ec', clair: '#d6d2c8', moyen: '#a8a49a', fonce: '#5a5650', noir: '#1c1a18', peau: '#ece6da' };

function gant(c, x, y, ang, s, pose) {                  // gant blanc à 4 doigts, style 1930
  main(c, x, y, ang, s, GRIS.blanc, false, pose || 'repos', 1);
}
function souliers(c, x, y, dir, s = 1) {
  c.save(); c.translate(x, y); c.scale(dir * s, s);
  const p = smooth([[-30, 0], [-26, -26], [10, -32], [46, -22], [58, -6], [52, 6], [-28, 8]]);
  F(c, p, GRIS.noir, 4); c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(26, -20, 13, 5, -.2, 0, 7); c.fill();
  F(c, poly([[-30, 2], [56, 2], [52, 10], [-28, 10]]), '#3a3834', 2); ink(c, 1.6, 'rgba(255,255,255,.6)'); for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-4 + k * 8, -28); c.lineTo(4 + k * 8, -20); c.stroke(); }
  ink(c, 1.2, 'rgba(255,255,255,.35)'); c.setLineDash([3, 3]); c.beginPath(); c.moveTo(-26, -4); c.quadraticCurveTo(10, -10, 50, -6); c.stroke(); c.setLineDash([]);
  c.restore();
}
function jambeHumain(c, hip, foot, w, col, sd, ph) {
  const knee = [lerp(hip[0], foot[0], .5) + ph * 16, lerp(hip[1], foot[1], .5)];
  const tr = (ww, cc) => { c.lineCap = 'round'; c.strokeStyle = cc; c.lineWidth = ww; c.beginPath(); c.moveTo(...hip); c.quadraticCurveTo(knee[0], knee[1], ...foot); c.stroke(); };
  tr(w + 8, INK); tr(w, col); c.save(); c.translate(sd * w * .28, 0); tr(w * .3, 'rgba(0,0,0,.2)'); c.restore();
  c.save(); c.translate(-sd * w * .22, 0); tr(w * .1, 'rgba(255,255,255,.18)'); c.restore();
  ink(c, 1.6, 'rgba(0,0,0,.35)'); c.beginPath(); c.moveTo(hip[0], hip[1] + 20); c.quadraticCurveTo(knee[0], knee[1], foot[0], foot[1] - 20); c.stroke();     // pli central
  for (let k = -1; k <= 1; k++) { c.beginPath(); c.moveTo(knee[0] - w * .4, knee[1] + k * 12); c.quadraticCurveTo(knee[0], knee[1] + k * 12 + 6, knee[0] + w * .4, knee[1] + k * 12); c.stroke(); }   // plis au genou
  F(c, poly([[foot[0] - w * .55, foot[1] - 8], [foot[0] + w * .55, foot[1] - 8], [foot[0] + w * .55, foot[1] + 6], [foot[0] - w * .55, foot[1] + 6]]), col, 3);   // revers
}
function teteHumain(c, P, hy, opts) {
  const lk = P.look || [0, 0];
  for (const sd of [-1, 1]) {                                                                            // oreilles avec pavillon
    const o = ell(sd * 54, hy + 4, 13, 20); F(c, o, GRIS.peau, 4); ombre(c, o, sd * 54, hy - 16, sd * 54, hy + 24, .3);
    ink(c, 2.2, 'rgba(0,0,0,.5)'); c.beginPath(); c.arc(sd * 54, hy + 4, 7, sd > 0 ? 1.8 : -1.3, sd > 0 ? 4.6 : 1.3); c.stroke();
  }
  const v = smooth([[-50, hy - 40], [0, hy - 62], [50, hy - 40], [57, hy + 8], [48, hy + 46], [26, hy + 66], [0, hy + 72], [-26, hy + 66], [-48, hy + 46], [-57, hy + 8]]);
  F(c, v, GRIS.peau, 5); ombre(c, v, -30, hy - 20, 57, hy + 40, .26); reflet(c, v, -24, hy - 30, 18, 10, .3);
  c.save(); c.clip(v); const g = c.createLinearGradient(0, hy + 30, 0, hy + 72); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.14)'); c.fillStyle = g; c.fillRect(-60, hy + 30, 120, 50); c.restore();   // ombre sous le menton
  if (opts.barbe) { c.fillStyle = 'rgba(70,66,60,.38)'; for (let k = 0; k < 70; k++) { const a = .15 + hash(k) * 2.85, r = .55 + hash(k + 7) * .4; c.beginPath(); c.arc(Math.cos(a) * 46 * r, hy + 24 + Math.sin(a) * 38 * r, 1.3, 0, 7); c.fill(); } }
  ink(c, 1.8, 'rgba(0,0,0,.35)');                                                                       // rides d'expression
  for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(sd * 30, hy + 26); c.quadraticCurveTo(sd * 36, hy + 40, sd * 30, hy + 52); c.stroke(); }
  if (opts.age) { for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(-22, hy - 44 + k * 7); c.quadraticCurveTo(0, hy - 48 + k * 7, 22, hy - 44 + k * 7); c.stroke(); } }
  for (const sd of [-1, 1]) {                                                                              // yeux « pie-cut » + paupières + cils
    const ex = sd * 18, ey = hy - 10;
    if (P.blink) { ink(c, 4); c.beginPath(); c.moveTo(ex - 12, ey + 2); c.quadraticCurveTo(ex, ey + 9, ex + 12, ey + 2); c.stroke(); }
    else {
      F(c, ell(ex, ey, 12, 17), '#ffffff', 3.5);
      const px = ex + lk[0] * 4, py = ey + 3 + lk[1] * 4;
      c.save(); c.clip(ell(ex, ey, 12, 17)); F(c, ell(px, py, 7, 11), GRIS.noir, 0);
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(px, py); c.arc(px, py, 12, -1.45, -.85); c.closePath(); c.fill();
      c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(ex - 14, ey - 18, 28, 7); c.restore();
      ink(c, 2, 'rgba(0,0,0,.45)'); c.beginPath(); c.moveTo(ex - 10, ey + 19); c.quadraticCurveTo(ex, ey + 22, ex + 10, ey + 19); c.stroke();   // poche sous l'œil
      if (opts.cils) { ink(c, 2.4); for (let k = 0; k < 3; k++) { const a = -2.3 + k * .4; c.beginPath(); c.moveTo(ex + Math.cos(a) * 12 * sd, ey + Math.sin(a) * 17); c.lineTo(ex + Math.cos(a) * 19 * sd, ey + Math.sin(a) * 24); c.stroke(); } }
    }
    const sc = P.sourcil || 0;
    F(c, smooth([[ex - sd * 14, ey - 21 - sc * 3], [ex, ey - 29 - sc * 6], [ex + sd * 14, ey - 23 + (opts.mechant ? 5 : 0)], [ex + sd * 12, ey - 19 + (opts.mechant ? 5 : 0)], [ex, ey - 25 - sc * 6], [ex - sd * 12, ey - 18 - sc * 3]]), opts.blond ? GRIS.moyen : GRIS.noir, 1.5);
  }
  const nez = ell(4 + lk[0] * 3, hy + 14, 15, 12); F(c, nez, GRIS.peau, 4); ombre(c, nez, 0, hy + 4, 18, hy + 24, .3); reflet(c, nez, -1, hy + 9, 5, 3, .7);  // gros nez rond
  c.fillStyle = 'rgba(0,0,0,.4)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(4 + sd * 6, hy + 22, 2.4, 1.6, 0, 0, 7); c.fill(); }
  if (opts.moustache) { const mo = smooth([[-28, hy + 32], [-8, hy + 27], [4, hy + 31], [16, hy + 27], [36, hy + 32], [16, hy + 38], [-6, hy + 38]]); F(c, mo, GRIS.noir, 2); ink(c, 1, 'rgba(255,255,255,.3)'); c.beginPath(); c.moveTo(-18, hy + 31); c.lineTo(-4, hy + 30); c.moveTo(10, hy + 30); c.lineTo(26, hy + 31); c.stroke(); }
  if (opts.rouge) { c.fillStyle = 'rgba(0,0,0,.12)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 34, hy + 30, 10, 6, 0, 0, 7); c.fill(); } }
  const o = P.talk || 0, my = hy + 47;
  if (o < .06) { ink(c, 4); c.beginPath(); c.moveTo(-16, my - 2); c.quadraticCurveTo(2, my + 10 * (P.sourire ?? 1), 20, my - 4); c.stroke(); ink(c, 2); c.beginPath(); c.moveTo(-18, my - 4); c.lineTo(-14, my); c.moveTo(22, my - 6); c.lineTo(18, my - 2); c.stroke(); }
  else { const h = 6 + o * 22; const b = new Path2D(); b.moveTo(-17, my - 2); b.quadraticCurveTo(2, my + 4, 21, my - 4); b.quadraticCurveTo(10, my + h, 2, my + h); b.quadraticCurveTo(-8, my + h, -17, my - 2); b.closePath();
    F(c, b, GRIS.noir, 3.5); c.save(); c.clip(b); c.fillStyle = GRIS.moyen; c.beginPath(); c.ellipse(2, my + h, 10, h * .4, 0, 0, 7); c.fill(); c.fillStyle = '#fff'; c.fillRect(-14, my - 4, 32, 5); c.restore(); }
  ink(c, 2, 'rgba(0,0,0,.4)'); c.beginPath(); c.moveTo(-8, my + 16); c.quadraticCurveTo(2, my + 20, 12, my + 16); c.stroke();          // fossette du menton
}
function bras(c, sh, hand, bend, col, pose, w = 30) {
  const a = Math.atan2(hand[1] - sh[1], hand[0] - sh[0]), E = [hand[0] - Math.cos(a) * 18, hand[1] - Math.sin(a) * 18];
  gant(c, E[0] + Math.cos(a) * 2, E[1] + Math.sin(a) * 2, a - Math.PI / 2, 1, pose);
  tube(c, sh, E, bend, w, col);
  F(c, ell(E[0], E[1], w * .55, 9, a + Math.PI / 2), GRIS.blanc, 3);                                          // manchette blanche
}

// ---------- LE VENDEUR : cheveux gominés, fine moustache, costume rayé, nœud papillon
function drawVendeur(c, P) {
  const s = P.s || 1; c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -420, shY = -640, hy = -748;
  for (const sd of [-1, 1]) { const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0;
    const hip = [sd * 28, hipY], foot = [sd * 40 + ph * 50, -30 - Math.max(0, ph) * 18];
    jambeHumain(c, hip, foot, 48, GRIS.fonce, sd, ph); souliers(c, foot[0] + sd * 4, foot[1] + 30, sd > 0 ? 1 : -1, 1.05); }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  const hL = P.handL || [-96, -400], hR = P.handR || [96, -400], sL = [-76, shY + 24], sR = [76, shY + 24];
  bras(c, sL, hL, 12, GRIS.fonce, P.poseL);
  const v = smooth([[-80, shY], [-40, shY - 12], [40, shY - 12], [80, shY], [70, -470], [78, -400], [0, -384], [-78, -400], [-70, -470]]);
  F(c, v, GRIS.fonce, 5); rayures(c, v, '#7a766e', 14); ombre(c, v, -40, shY, 80, -400, .3); reflet(c, v, -44, shY + 60, 20, 80, .08, .1); ink(c, 5); c.stroke(v);
  F(c, poly([[-30, shY - 12], [30, shY - 12], [0, shY + 90]]), GRIS.blanc, 4);
  ink(c, 1.4, 'rgba(0,0,0,.25)'); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(-26 + k * 4, shY - 6 + k * 18); c.lineTo(26 - k * 4, shY - 6 + k * 18); c.stroke(); }     // plis du plastron
  for (const sd of [-1, 1]) { const rv = poly([[sd * 30, shY - 10], [sd * 52, shY], [sd * 24, -470], [sd * 10, shY + 70]]); F(c, rv, '#3e3b36', 4); ink(c, 1.4, 'rgba(255,255,255,.3)'); c.setLineDash([3, 3]); c.beginPath(); c.moveTo(sd * 32, shY); c.lineTo(sd * 20, -480); c.stroke(); c.setLineDash([]);
    const pk = poly([[sd * 26, -470], [sd * 64, -472], [sd * 64, -456], [sd * 26, -454]]); F(c, pk, '#3e3b36', 2.5); }
  F(c, poly([[44, shY + 58], [66, shY + 52], [62, shY + 68], [46, shY + 70]]), GRIS.blanc, 2);                                       // pochette
  F(c, ell(-52, shY + 40, 7, 7), GRIS.blanc, 2); ink(c, 2.5, GRIS.blanc); c.beginPath(); c.moveTo(-52, shY + 47); c.quadraticCurveTo(-50, shY + 60, -44, shY + 64); c.stroke();   // œillet à la boutonnière
  ink(c, 2.4, GRIS.clair); c.beginPath(); c.moveTo(-30, -470); c.quadraticCurveTo(-6, -446, 18, -470); c.stroke();                       // chaîne de montre
  F(c, smooth([[0, shY + 6], [-26, shY - 8], [-26, shY + 20]]), GRIS.noir, 3); F(c, smooth([[0, shY + 6], [26, shY - 8], [26, shY + 20]]), GRIS.noir, 3); F(c, ell(0, shY + 6, 6, 7), GRIS.noir, 2);
  [-560, -520].forEach(y => F(c, ell(-14, y, 6, 6), GRIS.blanc, 2)); [-560, -520].forEach(y => F(c, ell(14, y, 6, 6), GRIS.blanc, 2));
  c.save(); c.translate(0, shY - 10); c.rotate(P.tilt || 0); c.translate(0, -(shY - 10));
  F(c, poly([[-16, shY - 4], [16, shY - 4], [14, shY - 36], [-14, shY - 36]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { moustache: true, mechant: P.mechant, age: true });
  const ch = smooth([[-54, hy - 8], [-56, hy - 46], [-30, hy - 72], [0, hy - 78], [30, hy - 72], [56, hy - 46], [54, hy - 8], [40, hy - 40], [6, hy - 52], [-6, hy - 52], [-40, hy - 40]]);
  F(c, ch, GRIS.noir, 4); ink(c, 2.4, 'rgba(255,255,255,.4)'); for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-40 + k * 8, hy - 50 + k * 2); c.quadraticCurveTo(-14 + k * 6, hy - 70 + k * 3, 6 + k * 6, hy - 64 + k * 2); c.stroke(); }   // cheveux gominés brillants
  ink(c, 2.6, GRIS.peau); c.beginPath(); c.moveTo(2, hy - 76); c.lineTo(4, hy - 52); c.stroke();                                   // raie au milieu
  if (P.chapeau) { F(c, ell(0, hy - 64, 72, 12), GRIS.noir, 4); F(c, smooth([[-46, hy - 66], [-40, hy - 120], [40, hy - 120], [46, hy - 66]]), GRIS.noir, 4); F(c, poly([[-46, hy - 80], [46, hy - 80], [46, hy - 70], [-46, hy - 70]]), GRIS.moyen, 2); }
  c.restore();
  bras(c, sR, hR, -12, GRIS.fonce, P.poseR);
  c.restore(); c.restore();
}
// ---------- LE CLIENT : ouvrier, casquette, chemise retroussée, bretelles, pantalon large
function drawClient(c, P) {
  const s = P.s || 1; c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -400, shY = -620, hy = -724;
  for (const sd of [-1, 1]) { const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0;
    const hip = [sd * 32, hipY], foot = [sd * 42 + ph * 56, -30 - Math.max(0, ph) * 20];
    jambeHumain(c, hip, foot, 60, GRIS.moyen, sd, ph); souliers(c, foot[0] + sd * 4, foot[1] + 30, sd > 0 ? 1 : -1, 1.1); }
  c.save(); c.translate(0, hipY); c.rotate(P.lean || 0); c.translate(0, -hipY);
  const hL = P.handL || [-100, -380], hR = P.handR || [100, -380], sL = [-78, shY + 24], sR = [78, shY + 24];
  bras(c, sL, hL, 14, GRIS.blanc, P.poseL, 34);
  const ch = smooth([[-82, shY], [-40, shY - 12], [40, shY - 12], [82, shY], [80, -420], [-80, -420]]); F(c, ch, GRIS.blanc, 5); ombre(c, ch, -40, shY, 80, -420, .28);
  ink(c, 1.8, 'rgba(0,0,0,.3)'); for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) { c.beginPath(); c.moveTo(sd * (20 + k * 14), shY + 40 + k * 30); c.quadraticCurveTo(sd * (30 + k * 14), shY + 80 + k * 30, sd * (24 + k * 14), shY + 120 + k * 30); c.stroke(); }   // plis de la chemise
  for (const sd of [-1, 1]) { const pk = poly([[sd * 22, shY + 40], [sd * 58, shY + 38], [sd * 58, shY + 76], [sd * 24, shY + 78]]); F(c, pk, GRIS.blanc, 2.5); F(c, ell(sd * 40, shY + 44, 3, 3), GRIS.moyen, 1); }   // poches de poitrine
  F(c, poly([[-82, -440], [82, -440], [88, -380], [-88, -380]]), GRIS.moyen, 4);                                  // ceinture du pantalon
  ink(c, 1.4, 'rgba(255,255,255,.4)'); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(-80, -432); c.lineTo(80, -432); c.stroke(); c.setLineDash([]);
  F(c, poly([[-10, -440], [10, -440], [10, -400], [-10, -400]]), GRIS.fonce, 2); F(c, ell(0, -420, 5, 5), GRIS.blanc, 1.5);           // braguette / bouton
  for (const sd of [-1, 1]) { ink(c, 14, GRIS.noir); c.beginPath(); c.moveTo(sd * 40, shY - 6); c.lineTo(sd * 32, -436); c.stroke(); F(c, ell(sd * 32, -444, 6, 6), GRIS.blanc, 2); }   // bretelles
  F(c, poly([[-20, shY - 12], [20, shY - 12], [0, shY + 26]]), GRIS.clair, 3); [shY + 50, shY + 90].forEach(y => F(c, ell(0, y, 4, 4), GRIS.moyen, 1.5));
  c.save(); c.translate(0, shY - 10); c.rotate(P.tilt || 0); c.translate(0, -(shY - 10));
  F(c, poly([[-16, shY - 4], [16, shY - 4], [14, shY - 36], [-14, shY - 36]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { barbe: true, rouge: true });
  if (!P.teteNue) { const cq = smooth([[-62, hy - 38], [-54, hy - 76], [0, hy - 92], [54, hy - 76], [64, hy - 40], [0, hy - 48]]); F(c, cq, GRIS.fonce, 4); ombre(c, cq, -40, 0, 60, 0, .3);
    chevrons(c, cq, '#3e3b36', 10); ink(c, 2, GRIS.noir); for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 6, hy - 90); c.quadraticCurveTo(k * 20, hy - 70, k * 26, hy - 44); c.stroke(); }
    F(c, smooth([[-10, hy - 44], [60, hy - 50], [86, hy - 40], [60, hy - 32]]), GRIS.noir, 3); F(c, ell(0, hy - 90, 9, 5), GRIS.fonce, 2);
    for (const sd of [-1, 1]) F(c, smooth([[sd * 44, hy - 38], [sd * 58, hy - 30], [sd * 52, hy - 18], [sd * 42, hy - 24]]), GRIS.noir, 0); }   // mèches sous la casquette
  else F(c, smooth([[-50, hy - 30], [-40, hy - 64], [0, hy - 72], [40, hy - 64], [50, hy - 30], [20, hy - 50], [-20, hy - 50]]), GRIS.noir, 3);
  c.restore();
  bras(c, sR, hR, -14, GRIS.blanc, P.poseR, 34);
  c.restore(); c.restore();
}
// ---------- FIGURANTS (foule) : variantes simples
function drawFigurant(c, P) {
  const v = P.v || 0, s = P.s || 1; c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -400, shY = -610, hy = -712, femme = v % 3 === 1, col = [GRIS.fonce, GRIS.clair, GRIS.moyen][v % 3];
  if (femme) { const robe = smooth([[-60, shY], [60, shY], [96, -60], [-96, -60]]); F(c, robe, GRIS.clair, 5); ombre(c, robe, -60, 0, 96, 0, .3); c.save(); c.clip(robe); c.fillStyle = GRIS.fonce; for (let y = shY; y < -60; y += 30) for (let x = -100; x < 100; x += 30) { c.beginPath(); c.arc(x + (y / 30 % 2) * 15, y, 5, 0, 7); c.fill(); } c.restore(); ink(c, 5); c.stroke(robe);
    F(c, smooth([[-46, shY - 4], [0, shY + 40], [46, shY - 4], [40, shY + 16], [0, shY + 56], [-40, shY + 16]]), GRIS.blanc, 3);   // col claudine
    F(c, poly([[-62, -400], [62, -400], [64, -386], [-64, -386]]), GRIS.noir, 2); F(c, ell(0, -393, 9, 7), GRIS.blanc, 2);              // ceinture
    for (let k = -3; k <= 3; k++) { ink(c, 1.4, 'rgba(0,0,0,.3)'); c.beginPath(); c.moveTo(k * 20, -380); c.lineTo(k * 30, -70); c.stroke(); }   // plis de la jupe
    for (const sd of [-1, 1]) { const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0; ink(c, 14); c.beginPath(); c.moveTo(sd * 30, -60); c.lineTo(sd * 34 + ph * 30, -20 - Math.max(0, ph) * 10); c.stroke(); souliers(c, sd * 34 + ph * 30, -Math.max(0, ph) * 10, sd, .8); } }
  else { for (const sd of [-1, 1]) { const ph = P.walk ? Math.sin(P.walk + (sd > 0 ? Math.PI : 0)) : 0, hip = [sd * 28, hipY], foot = [sd * 38 + ph * 46, -30 - Math.max(0, ph) * 16]; jambeHumain(c, hip, foot, 50, col, sd, ph); souliers(c, foot[0], foot[1] + 30, sd, 1); }
    const v2 = smooth([[-76, shY], [76, shY], [72, -400], [-72, -400]]); F(c, v2, col, 5); if (v % 2) rayures(c, v2, 'rgba(0,0,0,.25)', 13); ombre(c, v2, -40, shY, 76, -400, .3); ink(c, 5); c.stroke(v2);
    F(c, poly([[-24, shY - 8], [24, shY - 8], [0, shY + 70]]), GRIS.blanc, 3); F(c, poly([[-8, shY], [8, shY], [12, shY + 64], [0, shY + 80], [-12, shY + 64]]), v % 2 ? GRIS.noir : GRIS.moyen, 2);
    for (const sd of [-1, 1]) F(c, poly([[sd * 24, shY - 6], [sd * 46, shY + 2], [sd * 20, -470], [sd * 8, shY + 60]]), 'rgba(0,0,0,.25)', 3);
    [-560, -520, -480].forEach(y => F(c, ell(0, y, 5, 5), GRIS.blanc, 1.5)); }
  if (P.tablier) {                                                  // tablier de travail (imprimeur, boulanger, marchande)
    const tb = smooth([[-44, shY + 30], [44, shY + 30], [52, -390], [64, -150], [-64, -150], [-52, -390]]); F(c, tb, P.tablier === 'noir' ? GRIS.fonce : GRIS.blanc, 4);
    ombre(c, tb, -60, 0, 60, 0, .25); F(c, poly([[-30, -330], [30, -330], [30, -270], [-30, -270]]), P.tablier === 'noir' ? GRIS.noir : GRIS.clair, 2);   // poche
    ink(c, 4, GRIS.fonce); c.beginPath(); c.moveTo(-58, -400); c.lineTo(58, -400); c.stroke();
    if (P.tablier === 'taches') { c.fillStyle = 'rgba(0,0,0,.35)'; for (let k = 0; k < 7; k++) { c.beginPath(); c.arc(-34 + hash(k) * 68, -360 + hash(k + 4) * 200, 4 + hash(k + 8) * 6, 0, 7); c.fill(); } }
  }
  if (P.habit) P.habit(c, shY, hipY);
  const hL = P.handL || [-92, -400], hR = P.handR || [92, -400];
  bras(c, [-70, shY + 22], hL, 12, femme ? GRIS.clair : col, P.poseL); bras(c, [70, shY + 22], hR, -12, femme ? GRIS.clair : col, P.poseR);
  c.save(); c.translate(0, shY); c.rotate(P.tilt || 0); c.translate(0, -shY);
  F(c, poly([[-14, shY + 4], [14, shY + 4], [12, shY - 30], [-12, shY - 30]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { moustache: v % 3 === 0, cils: v % 3 === 1, age: v % 4 === 0, barbe: v % 5 === 2, rouge: true });
  if (femme) { for (let k = -3; k <= 3; k++) { F(c, ell(k * 16, hy - 52 + Math.abs(k) * 6, 16, 14), GRIS.noir, 0); ink(c, 1.4, 'rgba(255,255,255,.35)'); c.beginPath(); c.arc(k * 16, hy - 52 + Math.abs(k) * 6, 8, 3.5, 5.6); c.stroke(); }
    for (const sd of [-1, 1]) F(c, ell(sd * 52, hy + 26, 4, 6), GRIS.blanc, 1.5);   // boucles d'oreilles
    if (P.chapeau) P.chapeau(c, hy); else { F(c, ell(0, hy - 62, 64, 10), GRIS.clair, 3); F(c, smooth([[-36, hy - 64], [-30, hy - 96], [30, hy - 96], [36, hy - 64]]), GRIS.clair, 3); F(c, ell(20, hy - 80, 10, 8), GRIS.fonce, 2); } }
  else if (P.chapeau) P.chapeau(c, hy);
  else if (v % 3 === 0) { F(c, ell(0, hy - 58, 66, 10), GRIS.noir, 3); F(c, smooth([[-40, hy - 60], [-36, hy - 104], [36, hy - 104], [40, hy - 60]]), GRIS.noir, 3); }
  else { F(c, ell(0, hy - 56, 62, 10), GRIS.blanc, 3); F(c, poly([[-38, hy - 58], [38, hy - 58], [36, hy - 82], [-36, hy - 82]]), GRIS.blanc, 3); F(c, poly([[-38, hy - 68], [38, hy - 68], [38, hy - 62], [-38, hy - 62]]), GRIS.noir, 1.5); }
  if (P.objet) P.objet(c, hR);
  c.restore(); c.restore();
}

// ---------- objets du téléviseur
function pot(c, x, y, s, type, t) {                     // le « produit » : un pot / une boîte
  c.save(); c.translate(x, y); c.scale(s, s);
  if (type === 'luxe') {                                  // version habillée : rubans, étoiles, nœud
    const g = c.createRadialGradient(0, -60, 10, 0, -60, 140); g.addColorStop(0, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(-150, -200, 300, 240);
  }
  const corps = smooth([[-44, 0], [-50, -60], [-42, -92], [42, -92], [50, -60], [44, 0]]);
  F(c, corps, type === 'luxe' ? GRIS.blanc : GRIS.clair, 5); ombre(c, corps, -44, 0, 50, 0, .3);
  F(c, poly([[-44, -92], [44, -92], [40, -110], [-40, -110]]), type === 'luxe' ? GRIS.noir : GRIS.moyen, 4); F(c, ell(0, -112, 18, 6), GRIS.fonce, 3);
  if (type === 'luxe') {
    F(c, poly([[-50, -44], [50, -44], [50, -32], [-50, -32]]), GRIS.noir, 2); F(c, smooth([[0, -38], [-30, -58], [-26, -20]]), GRIS.noir, 2); F(c, smooth([[0, -38], [30, -58], [26, -20]]), GRIS.noir, 2);
    for (let k = 0; k < 4; k++) { const a = t * 2 + k * 1.6; etoile(c, Math.cos(a) * 70, -70 + Math.sin(a) * 50, 8 + 3 * Math.sin(t * 6 + k)); }
  } else F(c, ell(0, -50, 18, 14), GRIS.blanc, 2.5);
  c.restore();
}
function etoile(c, x, y, r) { const p = []; for (let k = 0; k < 10; k++) { const rr = k % 2 ? r * .4 : r, a = Math.PI / 5 * k - Math.PI / 2; p.push([x + rr * Math.cos(a), y + rr * Math.sin(a)]); } F(c, poly(p), '#ffffff', 2); }
function projecteur(c, x, y, a) {                        // cône de lumière
  const g = c.createLinearGradient(x, 0, x, y); g.addColorStop(0, `rgba(255,255,255,${.55 * a})`); g.addColorStop(1, `rgba(255,255,255,${.12 * a})`);
  c.fillStyle = g; c.beginPath(); c.moveTo(x - 30, 0); c.lineTo(x + 30, 0); c.lineTo(x + 130, y); c.lineTo(x - 130, y); c.fill();
}
// ---------- décors N&B
let _magNB = null, _rueNB = null;
function bocalNB(c, x, y, s, k) { c.save(); c.translate(x, y); c.scale(s, s); const p = smooth([[-16, 0], [-18, -30], [-12, -40], [12, -40], [18, -30], [16, 0]]); F(c, p, GRIS.blanc, 2.5); c.save(); c.clip(p); c.fillStyle = [GRIS.moyen, GRIS.fonce, GRIS.clair][k % 3]; c.fillRect(-20, -24, 40, 24); c.restore(); F(c, poly([[-12, -40], [12, -40], [10, -48], [-10, -48]]), GRIS.fonce, 2); reflet(c, p, -8, -26, 3, 8, .6, 0); c.restore(); }
function boiteNB(c, x, y, w, h, k) { const p = poly([[x - w / 2, y], [x + w / 2, y], [x + w / 2, y - h], [x - w / 2, y - h]]); F(c, p, [GRIS.blanc, GRIS.clair, GRIS.moyen][k % 3], 2.5); ombre(c, p, x - w / 2, 0, x + w / 2, 0, .3); ink(c, 1.4, 'rgba(0,0,0,.4)'); c.strokeRect(x - w / 2 + 4, y - h + 6, w - 8, h * .4); c.save(); c.font = `bold ${Math.round(h * .22)}px Georgia`; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(['THÉ', 'CAFÉ', 'SEL', 'BISC.'][k % 4], x, y - h * .5); c.restore(); }
function fondMagasinNB() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H);
  for (let y = 10; y < 470; y += 30) for (let x = (y / 30 % 2) * 15; x < W; x += 30) { c.fillStyle = 'rgba(0,0,0,.06)'; c.beginPath(); c.arc(x, y, 3, 0, 7); c.fill(); }   // papier peint à motifs
  F(c, poly([[0, 470], [W, 470], [W, 600], [0, 600]]), GRIS.moyen, 0);
  for (let x = 10; x < W; x += 110) { const p = poly([[x, 484], [x + 96, 484], [x + 96, 590], [x, 590]]); F(c, p, '#b8b4aa', 2.5); ink(c, 1.4, 'rgba(255,255,255,.4)'); c.strokeRect(x + 8, 492, 80, 90); }   // lambris
  F(c, poly([[0, 462], [W, 462], [W, 476], [0, 476]]), GRIS.fonce, 3);
  // grande vitrine sur la rue
  c.save(); c.beginPath(); c.rect(720, 70, 290, 290); c.clip(); c.fillStyle = GRIS.blanc; c.fillRect(720, 70, 290, 290);
  for (let k = 0; k < 4; k++) { const x = 710 + k * 80, h = 160 + hash(k) * 80; F(c, poly([[x, 360], [x + 76, 360], [x + 76, 360 - h], [x, 360 - h]]), [GRIS.clair, '#c8c4ba', GRIS.moyen][k % 3], 2); for (let r = 0; r < 3; r++) F(c, poly([[x + 14, 380 - h + r * 50], [x + 34, 380 - h + r * 50], [x + 34, 404 - h + r * 50], [x + 14, 404 - h + r * 50]]), GRIS.blanc, 1.5); }
  c.restore(); ink(c, 8); c.strokeRect(720, 70, 290, 290); ink(c, 4); c.beginPath(); c.moveTo(865, 70); c.lineTo(865, 360); c.moveTo(720, 215); c.lineTo(1010, 215); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.moveTo(735, 80); c.lineTo(780, 80); c.lineTo(735, 150); c.fill();
  for (const sd of [-1, 1]) { const rx = sd < 0 ? 708 : 1022; const p = smooth([[rx, 60], [rx - sd * 34, 60], [rx - sd * 22, 200], [rx - sd * 4, 230], [rx - sd * 28, 372], [rx, 372]]); F(c, p, GRIS.fonce, 3); ombre(c, p, rx - sd * 34, 0, rx, 0, .35); }
  c.save(); c.font = 'italic bold 26px Georgia'; c.textAlign = 'center'; c.fillStyle = 'rgba(40,40,40,.55)'; c.fillText('Épicerie', 865, 140); c.restore();
  // étagères chargées : bocaux, boîtes, bouteilles
  for (let r = 0; r < 3; r++) { const sy = 160 + r * 130; F(c, poly([[0, sy], [690, sy], [690, sy + 12], [0, sy + 12]]), GRIS.fonce, 3);
    for (const bx of [20, 340, 670]) F(c, smooth([[bx - 5, sy + 12], [bx + 5, sy + 12], [bx + 2, sy + 30], [bx - 2, sy + 30]]), GRIS.fonce, 2);
    for (let k = 0; k < 13; k++) { const x = 30 + k * 50 + (r % 2) * 14, ty = (k * 7 + r * 3) % 4;
      if (ty === 0) bocalNB(c, x, sy, 1, k); else if (ty === 1) boiteNB(c, x, sy, 40, 46 + (k % 2) * 12, k); else if (ty === 2) { F(c, smooth([[x - 8, sy], [x - 9, sy - 34], [x - 4, sy - 44], [x - 4, sy - 58], [x + 4, sy - 58], [x + 4, sy - 44], [x + 9, sy - 34], [x + 8, sy]]), GRIS.fonce, 2.5); F(c, poly([[x - 8, sy - 26], [x + 8, sy - 26], [x + 8, sy - 14], [x - 8, sy - 14]]), GRIS.blanc, 1.5); }
      else { F(c, ell(x, sy - 2, 18, 5), GRIS.moyen, 2); F(c, poly([[x - 18, sy - 2], [x + 18, sy - 2], [x + 18, sy - 24], [x - 18, sy - 24]]), GRIS.moyen, 2); F(c, ell(x, sy - 24, 18, 5), GRIS.clair, 2); } } }
  // enseigne suspendue et lampe
  ink(c, 3); c.beginPath(); c.moveTo(120, 0); c.lineTo(120, 30); c.moveTo(300, 0); c.lineTo(300, 30); c.stroke();
  const en = poly([[80, 30], [340, 30], [340, 96], [80, 96]]); F(c, en, GRIS.blanc, 5); ink(c, 2); c.strokeRect(88, 38, 244, 50);
  c.save(); c.font = 'italic bold 40px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('Épicerie fine', 210, 78); c.restore();
  // horloge, calendrier
  F(c, ell(560, 60, 28, 28), GRIS.fonce, 4); F(c, ell(560, 60, 22, 22), GRIS.blanc, 2); ink(c, 3); c.beginPath(); c.moveTo(560, 60); c.lineTo(560, 44); c.moveTo(560, 60); c.lineTo(572, 64); c.stroke();
  F(c, poly([[620, 30], [680, 30], [680, 100], [620, 100]]), GRIS.blanc, 3); c.save(); c.font = 'bold 30px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('12', 650, 82); c.restore();
  // carrelage en damier
  for (let y = 600; y < H; y += 30) for (let x = 0; x < W; x += 30) { c.fillStyle = ((x + y) / 30) % 2 ? '#8e8a80' : '#bdb9ae'; c.fillRect(x, y, 30, 30); }
  ink(c, 5); c.beginPath(); c.moveTo(0, 600); c.lineTo(W, 600); c.stroke();
  return cv;
}
function magasinNB(c, t) {
  if (!_magNB) _magNB = fondMagasinNB(); c.drawImage(_magNB, 0, 0);
  ink(c, 3); c.beginPath(); c.moveTo(470, 0); c.lineTo(470, 40); c.stroke(); F(c, smooth([[420, 80], [446, 40], [494, 40], [520, 80]]), GRIS.fonce, 4); F(c, ell(470, 82, 14, 7), GRIS.blanc, 2);
  const gl = c.createRadialGradient(470, 80, 10, 470, 320, 560); gl.addColorStop(0, `rgba(255,255,255,${.34 + .04 * Math.sin(t * 3)})`); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, W, H);
}
function comptoirNB(c, x0, x1, y) {
  const pl = poly([[x0 - 10, y], [x1 + 10, y], [x1 + 14, y + 20], [x0 - 14, y + 20]]); F(c, pl, GRIS.moyen, 5); reflet(c, pl, (x0 + x1) / 2, y + 6, (x1 - x0) * .4, 4, .4, 0);
  const cs = poly([[x0, y + 20], [x1, y + 20], [x1, H + 20], [x0, H + 20]]); F(c, cs, GRIS.fonce, 5); ombre(c, cs, x0, y, x1, H, .3);
  const n = Math.max(3, Math.round((x1 - x0) / 140));
  for (let k = 0; k < n; k++) { const px = x0 + (k + .5) * (x1 - x0) / n, w2 = (x1 - x0) / n * .38; const pn = poly([[px - w2, y + 44], [px + w2, y + 44], [px + w2, y + 170], [px - w2, y + 170]]); F(c, pn, '#4a4640', 3);
    ink(c, 2, 'rgba(255,255,255,.25)'); c.strokeRect(px - w2 + 8, y + 52, w2 * 2 - 16, 110); F(c, ell(px, y + 108, 10, 10), GRIS.clair, 2); F(c, ell(px, y + 108, 4, 4), GRIS.fonce, 1); }   // panneaux moulurés + rosaces
  F(c, poly([[x0 - 6, y + 180], [x1 + 6, y + 180], [x1 + 6, y + 192], [x0 - 6, y + 192]]), GRIS.moyen, 2);
  // caisse enregistreuse et balance sur le comptoir
  const cx = x1 - 70; F(c, poly([[cx - 40, y], [cx + 40, y], [cx + 34, y - 60], [cx - 34, y - 60]]), GRIS.fonce, 3); F(c, poly([[cx - 30, y - 60], [cx + 30, y - 60], [cx + 22, y - 84], [cx - 22, y - 84]]), GRIS.moyen, 3);
  for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) F(c, ell(cx - 21 + q * 14, y - 18 - r * 16, 5, 5), GRIS.blanc, 1.5);
  F(c, poly([[cx - 18, y - 80], [cx + 18, y - 80], [cx + 18, y - 70], [cx - 18, y - 70]]), GRIS.blanc, 1.5);
}
function fondRueNB() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  const ciel = c.createLinearGradient(0, 0, 0, 300); ciel.addColorStop(0, '#e8e6e0'); ciel.addColorStop(1, '#f6f4ee'); c.fillStyle = ciel; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 5; k++) { F(c, ell(120 + k * 240, 50 + hash(k) * 30, 70, 22), '#fafaf6', 2); F(c, ell(160 + k * 240, 40 + hash(k) * 30, 50, 18), '#fafaf6', 0); }
  // clocher et toits au loin
  F(c, poly([[520, 200], [560, 200], [560, 110], [540, 70], [520, 110]]), GRIS.clair, 2.5); F(c, ell(540, 140, 10, 10), GRIS.blanc, 2);
  for (let k = 0; k < 6; k++) {                                                                                                // façades détaillées
    const x = k * 190 - 30, h = 330 + hash(k) * 110, col = ['#d8d4ca', '#bcb8ae', '#cac6bc'][k % 3], top = 470 - h;
    const fa = poly([[x, 470], [x + 184, 470], [x + 184, top], [x, top]]); F(c, fa, col, 4); ombre(c, fa, x, 0, x + 184, 0, .2);
    F(c, poly([[x - 6, top], [x + 190, top], [x + 184, top - 16], [x, top - 16]]), GRIS.fonce, 3);                                // corniche
    for (let q = 0; q < 2; q++) { const cx = x + 40 + q * 100; F(c, poly([[cx - 6, top - 16], [cx + 6, top - 16], [cx + 6, top - 40], [cx - 6, top - 40]]), GRIS.moyen, 2); }   // cheminées
    for (let y = top + 20; y < 380; y += 14) { ink(c, 1, 'rgba(0,0,0,.12)'); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 184, y); c.stroke(); }                                // briques
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const wx = x + 18 + q * 56, wy = top + 30 + r * 86; if (wy > 340) continue;
      F(c, poly([[wx, wy], [wx + 38, wy], [wx + 38, wy + 56], [wx, wy + 56]]), GRIS.blanc, 2.5); ink(c, 2); c.beginPath(); c.moveTo(wx + 19, wy); c.lineTo(wx + 19, wy + 56); c.moveTo(wx, wy + 24); c.lineTo(wx + 38, wy + 24); c.stroke();
      F(c, poly([[wx - 4, wy + 56], [wx + 42, wy + 56], [wx + 42, wy + 62], [wx - 4, wy + 62]]), GRIS.fonce, 1.5);
      if ((k + r + q) % 3 === 0) for (let f = 0; f < 4; f++) F(c, ell(wx + 5 + f * 10, wy + 54, 5, 5), GRIS.fonce, 1); }                                           // pots de fleurs
    // rez-de-chaussée : boutique avec auvent rayé et enseigne
    F(c, poly([[x + 12, 470], [x + 172, 470], [x + 172, 380], [x + 12, 380]]), '#6a6660', 3); F(c, poly([[x + 24, 466], [x + 120, 466], [x + 120, 392], [x + 24, 392]]), GRIS.blanc, 2.5);
    F(c, poly([[x + 132, 470], [x + 164, 470], [x + 164, 396], [x + 132, 396]]), GRIS.fonce, 2.5); F(c, ell(x + 158, 436, 3, 3), GRIS.blanc, 1);
    for (let q = 0; q < 8; q++) F(c, poly([[x + 4 + q * 22, 370], [x + 26 + q * 22, 370], [x + 30 + q * 22, 398], [x + 8 + q * 22, 398]]), q % 2 ? GRIS.blanc : GRIS.fonce, 1.5);
    for (let q = 0; q < 8; q++) F(c, smooth([[x + 8 + q * 22, 398], [x + 30 + q * 22, 398], [x + 19 + q * 22, 408]]), q % 2 ? GRIS.blanc : GRIS.fonce, 1);
    F(c, poly([[x + 30, 340], [x + 154, 340], [x + 154, 364], [x + 30, 364]]), GRIS.blanc, 2.5);
    c.save(); c.font = 'bold 16px Georgia'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText(['BOULANGERIE', 'CAFÉ', 'MODES', 'BAZAR', 'ÉPICERIE', 'TABAC'][k % 6], x + 92, 358); c.restore();
  }
  // trottoir, bordure, pavés
  F(c, poly([[0, 470], [W, 470], [W, 500], [0, 500]]), '#b0aca2', 3);
  c.fillStyle = '#8e8a80'; c.fillRect(0, 500, W, H - 500);
  for (let y = 506; y < H; y += 22) for (let x = ((y / 22) % 2) * 20; x < W + 20; x += 40) { const p = ell(x, y, 18, 9); F(c, p, '#a29e94', 1.5); reflet(c, p, x - 5, y - 3, 7, 3, .35, 0); }
  // lampadaires ouvragés, bancs, arbre
  for (const lx of [140, 940]) { ink(c, 10); c.beginPath(); c.moveTo(lx, 640); c.lineTo(lx, 250); c.stroke(); F(c, poly([[lx - 14, 640], [lx + 14, 640], [lx + 8, 600], [lx - 8, 600]]), GRIS.noir, 2);
    ink(c, 4); c.beginPath(); c.moveTo(lx, 270); c.quadraticCurveTo(lx + 30, 250, lx + 46, 270); c.moveTo(lx, 270); c.quadraticCurveTo(lx - 30, 250, lx - 46, 270); c.stroke();
    for (const sd of [-1, 0, 1]) { const ly = sd === 0 ? 224 : 268, lxx = lx + sd * 46; F(c, poly([[lxx - 14, ly], [lxx + 14, ly], [lxx + 9, ly + 30], [lxx - 9, ly + 30]]), GRIS.blanc, 3); F(c, poly([[lxx - 16, ly], [lxx + 16, ly], [lxx, ly - 12]]), GRIS.noir, 2); } }
  return cv;
}
function rueNB(c, t) { if (!_rueNB) _rueNB = fondRueNB(); c.drawImage(_rueNB, 0, 0);
  for (let k = 0; k < 3; k++) { const x = ((t * 40 + k * 420) % 1300) - 100; c.fillStyle = 'rgba(0,0,0,.5)'; c.beginPath(); c.moveTo(x, 100 + k * 20); c.quadraticCurveTo(x + 8, 94 + k * 20 + 6 * Math.sin(t * 12 + k), x + 16, 100 + k * 20); c.quadraticCurveTo(x + 24, 94 + k * 20 + 6 * Math.sin(t * 12 + k), x + 32, 100 + k * 20); c.stroke(); ink(c, 2); c.stroke(); }   // oiseaux
}
// ---------- vieux film : grain, scintillement, rayures, poussières, vignettage (seulement dans le téléviseur)
function filmAncien(c, t) {
  const fi = Math.floor(t * 24), r = (k) => hash(fi * 31 + k);
  c.fillStyle = `rgba(255,250,235,${.03 + r(1) * .07})`; c.fillRect(0, 0, W, H);
  c.fillStyle = `rgba(0,0,0,${r(2) * .06})`; c.fillRect(0, 0, W, H);
  ink(c, 1.5, 'rgba(255,255,255,.35)'); for (let k = 0; k < 3; k++) { const x = hash(Math.floor(t * 6) * 7 + k) * W; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 6, H); c.stroke(); }
  c.fillStyle = 'rgba(10,10,10,.6)'; for (let k = 0; k < 16; k++) { c.beginPath(); c.arc(r(10 + k) * W, r(40 + k) * H, 1 + r(70 + k) * 2.6, 0, 7); c.fill(); }
  for (let k = 0; k < 900; k++) { c.fillStyle = r(200 + k) > .5 ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.08)'; c.fillRect(r(300 + k) * W, r(1300 + k) * H, 2, 2); }
  const vg = c.createRadialGradient(W / 2, H / 2, H * .32, W / 2, H / 2, H * .85); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
}
const _off = document.createElement('canvas'); _off.width = W; _off.height = H; const _offc = _off.getContext('2d');
function enNoirEtBlanc(c, t, dessin) {                    // dessine la scène, la passe en N&B, ajoute le vieux film et un léger tremblement
  _offc.setTransform(1, 0, 0, 1, 0, 0); _offc.clearRect(0, 0, W, H); _offc.save(); dessin(_offc); _offc.restore();
  const j = hash(Math.floor(t * 24)) * 3 - 1.5;
  c.save(); c.filter = 'grayscale(1) contrast(1.12)'; c.drawImage(_off, j, j * .6); c.restore();
  filmAncien(c, t);
}
// ---------- outils de mise en scène
function parle(id, t) { const l = L[id]; return !!l && t >= l[0] && t < l[0] + l[1]; }
function apres(id, t, d = 0) { const l = L[id]; return !!l && t >= l[0] + d; }
function local(id, t) { const l = L[id]; return l ? t - l[0] : -1; }
function cam(c, t, keys) {
  let k = keys[0];
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= b[0]) { k = b; continue; } const u = ease((t - a[0]) / Math.min(.6, Math.max(.01, b[0] - a[0]))); k = [0, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; break; }
  let [, cx, cy, z] = k; z = Math.max(1, z); cx = clamp(cx, W / (2 * z), W - W / (2 * z)); cy = clamp(cy, H / (2 * z), H - H / (2 * z));
  c.translate(W / 2, H / 2); c.scale(z, z); c.translate(-cx, -cy);
}
function televiseur(c, x, y, s, on, t) {                 // vieux poste en bois posé sur le comptoir
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, smooth([[-110, 0], [-116, -150], [116, -150], [110, 0]]), '#7a4220', 5); ombre(c, smooth([[-110, 0], [-116, -150], [116, -150], [110, 0]]), -110, 0, 116, 0, .35);
  const ecran = smooth([[-92, -24], [-96, -132], [56, -132], [52, -24]]); F(c, ecran, '#1a1410', 4);
  c.save(); c.clip(ecran);
  if (on > 0) { c.fillStyle = `rgba(210,210,200,${on})`; c.fillRect(-100, -140, 160, 120); for (let k = 0; k < 60; k++) { c.fillStyle = `rgba(${hash(k + t * 50) > .5 ? 255 : 0},${hash(k + t * 50) > .5 ? 255 : 0},${hash(k + t * 50) > .5 ? 255 : 0},.35)`; c.fillRect(-96 + hash(k * 3 + t * 20) * 150, -132 + hash(k * 7 + t * 20) * 108, 6, 2); } }
  c.fillStyle = 'rgba(255,255,255,.14)'; c.beginPath(); c.ellipse(-40, -110, 40, 14, -.3, 0, 7); c.fill(); c.restore();
  for (let k = 0; k < 2; k++) F(c, ell(84, -110 + k * 46, 12, 12), '#d9a04a', 3);
  for (let k = 0; k < 5; k++) { ink(c, 2, '#3a1a0a'); c.beginPath(); c.moveTo(72, -60 + k * 8); c.lineTo(98, -60 + k * 8); c.stroke(); }
  for (const sd of [-1, 1]) F(c, poly([[sd * 80, 0], [sd * 92, 0], [sd * 96, 14], [sd * 76, 14]]), '#3a1a0a', 2);
  c.restore();
  return [x + (-20) * s, y - 78 * s, 150 * s, 108 * s];   // centre et taille de l'écran
}
// ---------- couvre-chefs des figurants (à passer en P.chapeau)
const COIFFE = {
  casquette: (c, hy) => { F(c, smooth([[-60, hy - 52], [-50, hy - 86], [0, hy - 96], [52, hy - 84], [62, hy - 52]]), GRIS.fonce, 4); F(c, smooth([[-20, hy - 56], [70, hy - 58], [90, hy - 48], [60, hy - 44], [-20, hy - 48]]), GRIS.noir, 3); ink(c, 1.4, 'rgba(255,255,255,.3)'); for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(k * 8, hy - 94); c.quadraticCurveTo(k * 22, hy - 76, k * 26, hy - 56); c.stroke(); } F(c, ell(0, hy - 95, 7, 4), GRIS.fonce, 2); },
  toque: (c, hy) => { F(c, poly([[-46, hy - 50], [46, hy - 50], [44, hy - 76], [-44, hy - 76]]), GRIS.blanc, 3); for (let k = -2; k <= 2; k++) F(c, ell(k * 22, hy - 104, 26, 30), GRIS.blanc, 3); F(c, poly([[-44, hy - 76], [44, hy - 76], [44, hy - 84], [-44, hy - 84]]), GRIS.blanc, 0); },
  kepi: (c, hy) => { F(c, poly([[-46, hy - 50], [46, hy - 50], [40, hy - 104], [-40, hy - 104]]), GRIS.noir, 4); F(c, ell(0, hy - 104, 40, 8), GRIS.fonce, 3); F(c, smooth([[-46, hy - 52], [46, hy - 52], [56, hy - 40], [-10, hy - 40]]), GRIS.noir, 3); F(c, poly([[-46, hy - 66], [46, hy - 66], [46, hy - 58], [-46, hy - 58]]), GRIS.blanc, 1.5); F(c, ell(0, hy - 82, 8, 9), GRIS.blanc, 2); },
  foulard: (c, hy) => { F(c, smooth([[-62, hy + 10], [-66, hy - 50], [0, hy - 92], [66, hy - 50], [62, hy + 10], [50, hy - 30], [0, hy - 60], [-50, hy - 30]]), GRIS.moyen, 4); c.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < 9; k++) { c.beginPath(); c.arc(-40 + (k % 3) * 40, hy - 70 + Math.floor(k / 3) * 20, 4, 0, 7); c.fill(); } F(c, smooth([[40, hy + 6], [60, hy + 30], [44, hy + 40], [30, hy + 16]]), GRIS.moyen, 2); },
  visiere: (c, hy) => { F(c, smooth([[-58, hy - 50], [58, hy - 50], [76, hy - 40], [-10, hy - 34]]), 'rgba(40,40,40,.85)', 3); ink(c, 6, GRIS.fonce); c.beginPath(); c.moveTo(-58, hy - 52); c.quadraticCurveTo(0, hy - 64, 58, hy - 52); c.stroke(); },
};
