# Approved reel template (Ship of Theseus, Oct 2026)

The user approved this format for all future edits. Reuse it:

1. Copy `template/` into a new folder, `npm i` (or symlink an existing node_modules).
2. Copy fonts into `public/fonts` (Poppins-Bold/Medium .ttf, amiri.woff2, cinzel.woff2, playfair-i.woff2).
3. Put the cleaned A-roll at `public/aroll.mp4` (scripts/aroll_clean.py) and write `src/timeline.json` (see scripts/build_timeline_example.py).
4. Opening = `hook.beats` with exactly two changes: an `infographic` beat from frame 0 (topic diagram + live counter/progress card + face PIP, no flash on frame 0) then a `face` beat with a slam question. For a new topic, write a new infographic component in the same style.
5. Audio: scripts/mix_voice_clicks.py (voice + clicks only).
