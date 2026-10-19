# sylvainlano.github.io

The personal site of Sylvain Lano: a cube you turn to reach each side of what I do.

- **Home** (front), **Dev** (right), **Music** (left), **Games** (top) and **Writing** (bottom),
  each face with its own shader in the background.
- **Project sheets** on the back face, one per project.
- **A reader** for my texts in French: letters, short stories, satire, chronicles and a fantasy novel.
- **The other side**: click my name, or the small ↻ in the corner of the home face, and the cube turns
  around to coasters, food, games and books.

## Running it

```
npm install
npm run dev       # local server on http://localhost:3000
npm run build     # production build in dist/
npm run preview   # serve the build locally
npm run deploy    # build, then publish dist/ to GitHub Pages
```

## Where things live

| What | File |
| --- | --- |
| Profile, domains, projects, the other side | `src/data/content.js` |
| Texts of the reader (catalogue) | `src/data/texts.js`, texts in `public/texts/` |
| Coaster ranking | `src/data/coasters.js` |
| Words in the scrolling background | `src/data/backgroundWords.js` |
| The cube | `src/components/Cube.jsx`, `Cube.css` |
| Face shaders | `src/components/CustomShaders.js`, drawn by `shaderHub.js` |
| Reader, coaster ranking | `src/components/Reader.jsx`, `Coasters.jsx` |

The version shown on the home card comes from `package.json`, and the "Updated" month from the day of the
build.

Built with React, Vite and three.js. Fonts under the SIL Open Font License (see `public/fonts`).
