// Outils communs aux scènes du téléviseur (5 à 12).
const DUREE = FIN(1.2);
function vendeurBase(t, x = 300) { const tq = step(t); return { x, y: 770, s: .62, t: tq, look: [.6, 0], blink: (t % 3.1) < .1 ? 1 : 0, tilt: wob(tq, .5, .04), bob: bnc(tq, .5) * 4 }; }
function clientBase(t, x = 820) { const tq = step(t); return { x, y: 780, s: .6, t: tq, face: -1, look: [-.6, 0], blink: (t % 2.7) < .1 ? 1 : 0, tilt: wob(tq, .45, .04), bob: bnc(tq, .25) * 4 }; }
function dessine(c, P, f) { c.save(); c.translate(0, -(P.bob || 0)); f(c, P); c.restore(); }
function debutFlash(c, t) { if (t < .35) { c.fillStyle = `rgba(255,255,255,${1 - ease(t / .35)})`; c.fillRect(0, 0, W, H); } }
