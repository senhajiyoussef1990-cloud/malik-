"""Voix + calage d'un épisode « Et si ? ».

Génère une piste par scène avec edge-tts, mesure les durées réelles, puis écrit
timing.json : début/durée de chaque scène, sous-titres calés sur les mots, repères
d'animation. Usage :
  python voix.py --ep 1 --out sortie/ep01 [--voice fr-FR-RemyMultilingualNeural] [--rate +6%] [--simulate]
"""
import argparse, asyncio, json, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCENARIOS = ROOT / 'scenarios' / 'saison-01-episodes-01-10.json'

# texte dit -> texte affiché (jamais coupé entre deux sous-titres)
AFFICHAGE = {
    'mille six cent soixante-dix kilomètres par heure': '1 670 km/h',
    'cinq secondes': '5 secondes',
    'vingt-quatre heures': '24 heures',
    'huit milliards': '8 milliards',
}
SLUG = {'000': 'prototype-poele-feu', '001': 'casserole-huile-feu', '002': 'adulte-etouffement'}
MOTS_CLES = {'feu', 'casserole', 'jamais', 'eau', 'chaleur', 'danger', 'secours', 'dehors', 'porte', 'sors', 'partage', 'proches', 'quitte', 'avertis', 'flammes', 'boule', 'terre', 'tourner', 'équateur', 'est', 'atmosphère', 'vents', 'océans', 'inondations', 'pôles',
             'gravité', 'orbite', 'soleil', 'année', 'rotation', 'scénario', 'seconde', 'prochain', 'épisode',
             'abonne-toi', 'suite', 'lune', 'jupiter', 'dinosaures', 'fourmis', 'casque', 'espace', 'trou', 'noir'}
PETITS = {'pour', 'à', 'tout', 'ce', 'de', 'la', 'le', 'les', 'du', 'des', 'et', 'un', 'une', 'en', 'au', 'tu',
          'ne', 'se', 'qui', 'près', 'vers', 'sont', "c'est", 'elle', 'si', 'pendant'}
# repères d'animation : scène (index 0) -> début du mot qui déclenche l'effet
REPERES = {'EP01': [(0, 0, "arrêt"), (7, 7, "Terre"), (9, 9, "Abonne")],
           'EP001': [(1, 'recule', 'déplace'), (2, 'croix', 'jamais'), (3, 'coupe', 'Coupe'),
                     (4, 'porte', 'ferme'), (4, 'avertis', 'avertis'), (4, 'sors', 'sors.'),
                     (4, 'appel', 'Appelle'), (5, 'partage', 'Partage'), (5, 'abonne', 'abonne')]}


def duree(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                          '-of', 'csv=p=0', str(f)]).decode().strip())


async def tts(texte, voice, rate, out):
    import edge_tts
    try:
        com = edge_tts.Communicate(texte, voice, rate=rate, boundary='WordBoundary')
    except TypeError:  # anciennes versions : WordBoundary par défaut
        com = edge_tts.Communicate(texte, voice, rate=rate)
    mots = []
    with open(out, 'wb') as f:
        async for ch in com.stream():
            if ch['type'] == 'audio':
                f.write(ch['data'])
            elif ch['type'] == 'WordBoundary':
                mots.append((ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7))
    return mots


VOIX_SECOURS = ['fr-FR-RemyMultilingualNeural', 'fr-FR-HenriNeural']
VOIX_UTILISEES = set()


def dire(texte, a, f):
    import time
    reprise = bool(os.environ.get('ETSI_VOIX_REPRISE'))  # reprise : une seule voix, plus d'essais
    for v in [a.voice] + ([] if reprise else [x for x in VOIX_SECOURS if x != a.voice]):
        for essai in range(6 if reprise else 3):
            try:
                mots = asyncio.run(tts(texte, v, a.rate, f))
                if f.stat().st_size > 1000:
                    VOIX_UTILISEES.add(v); a.voice = v  # la voix de secours devient la voix de la suite
                    return mots
            except Exception as e:
                print(f'  {v} essai {essai + 1} : {type(e).__name__} {e}', flush=True)
            time.sleep(3 * (essai + 1))
    raise SystemExit('Aucune voix edge-tts disponible')


def simule(texte, out):
    """Hors ligne : silence de la bonne longueur + mots répartis au prorata."""
    mots_txt = texte.split()
    d = max(1.5, len(texte) / 15.5)
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'lavfi', '-i', 'anullsrc=r=24000:cl=mono', '-t', f'{d:.2f}',
                    '-c:a', 'libmp3lame', '-b:a', '48k', str(out)], check=True)
    tot = sum(len(w) + 1 for w in mots_txt); x = 0.1; mots = []
    for w in mots_txt:
        dw = (d - 0.2) * (len(w) + 1) / tot; mots.append((re.sub(r'[?!.,:;…]', '', w), x, x + dw * 0.9)); x += dw
    return mots


def unites(texte):
    """Découpe le texte dit en unités affichables, avec leur position dans le texte."""
    out, i = [], 0
    while i < len(texte):
        if texte[i].isspace():
            i += 1; continue
        for dit, vu in AFFICHAGE.items():
            if texte.lower().startswith(dit, i):
                out.append({'w': vu, 'pos': i}); i += len(dit); break
        else:
            j = i
            while j < len(texte) and not texte[j].isspace():
                j += 1
            w = texte[i:j]
            if w in '?!:;' and out:
                out[-1]['w'] += ' ' + w
            else:
                out.append({'w': w, 'pos': i})
            i = j
    return out


def caler(texte, mots, t0):
    """Associe à chaque unité l'instant où elle est dite (repère = mots edge-tts)."""
    reperes, cur = [], 0
    for w, a, b in mots:
        k = texte.find(w, cur)
        if k >= 0:
            reperes.append((k, a, b, w)); cur = k + len(w)
    us = unites(texte)
    for u in us:
        avant = [r for r in reperes if r[0] <= u['pos'] + 1]
        u['t'] = t0 + (avant[-1][1] if avant else 0.0)
    return us, reperes


MAXC = 22
# signature de la série, dite au début de chaque épisode juste après « Et si … ? »
SIGNATURE = 'Saurais-tu comment réagir ?'

def morceaux(us):
    ch, cur = [], []
    for u in us:
        if cur and (len(' '.join(x['w'] for x in cur + [u])) > MAXC or cur[-1]['w'][-1] in '.?!…'):
            report = []
            while len(cur) > 1 and cur[-1]['w'].lower() in PETITS:
                report.insert(0, cur.pop())
            ch.append(cur); cur = report
        cur.append(u)
    if cur:
        ch.append(cur)
    return ch


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--ep', type=int, default=1)
    ap.add_argument('--out', required=True)
    ap.add_argument('--voice', default='fr-FR-RemyMultilingualNeural')
    ap.add_argument('--rate', default='+6%')
    ap.add_argument('--simulate', action='store_true')
    ap.add_argument('--kit', help='kit de vérification (format survie)')
    ap.add_argument('--mini', type=float, default=3.2, help='durée minimale d\'une scène')
    ap.add_argument('--id', help='épisode à prendre dans un fichier de lot (kits-90s-lot-XX.json)')
    ap.add_argument('--cues', help='repères d\'animation : [[scène, clé, mot], ...]')
    ap.add_argument('--maxchars', type=int, default=22)
    ap.add_argument('--first', type=float, default=4.0)
    ap.add_argument('--tagline', default=SIGNATURE, help='phrase-signature dite après la question d\'ouverture ("" pour aucune)')
    ap.add_argument('--tagline-shown', action='store_true', help='l\'animation affiche déjà la signature : pas de sous-titre pour elle')
    ap.add_argument('--last', type=float, default=6.5)
    ap.add_argument('--tail', type=float, default=0.45, help='silence après la voix dans chaque scène')
    ap.add_argument('--end-tail', type=float, default=None, help='silence après la voix dans la dernière scène (fin plus douce)')
    a = ap.parse_args()
    if a.kit:
        k = json.load(open(a.kit))
        if 'episodes' in k:
            k = next(e for e in k['episodes'] if e['id'] == a.id)
        kid = k['id'] if str(k['id']).startswith('EP') else 'EP' + k['id']
        ep = {'id': kid, 'slug': SLUG.get(kid[2:], 'episode'), 'title': k.get('title', ''),
              'scenes': [{'narration': x['voix']} for x in k['scenes']]}
    else:
        ep = json.load(open(SCENARIOS))['episodes'][a.ep - 1]
    out = Path(a.out); (out / 'voix').mkdir(parents=True, exist_ok=True)
    scenes, caps, cues, t = [], [], {}, 0.0
    global MAXC
    MAXC = a.maxchars
    PAD_AV, PAD_AP = 0.25, a.tail
    if a.cues:
        REPERES[ep['id']] = json.load(open(a.cues))
    if a.tagline and a.tagline.lower() not in ep['scenes'][0]['narration'].lower():
        ep['scenes'][0]['narration'] = ep['scenes'][0]['narration'].rstrip() + ' ' + a.tagline
    for si, s in enumerate(ep['scenes']):
        texte = s['narration']
        f = out / 'voix' / f's{si+1:02d}.mp3'
        mots = simule(texte, f) if a.simulate else dire(texte, a, f)
        dv = duree(f)
        mini = {0: a.first, len(ep['scenes']) - 1: a.last}.get(si, a.mini)
        ap_ = a.end_tail if (a.end_tail is not None and si == len(ep['scenes']) - 1) else PAD_AP
        d = round(round(max(mini, PAD_AV + dv + ap_) * 30) / 30, 4)
        us, rep = caler(texte, mots, t + PAD_AV)
        for si2, cle, mot in REPERES.get(ep['id'], []):
            if si2 == si:
                for k, ta, tb, w in rep:
                    if mot.lower().strip('.') in w.lower():
                        cues[cle] = round(PAD_AV + ta, 3); break
        if si == 0:  # la question (et la signature) sont déjà à l'écran
            us = [] if a.tagline_shown else [u for u in us if u['pos'] > texte.find('?')]
        for c in morceaux(us):
            caps.append({'s': c[0]['t'], 'toks': [{'w': u['w'].replace(' ', ' '),
                         'k': re.sub(r"[^\wéèêàâôûùçîï'-]", '', u['w'].lower()).split("'")[-1] in MOTS_CLES
                         or any(ch.isdigit() for ch in u['w'])} for u in c]})
        scenes.append({'scene': si + 1, 'start': round(t, 3), 'dur': d, 'voix': str(f.name), 'voix_dur': dv})
        t += d
    for i, c in enumerate(caps):  # fin = début du suivant (ou fin de scène)
        nxt = caps[i + 1]['s'] if i + 1 < len(caps) else t
        c['e'] = round(min(nxt, c['s'] + 2.6), 3); c['s'] = round(c['s'], 3)
    for c in caps:  # pas de sous-titre qui déborde sur la scène suivante
        sc = [x for x in scenes if x['start'] <= c['s'] + 1e-6][-1]
        c['e'] = min(c['e'], round(sc['start'] + sc['dur'] - 0.05, 3))
    if len(VOIX_UTILISEES) > 1 and not os.environ.get('ETSI_VOIX_REPRISE'):
        # une seule voix par épisode : on régénère tout avec la voix qui a fonctionné en dernier
        print('voix mélangées', sorted(VOIX_UTILISEES), '-> tout refaire avec', a.voice, flush=True)
        os.environ['ETSI_VOIX_REPRISE'] = '1'
        args = [x for x in sys.argv[1:]]
        if '--voice' in args:
            i = args.index('--voice'); del args[i:i + 2]
        args = [x for x in args if not x.startswith('--voice=')]
        os.execv(sys.executable, [sys.executable, __file__] + args + ['--voice', a.voice])
    if len(VOIX_UTILISEES) > 1:
        raise SystemExit(f'voix mélangées malgré la reprise : {sorted(VOIX_UTILISEES)}')
    json.dump({'episode': a.ep, 'id': ep['id'], 'slug': ep['slug'], 'voice': sorted(VOIX_UTILISEES) or [a.voice], 'rate': a.rate,
               'title': ep.get('title') or ep.get('titre', ''), 'duration': round(t, 3), 'scenes': scenes, 'captions': caps, 'cues': cues},
              open(out / 'timing.json', 'w'), ensure_ascii=False, indent=1)
    print('voix utilisée(s) :', sorted(VOIX_UTILISEES))
    print(f"{ep['id']} : {t:.1f} s, {len(caps)} sous-titres, repères {cues}")


if __name__ == '__main__':
    main()
