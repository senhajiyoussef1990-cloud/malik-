// Contenu de l'édition : seul fichier à changer chaque jour.
// Mots entre *astérisques* = mot clé surligné dans les sous-titres.
// say = texte dit par Maurice (nombres en toutes lettres, | = nouvelle phrase, la voix monte d'un cran).
// Illustrations : pay, stage, mic, globe, boat, rocket, probe.
window.EDITION = {
  date: "DIMANCHE 15 NOVEMBRE 2026",
  // Texte de publication TikTok (légende) et bandeau de la story
  caption: "📰 L'Écho du Jour du 15 novembre : record sur la Route du Rhum, une fusée rattrapée au vol par sa tour, et Voyager 1 bientôt à un jour-lumière de la Terre. Et toi, quel message enverrais-tu à Voyager ? 👇\n\n#actu #info #journal #ecodujour #routedurhum #espace #voyager1",
  storyCta: "LE JT EST EN LIGNE !",
  file: "ecodujour-2026-11-15-1",
  voice: "fr_FR-tom-medium",
  voiceEngine: "clone",
  phonetic: { "Achille Nebout": "Achile Nebou", "Class quarante": "classe quarante", "coude-à-coude": "coude à coude" }, // "clone" = voix de l'utilisateur (Chatterbox), sinon Piper
  hook: ["Un message qui met", "*un jour entier* à arriver !"],
  hookSay: "Un message qui met|un jour entier à arriver !",
  hookIllustration: "probe",
  rubriques: [
    {
      category: "EN FRANCE",
      title: "Route du Rhum : un record en Class40",
      illustration: "boat",
      subs: [
        ["Route du Rhum : Nebout", "gagne en *Class40* !"],
        ["Arrivé en *Guadeloupe*", "après 14 jours de mer."],
        ["Un *record* : 2 heures", "de mieux qu'en 2022 !"],
        ["Le 2e arrive", "*27 minutes* après !"],
      ],
      say: [
        "Victoire sur la Route du Rhum !|Achille Nebout gagne en Class quarante !",
        "Arrivé ce dimanche en Guadeloupe,|après quatorze jours de mer !",
        "Un record !|Deux heures de mieux que l'ancien chrono !",
        "Le deuxième arrive vingt-sept minutes après.|Un final au coude-à-coude !",
      ],
    },
    {
      category: "DANS LE MONDE",
      title: "Une fusée rattrapée au vol",
      illustration: "rocket",
      subs: [
        ["Au Texas, une fusée géante", "revient de *l'espace*…"],
        ["Et la tour la *rattrape*", "avec deux bras géants !"],
        ["Une *première* pour l'étage", "supérieur de Starship."],
        ["Le but : des fusées", "*réutilisables* !"],
      ],
      say: [
        "Au Texas, une fusée géante|revient de l'espace…",
        "et la tour la rattrape au vol,|avec deux bras géants !",
        "Une première|pour l'étage supérieur de Starship !",
        "Le but : des fusées réutilisables,|comme des avions !",
      ],
    },
    {
      category: "L'INSOLITE",
      title: "Voyager 1, à un jour-lumière",
      illustration: "probe",
      insolite: true,
      subs: [
        ["Mercredi, *Voyager 1*", "sera à un jour-lumière !"],
        ["Soit *25,9 milliards* de km :", "du jamais vu !"],
        ["Un message de la Terre", "met *un jour entier* !"],
        ["Lancée en *1977*,", "elle répond toujours !"],
      ],
      say: [
        "Mercredi, la sonde Voyager un|sera à un jour-lumière de nous !",
        "Soit vingt-cinq virgule neuf milliards de kilomètres :|du jamais vu !",
        "Un message envoyé de la Terre|met un jour entier à l'atteindre !",
        "Lancée en mille neuf cent soixante-dix-sept,|elle répond toujours !",
      ],
    },
  ],
  question: ["Et toi, quel message", "*enverrais-tu* à Voyager ?"],
  questionSay: "Et toi,|quel message tu enverrais à Voyager ?",
  subscribe: ["Abonne-toi pour", "l'*édition de demain*."],
  subscribeSay: "Abonne-toi|pour l'édition de demain !",
};
