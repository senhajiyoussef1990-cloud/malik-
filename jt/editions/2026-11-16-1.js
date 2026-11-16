// Édition du lundi 16 novembre 2026.
// Mots entre *astérisques* = mot clé surligné. say = texte dit (nombres en lettres, | = nouvelle phrase).
window.EDITION = {
  date: "LUNDI 16 NOVEMBRE 2026",
  file: "ecodujour-2026-11-16-1",
  caption: "📰 L'Écho du Jour du 16 novembre : un tonneau de vin à un million d'euros à Beaune, un El Niño géant dans le Pacifique, et Voyager 1 bientôt à un jour-lumière de la Terre. Et toi, tu paierais combien pour un tonneau ? 👇\n\n#actu #info #journal #ecodujour #beaune #elnino #voyager1",
  storyCta: "LE JT EST EN LIGNE !",
  voice: "fr_FR-tom-medium",
  voiceEngine: "clone",
  phonetic: { "El Niño": "El Nigno" },
  hook: ["Un tonneau de vin", "à *un million* d'euros !"],
  hookSay: "Un tonneau de vin|à un million d'euros !",
  hookIllustration: "wine",
  rubriques: [
    {
      category: "EN FRANCE",
      title: "Beaune : un tonneau à 1 million",
      illustration: "wine",
      subs: [
        ["Dimanche à Beaune, la", "vente des *Hospices*."],
        ["La pièce de charité part", "à *un million* d'euros !"],
        ["Adjugée 770 000 €,", "*un don* complète la somme."],
        ["Au total : *14,4 millions*", "malgré une petite récolte."],
      ],
      say: [
        "Dimanche à Beaune,|c'est la vente des vins des Hospices !",
        "La pièce de charité|part à un million d'euros !",
        "Adjugée sept cent soixante-dix mille euros,|un don complète la somme !",
        "Au total, quatorze virgule quatre millions d'euros,|malgré une petite récolte !",
      ],
    },
    {
      category: "DANS LE MONDE",
      title: "Un El Niño géant se prépare",
      illustration: "globe",
      subs: [
        ["Dans le Pacifique, *El Niño*", "chauffe l'océan."],
        ["*+2 °C* : le 2e plus fort", "depuis 1950."],
        ["Seul celui de *1997* était", "plus puissant."],
        ["*83 %* de chances qu'il", "batte le record !"],
      ],
      say: [
        "Dans le Pacifique,|El Niño fait chauffer l'océan !",
        "Plus deux degrés :|le deuxième plus fort depuis mille neuf cent cinquante !",
        "Seul celui de mille neuf cent quatre-vingt-dix-sept|était plus puissant à cette période !",
        "Quatre-vingt-trois pour cent de chances|qu'il batte le record !",
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
  question: ["Et toi, tu paierais combien", "pour *un tonneau* ?"],
  questionSay: "Et toi,|tu paierais combien pour un tonneau ?",
  subscribe: ["Abonne-toi pour", "l'*édition de demain*."],
  subscribeSay: "Abonne-toi|pour l'édition de demain !",
};
