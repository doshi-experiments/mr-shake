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

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

/* Static data, so this either always passes or always throws. A pair
 * tagged with a category that has no chip would be unreachable from the
 * setup screen — invisible, and only in one filter combination. */
{
  const known = new Set(CATEGORY_IDS);
  const orphans = [...new Set(PAIRS.map((p) => p[2]).filter((c) => !known.has(c)))];
  if (orphans.length) throw new Error("pairs in unknown categories: " + orphans.join(", "));
  const empty = CATEGORY_IDS.filter((c) => !PAIRS.some((p) => p[2] === c));
  if (empty.length) throw new Error("categories with no pairs: " + empty.join(", "));
  // A word appearing in two pairs makes a game ambiguous when both are drawn
  // in one session, and usually means a copy-paste slip.
  const seen = new Map();
  for (const [a, b] of PAIRS) {
    for (const w of [a, b]) {
      const k = w.toLowerCase();
      if (seen.has(k)) throw new Error('"' + w + '" appears in more than one pair');
      seen.set(k, true);
    }
  }
}
