"""Assemble EPxxx/anim.html à partir de EPxxx/scenes.js (code des scènes) : usage python mkanim.py EP011 [EP012 …]"""
import sys, json
HEAD = '''<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@font-face{font-family:M;src:url("../../../moteur/fonts/Montserrat[wght].ttf");font-weight:100 900}html,body{margin:0;background:#000}</style>
</head><body><canvas id="c"></canvas>
<script src="../cine.js"></script><script src="../perso.js"></script><script src="../commun.js"></script><script src="../decors.js"></script>
<script>
'''
for ep in sys.argv[1:]:
    k = json.load(open(f'{ep}/kit.json'))
    js = open(f'{ep}/scenes.js', encoding='utf-8').read()
    open(f'{ep}/anim.html', 'w', encoding='utf-8').write(HEAD + f"/* {ep} — « {k['title']} » — {k['note']} */\n" + js + '\n</script></body></html>\n')
    print('ok', ep)
