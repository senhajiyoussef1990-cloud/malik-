# Script exécuté sur Kaggle (2 GPU T4) : fabrique les voix de plusieurs épisodes, renvoie un zip par épisode dans /kaggle/working.
import glob, os, subprocess, zipfile, json, sys
B = glob.glob("/kaggle/input/**/paquet.zip", recursive=True)[0]; W = "/kaggle/working/projet"
zipfile.ZipFile(B).extractall(W); os.chdir(W)
subprocess.run("which ffmpeg || (apt-get update -qq && apt-get install -y -qq ffmpeg)", shell=True)
subprocess.run("pip install -q chatterbox-tts==0.1.7 faster-whisper==1.2.1 noisereduce==3.0.3", shell=True, check=True)
eps = json.load(open("episodes.json")); print("épisodes :", eps, flush=True)
def lot(gpu, liste):   # un GPU traite sa liste d'épisodes à la suite
    env = dict(os.environ, CUDA_VISIBLE_DEVICES=str(gpu), DEVICE="cuda", HF_HUB_DISABLE_XET="1")
    cmd = " ; ".join(f"python3 outils_commun/prises.py {e} > {e}/travail/prises.log 2>&1 ; python3 outils_commun/choix_prises.py {e} > {e}/travail/choix.log 2>&1" for e in liste)
    return subprocess.Popen(cmd, shell=True, env=env)
for e in eps: os.makedirs(f"{e}/travail", exist_ok=True)
ng = max(1, len(subprocess.run('nvidia-smi -L', shell=True, capture_output=True, text=True).stdout.strip().splitlines())); print('GPU :', ng, flush=True)
procs = [lot(k % ng, eps[k::2]) for k in range(2)]   # deux files en parallèle (une par GPU, ou deux sur le même)
for p in procs: p.wait()
for e in eps:   # accélération des personnages (pas du narrateur), comme sur la machine
    for l in json.load(open(f"{e}/lignes.json")):
        if l["who"] != "narr" and os.path.exists(f"{e}/voix/{l['id']}.mp3"):
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", f"{e}/voix/{l['id']}.mp3", "-af", "atempo=1.07", "-c:a", "libmp3lame", "-q:a", "2", f"{e}/voix/{l['id']}.t.mp3"], check=True); os.replace(f"{e}/voix/{l['id']}.t.mp3", f"{e}/voix/{l['id']}.mp3")
    with zipfile.ZipFile(f"/kaggle/working/voix_{e}.zip", "w") as z:
        for f in glob.glob(f"{e}/voix/*.mp3") + glob.glob(f"{e}/travail/*.txt") + glob.glob(f"{e}/travail/*.log"): z.write(f)
    print("ok", e, len(glob.glob(f"{e}/voix/*.mp3")), "voix", flush=True)
