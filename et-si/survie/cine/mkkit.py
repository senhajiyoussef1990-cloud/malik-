"""Crée cine/EPxxx/kit.json depuis le lot (texte mot pour mot, fin de la série « … pour plus de conseils »).
usage : python mkkit.py EP003"""
import glob, json, os, sys
ep = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(os.path.join(here, '..', 'domestique', 'kits-90s-lot-*.json'))):
    for e in json.load(open(f))['episodes']:
        if e['id'] == ep:
            kit = {'id': ep, 'title': e['title'], 'sources': [e['source']] if isinstance(e.get('source'), str) else e.get('sources', []),
                   'verification': e.get('verification'), 'publication': e.get('publication'),
                   'note': f"Texte repris mot pour mot de {os.path.basename(f)} ({ep}) ; fin de la série « … pour plus de conseils ».",
                   'scenes': [{'voix': s['voix']} for s in e['scenes']]}
            kit['scenes'][-1]['voix'] = kit['scenes'][-1]['voix'].replace('Partage cette vidéo et abonne-toi.', 'Partage cette vidéo et abonne-toi pour plus de conseils.')
            os.makedirs(os.path.join(here, ep), exist_ok=True)
            json.dump(kit, open(os.path.join(here, ep, 'kit.json'), 'w'), ensure_ascii=False, indent=1); print('ok', ep, e['title']); sys.exit()
sys.exit('introuvable : ' + ep)
