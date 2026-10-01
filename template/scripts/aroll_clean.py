import json,subprocess
tl=json.load(open('timeline.json'))
G="hqdn3d=1.5:1.5:3:3,scale=1080:1920:flags=lanczos,fps=30,unsharp=5:5:0.6:5:5:0.0,eq=contrast=1.03:saturation=1.03,format=yuv420p"
L=open('pcs/list2.txt','w')
for i,(s,e,o) in enumerate(tl['pieces']):
    d=e-s
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(s),"-i","src.mp4","-t",f"{d:.3f}","-vf",G,"-an","-c:v","libx264","-crf","18","-preset","veryfast","-g","15",f"pcs/c{i}.mp4"],check=True)
    L.write(f"file 'c{i}.mp4'\n")
L.close()
subprocess.run("ffmpeg -v error -y -f concat -i pcs/list2.txt -c copy /home/claude/reel2/public/aroll.mp4 && echo DONE",shell=True)
