# Script exécuté sur Kaggle (GPU) : fabrique les voix de plusieurs épisodes, renvoie un zip par épisode dans /kaggle/working.
import glob, os, subprocess, zipfile, json, shutil
W = "/kaggle/working/projet"
z = glob.glob("/kaggle/input/**/paquet.zip", recursive=True)
if z: zipfile.ZipFile(z[0]).extractall(W)
else: shutil.copytree(os.path.dirname(glob.glob("/kaggle/input/**/episodes.json", recursive=True)[0]), W)   # Kaggle a déjà décompressé le paquet
os.chdir(W); print(os.listdir("."), flush=True)
sh = lambda c: subprocess.run(c, shell=True, check=True)
sh("which ffmpeg || (apt-get update -qq && apt-get install -y -qq ffmpeg)")
sh("pip install -q uv && uv venv -p 3.12 /kaggle/working/cb && uv pip install --python /kaggle/working/cb/bin/python torch==2.6.0 torchaudio==2.6.0 chatterbox-tts==0.1.7 'setuptools<81' faster-whisper==1.2.1 noisereduce==3.0.3 scipy")
PY = "/kaggle/working/cb/bin/python"; sh(f"{PY} -c \"import torch;print('torch', torch.__version__, torch.cuda.is_available(), torch.cuda.device_count())\"")
eps = json.load(open("episodes.json")); print("épisodes :", eps, flush=True)
ng = max(1, len(subprocess.run("nvidia-smi -L", shell=True, capture_output=True, text=True).stdout.strip().splitlines())); print("GPU :", ng, flush=True)
def lot(gpu, liste):   # une file d'épisodes par GPU
    env = dict(os.environ, CUDA_VISIBLE_DEVICES=str(gpu), HF_HUB_DISABLE_XET="1", PATH="/kaggle/working/cb/bin:" + os.environ["PATH"])
    cmd = " ; ".join(f"DEVICE=cuda {PY} outils_commun/prises.py {e} > {e}/travail/prises.log 2>&1 ; DEVICE=cpu {PY} outils_commun/choix_prises.py {e} > {e}/travail/choix.log 2>&1" for e in liste)
    return subprocess.Popen(cmd, shell=True, env=env)
for e in eps: os.makedirs(f"{e}/travail", exist_ok=True)
procs = [lot(k % ng, eps[k::2]) for k in range(2)]
for p in procs: p.wait()
for e in eps:   # accélération des personnages (pas du narrateur), comme sur la machine
    for l in json.load(open(f"{e}/lignes.json")):
        f = f"{e}/voix/{l['id']}.mp3"
        if l["who"] != "narr" and os.path.exists(f):
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f, "-af", "atempo=1.07", "-c:a", "libmp3lame", "-q:a", "2", f[:-4] + ".t.mp3"], check=True); os.replace(f[:-4] + ".t.mp3", f)
    with zipfile.ZipFile(f"/kaggle/working/voix_{e}.zip", "w") as zz:
        for f in glob.glob(f"{e}/voix/*.mp3") + glob.glob(f"{e}/travail/*.txt") + glob.glob(f"{e}/travail/*.log"): zz.write(f)
    print("ok", e, len(glob.glob(f"{e}/voix/*.mp3")), "voix", flush=True)
shutil.rmtree("/kaggle/working/cb", ignore_errors=True); shutil.rmtree(W, ignore_errors=True)
