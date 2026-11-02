import numpy as np, sys
sys.path.insert(0, "/home/claude/aslamah")
from sfx import *
T = 60.0; n = int(T * SR); buf = np.zeros(n)
VO = {"L1": 30, "L2": 180, "L3": 486, "L4": 690, "L5": 1170, "L6": 1540}
voice = np.zeros(n)
for k, fr in VO.items():
    v = load_voice(f"/home/claude/aslamah/tts/r1/{k}.wav"); v = v / np.abs(v).max() * 0.85
    place(voice, v, fr / 30)
b = birds(T, 0.7, 0.07) * env(n, [(0, 6.0, 0.8), (29.3, 38.3, 1.0), (50.5, 60, 1.0)])
w = breeze(T) * (0.55 * env(n, [(15.5, 38.5, 1.5)]) + 0.9 * env(n, [(42.5, 47.5, 1.5)]) + 0.25 * env(n, [(0, 60, 2)]))
tr = trickle(T, 0.06) * env(n, [(5.6, 15.6, 0.8)])
buf += b + w + tr
for s in [9.83, 10.43, 11.03, 11.67]: place(buf, plip(0.22), s)
for s in [6.2, 8.0]: place(buf, splash(0.14), s)
for i in range(8): place(buf, plip(0.12), 43.0 + i * 0.3)
# duck ambience under voice
from scipy.ndimage import uniform_filter1d
ve = uniform_filter1d(np.abs(voice), int(0.3 * SR)); duck = 1 - 0.45 * np.clip(ve / 0.05, 0, 1)
mix = voice + buf * duck
fo = int(1.5 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
finish(mix, "/home/claude/aslamah/proj/out/reel1_audio.wav")
print("ok", np.abs(mix).max())
