EP = "pastille"
TABLE = "{ tasse: 1, objet: 1, t }"
PROP_MOUTON = "if (lb < 0) { const a = mainScene(M, -1); objetCouleur(cc, a[0], a[1] + 110, .55, -.08); }"
PROP_RENARD = ""
POSE_M1 = "M.handL = [-150, -660]; M.poseL = 'ouverte';"
PLAQUE = "Un village — autrefois"
X_HOOK = "(cc, t, u) => crieurCloche(cc, t, null, { foule: 1 })"
HOOK_TXT = ["50 COUPS DE CLOCHE PAR JOUR", "… pour des croissants"]
X03A = "(cc, t, u) => crieurCloche(cc, t, ['s03a'], {})"
X03B = "(cc, t, u) => crieurCloche(cc, t, null, { foule: 1 })"
X04 = "(cc, t, u) => soupe(cc, t, ['s04a'])"
H04 = "150, 330"
QUIZ = {"q": ["Pourquoi les pastilles", "des applications sont-elles rouges ?"], "A": ["Parce que c’est joli"], "B": ["Le rouge fait penser", "à une alerte"], "bonne": "B"}
X06B = "(cc, t, u) => concentration(cc, t, u)"
X07 = "(cc, t, u) => reglagesNotif(cc, t, u)"
CARNET = ["qui veut", "que je regarde,", "et pourquoi", "maintenant ?"]
SANS_HOOK = 1
