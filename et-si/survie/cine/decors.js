/* ET SI ? — décors, personnages et pictogrammes partagés (épisodes 3 et suivants).
   Décors dessinés dans un tampon WB×H (WB = 1,4 × W) ; caméra via show(c, B, cam). */
const WB = Math.round(W * 1.4);
const PERSOS = {
  heros: {...MAN, pants: [40, 46, 58]},
  ami: {skin: [150, 100, 72], skinD: [96, 62, 44], hair: '#141010', beard: null, shirt: [186, 128, 52], shirtD: [118, 78, 28], eye: '#2a1a10', pants: [54, 58, 66]},
  femme: {skin: [176, 120, 92], skinD: [110, 70, 52], hair: '#22160f', beard: null, longHair: true, shirt: [150, 70, 80], shirtD: [80, 36, 44], eye: '#3a2418', pants: [60, 40, 50]},
  enfant: {headScale: 1.65, skin: [214, 170, 140], skinD: [140, 100, 80], hair: '#5a3a22', beard: null, shirt: [60, 130, 110], shirtD: [30, 70, 60], eye: '#3a2418', pants: [70, 80, 120]},
};
function LT(u, warm = 1, col = 'rgba(255,210,150,1)'){return {dx: 0.6, dy: -0.7, scale: u, col, k: 0.55 * warm, shadow: 0.55};}
// personnage peint ; o.mirror = regarde vers la gauche ; o.light = lumière de contour
function acteur(b, who, x, y, u, pose = {}, o = {}){const col = typeof who === 'string' ? PERSOS[who] : who;let R = null;
  painted(b, f => {f.save();if(o.mirror){f.translate(2 * x, 0);f.scale(-1, 1);}R = figure(f, x, y, u, {legs: true, near: {}, far: {bend: -1}, ...pose}, col);if(o.after)o.after(f, R);f.restore();}, o.light || LT(u, o.warm ?? 1));return R;}
function ambiance(b, lights, amb = '#3a3a44'){relight(b, lights, amb);}
const LAMPE = (x, y, k = 1, r = 1300) => ({x, y, r, c: `rgba(255,226,180,${0.95 * k})`, c2: 'rgba(200,170,130,0.5)'});
const LUNE = (x, y, k = 1) => ({x, y, r: 900, c: `rgba(120,150,210,${0.5 * k})`});

/* ---------- décors ---------- */
function fenetre(b, x, y, w, h, nuit = true, ouverte = 0){b.fillStyle = '#d9d0c0';b.fillRect(x - 14, y - 14, w + 28, h + 28);
  b.fillStyle = nuit ? lg(b, 0, y, 0, y + h, [[0, '#142744'], [1, '#0b1424']]) : lg(b, 0, y, 0, y + h, [[0, '#9ccbea'], [1, '#d9eef8']]);b.fillRect(x, y, w, h);
  if(nuit){const rs = mulberry(x | 0);for(let i = 0;i < 40;i++){b.fillStyle = `rgba(255,${200 + rs() * 40 | 0},140,${rs() * 0.7})`;b.fillRect(x + rs() * w, y + h * 0.55 + rs() * h * 0.4, 3 + rs() * 4, 4 + rs() * 6);}}
  if(ouverte > 0){b.fillStyle = 'rgba(220,235,250,0.35)';b.strokeStyle = '#d9d0c0';b.lineWidth = 10;b.beginPath();b.moveTo(x + w / 2, y);b.lineTo(x + w / 2 + w * 0.45 * ouverte, y + 30);b.lineTo(x + w / 2 + w * 0.45 * ouverte, y + h - 30);b.lineTo(x + w / 2, y + h);b.closePath();b.fill();b.stroke();
    b.beginPath();b.moveTo(x + w / 2, y);b.lineTo(x + w / 2 - w * 0.45 * ouverte, y + 30);b.lineTo(x + w / 2 - w * 0.45 * ouverte, y + h - 30);b.lineTo(x + w / 2, y + h);b.closePath();b.fill();b.stroke();}
  else{b.fillStyle = '#d9d0c0';b.fillRect(x + w / 2 - 6, y, 12, h);b.fillRect(x, y + h * 0.45, w, 12);}}
function porte(b, x, y, w, h, ouv = 0, col = '#cfc7b8'){b.fillStyle = '#d8d3c8';b.fillRect(x - 20, y - 20, w + 40, h + 20);b.fillStyle = '#10141c';b.fillRect(x, y, w, h);
  const pw = w * (1 - ouv);b.fillStyle = lg(b, x, 0, x + pw, 0, [[0, col], [1, '#9a9184']]);b.fillRect(x, y, pw, h);b.strokeStyle = 'rgba(0,0,0,0.2)';b.lineWidth = 4;b.strokeRect(x + pw * 0.12, y + 60, pw * 0.76, h * 0.38);b.strokeRect(x + pw * 0.12, y + h * 0.5, pw * 0.76, h * 0.42);
  b.fillStyle = '#e9e5dc';b.beginPath();b.arc(x + pw - 34, y + h * 0.52, 11, 0, TAU);b.fill();}
function sol(b, y, col = '#2a2420'){b.fillStyle = col;b.fillRect(0, y, WB, H - y);b.fillStyle = 'rgba(255,255,255,0.04)';for(let x = 0;x < WB;x += 180)b.fillRect(x, y, 3, H - y);}
function mur(b, c1, c2, plinthe = 1500){b.fillStyle = lg(b, 0, 0, 0, plinthe, [[0, c1], [1, c2]]);b.fillRect(0, 0, WB, H);b.fillStyle = 'rgba(0,0,0,0.25)';b.fillRect(0, plinthe - 16, WB, 16);}
function decor(b, kind, T, o = {}){
  if(kind === 'salon'){mur(b, '#4d5560', '#6b7380');fenetre(b, 90, 360, 330, 520, o.nuit ?? true, o.fenetre || 0);
    b.fillStyle = '#2b2118';b.fillRect(980, 380, 300, 220);b.fillStyle = lg(b, 995, 395, 1265, 585, [[0, '#7a8aa0'], [1, '#c9a96a']]);b.fillRect(995, 395, 270, 190);
    b.fillStyle = '#5a3d2a';b.fillRect(560, 640, 330, 16);for(let i = 0;i < 6;i++){b.fillStyle = ['#a0524a', '#3c6e8f', '#d9b25a', '#6a8a4a', '#8a5a9a', '#c86a2a'][i];b.fillRect(580 + i * 48, 540, 36, 100);}
    // canapé
    b.fillStyle = '#3d4a63';b.beginPath();b.roundRect(650, 1180, 760, 330, 40);b.fill();b.fillStyle = '#4a5878';b.beginPath();b.roundRect(690, 1280, 680, 120, 30);b.fill();
    if(o.radiateur !== false){b.fillStyle = '#d8d6d0';b.beginPath();b.roundRect(120, 1180, 380, 240, 16);b.fill();b.strokeStyle = 'rgba(0,0,0,0.15)';b.lineWidth = 4;for(let i = 0;i < 9;i++){b.beginPath();b.moveTo(150 + i * 40, 1200);b.lineTo(150 + i * 40, 1400);b.stroke();}}
    sol(b, 1500, '#3a2e26');}
  else if(kind === 'chambre'){mur(b, '#2c3446', '#3c465c');fenetre(b, 1050, 380, 300, 460, true);porte(b, 120, 560, 380, 940, o.porte || 0);
    // détecteur de fumée au plafond
    b.fillStyle = '#e8e6e0';b.beginPath();b.ellipse(760, 150, 90, 26, 0, 0, TAU);b.fill();b.fillStyle = '#c8c6c0';b.fillRect(690, 120, 140, 30);
    if(o.alarme){const on = Math.sin(T * 12) > 0;b.fillStyle = on ? '#ff3b30' : '#5a1a18';b.beginPath();b.arc(760, 160, 12, 0, TAU);b.fill();if(on){b.fillStyle = 'rgba(255,60,50,0.3)';b.beginPath();b.arc(760, 160, 50, 0, TAU);b.fill();}}
    // lit
    b.fillStyle = '#5a4030';b.fillRect(560, 1160, 820, 60);b.fillStyle = '#dfe3ea';b.beginPath();b.roundRect(580, 1080, 790, 110, 20);b.fill();b.fillStyle = '#6a7fa8';b.beginPath();b.roundRect(760, 1060, 610, 150, 24);b.fill();
    b.fillStyle = '#5a4030';b.fillRect(540, 880, 40, 340);b.fillStyle = '#4a3428';b.fillRect(1390, 1100, 120, 160);
    sol(b, 1500, '#2a2420');}
  else if(kind === 'sdb'){mur(b, '#8fa3ad', '#b7c7cf');tiles(b, 0, 760, WB, 1500, 92, 46, 3, [214, 226, 232]);
    b.fillStyle = '#dfe9ee';b.fillRect(560, 300, 420, 380);b.fillStyle = lg(b, 570, 310, 970, 670, [[0, '#b8d4e2'], [1, '#e8f4f8']]);b.fillRect(574, 314, 392, 352);
    b.fillStyle = '#f4f6f8';b.beginPath();b.roundRect(520, 1000, 500, 120, 30);b.fill();b.fillStyle = '#c8ced4';b.fillRect(740, 900, 40, 110);b.fillRect(740, 900, 120, 26);
    if(o.eau){b.save();b.globalAlpha = 0.85;const g = lg(b, 840, 926, 840, o.eauY || 1100, [[0, 'rgba(170,215,255,0.95)'], [1, 'rgba(120,180,240,0.6)']]);b.fillStyle = g;b.fillRect(846 + Math.sin(T * 30) * 2, 926, 16, (o.eauY || 1100) - 926);b.restore();}
    sol(b, 1500, '#cfd6da');}
  else if(kind === 'cuisine'){mur(b, '#3a3833', '#57534b', 1220);tiles(b, 0, 760, WB, 1220, 92, 46, 8);
    b.fillStyle = '#5c4330';b.fillRect(60, 600, 420, 20);jar(b, 80, 500, 60, 100, 'rgba(210,170,90,0.85)');jar(b, 160, 520, 56, 80, 'rgba(160,60,40,0.8)');jar(b, 240, 490, 62, 110, 'rgba(230,220,200,0.85)');
    cabinetDoor(b, 860, 240, 260, 420, 11);cabinetDoor(b, 1120, 240, 260, 420, 12);
    b.fillStyle = lg(b, 0, 1196, 0, 1262, [[0, '#d8d2c6'], [1, '#7f796e']]);b.fillRect(0, 1196, WB, 66);
    for(let x = 0;x < WB;x += 300){b.fillStyle = lg(b, x, 0, x + 300, 0, [[0, '#323a44'], [0.5, '#3e4752'], [1, '#2e353e']]);b.fillRect(x + 4, 1262, 292, 560);b.fillStyle = '#d0d0d0';b.fillRect(x + 105, 1310, 90, 11);}
    if(o.plaques !== false){b.fillStyle = '#0b0c0e';b.fillRect(500, 1180, 500, 18);for(const gx of [560, 790]){b.strokeStyle = '#26282c';b.lineWidth = 9;b.strokeRect(gx, 1158, 170, 26);}}
    sol(b, 1822, '#1a1511');}
  else if(kind === 'couloir'){mur(b, '#1a2230', '#243042', 1700);porte(b, 140, 620, 300, 1080, o.porte1 || 0);porte(b, 980, 620, 300, 1080, o.porte2 || 0);
    b.fillStyle = 'rgba(255,240,200,0.8)';b.beginPath();b.ellipse(710, 200, 80, 20, 0, 0, TAU);b.fill();sol(b, 1700, '#2a2622');}
  else if(kind === 'dehors'){b.fillStyle = lg(b, 0, 0, 0, H, [[0, '#060a14'], [0.6, '#0f1a2c'], [1, '#1a2232']]);b.fillRect(0, 0, WB, H);
    b.fillStyle = '#4a2c22';b.fillRect(80, 360, 1000, 1240);b.strokeStyle = 'rgba(0,0,0,0.25)';b.lineWidth = 2;for(let y = 380;y < 1600;y += 26){b.beginPath();b.moveTo(80, y);b.lineTo(1080, y);b.stroke();}
    const rs = mulberry(12);for(let r = 0;r < 4;r++)for(let k = 0;k < 3;k++){const x = 150 + k * 320, y = 440 + r * 280;b.fillStyle = '#d8d0c2';b.fillRect(x - 10, y - 10, 200, 200);b.fillStyle = (o.feu && r === 1 && k === 1) ? '#ff8a2a' : (rs() > 0.6 ? '#e6c78a' : '#162236');b.fillRect(x, y, 180, 180);}
    b.fillStyle = '#1a1410';b.fillRect(480, 1330, 200, 270);b.fillStyle = '#232628';b.fillRect(0, 1600, WB, 320);b.fillStyle = '#22262a';b.fillRect(1240, 700, 14, 900);b.fillStyle = '#ffe2a8';b.beginPath();b.ellipse(1220, 700, 46, 14, 0, 0, TAU);b.fill();}
  else if(kind === 'hopital'){mur(b, '#c9d6de', '#e6eef2', 1500);b.fillStyle = '#2e7d6b';b.fillRect(0, 1100, WB, 30);
    b.fillStyle = '#d93a3a';b.beginPath();b.roundRect(1050, 300, 260, 260, 30);b.fill();b.fillStyle = '#fff';b.fillRect(1160, 340, 40, 180);b.fillRect(1090, 410, 180, 40);
    b.fillStyle = '#9aa8b0';b.beginPath();b.roundRect(140, 900, 560, 200, 20);b.fill();sol(b, 1500, '#b8c2c8');}
}

/* ---------- pictogrammes (centrés en 0,0, environ 160 px) ---------- */
const ICO = {
  perle: c => {c.fillStyle = rg(c, -14, -14, 4, 60, [[0, '#ffd1e8'], [1, '#d0408a']]);c.beginPath();c.arc(0, 0, 52, 0, TAU);c.fill();c.fillStyle = '#7a1a4a';c.beginPath();c.arc(0, 0, 12, 0, TAU);c.fill();},
  pile: c => {c.fillStyle = lg(c, -70, 0, 70, 0, [[0, '#8a8e94'], [0.5, '#f0f2f4'], [1, '#7a7e84']]);c.beginPath();c.ellipse(0, 10, 72, 26, 0, 0, TAU);c.fill();c.fillRect(-72, -14, 144, 24);c.fillStyle = '#d8dbe0';c.beginPath();c.ellipse(0, -14, 72, 26, 0, 0, TAU);c.fill();
    c.font = '900 34px M';c.fillStyle = '#555';c.textAlign = 'center';c.textBaseline = 'middle';c.fillText('+', 0, -14);},
  pince: c => {c.strokeStyle = '#c8ccd2';c.lineWidth = 16;c.lineCap = 'round';c.beginPath();c.moveTo(-70, 60);c.lineTo(50, -50);c.moveTo(-40, 70);c.lineTo(60, -36);c.stroke();c.fillStyle = '#d33';c.fillRect(-90, 50, 60, 30);},
  glace: c => {for(const [x, y] of [[-40, 10], [30, -10], [0, 40]]){c.fillStyle = 'rgba(200,235,255,0.85)';c.strokeStyle = '#fff';c.lineWidth = 4;c.beginPath();c.roundRect(x - 34, y - 34, 68, 68, 12);c.fill();c.stroke();}},
  beurre: c => {c.fillStyle = '#f4d76a';c.beginPath();c.moveTo(-80, 10);c.lineTo(40, -30);c.lineTo(90, 0);c.lineTo(-30, 40);c.closePath();c.fill();c.fillStyle = '#e6c24a';c.beginPath();c.moveTo(-80, 10);c.lineTo(-30, 40);c.lineTo(-30, 70);c.lineTo(-80, 40);c.closePath();c.fill();c.beginPath();c.moveTo(-30, 40);c.lineTo(90, 0);c.lineTo(90, 30);c.lineTo(-30, 70);c.closePath();c.fill();},
  linge: c => {c.fillStyle = '#f2f4f6';c.beginPath();c.moveTo(-80, -50);c.quadraticCurveTo(0, -70, 80, -50);c.lineTo(70, 60);c.quadraticCurveTo(0, 40, -70, 60);c.closePath();c.fill();c.strokeStyle = '#c8d0d8';c.lineWidth = 4;c.beginPath();c.moveTo(-50, -20);c.lineTo(50, -24);c.moveTo(-46, 20);c.lineTo(46, 16);c.stroke();},
  robinet: c => {c.fillStyle = '#c8ced4';c.fillRect(-60, -70, 120, 30);c.fillRect(30, -70, 30, 60);c.fillStyle = 'rgba(140,200,255,0.9)';c.fillRect(38, -10, 14, 90);c.font = '900 40px M';c.fillStyle = PAL.blanc;c.textAlign = 'center';c.fillText('20°', -30, 30);},
  minuterie: c => {c.fillStyle = '#f5f5f5';c.beginPath();c.arc(0, 8, 70, 0, TAU);c.fill();c.fillStyle = PAL.rouge;c.fillRect(-14, -82, 28, 18);c.strokeStyle = '#222';c.lineWidth = 8;c.lineCap = 'round';c.beginPath();c.moveTo(0, 8);c.lineTo(0, -40);c.moveTo(0, 8);c.lineTo(30, 24);c.stroke();},
  briquet: c => {c.fillStyle = '#d33';c.beginPath();c.roundRect(-34, -20, 68, 100, 12);c.fill();c.fillStyle = '#bbb';c.fillRect(-34, -44, 68, 26);c.fillStyle = '#ffb020';c.beginPath();c.moveTo(0, -110);c.quadraticCurveTo(24, -70, 0, -50);c.quadraticCurveTo(-24, -70, 0, -110);c.fill();},
  interrupteur: c => {c.fillStyle = '#f2f0ea';c.beginPath();c.roundRect(-60, -80, 120, 160, 14);c.fill();c.fillStyle = '#d8d6d0';c.beginPath();c.roundRect(-30, -50, 60, 100, 8);c.fill();c.fillStyle = '#bbb';c.fillRect(-30, -50, 60, 46);},
  sonnette: c => {c.fillStyle = '#e8e6e0';c.beginPath();c.roundRect(-46, -70, 92, 140, 16);c.fill();c.fillStyle = '#d0a040';c.beginPath();c.arc(0, 0, 26, 0, TAU);c.fill();},
  fenetre: c => {c.fillStyle = '#d9d0c0';c.fillRect(-80, -90, 160, 180);c.fillStyle = '#9ccbea';c.fillRect(-66, -76, 132, 152);c.strokeStyle = '#fff';c.lineWidth = 6;c.beginPath();c.moveTo(-20, -60);c.quadraticCurveTo(20, -40, 50, -60);c.moveTo(-40, 0);c.quadraticCurveTo(0, 20, 40, 0);c.stroke();},
  compteur: c => {c.fillStyle = '#d8b84a';c.beginPath();c.roundRect(-80, -70, 160, 110, 12);c.fill();c.fillStyle = '#222';c.fillRect(-50, -46, 100, 30);c.strokeStyle = '#999';c.lineWidth = 16;c.beginPath();c.moveTo(-30, 40);c.lineTo(-30, 90);c.moveTo(30, 40);c.lineTo(30, 90);c.stroke();c.fillStyle = PAL.rouge;c.fillRect(10, 56, 60, 16);},
  chaudiere: (c, T = 0) => {c.fillStyle = '#e8e8e4';c.beginPath();c.roundRect(-70, -100, 140, 200, 14);c.fill();c.fillStyle = '#222';c.fillRect(-40, 10, 80, 50);flamesMini(c, 0, 52, T);},
  detecteur: (c, T = 0) => {c.fillStyle = '#eceae4';c.beginPath();c.ellipse(0, 0, 90, 30, 0, 0, TAU);c.fill();c.fillStyle = '#d0cec8';c.fillRect(-60, -30, 120, 30);c.fillStyle = Math.sin(T * 12) > 0 ? '#ff3b30' : '#5a1a18';c.beginPath();c.arc(0, 8, 10, 0, TAU);c.fill();},
  telephone: (c, T = 0) => {phone(c, 0, 0, 0, T, 0.9);},
  hopital: c => {c.fillStyle = PAL.rouge;c.beginPath();c.roundRect(-80, -80, 160, 160, 26);c.fill();c.fillStyle = '#fff';c.fillRect(-16, -56, 32, 112);c.fillRect(-56, -16, 112, 32);},
  radio: c => {c.fillStyle = '#0d1a26';c.beginPath();c.roundRect(-80, -100, 160, 200, 12);c.fill();c.strokeStyle = 'rgba(200,230,255,0.6)';c.lineWidth = 6;c.beginPath();c.moveTo(-40, -80);c.quadraticCurveTo(-60, 0, -30, 80);c.moveTo(40, -80);c.quadraticCurveTo(60, 0, 30, 80);c.stroke();c.fillStyle = '#fff';c.beginPath();c.arc(0, -20, 16, 0, TAU);c.fill();},
  miel: c => {c.fillStyle = '#e8a020';c.beginPath();c.roundRect(-56, -50, 112, 120, 20);c.fill();c.fillStyle = '#8a5a2a';c.fillRect(-60, -76, 120, 30);c.fillStyle = '#fff';c.font = '800 26px M';c.textAlign = 'center';c.fillText('MIEL', 0, 20);},
  telecommande: c => {c.fillStyle = '#222';c.beginPath();c.roundRect(-40, -100, 80, 200, 20);c.fill();for(let i = 0;i < 6;i++){c.fillStyle = '#666';c.beginPath();c.arc(-14 + (i % 2) * 28, -60 + (i >> 1) * 40, 9, 0, TAU);c.fill();}},
  couteau: c => {c.fillStyle = '#d8dde2';c.beginPath();c.moveTo(-90, 0);c.lineTo(50, -20);c.lineTo(50, 14);c.closePath();c.fill();c.fillStyle = '#3a2a1a';c.beginPath();c.roundRect(50, -20, 70, 34, 10);c.fill();},
  enfant: c => {c.fillStyle = PERSOS.enfant.hair;c.beginPath();c.arc(0, -30, 46, 0, TAU);c.fill();c.fillStyle = rgb(PERSOS.enfant.skin);c.beginPath();c.arc(0, -22, 40, 0, TAU);c.fill();c.fillStyle = rgb(PERSOS.enfant.shirt);c.beginPath();c.roundRect(-50, 22, 100, 70, 26);c.fill();},
  maison: c => {c.fillStyle = '#e8e2d6';c.beginPath();c.moveTo(-80, -10);c.lineTo(0, -90);c.lineTo(80, -10);c.lineTo(80, 80);c.lineTo(-80, 80);c.closePath();c.fill();c.fillStyle = '#4a3a2a';c.fillRect(-20, 20, 40, 60);},
  point: c => {c.fillStyle = PAL.vert;c.beginPath();c.arc(0, -20, 50, Math.PI, 0);c.lineTo(0, 80);c.closePath();c.fill();c.fillStyle = '#fff';c.beginPath();c.arc(0, -20, 20, 0, TAU);c.fill();},
};
function flamesMini(c, x, y, T){c.save();for(let i = 0;i < 3;i++){const h = 30 + 10 * Math.sin(T * 9 + i * 2);c.fillStyle = i === 1 ? '#ffd27a' : '#ff7a2a';c.beginPath();c.moveTo(x - 24 + i * 24, y);c.quadraticCurveTo(x - 30 + i * 24, y - h * 0.6, x - 24 + i * 24 + 4, y - h);c.quadraticCurveTo(x - 10 + i * 24, y - h * 0.5, x - 12 + i * 24 + 12, y);c.fill();}c.restore();}
// pictogramme dans une pastille ; barre = interdit (rouge), coche = conseillé (vert)
function picto(c, name, x, y, s, a, etat = '', T = 0){if(a <= 0)return;c.save();c.globalAlpha = a;c.translate(x, y);const k = 0.85 + 0.15 * eout(clamp(a));c.scale(s * k, s * k);
  c.fillStyle = 'rgba(16,24,36,0.9)';c.beginPath();c.arc(0, 0, 120, 0, TAU);c.fill();c.strokeStyle = etat === 'non' ? PAL.rouge : etat === 'oui' ? PAL.vert : 'rgba(255,255,255,0.25)';c.lineWidth = 10;c.beginPath();c.arc(0, 0, 120, 0, TAU);c.stroke();
  ICO[name](c, T);if(etat === 'non'){c.strokeStyle = PAL.rouge;c.lineWidth = 16;c.lineCap = 'round';c.beginPath();c.moveTo(-84, -84);c.lineTo(84, 84);c.stroke();}
  if(etat === 'oui'){c.fillStyle = PAL.vert;c.beginPath();c.arc(84, 84, 34, 0, TAU);c.fill();c.strokeStyle = '#fff';c.lineWidth = 9;c.beginPath();c.moveTo(68, 84);c.lineTo(80, 96);c.lineTo(102, 70);c.stroke();}
  c.restore();}
// planche de pictogrammes : items = [[nom, état, apparition (s), légende]]
function planche(c, t, T, items, o = {}){darkBg(c);if(o.kicker)kicker(c, o.kicker, 300, clamp(t / 0.3));const n = items.length, cols = Math.min(n, o.cols || (n > 2 ? 2 : n)), rows = Math.ceil(n / cols);
  items.forEach(([nom, etat, t0, leg], i) => {const col = i % cols, row = Math.floor(i / cols);const x = W / 2 + (col - (cols - 1) / 2) * (cols > 2 ? 320 : cols > 1 ? 450 : 0), y = (o.y || 860) + (row - (rows - 1) / 2) * 430;
    const a = clamp((t - (t0 || 0)) / 0.3);picto(c, nom, x, y, o.s || 1.55, a, etat, T);
    if(leg && a > 0){c.save();c.globalAlpha = a;c.font = '800 40px M';c.fillStyle = PAL.blanc;c.textAlign = 'center';c.fillText(leg, x, y + 235);c.restore();}});
  grade(c, T, {vig: 0.45});}
function fin(c, t, d, lignes){darkBg(c);title(c, 'ET SI…', ['Tu sais quoi faire.'], clamp(t / 0.4), 300, 72);
  lignes.forEach(([s, col], i) => {const a = clamp((t - 0.3 - i * 0.18) / 0.3);if(a <= 0)return;c.save();c.globalAlpha = a;const y = 640 + i * 112;c.fillStyle = 'rgba(255,255,255,0.06)';c.fillRect(110, y - 44, 860, 88);c.fillStyle = col;c.fillRect(110, y - 44, 10, 88);
    let fs = 38;c.font = `700 ${fs}px M`;while(c.measureText(s).width > 790 && fs > 26){fs--;c.font = `700 ${fs}px M`;}c.fillStyle = PAL.blanc;c.textBaseline = 'middle';c.fillText(s, 150, y + 2);c.restore();});
  button(c, 'PARTAGE', 1140, clamp((t - C('partage', 4.0)) / 0.3), false);button(c, 'ABONNE-TOI', 1270, clamp((t - C('abonne', 5.2)) / 0.3), true);
  c.save();c.font = '600 26px M';c.fillStyle = 'rgba(245,245,245,0.55)';c.textAlign = 'center';c.fillText('Source officielle en description', W / 2, 1760);c.restore();grade(c, t, {vig: 0.45});
  const fo = ease(seg(t, d - 1.2, d));if(fo > 0){c.fillStyle = `rgba(4,6,10,${fo})`;c.fillRect(0, 0, W, H);}}
// accroche standard : plan + titre « Et si… » + signature
function accroche(c, t, d, B, cam, lignes){show(c, B, cam);grade(c, t);topShade(c);title(c, 'ET SI…', lignes, clamp(t / 0.3), 300, 68);signature(c, t, C('saurais', 2.0));}
// bandeaux en haut quand des personnages sont à l'écran
const T1 = 330, T2 = 420;
