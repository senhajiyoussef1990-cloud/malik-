import json,base64,urllib.request,os,sys
P=os.path.dirname(os.path.abspath(__file__))
V={"renard":"1EmYoP3UnnnwhlJKovEy","mouton":"GPAQQPp9dazaB2bl4zg9","narr":"Qrl71rx6Yg8RvyPYRGCQ"}
S={"renard":{"stability":0.4,"similarity_boost":0.8,"style":0.45},"mouton":{"stability":0.35,"similarity_boost":0.8,"style":0.5},"narr":{"stability":0.55,"similarity_boost":0.8,"style":0.25}}
lines=json.load(open(f"{P}/lines.json"))
only=sys.argv[1:]
prev={}
for L in lines:
    w=L["who"]
    if only and L["id"] not in only: prev[w]=L["text"]; continue
    body={"text":L["text"],"model_id":"eleven_multilingual_v2","voice_settings":S[w]}
    if w=="narr" and prev.get(w): body["previous_text"]=prev[w]
    req=urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{V[w]}/with-timestamps?output_format=mp3_44100_128",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
    try: r=json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e: print(L["id"],e.code,e.read()[:300]); sys.exit(1)
    open(f"{P}/audio/{L['id']}.mp3","wb").write(base64.b64decode(r["audio_base64"]))
    json.dump(r["alignment"],open(f"{P}/audio/{L['id']}.json","w"))
    prev[w]=L["text"]; print("ok",L["id"])
