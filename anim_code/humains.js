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
  c.restore();
}
function jambeHumain(c, hip, foot, w, col, sd, ph) {
  const knee = [lerp(hip[0], foot[0], .5) + ph * 16, lerp(hip[1], foot[1], .5)];
  const tr = (ww, cc) => { c.lineCap = 'round'; c.strokeStyle = cc; c.lineWidth = ww; c.beginPath(); c.moveTo(...hip); c.quadraticCurveTo(knee[0], knee[1], ...foot); c.stroke(); };
  tr(w + 8, INK); tr(w, col); c.save(); c.translate(sd * w * .28, 0); tr(w * .3, 'rgba(0,0,0,.18)'); c.restore();
}
function teteHumain(c, P, hy, opts) {
  const lk = P.look || [0, 0];
  for (const sd of [-1, 1]) F(c, ell(sd * 52, hy + 4, 12, 18), GRIS.peau, 4);                          // oreilles
  const v = smooth([[-50, hy - 40], [0, hy - 62], [50, hy - 40], [56, hy + 10], [42, hy + 54], [0, hy + 70], [-42, hy + 54], [-56, hy + 10]]);
  F(c, v, GRIS.peau, 5); ombre(c, v, -30, hy, 56, hy, .22);
  if (opts.barbe) { c.fillStyle = 'rgba(80,76,70,.35)'; for (let k = 0; k < 40; k++) { const a = .2 + hash(k) * 2.7, r = .6 + hash(k + 7) * .35; c.beginPath(); c.arc(Math.cos(a) * 44 * r, hy + 26 + Math.sin(a) * 34 * r, 1.4, 0, 7); c.fill(); } }
  for (const sd of [-1, 1]) {                                                                              // yeux « pie-cut »
    const ex = sd * 18, ey = hy - 10;
    if (P.blink) { ink(c, 4); c.beginPath(); c.moveTo(ex - 11, ey + 2); c.quadraticCurveTo(ex, ey + 8, ex + 11, ey + 2); c.stroke(); continue; }
    F(c, ell(ex, ey, 12, 17), '#ffffff', 3.5);
    const px = ex + lk[0] * 4, py = ey + 3 + lk[1] * 4;
    c.save(); c.clip(ell(ex, ey, 12, 17)); F(c, ell(px, py, 7, 11), GRIS.noir, 0);
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(px, py); c.arc(px, py, 12, -1.45, -.85); c.closePath(); c.fill(); c.restore();
    const sc = P.sourcil || 0; ink(c, 4.5); c.beginPath(); c.moveTo(ex - sd * 12, ey - 22 - sc * 4); c.quadraticCurveTo(ex, ey - 28 - sc * 6, ex + sd * 12, ey - 22 + (opts.mechant ? 4 : 0)); c.stroke();
  }
  const nez = ell(4 + lk[0] * 3, hy + 14, 15, 12); F(c, nez, GRIS.peau, 4); reflet(c, nez, 0, hy + 9, 5, 3, .6);  // gros nez rond
  if (opts.moustache) F(c, smooth([[-26, hy + 32], [-8, hy + 28], [4, hy + 32], [16, hy + 28], [34, hy + 32], [14, hy + 37], [-6, hy + 37]]), GRIS.noir, 2);
  const o = P.talk || 0, my = hy + 46;
  if (o < .06) { ink(c, 4); c.beginPath(); c.moveTo(-16, my - 2); c.quadraticCurveTo(2, my + 10 * (P.sourire ?? 1), 20, my - 4); c.stroke(); }
  else { const h = 6 + o * 22; const b = new Path2D(); b.moveTo(-16, my - 2); b.quadraticCurveTo(2, my + 4, 20, my - 4); b.quadraticCurveTo(10, my + h, 2, my + h); b.quadraticCurveTo(-8, my + h, -16, my - 2); b.closePath();
    F(c, b, GRIS.noir, 3.5); c.save(); c.clip(b); c.fillStyle = GRIS.moyen; c.beginPath(); c.ellipse(2, my + h, 10, h * .4, 0, 0, 7); c.fill(); c.restore(); }
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
  F(c, v, GRIS.fonce, 5); rayures(c, v, '#7a766e', 14); ombre(c, v, -40, shY, 80, -400, .3); ink(c, 5); c.stroke(v);
  F(c, poly([[-30, shY - 12], [30, shY - 12], [0, shY + 90]]), GRIS.blanc, 4);
  for (const sd of [-1, 1]) F(c, poly([[sd * 30, shY - 10], [sd * 52, shY], [sd * 24, -470], [sd * 10, shY + 70]]), '#3e3b36', 4);
  F(c, smooth([[0, shY + 6], [-26, shY - 8], [-26, shY + 20]]), GRIS.noir, 3); F(c, smooth([[0, shY + 6], [26, shY - 8], [26, shY + 20]]), GRIS.noir, 3); F(c, ell(0, shY + 6, 6, 7), GRIS.noir, 2);
  [-560, -520].forEach(y => F(c, ell(-14, y, 6, 6), GRIS.blanc, 2)); [-560, -520].forEach(y => F(c, ell(14, y, 6, 6), GRIS.blanc, 2));
  c.save(); c.translate(0, shY - 10); c.rotate(P.tilt || 0); c.translate(0, -(shY - 10));
  F(c, poly([[-16, shY - 4], [16, shY - 4], [14, shY - 36], [-14, shY - 36]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { moustache: true, mechant: P.mechant });
  const ch = smooth([[-54, hy - 8], [-56, hy - 46], [-30, hy - 72], [0, hy - 78], [30, hy - 72], [56, hy - 46], [54, hy - 8], [40, hy - 40], [6, hy - 52], [-6, hy - 52], [-40, hy - 40]]);
  F(c, ch, GRIS.noir, 4); ink(c, 2.4, 'rgba(255,255,255,.4)'); c.beginPath(); c.moveTo(-34, hy - 56); c.quadraticCurveTo(-14, hy - 70, 4, hy - 66); c.stroke();
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
  const ch = smooth([[-82, shY], [-40, shY - 12], [40, shY - 12], [82, shY], [80, -420], [-80, -420]]); F(c, ch, GRIS.blanc, 5); ombre(c, ch, -40, shY, 80, -420, .25);
  F(c, poly([[-82, -440], [82, -440], [88, -380], [-88, -380]]), GRIS.moyen, 4);                                  // ceinture du pantalon
  for (const sd of [-1, 1]) { ink(c, 14, GRIS.noir); c.beginPath(); c.moveTo(sd * 40, shY - 6); c.lineTo(sd * 32, -436); c.stroke(); F(c, ell(sd * 32, -444, 6, 6), GRIS.blanc, 2); }   // bretelles
  F(c, poly([[-20, shY - 12], [20, shY - 12], [0, shY + 26]]), GRIS.clair, 3); [shY + 50, shY + 90].forEach(y => F(c, ell(0, y, 4, 4), GRIS.moyen, 1.5));
  c.save(); c.translate(0, shY - 10); c.rotate(P.tilt || 0); c.translate(0, -(shY - 10));
  F(c, poly([[-16, shY - 4], [16, shY - 4], [14, shY - 36], [-14, shY - 36]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { barbe: true });
  if (!P.teteNue) { const cq = smooth([[-62, hy - 38], [-54, hy - 76], [0, hy - 92], [54, hy - 76], [64, hy - 40], [0, hy - 48]]); F(c, cq, GRIS.fonce, 4); ombre(c, cq, -40, 0, 60, 0, .3);
    F(c, smooth([[-10, hy - 44], [60, hy - 50], [86, hy - 40], [60, hy - 32]]), GRIS.noir, 3); F(c, ell(0, hy - 90, 9, 5), GRIS.fonce, 2); }
  else F(c, smooth([[-50, hy - 30], [-40, hy - 64], [0, hy - 72], [40, hy - 64], [50, hy - 30], [20, hy - 50], [-20, hy - 50]]), GRIS.noir, 3);
  c.restore();
  bras(c, sR, hR, -14, GRIS.blanc, P.poseR, 34);
  c.restore(); c.restore();
}
// ---------- FIGURANTS (foule) : variantes simples
function drawFigurant(c, P) {
  const v = P.v || 0, s = P.s || 1; c.save(); c.translate(P.x, P.y); c.scale(s * (P.face || 1), s);
  const hipY = -400, shY = -610, hy = -712, femme = v % 3 === 1, col = [GRIS.fonce, GRIS.clair, GRIS.moyen][v % 3];
  if (femme) { const robe = smooth([[-60, shY], [60, shY], [96, -60], [-96, -60]]); F(c, robe, GRIS.clair, 5); c.save(); c.clip(robe); c.fillStyle = GRIS.fonce; for (let y = shY; y < -60; y += 30) for (let x = -100; x < 100; x += 30) { c.beginPath(); c.arc(x + (y / 30 % 2) * 15, y, 5, 0, 7); c.fill(); } c.restore(); ink(c, 5); c.stroke(robe);
    for (const sd of [-1, 1]) { ink(c, 14); c.beginPath(); c.moveTo(sd * 30, -60); c.lineTo(sd * 34, -20); c.stroke(); souliers(c, sd * 34, 0, sd, .8); } }
  else { for (const sd of [-1, 1]) { const hip = [sd * 28, hipY], foot = [sd * 38, -30]; jambeHumain(c, hip, foot, 50, col, sd, 0); souliers(c, foot[0], foot[1] + 30, sd, 1); }
    const v2 = smooth([[-76, shY], [76, shY], [72, -400], [-72, -400]]); F(c, v2, col, 5); ombre(c, v2, -40, shY, 76, -400, .3); }
  const hL = P.handL || [-92, -400], hR = P.handR || [92, -400];
  bras(c, [-70, shY + 22], hL, 12, femme ? GRIS.clair : col, P.poseL); bras(c, [70, shY + 22], hR, -12, femme ? GRIS.clair : col, P.poseR);
  c.save(); c.translate(0, shY); c.rotate(P.tilt || 0); c.translate(0, -shY);
  F(c, poly([[-14, shY + 4], [14, shY + 4], [12, shY - 30], [-12, shY - 30]]), GRIS.peau, 3);
  teteHumain(c, P, hy, { moustache: v % 3 === 0 });
  if (femme) { for (let k = -3; k <= 3; k++) F(c, ell(k * 16, hy - 52 + Math.abs(k) * 6, 16, 14), GRIS.noir, 0); F(c, ell(0, hy - 62, 64, 10), GRIS.clair, 3); F(c, smooth([[-36, hy - 64], [-30, hy - 96], [30, hy - 96], [36, hy - 64]]), GRIS.clair, 3); F(c, ell(20, hy - 80, 10, 8), GRIS.fonce, 2); }
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
function magasinNB(c, t) {
  c.fillStyle = GRIS.clair; c.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 54) { c.fillStyle = 'rgba(0,0,0,.05)'; c.fillRect(x, 0, 26, 600); }
  for (let r = 0; r < 2; r++) { const sy = 170 + r * 150; F(c, poly([[0, sy], [W, sy], [W, sy + 12], [0, sy + 12]]), GRIS.fonce, 3);
    for (let k = 0; k < 11; k++) { const x = 50 + k * 96 + (r % 2) * 40; if ((k + r) % 3) { F(c, ell(x, sy - 6, 34, 8), GRIS.moyen, 3); F(c, smooth([[x - 22, sy - 8], [x - 18, sy - 42], [x + 18, sy - 42], [x + 22, sy - 8]]), [GRIS.moyen, GRIS.fonce, GRIS.blanc][k % 3], 3); }
      else { F(c, poly([[x - 26, sy], [x + 26, sy], [x + 26, sy - 40], [x - 26, sy - 40]]), GRIS.blanc, 3); F(c, poly([[x - 3, sy], [x + 3, sy], [x + 3, sy - 40], [x - 3, sy - 40]]), GRIS.fonce, 1); } } }
  F(c, poly([[60, 40], [330, 40], [330, 110], [60, 110]]), GRIS.blanc, 5); c.save(); c.font = 'italic bold 44px Georgia, serif'; c.textAlign = 'center'; c.fillStyle = GRIS.noir; c.fillText('Épicerie fine', 195, 90); c.restore();
  ink(c, 3); c.beginPath(); c.moveTo(120, 0); c.lineTo(120, 40); c.moveTo(270, 0); c.lineTo(270, 40); c.stroke();
  F(c, poly([[700, 60], [1000, 60], [1000, 360], [700, 360]]), GRIS.blanc, 6); ink(c, 6); c.beginPath(); c.moveTo(850, 60); c.lineTo(850, 360); c.moveTo(700, 210); c.lineTo(1000, 210); c.stroke();
  c.fillStyle = GRIS.moyen; c.fillRect(0, 600, W, H - 600); ink(c, 2, 'rgba(0,0,0,.2)'); for (let k = 0; k < 18; k++) { c.beginPath(); c.moveTo(k * 70 - 60, H); c.lineTo(k * 64 + 20, 600); c.stroke(); }
  ink(c, 5); c.beginPath(); c.moveTo(0, 600); c.lineTo(W, 600); c.stroke();
  const gl = c.createRadialGradient(470, 30, 10, 470, 300, 560); gl.addColorStop(0, 'rgba(255,255,255,.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.fillRect(0, 0, W, H);
}
function comptoirNB(c, x0, x1, y) {
  F(c, poly([[x0 - 10, y], [x1 + 10, y], [x1 + 14, y + 20], [x0 - 14, y + 20]]), GRIS.moyen, 5);
  F(c, poly([[x0, y + 20], [x1, y + 20], [x1, H + 20], [x0, H + 20]]), GRIS.fonce, 5);
  for (let k = 0; k < 4; k++) { const px = x0 + 20 + k * (x1 - x0 - 40) / 3; F(c, poly([[px - 30, y + 50], [px + 30, y + 50], [px + 30, y + 160], [px - 30, y + 160]]), '#4a4640', 3); }
}
function rueNB(c, t) {
  c.fillStyle = GRIS.blanc; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 6; k++) { const x = k * 200 - 40, h = 340 + hash(k) * 120; F(c, poly([[x, 470], [x + 190, 470], [x + 190, 470 - h], [x, 470 - h]]), [GRIS.clair, GRIS.moyen, '#c4c0b6'][k % 3], 4);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) F(c, poly([[x + 20 + q * 56, 470 - h + 30 + r * 90], [x + 56 + q * 56, 470 - h + 30 + r * 90], [x + 56 + q * 56, 470 - h + 90 + r * 90], [x + 20 + q * 56, 470 - h + 90 + r * 90]]), GRIS.blanc, 2.5);
    F(c, poly([[x + 10, 390], [x + 180, 390], [x + 186, 410], [x + 4, 410]]), GRIS.fonce, 3); for (let q = 0; q < 6; q++) F(c, poly([[x + 4 + q * 30, 410], [x + 34 + q * 30, 410], [x + 19 + q * 30, 424]]), q % 2 ? GRIS.blanc : GRIS.fonce, 2); }
  for (const lx of [150, 930]) { ink(c, 10); c.beginPath(); c.moveTo(lx, 600); c.lineTo(lx, 260); c.stroke(); F(c, poly([[lx - 22, 240], [lx + 22, 240], [lx + 14, 270], [lx - 14, 270]]), GRIS.blanc, 4); }
  c.fillStyle = GRIS.moyen; c.fillRect(0, 470, W, H - 470);
  for (let y = 480; y < H; y += 26) for (let x = ((y / 26) % 2) * 22; x < W; x += 44) F(c, ell(x, y, 20, 10), '#9a968c', 1.5);
  ink(c, 5); c.beginPath(); c.moveTo(0, 470); c.lineTo(W, 470); c.stroke();
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
  for (let i = 1; i < keys.length; i++) { const a = keys[i - 1], b = keys[i]; if (t >= b[0]) { k = b; continue; } const u = ease((t - a[0]) / Math.min(1.2, Math.max(.01, b[0] - a[0]))); k = [0, lerp(a[1], b[1], u), lerp(a[2], b[2], u), lerp(a[3], b[3], u)]; break; }
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
