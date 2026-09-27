import type { Spec } from "./schema";

export const px = (id: number, w = 1400) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const VIEW_LABELS = [
  "front studio view",
  "detail view",
  "lifestyle view",
  "packaging view",
  "alternate angle",
];

export type SeedReview = {
  author: string;
  location: string;
  rating: number;
  title: string;
  body: string;
  verified?: boolean;
  helpfulCount?: number;
  daysAgo: number;
};

export type SeedProduct = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  audience: "youth" | "family" | "everyone";
  priceCents: number;
  compareAtCents?: number;
  badge?: string;
  stock?: number;
  colors: string[];
  highlights: string[];
  specs: Spec[];
  featured?: boolean;
  isNewArrival?: boolean;
  bestseller?: boolean;
  gallery: number[];
  reviews?: SeedReview[];
};

export const CATEGORY_LABELS: Record<string, string> = {
  audio: "Audio",
  vision: "TV & Cinema",
  compute: "Laptops & Study",
  wearables: "Wearables",
  create: "Creator Gear",
  play: "Gaming",
};

export const AUDIENCE_LABELS: Record<string, string> = {
  youth: "For Youth",
  family: "For Families",
  everyone: "For Everyone",
};

export const seedCollections = [
  {
    slug: "sound-studio",
    name: "Sound Studio",
    tagline: "Headphones, buds & room-filling speakers",
    description:
      "Tuned by our audio lab in Copenhagen. Adaptive noise cancelling, 40-hour batteries and a fit that survives a school bag.",
    category: "audio",
    imageUrl: px(3394650, 1200),
    accent: "from-amber-400/25",
    sortOrder: 1,
  },
  {
    slug: "movie-night",
    name: "Family Movie Night",
    tagline: "Screens, soundbars & popcorn-ready projectors",
    description:
      "Everything you need to turn the living room into a cinema — with parental controls that actually work.",
    category: "vision",
    imageUrl: px(9807277, 1200),
    accent: "from-sky-400/25",
    sortOrder: 2,
  },
  {
    slug: "study-and-create",
    name: "Study & Create",
    tagline: "Laptops, tablets & desk upgrades",
    description:
      "Homework, side hustles and first portfolios. Lightweight machines with all-day battery and kid-proof cases.",
    category: "compute",
    imageUrl: px(8534244, 1200),
    accent: "from-emerald-400/25",
    sortOrder: 3,
  },
  {
    slug: "play-arena",
    name: "Play Arena",
    tagline: "Controllers, headsets & RGB everything",
    description:
      "Low-latency gear built for ranked nights and couch co-op. Sibling-tested, tournament approved.",
    category: "play",
    imageUrl: px(9794458, 1200),
    accent: "from-fuchsia-500/25",
    sortOrder: 4,
  },
  {
    slug: "wear-it-your-way",
    name: "Wear It Your Way",
    tagline: "Watches, bands & straps to swap",
    description:
      "Track practice, sleep and screen time — with GPS peace of mind for the youngest members of the house.",
    category: "wearables",
    imageUrl: px(3184451, 1200),
    accent: "from-rose-400/25",
    sortOrder: 5,
  },
  {
    slug: "creator-kit",
    name: "Creator Kit",
    tagline: "Cameras, drones & pocket studios",
    description:
      "For the first film shot on a birthday and the vlog that hits a million. Cinematic sensors, gimbal-smooth flight.",
    category: "create",
    imageUrl: px(4161786, 1200),
    accent: "from-indigo-400/25",
    sortOrder: 6,
  },
];

const spec = (pairs: [string, string][]): Spec[] =>
  pairs.map(([label, value]) => ({ label, value }));

export const seedProducts: SeedProduct[] = [
  {
    slug: "halo-one",
    name: "Loyal Halo One",
    tagline: "Adaptive noise-cancelling over-ear headphones",
    description:
      "The Halo One is our flagship listening experience. Twin 42mm bio-cellulose drivers deliver a warm, wide soundstage while Adaptive Quiet reads the room 200 times a second and hushes it. Memory-foam earcups wrapped in vegan leather keep marathon listening sessions comfortable, and a 10-minute charge buys you six more hours.",
    category: "audio",
    audience: "youth",
    priceCents: 24900,
    compareAtCents: 29900,
    badge: "Editor's Choice",
    stock: 34,
    colors: ["Midnight", "Cloud White", "Sandstone"],
    highlights: [
      "Adaptive Quiet cancels up to 42dB of cabin, traffic and dorm noise",
      "48 hours of playback with ANC on, 60 with it off",
      "Multipoint pairing keeps your laptop and phone connected at once",
      "Folds flat into a semi-rigid travel shell with cable pouch",
    ],
    specs: spec([
      ["Driver", "42mm bio-cellulose dynamic"],
      ["Battery", "48h (ANC on) · 10 min = 6h"],
      ["Bluetooth", "5.4 with LE Audio + LDAC"],
      ["Weight", "268 g"],
      ["Warranty", "3 years Loyal Care"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [3394650, 3394653, 3394651, 3756912, 3756945],
    reviews: [
      {
        author: "Amara O.",
        location: "Austin, TX",
        rating: 5,
        title: "Silence on the school bus, finally",
        body: "My son's old headphones leaked sound everywhere. The Halo One seals in the music and the volume limiter means I never have to shout 'turn it down'. Build quality feels like it costs twice as much.",
        helpfulCount: 128,
        daysAgo: 9,
      },
      {
        author: "Jonah R.",
        location: "Portland, OR",
        rating: 5,
        title: "Studio-grade for the price",
        body: "I mix podcasts on these. Flat enough to trust, comfortable for six-hour sessions. The multipoint switch between my phone and interface is seamless.",
        helpfulCount: 74,
        daysAgo: 26,
      },
      {
        author: "Priya N.",
        location: "Chicago, IL",
        rating: 4,
        title: "Superb, but the case is chunky",
        body: "Sound and comfort are genuinely excellent. Only note is that the travel shell takes up a good chunk of a backpack. Small price to pay.",
        helpfulCount: 31,
        daysAgo: 48,
      },
    ],
  },
  {
    slug: "halo-mini",
    name: "Loyal Halo Mini",
    tagline: "Volume-safe headphones for ages 4–12",
    description:
      "Built for small ears and big imaginations. The Halo Mini caps output at 85dB — the level audiologists recommend for children — while a bendy headband and wipe-clean cushions survive drops, tantrums and the bottom of a toy box. Add a second audio jack so two siblings can share one tablet.",
    category: "audio",
    audience: "family",
    priceCents: 7900,
    badge: "Parent Approved",
    colors: ["Sky", "Bubblegum", "Lime"],
    highlights: [
      "85dB safe-listening cap that cannot be overridden",
      "Share jack lets two kids watch one screen",
      "31-hour battery with a charge cable little hands can plug in",
      "Fold-flat, dishwasher-safe cushion covers included",
    ],
    specs: spec([
      ["Driver", "32mm neodymium"],
      ["Safe volume", "85 dB SPL cap"],
      ["Battery", "31 hours"],
      ["Ages", "4–12 years"],
      ["Warranty", "2 years + free cushion refills"],
    ]),
    featured: true,
    gallery: [3394653, 3756907, 8790300, 3394651],
    reviews: [
      {
        author: "Chanté M.",
        location: "Atlanta, GA",
        rating: 5,
        title: "Third pair — they last",
        body: "We have bought three of these for three kids and they are indestructible. The shared jack ended the back-seat arguments on a nine hour drive.",
        helpfulCount: 96,
        daysAgo: 14,
      },
      {
        author: "Trevor B.",
        location: "Denver, CO",
        rating: 5,
        title: "The volume cap is the whole point",
        body: "We tried cheaper kids headphones and they all got loud. This one doesn't, and my daughter says it's still plenty loud enough.",
        helpfulCount: 58,
        daysAgo: 33,
      },
    ],
  },
  {
    slug: "pulse-buds-pro",
    name: "Loyal Pulse Buds Pro",
    tagline: "True wireless earbuds with spatial audio",
    description:
      "Six microphones, adaptive transparency and a pocket case that charges off the same cable as your phone. Spatial audio with head tracking makes films feel theatrical on a six-inch screen. Four ear-tip sizes and a fit test in the Loyal app mean they stay put through sprints, sets and skate parks.",
    category: "audio",
    audience: "youth",
    priceCents: 12900,
    compareAtCents: 15900,
    colors: ["Graphite", "Pearl", "Electric Lilac"],
    highlights: [
      "Spatial audio with dynamic head tracking",
      "9h per bud · 34h with the wireless case",
      "IPX5 sweat and rain resistant",
      "Find-my-buds chirp and map location",
    ],
    specs: spec([
      ["Driver", "11mm dual-magnet"],
      ["Battery", "9h buds · 34h case"],
      ["Water rating", "IPX5"],
      ["Bluetooth", "5.4 + multipoint"],
      ["Warranty", "2 years"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [3756985, 3394653, 3756912, 3184451],
    reviews: [
      {
        author: "Marcus L.",
        location: "Brooklyn, NY",
        rating: 5,
        title: "Beat my old flagships",
        body: "Bass is punchy without swallowing the vocals, and the transparency mode is clear enough that I can hear traffic while running.",
        helpfulCount: 210,
        daysAgo: 5,
      },
      {
        author: "Nina K.",
        location: "Toronto, ON",
        rating: 4,
        title: "Great sound, fiddly gestures",
        body: "Sound is superb for the money and the case is tiny. I did turn off the swipe volume because I kept triggering it with my hair.",
        helpfulCount: 42,
        daysAgo: 21,
      },
      {
        author: "Elias W.",
        location: "Seattle, WA",
        rating: 5,
        title: "Survived a full term",
        body: "Daily commute, gym, rain. No dropouts, no crackle in one ear. Charging case still holds a full week of charge.",
        helpfulCount: 67,
        daysAgo: 61,
      },
    ],
  },
  {
    slug: "pulse-buds-lite",
    name: "Loyal Pulse Buds Lite",
    tagline: "Everyday earbuds under sixty dollars",
    description:
      "All the essentials, none of the fluff. Punchy 10mm drivers, a 28-hour case and instant pairing. Perfect first earbuds, gym spares or the pair you lend to a friend without worrying.",
    category: "audio",
    audience: "youth",
    priceCents: 5900,
    colors: ["White", "Graphite"],
    highlights: [
      "28 hours total with the pocket case",
      "Dual-mic calls with wind reduction",
      "Instant pairing after the first setup",
      "USB-C charging in 90 minutes",
    ],
    specs: spec([
      ["Driver", "10mm composite"],
      ["Battery", "7h buds · 28h case"],
      ["Water rating", "IPX4"],
      ["Bluetooth", "5.3"],
      ["Warranty", "1 year"],
    ]),
    gallery: [3756985, 3756907, 3184451],
  },
  {
    slug: "boombox-360",
    name: "Loyal Boombox 360",
    tagline: "Portable speaker with room-shaking bass",
    description:
      "A 360-degree array with a passive radiator that you can feel through a picnic blanket. IP67 means sand, pool splash and rain are all fine. Pair two for true stereo, and let PartyLink hand the queue around so everyone gets a turn as DJ.",
    category: "audio",
    audience: "youth",
    priceCents: 17900,
    compareAtCents: 21900,
    colors: ["Slate", "Coral", "Forest"],
    highlights: [
      "360° sound with a downward passive radiator",
      "IP67 dustproof and waterproof, floats",
      "24-hour battery that doubles as a power bank",
      "PartyLink up to 100 speakers",
    ],
    specs: spec([
      ["Output", "60 W RMS"],
      ["Battery", "24 hours"],
      ["Water rating", "IP67"],
      ["Weight", "1.2 kg"],
      ["Warranty", "2 years"],
    ]),
    gallery: [29581125, 7241341, 3756945],
  },
  {
    slug: "nest-studio",
    name: "Loyal Nest Studio",
    tagline: "Smart speaker with a fabric-wrapped cabinet",
    description:
      "A single cabinet, three drivers and a room-calibrating microphone that measures your walls in about ten seconds. Voice control for the whole Loyal home, plus a physical mic switch on the back because privacy should be a button, not a setting.",
    category: "audio",
    audience: "family",
    priceCents: 9900,
    colors: ["Oat", "Charcoal", "Terracotta"],
    highlights: [
      "Auto room calibration in 10 seconds",
      "Physical microphone cut-off switch",
      "Works as a whole-home stereo pair",
      "Recycled acoustic fabric exterior",
    ],
    specs: spec([
      ["Drivers", "1 tweeter + 2 mid-woofers"],
      ["Battery", "Mains powered"],
      ["Voice", "On-device wake word"],
      ["Size", "148 × 108 mm"],
      ["Warranty", "2 years"],
    ]),
    gallery: [29581125, 20557234, 20557088],
  },
  {
    slug: "vinyl-revive",
    name: "Loyal Vinyl Revive",
    tagline: "Belt-drive turntable with Bluetooth out",
    description:
      "A belt-driven deck with a pre-mounted cartridge, so it sounds right the first time you drop the needle. Bluetooth out means you can stream the warmth of vinyl to any speaker in the house — ideal for a family listening night.",
    category: "audio",
    audience: "family",
    priceCents: 19900,
    colors: ["Walnut", "Piano Black"],
    highlights: [
      "Pre-aligned moving-magnet cartridge",
      "Bluetooth aptX out plus analogue RCA",
      "Built-in switchable phono preamp",
      "Solid walnut plinth, dust cover included",
    ],
    specs: spec([
      ["Drive", "Belt"],
      ["Speeds", "33⅓ / 45 rpm"],
      ["Cartridge", "Loyal MM-1, pre-aligned"],
      ["Output", "RCA + Bluetooth aptX"],
      ["Warranty", "3 years"],
    ]),
    gallery: [29581125, 20573189, 821652],
  },
  {
    slug: "vista-55",
    name: "Loyal Vista 55",
    tagline: "55-inch 4K QLED with 120Hz game mode",
    description:
      "Quantum-dot colour at 100% DCI-P3, a matte anti-glare finish and a 120Hz mode that drops input lag to 9ms. The family dashboard puts screen-time limits, bedtime schedules and per-profile app lists on the home screen instead of buried in a menu.",
    category: "vision",
    audience: "family",
    priceCents: 79900,
    compareAtCents: 89900,
    badge: "Best Value TV",
    stock: 21,
    colors: ["Graphite"],
    highlights: [
      "55-inch 4K QLED, 100% DCI-P3 quantum dot",
      "120Hz Game Mode at 9ms input lag",
      "Matte anti-glare coating for bright rooms",
      "Per-profile screen-time and bedtime schedules",
    ],
    specs: spec([
      ["Panel", "55\" QLED 3840 × 2160"],
      ["Refresh", "120 Hz VRR"],
      ["HDR", "HDR10+ / HLG"],
      ["Ports", "4 × HDMI 2.1, 2 × USB"],
      ["Warranty", "3 years panel"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [5202925, 1444416, 7546717, 9807277],
    reviews: [
      {
        author: "Hannah S.",
        location: "Phoenix, AZ",
        rating: 5,
        title: "Bright room, zero glare",
        body: "Our living room has a wall of west-facing windows and every TV we tried turned into a mirror at 4pm. This one doesn't. The parental dashboard is the other reason we bought it.",
        helpfulCount: 152,
        daysAgo: 11,
      },
      {
        author: "Diego F.",
        location: "Montreal, QC",
        rating: 5,
        title: "Console-ready out of the box",
        body: "Plugged in, switched to Game Mode and it hit 120Hz immediately. Colour after a quick calibration is stunning for the price bracket.",
        helpfulCount: 88,
        daysAgo: 30,
      },
      {
        author: "Ravi P.",
        location: "Toronto, ON",
        rating: 4,
        title: "Great picture, so-so speakers",
        body: "No complaints on image. Budget for a soundbar — the built-ins are thin on dialogue. We paired it with the Loyal Vista bar and it transformed.",
        helpfulCount: 45,
        daysAgo: 72,
      },
    ],
  },
  {
    slug: "vista-soundbar",
    name: "Loyal Vista Soundbar 3.1",
    tagline: "Three channels, wireless sub, dialogue-first EQ",
    description:
      "A dedicated centre channel with a speech-boost mode that lifts dialogue out of the mix, plus a wireless sub you can tuck behind the sofa. Room calibration happens over a 15-second sweep from the couch.",
    category: "vision",
    audience: "family",
    priceCents: 34900,
    colors: ["Charcoal"],
    highlights: [
      "Dedicated centre channel for crisp dialogue",
      "Wireless 6.5\" subwoofer",
      "Night Mode compresses peaks after bedtime",
      "HDMI eARC with one-remote control",
    ],
    specs: spec([
      ["Channels", "3.1"],
      ["Output", "340 W peak"],
      ["Sub", "Wireless, 6.5\" driver"],
      ["Inputs", "HDMI eARC, optical"],
      ["Warranty", "2 years"],
    ]),
    gallery: [7546557, 5202925, 13806260],
  },
  {
    slug: "beam-mini",
    name: "Loyal Beam Mini",
    tagline: "Palm-sized 1080p projector, 3-hour battery",
    description:
      "Movie night anywhere with a wall. The Beam Mini throws a crisp 100-inch picture from two and a half metres, runs a three-hour film on battery and auto-focuses in a second. Built-in streaming apps mean no dongles, no cables, no fuss.",
    category: "vision",
    audience: "family",
    priceCents: 42900,
    badge: "New Season",
    colors: ["Ivory"],
    highlights: [
      "Up to a 120-inch picture from 2.8 m",
      "3-hour battery for a full film outdoors",
      "Auto focus and auto keystone in under a second",
      "Streaming apps built in, plus screen mirroring",
    ],
    specs: spec([
      ["Resolution", "1920 × 1080 native"],
      ["Brightness", "700 ISO lumens"],
      ["Battery", "3 hours video"],
      ["Noise", "28 dB"],
      ["Warranty", "2 years"],
    ]),
    featured: true,
    isNewArrival: true,
    gallery: [13806260, 9807277, 1444416, 8188720],
    reviews: [
      {
        author: "Sofia D.",
        location: "Portland, OR",
        rating: 5,
        title: "Back garden cinema",
        body: "We projected onto a bedsheet for my daughter's birthday and it genuinely looked like a cinema. Battery lasted the whole film plus credits.",
        helpfulCount: 118,
        daysAgo: 7,
      },
      {
        author: "Elias W.",
        location: "Seattle, WA",
        rating: 4,
        title: "Best after dark",
        body: "In a dark room it's brilliant. In daylight you'll want curtains drawn. Setup took four minutes including the Wi-Fi.",
        helpfulCount: 39,
        daysAgo: 19,
      },
    ],
  },
  {
    slug: "frame-32",
    name: "Loyal Frame 32",
    tagline: "Smart screen for the kitchen counter",
    description:
      "A 32-inch smart display that doubles as a family hub: shared calendars, photo frames, recipe cards and video calls. The matte display turns into a digital photo frame when idle, pulling from a shared family album.",
    category: "vision",
    audience: "family",
    priceCents: 29900,
    colors: ["White", "Oak"],
    highlights: [
      "Shared family calendar with colour-coded profiles",
      "Idle mode becomes a digital photo frame",
      "Hands-free video calling to grandparents",
      "Recipe cards readable from across the kitchen",
    ],
    specs: spec([
      ["Display", "32\" 1080p matte"],
      ["Camera", "8 MP with physical shutter"],
      ["Mount", "VESA 100 × 100"],
      ["Audio", "2 × 10 W"],
      ["Warranty", "2 years"],
    ]),
    isNewArrival: true,
    gallery: [7546557, 7546717, 20573189],
  },
  {
    slug: "book-air-14",
    name: "Loyal Book Air 14",
    tagline: "1.1kg aluminium laptop with 19-hour battery",
    description:
      "A 14-inch 2.8K display in a 1.1kg chassis that slips into any school bag. Nineteen hours of real-world battery means a full day of classes plus the commute. Fanless, silent, and rated to 1.4x the drop height of the previous generation.",
    category: "compute",
    audience: "youth",
    priceCents: 109900,
    compareAtCents: 124900,
    badge: "Top Pick for Students",
    stock: 26,
    colors: ["Silver", "Space Grey"],
    highlights: [
      "14\" 2.8K 120Hz display, 500 nits",
      "19 hours of real-world battery",
      "Fanless — completely silent in class",
      "16GB memory, 512GB upgradeable storage",
    ],
    specs: spec([
      ["Display", "14\" 2880 × 1800, 120 Hz"],
      ["Memory", "16 GB LPDDR5X"],
      ["Storage", "512 GB NVMe"],
      ["Ports", "2 × USB-C, HDMI, headphone"],
      ["Weight", "1.1 kg"],
      ["Warranty", "3 years + accidental damage"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [8534244, 7792775, 16564512, 7989226],
    reviews: [
      {
        author: "Priya N.",
        location: "Chicago, IL",
        rating: 5,
        title: "A full school day, no charger",
        body: "My daughter leaves at 7:30 and gets home at 18:00 and still has 30% left. That alone was worth it. It's also light enough that she actually carries it.",
        helpfulCount: 176,
        daysAgo: 8,
      },
      {
        author: "Jonah R.",
        location: "Portland, OR",
        rating: 5,
        title: "Silent and quick",
        body: "Compiles fast, never gets hot on my lap, and the screen is gorgeous for photo editing. The keyboard is the best I've typed on under fifteen hundred.",
        helpfulCount: 91,
        daysAgo: 24,
      },
      {
        author: "Marcus L.",
        location: "Brooklyn, NY",
        rating: 4,
        title: "Wish it had more ports",
        body: "Two USB-C is tight if you use a mouse and an external drive. Everything else is exactly right.",
        helpfulCount: 37,
        daysAgo: 55,
      },
    ],
  },
  {
    slug: "book-flex",
    name: "Loyal Book Flex",
    tagline: "2-in-1 convertible with pen support",
    description:
      "A 360-degree hinge and a 13.3-inch touchscreen with an included pressure-sensitive pen. Sketch, annotate and present. Gorilla Glass and a spill-resistant keyboard make it a safe first laptop.",
    category: "compute",
    audience: "youth",
    priceCents: 74900,
    colors: ["Slate Blue", "Silver"],
    highlights: [
      "360° hinge for laptop, tent, stand and tablet modes",
      "Included 4096-level pressure pen, magnetic dock",
      "Spill-resistant keyboard, rated 330 ml",
      "14-hour battery and 65W fast charge",
    ],
    specs: spec([
      ["Display", "13.3\" 1920 × 1200 touch"],
      ["Memory", "16 GB"],
      ["Storage", "512 GB NVMe"],
      ["Pen", "4096 levels, included"],
      ["Warranty", "3 years"],
    ]),
    gallery: [7792775, 8534244, 7241341],
  },
  {
    slug: "slate-11",
    name: "Loyal Slate 11",
    tagline: "11-inch tablet with a laminated 120Hz screen",
    description:
      "A laminated, anti-reflective 11-inch display that makes comics and textbooks look printed. Split-screen notes, a magnetic keyboard cover and 12 hours of battery. The family profile system hands each kid their own shelf.",
    category: "compute",
    audience: "everyone",
    priceCents: 42900,
    compareAtCents: 49900,
    stock: 40,
    colors: ["Graphite", "Sage"],
    highlights: [
      "11\" 120Hz laminated display, anti-reflective",
      "Up to six family profiles with age bands",
      "Magnetic keyboard cover and pen support",
      "12-hour battery, 45W USB-C charge",
    ],
    specs: spec([
      ["Display", "11\" 2560 × 1600, 120 Hz"],
      ["Storage", "128 GB + microSD"],
      ["Battery", "12 hours video"],
      ["Audio", "Quad speakers"],
      ["Warranty", "2 years"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [3184451, 16564512, 8534244, 7241341],
    reviews: [
      {
        author: "Chanté M.",
        location: "Atlanta, GA",
        rating: 5,
        title: "Six profiles, no more fighting",
        body: "Each kid has their own apps and their own time limit and nobody can unlock anybody else's. Homework mode locks the fun apps until reading is done.",
        helpfulCount: 143,
        daysAgo: 13,
      },
      {
        author: "Ravi P.",
        location: "Toronto, ON",
        rating: 5,
        title: "Screen is the star",
        body: "Reading on this is closer to paper than any tablet I've used. Reflections are almost non-existent under kitchen lights.",
        helpfulCount: 66,
        daysAgo: 41,
      },
    ],
  },
  {
    slug: "slate-kids",
    name: "Loyal Slate Kids",
    tagline: "Ruggedised tablet with a bounce case",
    description:
      "A colourfully cased tablet that meets the reality of childhood: a silicone bumper, a pop-out stand and a screen rated for wooden-floor drops. Two years of age-banded content curated by educators, and a parent dashboard that takes thirty seconds a week.",
    category: "compute",
    audience: "family",
    priceCents: 19900,
    badge: "Family Favourite",
    colors: ["Sunshine", "Berry", "Sea"],
    highlights: [
      "Drop-tested to 1.5 m with the bumper on",
      "2 years of curated, ad-free kids content",
      "Handy pop-out stand for car seats and tables",
      "Daily time budget with a gentle wind-down",
    ],
    specs: spec([
      ["Display", "8\" 1280 × 800"],
      ["Storage", "64 GB + microSD"],
      ["Battery", "13 hours"],
      ["Case", "Food-grade silicone bumper"],
      ["Warranty", "3 years, drops included"],
    ]),
    featured: true,
    gallery: [8790322, 4473790, 8790300, 8188700],
    reviews: [
      {
        author: "Sofia D.",
        location: "Portland, OR",
        rating: 5,
        title: "Has survived two toddlers",
        body: "Thrown from a bunk bed, stood on, and covered in banana. Still perfect. The wind-down routine before bedtime is genuinely lovely.",
        helpfulCount: 187,
        daysAgo: 4,
      },
      {
        author: "Diego F.",
        location: "Montreal, QC",
        rating: 4,
        title: "Great, storage fills fast",
        body: "Add a microSD card on day one — offline downloads eat the 64GB quickly. Everything else is exactly what we wanted.",
        helpfulCount: 52,
        daysAgo: 36,
      },
    ],
  },
  {
    slug: "type-87",
    name: "Loyal Type 87",
    tagline: "Hot-swappable mechanical keyboard",
    description:
      "Gasket-mounted, five layers of damping and a south-facing RGB array that glows rather than shouts. Hot-swap sockets mean you can change the feel of the board without a soldering iron. Wired or 2.4GHz for tournament-grade latency.",
    category: "compute",
    audience: "youth",
    priceCents: 13900,
    colors: ["Black", "Cream", "Navy"],
    highlights: [
      "Gasket mount with five damping layers",
      "Hot-swappable switches, no soldering",
      "Wired or 2.4 GHz wireless, 1000 Hz polling",
      "Double-shot PBT keycaps that never shine",
    ],
    specs: spec([
      ["Layout", "87-key tenkeyless"],
      ["Switches", "Loyal Tactile Brown (hot-swap)"],
      ["Connection", "USB-C / 2.4 GHz"],
      ["Battery", "80 hours, RGB off"],
      ["Warranty", "2 years"],
    ]),
    gallery: [7915219, 249203, 9128853],
  },
  {
    slug: "glide-mouse",
    name: "Loyal Glide",
    tagline: "Silent-click wireless mouse",
    description:
      "Clicks rated at 22dB — quiet enough for a shared study or a late-night library. A 4000 DPI sensor, six programmable buttons and a magnetic scroll wheel that switches between ratchet and free-spin.",
    category: "compute",
    audience: "everyone",
    priceCents: 6900,
    colors: ["Graphite", "Pale Grey"],
    highlights: [
      "22 dB silent clicks",
      "Magnetic scroll: ratchet or free-spin",
      "70-day battery on a single AA",
      "Works on glass and fabric",
    ],
    specs: spec([
      ["Sensor", "4000 DPI optical"],
      ["Buttons", "6, programmable"],
      ["Battery", "70 days (AA)"],
      ["Connection", "2.4 GHz + Bluetooth"],
      ["Warranty", "2 years"],
    ]),
    gallery: [9128853, 7241341, 3184451],
  },
  {
    slug: "arc-27",
    name: "Loyal Arc 27",
    tagline: "27-inch 1440p monitor with a USB-C dock",
    description:
      "A 27-inch 1440p IPS panel with 95% DCI-P3 and a single-cable USB-C dock that charges your laptop at 90W. The stand adjusts for height, tilt, swivel and pivot, and the matte finish kills reflections from a window behind you.",
    category: "compute",
    audience: "youth",
    priceCents: 37900,
    compareAtCents: 42900,
    colors: ["Graphite"],
    highlights: [
      "27\" 2560 × 1440 IPS, 165 Hz",
      "90 W USB-C power delivery, single cable",
      "Full ergonomic stand, VESA mountable",
      "Low-blue-light mode with flicker-free dimming",
    ],
    specs: spec([
      ["Panel", "27\" IPS 2560 × 1440"],
      ["Refresh", "165 Hz"],
      ["Colour", "95% DCI-P3"],
      ["Ports", "USB-C 90W, 2 × HDMI, DP"],
      ["Warranty", "3 years, zero bright dots"],
    ]),
    gallery: [9794458, 7858742, 7989226],
  },
  {
    slug: "reader-glow-7",
    name: "Loyal Reader Glow 7",
    tagline: "7-inch warm-light e-reader",
    description:
      "A 300ppi glare-free display with adjustable warm light that shifts to amber after sunset. Waterproof for the bath and the beach, and a battery measured in weeks rather than hours.",
    category: "compute",
    audience: "family",
    priceCents: 18900,
    isNewArrival: true,
    colors: ["Charcoal", "Champagne"],
    highlights: [
      "300 ppi glare-free E-Ink display",
      "Adjustable warm light with sunset schedule",
      "IPX8 waterproof for bath and beach reading",
      "Six-week battery, page-turn buttons",
    ],
    specs: spec([
      ["Display", "7\" 1680 × 1264, 300 ppi"],
      ["Storage", "32 GB"],
      ["Water rating", "IPX8"],
      ["Battery", "Up to 6 weeks"],
      ["Warranty", "2 years"],
    ]),
    gallery: [8534244, 4087400, 3184451],
  },
  {
    slug: "track-watch-3",
    name: "Loyal Track Watch 3",
    tagline: "Smartwatch with a 9-day battery",
    description:
      "A 1.4-inch AMOLED with always-on display, dual-band GPS and a nine-day battery so you stop hunting for a charger. Sleep, stress and recovery scoring, 130 sport profiles and offline music for phone-free runs.",
    category: "wearables",
    audience: "youth",
    priceCents: 22900,
    compareAtCents: 27900,
    stock: 31,
    colors: ["Black", "Ivory", "Storm Blue"],
    highlights: [
      "1.4\" AMOLED always-on, 2000 nits",
      "9-day battery, 30 hours with full GPS",
      "Dual-band GPS accurate between towers",
      "Swappable 22mm straps, five in the box options",
    ],
    specs: spec([
      ["Display", "1.4\" AMOLED"],
      ["Battery", "9 days typical"],
      ["GPS", "Dual-band, 5 systems"],
      ["Water rating", "10 ATM"],
      ["Warranty", "2 years"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [3184451, 3756907, 3756945, 16564512],
    reviews: [
      {
        author: "Amara O.",
        location: "Austin, TX",
        rating: 5,
        title: "Charged it once this fortnight",
        body: "Came off a smartwatch that died daily. Nine days is real — I've had 60% left after a week with three runs tracked. Sleep score matched how I actually felt.",
        helpfulCount: 164,
        daysAgo: 6,
      },
      {
        author: "Nina K.",
        location: "Toronto, ON",
        rating: 4,
        title: "Superb tracker, basic notifications",
        body: "Tracking and battery are best in class. Reply options are limited, but I bought it to be less glued to my phone, so that's fine.",
        helpfulCount: 58,
        daysAgo: 27,
      },
    ],
  },
  {
    slug: "track-band-youth",
    name: "Loyal Track Band",
    tagline: "Slim fitness band with step challenges",
    description:
      "A featherweight band with a 1.1-inch AMOLED and a 14-day battery. Friendly step challenges between friends, silent alarms for school mornings and a removable band that survives the washing machine.",
    category: "wearables",
    audience: "youth",
    priceCents: 8900,
    colors: ["Black", "Coral", "Mint", "Violet"],
    highlights: [
      "14-day battery on a 60-minute charge",
      "Friend step challenges and streaks",
      "Silent vibrating morning alarms",
      "Washable, swappable bands",
    ],
    specs: spec([
      ["Display", "1.1\" AMOLED"],
      ["Battery", "14 days"],
      ["Water rating", "5 ATM"],
      ["Weight", "21 g"],
      ["Warranty", "1 year"],
    ]),
    gallery: [3184451, 3756985, 3756907],
  },
  {
    slug: "tag-junior",
    name: "Loyal Tag Junior",
    tagline: "GPS watch for kids with safe zones",
    description:
      "Real-time location with geofenced safe zones — school, home, gran's house — and an alert the moment a boundary is crossed. A two-button call list restricted to numbers you approve, plus a school mode that mutes everything but the clock.",
    category: "wearables",
    audience: "family",
    priceCents: 11900,
    badge: "Peace of Mind",
    colors: ["Blue", "Pink", "Green"],
    highlights: [
      "Live location with 5-metre urban accuracy",
      "Geofenced safe-zone entry and exit alerts",
      "Approved-contacts-only calling",
      "School Mode silences everything but time",
    ],
    specs: spec([
      ["Display", "1.3\" touch"],
      ["Battery", "3 days typical"],
      ["Location", "GPS + WiFi + cell"],
      ["Calling", "10 approved numbers"],
      ["Warranty", "2 years"],
    ]),
    gallery: [8790300, 4473790, 8188720],
  },
  {
    slug: "eye-cam-x",
    name: "Loyal Eye Cam X",
    tagline: "26MP mirrorless with in-body stabilisation",
    description:
      "A 26MP APS-C sensor with 7 stops of in-body stabilisation and 4K60 from a full-width read. Eye-AF that tracks through a crowd, film simulation profiles straight out of camera, and a fully articulating screen for self-shot video.",
    category: "create",
    audience: "youth",
    priceCents: 89900,
    compareAtCents: 99900,
    stock: 17,
    colors: ["Black", "Silver"],
    highlights: [
      "26MP APS-C with 7-stop IBIS",
      "4K60 oversampled from a 6K read",
      "Subject-detection AF on people, animals and vehicles",
      "Fully articulating touchscreen",
    ],
    specs: spec([
      ["Sensor", "26 MP APS-C BSI"],
      ["Video", "4K60 10-bit"],
      ["Stabilisation", "7 stops IBIS"],
      ["Burst", "15 fps mechanical"],
      ["Warranty", "3 years"],
    ]),
    featured: true,
    bestseller: true,
    gallery: [4161786, 8981846, 821652, 30314731],
    reviews: [
      {
        author: "Jonah R.",
        location: "Portland, OR",
        rating: 5,
        title: "My first proper camera",
        body: "Shot a friend's gig in a dark venue handheld and it came out clean. The film simulations mean I barely edit anymore.",
        helpfulCount: 121,
        daysAgo: 10,
      },
      {
        author: "Hannah S.",
        location: "Phoenix, AZ",
        rating: 5,
        title: "Family photos, finally in focus",
        body: "Two kids who never sit still and the eye-AF just locks on. The flip screen means I'm actually in some pictures for once.",
        helpfulCount: 97,
        daysAgo: 29,
      },
      {
        author: "Elias W.",
        location: "Seattle, WA",
        rating: 4,
        title: "Buy a second battery",
        body: "Lovely image quality and ergonomics. Battery lasts about 400 shots, so budget for a spare on shoot days.",
        helpfulCount: 34,
        daysAgo: 64,
      },
    ],
  },
  {
    slug: "sky-rider",
    name: "Loyal Sky Rider",
    tagline: "4K gimbal drone with 34-minute flights",
    description:
      "A folding drone with a 1/1.3-inch sensor, three-axis gimbal and obstacle sensing in every direction. ActiveTrack follows a subject through trees, and 34 minutes of flight means you get the shot instead of rushing it.",
    category: "create",
    audience: "youth",
    priceCents: 54900,
    badge: "New Season",
    colors: ["Grey"],
    highlights: [
      "4K60 HDR with a 1/1.3-inch sensor",
      "34-minute flight time per battery",
      "Omnidirectional obstacle sensing",
      "ActiveTrack that holds through obstacles",
    ],
    specs: spec([
      ["Sensor", "1/1.3\" CMOS"],
      ["Video", "4K60 HDR"],
      ["Flight time", "34 minutes"],
      ["Range", "12 km transmission"],
      ["Weight", "249 g"],
    ]),
    featured: true,
    isNewArrival: true,
    gallery: [4811648, 14030773, 30317794, 37489613],
    reviews: [
      {
        author: "Diego F.",
        location: "Montreal, QC",
        rating: 5,
        title: "Buttery footage, no jello",
        body: "Gimbal is rock solid in a decent breeze. Under 250g means no registration where I live, which was a big factor.",
        helpfulCount: 109,
        daysAgo: 12,
      },
      {
        author: "Marcus L.",
        location: "Brooklyn, NY",
        rating: 4,
        title: "Fantastic, learn the rules",
        body: "Flies beautifully and the tracking is uncanny. Just check local airspace rules before your first flight — the app will stop you.",
        helpfulCount: 48,
        daysAgo: 44,
      },
    ],
  },
  {
    slug: "pixel-pocket",
    name: "Loyal Pixel Pocket",
    tagline: "Instant camera with a pocket print slot",
    description:
      "A palm-sized instant camera that prints credit-card photos in twelve seconds, with a small mirror for selfies and a macro slider for close-ups of lunch, pets and friends. Prints are cheap enough to hand out.",
    category: "create",
    audience: "everyone",
    priceCents: 12900,
    colors: ["Cream", "Mint", "Black"],
    highlights: [
      "Prints in 12 seconds with instant dry film",
      "Selfie mirror and macro slider",
      "Double-exposure and bulb modes",
      "Prints cost less than a coffee each",
    ],
    specs: spec([
      ["Lens", "32 mm equivalent, f/2.8"],
      ["Print", "Credit-card size, 12 s"],
      ["Modes", "Double exposure, bulb, macro"],
      ["Battery", "100 prints per charge"],
      ["Warranty", "1 year"],
    ]),
    gallery: [1203819, 1203816, 821651, 1983035],
  },
  {
    slug: "arena-controller-pro",
    name: "Loyal Arena Controller Pro",
    tagline: "Hall-effect controller with swappable sticks",
    description:
      "Hall-effect sticks and triggers that will never develop drift, plus swappable stick caps and a removable back paddle set. 1000Hz wireless polling, onboard profiles and a 3.5mm jack that works with any headset.",
    category: "play",
    audience: "youth",
    priceCents: 7900,
    colors: ["Black", "White", "Neon Lime"],
    highlights: [
      "Hall-effect sticks — immune to drift",
      "Swappable sticks, caps and D-pad",
      "Two removable back paddles",
      "1000 Hz wireless, 30-hour battery",
    ],
    specs: spec([
      ["Sticks", "Hall effect TMR"],
      ["Polling", "1000 Hz wireless"],
      ["Battery", "30 hours"],
      ["Compat", "PC, Android, Switch"],
      ["Warranty", "2 years"],
    ]),
    gallery: [7915219, 9072216, 9794458],
  },
  {
    slug: "arena-headset",
    name: "Loyal Arena Headset",
    tagline: "7.1 gaming headset with a detachable mic",
    description:
      "50mm drivers with a tuned low end you can feel, and a broadcast-grade detachable mic with real-time noise gating so teammates hear you and not your household. Memory foam that stays comfortable through an all-nighter.",
    category: "play",
    audience: "youth",
    priceCents: 11900,
    compareAtCents: 13900,
    colors: ["Black", "White"],
    highlights: [
      "50 mm drivers with a tuned sub-bass shelf",
      "Detachable cardioid mic with noise gating",
      "Simultaneous wireless and USB-C wired",
      "40-hour battery with RGB off",
    ],
    specs: spec([
      ["Driver", "50 mm neodymium"],
      ["Mic", "Detachable cardioid"],
      ["Battery", "40 hours"],
      ["Weight", "310 g"],
      ["Warranty", "2 years"],
    ]),
    gallery: [9794458, 7858742, 9128853, 9072216],
  },
];

export const REVIEW_POOL: Record<
  string,
  { title: string; body: string; rating: number }[]
> = {
  audio: [
    {
      title: "Sound way above the price",
      body: "I compared these side by side with a pair costing twice as much and honestly preferred the Loyal tuning. Vocals sit forward without any harshness.",
      rating: 5,
    },
    {
      title: "Battery life is the real story",
      body: "I charge them once a week and that's with a daily commute and gym sessions. The fast charge has saved me more than once.",
      rating: 5,
    },
    {
      title: "Comfortable for long stretches",
      body: "Wore them for a five-hour study session with no hot spots. The clamping force is gentle but they stay put on a run.",
      rating: 4,
    },
    {
      title: "Great gift for a teenager",
      body: "Bought this for my niece's birthday and she has not taken it off since. Packaging felt premium enough to hand over unwrapped.",
      rating: 5,
    },
    {
      title: "Solid, app could be simpler",
      body: "Hardware is excellent but the companion app buries the EQ three menus deep. Once it's set, though, I never open it again.",
      rating: 4,
    },
    {
      title: "Held up to a school bag",
      body: "Three months of being shoved next to textbooks and water bottles and there's barely a scuff. That alone earns the fifth star.",
      rating: 5,
    },
  ],
  vision: [
    {
      title: "Setup took ten minutes",
      body: "Unboxed, on the wall, calibrated and streaming before dinner. The guided setup actually explains what each setting does.",
      rating: 5,
    },
    {
      title: "Family controls that work",
      body: "Bedtime schedule turns it off automatically and my seven-year-old hasn't figured out a workaround in two months. Believe me, he's tried.",
      rating: 5,
    },
    {
      title: "Picture quality punches up",
      body: "Colours are accurate without looking oversaturated, and motion handling on sport is clean. Looks far more expensive than it was.",
      rating: 5,
    },
    {
      title: "Worth it for movie nights",
      body: "We've gone from two films a month to every Friday. The kids now argue over what to watch rather than over screen time.",
      rating: 4,
    },
    {
      title: "Beautiful, mind the cables",
      body: "Gorgeous display but plan your cable routing before you mount. I'd buy a right-angled adapter with it.",
      rating: 4,
    },
  ],
  compute: [
    {
      title: "Fast enough for everything",
      body: "Browns 40 tabs, a design app and a call without the fans spinning up. Boots in six seconds and wakes instantly.",
      rating: 5,
    },
    {
      title: "Perfect school machine",
      body: "Light, quick, all-day battery and it survives being dropped into a bag next to a water bottle. Homework happens without negotiations now.",
      rating: 5,
    },
    {
      title: "Screen is genuinely lovely",
      body: "Text is crisp at 100% scaling and there's no PWM flicker, which matters if you're on it all day. Anti-glare finish works well.",
      rating: 5,
    },
    {
      title: "Great value, upgrade later",
      body: "Started with the base configuration and added storage six months in. No regrets — it's the same chassis.",
      rating: 4,
    },
    {
      title: "Quiet and cool",
      body: "Silent under normal load and barely warm on my lap. Battery gauge is honest, which is rare.",
      rating: 4,
    },
  ],
  wearables: [
    {
      title: "Accurate against the big brands",
      body: "I wore it opposite a friend's much pricier watch on a 10k and the splits were within a second of each other all the way.",
      rating: 5,
    },
    {
      title: "Finally a battery that lasts",
      body: "Charging once a week instead of every night changed how I use it. Sleep tracking is now continuous rather than occasional.",
      rating: 5,
    },
    {
      title: "Kids love the challenges",
      body: "The step challenges turned walking to school into a competition. Stripes and badges are surprisingly motivating.",
      rating: 5,
    },
    {
      title: "Straps make it personal",
      body: "Bought three bands so it matches whatever she's wearing. Swaps take five seconds with no tools.",
      rating: 4,
    },
    {
      title: "Great, but read the app first",
      body: "There are a lot of settings. Taking fifteen minutes to turn off the notifications I didn't want made it much better.",
      rating: 4,
    },
  ],
  create: [
    {
      title: "Straight out of camera",
      body: "The colour profiles mean I post without editing most days. Skin tones look like people I actually know.",
      rating: 5,
    },
    {
      title: "Beginner friendly, expert capable",
      body: "Auto mode gets it right for my kids and full manual is there when I want it. The guided tooltips taught me more than a YouTube course.",
      rating: 5,
    },
    {
      title: "Feels like a real tool",
      body: "Dials have the right resistance and the body is sealed properly. Shot in light rain with zero anxiety.",
      rating: 5,
    },
    {
      title: "Superb, budget accessories",
      body: "The kit is excellent. I added a spare battery and a fast card and that made all the difference on a shoot day.",
      rating: 4,
    },
  ],
  play: [
    {
      title: "Zero lag, zero drift",
      body: "Two months of ranked play and the sticks are still dead centre. Hall effect should be mandatory at this point.",
      rating: 5,
    },
    {
      title: "Survived the sibling test",
      body: "Two brothers, one controller, a full summer. Still flawless. The replaceable parts mean I'm not buying a whole new one.",
      rating: 5,
    },
    {
      title: "Mic quality surprised me",
      body: "Friends stopped asking me to repeat myself the moment I switched. Background noise from the kitchen is gone entirely.",
      rating: 5,
    },
    {
      title: "Comfortable for long sessions",
      body: "No pressure on the temples after three hours, and the earcups don't get sweaty. Fits over glasses comfortably too.",
      rating: 4,
    },
    {
      title: "Great gear, check your desk size",
      body: "Works flawlessly. Just measure your setup before ordering so you know where it's going to live.",
      rating: 4,
    },
  ],
};

export const REVIEWER_POOL = [
  "Amara O.",
  "Jonah R.",
  "Priya N.",
  "Marcus L.",
  "Sofia D.",
  "Trevor B.",
  "Nina K.",
  "Elias W.",
  "Chanté M.",
  "Ravi P.",
  "Hannah S.",
  "Diego F.",
  "Lucia V.",
  "Owen T.",
];

export const LOCATION_POOL = [
  "Austin, TX",
  "Portland, OR",
  "Chicago, IL",
  "Toronto, ON",
  "Denver, CO",
  "Brooklyn, NY",
  "Phoenix, AZ",
  "Seattle, WA",
  "Atlanta, GA",
  "Montreal, QC",
  "Bristol, UK",
  "Dublin, IE",
];

export function hashString(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

export function buildGeneratedReviews(
  product: SeedProduct,
  count: number,
): SeedReview[] {
  const pool = REVIEW_POOL[product.category] ?? REVIEW_POOL.audio;
  const base = hashString(product.slug);
  const reviews: SeedReview[] = [];
  for (let i = 0; i < count; i += 1) {
    const pick = pool[(base + i * 3) % pool.length];
    reviews.push({
      author: REVIEWER_POOL[(base + i * 5) % REVIEWER_POOL.length],
      location: LOCATION_POOL[(base + i * 7) % LOCATION_POOL.length],
      rating: pick.rating,
      title: pick.title,
      body: pick.body,
      verified: true,
      helpfulCount: ((base + i * 11) % 47) + 3,
      daysAgo: 6 + ((base + i * 13) % 150),
    });
  }
  return reviews;
}

export function imageAlt(productName: string, index: number): string {
  return `${productName} — ${VIEW_LABELS[index % VIEW_LABELS.length]}`;
}
