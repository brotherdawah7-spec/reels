import sys, json, sherpa_onnx, soundfile as sf
# usage: say.py lines.json outdir sid speed
D = "/home/claude/aslamah/tts/kokoro-multi-lang-v1_0/"
lines = json.load(open(sys.argv[1])); out = sys.argv[2]; sid = int(sys.argv[3]); speed = float(sys.argv[4])
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(model=D+"model.onnx", voices=D+"voices.bin", tokens=D+"tokens.txt",
        data_dir=D+"espeak-ng-data", dict_dir=D+"dict", lexicon=D+"lexicon-gb-en.txt"), num_threads=2))
tts = sherpa_onnx.OfflineTts(cfg)
for k, t in lines.items():
    a = tts.generate(t, sid=sid, speed=speed)
    sf.write(f"{out}/{k}.wav", a.samples, a.sample_rate)
    print(k, round(len(a.samples)/a.sample_rate, 2))
