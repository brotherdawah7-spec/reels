import json
P=0.06
ranges=[(0.36,5.03),(7.78,10.76),(11.27,14.83),(15.65,21.74),(21.86,26.15),(37.41,43.22),(50.25,57.14),(57.14,60.51),(60.58,64.25),(68.15,80.83),(80.9,86.45),(104.45,116.01),(116.26,118.67),(118.82,125.83),(134.17,146.24),(146.69,161.0)]
pieces=[]
for s,e in ranges:
    s-=P;e+=P
    if pieces and s-pieces[-1][1]<0.15: pieces[-1][1]=e
    else: pieces.append([s,e])
out=0;mp=[]
for s,e in pieces: mp.append((round(s,3),round(e,3),round(out,3))); out+=e-s
def T(t):
    for s,e,o in mp:
        if s-0.2<=t<=e+0.2: return round(o+min(max(t,s),e)-s,3)
    raise Exception(t)
caps=[(0.36,5.03,"Ancient Greek philosophers ne ek cheez kahi thi: The Ship of Theseus","Ancient Greek philosophers posed a puzzle: the Ship of Theseus"),
(7.78,10.76,"Agar ek ship hai…","Imagine there's a ship…"),
(11.27,14.83,"aur hum uski har ek lakdi ka hissa","and we take each of its wooden planks"),
(15.65,18.7,"baar baar badalte jaayein, badalte jaayein","and keep replacing them, again and again"),
(18.7,21.74,"Pehle din ek lakdi ka hissa badla","Day one, we swap out a single plank"),
(21.86,26.15,"To kya yeh abhi bhi Ship of Theseus hai? Kya yeh wahi ship hai?","Is it still the Ship of Theseus? The same ship?"),
(37.41,40.44,"To kya woh same ship hai ya alag ship?","So is it the same ship, or a different one?"),
(40.44,43.22,"Agar alag hai, to kab hui alag?","If it's different, when did it become different?"),
(50.25,53.74,"Aur yehi masla insaanon ke saath bhi aata hai","And the same problem comes up with humans"),
(53.74,57.14,"Insaan ki jo physical body hai…","The human physical body…"),
(57.14,60.51,"10 se 15 saal mein saare physical cells","within 10 to 15 years, all its cells"),
(60.58,64.25,"change ho jaate hain. Naye cells aate hain, purane mar jaate hain","get replaced. New cells come, old ones die"),
(68.15,74.72,"Bachcha paida hota hai, 10 saal ka hota hai, physically sab badal chuka","A child is born; by ten, physically everything has changed"),
(74.72,80.83,"Hum obviously kahenge: haan, yeh wahi bachcha hai jo paida hua tha","Obviously we'd say: yes, it's the same child who was born"),
(80.9,86.45,"Yahan materialistic philosophy collapse kar jaati hai","This is where materialist philosophy collapses"),
(104.45,110.6,"Insaan bunyadi taur par do cheezon ka murakkab hai","A human is fundamentally made of two things"),
(110.6,116.01,"Ek body, jo matter hai, physical hai","A body, which is matter, physical"),
(116.26,118.67,"Aur doosri cheez roohani hai, spiritual","And the other is spiritual"),
(118.82,125.83,"Ek alag substance, jisko hum soul kehte hain","A separate substance we call the soul"),
(134.17,138.38,"Physical body complete replace ho rahi hai","The physical body gets completely replaced"),
(138.38,141.44,"lekin soul apne substance mein nahi badalti, develop hoti hai","but the soul doesn't change in substance; it develops"),
(141.44,146.24,"Aur is se saare issues khatam ho jaate hain","And that resolves the whole puzzle"),
(146.69,151.37,"Insaan ki agar poori physicality khatam kar di jaaye","Even if a person's entire physical self is gone"),
(151.37,153.27,"jo maut mein hoga, aur wapas laa di jaaye","as in death, and is brought back"),
(153.27,157.2,"phir bhi woh wahi insaan hoga","he will still be the same person"),
(157.2,161.0,"kyunke jo substance usko insaan banata hai, woh wahi hai","because the substance that makes him human is the same")]
C=[dict(s=T(a),e=T(b),ru=r,en=e) for a,b,r,e in caps]
for i in range(len(C)-1):
    if C[i+1]['s']-C[i]['e']<0.4: C[i]['e']=C[i+1]['s']
D=round(out,3)
tl=dict(duration=D,pieces=[list(p) for p in mp],captions=C,
 hook=dict(dur=3.3,beats=[
 dict(**{"from":0,"to":12,"kind":"face","text":"2000 SAAL","sub":"PURANA SAWAL"}),
 dict(**{"from":12,"to":26,"kind":"ship-replace","text":"HAR LAKDI","sub":"BADAL DO"}),
 dict(**{"from":26,"to":38,"kind":"face","text":"PHIR BHI","sub":"WAHI SHIP?"}),
 dict(**{"from":38,"to":52,"kind":"ship-explode","text":"SAME SHIP?"}),
 dict(**{"from":52,"to":66,"kind":"cells","text":"SAME YOU?"}),
 dict(**{"from":66,"to":78,"kind":"face","text":"TO PHIR","sub":"TUM KAUN HO?"}),
 dict(**{"from":78,"to":99,"kind":"soul","text":"ROOH"})]),
 broll=[dict(kind="ship-calm",s=T(7.78),e=T(10.76)),
  dict(kind="ship-replace",s=T(15.65),e=T(21.74)),
  dict(kind="ship-explode",s=T(40.44),e=T(43.28)),
  dict(kind="cells",s=T(57.14),e=T(64.25),text="CELLS RENEW"),
  dict(kind="grow",s=T(68.15),e=T(74.72),text="WAHI BACHA?"),
  dict(kind="crumble",s=T(80.9),e=T(86.5),text="SIRF MATTER?"),
  dict(kind="soul",s=T(118.82),e=T(125.83),text="ROOH"),
  dict(kind="rebuild",s=T(146.69),e=T(153.27),text="WAPAS")],
 titles=[dict(s=T(21.86),e=T(24.5),a="SAME",b="SHIP?"),dict(s=T(50.25),e=T(53.0),a="SAME",b="INSAAN?"),dict(s=T(104.45),e=T(107.6),a="JISM +",b="ROOH"),dict(s=T(141.44),e=T(144.2),a="PUZZLE",b="SOLVED")],
 verses=[dict(s=round(D,3),e=round(D+4.2,3),ar="قُلْ يُحْيِيهَا الَّذِي أَنشَأَهَا أَوَّلَ مَرَّةٍ ۖ وَهُوَ بِكُلِّ خَلْقٍ عَلِيمٌ",en="Say, He will give them life who produced them the first time; and He is, of all creation, Knowing.",ref="(Ya-Sin 36:79)")],
 endCard=dict(s=round(D+4.2,3),dur=3.0,title="ROZ EK SAWAL",sub="follow for daily reels"))
tl['total']=round(D+7.2,3)
json.dump(tl,open('timeline.json','w'),ensure_ascii=False,indent=1)
print(D,len(mp))
