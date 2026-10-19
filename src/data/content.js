// content.js
// Everything the cube displays. Edit freely: the layout adapts.
//
// A project can have: image + imageAlt (shown as a banner on its sheet, file in
// public/; add imageFit: 'contain' and an imageBackground colour to show the
// whole image instead of cropping it), sections [{ title, text }] for the detailed sheet,
// and linkLabel to replace the default "Open <name>" link text. Projects
// without sections fall back to their `details` paragraphs.
//
// Faces:  front = home · right = dev · left = music · top = games · bottom = writing
//         back  = the detailed sheet of the selected project

export const profile = {
  name: 'Sylvain Lano',
  role: 'Software Engineer',
  // DRAFT — rewrite in your own words
  bio: [
    'PHP and Symfony, Java and JPA on the back end; Angular, Vue and React on the front.',
    'A soft spot for databases and performance: pages from ten minutes down to two seconds.',
    'And on the side: music, games and stories.',
  ],
  github: 'https://github.com/SylvainLano',
  // Leave empty to hide the mail link. It is assembled in the browser,
  // so the full address never appears in the page source.
  email: { user: 'sylvain.lano', domain: 'gmail.com' },
};

export const domains = {
  dev: {
    face: 'right',
    title: 'Development',
    short: 'Dev',
    intro: 'Web apps, simulations and the occasional rabbit hole.',
    projects: [
      {
        id: 'pixel-flare-site',
        name: 'Pixel Flare',
        year: '2026',
        tech: ['Vue 3', 'Vite', 'vue-i18n', 'Node scripts'],
        url: 'https://pixel-flare.com',
        image: 'projects/pixel-flare.webp',
        imageAlt: 'The five Pixel Flare artists side by side: The Glass Hour, Attack A Cake, CMD, HALDEN and L\u2019Atelier des Lucioles',
        summary: 'A showcase for fictional artists, with secrets.',
        sections: [
          {
            title: 'What it is',
            text: 'A home for my fictional artists: five bands, each with its own visual identity, in French, English and Spanish.',
          },
          {
            title: 'The hidden part',
            text: 'The tales of L\u2019Atelier des Lucioles hide an escape game nobody expects. The clues are there, for whoever notices them.',
          },
          {
            title: 'Under the hood',
            text: 'Each release is a single data entry. Its page, redirects and PDF and EPUB booklets are all generated from it at build time.',
          },
        ],
      },
      {
        id: 'evolving-boids',
        name: 'Evolving Boids',
        year: '2023',
        tech: ['Angular', 'TypeScript', 'SASS', 'Quadtree'],
        url: 'https://sylvainlano.github.io/EvolvingBoids/index.html',
        image: 'projects/evolving-boids.webp',
        imageAlt: 'Flocks of blue boids and red predators over the quadtree grid that splits where they gather',
        summary: 'Flocking prey and predators that evolve.',
        sections: [
          {
            title: 'Why',
            text: 'Craig Reynolds\u2019 boids fascinated me: birds and fish move in 3D, yet three simple rules in 2D capture how they behave.',
          },
          {
            title: 'The challenge',
            text: 'Hundreds of entities in a browser tab, thanks to a quadtree. Tuning it was the real work: cells split at 24 boids, merge below 6, and spawning pauses under 20 FPS.',
          },
          {
            title: 'What\u2019s next',
            text: 'Speed and reproduction rate can mutate, but the evolution the title promises is still hard to see. That is where I would push next.',
          },
        ],
      },
      {
        id: 'voyage-vue',
        name: 'Voyage Vue',
        year: '2023',
        tech: ['Vue.js', 'TailwindCSS', 'Leaflet'],
        url: 'https://sylvainlano.github.io/VoyageVue/index.html',
        image: 'projects/voyage-vue.webp',
        imageAlt: 'The Lucerne page of Voyage Vue: its description next to a photo of the city at sunset',
        summary: '66 destinations, maps and live currency rates.',
        sections: [
          {
            title: 'Why',
            text: 'It started as a way to keep track of my past trips and the ones I dream of. Step by step, it grew into a real online project with 66 destinations.',
          },
          {
            title: 'Under the hood',
            text: 'A hand-made responsive design, six interchangeable map styles with Leaflet, and currency conversion with live rates.',
          },
          {
            title: 'What\u2019s next',
            text: 'Let visitors suggest destinations, drop the sponsored links, and maybe give it a domain name of its own one day.',
          },
        ],
      },
      {
        id: 'gravity-star',
        name: 'Gravity Star',
        year: '2023',
        tech: ['React', 'React Three Fiber', 'Three.js'],
        url: 'https://sylvainlano.github.io/GravityStar/index.html',
        image: 'projects/gravity-star.webp',
        imageAlt: 'The Sun, the planets and a passing asteroid, rendered in 3D in the browser',
        summary: '3D, collisions, gravity and light in a browser.',
        sections: [
          {
            title: 'Why',
            text: 'My younger brother\u2019s final-year project was a 2D solar system with gravity you could tweak in real time. I wanted to show who is boss in web dev: more realistic, in 3D, still in a browser. I won.',
          },
          {
            title: 'The challenge',
            text: '3D rendering, collisions, gravity and lighting in ten days. That was all the time I had, hence a few rough edges.',
          },
          {
            title: 'What\u2019s next',
            text: 'Skins you can switch in real time: cartoon, pastel, or a manga look in the spirit of Parodius.',
          },
        ],
      },
      {
        id: 'hexa-snake',
        name: 'Hexagonal Snake',
        year: '2023',
        tech: ['Vanilla JavaScript', 'Dijkstra'],
        url: 'https://sylvainlano.github.io/HexaSnake/index.html',
        image: 'projects/hexagonal-snake.webp',
        imageAlt: 'A long green snake winding across a hexagonal grid scattered with pixel-art fruit',
        summary: 'Pathfinding on a hexagonal grid.',
        sections: [
          {
            title: 'Why',
            text: 'Talking pathfinding with my younger brother, we noticed that Dijkstra, A* and the rest always assume a flat, square world. Fine for a chessboard, but what about a board made of the most perfect shape in the universe: the hexagon?',
          },
          {
            title: 'The answer',
            text: 'A snake that finds its own way to the fruit; the visitor can only feed it more or less. It works with Dijkstra, but it gets messy. Built in twelve hours, to be done before the weekend was over.',
          },
          {
            title: 'What\u2019s next',
            text: 'An adjustable board, obstacles or fruit placed by the visitor, and switching between algorithms.',
          },
        ],
      },
    ],
  },

  music: {
    face: 'left',
    title: 'Music',
    short: 'Music',
    intro: 'Five fictional artists: my ideas and direction, brought to life with Suno.',
    projects: [
      {
        id: 'the-glass-hour',
        name: 'The Glass Hour',
        year: '2026',
        tech: ['Retrowave', 'Synthwave', 'Art pop'],
        url: 'https://pixel-flare.com/en/theglasshour',
        image: 'projects/the-glass-hour.webp',
        imageAlt: 'The Glass Hour neon wordmark on wet asphalt, next to the covers of its two albums',
        summary: 'Retrowave from Ukrainian exiles in France.',
        sections: [
          {
            title: 'The idea',
            text: 'A retrowave band from Ukraine. Since the war, many Ukrainians have settled in France, where the label lives.',
          },
          {
            title: 'Two albums',
            text: 'Before the Morning Finds Us tells one night of falling in love. Sunset Over Water stretches the break-up over a whole year of pain, and of what people take to numb it.',
          },
          {
            title: 'Inspired by',
            text: 'The Midnight, unmistakably.',
          },
          {
            title: 'Start with',
            text: 'Midnight Ends in Color.',
          },
        ],
      },
      {
        id: 'attack-a-cake',
        name: 'Attack A Cake',
        year: '2025',
        tech: ['Ska-pop', 'Jazz', 'Brass'],
        url: 'https://pixel-flare.com/en/attackacake',
        image: 'projects/attack-a-cake.webp',
        imageAlt: 'The Attack A Cake logo among candy confetti, next to the cover of Chaos In Candy',
        summary: 'Ska, jazz, brass and pure madness.',
        sections: [
          {
            title: 'The idea',
            text: 'Something between ska and jazz, with madness and brass, played by a duo: Manon and Mateo.',
          },
          {
            title: 'The rule',
            text: 'Every song opens with scat, a little hummed tune, before the chaos takes over. That was my one requirement.',
          },
          {
            title: 'Start with',
            text: 'Brass Chases Me.',
          },
        ],
      },
      {
        id: 'cmd',
        name: 'CMD',
        year: '2025',
        tech: ['Melodic death', 'Electronic'],
        url: 'https://pixel-flare.com/en/cmd',
        image: 'projects/cmd.webp',
        imageAlt: 'The corroded CMD lettering, next to the cover of Litany.exe: a gilded cross in a ring',
        summary: 'A digital church and its goddess.',
        sections: [
          {
            title: 'The idea',
            text: 'An electronic universe where the singer has founded a digital church. Its Christ is a woman he has deified: Saint Christie.',
          },
          {
            title: 'Inspired by',
            text: 'Bring Me The Horizon.',
          },
          {
            title: 'Start with',
            text: 'Saint Christie, of course.',
          },
        ],
      },
      {
        id: 'halden',
        name: 'HALDEN',
        year: '2026',
        tech: ['Electro-pop', 'Scandinavian'],
        url: 'https://pixel-flare.com/en/halden',
        image: 'projects/halden.webp',
        imageAlt: 'The HALDEN logo over a northern night: aurora, snowy mountains and a wet road along a lake',
        summary: 'Scandinavian electro-pop, luminous melancholy.',
        sections: [
          {
            title: 'The idea',
            text: 'It comes from a trip to Iceland that marked me deeply: the light, the landscapes, the mood.',
          },
          {
            title: 'Inspired by',
            text: 'What we heard over there, a lot of David Guetta’s 7, and artists from Scandinavia: Kygo, Alan Walker, Avicii.',
          },
          {
            title: 'Start with',
            text: 'Salt on My Shirt.',
          },
        ],
      },
      {
        id: 'atelier-des-lucioles-music',
        name: 'L’Atelier des Lucioles',
        year: '2026',
        tech: ['Electro-folk', 'Instrumental'],
        url: 'https://pixel-flare.com/en/latelierdeslucioles',
        image: 'projects/atelier-des-lucioles.webp',
        imageAlt: 'The golden lettering of L’Atelier des Lucioles over Paris rooftops at dusk, next to the cover of its first tale',
        summary: 'Instrumental electro-folk, steampunk at heart.',
        sections: [
          {
            title: 'The idea',
            text: 'Electro-folk is rare, maybe because few people like it. I love it, and it moves me.',
          },
          {
            title: 'Inspired by',
            text: 'Yann Tiersen, Detektivbyrån, then Wintergatan, even the Professor Layton soundtracks: mysterious music that evokes a world I find fascinating, steampunk and the late 19th century.',
          },
          {
            title: 'Start with',
            text: 'La Serre aux Mille Soleils, the first tale.',
          },
        ],
      },
    ],
  },

  games: {
    face: 'top',
    title: 'Games',
    short: 'Games',
    intro: 'Riddles, jams and small arcade experiments.',
    projects: [
      {
        id: 'turings-node',
        name: "Turing's Node",
        year: '2025',
        tech: ['Angular 20', 'SASS', 'tsParticles'],
        url: 'https://sylvainlano.github.io/TuringsNode/index.html',
        image: 'projects/turings-node.webp',
        imageAlt: 'A level of Turing\u2019s Node cut into slanted slices, each on a different background the game unlocks: fireworks around the score, matrix, cyberpunk symbols, bubbles',
        summary: 'A math riddle: turn every button green.',
        sections: [
          {
            title: 'Why',
            text: 'It started with notification buttons I was really proud of, designed for a mockup that never went anywhere. Rather than let them go to waste, I built a math riddle around them.',
          },
          {
            title: 'How it plays',
            text: 'Each button changes the score and turns green under its own hidden condition. Turn them all green to reach the next level; hidden milestones change the background.',
          },
          {
            title: 'What\u2019s next',
            text: 'More levels above all, then new buttons, optional rules and new colours, each with its own condition.',
          },
        ],
      },
      {
        id: 'dead-pixel',
        name: 'Dead Pixel',
        year: '2026',
        tech: ['Godot 4.6', 'GDScript', 'Pixel art'],
        image: 'projects/dead-pixel.webp',
        imageAlt: 'The Dead Pixel map: past nodes on the left, the player in the middle, paths branching toward a shop',
        summary: 'Rogue-lite bullet hell: a lost pixel.',
        sections: [
          {
            title: 'The idea',
            text: 'You are a white pixel lost in an image. Each run reveals one pixel of the place, and when you die, your pixel stays on the map for good.',
          },
          {
            title: 'The twist',
            text: 'The curse builds up from run to run: enemies adapt and the world changes.',
          },
          {
            title: 'Where it stands',
            text: 'In development, and already playable.',
          },
        ],
      },
      {
        id: 'planet-rescue',
        name: 'Planet Rescue',
        year: '2010',
        tech: ['JavaScript'],
        url: 'https://sylvainlano.github.io/PlanetRescue/index.html',
        image: 'projects/planet-rescue.webp',
        imageAlt: 'Close-up on the planet and its shield ring, with an asteroid closing in',
        summary: 'My first real JavaScript game, in 2010.',
        sections: [
          {
            title: 'Why',
            text: 'Probably my first real JavaScript game: before it, my projects were whole PHP sites with Flash inside. This one fits on a single page.',
          },
          {
            title: 'The challenge',
            text: 'Computing trajectories and meeting points between several moving objects. Not easy, and never fully finished.',
          },
          {
            title: 'Fair warning',
            text: 'It forgives nothing. The difficulty would need easing one day.',
          },
        ],
      },
      {
        id: 'quaddxmas',
        name: 'QuaddXmas',
        year: '2004',
        tech: ['PHP', 'MySQL', 'JavaScript'],
        image: 'projects/quaddxmas.webp',
        imageAlt: 'The QuaddXmas logo over its world: players and their familiars on the grass, castles and houses, a demon over the lava, monsters coming from the sand',
        summary: 'My browser MMORPG, with hundreds of players.',
        sections: [
          {
            title: 'The game',
            text: 'A browser MMORPG in PHP: action points, quests, PvP zones, castles to build, squads called S-Quadd, and a familiar at every player\u2019s side.',
          },
          {
            title: 'The world',
            text: 'Hundreds of active members, a whole community, grassland and elemental zones, its own creatures like the baraskouaire, and a lore I began to write: Les Terres du Seakk.',
          },
          {
            title: 'How it ended',
            text: 'It grew bigger than I could run on the side.',
          },
        ],
      },
    ],
  },

  writing: {
    face: 'bottom',
    title: 'Writing',
    short: 'Writing',
    intro: 'Five collections, newest first. All in French.',
    projects: [
      {
        id: 'atelier-des-lucioles',
        name: 'L’Atelier des Lucioles',
        year: '2026',
        tech: ['Tales', 'Electro-folk', 'French'],
        url: 'https://pixel-flare.com/en/latelierdeslucioles',
        linkLabel: 'Read the tales on Pixel Flare',
        image: 'projects/atelier-des-lucioles.webp',
        imageAlt: 'The golden lettering of L’Atelier des Lucioles over Paris rooftops at dusk, next to the cover of its first tale',
        summary: 'Illustrated tales paired with music.',
        sections: [
          {
            title: 'The tales',
            text: 'Every release comes with its full tale, hidden clues and secrets to find on the page.',
          },
          {
            title: 'Start with',
            text: 'La Serre aux Mille Soleils, the first tale.',
          },
        ],
      },
      {
        id: 'lettres-et-nouvelles',
        name: 'Lettres et nouvelles',
        tech: ['Letters', 'Short stories', 'French'],
        reader: 'lettres',
        readerLabel: 'Read the texts',
        image: 'projects/writing-lettres.webp',
        imageAlt: 'The title Lettres et nouvelles in italic serif over a faded page of handwriting-like text',
        summary: 'Short stories, letters and prose poems.',
        sections: [
          {
            title: 'Nouvelles',
            text: 'Thirteen short stories from 2008 to 2012, most of them written for contests in 2009.',
          },
          {
            title: 'Proses et poèmes',
            text: 'Letters, a portrait in F, Rêverie (an erotic prose poem with a hidden acrostic) and two pieces from 2014.',
          },
        ],
      },
      {
        id: 'guide-pratique',
        name: 'Guide Pratique à l’Usage des Gens Honnêtes',
        year: '2022',
        tech: ['Satire', 'French'],
        reader: 'guide',
        readerLabel: 'Read the Guide',
        image: 'projects/writing-guide.webp',
        imageAlt: 'A manual cover in black and red: Guide Pratique à l’usage des gens honnêtes, with a large section sign',
        summary: 'Satire that bites. I stand by it.',
        sections: [
          {
            title: 'The book',
            text: 'A practical guide that takes what honest people find normal and pushes it until it shows what it hides.',
          },
          {
            title: 'What’s here',
            text: 'The preamble and the first four chapters, in full.',
          },
        ],
      },
      {
        id: 'chroniques',
        name: 'Chroniques',
        year: '2008–2012',
        tech: ['Chronicles', 'Humour', 'French'],
        reader: 'chroniques',
        readerLabel: 'Read the chronicles',
        image: 'projects/writing-chroniques.webp',
        imageAlt: 'The word Chroniques in typewriter letters over columns of old typed text',
        summary: 'Humour chronicles, 2008–2012.',
        sections: [
          {
            title: 'La Fuite du Cerceau',
            text: 'My blog, and the collections drawn from it: 91 chronicles in 31 series, all here.',
          },
          {
            title: 'Psikopat',
            text: 'My monthly column in the satirical magazine Psikopat, 2009–2012: 32 Petits textes déviants and two summer games.',
          },
          {
            title: 'Le Grand BazART',
            text: 'A weekly column on the art site Le Grand BazART, November 2009 to June 2010: 27 illustrated articles, with their original pictures and captions.',
          },
        ],
      },
      {
        id: 'terres-du-seakk',
        name: 'Les Terres du Seakk',
        year: '2006',
        tech: ['Fantasy', 'Novel', 'French'],
        reader: 'seakk',
        readerLabel: 'Read the novel',
        image: 'projects/writing-seakk.webp',
        imageAlt: 'The title Les Terres du Seakk in uncial letters over misty mountain ranges under a night sky and a full moon',
        summary: 'Sixteen chapters of fantasy.',
        sections: [
          {
            title: 'The story',
            text: 'It opens on Valérie waking up, watched over by an old man.',
          },
        ],
      },
    ],
  },
};

// ---------- The other side ----------
// Clicking the name, or the small ↻ in the corner of the home face, turns the
// cube around: same faces, other subjects. Same structure as `domains`.

export const otherProfile = {
  // DRAFT — rewrite in your own words
  role: 'Off the clock',
  bio: [
    'Roller coasters, cooking, video games and books.',
    'The things I do for the fun of it.',
  ],
};

export const passions = {
  coasters: {
    face: 'right',
    title: 'Coasters',
    short: 'Coasters',
    intro: 'Every coaster I have ridden, ranked by their Captain Coaster score.',
    coasters: true, // the face shows the top of the ranking instead of projects
    projects: [],
  },
  tea: {
    face: 'left',
    title: 'Food',
    short: 'Food',
    intro: 'Spiced chicken, sauces and slow-cooked dishes. And tea, pepper and chilli.',
    projects: [],
    // Shown on the face itself, like the sections of a sheet
    notes: [
      {
        title: 'Cooking',
        text: 'My speciality is dry-brined chicken with spice rubs: kebab, Cajun, honey mustard and more. I am also known for my ratatouille and chili con carne, my sauces (pepper, blue cheese, bacon, curry…), roasted aubergines, and pasta a thousand ways, often with those sauces.',
      },
      {
        title: 'Tea',
        text: 'Pastry teas above all, the ones that smell of cake. From 2012 to 2018 I ran féeduthé.com, an online shop of over 200 flavoured teas, many of them blended by hand. My favourites: Tarte au Citron Meringuée and Framboisier.',
      },
      {
        title: 'Pepper',
        text: 'Smoked black Tellicherry pepper.',
      },
      {
        title: 'Chilli',
        text: 'Chipotle, quite simply.',
      },
    ],
  },
  games: {
    face: 'top',
    title: 'Games',
    short: 'Games',
    intro: 'On the other side, I make games. On this one, I play them.',
    projects: [
      {
        id: 'together',
        name: 'Together',
        tech: ['Twitch', 'Broforce', 'Trine', 'Dungeon Defenders', 'Wreckfest'],
        url: 'https://www.twitch.tv/3fluffypixels',
        linkLabel: 'Watch 3 Fluffy Pixels on Twitch',
        summary: 'Co-op at home, and a Twitch channel.',
        sections: [
          {
            title: 'At home',
            text: 'Most of my games are played with others, often three of us: Broforce, the Trine series, Dungeon Defenders, Nine Parchments, TowerFall, Castle Crashers, Full Metal Furies. And Wreckfest, with my son.',
          },
          {
            title: '3 Fluffy Pixels',
            text: 'The Twitch channel I share with my partner, with a smaller YouTube channel beside it. She streams there most often; I have done a bit of everything, streaming included. Kingdom Two Crowns was the first game we streamed and recorded.',
          },
          {
            title: 'The cult game',
            text: 'Professor Layton, without a doubt. We play the Azran Legacy at our own pace, whenever we have time to stream, and every single viewer shows up for it.',
          },
        ],
      },
      {
        id: 'adventures',
        name: 'Adventures',
        year: 'Always',
        tech: ['Professor Layton', 'Final Fantasy', 'Baldur\u2019s Gate 3', 'Jedi: Fallen Order', 'Uncharted'],
        summary: 'Long journeys, with puzzles on the way.',
        sections: [
          {
            title: 'Professor Layton',
            text: 'Hooked from the very first one, on the Nintendo DS. I have platinumed every one since, up to the Azran Legacy, the next on my list.',
          },
          {
            title: 'Final Fantasy',
            text: 'Final Fantasy VII, my first on PC, on a 3dfx Voodoo 2: a memorable adventure that gave me a strong taste for the series. VIII carried me less far. XII I loved for its new system, where you could literally program your characters for battle.',
          },
          {
            title: 'Since then',
            text: 'Baldur\u2019s Gate 3. Star Wars Jedi: Fallen Order, platinumed in October 2026. And, with my partner, Uncharted, Horizon Zero Dawn, Detroit: Become Human, The Council.',
          },
          {
            title: 'What\u2019s next',
            text: 'A new epic adventure, the kind Final Fantasy VII was. I have not found it yet.',
          },
        ],
      },
      {
        id: 'runs',
        name: 'Runs',
        tech: ['Rogue Legacy 2', 'Peglin', 'Kingdom Two Crowns', 'Balatro', 'Vampire Survivors', 'Brotato'],
        summary: 'Rogue-lites, cosy or explosive.',
        sections: [
          {
            title: 'Rogue Legacy',
            text: 'The first and the second: the ones that kept us busy the longest, and we loved them.',
          },
          {
            title: 'Kingdom Two Crowns',
            text: 'A beautiful pixel art world, played as a couple. Two directions and a single button (two, once powers come in): wildly simple, fearsomely effective.',
          },
          {
            title: 'And the others',
            text: 'Peglin, which brings back PopCap\u2019s Peggle games I loved. Dungeon Clawler, a lot of it in 2026. Balatro, which I loved. We keep coming back to them for the simple well-being they give: played over a quiet breakfast, a podcast on the side.',
          },
          {
            title: 'Bullet heavens',
            text: 'In most games you are a small character weaving between enemy fire. Here, at last, you carry an insane arsenal and the enemies are the ones shaking: they come from every side, and you take down as many creatures as you can. My favourites: Vampire Survivors, and Brotato, finished and platinumed. It is the genre of Dead Pixel, the game I am making.',
          },
        ],
      },
      {
        id: 'investigation',
        name: 'Investigation',
        tech: ['Sherlock Holmes', 'Blue Prince', 'Puzzles'],
        summary: 'Clues to gather, cases to close.',
        sections: [
          {
            title: 'Sherlock Holmes',
            text: 'The Frogwares games: The Devil\u2019s Daughter, The Awakened (the original and the remake), The Secret of the Silver Earring. Exploration, reasoning, puzzles and mysteries, everything we like.',
          },
          {
            title: 'What sets them apart',
            text: 'Something found almost nowhere else: you combine the clues yourself to draw your conclusions and close the case.',
          },
          {
            title: 'Blue Prince',
            text: 'A mansion whose rooms change every day, explored with my partner.',
          },
        ],
      },
      {
        id: 'horror',
        name: 'Horror',
        tech: ['The Evil Within', 'Resident Evil', 'Silent Hill'],
        summary: 'The Evil Within, far ahead of the rest.',
        sections: [
          {
            title: 'The Evil Within',
            text: 'My favourite by far. Raw, mundane gore and a cinematic staging that pull you in. No cheap jumpscares: you watch evil come closer, the tension climbs to the edge of panic, and then something monstrous falls on you, as if to prove you right.',
          },
          {
            title: 'Not a spectator',
            text: 'Too many horror games make you sit through cut-scenes where the characters make stupid choices you then have to own (Outlast, excellent as it is, is full of them). Here the hero really tries to get out alive, the arsenal is satisfying, and if you take a beating, it is mostly your own fault. Even the paranormal feels earned.',
          },
          {
            title: 'One letdown',
            text: 'The ending, a bit too “maybe it was all in his head”.',
          },
          {
            title: 'Also',
            text: 'Some of the Resident Evil games, Silent Hill. Not so much slashers, or narrative games that lose control of their story.',
          },
        ],
      },
    ],
  },
  reading: {
    face: 'bottom',
    title: 'Reading',
    short: 'Reading',
    intro: 'Fantasy, science fiction, a few whodunits, and the search for our origins. And the absurd, always.',
    projects: [],
    // Shown as boxes of authors on the face itself
    shelves: [
      { title: 'The absurd', authors: ['Terry Pratchett', 'Douglas Adams'] },
      { title: 'Whodunits', authors: ['Agatha Christie', 'Arthur Conan Doyle'] },
      { title: 'The strange', authors: ['H. P. Lovecraft', 'Anonymous'] },
      { title: 'Lost worlds', authors: ['Graham Hancock', 'Immanuel Velikovsky'] },
      { title: 'French wit', authors: ['François Cavanna', 'Pierre Desproges'] },
    ],
  },
};
