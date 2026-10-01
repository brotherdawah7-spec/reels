import sherpa_onnx, soundfile as sf, numpy as np, json, sys
lang=sys.argv[1]
d="sherpa-onnx-whisper-turbo/"
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+"turbo-encoder.int8.onnx",decoder=d+"turbo-decoder.int8.onnx",tokens=d+"turbo-tokens.txt",language=lang,task="transcribe",num_threads=8,tail_paddings=2000)
a,sr=sf.read("audio16k.wav",dtype="float32")
cfg=sherpa_onnx.VadModelConfig(); cfg.silero_vad.model="silero_vad.onnx"; cfg.silero_vad.min_silence_duration=0.4; cfg.silero_vad.max_speech_duration=14; cfg.silero_vad.threshold=0.5; cfg.sample_rate=16000
vad=sherpa_onnx.VoiceActivityDetector(cfg,buffer_size_in_seconds=200)
segs=[]
w=cfg.silero_vad.window_size
for i in range(0,len(a),w):
    vad.accept_waveform(a[i:i+w])
    while not vad.empty():
        s=vad.front.start; segs.append((s/sr,(s+len(vad.front.samples))/sr)); vad.pop()
vad.flush()
while not vad.empty():
    s=vad.front.start; segs.append((s/sr,(s+len(vad.front.samples))/sr)); vad.pop()
out=[]
for s,e in segs:
    x=a[max(0,int((s-0.25)*sr)):int((e+0.6)*sr)]
    st=rec.create_stream(); st.accept_waveform(sr,x); rec.decode_stream(st)
    t=st.result.text.strip(); out.append(dict(s=round(s,2),e=round(e,2),t=t)); print(f"{s:6.2f}-{e:6.2f} {t}",flush=True)
json.dump(out,open(f"tr_{lang}.json","w"),ensure_ascii=False,indent=1)
