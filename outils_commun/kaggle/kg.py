"""Petit client Kaggle (API REST www.kaggle.com/api/v1 ; la clé est injectée par le proxy)."""
import json, os, sys, time, requests
B = "https://www.kaggle.com/api/v1"; U = os.environ.get("KAGGLE_USER", "papisrieux")
S = requests.Session()

def upload(path):
    n = os.path.getsize(path)
    r = S.post(f"{B}/datasets/upload/file/{n}/{int(os.path.getmtime(path))}", data={"fileName": os.path.basename(path)}); r.raise_for_status()
    j = r.json(); u = j["createUrl"]
    p = S.put(u, data=open(path, "rb")); p.raise_for_status()
    return j["token"]

def dataset_create(slug, title, files):
    toks = [{"token": upload(f)} for f in files]
    r = S.post(f"{B}/datasets/create/new", json={"title": title, "slug": slug, "ownerSlug": U, "licenseName": "unknown", "isPrivate": True, "files": toks})
    print(r.status_code, r.text[:300])

def push(slug, title, code, datasets=(), gpu=True):
    body = {"slug": f"{U}/{slug}", "newTitle": title, "text": code, "language": "python", "kernelType": "script", "isPrivate": True,
            "enableGpu": gpu, "enableInternet": True, "datasetDataSources": list(datasets), "competitionDataSources": [], "kernelDataSources": [], "categoryIds": []}
    r = S.post(f"{B}/kernels/push", json=body); print(r.status_code, r.text[:400])

def status(slug):
    r = S.get(f"{B}/kernels/status", params={"userName": U, "kernelSlug": slug}); return r.json()

def output(slug, dest):
    r = S.get(f"{B}/kernels/output", params={"userName": U, "kernelSlug": slug}); j = r.json()
    os.makedirs(dest, exist_ok=True)
    for f in j.get("files", []):
        d = requests.get(f["url"]); open(os.path.join(dest, os.path.basename(f["fileName"])), "wb").write(d.content); print("reçu", f["fileName"], len(d.content))
    return j.get("log", "")

if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "dataset": dataset_create(sys.argv[2], sys.argv[2], sys.argv[3:])
    elif cmd == "push": push(sys.argv[2], sys.argv[2], open(sys.argv[3]).read(), sys.argv[4:])
    elif cmd == "status": print(json.dumps(status(sys.argv[2])))
    elif cmd == "output": 
        log = output(sys.argv[2], sys.argv[3]); open(os.path.join(sys.argv[3], "log.txt"), "w").write(log if isinstance(log, str) else json.dumps(log))
