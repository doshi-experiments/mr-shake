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
  ["Ice cream", "Frozen yoghurt", "food"],
  ["Sushi", "Sashimi", "food"],
  ["Taco", "Burrito", "food"],
  ["Ketchup", "Barbecue sauce", "food"],
  ["Butter", "Margarine", "food"],
  ["Beer", "Wine", "food"],
  ["Popcorn", "Crisps", "food"],
  ["Cake", "Pie", "food"],
  ["Honey", "Maple syrup", "food"],
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
  ["Fries", "Hash browns", "food"],
  ["Pasta", "Noodles", "food"],
  ["Mustard", "Mayonnaise", "food"],
  ["Steak", "Roast chicken", "food"],

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
  ["Hamster", "Guinea pig", "animals"],
  ["Goat", "Sheep", "animals"],
  ["Mouse", "Rat", "animals"],
  ["Octopus", "Squid", "animals"],
  ["Peacock", "Flamingo", "animals"],

  // ---- Places ----
  ["Beach", "Desert", "places"],
  ["Library", "Bookshop", "places"],
  ["Hotel", "Motel", "places"],
  ["Museum", "Art gallery", "places"],
  ["Airport", "Train station", "places"],
  ["Gym", "Playground", "places"],
  ["Church", "Temple", "places"],
  ["Forest", "Jungle", "places"],
  ["Lake", "Pond", "places"],
  ["Bar", "Pub", "places"],
  ["Hospital", "Clinic", "places"],
  ["Cinema", "Theatre", "places"],
  ["Supermarket", "Farmers market", "places"],
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
  ["Fan", "Air conditioner", "objects"],
  ["Soap", "Shampoo", "objects"],
  ["Wallet", "Purse", "objects"],
  ["Key", "Lock", "objects"],
  ["Blanket", "Towel", "objects"],
  ["Fork", "Spoon", "objects"],
  ["Scissors", "Knife", "objects"],
  ["Broom", "Vacuum cleaner", "objects"],
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
  ["Golf", "Mini golf", "doing"],
  ["Juggling", "Magic trick", "doing"],
  ["Jigsaw puzzle", "Crossword", "doing"],

  // ---- Books, film & music ----
  ["Streaming", "Cinema trip", "culture"],
  ["Podcast", "Radio", "culture"],
  ["Novel", "Comic book", "culture"],
  ["Guitar", "Violin", "culture"],
  ["Piano", "Keyboard", "culture"],
  ["Magician", "Clown", "culture"],
  ["Opera", "Musical", "culture"],
  ["Documentary", "Reality show", "culture"],
  ["Stand-up comedy", "Improv", "culture"],
  ["Vinyl record", "Cassette tape", "culture"],
  ["Board game", "Video game", "culture"],
  ["Circus", "Carnival", "culture"],
  ["Drums", "Bongos", "culture"],
  ["Poetry", "Song lyrics", "culture"],

  // ---- Travel ----
  ["Taxi", "Bus", "travel"],
  ["Bicycle", "Motorcycle", "travel"],
  ["Cruise ship", "Ferry", "travel"],
  ["Helicopter", "Aeroplane", "travel"],
  ["Passport", "Visa", "travel"],
  ["Train", "Tram", "travel"],
  ["Hostel", "Holiday rental", "travel"],
  ["Map", "Compass", "travel"],
  ["Souvenir", "Fridge magnet", "travel"],
  ["Road trip", "Cruise", "travel"],
  ["Tent", "Caravan", "travel"],
  ["Subway", "Monorail", "travel"],

  // ---- People & jobs ----
  ["Teacher", "Professor", "people"],
  ["Doctor", "Nurse", "people"],
  ["Chef", "Baker", "people"],
  ["Police officer", "Security guard", "people"],
  ["Barber", "Hairdresser", "people"],
  ["Actor", "Model", "people"],
  ["Firefighter", "Paramedic", "people"],
  ["Pilot", "Flight attendant", "people"],
  ["Lawyer", "Judge", "people"],
  ["Farmer", "Gardener", "people"],
  ["Journalist", "Blogger", "people"],
  ["Waiter", "Bartender", "people"],
  ["Dentist", "Orthodontist", "people"],
  ["Referee", "Coach", "people"],
  ["Detective", "Spy", "people"],

  // ---- Tech ----
  ["Laptop", "Tablet", "tech"],
  ["Email", "Text message", "tech"],
  ["Video call", "Phone call", "tech"],
  ["Password", "Fingerprint", "tech"],
  ["Wi-Fi", "Bluetooth", "tech"],
  ["Robot", "Android", "tech"],
  ["Printer", "Photocopier", "tech"],
  ["Headphones", "Speakers", "tech"],
  ["Camera", "Webcam", "tech"],
  ["Calculator", "Abacus", "tech"],
  ["Drone", "Satellite", "tech"],
  ["Emoji", "Sticker", "tech"],
  ["Smartwatch", "Fitness tracker", "tech"],
  ["USB stick", "Hard drive", "tech"],

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
  ["Alarm clock", "Snooze button", "life"],
  ["Homework", "Exam", "life"],
  ["Job interview", "Audition", "life"],
  ["Queue", "Traffic jam", "life"],
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
 *  is a taste one. The mechanic needs a word you can gesture at
 *  sideways for one clue; graphic anatomy collapses a round into
 *  laughing instead of deducing, and the two halves of an explicit pair
 *  usually read as the same thing, which kills the signal the whole
 *  game runs on. Dating, hangovers and bad habits give clues somewhere
 *  to go.
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
  ["One-night stand", "First date", "d-dating"],
  ["Ghosting", "Breadcrumbing", "d-dating"],
  ["Situationship", "Friends with benefits", "d-dating"],
  ["Dating app", "Speed dating", "d-dating"],
  ["Booty call", "Drunk text", "d-dating"],
  ["Wingman", "Third wheel", "d-dating"],
  ["Netflix and chill", "Movie night", "d-dating"],
  ["Sexting", "Flirting", "d-dating"],
  ["Hickey", "Bruise", "d-dating"],
  ["Blind date", "Set-up", "d-dating"],
  ["Cuffing season", "Summer fling", "d-dating"],
  ["Rebound", "Crush", "d-dating"],
  ["Lap dance", "Slow dance", "d-dating"],
  ["Making out", "Holding hands", "d-dating"],
  ["Dirty talk", "Sweet nothings", "d-dating"],
  ["Red flag", "Green flag", "d-dating"],
  ["Break-up text", "Break-up call", "d-dating"],
  ["Ex", "In-law", "d-dating"],
  ["Proposal", "Ultimatum", "d-dating"],
  ["Lingerie", "Pyjamas", "d-dating"],

  // ---- Big night out ----
  ["Hangover", "Still drunk", "d-night"],
  ["Beer goggles", "Rose-tinted glasses", "d-night"],
  ["Tequila shot", "Vodka shot", "d-night"],
  ["Body shot", "Shotgunning a beer", "d-night"],
  ["Hen party", "Stag do", "d-night"],
  ["Strip club", "Burlesque", "d-night"],
  ["Bar crawl", "Wine tasting", "d-night"],
  ["Kebab at 3am", "Brunch", "d-night"],
  ["Blacking out", "Passing out", "d-night"],
  ["Drunk dial", "Butt dial", "d-night"],
  ["Dance floor", "Mosh pit", "d-night"],
  ["Nightclub", "House party", "d-night"],
  ["Bouncer", "Bartender", "d-night"],
  ["Last call", "Lock-in", "d-night"],
  ["Hair of the dog", "Greasy fry-up", "d-night"],
  ["Pre-drinks", "Afters", "d-night"],
  ["Designated driver", "Taxi home", "d-night"],
  ["Bar tab", "Round of drinks", "d-night"],
  ["Throwing up", "The spins", "d-night"],
  ["Karaoke at midnight", "Open mic", "d-night"],

  // ---- Body ----
  ["Thong", "Boxers", "d-body"],
  ["Push-up bra", "Corset", "d-body"],
  ["Skinny dipping", "Nude beach", "d-body"],
  ["Nudes", "Selfie", "d-body"],
  ["Bikini wax", "Shaving", "d-body"],
  ["Six-pack", "Dad bod", "d-body"],
  ["Botox", "Filler", "d-body"],
  ["Spray tan", "Sunburn", "d-body"],
  ["Cleavage", "Low neckline", "d-body"],
  ["Sweat patch", "Deodorant", "d-body"],
  ["Bad breath", "Body odour", "d-body"],
  ["Farting", "Burping", "d-body"],
  ["Muffin top", "Love handles", "d-body"],
  ["Bedhead", "Hat hair", "d-body"],
  ["Chest hair", "Beard", "d-body"],
  ["Tan lines", "Freckles", "d-body"],
  ["Cold shower", "Ice bath", "d-body"],
  ["Morning breath", "Garlic breath", "d-body"],

  // ---- Bad habits ----
  ["Vape", "Cigarette", "d-habits"],
  ["Weed", "Tobacco", "d-habits"],
  ["Gambling", "Lottery", "d-habits"],
  ["Doomscrolling", "Binge-watching", "d-habits"],
  ["Procrastinating", "Napping", "d-habits"],
  ["Biting your nails", "Cracking your knuckles", "d-habits"],
  ["Snitching", "Gossiping", "d-habits"],
  ["White lie", "Excuse", "d-habits"],
  ["Calling in sick", "Working from home", "d-habits"],
  ["Stalking an ex online", "Reading old texts", "d-habits"],
  ["Impulse buy", "Spending spree", "d-habits"],
  ["Energy drink", "Double espresso", "d-habits"],
  ["Midnight snack", "Second dinner", "d-habits"],
  ["Being late", "Cancelling last minute", "d-habits"],
  ["Oversharing", "Humblebrag", "d-habits"],
  ["Silent treatment", "Petty revenge", "d-habits"],
  ["Eavesdropping", "Snooping", "d-habits"],

  // ---- Grown-up life ----
  ["Divorce", "Break-up", "d-life"],
  ["Prenup", "Marriage licence", "d-life"],
  ["Overdraft", "Payday loan", "d-life"],
  ["Credit card debt", "Student loan", "d-life"],
  ["Awkward silence", "Lift ride", "d-life"],
  ["Office party", "Family dinner", "d-life"],
  ["In-laws visiting", "Landlord inspection", "d-life"],
  ["Therapy", "Venting to a friend", "d-life"],
  ["Midlife crisis", "Gap year", "d-life"],
  ["Fake ID", "Borrowed badge", "d-life"],
  ["Speeding ticket", "Parking fine", "d-life"],
  ["Group chat", "Private message", "d-life"],
  ["Sugar daddy", "Rich uncle", "d-life"],
  ["Hot tub", "Sauna", "d-life"],
  ["Massage", "Chiropractor", "d-life"],
];

/* Picking a pack is a one-liner everywhere it is needed, and there is
 * exactly one place that decides which array is in play. */
export const packFor = (spicy) =>
  spicy
    ? { pairs: DIRTY_PAIRS, categories: DIRTY_CATEGORIES }
    : { pairs: PAIRS, categories: CATEGORIES };

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const DIRTY_CATEGORY_IDS = DIRTY_CATEGORIES.map((c) => c.id);

/* Static data, so this either always passes or always throws. Scoped
 * PER PACK: a game only ever draws from one of them, so a word is free
 * to appear in both where it genuinely belongs in both — but never
 * twice within the pack that is actually in play. */
for (const [label, pairs, categories] of [
  ["clean", PAIRS, CATEGORIES],
  ["rude", DIRTY_PAIRS, DIRTY_CATEGORIES],
]) {
  const ids = categories.map((c) => c.id);
  const known = new Set(ids);
  // A pair tagged with a category that has no chip is unreachable from the
  // setup screen — invisible, and only in one filter combination.
  const orphans = [...new Set(pairs.map((p) => p[2]).filter((c) => !known.has(c)))];
  if (orphans.length)
    throw new Error(label + " pairs in unknown categories: " + orphans.join(", "));
  const empty = ids.filter((c) => !pairs.some((p) => p[2] === c));
  if (empty.length)
    throw new Error(label + " categories with no pairs: " + empty.join(", "));
  const seen = new Set();
  for (const [a, b] of pairs) {
    for (const w of [a, b]) {
      const k = w.toLowerCase();
      if (seen.has(k))
        throw new Error('"' + w + '" appears in more than one ' + label + " pair");
      seen.add(k);
    }
  }
}

// The two packs must not share a category id, or a selection made in one
// would survive a switch and quietly filter the other.
{
  const overlap = CATEGORY_IDS.filter((c) => DIRTY_CATEGORY_IDS.includes(c));
  if (overlap.length) throw new Error("category ids shared between packs: " + overlap.join(", "));
}
