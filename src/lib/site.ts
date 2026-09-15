export const SITE = {
  name: "The Grounds Guys of Davenport, FL",
  shortName: "The Grounds Guys",
  phone: "(321) 339-1627",
  phoneHref: "tel:+13213391627",
  email: "davenportfl.owner@groundsguys.com",
  license: "SCC 131152213",
  city: "Davenport",
  state: "FL",
  zip: "33837",
  hours: [
    { days: "Monday to Friday", time: "7:00 am to 5:00 pm" },
    { days: "Saturday", time: "7:00 am to 3:00 pm" },
    { days: "Sunday", time: "Closed" },
  ],
  url: "https://thegroundsguys.vercel.app",
  description:
    "Trusted lawn care and landscaping for Davenport, FL homes and businesses. Free estimates, upfront pricing and a 100% satisfaction guarantee from a locally owned Grounds Guys team.",
};

export const NAV = [
  { label: "Services", href: "#services" },
  { label: "Before & After", href: "#difference" },
  { label: "Reviews", href: "#reviews" },
  { label: "Service Area", href: "#service-area" },
  { label: "FAQ", href: "#faq" },
];

export type Stat =
  | { kind: "number"; value: number; suffix: string; decimals?: number; label: string }
  | { kind: "text"; text: string; label: string };

export const STATS: Stat[] = [
  { kind: "number", value: 45, suffix: "+", label: "Five-star reviews" },
  { kind: "number", value: 4.5, suffix: "/5", decimals: 1, label: "Average rating" },
  { kind: "text", text: "Locally", label: "Owned & operated" },
  { kind: "text", text: "Free", label: "Estimates on most services" },
];

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  items: string[];
  note?: string;
  image?: string;
};

export const SERVICES: Service[] = [
  {
    slug: "lawn-maintenance",
    title: "Lawn and Grounds Maintenance",
    short: "Weekly or bi-weekly care that keeps the whole property sharp.",
    description:
      "The steady, scheduled work that keeps a Davenport lawn looking cared for through every month of Florida heat and rain. Our crews mow, edge and tidy on a rhythm you choose, then step in with aeration, dethatching and top dressing when the turf needs to breathe. Storm and seasonal clean-ups are handled by the same team that already knows your property.",
    items: [
      "Mowing and edging",
      "Lawn aeration",
      "Dethatching",
      "Top dressing",
      "Drainage repair",
      "Seasonal clean-up",
      "Storm cleanup",
    ],
    image: "/service-mowing.jpg",
  },
  {
    slug: "landscape-design",
    title: "Landscape Design and Installation",
    short: "New beds, sod, stone and gravel, designed for how you live outside.",
    description:
      "From a fresh front bed to a full backyard rework, we design landscapes that suit Central Florida plants, soil and sun, then build them with our own crews. Hardscape paths and patios, new sod, gravel and planting are installed cleanly and on schedule, with a plan you have seen and approved before the first shovel goes in.",
    items: [
      "Landscape design",
      "Landscape installation",
      "Hardscape design",
      "Hardscape installation",
      "Sod installation",
      "Gravel installation",
    ],
    image: "/service-landscape-install.jpg",
  },
  {
    slug: "irrigation",
    title: "Irrigation",
    short: "Efficient watering, repaired and tuned by people who do it every day.",
    description:
      "Healthy turf in Davenport starts with water going exactly where it should. We convert beds to drip, install and maintain drip systems, and repair broken heads, valves and lines so your lawn stays even and your bill stays sensible.",
    note: "Irrigation repair requires a paid diagnostic fee and is not covered by the free estimate. We will confirm the fee with you before any work begins.",
    items: [
      "Drip irrigation conversion",
      "Drip irrigation installation",
      "Drip irrigation maintenance",
      "Irrigation repair (paid diagnostic fee)",
    ],
    image: "/service-irrigation.jpg",
  },
  {
    slug: "fertilization",
    title: "Fertilization, Weed and Pest Service",
    short: "Feed the turf, starve the weeds, keep pests off the property.",
    description:
      "A lawn program built around soil testing rather than guesswork. We feed the turf on a schedule matched to your grass type, treat weeds before they spread and keep lawn pests under control, so the green stays green.",
    items: ["Fertilization", "Weed control", "Pest control", "Soil testing"],
  },
  {
    slug: "flower-beds",
    title: "Flower and Garden Bed Maintenance",
    short: "Crisp edges, fresh mulch and beds that stay full and weed-free.",
    description:
      "Beds are where a property either looks loved or looks neglected. We redefine the edges, keep weeds out, maintain the plantings and lay fresh mulch so the beds frame the house the way they were meant to.",
    items: ["Flower bed edging", "Bed weed control", "Flower maintenance", "Mulch installation"],
  },
  {
    slug: "trees-shrubs",
    title: "Tree and Shrub Maintenance",
    short: "Pruning, feeding and protection for everything above the lawn.",
    description:
      "Trees and shrubs need their own care. We prune ornamentals for shape and health, fertilize on the right schedule, treat pests before they take hold, and handle trimming and removal safely when a tree has to go.",
    items: ["Ornamental pruning", "Tree and shrub fertilization", "Pest control", "Trimming and removal"],
  },
  {
    slug: "holiday-lighting",
    title: "Holiday Lighting Installation",
    short: "Installed, maintained and taken down again, without the ladder.",
    description:
      "We design, hang and remove holiday lighting so the season looks its best without you on a ladder. Everything is installed neatly, checked through the season and packed away when it is done.",
    items: ["Design and installation", "Seasonal maintenance", "Take-down and storage"],
  },
];

export const FEATURED_SERVICE_SLUGS = ["lawn-maintenance", "landscape-design", "irrigation"];

export const SERVICE_OPTIONS = [
  "Lawn and grounds maintenance",
  "Landscape design and installation",
  "Fertilization, weed and pest service",
  "Flower and garden bed maintenance",
  "Tree and shrub maintenance",
  "Irrigation (repair requires a paid diagnostic fee)",
  "Holiday lighting installation",
  "Not sure yet",
];

export const CARES = [
  {
    letter: "C",
    word: "Comprehensive",
    text: "One team for the lawn, the beds, the trees and the irrigation, so nothing falls between contractors.",
  },
  {
    letter: "A",
    word: "Artistry",
    text: "Straight lines, clean edges and plantings chosen to suit the light and soil they are going into.",
  },
  {
    letter: "R",
    word: "Results",
    text: "A property that looks better every visit, not just on the day we leave.",
  },
  {
    letter: "E",
    word: "Experience",
    text: "Local crews backed by the training and standards of the national Grounds Guys network.",
  },
  {
    letter: "S",
    word: "Service",
    text: "Upfront pricing, convenient scheduling and a crew that turns up when it said it would.",
  },
];

export const GUARANTEE =
  "We offer free estimates on all of our services. Everything we do is backed by upfront pricing. Our services are backed by convenient scheduling and prompt arrival. All our landscaping services come with a 100% customer satisfaction guarantee.";

export const TESTIMONIALS = [
  {
    name: "Ron D.",
    stars: 5,
    text: "The Ground Guys have done a good job taking care of my lawn. I have the bi weekly cut option and it's just right for my lawn. Mike and the team are always responsive to my needs.",
  },
  {
    name: "Blanca J.",
    stars: 5,
    text: "Wonderful service!! Ground Guys helped our grass and trees look beautiful again! 100% recommend!!",
  },
  {
    name: "Mackey A.",
    stars: 5,
    text: "Mike Bruno performed my irrigation system repair in a professional and satisfactory manner. I have no complaints.",
  },
  {
    name: "Samuel B.",
    stars: 5,
    text: "They did a great job they showed up when we needed them too. Got the trimming and mulch changed out our flowers regularly mow and take care of our yard.",
  },
  {
    name: "Thomas",
    stars: 5,
    text: "Removed bad sod replaced with good sod results are great. Guy's know what they're doing. Honest and professional.",
  },
  {
    name: "Ursula R.",
    stars: 5,
    text: "Mike and crew are great to work with. Very professional, friendly and trustworthy.",
  },
];

export type Town = {
  name: string;
  lat: number;
  lng: number;
  zips: string[];
};

export const TOWNS: Town[] = [
  { name: "Davenport", lat: 28.1614, lng: -81.6017, zips: ["33837", "33836", "33896", "33897"] },
  { name: "Intercession City", lat: 28.2653, lng: -81.509, zips: ["34742"] },
  { name: "Kissimmee", lat: 28.2919, lng: -81.4076, zips: ["34741", "34743", "34744", "34745", "34746", "34747", "34758"] },
  { name: "Loughman", lat: 28.24, lng: -81.564, zips: ["33858"] },
];

/** The service boundary, drawn generously around the four towns. [lat, lng]. */
export const SERVICE_POLYGON: [number, number][] = [
  [28.06, -81.72],
  [28.13, -81.74],
  [28.24, -81.7],
  [28.33, -81.62],
  [28.38, -81.5],
  [28.37, -81.36],
  [28.3, -81.3],
  [28.2, -81.3],
  [28.1, -81.38],
  [28.05, -81.5],
  [28.03, -81.62],
];

export const FAQS = [
  {
    q: "What are the benefits of professional lawn care in Davenport, FL?",
    a: [
      "Top-quality landscaping and lawn care make your outdoor spaces more inviting. You and your family will enjoy grilling on the patio, gardening and relaxing in attractive, comfortable surroundings.",
      "Professional care also saves time, money and effort. Our crews know Central Florida turf, soil and weather, so the costly mistakes that come with trial and error never happen on your property.",
    ],
  },
  {
    q: "How can The Grounds Guys help with gardening services?",
    a: [
      "Our gardening work covers soil amendments, weed elimination, sod repair, flower bed rehabilitation, shrub and tree trimming, and crisp edge definition between plantings and hardscape.",
      "Whether a single bed needs rescuing or the whole garden needs a plan, the same local team handles the design, the planting and the upkeep.",
    ],
  },
  {
    q: "What services do The Grounds Guys offer?",
    list: [
      "Lawn care, mowing and edging",
      "Flowerbed planting and maintenance",
      "Landscaping and hardscaping",
      "Groundskeeping and seasonal clean-up",
      "Irrigation (repair requires a paid diagnostic fee)",
      "Drainage and aeration",
      "Tree and shrub work",
      "Pest control and weed control",
      "Turf maintenance and fertilization",
      "Holiday lighting installation",
    ],
  },
  {
    q: "Do you offer seasonal services?",
    a: [
      "Yes. Through the year we provide spring clean-up, fall clean-up, gutter cleaning, mulching, seasonal color, pruning, turf maintenance and irrigation repair.",
      "Irrigation repair is the one service that carries a paid diagnostic fee rather than a free estimate, and we will always confirm that fee with you first.",
    ],
  },
  {
    q: "Why is regular landscaping in Davenport, FL important?",
    a: [
      "Regular landscaping increases property value, lifts curb appeal and shows pride in your home or business. It also keeps outdoor spaces healthier and safer.",
      "Consistent care controls weeds and pests before they spread, which is far cheaper than repairing a lawn or beds that have been left too long.",
    ],
  },
];
