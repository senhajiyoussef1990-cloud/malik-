// Chapellerie détaillée (couleur, lumière chaude). Fond statique dessiné une fois puis mis en cache.
// Remplace boutique() et comptoir() de decor.js. Pas d'effet « vieille pellicule » dans la boutique.
const BQ = { mur: '#6a3418', mur2: '#5a2a12', bois: '#7a3a18', bois2: '#5e2a10', bois3: '#9a5226', dore: '#d9a04a', sol: '#5b2e14' };
let _fondBoutique = null;

function chapeauStand(c, x, y, s, type, col, col2) {      // chapeau posé sur un porte-chapeau en laiton
  c.save(); c.translate(x, y); c.scale(s, s);
  F(c, ell(0, 0, 16, 5), '#b8862e', 2.5); F(c, poly([[-3, 0], [3, 0], [3, -26], [-3, -26]]), '#c9963a', 2); F(c, ell(0, -28, 10, 8), '#d9a64a', 2);
  if (type === 'cloche') { const p = smooth([[-30, -26], [-26, -58], [0, -66], [26, -58], [30, -26]]); F(c, p, col, 3); ombre(c, p, -30, 0, 30, 0, .3); F(c, poly([[-30, -34], [30, -34], [30, -28], [-30, -28]]), col2, 2); F(c, ell(18, -36, 7, 5), col2, 2); }
  else if (type === 'haut') { F(c, ell(0, -28, 36, 7), col, 3); const p = poly([[-22, -30], [22, -30], [20, -86], [-20, -86]]); F(c, p, col, 3); ombre(c, p, -22, 0, 22, 0, .35); F(c, ell(0, -86, 20, 5), col, 2.5); F(c, poly([[-22, -40], [22, -40], [22, -32], [-22, -32]]), col2, 2); }
  else if (type === 'canotier') { F(c, ell(0, -30, 40, 9), col, 3); const p = poly([[-24, -32], [24, -32], [22, -52], [-22, -52]]); F(c, p, col, 3); F(c, ell(0, -52, 22, 5), col, 2); F(c, poly([[-24, -42], [24, -42], [24, -35], [-24, -35]]), col2, 2); ink(c, 1, 'rgba(120,80,20,.5)'); for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(k * 11, -26); c.lineTo(k * 12, -34); c.stroke(); } }
  else if (type === 'plume') { F(c, ell(0, -30, 42, 10), col, 3); const p = smooth([[-26, -32], [-22, -58], [22, -58], [26, -32]]); F(c, p, col, 3); ombre(c, p, -26, 0, 26, 0, .3); F(c, smooth([[10, -50], [30, -96], [44, -110], [34, -78], [20, -50]]), '#efe2c8', 2); ink(c, 1, 'rgba(120,90,60,.6)'); c.beginPath(); c.moveTo(14, -52); c.quadraticCurveTo(28, -80, 42, -106); c.stroke(); F(c, ell(-12, -42, 9, 7), '#c04040', 2); F(c, ell(-4, -44, 7, 6), '#d86060', 1.5); }
  else { F(c, ell(0, -30, 40, 8), col, 3); const p = smooth([[-24, -32], [-20, -58], [0, -64], [20, -58], [24, -32]]); F(c, p, col, 3); ombre(c, p, -24, 0, 24, 0, .3); ink(c, 2, col2); c.beginPath(); c.moveTo(-10, -62); c.quadraticCurveTo(0, -54, 10, -62); c.stroke(); F(c, poly([[-24, -40], [24, -40], [24, -33], [-24, -33]]), col2, 2); }
  c.restore();
}
function boiteChapeau(c, x, y, w, h, col, motif) {        // boîte à chapeau ronde à motifs
  const corps = poly([[x - w / 2, y], [x + w / 2, y], [x + w / 2, y - h], [x - w / 2, y - h]]);
  F(c, ell(x, y, w / 2, 6), col, 2.5); F(c, corps, col, 3); ombre(c, corps, x - w / 2, 0, x + w / 2, 0, .35);
  c.save(); c.clip(corps); c.fillStyle = motif;
  for (let yy = y - h + 6; yy < y; yy += 10) for (let xx = x - w / 2 + ((yy / 10) % 2) * 5; xx < x + w / 2; xx += 10) { c.beginPath(); c.arc(xx, yy, 1.6, 0, 7); c.fill(); }
  c.restore();
  F(c, poly([[x - w / 2 - 3, y - h + 8], [x + w / 2 + 3, y - h + 8], [x + w / 2 + 3, y - h - 2], [x - w / 2 - 3, y - h - 2]]), col, 2.5);
  F(c, ell(x, y - h - 2, w / 2 + 3, 5), col, 2.5); F(c, poly([[x - 3, y - h - 2], [x + 3, y - h - 2], [x + 3, y], [x - 3, y]]), '#8a1e1a', 1.5);
  F(c, smooth([[x, y - h - 4], [x - 10, y - h - 12], [x - 8, y - h + 2]]), '#a8281e', 1.5); F(c, smooth([[x, y - h - 4], [x + 10, y - h - 12], [x + 8, y - h + 2]]), '#a8281e', 1.5);
}
function etagere(c, x0, x1, y) {
  F(c, poly([[x0, y], [x1, y], [x1, y + 14], [x0, y + 14]]), BQ.bois3, 3);
  F(c, poly([[x0, y + 14], [x1, y + 14], [x1, y + 20], [x0, y + 20]]), BQ.bois2, 2);
  for (const bx of [x0 + 20, x1 - 20]) F(c, smooth([[bx - 6, y + 20], [bx + 6, y + 20], [bx + 2, y + 40], [bx - 2, y + 40]]), BQ.bois2, 2);   // consoles
}
function fenetre(c, x, y, w, h) {
  // rue du soir à travers la vitrine : façades, lampadaires, pavés
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const ciel = c.createLinearGradient(0, y, 0, y + h); ciel.addColorStop(0, '#f4b870'); ciel.addColorStop(1, '#e48a4a'); c.fillStyle = ciel; c.fillRect(x, y, w, h);
  for (let k = 0; k < 5; k++) { const fx = x + k * w / 4 - 20, fh = h * (.55 + hash(k) * .25); F(c, poly([[fx, y + h], [fx + w / 4 - 6, y + h], [fx + w / 4 - 6, y + h - fh], [fx, y + h - fh]]), ['#b8683a', '#c87a4a', '#a85a32'][k % 3], 2);
    for (let r = 0; r < 3; r++) for (let q = 0; q < 2; q++) F(c, poly([[fx + 10 + q * 26, y + h - fh + 16 + r * 34], [fx + 28 + q * 26, y + h - fh + 16 + r * 34], [fx + 28 + q * 26, y + h - fh + 40 + r * 34], [fx + 10 + q * 26, y + h - fh + 40 + r * 34]]), hash(k * 7 + r * 3 + q) > .5 ? '#ffe2a0' : '#7a3a20', 1.5); }
  const lx = x + w * .62; F(c, poly([[lx - 3, y + h], [lx + 3, y + h], [lx + 3, y + h * .3], [lx - 3, y + h * .3]]), '#3a1a0a', 1.5); F(c, ell(lx, y + h * .28, 10, 12), '#ffe8a0', 2);
  c.fillStyle = 'rgba(255,220,150,.35)'; c.beginPath(); c.arc(lx, y + h * .28, 30, 0, 7); c.fill();
  c.restore();
  // châssis en bois et petits carreaux
  F(c, poly([[x - 14, y - 14], [x + w + 14, y - 14], [x + w + 14, y], [x - 14, y]]), BQ.bois3, 3);
  ink(c, 9, BQ.bois2); c.strokeRect(x, y, w, h); ink(c, 5, BQ.bois2);
  for (let k = 1; k < 3; k++) { c.beginPath(); c.moveTo(x + k * w / 3, y); c.lineTo(x + k * w / 3, y + h); c.stroke(); }
  c.beginPath(); c.moveTo(x, y + h * .42); c.lineTo(x + w, y + h * .42); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.moveTo(x + 10, y + 10); c.lineTo(x + 40, y + 10); c.lineTo(x + 10, y + 60); c.fill();
  // rideaux noués
  for (const sd of [-1, 1]) {
    const rx = sd < 0 ? x - 10 : x + w + 10;
    const p = smooth([[rx, y - 10], [rx - sd * 40, y - 10], [rx - sd * 30, y + h * .45], [rx - sd * 6, y + h * .55], [rx - sd * 34, y + h + 10], [rx, y + h + 10]]);
    F(c, p, '#8a2a1e', 3); ombre(c, p, rx - sd * 40, 0, rx, 0, .35); ink(c, 1.6, 'rgba(60,10,0,.5)'); for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(rx - sd * k * 9, y); c.quadraticCurveTo(rx - sd * (k * 8 + 4), y + h * .3, rx - sd * 10, y + h * .5); c.stroke(); }
    F(c, ell(rx - sd * 16, y + h * .52, 8, 6), BQ.dore, 2);
  }
  // lettrage doré sur la vitre
  c.save(); c.font = 'italic bold 30px Georgia, serif'; c.textAlign = 'center'; c.fillStyle = 'rgba(232,186,90,.85)'; c.strokeStyle = 'rgba(90,40,10,.6)'; c.lineWidth = 2;
  c.strokeText('Chapellerie', x + w / 2, y + h * .3); c.fillText('Chapellerie', x + w / 2, y + h * .3); c.restore();
}
function lampe(c, x, y) {
  ink(c, 3); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, y - 30); c.stroke();
  F(c, ell(x, y - 30, 6, 4), BQ.dore, 2);
  const abat = smooth([[x - 60, y + 10], [x - 34, y - 26], [x + 34, y - 26], [x + 60, y + 10]]); F(c, abat, '#c98a3a', 4); ombre(c, abat, x - 60, 0, x + 60, 0, .3); reflet(c, abat, x - 26, y - 14, 14, 6, .3);
  F(c, poly([[x - 60, y + 10], [x + 60, y + 10], [x + 56, y + 16], [x - 56, y + 16]]), '#8a5a22', 2); F(c, ell(x, y + 16, 16, 8), '#fff4cc', 2);
}
function fondBoutique() {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d');
  // mur lambrissé + papier peint à motifs
  c.fillStyle = BQ.mur; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(255,200,140,.06)'; for (let y = 10; y < 470; y += 34) for (let x = (y / 34 % 2) * 17; x < W; x += 34) { c.beginPath(); c.moveTo(x, y - 6); c.lineTo(x + 5, y); c.lineTo(x, y + 6); c.lineTo(x - 5, y); c.fill(); }
  F(c, poly([[0, 470], [W, 470], [W, 640], [0, 640]]), BQ.bois2, 0);
  for (let x = 10; x < W; x += 120) { const p = poly([[x, 486], [x + 104, 486], [x + 104, 626], [x, 626]]); F(c, p, BQ.bois, 3); ombre(c, p, x, 486, x + 104, 626, .25); ink(c, 2, 'rgba(255,200,140,.15)'); c.strokeRect(x + 8, 494, 88, 124); }
  F(c, poly([[0, 462], [W, 462], [W, 476], [0, 476]]), BQ.bois3, 3);                                     // cimaise
  // vitrine sur la droite
  fenetre(c, 790, 70, 250, 330);
  // grandes étagères à gauche : boîtes à chapeaux, chapeaux sur porte-chapeaux, rubans, ciseaux
  const COLS = [['#b5532f', '#7a2a14'], ['#e2c38f', '#8a5a2a'], ['#8a3a2a', '#e0a83a'], ['#d99a5a', '#7a3a18'], ['#4a3a32', '#a8281e'], ['#efd9b0', '#c05a2a'], ['#6e2a3a', '#e0b070']];
  const TYP = ['cloche', 'haut', 'canotier', 'plume', 'melon'];
  for (let r = 0; r < 3; r++) {
    const sy = 150 + r * 150; etagere(c, 0, 760, sy);
    for (let k = 0; k < 9; k++) {
      const x = 46 + k * 82 + (r % 2) * 28; const [a, b] = COLS[(k * 3 + r * 2) % COLS.length];
      if ((k + r) % 4 === 1) boiteChapeau(c, x, sy, 58, 40 + (k % 2) * 12, a, b);
      else if ((k + r) % 4 === 3 && r === 1) { // pile de rubans et bobines
        for (let q = 0; q < 3; q++) { const by = sy - q * 14; F(c, poly([[x - 26, by], [x + 26, by], [x + 26, by - 12], [x - 26, by - 12]]), COLS[(k + q) % 7][0], 2); }
        F(c, ell(x + 18, sy - 52, 8, 8), '#a8281e', 2); F(c, ell(x - 14, sy - 50, 7, 7), '#e0a83a', 2);
      } else chapeauStand(c, x, sy, .9, TYP[(k + r * 2) % 5], a, b);
    }
  }
  // tableau d'outils de chapelier (ciseaux, mètre ruban) entre les étagères et la vitrine
  F(c, poly([[700, 90], [770, 90], [770, 140], [700, 140]]), BQ.bois3, 3);
  ink(c, 3, '#c9c4b8'); c.beginPath(); c.arc(718, 106, 7, 0, 7); c.arc(730, 106, 7, 0, 7); c.stroke(); c.beginPath(); c.moveTo(722, 112); c.lineTo(744, 134); c.moveTo(726, 112); c.lineTo(712, 134); c.stroke();
  ink(c, 4, '#e8d8a0'); c.beginPath(); c.moveTo(750, 100); c.quadraticCurveTo(766, 120, 752, 136); c.stroke();
  // horloge murale
  F(c, ell(735, 40, 26, 26), BQ.bois3, 4); F(c, ell(735, 40, 20, 20), '#f2e6c8', 2); ink(c, 2.5); c.beginPath(); c.moveTo(735, 40); c.lineTo(735, 26); c.moveTo(735, 40); c.lineTo(745, 44); c.stroke();
  // parquet en chevrons + tapis à motifs
  c.fillStyle = BQ.sol; c.fillRect(0, 640, W, H - 640);
  for (let y = 640; y < H; y += 22) for (let x = -40 + ((y - 640) / 22 % 2) * 40; x < W; x += 80) {
    F(c, poly([[x, y], [x + 40, y + 11], [x + 40, y + 22], [x, y + 11]]), (Math.floor(x / 80) + Math.floor(y / 22)) % 2 ? '#62321a' : '#56290f', 1);
    F(c, poly([[x + 40, y + 11], [x + 80, y], [x + 80, y + 11], [x + 40, y + 22]]), (Math.floor(x / 80) + Math.floor(y / 22)) % 2 ? '#56290f' : '#62321a', 1);
  }
  const tapis = poly([[560, 700], [1000, 700], [1050, 800], [510, 800]]); F(c, tapis, '#8a2a1e', 3);
  c.save(); c.clip(tapis); ink(c, 3, '#d9a04a'); c.strokeRect(540, 712, 480, 80); c.fillStyle = 'rgba(217,160,74,.6)';
  for (let x = 560; x < 1020; x += 40) { c.beginPath(); c.moveTo(x, 752); c.lineTo(x + 12, 740); c.lineTo(x + 24, 752); c.lineTo(x + 12, 764); c.fill(); } c.restore();
  ink(c, 4); c.beginPath(); c.moveTo(0, 640); c.lineTo(W, 640); c.stroke();
  // vignettage chaud léger
  const vg = c.createRadialGradient(W * .45, H * .45, H * .3, W * .5, H * .5, H); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(30,10,0,.42)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
  return cv;
}
function boutique(c, t) {
  if (!_fondBoutique) _fondBoutique = fondBoutique();
  c.drawImage(_fondBoutique, 0, 0);
  for (const lx of [300, 610]) {                                                     // lampes qui respirent
    const gl = c.createRadialGradient(lx, 110, 10, lx, 330, 470), a = .24 + .04 * Math.sin(t * 2.2 + lx);
    gl.addColorStop(0, `rgba(255,214,140,${a})`); gl.addColorStop(1, 'rgba(255,214,140,0)'); c.fillStyle = gl; c.fillRect(lx - 480, 0, 960, 760);
    lampe(c, lx, 90);
  }
  c.fillStyle = 'rgba(255,230,180,.5)';                                               // poussière dans la lumière
  for (let k = 0; k < 18; k++) { const x = (hash(k) * 700 + t * 8 * (hash(k + 3) - .3)) % 700 + 100, y = 140 + (hash(k + 9) * 380 + t * 6) % 380; c.beginPath(); c.arc(x, y, 1.2 + hash(k + 5), 0, 7); c.fill(); }
}
function comptoir(c, x0, x1, y) {                         // comptoir vitré en bois sculpté, chapeaux exposés dedans
  const plateau = poly([[x0 - 14, y], [x1 + 14, y], [x1 + 18, y + 22], [x0 - 18, y + 22]]); F(c, plateau, '#a86a34', 5); reflet(c, plateau, (x0 + x1) / 2, y + 6, (x1 - x0) * .4, 5, .25, 0);
  const caisse = poly([[x0, y + 22], [x1, y + 22], [x1, H + 30], [x0, H + 30]]); F(c, caisse, BQ.bois, 5); ombre(c, caisse, x0, y, x1, H, .3);
  const vitre = poly([[x0 + 18, y + 36], [x1 - 18, y + 36], [x1 - 18, y + 176], [x0 + 18, y + 176]]); F(c, vitre, '#3a1a0c', 4);
  const n = 5; for (let k = 0; k < n; k++) { const hx = x0 + 60 + k * (x1 - x0 - 120) / (n - 1); chapeauStand(c, hx, y + 168, .72, ['melon', 'cloche', 'canotier', 'plume', 'cloche'][k], ['#e2c38f', '#8a3a2a', '#efd9b0', '#6e2a3a', '#d99a5a'][k], ['#8a5a2a', '#e0a83a', '#c05a2a', '#e0b070', '#7a3a18'][k]); }
  c.fillStyle = 'rgba(255,240,210,.13)'; c.beginPath(); c.moveTo(x0 + 30, y + 40); c.lineTo(x0 + 110, y + 40); c.lineTo(x0 + 50, y + 172); c.lineTo(x0 + 30, y + 172); c.fill();   // reflet de la vitre
  ink(c, 3, BQ.dore); c.strokeRect(x0 + 18, y + 36, x1 - x0 - 36, 140);
  for (const px of [x0 + 8, x1 - 8]) F(c, poly([[px - 6, y + 22], [px + 6, y + 22], [px + 6, H + 30], [px - 6, H + 30]]), BQ.bois3, 2);   // pilastres
  F(c, poly([[x0 + 18, y + 190], [x1 - 18, y + 190], [x1 - 18, y + 200], [x0 + 18, y + 200]]), BQ.bois3, 2);
}
function pellicule(c, t) { /* boutique en couleur : image nette, sans effet vieux film */ }
