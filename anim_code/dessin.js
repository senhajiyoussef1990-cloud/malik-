// Post-traitement « fait main » appliqué à chaque image : le trait ondule et vibre comme au crayon (changé toutes les 2 images),
// les aplats prennent la texture de la gouache, et tout repose sur un papier légèrement grainé.
const _fm = document.createElement('canvas'); _fm.width = W; _fm.height = H; const _fmc = _fm.getContext('2d');
const _papier = (() => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); const d = c.createImageData(W, H);
  for (let i = 0; i < d.data.length; i += 4) { const x = (i / 4) % d.width, y = Math.floor(i / 4 / d.width); const n = (Math.sin(x * .9 + Math.sin(y * .13) * 3) * .5 + .5) * .25 + Math.random() * .75; const v = 200 + n * 55; d.data[i] = v; d.data[i + 1] = v * .97; d.data[i + 2] = v * .9; d.data[i + 3] = 255; }
  c.putImageData(d, 0, 0); for (let k = 0; k < 900; k++) { c.strokeStyle = `rgba(120,100,70,${.04 + Math.random() * .06})`; c.lineWidth = .6; c.beginPath(); const x = Math.random() * W, y = Math.random() * H, a = Math.random() * 6.3, l = 6 + Math.random() * 16; c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * l * .5 + 3, y + Math.sin(a) * l * .5, x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }   // fibres
  return cv; })();
const _gouache = (() => { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'); c.fillStyle = '#808080'; c.fillRect(0, 0, W, H);
  for (let k = 0; k < 2600; k++) { const x = Math.random() * W, y = Math.random() * H, a = (Math.random() - .5) * .8 - .5, l = 10 + Math.random() * 30, g = 110 + Math.random() * 40; c.strokeStyle = `rgba(${g},${g},${g},.35)`; c.lineWidth = 3 + Math.random() * 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }   // coups de pinceau
  return cv; })();
function faitMain(cv, t) {
  const c = cv.getContext('2d'), tb = document.getElementById('tb'); if (tb) { tb.setAttribute('seed', String(1 + Math.floor(t * 15) % 7)); const k = typeof HD !== 'undefined' ? HD : 1; if (!tb.__hd) { tb.__hd = 1; tb.setAttribute('baseFrequency', String(.022 / k)); tb.nextElementSibling.setAttribute('scale', String(3.6 * k)); } }
  _fmc.setTransform(1, 0, 0, 1, 0, 0); _fmc.clearRect(0, 0, W, H); _fmc.drawImage(cv, 0, 0);
  c.setTransform(1, 0, 0, 1, 0, 0); c.save(); c.filter = 'url(#crayon)'; c.drawImage(_fm, 0, 0); c.restore();
  c.save(); c.globalCompositeOperation = 'soft-light'; c.globalAlpha = .55; c.drawImage(_gouache, 0, 0); c.restore();       // texture de gouache
  c.save(); c.globalCompositeOperation = 'multiply'; c.globalAlpha = .38; c.drawImage(_papier, 0, 0); c.restore();          // grain du papier
}
// lettrage peint à la main : chaque lettre légèrement tournée, décalée et de taille irrégulière
(() => { const P2 = CanvasRenderingContext2D.prototype, fT = P2.fillText, sT = P2.strokeText;
  const main = (orig) => function (txt, x, y, mw) {
    txt = String(txt); if (txt.length < 2 || this.__lettre) return orig.call(this, txt, x, y, mw);
    const w = this.measureText(txt).width, al = this.textAlign; let cx = al === 'center' ? x - w / 2 : (al === 'right' || al === 'end') ? x - w : x;
    this.save(); this.textAlign = 'left'; this.__lettre = true; let seed = 0; for (const ch of txt) seed += ch.charCodeAt(0);
    [...txt].forEach((ch, i) => { const cw = this.measureText(ch).width, r = (k) => { const v = Math.sin((seed + i * 7.3 + k) * 91.7) * 43758.5; return v - Math.floor(v) - .5; };
      this.save(); this.translate(cx + cw / 2, y + r(1) * 4); this.rotate(r(2) * .16); this.scale(1 + r(3) * .1, 1 + r(4) * .14); orig.call(this, ch, -cw / 2, 0); this.restore(); cx += cw; });
    this.__lettre = false; this.restore(); };
  P2.fillText = main(fT); P2.strokeText = main(sT); })();
