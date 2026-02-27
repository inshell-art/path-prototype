# path-prototype

Minimal Vite frame that uses a `pathGenerator` module to generate raw SVG markup from data and render it on the page.

`pathGenerator` now outputs:

- square SVG canvas (`size` x `size`)
- black background
- only 3 square rectangles in one line (no other primitives)

## Run

```bash
cd /Users/aye/Projects/PathDesign/path-prototype
npm install
npm run dev
```

Open the dev URL printed by Vite (usually `http://localhost:5173`).

## Files

- `src/pathGenerator.js`: logic that receives data and returns an SVG string.
- `src/main.js`: gets data and injects `pathGenerator()` output into the DOM.
- `index.html`: page shell for Vite.
