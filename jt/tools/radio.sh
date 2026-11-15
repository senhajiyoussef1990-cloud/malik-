#!/bin/sh
# Filtre « TSF années 30 » : entrée.wav sortie.wav
ffmpeg -y -loglevel error -i "$1" -af "highpass=f=350,lowpass=f=3200,equalizer=f=1500:t=q:w=1.2:g=6,acompressor=threshold=-18dB:ratio=4:attack=5:release=80,asoftclip=type=tanh,aecho=0.8:0.5:35|60:0.25|0.15,aresample=44100,loudnorm=I=-16:TP=-1.5" -ac 1 "$2"
