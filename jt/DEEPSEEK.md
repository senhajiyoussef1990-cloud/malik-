# Préparer une édition avec DeepSeek

DeepSeek écrit l'édition (recherche + texte). La vidéo est ensuite fabriquée dans ce projet :
coller la réponse de DeepSeek dans la conversation Claude Code (ou `/edition` + le contenu).

1. Ouvrir DeepSeek, activer **Recherche web** (Search) et, si possible, **DeepThink**.
2. Remplacer `[DATE]` par la date de l'édition (ex. « mercredi 18 novembre 2026 ») et coller le prompt.
3. Copier la réponse (le bloc de code et les sources) et la coller dans Claude Code.

---

## Prompt à coller dans DeepSeek

```
Tu es le rédacteur en chef de « L'Écho du Jour », un JT TikTok quotidien d'environ 1 minute, en français, présenté par Maurice, un journaliste des années 1930. Prépare l'édition du [DATE].

1. LES SUJETS
Cherche sur le web 3 faits survenus UNIQUEMENT LA VEILLE de cette date (heure de Paris). Jamais un événement à venir, jamais un chiffre publié plusieurs jours avant.
- EN FRANCE : une actu française importante ou marquante.
- DANS LE MONDE : une actu internationale forte.
- L'INSOLITE : une histoire vraie, légère et surprenante.
Préfère ce qui intrigue : record, première, découverte, exploit.

2. LES RÈGLES (non négociables)
- Chaque sujet confirmé par au moins DEUX médias sérieux et indépendants. Donne les liens.
- Pas de drame : ni attentat, ni mort, ni accident grave, ni victimes.
- Neutralité politique : les faits, sans opinion ni moquerie.
- Insolite vrai et vérifié, jamais une rumeur ou un canular.
- Texte réécrit avec tes mots, jamais recopié.
- Chiffres, dates, noms et lieux identiques aux sources. Pas d'exagération.
- Si tu n'es pas sûr d'un fait, dis-le au lieu de l'inventer.

3. LE FORMAT (respecte-le exactement)
Réponds par UN SEUL bloc de code JavaScript, puis la liste des sources. Modèle :

window.EDITION = {
  date: "MERCREDI 18 NOVEMBRE 2026",
  file: "ecodujour-2026-11-18-1",
  caption: "📰 L'Écho du Jour du 18 novembre : [sujet 1], [sujet 2] et [sujet 3]. [Question] 👇\n\n#actu #info #journal #ecodujour #[mot1] #[mot2] #[mot3]",
  storyCta: "LE JT EST EN LIGNE !",
  voice: "fr_FR-tom-medium",
  voiceEngine: "clone",
  phonetic: { },
  hook: ["Ligne 1 de l'accroche", "ligne 2 avec un *mot clé* !"],
  hookSay: "Phrase-choc sur l'insolite,|dite à voix haute !",
  hookIllustration: "globe",
  rubriques: [
    {
      category: "EN FRANCE",
      title: "Titre court (40 caractères max)",
      illustration: "globe",
      subs: [
        ["Ligne 1 (26 car. max)", "ligne 2 avec *mot clé*."],
        ["…", "…"],
        ["…", "…"],
        ["…", "…"]
      ],
      say: [
        "Ce que dit Maurice pour le sous-titre 1,|en toutes lettres !",
        "…", "…", "…"
      ]
    },
    { category: "DANS LE MONDE", ... même structure ... },
    { category: "L'INSOLITE", insolite: true, ... même structure ... }
  ],
  question: ["Une question qui fait", "*commenter* ?"],
  questionSay: "Une question|qui fait commenter ?",
  subscribe: ["Abonne-toi pour", "l'*édition de demain*."],
  subscribeSay: "Abonne-toi|pour l'édition de demain !"
};

Règles du format :
- 4 sous-titres (subs) et 4 répliques (say) par rubrique, dans le même ordre, qui disent la même chose.
- Chaque ligne de subs : 26 caractères MAXIMUM (compte-les), 2 lignes par sous-titre, un mot clé entre *astérisques*.
- say : TOUS les nombres, dates, sigles et symboles écrits en toutes lettres (« deux mille vingt-six », « un virgule six pour cent », « l'ONU »). « | » sépare deux phrases.
- Ton : vif et enjoué, comme une réclame des années 30, avec des points d'exclamation.
- phonetic : orthographe phonétique des noms propres difficiles, ex. { "Nebout": "Nebou" }.
- illustration : choisis parmi globe, pay, stage, mic, boat, rocket, probe, wine, ball, factory, cop, crabs. Si aucune ne convient, mets "globe" et décris le dessin voulu en commentaire.
- Dessins : jamais de visage d'une personne réelle, jamais de logo.
- Accroche : sur le sujet insolite. Question finale : liée à un des sujets.

4. APRÈS LE BLOC DE CODE
Liste, pour chaque sujet : les 2 sources (titre + lien + date de publication) et toute réserve (chiffre non confirmé, info qui peut évoluer).
```

---

## Ensuite, dans Claude Code

Coller la réponse de DeepSeek avec par exemple :

> Voici l'édition préparée par DeepSeek, vérifie-la et fabrique-la.

Claude enregistre `jt/editions/AAAA-MM-JJ-1.js`, la fait relire par le `verificateur`,
corrige si besoin (sous-titres trop longs, chiffres non confirmés), lance `jt/tools/daily.sh`
et livre la vidéo, la story et le texte de publication.
