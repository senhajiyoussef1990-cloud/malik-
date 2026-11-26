import json
FIN = "Arrête de suivre les moutons. Suis le renard… et pense par toi-même !"
IDS = [("h1",1),("s02a",2),("s02b",2),("s03a",3),("s03b",3),("s04a",4),("s04b",4),("s05a",5),("s06a",6),("s06b",6),("s07a",7),("s08a",8),("s08b",8),("s09a",9),("s16a",10)]
def ep(slug, n, nom, titre, sous, accroche, noms, lignes):
    assert len(lignes) == 14, (slug, len(lignes))
    L = [[i, s, w, (0.35 if w in ("mouton", "renard") else 0.3), t] for (i, s), (w, t) in zip(IDS, lignes + [("narr", FIN)])]
    json.dump({"ep": slug, "nom": f"EP{n}_{nom}", "badge": f"ÉPISODE {n}", "titre": titre, "sous": sous, "accroche": accroche, "apres": "aucun", "noms": noms, "lignes": L, "format": "court"}, open(f"{slug}.json", "w"), ensure_ascii=False, indent=1)
ep("frais", 57, "Les_frais_de_la_fin", "LES FRAIS DE LA FIN", "« Le vrai prix est sur la dernière page »", "Trente euros… et à la fin ?", {"aubergiste": "AUBERGISTE"}, [
 ("narr", "Ce repas était affiché deux sous. Le voyageur en a payé cinq… sans discuter."),
 ("mouton", "Un concert à trente euros ! Je réserve… Attends. Quarante-cinq euros ?!"),
 ("renard", "Bienvenue dans le piège de la dernière page."),
 ("aubergiste", "Repas complet, deux sous seulement ! Entrez, entrez !"),
 ("narr", "Le voyageur s’installe et mange. Puis l’addition arrive."),
 ("aubergiste", "La chaise, un sou. La bougie, un sou. Et la cuillère, encore un sou !"),
 ("mouton", "Mais il a déjà mangé ! Il ne peut plus partir !"),
 ("renard", "À ton avis : pourquoi les frais n’arrivent-ils qu’à la toute fin ?"),
 ("renard", "Réponse B. Quand tu as tout choisi, tu n’oses plus faire demi-tour."),
 ("narr", "On appelle ça le prix découpé : un petit prix pour attirer, les frais pour la fin."),
 ("narr", "Billets, hôtels, livraisons : les frais apparaissent souvent au dernier écran."),
 ("mouton", "Donc je compare les prix… de la dernière page ?"),
 ("renard", "Exactement. Le vrai prix, c’est celui de la dernière page."),
 ("renard", "Et toi, quels frais cachés t’ont déjà surpris ? Dis-le en commentaire !"),
])
ep("tulipes", 65, "La_folie_des_tulipes", "LA FOLIE DES TULIPES", "« Un prix n’est pas une valeur »", "Un bulbe au prix d’une maison ?", {"marchand": "MARCHAND", "acheteur": "ACHETEUR"}, [
 ("narr", "En mille six cent trente-sept, un simple oignon de fleur valait le prix d’une maison."),
 ("mouton", "Cette monnaie a doublé en un mois ! Si j’achète maintenant, je suis riche !"),
 ("renard", "C’est exactement ce qu’ils disaient… des tulipes."),
 ("marchand", "Dix florins le mois dernier, cent aujourd’hui ! Demain, mille !"),
 ("narr", "Plus personne n’achète des fleurs pour les planter. On achète parce que le prix monte."),
 ("acheteur", "J’ai vendu ma vache pour un bulbe ! Je le revends la semaine prochaine !"),
 ("mouton", "Et si plus personne ne veut le racheter ?"),
 ("renard", "À ton avis : que s’est-il passé, un matin de février ?"),
 ("renard", "Réponse B. Les acheteurs ne sont plus venus. Et les prix se sont effondrés."),
 ("narr", "C’est une bulle : un prix qui monte surtout parce qu’on espère qu’il montera encore."),
 ("narr", "Depuis, d’autres bulles ont éclaté : actions, maisons, cryptomonnaies."),
 ("mouton", "Donc ce qui monte très vite peut s’écrouler aussi vite ?"),
 ("renard", "Oui. Quand on achète parce que ça monte, on oublie ce que ça vaut."),
 ("renard", "Et toi, tu as déjà acheté un truc juste parce que tout le monde en parlait ? Raconte-nous !"),
])
ep("pastille", 52, "La_pastille_rouge", "LA PASTILLE ROUGE", "« Tout ce qui sonne n’est pas important »", "Encore une notification… urgente ?", {"crieur": "CRIEUR", "villageoise": "VILLAGEOISE"}, [
 ("narr", "Ce crieur sonnait sa cloche cinquante fois par jour… pour annoncer des croissants."),
 ("mouton", "Attends, une notification. Encore une ! Et une autre ! Je dois tout lire, tout de suite !"),
 ("renard", "Vingt-trois pastilles rouges. Et combien de vraies urgences ?"),
 ("crieur", "Oyez, oyez ! Le boulanger a des croissants ! Oyez, oyez !"),
 ("narr", "À chaque coup de cloche, tout le village lâche ce qu’il fait et court sur la place."),
 ("villageoise", "J’ai encore laissé brûler ma soupe ! Mais si c’était important ?"),
 ("mouton", "Le jour d’un vrai danger, plus personne ne saura quoi écouter !"),
 ("renard", "À ton avis : pourquoi les pastilles des applications sont-elles rouges ?"),
 ("renard", "Réponse B. Le rouge, c’est la couleur de l’alerte. Même pour une simple pub."),
 ("narr", "Chaque interruption casse la concentration, et il faut du temps pour la retrouver."),
 ("narr", "Dans les réglages, tu peux choisir qui a le droit de sonner. Et couper le reste."),
 ("mouton", "Alors je garde seulement les vraies personnes, et je coupe tout le reste."),
 ("renard", "Bonne idée. Tout ce qui sonne n’est pas important."),
 ("renard", "Et toi, combien de pastilles rouges sur ton écran, là, maintenant ? Dis-le en commentaire !"),
])
print("ok")
