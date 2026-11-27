"""Rendu vidéo d'un épisode « Et si ? » à partir de timing.json (une vidéo par scène, puis concat)."""
import argparse, base64, json, os, shutil, subprocess
from pathlib import Path
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument('--anim', required=True)
ap.add_argument('--out', required=True)
ap.add_argument('--chrome', default=os.environ.get('CHROME_PATH'))
ap.add_argument('--jobs', type=int, default=1, help='navigateurs en parallèle')
a = ap.parse_args()
out = Path(a.out); tm = json.load(open(out / 'timing.json')); FPS = 30
parts = out / 'parts'; parts.mkdir(exist_ok=True)
ap_jobs = a.jobs


def rendre(indices):
    with sync_playwright() as p:
        kw = {'args': ['--allow-file-access-from-files']}
        if a.chrome: kw['executable_path'] = a.chrome
        br = p.chromium.launch(**kw)
        pg = br.new_page(viewport={'width': 1080, 'height': 1920})
        pg.goto(Path(a.anim).resolve().as_uri())
        pg.wait_for_function('window.READY'); pg.evaluate('READY')
        outro = tm['scenes'][-1]['start']
        pg.evaluate(f"setCaptions({json.dumps(tm['captions'])},{outro})")
        pg.evaluate(f"setCues({json.dumps(tm['cues'])})")
        for si in indices:
            s = tm['scenes'][si]
            n = round(s['dur'] * FPS); tmp = parts / f's{si+1:02d}.tmp.mp4'; fin = parts / f's{si+1:02d}.mp4'
            ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', str(FPS), '-c:v', 'mjpeg',
                                   '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p',
                                   '-r', str(FPS), str(tmp)], stdin=subprocess.PIPE)
            for f in range(n):
                lt = f / FPS
                url = pg.evaluate(f"render({s['start'] + lt},{si},{lt},{s['dur']})")
                ff.stdin.write(base64.b64decode(url.split(',')[1]))
            ff.stdin.close(); assert ff.wait() == 0
            os.replace(tmp, fin); print('scène', si + 1, 'ok', flush=True)
        br.close()


# répartition des scènes entre --jobs navigateurs (les plus longues d'abord)
ordre = sorted(range(len(tm['scenes'])), key=lambda i: -tm['scenes'][i]['dur'])
lots = [[] for _ in range(max(1, ap_jobs))]; charge = [0.0] * len(lots)
for i in ordre:
    k = charge.index(min(charge)); lots[k].append(i); charge[k] += tm['scenes'][i]['dur']
if len(lots) == 1:
    rendre(lots[0])
else:
    import multiprocessing as mp
    with mp.get_context('fork').Pool(len(lots)) as pool:
        pool.map(rendre, [l for l in lots if l])
lst = [f"file '{(parts / f's{i+1:02d}.mp4').resolve()}'" for i in range(len(tm['scenes']))]
(parts / 'list.txt').write_text('\n'.join(lst) + '\n')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(parts / 'list.txt'),
                '-c', 'copy', str(out / 'video.mp4')], check=True)
