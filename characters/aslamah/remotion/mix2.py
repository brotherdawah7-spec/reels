import numpy as np, sys, json
sys.path.insert(0, "/home/claude/aslamah")
from sfx import *
d = json.load(open("/home/claude/aslamah/proj/src/reel2.json"))
T = 60.0; n = int(T * SR)
buf = birds(T, 0.6, 0.075) + breeze(T, 0.5)
for b in d["bubbles"]: place(buf, plip(0.2), b["at"] / 30)
tap = d["bubbles"][11]["at"] / 30
buf += trickle(T, 0.07) * env(n, [(tap, 58.5, 0.6)])
buf += 0.6 * birds(T, 0.9, 0.06) * env(n, [(d["end"] / 30, 60, 0.5)])
fo = int(1.5 * SR); buf[-fo:] *= np.linspace(1, 0, fo)
finish(buf, "/home/claude/aslamah/proj/out/reel2_audio.wav"); print("ok")
