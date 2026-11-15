// Contenu de l'édition : seul fichier à changer chaque jour.
// Mots entre *astérisques* = mot clé surligné dans les sous-titres.
window.EDITION = {
  date: "DIMANCHE 15 NOVEMBRE 2026",
  file: "ecodujour-2026-11-15-1",
  hook: ["Une conférence sur une panne…", "*tombée en panne* !"],
  hookIllustration: "mic",
  // Voix : texte dit par Maurice (| = nouvelle phrase, la voix monte d'un cran)
  voice: "fr_FR-tom-medium",
  hookSay: "Une conférence sur une panne…|tombée en panne !",
  rubriques: [
    {
      category: "EN FRANCE",
      title: "Le Smic grimpe en décembre",
      illustration: "pay",
      say: [
        "Le premier décembre, le Smic|augmente de un virgule six pour cent !",
        "Environ mille cinq cent deux euros net par mois,|soit vingt-quatre euros de plus !",
        "Ça compte dès la paie|de décembre !",
      ],
      subs: [
        ["Le 1er décembre, le Smic", "augmente de *1,6 %*."],
        ["Environ *1 502 € net* par mois,", "soit 24 € de plus."],
        ["Ça compte dès la paie", "de *décembre*."],
      ],
    },
    {
      category: "DANS LE MONDE",
      title: "Première victoire à l'Eurovision Asie",
      illustration: "stage",
      say: [
        "Hier soir à Bangkok,|le tout premier Eurovision Asie !",
        "Victoire des Philippines,|devant la Thaïlande et le Vietnam !",
        "Onze pays en lice|pour cette grande première !",
      ],
      subs: [
        ["Hier soir à Bangkok, le tout", "premier *Eurovision Asie*."],
        ["Victoire des *Philippines*,", "devant Thaïlande et Vietnam."],
        ["*Onze pays* en lice", "pour cette première."],
      ],
    },
    {
      category: "L'INSOLITE",
      title: "La panne qui parlait de panne",
      illustration: "mic",
      insolite: true,
      say: [
        "À Washington, une conférence|sur une panne géante des aéroports…",
        "Premier souci : le micro…|tombe en panne !",
        "Trois minutes de silence|avant que tout reparte !",
      ],
      subs: [
        ["À Washington, conférence sur", "une *panne géante* des aéroports."],
        ["Premier souci : le micro…", "*tombe en panne* !"],
        ["*Trois minutes* de silence", "avant que tout reparte."],
      ],
    },
  ],
  question: ["Et toi, ta dernière panne", "*au pire moment* ?"],
  questionSay: "Et toi, ta dernière panne|au pire moment ?",
  subscribe: ["Abonne-toi pour", "l'*édition de demain*."],
  subscribeSay: "Abonne-toi|pour l'édition de demain !",
};
