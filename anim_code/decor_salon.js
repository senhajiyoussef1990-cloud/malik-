// Salon rétro années 50 (couleur) d'après la charte des épisodes : murs bleu pétrole, rideaux brique, meubles en bois,
// télévision à antennes, lampe, horloge, tapis persan, fenêtre sur la rue. Fond statique mis en cache ; éléments vivants par image.
const SL = { mur: '#1f5560', mur2: '#18454f', motif: 'rgba(170,220,215,.09)', bois: '#7a4220', bois2: '#5a2e14', bois3: '#9c5a2c', dore: '#d9a04a',
  rideau: '#a8442a', rideau2: '#7a2c1a', sol: '#6a3a1c', tapis: '#8a2a20', tapis2: '#1f3a5a', tapis3: '#e0b060', creme: '#f2e2c0' };
let _fondSalon = null;
const SALON = { tv: [190, 600, .8], fenetre: [800, 96, 220, 300], miroir: [620, 210], affiche: [70, 96], horloge: [345, 150] };

function damas(c, x0, y0, x1, y1) {                       // papier peint à motifs damassés
  c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip(); c.fillStyle = SL.motif; ink(c, 1.4, SL.motif);
  for (let y = y0 + 20; y < y1; y += 64) for (let x = x0 + ((y / 64) % 2) * 36; x < x1; x += 72) {
    c.beginPath(); c.moveTo(x, y - 22); c.bezierCurveTo(x + 14, y - 12, x + 14, y + 6, x, y + 22); c.bezierCurveTo(x - 14, y + 6, x - 14, y - 12, x, y - 22); c.fill();
    c.beginPath(); c.arc(x, y - 28, 3, 0, 7); c.fill(); for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(x, y + 4); c.quadraticCurveTo(x + sd * 22, y - 4, x + sd * 18, y - 20); c.stroke(); }
  }
  c.restore();
}
function cadre(c, x, y, w, h, dessin) {                   // tableau encadré doré
  F(c, poly([[x - 10, y - 10], [x + w + 10, y - 10], [x + w + 10, y + h + 10], [x - 10, y + h + 10]]), SL.dore, 3);
  ink(c, 1.5, 'rgba(90,50,10,.6)'); c.strokeRect(x - 5, y - 5, w + 10, h + 10);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); dessin(c); c.restore(); ink(c, 3); c.strokeRect(x, y, w, h);
}
function rueSalon(c, x, y, w, h, t, file) {             // la rue derrière la fenêtre : vitrine d'en face et la file d'attente
  const ciel = c.createLinearGradient(0, y, 0, y + h); ciel.addColorStop(0, '#9ccbd8'); ciel.addColorStop(1, '#e8d4a8'); c.fillStyle = ciel; c.fillRect(x, y, w, h);
  for (let k = 0; k < 3; k++) { c.fillStyle = 'rgba(255,255,255,.8)'; const nx = x + ((k * 90 + t * 4) % (w + 80)) - 40; c.beginPath(); c.ellipse(nx, y + 30 + k * 18, 26, 8, 0, 0, 7); c.ellipse(nx + 16, y + 24 + k * 18, 18, 8, 0, 0, 7); c.fill(); }
  // façade d'en face : boutique avec auvent rayé
  F(c, poly([[x, y + 60], [x + w, y + 60], [x + w, y + h], [x, y + h]]), '#c8835a', 2);
  for (let r = 0; r < 2; r++) for (let q = 0; q < 4; q++) F(c, poly([[x + 14 + q * 56, y + 72 + r * 40], [x + 44 + q * 56, y + 72 + r * 40], [x + 44 + q * 56, y + 100 + r * 40], [x + 14 + q * 56, y + 100 + r * 40]]), (q + r) % 3 ? '#f6e0a8' : '#5a3a2a', 1.5);
  const ay = y + 160; for (let k = 0; k < 8; k++) F(c, poly([[x + k * w / 8, ay], [x + (k + 1) * w / 8, ay], [x + (k + 1) * w / 8 + 4, ay + 26], [x + k * w / 8 + 4, ay + 26]]), k % 2 ? '#f2ead8' : '#b8341c', 1.5);
  F(c, poly([[x + 20, ay + 30], [x + w - 20, ay + 30], [x + w - 20, y + h - 14], [x + 20, y + h - 14]]), '#3a2a22', 2);   // vitrine sombre
  c.fillStyle = 'rgba(255,230,170,.5)'; c.fillRect(x + 30, ay + 40, w - 60, 40);
  F(c, poly([[x, y + h - 14], [x + w, y + h - 14], [x + w, y + h], [x, y + h]]), '#9a8a78', 1.5);
  // la file : petites silhouettes colorées qui piétinent (nombre selon « file »)
  const n = Math.floor(file || 0);
  for (let k = 0; k < n; k++) {
    const px = x + w - 30 - k * 24, py = y + h - 14 + Math.abs(Math.sin(t * 3 + k)) * -2, col = ['#3a4a7a', '#7a2a2a', '#4a6a3a', '#6a4a2a', '#5a2a5a', '#2a5a6a', '#8a6a2a'][k % 7];
    if (px < x - 10) break;
    F(c, poly([[px - 7, py], [px + 7, py], [px + 6, py - 30], [px - 6, py - 30]]), col, 1.5); F(c, ell(px, py - 37, 6, 7), '#e8c8a0', 1.5);
    F(c, ell(px, py - 43, 9, 3), '#2a1a10', 1); F(c, poly([[px - 5, py - 44], [px + 5, py - 44], [px + 4, py - 50], [px - 4, py - 50]]), '#2a1a10', 1);
  }
}
function fenetreSalon(c, t, file) {
  const [x, y, w, h] = SALON.fenetre;
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); rueSalon(c, x, y, w, h, t, file); c.restore();
  ink(c, 10, SL.bois2); c.strokeRect(x, y, w, h); ink(c, 6, SL.creme); c.strokeRect(x + 3, y + 3, w - 6, h - 6);
  ink(c, 5, SL.creme); c.beginPath(); c.moveTo(x + w / 2, y); c.lineTo(x + w / 2, y + h); c.moveTo(x, y + h * .38); c.lineTo(x + w, y + h * .38); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.13)'; c.beginPath(); c.moveTo(x + 12, y + 12); c.lineTo(x + 50, y + 12); c.lineTo(x + 12, y + 80); c.fill();
  F(c, poly([[x - 16, y + h], [x + w + 16, y + h], [x + w + 22, y + h + 16], [x - 22, y + h + 16]]), SL.bois3, 3);     // appui
  plante(c, x + 40, y + h, .9);                                                             // plante sur l'appui
}
function plante(c, x, y, s) {
  c.save(); c.translate(x, y); c.scale(s, s);
  for (let k = 0; k < 7; k++) { const a = -1.4 + k * .45; F(c, smooth([[0, -20], [Math.sin(a) * 22, -30 - Math.cos(a) * 24], [Math.sin(a) * 40, -24 - Math.cos(a) * 44], [Math.sin(a) * 26, -26 - Math.cos(a) * 20]]), k % 2 ? '#3a7a3a' : '#2a5a2a', 1.8); }
  F(c, poly([[-16, 0], [16, 0], [20, -22], [-20, -22]]), '#c0603a', 2.5); F(c, poly([[-22, -22], [22, -22], [22, -28], [-22, -28]]), '#a04a2a', 2);
  c.restore();
}
function rideaux(c) {
  const [x, y, w, h] = SALON.fenetre;
  F(c, poly([[x - 70, y - 40], [x + w + 70, y - 40], [x + w + 70, y - 26], [x - 70, y - 26]]), SL.dore, 3);   // tringle
  for (const sd of [-1, 1]) {
    const rx = sd < 0 ? x - 60 : x + w + 60;
    const p = smooth([[rx, y - 30], [rx - sd * 70, y - 30], [rx - sd * 62, y + h * .35], [rx - sd * 26, y + h * .52], [rx - sd * 58, y + h + 80], [rx - sd * 40, y + h + 150], [rx, y + h + 150]]);
    F(c, p, SL.rideau, 4); ombre(c, p, rx - sd * 70, 0, rx, 0, .35);
    ink(c, 2, 'rgba(70,14,4,.55)'); for (let k = 1; k < 6; k++) { c.beginPath(); c.moveTo(rx - sd * k * 11, y - 26); c.quadraticCurveTo(rx - sd * (k * 10 + 6), y + h * .3, rx - sd * 24, y + h * .5); c.quadraticCurveTo(rx - sd * (k * 9 + 8), y + h + 40, rx - sd * k * 7, y + h + 146); c.stroke(); }
    ink(c, 1.2, 'rgba(255,200,150,.25)'); for (let k = 0; k < 8; k++) { c.beginPath(); c.moveTo(rx - sd * (8 + k * 7), y + h + 146); c.lineTo(rx - sd * (8 + k * 7), y + h + 154); c.stroke(); }   // franges
    F(c, smooth([[rx - sd * 30, y + h * .48], [rx - sd * 12, y + h * .5], [rx - sd * 12, y + h * .56], [rx - sd * 32, y + h * .56]]), SL.dore, 2);       // embrasse
    F(c, ell(rx - sd * 14, y + h * .6, 5, 9), SL.dore, 1.5);
  }
}
function horloge(c, x, y, t) {                                // horloge murale à balancier
  F(c, smooth([[x - 34, y - 40], [x, y - 58], [x + 34, y - 40], [x + 30, y + 110], [x - 30, y + 110]]), SL.bois, 4);
  F(c, ell(x, y - 10, 26, 26), SL.creme, 3); ink(c, 1.4, 'rgba(40,20,10,.7)');
  for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; c.beginPath(); c.moveTo(x + Math.sin(a) * 20, y - 10 - Math.cos(a) * 20); c.lineTo(x + Math.sin(a) * 23, y - 10 - Math.cos(a) * 23); c.stroke(); }
  const m = t * .1 + 1.2; ink(c, 2.5); c.beginPath(); c.moveTo(x, y - 10); c.lineTo(x + Math.sin(m) * 18, y - 10 - Math.cos(m) * 18); c.moveTo(x, y - 10); c.lineTo(x + Math.sin(m / 12 + 4) * 12, y - 10 - Math.cos(m / 12 + 4) * 12); c.stroke();
  F(c, poly([[x - 18, y + 22], [x + 18, y + 22], [x + 18, y + 100], [x - 18, y + 100]]), '#2a1a10', 2);
  const b = Math.sin(t * Math.PI) * .32; ink(c, 2, SL.dore); c.beginPath(); c.moveTo(x, y + 24); c.lineTo(x + Math.sin(b) * 60, y + 24 + Math.cos(b) * 60); c.stroke();
  F(c, ell(x + Math.sin(b) * 64, y + 24 + Math.cos(b) * 64, 9, 9), SL.dore, 2);
}
function lampadaire(c, x, y) {                                // lampe sur pied à abat-jour frangé
  F(c, ell(x, y, 34, 8), SL.bois2, 3); F(c, poly([[x - 4, y], [x + 4, y], [x + 4, y - 300], [x - 4, y - 300]]), SL.dore, 2);
  for (const k of [0, 1, 2]) F(c, ell(x, y - 80 - k * 90, 8, 5), SL.dore, 1.5);
  const ab = smooth([[x - 66, y - 290], [x - 42, y - 366], [x + 42, y - 366], [x + 66, y - 290]]); F(c, ab, '#e8c890', 4); ombre(c, ab, x - 66, 0, x + 66, 0, .25);
  ink(c, 1.4, 'rgba(150,100,50,.5)'); for (let k = -4; k <= 4; k++) { c.beginPath(); c.moveTo(x + k * 9, y - 364); c.lineTo(x + k * 15, y - 292); c.stroke(); }
  ink(c, 1.6, '#b07a3a'); for (let k = 0; k < 22; k++) { const fx = x - 64 + k * 6.1; c.beginPath(); c.moveTo(fx, y - 290); c.lineTo(fx, y - 278); c.stroke(); }
}
function fauteuil(c, x, y) {                                  // fauteuil club en velours moutarde
  const dos = smooth([[x - 90, y - 60], [x - 80, y - 200], [x, y - 214], [x + 80, y - 200], [x + 90, y - 60]]); F(c, dos, '#c08a2a', 5); ombre(c, dos, x - 90, 0, x + 90, 0, .3);
  ink(c, 2, 'rgba(90,50,10,.5)'); for (let k = -2; k <= 2; k++) for (let r = 0; r < 3; r++) { c.beginPath(); c.arc(x + k * 30, y - 170 + r * 36, 2.4, 0, 7); c.stroke(); }
  for (const sd of [-1, 1]) { const ac = smooth([[x + sd * 70, y - 20], [x + sd * 110, y - 20], [x + sd * 116, y - 118], [x + sd * 92, y - 132], [x + sd * 70, y - 110]]); F(c, ac, '#b07a22', 5); ombre(c, ac, x + sd * 70, 0, x + sd * 116, 0, .3); }
  F(c, smooth([[x - 74, y - 20], [x - 74, y - 76], [x + 74, y - 76], [x + 74, y - 20]]), '#d09a3a', 4);
  for (const sd of [-1, 1]) F(c, poly([[x + sd * 92, y - 20], [x + sd * 104, y - 20], [x + sd * 100, y], [x + sd * 94, y]]), SL.bois2, 2);
}
function bahut(c, x, y, w) {                                  // buffet en bois avec radio, vase, photos
  const corps = poly([[x, y], [x + w, y], [x + w, y - 120], [x, y - 120]]); F(c, corps, SL.bois, 4); ombre(c, corps, x, y - 120, x + w, y, .3);
  F(c, poly([[x - 8, y - 120], [x + w + 8, y - 120], [x + w + 8, y - 132], [x - 8, y - 132]]), SL.bois3, 3);
  for (let k = 0; k < 2; k++) { const p = poly([[x + 12 + k * (w / 2), y - 108], [x + w / 2 - 6 + k * (w / 2), y - 108], [x + w / 2 - 6 + k * (w / 2), y - 16], [x + 12 + k * (w / 2), y - 16]]); F(c, p, SL.bois3, 2.5); ink(c, 1.4, 'rgba(255,200,140,.2)'); c.strokeRect(x + 20 + k * (w / 2), y - 100, w / 2 - 34, 76); F(c, ell(x + w / 2 - 16 + k * 16, y - 62, 4, 4), SL.dore, 1.5); }
  for (const px of [x + 10, x + w - 10]) F(c, poly([[px - 5, y], [px + 5, y], [px + 3, y + 16], [px - 3, y + 16]]), SL.bois2, 2);
  // radio TSF
  const r = poly([[x + 20, y - 132], [x + 110, y - 132], [x + 110, y - 196], [x + 20, y - 196]]); F(c, smooth([[x + 20, y - 132], [x + 20, y - 186], [x + 65, y - 208], [x + 110, y - 186], [x + 110, y - 132]]), '#8a4a22', 3);
  F(c, smooth([[x + 32, y - 140], [x + 32, y - 180], [x + 65, y - 196], [x + 98, y - 180], [x + 98, y - 140]]), '#e8c890', 2); ink(c, 1.3, 'rgba(120,70,30,.6)'); for (let k = 0; k < 7; k++) { c.beginPath(); c.moveTo(x + 40 + k * 8.5, y - 142); c.lineTo(x + 40 + k * 8.5, y - 182 + Math.abs(k - 3) * 3); c.stroke(); }
  for (const k of [0, 1]) F(c, ell(x + 48 + k * 34, y - 138, 5, 5), SL.dore, 1.5);
  // vase de fleurs
  const vx = x + w - 50; F(c, smooth([[vx - 14, y - 132], [vx - 20, y - 160], [vx - 8, y - 184], [vx + 8, y - 184], [vx + 20, y - 160], [vx + 14, y - 132]]), '#2a6a8a', 3);
  for (let k = 0; k < 6; k++) { const a = -1 + k * .4; ink(c, 2, '#3a6a2a'); c.beginPath(); c.moveTo(vx, y - 184); c.lineTo(vx + Math.sin(a) * 40, y - 214 - Math.cos(a) * 20); c.stroke(); F(c, ell(vx + Math.sin(a) * 40, y - 216 - Math.cos(a) * 20, 8, 8), ['#e8504a', '#f0d040', '#f2f0e8'][k % 3], 1.5); F(c, ell(vx + Math.sin(a) * 40, y - 216 - Math.cos(a) * 20, 3, 3), '#8a4a10', 0); }
  // photo encadrée
  cadre(c, x + 140, y - 186, 40, 50, (c) => { c.fillStyle = '#d8c8a8'; c.fillRect(x + 140, y - 186, 40, 50); F(c, ell(x + 160, y - 166, 9, 11), '#8a7a6a', 1); F(c, poly([[x + 146, y - 136], [x + 174, y - 136], [x + 170, y - 152], [x + 150, y - 152]]), '#6a5a4a', 1); });
}
function tapisPersan(c, cx, cy, rx, ry) {                     // tapis persan en perspective
  const p = (u, v) => [cx + u * rx * (1 + v * .12), cy + v * ry];
  const quad = (u0, v0, u1, v1) => poly([p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1)]);
  F(c, quad(-1, -1, 1, 1), SL.tapis, 4); F(c, quad(-.92, -.8, .92, .8), SL.tapis2, 2); F(c, quad(-.84, -.62, .84, .62), SL.tapis, 2);
  ink(c, 2, SL.tapis3); for (let k = 0; k < 24; k++) { const u = -.96 + k * .083; const [a, b] = p(u, -.9); c.beginPath(); c.moveTo(a, b); c.lineTo(a + 6, b + 5); c.lineTo(a + 12, b); c.stroke(); const [d, e] = p(u, .9); c.beginPath(); c.moveTo(d, e); c.lineTo(d + 6, e - 5); c.lineTo(d + 12, e); c.stroke(); }
  const [mx, my] = p(0, 0); c.save(); c.translate(mx, my); c.scale(1, ry / rx * 1.6);
  F(c, poly([[0, -70], [90, 0], [0, 70], [-90, 0]]), SL.tapis3, 2.5); F(c, poly([[0, -50], [62, 0], [0, 50], [-62, 0]]), SL.tapis2, 2); F(c, poly([[0, -26], [32, 0], [0, 26], [-32, 0]]), '#c04a30', 2);
  F(c, ell(0, 0, 8, 8), SL.tapis3, 1.5); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; F(c, ell(Math.cos(a) * 44, Math.sin(a) * 34, 5, 5), SL.creme, 1); }
  c.restore();
  for (const [u, v] of [[-.7, -.4], [.7, -.4], [-.7, .4], [.7, .4]]) { const [a, b] = p(u, v); F(c, ell(a, b, 20, 9), SL.tapis3, 1.5); F(c, ell(a, b, 9, 4), '#c04a30', 1); }
  ink(c, 1.4, SL.creme); for (const sd of [-1, 1]) for (let k = 0; k < 22; k++) { const [a, b] = p(sd * 1, -1 + k * .095); c.beginPath(); c.moveTo(a, b); c.lineTo(a + sd * 10, b); c.stroke(); }
}
function affiche(c, x, y) {                                   // affiche de boutique : trois personnes avec le même chapeau
  cadre(c, x, y, 150, 200, (c) => {
    c.fillStyle = '#f0dcae'; c.fillRect(x, y, 150, 200);
    c.fillStyle = '#b8341c'; c.fillRect(x, y, 150, 34); c.save(); c.font = 'bold 20px Georgia'; c.textAlign = 'center'; c.fillStyle = '#f6ead0'; c.fillText('LA MODE !', x + 75, y + 24); c.restore();
    for (let k = 0; k < 3; k++) { const px = x + 30 + k * 45, py = y + 186;
      F(c, poly([[px - 14, py], [px + 14, py], [px + 12, py - 70], [px - 12, py - 70]]), ['#3a4a7a', '#7a2a2a', '#3a6a4a'][k], 1.5);
      F(c, ell(px, py - 84, 11, 13), '#e8c8a0', 1.5); chapeauMode(c, px, py - 94, .17); }
    c.save(); c.font = 'italic 12px Georgia'; c.textAlign = 'center'; c.fillStyle = '#5a2a12'; c.fillText('Tout le monde le porte', x + 75, y + 50); c.restore();
  });
}
function chapeauMode(c, x, y, s, rot = 0) {                   // le chapeau « improbable » à la mode : haut, violet, damier et plume
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  F(c, ell(0, 0, 92, 20), '#5a2a6a', 5); ombre(c, ell(0, 0, 92, 20), -92, 0, 92, 0, .3);
  const cou = smooth([[-56, -4], [-62, -90], [-40, -150], [40, -150], [62, -90], [56, -4]]); F(c, cou, '#7a3a8a', 5); ombre(c, cou, -60, 0, 60, 0, .35); reflet(c, cou, -26, -100, 12, 30, .22, 0);
  const bande = poly([[-58, -22], [58, -22], [60, -54], [-60, -54]]); F(c, bande, '#f2ead8', 3);
  c.save(); c.clip(bande); for (let k = -6; k < 6; k++) { c.fillStyle = '#2a1a2a'; c.fillRect(k * 20, -54, 10, 16); c.fillRect(k * 20 + 10, -38, 10, 16); } c.restore(); ink(c, 3); c.stroke(bande);
  F(c, smooth([[40, -40], [92, -150], [128, -196], [104, -130], [66, -40]]), '#f0c030', 3); ink(c, 1.6, '#a07010'); c.beginPath(); c.moveTo(48, -44); c.quadraticCurveTo(92, -120, 124, -190); c.stroke();
  for (let k = 0; k < 8; k++) { const u = k / 8; ink(c, 1.2, '#a07010'); c.beginPath(); c.moveTo(48 + u * 70, -44 - u * 140); c.lineTo(64 + u * 74, -48 - u * 136); c.stroke(); }
  F(c, ell(44, -40, 14, 12), '#e8504a', 3); F(c, ell(44, -40, 6, 5), '#f6c040', 0);
  F(c, ell(0, -150, 40, 8), '#8a4a9a', 3);
  c.restore();
}
function miroir(c, x, y, t) {                                 // grand miroir ovale ancien ; reflète le mouton s'il est devant
  const o = ell(x, y, 70, 96); F(c, ell(x, y, 84, 110), SL.dore, 4);
  for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8; F(c, ell(x + Math.cos(a) * 78, y + Math.sin(a) * 103, 5, 5), '#c08a30', 1.2); }
  F(c, smooth([[x - 26, y - 112], [x, y - 140], [x + 26, y - 112]]), SL.dore, 3);
  const g = c.createLinearGradient(x - 70, y - 96, x + 70, y + 96); g.addColorStop(0, '#cfe4e6'); g.addColorStop(.5, '#9cbcc4'); g.addColorStop(1, '#7aa0aa'); c.fillStyle = g; c.fill(o); ink(c, 4); c.stroke(o);
  c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(x - 44, y - 60); c.lineTo(x - 20, y - 80); c.lineTo(x - 50, y + 10); c.fill();
}
function televiseurSalon(c, x, y, s, on, t) {                 // téléviseur en bois sur pieds, antennes en V, gros boutons
  c.save(); c.translate(x, y); c.scale(s, s);
  for (const sd of [-1, 1]) F(c, poly([[sd * 100, 0], [sd * 112, 0], [sd * 124, 70], [sd * 114, 70]]), SL.bois2, 3);   // pieds compas
  const caisse = smooth([[-150, 0], [-158, -210], [-140, -226], [140, -226], [158, -210], [150, 0]]); F(c, caisse, '#8a4a22', 5); ombre(c, caisse, -150, 0, 158, 0, .35); reflet(c, caisse, -80, -214, 50, 6, .25, 0);
  ink(c, 1.4, 'rgba(60,20,4,.35)'); for (let k = 0; k < 9; k++) { c.beginPath(); c.moveTo(-150, -20 - k * 22); c.bezierCurveTo(-60, -26 - k * 22, 40, -14 - k * 22, 150, -22 - k * 22); c.stroke(); }   // veinage
  for (const sd of [-1, 1]) { ink(c, 3, '#c8c8c0'); c.beginPath(); c.moveTo(sd * 10, -226); c.lineTo(sd * 120, -380); c.stroke(); F(c, ell(sd * 120, -380, 5, 5), '#e8e8e0', 1.5); }
  F(c, smooth([[-26, -226], [-20, -246], [20, -246], [26, -226]]), '#3a2a20', 3);
  const ecran = smooth([[-126, -28], [-132, -196], [64, -196], [58, -28]]); F(c, ecran, '#14110e', 5);
  c.save(); c.clip(ecran);
  if (on > 0) { c.fillStyle = `rgba(214,216,206,${on})`; c.fillRect(-140, -200, 210, 180); for (let k = 0; k < 70; k++) { const h = hash(k + Math.floor(t * 30) * 7); c.fillStyle = `rgba(${h > .5 ? 255 : 0},${h > .5 ? 255 : 0},${h > .5 ? 255 : 0},${.3 * on})`; c.fillRect(-130 + hash(k * 3 + t * 20) * 190, -196 + hash(k * 7 + t * 20) * 168, 7, 2); } }
  c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(-70, -160, 56, 18, -.3, 0, 7); c.fill(); c.restore();
  ink(c, 4, SL.dore); c.stroke(ecran);
  F(c, poly([[78, -200], [140, -200], [140, -24], [78, -24]]), '#6a3418', 3);
  for (let k = 0; k < 2; k++) { F(c, ell(109, -168 + k * 52, 18, 18), '#d9a04a', 3); ink(c, 3, '#5a3010'); c.beginPath(); c.moveTo(109, -168 + k * 52); c.lineTo(109 + Math.sin(k + (on ? 1.4 : 0)) * 14, -168 + k * 52 - Math.cos(k + (on ? 1.4 : 0)) * 14); c.stroke(); }
  ink(c, 2, '#3a1a0a'); for (let k = 0; k < 6; k++) { c.beginPath(); c.moveTo(88, -80 + k * 9); c.lineTo(130, -80 + k * 9); c.stroke(); }
  if (on > 0) F(c, ell(109, -36, 5, 5), `rgba(255,80,40,${on})`, 1.5);
  c.restore();
  return [x + (-34) * s, y - 112 * s, 190 * s, 168 * s];     // centre et taille de l'écran
}
function fondSalon() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  c.fillStyle = SL.mur; c.fillRect(0, 0, W, H); damas(c, 0, 0, W, 470);
  const lum = c.createRadialGradient(560, 200, 40, 560, 300, 700); lum.addColorStop(0, 'rgba(255,220,160,.16)'); lum.addColorStop(1, 'rgba(0,0,0,.25)'); c.fillStyle = lum; c.fillRect(0, 0, W, 470);
  F(c, poly([[0, 0], [W, 0], [W, 18], [0, 18]]), SL.creme, 2); F(c, poly([[0, 18], [W, 18], [W, 26], [0, 26]]), SL.dore, 1.5);   // corniche
  // lambris bas
  F(c, poly([[0, 470], [W, 470], [W, 640], [0, 640]]), SL.bois2, 0);
  for (let x = 10; x < W; x += 120) { const p = poly([[x, 486], [x + 104, 486], [x + 104, 626], [x, 626]]); F(c, p, SL.bois, 3); ombre(c, p, x, 486, x + 104, 626, .25); ink(c, 2, 'rgba(255,200,140,.15)'); c.strokeRect(x + 8, 494, 88, 124); }
  F(c, poly([[0, 462], [W, 462], [W, 476], [0, 476]]), SL.bois3, 3);
  // plancher
  c.fillStyle = SL.sol; c.fillRect(0, 640, W, H - 640);
  for (let y = 640, r = 0; y < H; y += 22, r++) { ink(c, 1.5, 'rgba(30,10,0,.45)'); c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = (r % 2) * 90; x < W; x += 180) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 22); c.stroke(); } c.fillStyle = r % 2 ? 'rgba(255,200,140,.05)' : 'rgba(0,0,0,.05)'; c.fillRect(0, y, W, 22); }
  ink(c, 4); c.beginPath(); c.moveTo(0, 640); c.lineTo(W, 640); c.stroke();
  tapisPersan(c, 540, 726, 330, 62);
  // murs : affiche, cadres, horloge (dynamique), miroir
  affiche(c, ...SALON.affiche);
  cadre(c, 430, 70, 80, 60, (c) => { const g = c.createLinearGradient(0, 70, 0, 130); g.addColorStop(0, '#f2c27a'); g.addColorStop(1, '#6a9aa0'); c.fillStyle = g; c.fillRect(430, 70, 80, 60); F(c, poly([[430, 130], [455, 96], [478, 116], [510, 88], [510, 130]]), '#3a5a4a', 1.5); F(c, ell(492, 84, 7, 7), '#fff0c0', 0); });
  cadre(c, 250, 300, 60, 76, (c) => { c.fillStyle = '#e8d8b8'; c.fillRect(250, 300, 60, 76); F(c, ell(280, 328, 13, 15), '#8a6a5a', 1); F(c, poly([[258, 376], [302, 376], [296, 352], [264, 352]]), '#5a4a3a', 1); });
  miroir(c, ...SALON.miroir, 0);
  rideaux(c);
  bahut(c, 830, 640, 210);
  lampadaire(c, 752, 640);
  const vg = c.createRadialGradient(W * .5, H * .45, H * .35, W * .5, H * .5, H); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,20,20,.38)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  return cv;
}
// salon(c, t, {file, tv, horloge}) : fond + éléments vivants. Renvoie le rectangle de l'écran de télé.
function salon(c, t, o = {}) {
  if (!_fondSalon) _fondSalon = fondSalon();
  c.drawImage(_fondSalon, 0, 0);
  c.save(); fenetreSalon(c, t, o.file || 0); c.restore();
  rideaux(c);
  horloge(c, ...SALON.horloge, t);
  const gl = c.createRadialGradient(752, 300, 10, 752, 380, 420), a = .2 + .03 * Math.sin(t * 2.1);   // halo de la lampe
  gl.addColorStop(0, `rgba(255,220,150,${a})`); gl.addColorStop(1, 'rgba(255,220,150,0)'); c.fillStyle = gl; c.fillRect(250, 0, 830, 760);
  const [tx, ty, ts] = SALON.tv, rect = televiseurSalon(c, tx, ty, ts, o.tv || 0, t);
  if (o.tv > 0) { const h = c.createRadialGradient(rect[0], rect[1], 20, rect[0], rect[1], 380); h.addColorStop(0, `rgba(200,220,255,${.22 * o.tv})`); h.addColorStop(1, 'rgba(200,220,255,0)'); c.fillStyle = h; c.fillRect(0, 0, W, H); }
  c.fillStyle = 'rgba(255,236,190,.45)';
  for (let k = 0; k < 16; k++) { const x = (hash(k) * 760 + t * 7 * (hash(k + 3) - .3)) % 760 + 160, y = 120 + (hash(k + 9) * 400 + t * 5) % 400; c.beginPath(); c.arc(x, y, 1.1 + hash(k + 5), 0, 7); c.fill(); }
  return rect;
}
