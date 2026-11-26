EP = "tulipes"
TABLE = "{ tasse: 1, objet: 1, t }"
PROP_MOUTON = "if (lb < 0) { const a = mainScene(M, -1); objetCouleur(cc, a[0], a[1] + 110, .55, -.08); }"
PROP_RENARD = ""
POSE_M1 = "M.handL = [-150, -640]; M.poseL = 'ouverte';"
PLAQUE = "Pays-Bas — 1637"
X_HOOK = "(cc, t, u) => { if (!_ma) _ma = fondMarche(); cc.drawImage(_ma, 0, 0); bulbe(cc, 300, 640, 2.2); cc.font = 'bold 110px Georgia'; cc.textAlign = 'center'; cc.fillStyle = GRIS.noir; cc.fillText('=', 520, 560); cc.save(); cc.translate(760, 690); cc.scale(1.4, 1.4); F(cc, poly([[-110, 0], [110, 0], [110, -160], [-110, -160]]), GRIS.blanc, 4); F(cc, poly([[-135, -160], [135, -160], [0, -260]]), GRIS.fonce, 4); F(cc, poly([[-24, 0], [24, 0], [24, -86], [-24, -86]]), GRIS.fonce, 3); for (const x of [-70, 70]) F(cc, poly([[x - 22, -120], [x + 22, -120], [x + 22, -80], [x - 22, -80]]), '#e8e0c8', 2); cc.restore(); }"
HOOK_TXT = ["1 BULBE = 1 MAISON", "Pays-Bas, 1637"]
X03A = "(cc, t, u) => marche(cc, t, { prix: String(Math.round(10 * Math.pow(10, clamp(u * 1.2) * 2))), derriere: (c2) => dessine(c2, voix(MARCHAND3(t, 830, { face: -1, look: [-.6, 0], sourire: 1.3, handR: [170, -680], poseR: 'pointe' }), ['s03a'], t)) })"
X03B = "(cc, t, u) => marche(cc, t, { prix: '1 000', derriere: (c2) => { for (let k = 0; k < 5; k++) dessine(c2, figurant(t, 110 + k * 210, (k + 1) % 5, { s: .44, y: 840, face: k < 2 ? 1 : -1, look: [k < 2 ? .5 : -.5, -.3], sourire: 1, handR: [120, -620], poseR: 'ouverte' })); } })"
X04 = "(cc, t, u) => marche(cc, t, { prix: '3 000', derriere: (c2) => { vache(c2, 860, 760, .9); dessine(c2, voix(ACHETEUR2(t, 640, { face: 1, look: [.5, -.1], sourire: 1.3, handL: [-120, -560], poseL: 'poing', handR: [140, -620], poseR: 'ouverte' }), ['s04a'], t)); bulbe(c2, 586, 520, .6); } })"
H04 = "150, 330"
QUIZ = {"q": ["Un matin de février 1637,", "que s’est-il passé ?"], "A": ["Le prix a encore doublé"], "B": ["Plus personne", "n’est venu acheter"], "bonne": "B"}
X06B = "(cc, t, u) => courbe(cc, t, u, {})"
X07 = "(cc, t, u) => bulles(cc, t, u)"
CARNET = ["je l’achète", "pour ce qu’il", "vaut, ou pour", "ce qu’on espère ?"]
