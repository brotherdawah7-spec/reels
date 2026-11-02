"""Synthesised nature sounds only (no music, no instruments): birds, breeze, water."""
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
rng = np.random.default_rng(7)

def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, a, b, o=2): return sosfilt(butter(o, [a, b], "band", fs=SR, output="sos"), x)

def breeze(sec, amt=1.0):
    n = int(sec * SR)
    x = lp(rng.standard_normal(n), 700, 2)
    lfo = 0.55 + 0.45 * np.sin(np.linspace(0, sec * 2 * np.pi / 7.0, n) + 1.3) * (0.6 + 0.4 * np.sin(np.linspace(0, sec * 2 * np.pi / 2.9, n)))
    x = x * lfo
    return x / np.abs(x).max() * 0.22 * amt

def chirp(dur, f0, f1, vib=0.0):
    t = np.arange(int(dur * SR)) / SR
    f = np.linspace(f0, f1, len(t)) * (1 + vib * np.sin(2 * np.pi * 38 * t))
    ph = 2 * np.pi * np.cumsum(f) / SR
    env = np.sin(np.pi * t / dur) ** 1.5
    return np.sin(ph) * env

def bird_call():
    k = rng.integers(0, 3)
    parts = []
    if k == 0:
        for _ in range(rng.integers(2, 5)):
            parts += [chirp(rng.uniform(0.05, 0.09), rng.uniform(3200, 4200), rng.uniform(4500, 5600), 0.02), np.zeros(int(rng.uniform(0.04, 0.09) * SR))]
    elif k == 1:
        parts += [chirp(0.18, 5200, 2800, 0.03), np.zeros(int(0.06 * SR)), chirp(0.12, 4800, 3100, 0.03)]
    else:
        for _ in range(rng.integers(4, 8)):
            parts += [chirp(0.035, 6000, 4200), np.zeros(int(0.03 * SR))]
    return np.concatenate(parts)

def birds(sec, density=0.5, gain=0.08):
    n = int(sec * SR); out = np.zeros(n)
    t = rng.uniform(0.2, 1.0)
    while t < sec - 1:
        c = bird_call() * rng.uniform(0.4, 1.0)
        i = int(t * SR); out[i:i + len(c)] += c[: n - i]
        t += rng.exponential(1 / density) + 0.4
    return out * gain

def trickle(sec, gain=0.12):
    n = int(sec * SR)
    x = bp(rng.standard_normal(n), 900, 5000, 2) * 0.25
    for _ in range(int(sec * 18)):
        i = rng.integers(0, n - 4000)
        L = rng.integers(800, 2400); t = np.arange(L) / SR
        f = rng.uniform(600, 1600) * (1 + 3 * t / t[-1])
        x[i:i + L] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 60) * rng.uniform(0.3, 0.9)
    return x / np.abs(x).max() * gain

def plip(gain=0.25):
    L = int(0.12 * SR); t = np.arange(L) / SR
    f = 700 * (1 + 2.2 * t / t[-1])
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 38)
    return s * gain

def splash(gain=0.3):
    L = int(0.5 * SR); t = np.arange(L) / SR
    x = bp(rng.standard_normal(L), 600, 7000) * np.exp(-t * 9)
    for _ in range(6):
        p = plip(0.4); i = rng.integers(0, L - len(p)); x[i:i + len(p)] += p
    return x / np.abs(x).max() * gain

def place(buf, clip, sec, g=1.0):
    i = int(sec * SR)
    if i >= len(buf): return
    m = min(len(clip), len(buf) - i)
    buf[i:i + m] += clip[:m] * g

def env(n, segs):
    """segs: list of (start_sec, end_sec, fade_sec) where gain is 1"""
    e = np.zeros(n)
    for a, b, fd in segs:
        i, j, k = int(a * SR), int(b * SR), int(fd * SR)
        e[i:j] = 1
        e[i:i + k] = np.minimum(e[i:i + k], np.linspace(0, 1, k)[: len(e[i:i + k])])
        e[max(j - k, 0):j] = np.minimum(e[max(j - k, 0):j], np.linspace(1, 0, k)[-len(e[max(j - k, 0):j]):])
    return e

def load_voice(path):
    x, sr = sf.read(path)
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = resample_poly(x, SR, sr)
    return x

def finish(buf, path):
    # gentle limiter + normalize to ~ -14 LUFS-ish peak control
    pk = np.abs(buf).max()
    if pk > 0.95: buf = buf / pk * 0.95
    sf.write(path, np.stack([buf, buf], 1).astype(np.float32), SR)
