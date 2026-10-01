import numpy as np, soundfile as sf, json, subprocess, sys, os
d=sys.argv[1]; os.chdir(d)
tl=json.load(open('timeline.json')); sr=48000; N=int(tl['total']*sr)
fx=np.zeros(N)
def click(at,g=0.18):
    n=int(0.03*sr); s=int(at*sr)
    if s<0 or s+n>N: return
    tt=np.arange(n)/sr
    x=(np.sin(2*np.pi*2400*tt)+0.6*np.sin(2*np.pi*1200*tt))*np.exp(-tt*220)
    fx[s:s+n]+=x/np.abs(x).max()*g
if 'hook' in tl:
    for b in tl['hook']['beats']: click(b['from']/30)
for b in tl['broll']: click(b['s'])
for ti in tl['titles']: click(ti['s']); click(ti['s']+5/30)
for v in tl['verses']: click(v['s'])
click(tl['endCard']['s'])
sf.write('clicks.wav',np.stack([fx,fx],1).astype(np.float32),sr)
T=tl['total']
subprocess.run(f"""ffmpeg -v error -y -i aroll.mov -i clicks.wav -filter_complex "[0:a]aresample=48000,highpass=f=80,afftdn=nf=-30,acompressor=threshold=-20dB:ratio=3:attack=5:release=120,apad=whole_dur={T}[v];[v][1:a]amix=inputs=2:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=9,aresample=48000[o]" -map "[o]" -c:a pcm_s16le mix_clicks_only.wav""",shell=True,check=True)
print("ok")
