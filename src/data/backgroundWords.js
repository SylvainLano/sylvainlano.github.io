// backgroundWords.js
// The words that surface in the scrolling text behind the cube.
// One set per side of the cube; each set has four kinds of words, each with its
// own colour (see BackgroundText.css). Edit freely: plain text, spaces allowed.

export const backgroundWords = {
  // ---------- The work side ----------
  work: {
    // Code: functions, keywords and calls from the languages I write
    code: [
      // React
      'useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useLayoutEffect', 'useContext',
      'useReducer', 'forwardRef', 'useImperativeHandle', 'createContext', 'Fragment', 'props', 'children',
      // JavaScript / TypeScript
      'addEventListener', 'requestAnimationFrame', 'querySelector', 'Promise.all', 'async', 'await',
      'fetch', 'JSON.parse', 'Array.from', 'Math.random', 'Object.entries', 'structuredClone', 'export default',
      'interface', 'readonly', 'implements',
      // Angular / Vue
      'ngOnInit', 'ngOnDestroy', '@Component', '@Injectable', 'subscribe', 'pipe', 'switchMap',
      'computed', 'watchEffect', 'defineProps', 'v-for', 'v-model',
      // Java / JPA
      'public static void main', '@Entity', '@OneToMany', '@Transactional', 'Optional.ofNullable',
      'stream().map', 'EntityManager', 'CompletableFuture', '@Override', 'equals', 'hashCode',
      // PHP / Symfony
      '$this', 'foreach', '__construct', '#[Route]', 'Doctrine', 'Twig', 'composer install',
      // SQL
      'SELECT', 'LEFT JOIN', 'GROUP BY', 'CREATE INDEX', 'EXPLAIN ANALYZE', 'COMMIT',
      // GLSL / GDScript
      'gl_FragColor', 'smoothstep', 'fract', 'mix', 'uniform', 'varying', 'func _ready',
      'func _process', '@export', 'signal',
      // Shell & git
      'git commit', 'git rebase', 'npm run build', 'docker compose up',
    ],
    // Qualities and ways of working
    qualities: [
      'passionate', 'creative', 'curious', 'analytical', 'rigorous', 'autonomous', 'adaptable',
      'patient', 'organized', 'innovative', 'collaborative', 'persistent', 'pragmatic', 'methodical',
      'self-taught', 'resourceful', 'meticulous', 'reliable', 'versatile', 'inventive', 'tenacious',
      'detail oriented', 'problem solver', 'critical thinker', 'self motivated', 'fast learner',
      'continuous learner', 'team player', 'clear communicator', 'performance minded',
      'clean code', 'code review', 'pair programming', 'refactoring', 'debugging', 'mentoring',
      'documentation', 'testing', 'optimization', 'architecture', 'accessibility', 'user first',
    ],
    // Languages, frameworks and tools
    technologies: [
      'Java', 'JPA', 'Hibernate', 'Maven', 'JavaFX', 'ProGuard', 'Gson', 'Cucumber',
      'PHP', 'Symfony', 'Doctrine', '.NET', 'Keycloak',
      'JavaScript', 'TypeScript', 'Node.js', 'React', 'Angular', 'RxJS', 'Vue.js', 'Vite',
      'vue-i18n', 'Three.js', 'React Three Fiber', 'WebGL', 'GLSL', 'tsParticles', 'Leaflet',
      'HTML', 'CSS', 'SASS', 'TailwindCSS', 'i18n',
      'PostgreSQL', 'MariaDB', 'MySQL', 'MongoDB', 'Docker', 'Git', 'GitHub Pages',
      'Godot', 'GDScript', 'Python',
    ],
    // My own projects and creative worlds
    creative: [
      'Pixel Flare', 'The Glass Hour', 'Attack A Cake', 'CMD', 'HALDEN', 'L’Atelier des Lucioles',
      'retrowave', 'synthwave', 'ska', 'brass', 'electro-folk', 'Saint Christie',
      'Dead Pixel', 'Turing’s Node', 'QuaddXmas', 'Planet Rescue', 'Clicker Stories', 'Shoot Out Loud',
      'Evolving Boids', 'Gravity Star', 'Hexagonal Snake', 'Voyage Vue', 'quadtree', 'Dijkstra',
      'Game of Life', 'Mandelbrot', 'pixel art', 'bullet heaven',
      'Les Terres du Seakk', 'La Fuite du Cerceau', 'Psikopat', 'Le Grand BazART', 'satire',
      'short stories', 'Fortune', 'Rêverie',
    ],
  },

  // ---------- The other side ----------
  other: {
    // Coasters and their vocabulary
    coasters: [
      'Ride to Happiness', 'Untamed', 'Voltron', 'Toutatis', 'Kondaa', 'Taron', 'Shambhala', 'F.L.Y.',
      'OzIris', 'Mahuka', 'Wodan', 'Black Mamba', 'Monster', 'Goliath', 'Silver Star', 'Mecalodon',
      'blue fire', 'Mystic', 'Lost Gravity', 'Yukon Quad', 'Joris en de Draak', 'Baron 1898', 'Dragon Khan',
      'Anubis', 'YoY', 'Heidi', 'Pulsar', 'Colorado Adventure', 'Pégase Express', 'Tonnerre 2 Zeus',
      'Furius Baco', 'Uncharted', 'Cancan Coaster', 'Twist', 'Fjord Explorer', 'Namazu', 'Timber',
      'Turbine', 'Python', 'Vliegende Hollander', 'Winja\u2019s Fear', 'Euro Mir', 'Goudurix',
      'Phantasialand', 'Europa Park', 'Efteling', 'Parc Astérix', 'PortAventura', 'Walibi', 'Plopsaland',
      'Le Pal', 'Walygator',
      'airtime', 'ejector air', 'floater air', 'launch', 'zero-g roll', 'inversion', 'first drop',
      'helix', 'cobra roll', 'dive loop', 'top hat', 'stall', 'lap bar', 'front row', 'back row',
      'wooden', 'hybrid', 'spinning', 'wing coaster', 'flying coaster', 'water coaster',
      'Intamin', 'Mack Rides', 'B&M', 'RMC', 'Gerstlauer', 'Vekoma', 'GCI', 'Zierer',
      'Captain Coaster', 'credit count', 'one more ride',
    ],
    // Food, tea and spices
    food: [
      'dry brine', 'kebab spices', 'Cajun', 'honey mustard', 'ratatouille', 'chili con carne',
      'pepper sauce', 'blue cheese sauce', 'bacon sauce', 'curry', 'roasted aubergines', 'pasta',
      'garlic', 'onion', 'paprika', 'cumin', 'smoked paprika', 'black pepper', 'peppercorns',
      'Tellicherry', 'smoked pepper', 'chipotle', 'chilli', 'jalapeño', 'oregano', 'thyme',
      'slow cooking', 'simmer', 'season to taste',
      'pastry teas', 'féeduthé.com', 'Tarte au Citron Meringuée', 'Framboisier', 'flavoured tea',
      'black tea', 'green tea', 'rooibos', 'teapot', 'infusion', 'house blend',
    ],
    // Games I play
    games: [
      'Professor Layton', 'Azran Legacy', 'Final Fantasy VII', 'Final Fantasy XII', 'Voodoo 2',
      'Baldur\u2019s Gate 3', 'Jedi: Fallen Order', 'Horizon Zero Dawn', 'Detroit', 'The Council',
      'Rogue Legacy', 'Rogue Legacy 2', 'Kingdom Two Crowns', 'Peglin', 'Peggle', 'Dungeon Clawler',
      'Balatro', 'Brotato', 'Vampire Survivors',
      'Sherlock Holmes', 'The Devil\u2019s Daughter', 'The Awakened', 'Blue Prince',
      'The Evil Within', 'Resident Evil', 'Silent Hill',
      'Broforce', 'Trine', 'Dungeon Defenders', 'Nine Parchments', 'TowerFall', 'Castle Crashers',
      'Full Metal Furies', 'Wreckfest', '3 Fluffy Pixels', 'Twitch', 'co-op', 'couch co-op',
      'platinum', 'one more run', 'new game +', 'GG',
    ],
    // Books and authors
    reading: [
      'Terry Pratchett', 'Discworld', 'Ankh-Morpork', 'Rincewind', 'the Luggage', 'Death',
      'Douglas Adams', '42', 'Don\u2019t Panic', 'towel', 'Arthur Dent', 'Babel fish',
      'Agatha Christie', 'Hercule Poirot', 'Miss Marple', 'little grey cells',
      'Conan Doyle', 'Sherlock Holmes', 'Baker Street', 'elementary',
      'H. P. Lovecraft', 'Cthulhu', 'R\u2019lyeh', 'Necronomicon', 'Innsmouth', 'Anonymous',
      'Graham Hancock', 'Velikovsky', 'lost civilisations', 'origins', 'Atlantis', 'catastrophism',
      'François Cavanna', 'Pierre Desproges', 'Hara-Kiri',
      'fantasy', 'science fiction', 'whodunit', 'archaeology', 'the absurd', 'lost worlds', 'bookmark',
    ],
  },
};

// Which colour each kind of word wears (a class of BackgroundText.css)
export const wordClasses = {
  code: 'bg-word--cyan',
  qualities: 'bg-word--pink',
  technologies: 'bg-word--mint',
  creative: 'bg-word--gold',
  coasters: 'bg-word--mint',
  food: 'bg-word--gold',
  games: 'bg-word--cyan',
  reading: 'bg-word--pink',
};
