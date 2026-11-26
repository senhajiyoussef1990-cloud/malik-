# Saison 2 — épisodes 51 à 60

Les dix scénarios et les publications sont enregistrés. 30 répliques, 16 scènes par épisode. Fables fictives. Le générateur de sources adapte le modèle de la saison 1 aux dix nouveaux sujets (première version, à tester visuellement). Les voix et MP4 ne sont pas encore générés.

- [51 — Le défilement sans fin](s2_51/specification.json)
- [52 — La pastille rouge](s2_52/specification.json)
- [53 — La lecture automatique](s2_53/specification.json)
- [54 — La flamme à ne pas perdre](s2_54/specification.json)
- [55 — Le bouton Tout accepter](s2_55/specification.json)
- [56 — L'abonnement labyrinthe](s2_56/specification.json)
- [57 — Les frais qui apparaissent à la fin](s2_57/specification.json)
- [58 — Le prix qui change selon toi](s2_58/specification.json)
- [59 — 12 personnes regardent cet hôtel](s2_59/specification.json)
- [60 — Les fausses promos du Black Friday](s2_60/specification.json)

## Préparer et fabriquer

1. Installer l’environnement décrit dans GUIDE_CHATGPT.md.
2. `python3 outils_commun/preparer_saison2.py` (ou passer 51 à 60 pour un seul épisode). Génère les fichiers locaux de dessin et montage, recopie les références vocales et les assets. Contrôle syntaxique si Node est installé.
3. Générer les voix : `sh outils_commun/voix_episodes.sh s2_51`. Vérifier les voix et le minutage selon le guide.
4. Produire et valider les aperçus AVANT le rendu complet, conformément au guide.
5. `sh outils_commun/fin_s2_51.sh` ; répéter pour chaque épisode. Les ZIP seront dans les dossiers sortie. Ne pas annoncer une vidéo produite avant le rendu et les contrôles.
