// SCÈNE 11 — Plans 20-21. Le pont est bel et bien ouvert : piétons et charrette le traversent. « Le monde a changé. Le récit, pas encore. »
// Le renard compare l'ancien avis à la photo datée : « Chercher la date compte autant que la source. »
const A = L.s11a, B = L.s11b, DUREE = B[0] + B[1] + .7;
function frame(c, t) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  const lb = t - B[0];
  if (lb < -.1) { enNoirEtBlanc(c, t, (cc) => { cam(cc, t, [[0, 860, 520, 1.5]]); valleeNB(cc, t, { ouvert: true }); const u = (t * .25) % 1; const P = figurant(t, lerp(1040, 800, u), 2, { s: .22, y: 600 - 40 * Math.sin((lerp(1040, 800, u) - 800) / 240 * Math.PI), face: -1, chapeau: COIFFE.casquette }); marche(P, t); dessine(cc, P);
    const cx = lerp(810, 1030, (t * .2) % 1), cy = 600 - 40 * Math.sin((cx - 800) / 240 * Math.PI); F(cc, poly([[cx - 30, cy - 12], [cx + 30, cy - 12], [cx + 30, cy - 36], [cx - 30, cy - 36]]), GRIS.fonce, 2); for (const dx of [-18, 18]) F(cc, ell(cx + dx, cy - 8, 9, 9), GRIS.noir, 2); }); debutFlash(c, t); return; }
  const [R, M] = herosTV(t, 300, 880); voix(R, ['s11b'], t); R.handL = [-200, -640]; R.handR = [200, -640]; R.poseL = R.poseR = 'pointe'; R.look = [Math.sin(t * 2) * .9, -.2]; M.look = [-.7, -.2];
  nbEtCouleur(c, t, [[0, 540, 405, 1.0]], (cc) => { cc.fillStyle = GRIS.clair; cc.fillRect(0, 0, W, H);
    cc.save(); cc.translate(340, 300); F(cc, poly([[-130, -100], [130, -100], [130, 100], [-130, 100]]), GRIS.blanc, 4); cc.font = 'bold 26px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('AVIS', 0, -50); cc.font = '22px Georgia'; cc.fillText('Le pont est fermé', 0, 0); cc.font = 'italic 20px Georgia'; cc.fillText('— hier —', 0, 50); cc.restore();
    photoPont(cc, 740, 300, 1.6, 'ce matin'); }, (cc) => heros(cc, R, M));
}
