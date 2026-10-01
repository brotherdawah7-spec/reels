import sherpa_onnx, soundfile as sf, json
a,sr=sf.read("audio16k.wav",dtype="float32")
cfg=sherpa_onnx.VadModelConfig(); cfg.silero_vad.model="silero_vad.onnx"; cfg.silero_vad.min_silence_duration=0.15; cfg.silero_vad.max_speech_duration=20; cfg.sample_rate=16000
vad=sherpa_onnx.VoiceActivityDetector(cfg,buffer_size_in_seconds=200)
segs=[]
w=cfg.silero_vad.window_size
def drain():
    while not vad.empty():
        s=vad.front.start; segs.append((round(s/sr,2),round((s+len(vad.front.samples))/sr,2))); vad.pop()
for i in range(0,len(a),w):
    vad.accept_waveform(a[i:i+w]); drain()
vad.flush(); drain()
json.dump(segs,open("vadfine.json","w")); print(segs)
