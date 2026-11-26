import json
IDS = ["s01a","s01b","s02a","s02b","s03a","s04a","s04b","s05a","s05b","s06a","s06b","s07a","s07b","s08a","s08b","s09a","s09b","s10a","s10b","s11a","s11b","s12a","s12b","s13a","s14a","s15a","s15b","s15c","s15d","s16a"]
FIN = "Arrête de suivre les moutons. Suis le renard… et pense par toi-même !"
E = {}
def ep(slug, n, titre, sous, accroche, noms, lignes, apres, nomfich):
    assert len(lignes) == 29, (slug, len(lignes))
    assert lignes[24] == ("narr", "Retour au salon."), slug
    L = [[i, int(i[1:3]), w, (0.5 if w in ("mouton", "renard") else 0.4), t] for i, (w, t) in zip(IDS, lignes + [("narr", FIN)])]
    E[slug] = {"ep": slug, "nom": f"EP{n}_{nomfich}", "badge": f"ÉPISODE {n}", "titre": titre, "sous": sous, "accroche": accroche, "apres": apres, "noms": noms, "lignes": L}
