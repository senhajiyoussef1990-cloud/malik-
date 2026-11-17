// Édition 2 du mardi 17 novembre 2026 — contenu fourni par l'utilisateur.
// Mots entre *astérisques* = mot clé surligné. say = texte dit (nombres en lettres, | = nouvelle phrase).
window.EDITION = {
  date: "MARDI 17 NOVEMBRE 2026",
  file: "ecodujour-2026-11-17-2",
  caption: "📰 L'Écho du Jour du 17 novembre : Renault va embaucher 2 000 personnes en France, la COP31 entre dans sa dernière semaine à Antalya, et des millions de crabes rouges envahissent les routes de l'île Christmas. Laquelle t'a le plus surpris ? 👇\n\n#actu #info #journal #ecodujour #renault #cop31 #crabes",
  storyCta: "LE JT EST EN LIGNE !",
  voice: "fr_FR-tom-medium",
  voiceEngine: "clone",
  phonetic: { "Antalya": "Antalia" },
  hook: ["Des millions de *crabes*", "envahissent les routes !"],
  hookSay: "Des millions de crabes rouges|envahissent les routes d'une île !",
  hookIllustration: "crabs",
  rubriques: [
    {
      category: "EN FRANCE",
      title: "Renault va embaucher 2 000 personnes en France",
      illustration: "factory",
      subs: [
        ["*2 000 postes* d'ici 2028,", "surtout dans les usines."],
        ["Dont *1 650 opérateurs*", "et 100 jeunes diplômés."],
        ["Mais *1 000 départs*", "volontaires en bureaux."],
      ],
      say: [
        "Deux mille postes créés d'ici deux mille vingt-huit,|surtout dans les usines !",
        "Dont mille six cent cinquante opérateurs de production,|et cent jeunes diplômés !",
        "En parallèle,|mille départs volontaires dans les bureaux.",
      ],
    },
    {
      category: "DANS LE MONDE",
      title: "COP31 : dernière ligne droite pour le climat",
      illustration: "cop",
      subs: [
        ["Conférence de l'ONU", "sur le climat à *Antalya*."],
        ["Elle entre dans sa", "*dernière semaine*."],
        ["Au menu : *pétrole*,", "gaz et charbon."],
      ],
      say: [
        "Conférence de l'ONU sur le climat|à Antalya, en Turquie !",
        "Elle entre dans sa deuxième|et dernière semaine !",
        "Les pays négocient|sur le pétrole, le gaz et le charbon !",
      ],
    },
    {
      category: "L'INSOLITE",
      title: "Des millions de crabes rouges en balade",
      illustration: "crabs",
      insolite: true,
      subs: [
        ["Sur l'*île Christmas*,", "la grande migration !"],
        ["Ils quittent la forêt", "pour *pondre* dans la mer."],
        ["Des *ponts* rien que", "pour eux, sans danger !"],
      ],
      say: [
        "Sur l'île Christmas, en Australie,|la grande migration a commencé !",
        "Les crabes quittent la forêt|pour pondre dans la mer !",
        "Des ponts spéciaux sont installés|pour qu'ils traversent sans danger !",
      ],
    },
  ],
  question: ["Laquelle t'a", "le plus *surpris* ?"],
  questionSay: "Laquelle|t'a le plus surpris ?",
  subscribe: ["Abonne-toi pour", "l'*édition de demain*."],
  subscribeSay: "Abonne-toi|pour l'édition de demain !",
};
