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
  ["Gelato", "Sorbet", "food"],
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
  ["Champagne", "Prosecco", "food"],
  ["Sandwich", "Wrap", "food"],
  ["Fries", "Wedges", "food"],
  ["Pasta", "Noodles", "food"],
  ["Mustard", "Mayonnaise", "food"],
  ["Bacon", "Ham", "food"],

  // ---- Animals ----
  ["Cat", "Dog", "animals"],
  ["Dolphin", "Shark", "animals"],
  ["Crow", "Raven", "animals"],
  ["Butterfly", "Moth", "animals"],
  ["Turtle", "Tortoise", "animals"],
  ["Horse", "Donkey", "animals"],
  ["Frog", "Toad", "animals"],
  ["Alligator", "Crocodile", "animals"],
  ["Rabbit", "Hare", "animals"],
  ["Leopard", "Cheetah", "animals"],
  ["Bee", "Wasp", "animals"],
  ["Owl", "Eagle", "animals"],
  ["Penguin", "Seal", "animals"],
  ["Camel", "Llama", "animals"],
  ["Hamster", "Gerbil", "animals"],
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
  ["Gym", "Playground", "places"],
  ["Church", "Temple", "places"],
  ["Forest", "Jungle", "places"],
  ["Lake", "Pond", "places"],
  ["Bar", "Pub", "places"],
  ["Hospital", "Clinic", "places"],
  ["Cinema", "Theatre", "places"],
  ["Supermarket", "Market", "places"],
  ["Zoo", "Aquarium", "places"],
  ["Castle", "Palace", "places"],
  ["Cafe", "Restaurant", "places"],
  ["Bridge", "Tunnel", "places"],
  ["Mountain", "Hill", "places"],
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
  ["Glasses", "Sunglasses", "objects"],
  ["Ring", "Bracelet", "objects"],
  ["Rope", "Chain", "objects"],

  // ---- Things to do ----
  ["Swimming", "Surfing", "doing"],
  ["Yoga", "Pilates", "doing"],
  ["Chess", "Checkers", "doing"],
  ["Camping", "Glamping", "doing"],
  ["Dancing", "Ballet", "doing"],
  ["Marathon", "Sprint", "doing"],
  ["Karaoke", "Concert", "doing"],
  ["Fishing", "Hunting", "doing"],
  ["Skiing", "Snowboarding", "doing"],
  ["Boxing", "Wrestling", "doing"],
  ["Painting", "Drawing", "doing"],
  ["Baking", "Cooking", "doing"],
  ["Hiking", "Walking", "doing"],
  ["Football", "Rugby", "doing"],
  ["Tennis", "Badminton", "doing"],
  ["Golf", "Croquet", "doing"],
  ["Juggling", "Acrobatics", "doing"],
  ["Crossword", "Sudoku", "doing"],

  // ---- Books, film & music ----
  ["Trailer", "Teaser", "culture"],
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
  ["Drums", "Bongos", "culture"],
  ["Poetry", "Lyrics", "culture"],

  // ---- Travel ----
  ["Taxi", "Bus", "travel"],
  ["Bicycle", "Motorcycle", "travel"],
  ["Cruise", "Ferry", "travel"],
  ["Helicopter", "Aeroplane", "travel"],
  ["Passport", "Visa", "travel"],
  ["Train", "Tram", "travel"],
  ["Hostel", "Guesthouse", "travel"],
  ["Map", "Compass", "travel"],
  ["Souvenir", "Postcard", "travel"],
  ["Yacht", "Sailboat", "travel"],
  ["Tent", "Caravan", "travel"],
  ["Subway", "Monorail", "travel"],

  // ---- People & jobs ----
  ["Teacher", "Professor", "people"],
  ["Doctor", "Nurse", "people"],
  ["Chef", "Baker", "people"],
  ["Sheriff", "Bouncer", "people"],
  ["Barber", "Hairdresser", "people"],
  ["Actor", "Model", "people"],
  ["Firefighter", "Paramedic", "people"],
  ["Pilot", "Navigator", "people"],
  ["Lawyer", "Judge", "people"],
  ["Farmer", "Gardener", "people"],
  ["Journalist", "Blogger", "people"],
  ["Waiter", "Bartender", "people"],
  ["Dentist", "Orthodontist", "people"],
  ["Referee", "Coach", "people"],
  ["Detective", "Spy", "people"],

  // ---- Tech ----
  ["Laptop", "Tablet", "tech"],
  ["Email", "Fax", "tech"],
  ["Modem", "Router", "tech"],
  ["Password", "Fingerprint", "tech"],
  ["Wifi", "Bluetooth", "tech"],
  ["Robot", "Android", "tech"],
  ["Printer", "Photocopier", "tech"],
  ["Headphones", "Speakers", "tech"],
  ["Camera", "Webcam", "tech"],
  ["Calculator", "Abacus", "tech"],
  ["Drone", "Satellite", "tech"],
  ["Emoji", "Sticker", "tech"],
  ["Smartwatch", "Pedometer", "tech"],
  ["Cable", "Charger", "tech"],

  // ---- Everyday life ----
  ["Wedding", "Engagement", "life"],
  ["Birthday", "Anniversary", "life"],
  ["Nap", "Sleep", "life"],
  ["Shower", "Bath", "life"],
  ["Breakfast", "Brunch", "life"],
  ["Rain", "Snow", "life"],
  ["Beard", "Moustache", "life"],
  ["Tattoo", "Piercing", "life"],
  ["Selfie", "Portrait", "life"],
  ["Gossip", "Secret", "life"],
  ["Alarm", "Snooze", "life"],
  ["Homework", "Exam", "life"],
  ["Interview", "Audition", "life"],
  ["Queue", "Traffic", "life"],
  ["Handshake", "Hug", "life"],
  ["Diary", "Blog", "life"],
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
  ["Ghosting", "Breadcrumbing", "d-dating"],
  ["Sexting", "Flirting", "d-dating"],
  ["Hickey", "Bruise", "d-dating"],
  ["Rebound", "Crush", "d-dating"],
  ["Lingerie", "Pyjamas", "d-dating"],
  ["Proposal", "Ultimatum", "d-dating"],
  ["Situationship", "Romance", "d-dating"],
  ["Chemistry", "Attraction", "d-dating"],
  ["Kissing", "Cuddling", "d-dating"],
  ["Breakup", "Divorce", "d-dating"],
  ["Honeymoon", "Anniversary", "d-dating"],
  ["Seduction", "Persuasion", "d-dating"],
  ["Jealousy", "Envy", "d-dating"],

  // ---- Big night out ----
  ["Hangover", "Migraine", "d-night"],
  ["Tequila", "Vodka", "d-night"],
  ["Cocktail", "Mocktail", "d-night"],
  ["Nightclub", "Disco", "d-night"],
  ["Bouncer", "Bartender", "d-night"],
  ["Rave", "Festival", "d-night"],
  ["Blackout", "Fainting", "d-night"],
  ["Kebab", "Pizza", "d-night"],
  ["Karaoke", "Dancing", "d-night"],
  ["Shots", "Pints", "d-night"],
  ["Afterparty", "Sleepover", "d-night"],
  ["Regret", "Shame", "d-night"],
  ["Vomiting", "Burping", "d-night"],

  // ---- Body ----
  ["Cleavage", "Shoulder", "d-body"],
  ["Thong", "Boxers", "d-body"],
  ["Sunburn", "Freckles", "d-body"],
  ["Muscles", "Curves", "d-body"],
  ["Sweat", "Perfume", "d-body"],
  ["Nudity", "Modesty", "d-body"],
  ["Botox", "Filler", "d-body"],
  ["Waxing", "Shaving", "d-body"],
  ["Bellybutton", "Dimple", "d-body"],
  ["Cellulite", "Stretchmarks", "d-body"],
  ["Snoring", "Drooling", "d-body"],
  ["Farting", "Sneezing", "d-body"],
  ["Bedhead", "Stubble", "d-body"],

  // ---- Bad habits ----
  ["Vaping", "Smoking", "d-habits"],
  ["Gambling", "Lottery", "d-habits"],
  ["Doomscrolling", "Bingewatching", "d-habits"],
  ["Procrastinating", "Daydreaming", "d-habits"],
  ["Fidgeting", "Twitching", "d-habits"],
  ["Snitching", "Gossiping", "d-habits"],
  ["Lying", "Exaggerating", "d-habits"],
  ["Stalking", "Snooping", "d-habits"],
  ["Splurging", "Hoarding", "d-habits"],
  ["Caffeine", "Nicotine", "d-habits"],
  ["Snacking", "Bingeing", "d-habits"],
  ["Oversharing", "Humblebragging", "d-habits"],
  ["Sulking", "Pouting", "d-habits"],

  // ---- Grown-up life ----
  ["Alimony", "Inheritance", "d-life"],
  ["Overdraft", "Debt", "d-life"],
  ["Therapy", "Venting", "d-life"],
  ["Retirement", "Redundancy", "d-life"],
  ["Mortgage", "Rent", "d-life"],
  ["Relatives", "Neighbours", "d-life"],
  ["Speeding", "Parking", "d-life"],
  ["Reunion", "Funeral", "d-life"],
  ["Sauna", "Jacuzzi", "d-life"],
  ["Massage", "Physio", "d-life"],
  ["Bonus", "Raise", "d-life"],
  ["Taxes", "Bills", "d-life"],
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
  ["Orgasm", "Afterglow", "x-acts"],
  ["Foreplay", "Aftercare", "x-acts"],
  ["Quickie", "Marathon", "x-acts"],
  ["Threesome", "Foursome", "x-acts"],
  ["Hookup", "Fling", "x-acts"],
  ["Striptease", "Lapdance", "x-acts"],
  ["Moaning", "Panting", "x-acts"],
  ["Missionary", "Cowgirl", "x-acts"],
  ["Edging", "Teasing", "x-acts"],
  ["Grinding", "Straddling", "x-acts"],
  ["Roleplay", "Cosplay", "x-acts"],
  ["Seduction", "Flirtation", "x-acts"],

  // ---- Anatomy ----
  ["Nipple", "Areola", "x-body"],
  ["Cleavage", "Buttocks", "x-body"],
  ["Genitals", "Groin", "x-body"],
  ["Erection", "Arousal", "x-body"],
  ["Thighs", "Hips", "x-body"],
  ["Lips", "Tongue", "x-body"],
  ["Pubes", "Stubble", "x-body"],
  ["Sweat", "Saliva", "x-body"],
  ["Curves", "Muscles", "x-body"],
  ["Hickey", "Scratch", "x-body"],
  ["Waistline", "Hipbone", "x-body"],
  ["Nudity", "Lingerie", "x-body"],

  // ---- Toys & kit ----
  ["Vibrator", "Dildo", "x-toys"],
  ["Handcuffs", "Rope", "x-toys"],
  ["Blindfold", "Gag", "x-toys"],
  ["Lubricant", "Moisturiser", "x-toys"],
  ["Condom", "Diaphragm", "x-toys"],
  ["Whip", "Paddle", "x-toys"],
  ["Corset", "Harness", "x-toys"],
  ["Feather", "Silk", "x-toys"],
  ["Collar", "Leash", "x-toys"],
  ["Costume", "Uniform", "x-toys"],
  ["Mirror", "Camera", "x-toys"],
  ["Chains", "Straps", "x-toys"],

  // ---- Kinks ----
  ["Bondage", "Discipline", "x-kinks"],
  ["Dominance", "Submission", "x-kinks"],
  ["Spanking", "Flogging", "x-kinks"],
  ["Voyeurism", "Exhibitionism", "x-kinks"],
  ["Fetish", "Obsession", "x-kinks"],
  ["Praise", "Degradation", "x-kinks"],
  ["Denial", "Indulgence", "x-kinks"],
  ["Switching", "Topping", "x-kinks"],
  ["Safeword", "Signal", "x-kinks"],
  ["Consent", "Boundaries", "x-kinks"],
  ["Restraint", "Freedom", "x-kinks"],
  ["Latex", "Leather", "x-kinks"],

  // ---- The scene ----
  ["Brothel", "Nightclub", "x-scene"],
  ["Stripper", "Escort", "x-scene"],
  ["Pornography", "Erotica", "x-scene"],
  ["Sexshop", "Boutique", "x-scene"],
  ["Swingers", "Singles", "x-scene"],
  ["Peepshow", "Cabaret", "x-scene"],
  ["Burlesque", "Ballet", "x-scene"],
  ["Magazine", "Calendar", "x-scene"],
  ["Webcam", "Livestream", "x-scene"],
  ["Subscription", "Membership", "x-scene"],
  ["Spa", "Sauna", "x-scene"],
  ["Chatroom", "Hotline", "x-scene"],
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
