/* ------------------------------------------------------------------ *
 *  The word pack
 *
 *  A pair only works if it sits in a narrow band. Too far apart and the
 *  first clue exposes the impostor — nobody describes "Apple" and "Car"
 *  the same way. Too close and there is no signal at all: "Sofa" and
 *  "Couch" produce identical clues and the round is a coin flip.
 *
 *  What works is same category, most attributes shared, one or two
 *  salient differences. Both sides also have to be describable without
 *  saying them, which rules out most abstract nouns.
 *
 *  Which side is the civilian word is decided per game in game.js, so a
 *  pair does not burn out for players who have seen it before.
 * ------------------------------------------------------------------ */

export const CATEGORIES = [
  { id: "food", name: "Food & drink" },
  { id: "animals", name: "Animals" },
  { id: "places", name: "Places" },
  { id: "objects", name: "Objects" },
  { id: "doing", name: "Things to do" },
  { id: "culture", name: "Books, film & music" },
  { id: "travel", name: "Travel" },
  { id: "people", name: "People & jobs" },
  { id: "tech", name: "Tech" },
  { id: "life", name: "Everyday life" },
];

export const PAIRS = [
  // ---- Food & drink ----
  ["Coffee", "Tea", "food"],
  ["Pizza", "Burger", "food"],
  ["Pancake", "Waffle", "food"],
  ["Sundae", "Sorbet", "food"],
  ["Sushi", "Sashimi", "food"],
  ["Taco", "Burrito", "food"],
  ["Ketchup", "Relish", "food"],
  ["Butter", "Margarine", "food"],
  ["Beer", "Wine", "food"],
  ["Popcorn", "Crisps", "food"],
  ["Cake", "Pie", "food"],
  ["Honey", "Syrup", "food"],
  ["Lemon", "Lime", "food"],
  ["Cucumber", "Zucchini", "food"],
  ["Doughnut", "Bagel", "food"],
  ["Milkshake", "Smoothie", "food"],
  ["Soup", "Stew", "food"],
  ["Cereal", "Granola", "food"],
  ["Chocolate", "Fudge", "food"],
  ["Whisky", "Rum", "food"],
  ["Champagne", "Cider", "food"],
  ["Sandwich", "Wrap", "food"],
  ["Fries", "Wedges", "food"],
  ["Pasta", "Noodles", "food"],
  ["Mustard", "Mayonnaise", "food"],
  ["Bacon", "Ham", "food"],

  // ---- Animals ----
  ["Cat", "Dog", "animals"],
  ["Dolphin", "Shark", "animals"],
  ["Crow", "Magpie", "animals"],
  ["Butterfly", "Moth", "animals"],
  ["Turtle", "Tortoise", "animals"],
  ["Horse", "Donkey", "animals"],
  ["Frog", "Toad", "animals"],
  ["Crocodile", "Hippo", "animals"],
  ["Rabbit", "Squirrel", "animals"],
  ["Leopard", "Cheetah", "animals"],
  ["Bee", "Wasp", "animals"],
  ["Owl", "Eagle", "animals"],
  ["Penguin", "Seal", "animals"],
  ["Camel", "Llama", "animals"],
  ["Hamster", "Ferret", "animals"],
  ["Goat", "Sheep", "animals"],
  ["Mouse", "Rat", "animals"],
  ["Octopus", "Squid", "animals"],
  ["Peacock", "Flamingo", "animals"],

  // ---- Places ----
  ["Beach", "Desert", "places"],
  ["Library", "Bookshop", "places"],
  ["Hotel", "Motel", "places"],
  ["Museum", "Gallery", "places"],
  ["Airport", "Station", "places"],
  ["Gym", "Spa", "places"],
  ["Church", "Temple", "places"],
  ["Forest", "Jungle", "places"],
  ["Lake", "River", "places"],
  ["Pub", "Nightclub", "places"],
  ["Hospital", "Clinic", "places"],
  ["Cinema", "Theatre", "places"],
  ["Supermarket", "Market", "places"],
  ["Zoo", "Aquarium", "places"],
  ["Castle", "Palace", "places"],
  ["Cafe", "Restaurant", "places"],
  ["Bridge", "Tunnel", "places"],
  ["Mountain", "Volcano", "places"],
  ["Garden", "Park", "places"],

  // ---- Objects ----
  ["Umbrella", "Parasol", "objects"],
  ["Pen", "Pencil", "objects"],
  ["Backpack", "Suitcase", "objects"],
  ["Mirror", "Window", "objects"],
  ["Candle", "Lamp", "objects"],
  ["Clock", "Watch", "objects"],
  ["Fan", "Heater", "objects"],
  ["Soap", "Shampoo", "objects"],
  ["Wallet", "Purse", "objects"],
  ["Key", "Lock", "objects"],
  ["Blanket", "Towel", "objects"],
  ["Fork", "Spoon", "objects"],
  ["Scissors", "Knife", "objects"],
  ["Broom", "Mop", "objects"],
  ["Ladder", "Staircase", "objects"],
  ["Hat", "Helmet", "objects"],
  ["Glasses", "Goggles", "objects"],
  ["Ring", "Bracelet", "objects"],
  ["String", "Chain", "objects"],

  // ---- Things to do ----
  ["Swimming", "Surfing", "doing"],
  ["Yoga", "Meditation", "doing"],
  ["Chess", "Checkers", "doing"],
  ["Camping", "Sleepover", "doing"],
  ["Ballet", "Gymnastics", "doing"],
  ["Marathon", "Sprint", "doing"],
  ["Karaoke", "Concert", "doing"],
  ["Fishing", "Hunting", "doing"],
  ["Skiing", "Snowboarding", "doing"],
  ["Boxing", "Wrestling", "doing"],
  ["Painting", "Drawing", "doing"],
  ["Baking", "Barbecue", "doing"],
  ["Hiking", "Climbing", "doing"],
  ["Football", "Rugby", "doing"],
  ["Tennis", "Badminton", "doing"],
  ["Golf", "Croquet", "doing"],
  ["Juggling", "Acrobatics", "doing"],
  ["Crossword", "Sudoku", "doing"],

  // ---- Books, film & music ----
  ["Trailer", "Poster", "culture"],
  ["Podcast", "Radio", "culture"],
  ["Novel", "Memoir", "culture"],
  ["Guitar", "Violin", "culture"],
  ["Piano", "Keyboard", "culture"],
  ["Magician", "Clown", "culture"],
  ["Opera", "Musical", "culture"],
  ["Documentary", "Biopic", "culture"],
  ["Comic", "Manga", "culture"],
  ["Vinyl", "Cassette", "culture"],
  ["Sequel", "Remake", "culture"],
  ["Circus", "Carnival", "culture"],
  ["Drums", "Tambourine", "culture"],
  ["Poetry", "Lyrics", "culture"],

  // ---- Travel ----
  ["Taxi", "Bus", "travel"],
  ["Bicycle", "Motorcycle", "travel"],
  ["Cruise", "Ferry", "travel"],
  ["Helicopter", "Aeroplane", "travel"],
  ["Passport", "Visa", "travel"],
  ["Train", "Tram", "travel"],
  ["Hostel", "Resort", "travel"],
  ["Map", "Compass", "travel"],
  ["Postcard", "Letter", "travel"],
  ["Yacht", "Submarine", "travel"],
  ["Tent", "Caravan", "travel"],
  ["Subway", "Sewer", "travel"],

  // ---- People & jobs ----
  ["Teacher", "Professor", "people"],
  ["Doctor", "Nurse", "people"],
  ["Chef", "Baker", "people"],
  ["Sheriff", "Cowboy", "people"],
  ["Barber", "Butcher", "people"],
  ["Actor", "Model", "people"],
  ["Firefighter", "Paramedic", "people"],
  ["Pilot", "Astronaut", "people"],
  ["Lawyer", "Judge", "people"],
  ["Farmer", "Gardener", "people"],
  ["Journalist", "Blogger", "people"],
  ["Waiter", "Bartender", "people"],
  ["Dentist", "Surgeon", "people"],
  ["Referee", "Coach", "people"],
  ["Detective", "Spy", "people"],

  // ---- Tech ----
  ["Laptop", "Tablet", "tech"],
  ["Email", "Fax", "tech"],
  ["Battery", "Charger", "tech"],
  ["Password", "Fingerprint", "tech"],
  ["Wifi", "Bluetooth", "tech"],
  ["Robot", "Mannequin", "tech"],
  ["Printer", "Photocopier", "tech"],
  ["Headphones", "Speakers", "tech"],
  ["Camera", "Telescope", "tech"],
  ["Calculator", "Abacus", "tech"],
  ["Drone", "Satellite", "tech"],
  ["Emoji", "Sticker", "tech"],
  ["Smartwatch", "Stopwatch", "tech"],
  ["Remote", "Controller", "tech"],

  // ---- Everyday life ----
  ["Wedding", "Engagement", "life"],
  ["Birthday", "Anniversary", "life"],
  ["Nap", "Hibernation", "life"],
  ["Shower", "Bath", "life"],
  ["Breakfast", "Brunch", "life"],
  ["Rain", "Snow", "life"],
  ["Beard", "Moustache", "life"],
  ["Tattoo", "Piercing", "life"],
  ["Selfie", "Portrait", "life"],
  ["Gossip", "Secret", "life"],
  ["Alarm", "Doorbell", "life"],
  ["Homework", "Exam", "life"],
  ["Interview", "Audition", "life"],
  ["Queue", "Traffic", "life"],
  ["Handshake", "Hug", "life"],
  ["Diary", "Confession", "life"],
  ["Rent", "Mortgage", "life"],
  ["Tip", "Bribe", "life"],
  ["Compliment", "Flirt", "life"],
  ["Apology", "Excuse", "life"],
];

/* ------------------------------------------------------------------ *
 *  The rude pack
 *
 *  Cheeky rather than explicit, and that is a design decision before it
 *  is a taste one. Innuendo gives a clue somewhere to go: you can gesture
 *  sideways at "Hangover" for a whole turn. The explicit pack below is
 *  the one for tables that want the other thing.
 *
 *  Category ids are prefixed `d-` so a stale selection left over from
 *  the clean pack can never silently match one of these.
 * ------------------------------------------------------------------ */

export const DIRTY_CATEGORIES = [
  { id: "d-dating", name: "Dating" },
  { id: "d-night", name: "Big night out" },
  { id: "d-body", name: "Body" },
  { id: "d-habits", name: "Bad habits" },
  { id: "d-life", name: "Grown-up life" },
];

export const DIRTY_PAIRS = [
  // ---- Dating ----
  ["Ghosting", "Blocking", "d-dating"],
  ["Sexting", "Autocorrect", "d-dating"],
  ["Hickey", "Bruise", "d-dating"],
  ["Rebound", "Crush", "d-dating"],
  ["Lingerie", "Pyjamas", "d-dating"],
  ["Proposal", "Ultimatum", "d-dating"],
  ["Situationship", "Friendzone", "d-dating"],
  ["Tinder", "Matchmaker", "d-dating"],
  ["Snogging", "Spooning", "d-dating"],
  ["Breakup", "Divorce", "d-dating"],
  ["Honeymoon", "Eloping", "d-dating"],
  ["Affair", "Fling", "d-dating"],
  ["Wingman", "Chaperone", "d-dating"],

  // ---- Big night out ----
  ["Hangover", "Migraine", "d-night"],
  ["Tequila", "Vodka", "d-night"],
  ["Cocktail", "Mocktail", "d-night"],
  ["Dancefloor", "Moshpit", "d-night"],
  ["Bouncer", "Guestlist", "d-night"],
  ["Rave", "Festival", "d-night"],
  ["Blackout", "Fainting", "d-night"],
  ["Kebab", "Curry", "d-night"],
  ["Wristband", "Stamp", "d-night"],
  ["Shots", "Pints", "d-night"],
  ["Afterparty", "Housewarming", "d-night"],
  ["Tab", "Round", "d-night"],
  ["Vomiting", "Burping", "d-night"],

  // ---- Body ----
  ["Cleavage", "Sixpack", "d-body"],
  ["Thong", "Boxers", "d-body"],
  ["Tanline", "Freckles", "d-body"],
  ["Corset", "Shapewear", "d-body"],
  ["Deodorant", "Perfume", "d-body"],
  ["Skinnydipping", "Sunbathing", "d-body"],
  ["Botox", "Facelift", "d-body"],
  ["Waxing", "Shaving", "d-body"],
  ["Armpit", "Bellybutton", "d-body"],
  ["Stretchmarks", "Scars", "d-body"],
  ["Snoring", "Drooling", "d-body"],
  ["Farting", "Sneezing", "d-body"],
  ["Bedhead", "Stubble", "d-body"],

  // ---- Bad habits ----
  ["Vaping", "Smoking", "d-habits"],
  ["Gambling", "Lottery", "d-habits"],
  ["Doomscrolling", "Bingewatching", "d-habits"],
  ["Procrastinating", "Multitasking", "d-habits"],
  ["Fidgeting", "Pacing", "d-habits"],
  ["Snitching", "Eavesdropping", "d-habits"],
  ["Lying", "Exaggerating", "d-habits"],
  ["Stalking", "Snooping", "d-habits"],
  ["Hoarding", "Collecting", "d-habits"],
  ["Caffeine", "Nicotine", "d-habits"],
  ["Snacking", "Nailbiting", "d-habits"],
  ["Oversharing", "Humblebragging", "d-habits"],
  ["Sulking", "Grudge", "d-habits"],

  // ---- Grown-up life ----
  ["Alimony", "Inheritance", "d-life"],
  ["Overdraft", "Payday", "d-life"],
  ["Therapy", "Venting", "d-life"],
  ["Retirement", "Redundancy", "d-life"],
  ["Landlord", "Housemate", "d-life"],
  ["Relatives", "Neighbours", "d-life"],
  ["Speeding", "Parking", "d-life"],
  ["Reunion", "Funeral", "d-life"],
  ["Sauna", "Jacuzzi", "d-life"],
  ["Massage", "Physio", "d-life"],
  ["Bonus", "Raise", "d-life"],
  ["Taxes", "Subscriptions", "d-life"],
  ["Insomnia", "Jetlag", "d-life"],
];

/* ------------------------------------------------------------------ *
 *  The explicit pack
 *
 *  Adults who have opted in twice — once by picking the pack, once by
 *  agreeing to play it. Blunt where the rude pack is coy.
 *
 *  The band still has to hold, which is the part that is easy to lose
 *  here. Two words for the same act give identical clues and the round
 *  is a coin flip, so pairs are built the same way as everywhere else:
 *  neighbours, not synonyms. `Bondage / Discipline` and `Whip / Paddle`
 *  work; a pair of bare synonyms would not.
 *
 *  Category ids are prefixed `x-`, disjoint from both other packs.
 * ------------------------------------------------------------------ */

export const EXPLICIT_CATEGORIES = [
  { id: "x-acts", name: "The act" },
  { id: "x-body", name: "Anatomy" },
  { id: "x-toys", name: "Toys & kit" },
  { id: "x-kinks", name: "Kinks" },
  { id: "x-scene", name: "The scene" },
];

export const EXPLICIT_PAIRS = [
  // ---- The act ----
  ["Blowjob", "Handjob", "x-acts"],
  ["Sixtynine", "Doggystyle", "x-acts"],
  ["Missionary", "Cowgirl", "x-acts"],
  ["Anal", "Rimming", "x-acts"],
  ["Wanking", "Fingering", "x-acts"],
  ["Edging", "Faking", "x-acts"],
  ["Threesome", "Orgy", "x-acts"],
  ["Creampie", "Facial", "x-acts"],
  ["Moaning", "Dirtytalk", "x-acts"],
  ["Striptease", "Lapdance", "x-acts"],

  // ---- Anatomy ----
  ["Tits", "Arse", "x-body"],
  ["Cock", "Balls", "x-body"],
  ["Clit", "Nipples", "x-body"],
  ["Foreskin", "Labia", "x-body"],
  ["Bulge", "Cameltoe", "x-body"],
  ["Gspot", "Prostate", "x-body"],
  ["Cum", "Squirt", "x-body"],
  ["Bush", "Brazilian", "x-body"],

  // ---- Toys & kit ----
  ["Vibrator", "Dildo", "x-toys"],
  ["Buttplug", "Strapon", "x-toys"],
  ["Handcuffs", "Rope", "x-toys"],
  ["Ballgag", "Blindfold", "x-toys"],
  ["Lube", "Spit", "x-toys"],
  ["Whip", "Paddle", "x-toys"],
  ["Collar", "Leash", "x-toys"],
  ["Poppers", "Viagra", "x-toys"],

  // ---- Kinks ----
  ["Dominance", "Submission", "x-kinks"],
  ["Spanking", "Choking", "x-kinks"],
  ["Voyeurism", "Exhibitionism", "x-kinks"],
  ["Degradation", "Begging", "x-kinks"],
  ["Cuckolding", "Swinging", "x-kinks"],
  ["Bondage", "Chastity", "x-kinks"],
  ["Latex", "Leather", "x-kinks"],

  // ---- The scene ----
  ["Brothel", "Stripclub", "x-scene"],
  ["Stripper", "Escort", "x-scene"],
  ["Porn", "OnlyFans", "x-scene"],
  ["Gloryhole", "Peepshow", "x-scene"],
  ["Nudes", "Sextape", "x-scene"],
  ["Dogging", "Cruising", "x-scene"],
  ["Pornstar", "Camgirl", "x-scene"],
];

/* ------------------------------------------------------------------ *
 *  The registry
 *
 *  One place decides which array is in play. Everything downstream — the
 *  chips on setup, the draw, the tests — reads a pack id off this and
 *  never branches on the pack itself.
 * ------------------------------------------------------------------ */

export const PACK_IDS = ["clean", "rude", "explicit"];

export const PACKS = {
  clean: {
    id: "clean",
    name: "Clean",
    pairs: PAIRS,
    categories: CATEGORIES,
    blurb: "Everyday things — food, animals, places, films. Fine for any table.",
  },
  rude: {
    id: "rude",
    name: "Rude",
    pairs: DIRTY_PAIRS,
    categories: DIRTY_CATEGORIES,
    blurb:
      "Dating, hangovers, bad habits and a lot of innuendo. Nothing you couldn't say at a work party, but read the room.",
  },
  explicit: {
    id: "explicit",
    name: "Explicit",
    pairs: EXPLICIT_PAIRS,
    categories: EXPLICIT_CATEGORIES,
    blurb:
      "Sex, anatomy, kinks and the kit. No euphemism. Adults who have all agreed to it, and nobody's colleagues.",
  },
};

/* Accepts a pack id, and also the boolean this setting used to be, so a
 * setup restored from a browser that last saw the two-pack version comes
 * back as something valid instead of undefined. */
export function normalizePack(value) {
  if (value === true) return "rude";
  if (value === false || value === null || value === undefined) return "clean";
  return PACK_IDS.includes(value) ? value : "clean";
}

export const packFor = (pack) => PACKS[normalizePack(pack)];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const DIRTY_CATEGORY_IDS = DIRTY_CATEGORIES.map((c) => c.id);
export const EXPLICIT_CATEGORY_IDS = EXPLICIT_CATEGORIES.map((c) => c.id);

/* Static data, so this either always passes or always throws. Scoped
 * PER PACK: a game only ever draws from one of them, so a word is free
 * to appear in more than one where it genuinely belongs in both — but
 * never twice within the pack that is actually in play. */
const SINGLE_WORD = /^\p{L}+$/u;

for (const id of PACK_IDS) {
  const { pairs, categories } = PACKS[id];
  const ids = categories.map((c) => c.id);
  const known = new Set(ids);
  // A pair tagged with a category that has no chip is unreachable from the
  // setup screen — invisible, and only in one filter combination.
  const orphans = [...new Set(pairs.map((p) => p[2]).filter((c) => !known.has(c)))];
  if (orphans.length)
    throw new Error(id + " pairs in unknown categories: " + orphans.join(", "));
  const empty = ids.filter((c) => !pairs.some((p) => p[2] === c));
  if (empty.length)
    throw new Error(id + " categories with no pairs: " + empty.join(", "));
  const seen = new Set();
  for (const [a, b] of pairs) {
    for (const w of [a, b]) {
      // Single words only. A phrase is harder to describe without saying
      // half of it, and Mr. Shake has to type the civilian word back at
      // the end — "Netflix and chill" is a spelling test, not a guess.
      if (!SINGLE_WORD.test(w))
        throw new Error('"' + w + '" is not a single word (' + id + " pack)");
      const k = w.toLowerCase();
      if (seen.has(k))
        throw new Error('"' + w + '" appears in more than one ' + id + " pair");
      seen.add(k);
    }
  }
}

// No two packs may share a category id, or a selection made in one would
// survive a switch and quietly filter another.
for (let i = 0; i < PACK_IDS.length; i++) {
  for (let j = i + 1; j < PACK_IDS.length; j++) {
    const a = PACKS[PACK_IDS[i]].categories.map((c) => c.id);
    const b = new Set(PACKS[PACK_IDS[j]].categories.map((c) => c.id));
    const overlap = a.filter((c) => b.has(c));
    if (overlap.length)
      throw new Error(
        "category ids shared between " + PACK_IDS[i] + " and " + PACK_IDS[j] + ": " + overlap.join(", ")
      );
  }
}
