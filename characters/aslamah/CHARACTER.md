# Aslamah (the niqabi animated lady)

The main animated character for @brother.dawah's cartoon reels. Approved by the user on 2026-11-02.
Reference image: `reference.png` (from "Aslamah Lifestyle"). Always match it.

## Look
- Chibi proportions: big rounded head (about 1/3 of her height), small soft body.
- One-piece warm sand/peach khimar + niqab (approx #F2C28E fill, lighter #F7D3A6 highlights), draping in soft folds to the floor.
- Niqab covers everything below the eyes; only a thin band of skin (#FBE3D2) shows around the eyes.
- Eyes: two dark brown/black ovals with a white catchlight, a few lashes on the outer corners, thin curved brows. Pink blush ovals (#F4A9A0) on the niqab just under the eyes.
- Small rounded hands (#FBE3D2) peeking from wide sleeves; tiny feet when sitting.
- Line art: warm dark brown outline (#5B3A29), medium weight, slightly hand-drawn.
- No mouth, no hair, no skin below the eyes ever shown.

## World / props
- Background: soft cream (#FBF1DF) with a gentle vignette.
- Props from the reference: patterned prayer rug (tan/brown with fringe), mint-green mug with steam, small stack of books, potted sprout.
- Handwritten rounded font for titles (similar to "Aslamah Lifestyle").

## Acting
- Expressions come from eyes, brows, blush and head tilt only (happy = curved closed eyes; surprised = bigger eyes; thinking = eyes looking up).
- Gentle motion: head tilts, blinks, hand gestures, steam rising, small bounces.

## Content rules
- Modest and respectful at all times; never show her face below the eyes.
- No music or instruments in her reels. Voice (soft-spoken, refined female) and/or nature sounds only.

## Code (Nov 2 2026)
`remotion/src/Character.tsx` draws Aslamah (and the sage-green friend via `who="friend"`), with eyes, poses, tilt, blink, mud and glow props. Reel1.tsx = voiceover skit, Reel2.tsx = chat-bubble skit. Fonts: Gaegu + Nunito (npm @fontsource) in public/fonts.
Voice: Kokoro (sherpa-onnx GitHub release `kokoro-multi-lang-v1_0`), sid 21 bf_emma, speed 0.92, GB lexicon (add missing words such as ummah, jannah, plurals). `sfx.py` synthesises birds, breeze and water only (no music).
