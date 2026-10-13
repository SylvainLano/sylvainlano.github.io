// content.js
// Everything the cube displays. Edit freely: the layout adapts.
//
// Faces:  front = home · right = dev · left = music · top = games · bottom = writing
//         back  = the detailed sheet of the selected project

export const profile = {
  name: 'Sylvain Lano',
  role: 'Software Engineer',
  // DRAFT — rewrite in your own words
  bio: [
    'Symfony and Java on the back end, Angular, React and Vue on the front.',
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
        tech: ['Vue 3', 'Vite', 'vue-i18n'],
        url: 'https://pixel-flare.com',
        summary: 'The website of a music label, grown into a site of its own.',
        details: [
          'Artist pages each with their own palette and identity, available in French, English and Spanish.',
          'Build scripts generate the illustrated tales of L’Atelier des Lucioles, including EPUB and PDF exports.',
        ],
      },
      {
        id: 'evolving-boids',
        name: 'Evolving Boids',
        year: '2023',
        tech: ['Angular', 'TypeScript', 'SASS'],
        url: 'https://sylvainlano.github.io/EvolvingBoids/index.html',
        summary: 'A boids simulation where prey and predators evolve.',
        details: [
          'Flocking with alignment, cohesion and separation, accelerated by a quadtree that splits and merges as the population changes.',
          'Boids reproduce and mutate: maximum velocity and reproduction rate can evolve, for better or worse.',
        ],
      },
      {
        id: 'voyage-vue',
        name: 'Voyage Vue',
        year: '2023',
        tech: ['Vue.js', 'TailwindCSS', 'Leaflet'],
        url: 'https://sylvainlano.github.io/VoyageVue/index.html',
        summary: 'Browse 66 travel destinations, with maps and live conversion rates.',
        details: [
          'A custom responsive design, slideshows, and six interchangeable map styles.',
        ],
      },
    ],
  },

  music: {
    face: 'left',
    title: 'Music',
    short: 'Music',
    intro: 'Sounds, labels and artist identities.',
    projects: [
      {
        id: 'pixel-flare-label',
        name: 'Pixel Flare — the label',
        year: '2026',
        tech: ['Retrowave', 'Ska-pop', 'Electro-folk', 'Melodic death'],
        url: 'https://pixel-flare.com',
        summary: 'A music label and its artists.',
        details: [
          'The Glass Hour · Attack A Cake · CMD · HALDEN · L’Atelier des Lucioles.',
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
        summary: 'A mathematical riddle: turn every button green.',
        details: [
          'Each button changes the score and has its own hidden condition to turn green.',
          'Reach secret milestones to unlock new backgrounds. Several levels and achievements.',
        ],
      },
      {
        id: 'gravity-star',
        name: 'Gravity Star',
        year: '2023',
        tech: ['React', 'React Three Fiber'],
        url: 'https://sylvainlano.github.io/GravityStar/index.html',
        summary: 'A 3D space game made in ten days.',
        details: [],
      },
      {
        id: 'hexa-snake',
        name: 'Hexagonal Snake',
        year: '2023',
        tech: ['Vanilla JavaScript'],
        url: 'https://sylvainlano.github.io/HexaSnake/index.html',
        summary: 'Snake on a hexagonal grid, made in about twelve hours.',
        details: ['No dependencies at all.'],
      },
      {
        id: 'planet-rescue',
        name: 'Planet Rescue',
        year: '2010',
        tech: ['JavaScript'],
        url: 'https://sylvainlano.github.io/PlanetRescue/index.html',
        summary: 'Where it started: a browser game from 2010.',
        details: [],
      },
    ],
  },

  writing: {
    face: 'bottom',
    title: 'Writing',
    short: 'Writing',
    intro: 'Tales, fragments and words set to music.',
    projects: [
      {
        id: 'atelier-des-lucioles',
        name: 'L’Atelier des Lucioles',
        year: '2026',
        tech: ['Tales', 'Electro-folk', 'French'],
        url: 'https://pixel-flare.com/fr/latelierdeslucioles',
        summary: 'Illustrated tales, each paired with an instrumental release.',
        details: [
          'Every release comes with its full tale, hidden clues and secrets to find on the page.',
        ],
      },
    ],
  },
};
