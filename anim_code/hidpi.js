// Rendu en haute définition : chaque toile est calculée HD fois plus fine, sans rien changer au code de dessin
// (toutes les coordonnées restent en 1080 × 810 ; seule la densité de pixels augmente).
const HD = (typeof HD_ECHELLE !== 'undefined') ? HD_ECHELLE : 2;
(() => {
  const S = HD, dW = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'width'), dH = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'height');
  const P = CanvasRenderingContext2D.prototype, nSet = P.setTransform, nReset = P.resetTransform, nGet = P.getTransform, nDraw = P.drawImage, nPut = P.putImageData, nCreate = P.createImageData, nGetD = P.getImageData;
  function hd(cv) {
    if (cv.__hd) return cv; cv.__hd = true;
    const w = dW.get.call(cv), h = dH.get.call(cv);
    Object.defineProperty(cv, 'width', { get() { return dW.get.call(cv) / S; }, set(v) { dW.set.call(cv, v * S); if (cv.__ctx) nSet.call(cv.__ctx, S, 0, 0, S, 0, 0); } });
    Object.defineProperty(cv, 'height', { get() { return dH.get.call(cv) / S; }, set(v) { dH.set.call(cv, v * S); if (cv.__ctx) nSet.call(cv.__ctx, S, 0, 0, S, 0, 0); } });
    dW.set.call(cv, w * S); dH.set.call(cv, h * S);
    const nCtx = cv.getContext.bind(cv);
    cv.getContext = (k, o) => { const c = nCtx(k, o); if (k === '2d' && !cv.__ctx) { cv.__ctx = c; nSet.call(c, S, 0, 0, S, 0, 0); } return c; };
    return cv;
  }
  P.setTransform = function (a, b, c, d, e, f) { if (!this.canvas.__hd) return nSet.apply(this, arguments); if (typeof a === 'object') { const m = a; return nSet.call(this, m.a * S, m.b * S, m.c * S, m.d * S, m.e * S, m.f * S); } return nSet.call(this, a * S, b * S, c * S, d * S, e * S, f * S); };
  P.resetTransform = function () { if (!this.canvas.__hd) return nReset.call(this); nSet.call(this, S, 0, 0, S, 0, 0); };
  P.getTransform = function () { const m = nGet.call(this); if (!this.canvas.__hd) return m; return new DOMMatrix([m.a / S, m.b / S, m.c / S, m.d / S, m.e / S, m.f / S]); };
  P.drawImage = function (img, ...a) { if (img && img.__hd) { if (a.length === 2) return nDraw.call(this, img, a[0], a[1], img.width, img.height); if (a.length === 8) return nDraw.call(this, img, a[0] * S, a[1] * S, a[2] * S, a[3] * S, a[4], a[5], a[6], a[7]); } return nDraw.call(this, img, ...a); };
  P.createImageData = function (w, h) { return this.canvas.__hd && typeof w === 'number' ? nCreate.call(this, w * S, h * S) : nCreate.apply(this, arguments); };
  P.putImageData = function (d, x, y) { return this.canvas.__hd ? nPut.call(this, d, x * S, y * S) : nPut.apply(this, arguments); };
  P.getImageData = function (x, y, w, h) { return this.canvas.__hd ? nGetD.call(this, x * S, y * S, w * S, h * S) : nGetD.apply(this, arguments); };
  const nCE = document.createElement.bind(document);
  document.createElement = (t, o) => { const el = nCE(t, o); return String(t).toLowerCase() === 'canvas' ? hd(el) : el; };
  hd(document.getElementById('c'));
})();
