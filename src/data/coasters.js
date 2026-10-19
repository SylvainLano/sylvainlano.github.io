// coasters.js
// Every roller coaster ridden so far, for the Coasters face and its full ranking.
// Scores: Captain Coaster, read on 16 August 2026 (a satisfaction percentage from
// community votes, to compare coasters with one another, not a mark out of 100).
// null = unknown. To add a coaster, add a line; ranks and totals follow.

export const SCORES_DATE = '16 August 2026';

// One colour per park
export const PARKS = {
  "Plopsaland": "#FFC61A",
  "Walibi Belgium": "#FF8A1F",
  "Walibi Holland": "#FF3D3D",
  "Efteling": "#FF2E97",
  "Phantasialand": "#E23BFF",
  "Walygator Grand-Est": "#00C2FF",
  "Parc Astérix": "#39FF88",
  "Europa Park": "#00F0C8",
  "PortAventura": "#4DD2FF",
  "Walibi Rhône-Alpes": "#A9B4FF",
  "Walygator Sud-Ouest": "#B14EFF",
  "Le Pal": "#9DFF3D",
  "Vulcania": "#7B6CFF",
};

// name, score, park, type, manufacturer, year, height (m), speed (km/h), length (m), inversions, wooden
const DATA = [
  ["Ride to Happiness", 99.7, "Plopsaland", "Launched spinning", "Mack Rides", 2021, 35, 90, 920, 5, 0],
  ["Anubis: The Ride", 82.2, "Plopsaland", "Launched", "Gerstlauer", 2009, 34, 90, 600, 3, 0],
  ["Heidi the Ride", 78.5, "Plopsaland", "Sit-down", "Great Coasters Int.", 2017, 22, 71, 627, 0, 1],
  ["SuperSplash", 37.8, "Plopsaland", "Water coaster", "Mack Rides", 2006, 24, 68, 300, 0, 0],
  ["Draconis", 25.9, "Plopsaland", "Sit-down", "Mack Rides", 2004, 14, 36, 450, 0, 0],
  ["K3 Roller Skater", 16.2, "Plopsaland", "Sit-down", "Vekoma", 1990, 13, 46, 335, 0, 0],
  ["#LikeMe Coaster", 8.3, "Plopsaland", "Sit-down", "Zierer", 1976, 8, 36, 360, 0, 0],
  ["Kondaa", 98.5, "Walibi Belgium", "Sit-down", "Intamin", 2021, 50, 113, 1200, 0, 0],
  ["Mecalodon", 89.4, "Walibi Belgium", "Launched", "Gerstlauer", 2025, 15, 65, 925, 0, 0],
  ["Pulsar", 77.0, "Walibi Belgium", "Water coaster", "Mack Rides", 2016, 45, 101, 217, 0, 0],
  ["Turbine", 74.6, "Walibi Belgium", "Sit-down", "Schwarzkopf", 1982, 42, 85, 220, 1, 0],
  ["Tiki-Waka", 67.4, "Walibi Belgium", "Sit-down", "Gerstlauer", 2018, 21, 55, 564, 0, 0],
  ["Calamity Mine", 53.0, "Walibi Belgium", "Mine train", "Vekoma", 1992, 14, 48, 785, 0, 0],
  ["Loup Garou", 45.5, "Walibi Belgium", "Sit-down", "Vekoma", 2001, 28, 80, 1035, 0, 1],
  ["Fun Pilot", 21.8, "Walibi Belgium", "Sit-down", "Zierer", 2019, 10, 40, 190, 0, 0],
  ["Cobra", 17.4, "Walibi Belgium", "Sit-down", "Vekoma", 2001, 36, 76, 285, 3, 0],
  ["Vampire", 4.5, "Walibi Belgium", "Inverted", "Vekoma", 1999, 33, 80, 689, 5, 0],
  ["Untamed", 98.9, "Walibi Holland", "Sit-down", "Rocky Mountain Constr.", 2019, 37, 92, 1085, 5, 0],
  ["Goliath", 92.5, "Walibi Holland", "Sit-down", "Intamin", 2002, 47, 106, 1214, 0, 0],
  ["Lost Gravity", 87.0, "Walibi Holland", "Sit-down", "Mack Rides", 2016, 32, 87, 680, 2, 0],
  ["YoY (Thrill – green)", 81.8, "Walibi Holland", "Sit-down", "Rocky Mountain Constr.", 2025, 29, 82, 665, 6, 0],
  ["YoY (Chill – blue)", 80.0, "Walibi Holland", "Sit-down", "Rocky Mountain Constr.", 2025, 29, 80, 655, 0, 0],
  ["Xpress : Platform 13", 65.0, "Walibi Holland", "Launched", "Vekoma", 2000, 26, 90, 996, 3, 0],
  ["Speed of Sound", 42.1, "Walibi Holland", "Sit-down", "Vekoma", 2000, 36, 76, 285, 3, 0],
  ["Eat My Dust", 17.3, "Walibi Holland", "Sit-down", "Zamperla", 2023, null, 40, null, 0, 0],
  ["Condor", 1.5, "Walibi Holland", "Inverted", "Vekoma", 1994, 31, 80, 662, 5, 0],
  ["Drako", null, "Walibi Holland", "Kids", "Zierer", 1992, 6, 32, 199, 0, 0],
  ["Joris en de Draak (Vuur)", 85.4, "Efteling", "Sit-down", "Great Coasters Int.", 2010, 21, 75, 788, 0, 1],
  ["Baron 1898", 85.3, "Efteling", "Dive", "Bolliger & Mabillard", 2015, 38, 90, 501, 2, 0],
  ["Joris en de Draak (Water)", 85.2, "Efteling", "Sit-down", "Great Coasters Int.", 2010, 21, 75, 788, 0, 1],
  ["Vliegende Hollander", 78.9, "Efteling", "Water coaster", "KumbaK", 2007, 23, 70, 420, 0, 0],
  ["Vogel Rok", 63.9, "Efteling", "Sit-down, in the dark", "Vekoma", 1998, 20, 70, 643, 0, 0],
  ["Python (2018)", 60.7, "Efteling", "Sit-down", "Vekoma", 2018, 29, 75, 750, 4, 0],
  ["Max + Moritz (Max)", 47.1, "Efteling", "Family", "Mack Rides", 2020, 6, 36, 300, 0, 0],
  ["Max + Moritz (Moritz)", 45.4, "Efteling", "Family", "Mack Rides", 2020, 6, 36, 300, 0, 0],
  ["Taron", 98.5, "Phantasialand", "Launched", "Intamin", 2016, 30, 117, 1320, 0, 0],
  ["F.L.Y.", 96.5, "Phantasialand", "Flying, launched", "Vekoma", 2020, 20, 78, 1234, 2, 0],
  ["Black Mamba", 92.4, "Phantasialand", "Inverted", "Bolliger & Mabillard", 2006, 26, 80, 768, 4, 0],
  ["Colorado Adventure", 80.8, "Phantasialand", "Mine train", "Vekoma", 1996, 26, 50, 1280, 0, 0],
  ["Winja's Fear", 79.1, "Phantasialand", "Spinning", "Maurer", 2002, 17, 66, 465, 0, 0],
  ["Winja's Force", 78.2, "Phantasialand", "Spinning", "Maurer", 2002, 17, 60, 410, 0, 0],
  ["Raik", 56.8, "Phantasialand", "Family, launched", "Vekoma", 2016, 25, 62, 209, 0, 0],
  ["Crazy Bats", 40.0, "Phantasialand", "Sit-down, in the dark", "Vekoma", 1988, 12, 47, 1175, 0, 0],
  ["Monster", 92.0, "Walygator Grand-Est", "Inverted", "Bolliger & Mabillard", 2010, 42, 92, 1200, 6, 0],
  ["Anaconda", 28.7, "Walygator Grand-Est", "Sit-down", "William J. Cobb", 1989, 35, 85, 1200, 0, 1],
  ["Comet", 27.2, "Walygator Grand-Est", "Sit-down", "Vekoma", 1989, 24, 64, null, 3, 0],
  ["Family Coaster", null, "Walygator Grand-Est", "Kids", "Unknown", 2007, null, null, null, 0, 0],
  ["Toutatis", 98.8, "Parc Astérix", "Launched", "Intamin", 2023, 51, 107, 1075, 3, 0],
  ["OzIris", 93.8, "Parc Astérix", "Inverted", "Bolliger & Mabillard", 2012, 40, 90, 1000, 5, 0],
  ["Pégase Express", 78.3, "Parc Astérix", "Family", "Gerstlauer", 2017, 21, 52, 928, 0, 0],
  ["Tonnerre 2 Zeus", 73.7, "Parc Astérix", "Sit-down", "Gravity Group", 2022, 30, 90, 1232, 0, 1],
  ["Cétautomatix", 65.1, "Parc Astérix", "Spinning", "Gerstlauer", 2025, 14, 45, 420, 0, 0],
  ["Trace du Hourra", 55.6, "Parc Astérix", "Bobsled", "Mack Rides", 2001, 31, 60, 900, 0, 0],
  ["Goudurix", 23.4, "Parc Astérix", "Sit-down", "Vekoma", 1989, 36, 90, 950, 7, 0],
  ["Vol d'Icare", 17.3, "Parc Astérix", "Sit-down", "Zierer", 1994, 11, 42, 410, 0, 0],
  ["SOS Tournevis", null, "Parc Astérix", "Kids", "Zierer", 1990, 6, 32, 199, 0, 0],
  ["Voltron", 98.9, "Europa Park", "Launched", "Mack Rides", 2024, 32, 100, 1385, 7, 0],
  ["Wodan Timbur Coaster", 93.5, "Europa Park", "Sit-down", "Great Coasters Int.", 2012, 35, 100, 1050, 0, 1],
  ["Silver Star", 90.3, "Europa Park", "Sit-down", "Bolliger & Mabillard", 2002, 73, 127, 1620, 0, 0],
  ["blue fire Megacoaster", 88.9, "Europa Park", "Launched", "Mack Rides", 2009, 38, 100, 1056, 4, 0],
  ["Cancan Coaster", 77.2, "Europa Park", "Sit-down, in the dark", "Mack Rides", 2018, 26, 60, 922, 0, 0],
  ["Euro Mir", 57.4, "Europa Park", "Spinning", "Mack Rides", 1997, 28, 80, 980, 0, 0],
  ["Matterhorn Blitz", 52.6, "Europa Park", "Sit-down", "Mack Rides", 1999, 16, 56, 383, 0, 0],
  ["Pegasus", 52.2, "Europa Park", "Family", "Mack Rides", 2006, 15, 65, 400, 0, 0],
  ["Schweizer Bobbahn", 41.9, "Europa Park", "Bobsled", "Mack Rides", 1985, 19, 50, 487, 0, 0],
  ["Shambhala", 97.7, "PortAventura", "Sit-down", "Bolliger & Mabillard", 2012, 76, 134, 1564, 0, 0],
  ["Dragon Khan", 83.5, "PortAventura", "Sit-down", "Bolliger & Mabillard", 1995, 49, 105, 1270, 8, 0],
  ["Uncharted", 76.2, "PortAventura", "Sit-down, in the dark", "Intamin", 2023, 12, null, 700, 0, 0],
  ["Furius Baco", 75.6, "PortAventura", "Wing, launched", "Intamin", 2007, 15, 135, 858, 1, 0],
  ["Stampida (Red)", 49.2, "PortAventura", "Sit-down", "Custom Coasters Int.", 1997, 26, 74, 953, 0, 1],
  ["Stampida (Blue)", 47.1, "PortAventura", "Sit-down", "Custom Coasters Int.", 1997, 26, 74, 953, 0, 1],
  ["Tomahawk", 40.9, "PortAventura", "Sit-down", "Custom Coasters Int.", 1997, 14, 48, 440, 0, 1],
  ["Diablo - Tren de la Mina", 35.5, "PortAventura", "Mine train", "Arrow Dynamics", 1995, 17, null, 1008, 0, 0],
  ["Mahuka", 93.5, "Walibi Rhône-Alpes", "Launched monorail", "Intamin", 2024, 19, 67, 600, 3, 0],
  ["Mystic", 89.1, "Walibi Rhône-Alpes", "Shuttle", "Gerstlauer", 2019, 31, 85, 575, 3, 0],
  ["Timber", 75.2, "Walibi Rhône-Alpes", "Sit-down", "Gravitykraft Corp.", 2016, 17, 64, 446, 0, 1],
  ["Generator", 33.7, "Walibi Rhône-Alpes", "Boomerang shuttle", "Vekoma", 1988, 36, 76, 285, 3, 0],
  ["Woodstock Express", 11.2, "Walibi Rhône-Alpes", "Wild mouse", "Zamperla", 2002, 7, null, 270, 0, 0],
  ["Coccinelle", 10.2, "Walibi Rhône-Alpes", "Kids", "Zierer", 1992, 8, 36, 360, 0, 0],
  ["Boomerang", 20.7, "Walygator Sud-Ouest", "Boomerang shuttle", "Vekoma", 1992, 36, 76, 285, 3, 0],
  ["Coccinelle", 12.5, "Walygator Sud-Ouest", "Kids", "Zierer", 1992, 8, 36, 360, 0, 0],
  ["Mine de Thor", 7.5, "Walygator Sud-Ouest", "Wild mouse", "Zamperla", 2002, 11, null, 270, 0, 0],
  ["Yukon Quad", 86.4, "Le Pal", "Launched", "Intamin", 2018, 12, 90, 1000, 0, 0],
  ["Twist", 75.8, "Le Pal", "Spinning", "Mack Rides", 2011, 22, 70, 470, 0, 0],
  ["Fjord Explorer", 72.9, "Le Pal", "Sit-down", "Mack Rides", 2024, 29, 79, 600, 0, 0],
  ["Azteka", 46.4, "Le Pal", "Sit-down", "Soquet", 2021, 17, 55, 500, 0, 0],
  ["Tigre de Sibérie", 7.7, "Le Pal", "Sit-down", "Reverchon", 1990, 13, 40, 360, 0, 0],
  ["Namazu", 72.5, "Vulcania", "Family, launched", "Intamin", 2021, 16, 69, 584, 0, 0],
];

const KEYS = ['name', 'score', 'park', 'type', 'maker', 'year', 'height', 'speed', 'length', 'inversions', 'wood'];

export const coasters = DATA.map((d, id) => Object.fromEntries([['id', id], ...KEYS.map((k, i) => [k, d[i]])]));

// Rank by score; coasters without a score come last
[...coasters]
  .sort((a, b) => (b.score ?? -1) - (a.score ?? -1))
  .forEach((c, i) => {
    c.rank = i + 1;
  });

export const parkCount = Object.keys(PARKS).length;
