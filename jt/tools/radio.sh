#!/bin/sh
# Filtre « TSF années 30 » : radio.sh entrée.wav sortie.wav [hauteur]
# hauteur = facteur de hauteur ET de vitesse (1.18 ≈ +3 demi-tons, 18 % plus rapide)
P=${3:-1.18}
SR=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 "$1")
ffmpeg -y -loglevel error -i "$1" -af "asetrate=$SR*$P,aresample=44100,highpass=f=400,lowpass=f=3400,equalizer=f=1800:t=q:w=1.2:g=6,acompressor=threshold=-18dB:ratio=4:attack=5:release=80,asoftclip=type=tanh,aecho=0.8:0.5:30|55:0.22|0.12,loudnorm=I=-16:TP=-1.5" -ar 44100 -ac 1 "$2"
