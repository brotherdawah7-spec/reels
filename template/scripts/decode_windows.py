import sherpa_onnx, soundfile as sf, sys
d="sherpa-onnx-whisper-turbo/"
rec=sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d+"turbo-encoder.int8.onnx",decoder=d+"turbo-decoder.int8.onnx",tokens=d+"turbo-tokens.txt",language="ur",task="transcribe",num_threads=8,tail_paddings=2000)
a,sr=sf.read("audio16k.wav",dtype="float32")
for r in sys.argv[1:]:
    s,e=map(float,r.split('-'))
    st=rec.create_stream(); st.accept_waveform(sr,a[int(s*sr):int(e*sr)]); rec.decode_stream(st); print(r,st.result.text,flush=True)
