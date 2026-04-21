# SkillMap — Visual Learning Roadmap Builder

Drag-and-drop skill cards onto a canvas, connect them with arrows, track your
learning progress, and share the entire map as a single URL.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs to /dist
npm run preview    # preview the production build
```

Requires **Node 18+**.

---

## Project structure

```
skillmap/
├── index.html                  # Vite entry — loads Google Fonts
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # ← start here — top-level layout & wiring
    ├── App.module.css
    │
    ├── components/
    │   ├── Toolbar.jsx         # Top bar: mode buttons + actions
    │   ├── Toolbar.module.css
    │   ├── Canvas.jsx          # Interactive area — drag logic
    │   ├── Canvas.module.css
    │   ├── SkillNode.jsx       # Individual draggable skill card
    │   ├── SkillNode.module.css
    │   ├── EdgeLayer.jsx       # SVG arrows between nodes
    │   ├── StatusBar.jsx       # Bottom stats + contextual hints
    │   ├── StatusBar.module.css
    │   ├── ShareModal.jsx      # Share-link modal overlay
    │   ├── ShareModal.module.css
    │   ├── Toast.jsx           # Brief status notifications
    │   └── Toast.module.css
    │
    ├── hooks/
    │   └── useSkillMap.js      # ← all state lives here (nodes, edges, mode)
    │
    ├── utils/
    │   ├── constants.js        # Progress stages, colors, template data
    │   ├── encode.js           # Base64 URL share encode/decode
    │   └── uid.js              # Tiny unique-id helper
    │
    └── styles/
        └── global.css          # Design tokens (CSS vars), reset, base styles
```

---

## Common customisations

### Change or add progress stages
Edit `src/utils/constants.js` → `PROGRESS_STAGES`.
Each stage needs `{ label, color, pct }`. Add as many as you like.

### Change the node color palette
Edit `src/utils/constants.js` → `NODE_COLORS`.
New nodes cycle through this array automatically.

### Change the default font or theme colors
Edit `src/styles/global.css` → `:root { … }`.
All components inherit CSS custom properties from here.

### Add a new toolbar button
1. Add a `<button>` or `<ToolBtn>` inside `Toolbar.jsx`
2. Accept the handler as a prop in `Toolbar`
3. Implement the logic in `useSkillMap.js` and pass it down in `App.jsx`

### Add snap-to-grid
In `Canvas.jsx` → `handleMouseMove`, round `x` and `y` to the nearest `GRID_SIZE`
(imported from `constants.js`) before calling `onNodeMove`.

### Add undo / redo
In `useSkillMap.js`, replace the `useState` calls for `nodes` and `edges` with a
custom `useHistory` hook that keeps a stack. Expose `undo()` / `redo()` and
wire them to `Ctrl+Z` / `Ctrl+Y` in a `useEffect` inside `App.jsx`.

### Persist to localStorage
In `useSkillMap.js`, add a `useEffect` that writes `{ nodes, edges }` to
`localStorage` on every change, and seed the initial state from it.

### Export as image
Add an `html2canvas` dependency and call it on the `.canvasWrapper` element in
`App.jsx`. Wire it to a new "Export PNG" button in the Toolbar.

---

## Tech stack

| Layer      | Choice                  |
|------------|-------------------------|
| Framework  | React 18 (hooks only)   |
| Bundler    | Vite 5                  |
| Styling    | CSS Modules             |
| Edges      | Inline SVG              |
| Share link | Base64 URL hash (no BE) |
| Fonts      | DM Sans + DM Mono       |
