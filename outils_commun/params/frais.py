EP = "frais"
TABLE = "{ tasse: 1, objet: 1, t }"
PROP_MOUTON = "if (lb < 0) { const a = mainScene(M, -1); objetCouleur(cc, a[0], a[1] + 110, .55, -.08); }"
PROP_RENARD = ""
POSE_M1 = "M.handL = [-150, -640]; M.poseL = 'ouverte';"
PLAQUE = "Une auberge — autrefois"
X_HOOK = "(cc, t, u) => { auberge(cc, t, { avant: (c2) => addition(c2, 300, 520, .75, 4) }); }"
HOOK_TXT = ["2 SOUS… OU 5 SOUS ?", "le prix qui gonfle à la fin"]
X03A = "(cc, t, u) => auberge(cc, t, { plat: 0, derriere: (c2) => dessine(c2, voix(AUBERGISTE(t, 330, { face: 1, look: [.6, 0], sourire: 1.2, handR: [170, -660], poseR: 'ouverte' }), ['s03a'], t)) })"
X03B = "(cc, t, u) => auberge(cc, t, { avant: (c2) => dessine(c2, VOYAGEUR(t, 760, { face: -1, look: [-.5, .3], sourire: .9, handR: [100, -480], poseR: 'poing' })) })"
X04 = "(cc, t, u) => auberge(cc, t, { avant: (c2) => { dessine(c2, voix(AUBERGISTE(t, 820, { face: -1, look: [-.6, 0], sourire: 1, handR: [150, -600], poseR: 'ouverte' }), ['s04a'], t)); addition(c2, 600, 400, .7, 1 + Math.floor(clamp(u * 1.2) * 3.99)); } })"
H04 = "150, 330"
QUIZ = {"q": ["Pourquoi les frais arrivent-ils", "seulement à la fin ?"], "A": ["Par simple oubli"], "B": ["Pour que tu n’oses plus", "faire demi-tour"], "bonne": "B"}
X06B = "(cc, t, u) => decoupe(cc, t, u)"
X07 = "(cc, t, u) => dernierEcran(cc, t, u)"
CARNET = ["combien je", "paie vraiment,", "au total,", "à la fin ?"]
