"""Assemble voix + musique + vidéo -> MP4 final (≈ -14 LUFS, crête ≤ -1 dBTP)."""
import argparse, json, subprocess
from pathlib import Path

ap = argparse.ArgumentParser(); ap.add_argument('--out', required=True); ap.add_argument('--music', type=float, default=-27); a = ap.parse_args()
out = Path(a.out); tm = json.load(open(out / 'timing.json'))
cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-i', str(out / 'video.mp4'), '-i', str(out / 'music_sfx.wav')]
fl = []
for i, s in enumerate(tm['scenes']):
    cmd += ['-i', str(out / 'voix' / s['voix'])]
    ms = int((s['start'] + 0.25) * 1000)
    fl.append(f"[{i+2}:a]aresample=48000,aformat=channel_layouts=mono,adelay={ms}[v{i}]")
n = len(tm['scenes'])
fl.append(''.join(f'[v{i}]' for i in range(n)) + f"amix=inputs={n}:normalize=0,apad,atrim=0:{tm['duration']},"
          "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-2:LRA=7,"
          "aformat=channel_layouts=stereo[voix]")
fl.append(f"[1:a]loudnorm=I={a.music}:TP=-6,volume=1[mus]")
fl.append("[voix][mus]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=9[a]")
nom = f"{tm['id']}_{tm['slug']}.mp4"
cmd += ['-filter_complex', ';'.join(fl), '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
        '-ar', '48000', '-shortest', '-movflags', '+faststart', str(out / nom)]
subprocess.run(cmd, check=True)
print('final :', out / nom)
