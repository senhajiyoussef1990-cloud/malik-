"""Voix d'un épisode « Et si ? » sur Kaggle (CPU, Internet) : envoie voix.py + kit + repères, attend, récupère
voix/*.mp3 et timing.json dans --out. Utilise l'API Kaggle (www.kaggle.com/api/v1), identifiants pris par
l'environnement (KAGGLE_USERNAME / KAGGLE_KEY) ou injectés par le proxy.
  python kaggle_voix.py --kit … --cues … --out DOSSIER --owner papisrieux -- [options de voix.py]"""
import argparse, base64, io, json, os, sys, time, urllib.request, zipfile
from pathlib import Path

API = 'https://www.kaggle.com/api/v1'
ap = argparse.ArgumentParser()
ap.add_argument('--kit', required=True); ap.add_argument('--cues'); ap.add_argument('--out', required=True)
ap.add_argument('--owner', default=os.environ.get('KAGGLE_USERNAME', 'papisrieux'))
ap.add_argument('--slug', default='etsi-voix'); ap.add_argument('reste', nargs=argparse.REMAINDER)
a = ap.parse_args(); opts = [x for x in a.reste if x != '--']


def req(path, data=None):
    h = {'Content-Type': 'application/json'}
    if os.environ.get('KAGGLE_KEY'):
        h['Authorization'] = 'Basic ' + base64.b64encode(f"{os.environ['KAGGLE_USERNAME']}:{os.environ['KAGGLE_KEY']}".encode()).decode()
    r = urllib.request.Request(API + path, data=json.dumps(data).encode() if data is not None else None, headers=h)
    with urllib.request.urlopen(r, timeout=120) as f:
        return json.loads(f.read() or b'{}')


moteur = Path(__file__).resolve().parent
fichiers = {'voix.py': (moteur / 'voix.py').read_text(), 'kit.json': Path(a.kit).read_text()}
if a.cues: fichiers['cues.json'] = Path(a.cues).read_text()
args = ['--kit', 'kit.json', '--out', 'sortie'] + (['--cues', 'cues.json'] if a.cues else []) + opts
code = f'''import json, os, subprocess, sys, shutil, zipfile
F = json.loads({json.dumps(json.dumps(fichiers))})
os.makedirs('/kaggle/working/t/moteur', exist_ok=True); os.chdir('/kaggle/working/t')
for k, v in F.items(): open(('moteur/' if k == 'voix.py' else '') + k, 'w').write(v)
subprocess.run('which ffprobe || (apt-get update -qq && apt-get install -y -qq ffmpeg)', shell=True, check=True)
subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'edge-tts'], check=True)
subprocess.run([sys.executable, 'moteur/voix.py'] + {json.dumps(args)}, check=True)
with zipfile.ZipFile('/kaggle/working/voix.zip', 'w') as z:
    for r, _, fs in os.walk('sortie'):
        for f in fs: z.write(os.path.join(r, f), os.path.relpath(os.path.join(r, f), 'sortie'))
shutil.rmtree('/kaggle/working/t'); print('ok')
'''
ref = f'{a.owner}/{a.slug}'
t0 = time.time()
r = req('/kernels/push', {'slug': ref, 'newTitle': a.slug, 'text': code, 'language': 'python', 'kernelType': 'script',
                          'isPrivate': True, 'enableGpu': False, 'enableInternet': True, 'datasetDataSources': [],
                          'competitionDataSources': [], 'kernelDataSources': [], 'categoryIds': []})
print('envoyé :', r.get('url') or r, flush=True)
if r.get('error'): sys.exit(1)
time.sleep(15)
while True:
    s = req(f'/kernels/status?userName={a.owner}&kernelSlug={a.slug}')
    st = s.get('status'); print(f'{time.time() - t0:5.0f}s {st}', flush=True)
    if st in ('complete', 'error', 'cancelAcknowledged'): break
    time.sleep(10)
if st != 'complete':
    print(s.get('failureMessage', '')); sys.exit(1)
o = req(f'/kernels/output?userName={a.owner}&kernelSlug={a.slug}')
url = next(f['url'] for f in o.get('files', []) if f['fileName'].endswith('voix.zip'))
data = urllib.request.urlopen(url, timeout=120).read()
out = Path(a.out); out.mkdir(parents=True, exist_ok=True); zipfile.ZipFile(io.BytesIO(data)).extractall(out)
tm = json.load(open(out / 'timing.json'))
print(f"voix récupérées en {time.time() - t0:.0f}s : {tm['voice']} · {tm['duration']} s")
