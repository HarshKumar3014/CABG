/* ---------------------------------------------------------------
   Single source of truth for copy and data.
   Officers edit this file; nothing else needs to change.
   --------------------------------------------------------------- */

export const site = {
  name: "Columbia Applied Builders Guild",
  short: "CABG",
  mark: "🥬",
  school: "Columbia University",
  thesis: "Build it. Ship it.",
  pitch:
    "A hands-on, interdisciplinary community where Columbia graduate students learn AI by building real projects together.",
  goal:
    "Make advanced AI practical, collaborative, and accessible to students from technical and non-technical backgrounds alike.",
  location: "New York, NY",
  domain: "https://example.org", // TODO: real domain
  status: "Seeking recognition from the Engineering Graduate Student Council.",
  socials: [
    // TODO: real handles; delete any the club does not run
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "GitHub", href: "#" },
  ],
} as const;

export const nav = [
  { label: "Projects", href: "/projects" },
  { label: "Program", href: "/program" },
  { label: "Events", href: "/events" },
  { label: "People", href: "/people" },
  { label: "About", href: "/about" },
] as const;

/* ---------------------------------------------------------------
   Shipping. The guild is judged by what reaches a real person, so
   this is the part of the site that has to be true.
   --------------------------------------------------------------- */
export type Project = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  url: string;
  host: string;
  cover: string;
  stack: string[];
  features: string[];
  builtBy: string[];
  shipped: string;
};

export const projects: Project[] = [
  {
    slug: "pit-wall",
    name: "Pit Wall",
    tagline: "A Formula 1 dashboard that is actually live.",
    summary:
      "Championship standings, a paddock news feed that refreshes every fifteen minutes, telemetry, live sessions, circuits and records — with a countdown to the next session on the front page.",
    url: "https://formula1-dash-board.vercel.app/",
    host: "formula1-dash-board.vercel.app",
    cover: "/projects/pit-wall.jpg",
    stack: ["Next.js", "Vercel", "Live data feeds"], // TODO: confirm stack
    features: [
      "Driver and constructor standings",
      "News feed on a 15-minute refresh",
      "Telemetry and live sessions",
      "Circuits and records",
    ],
    builtBy: ["Harsh Kumar"],
    shipped: "2026",
  },
];

/* What the hero terminal deploys. Deliberately nobody's project in
   particular — the reader's, if anyone's. The URL is a placeholder and
   is shown as one, never linked. */
export const heroDeploy = {
  slug: "your-idea",
  host: "your-idea.vercel.app",
} as const;

/* The path every project takes. Shown as a band, not a diagram. */
export const shipPath = ["Idea", "Prototype", "Deployed", "In someone's hands"];

/* Rules the guild ships by — lifted from the Build. Ship. Demo. deck. */
export const shipRules: { rule: string; why: string }[] = [
  {
    rule: "Deploy before it is done.",
    why: "Your laptop has the passwords and the files. The live site might not. Find out on day one, not at the demo.",
  },
  {
    rule: "A link beats a screenshot.",
    why: "People can open a link on their own phone and tell you what is broken. Nobody can do that with a PNG.",
  },
  {
    rule: "Demo it live, failures included.",
    why: "Five minutes, the real thing, in front of a room. A rehearsed recovery is worth more than a perfect slide.",
  },
  {
    rule: "The repo is the memory.",
    why: "Models do not share one. Whatever the next person needs to know goes in the repository, not in a chat.",
  },
];

/* A git-log of the guild. Oldest at the bottom, like the real thing. */
export type LogEntry = {
  hash: string;
  kind: "feat" | "ship" | "event";
  message: string;
  detail: string;
  when: string;
  href?: string;
};

export const shipLog: LogEntry[] = [
  {
    hash: "d1v4c26",
    kind: "event",
    message: "Ran Build. Ship. Demo. at DivHacks",
    detail: "Three-part hackathon workshop: pick a stack, deploy early, rehearse a sixty-second demo.",
    when: "Sep 26, 2026",
    href: "/workshop",
  },
  {
    hash: "5h33pm0",
    kind: "feat",
    message: "Initial commit: Sheep Meadow meetup",
    detail: "Incoming international master's students, a patch of grass in Central Park, no agenda.",
    when: "Aug 25, 2026",
  },
];

/* Stated in the hero, before anything is explained. Not a sequence,
   so it is never numbered. */
export const promises: { title: string; body: string }[] = [
  {
    title: "Every school",
    body: "Engineering and journalism and public health, on the same team.",
  },
  {
    title: "No prerequisite",
    body: "Guided labs assume you have never trained a model.",
  },
  {
    title: "Hands on keyboard",
    body: "Sessions end at something that runs, not a slide deck.",
  },
];

/* ---------------------------------------------------------------
   Who turns up. The club's whole argument is that these people are
   better off in one room than in twelve.
   --------------------------------------------------------------- */
export const disciplines: string[] = [
  "Engineering",
  "Journalism",
  "Business",
  "Public Health",
  "Law",
  "Architecture",
  "Social Work",
  "International Affairs",
  "Arts",
  "Education",
  "Data Science",
  "Medicine",
];

/* ---------------------------------------------------------------
   Entry points. The mission promises the club is reachable from a
   non-technical start, so the site has to prove it rather than say it.
   --------------------------------------------------------------- */
export type Level = {
  id: string;
  label: string;
  self: string;
  start: string;
  first: string;
  formats: string[];
};

export const levels: Level[] = [
  {
    id: "none",
    label: "Never written code",
    self: "I have never written a line of code.",
    start: "Start at a guided lab.",
    first:
      "You are handed a prepared notebook and sit with people working through the same cells. You leave with something that runs and an idea of why it ran.",
    formats: ["Guided labs", "Speaker events"],
  },
  {
    id: "some",
    label: "Code, but not AI",
    self: "I can program, but I have never trained or shipped a model.",
    start: "Start at a technical workshop.",
    first:
      "Ninety minutes, one topic, hands on keyboard. Retrieval, evaluation, fine-tuning, agents. You leave with a working pipeline you wrote yourself.",
    formats: ["Technical workshops", "Guided labs", "Hackathons"],
  },
  {
    id: "build",
    label: "Already building",
    self: "I build with these tools already.",
    start: "Bring a workshop, or a team.",
    first:
      "The fastest way in is to teach the thing you most recently figured out. Otherwise find three people from other departments and enter a hackathon.",
    formats: ["Hackathons", "Demo days", "Technical workshops"],
  },
  {
    id: "research",
    label: "Doing research",
    self: "I read the papers and I have my own opinions about them.",
    start: "Start at a paper discussion.",
    first:
      "One recent paper, one member presenting, everyone else pushing back. It is also the fastest way to find a collaborator who knows a domain you do not.",
    formats: ["Paper discussions", "Demo days", "Speaker events"],
  },
];

/* What a member gets. Straight from the case for recognition. */
export const benefits: string[] = [
  "Practical technical expertise, built by doing rather than watching",
  "Project and hackathon teammates from outside your department",
  "Portfolio-ready work you can point at in an interview",
  "A route into research and entrepreneurial ideas worth chasing",
  "The chance to lead a workshop, run an event, or mentor someone newer",
];

/* ---------------------------------------------------------------
   Recurring formats. Cadences are TODO until the term plan is set.
   --------------------------------------------------------------- */
export type Format = {
  name: string;
  cadence: string;
  forWho: string;
  body: string;
};

export const formats: Format[] = [
  {
    name: "Technical workshops",
    cadence: "Weekly",
    forWho: "Anyone who can program",
    body: "One topic, ninety minutes, hands on keyboard. Led by members who just learned the thing, which keeps the explanations honest.",
  },
  {
    name: "Guided labs",
    cadence: "Monthly",
    forWho: "First time with the stack",
    body: "A prepared notebook and a room of people working through it together. Assumes nothing.",
  },
  {
    name: "Paper discussions",
    cadence: "Biweekly",
    forWho: "Anyone who reads it",
    body: "One recent paper, one member presenting, everyone else pushing back. Reading is expected; agreement is not.",
  },
  {
    name: "Demo days",
    cadence: "End of term",
    forWho: "Project teams",
    body: "Every team shows what runs. Five minutes, live, failures included.",
  },
  {
    name: "Speaker events",
    cadence: "Occasional",
    forWho: "Anyone",
    body: "Researchers and practitioners on work in progress rather than finished results.",
  },
  {
    name: "AI hackathons",
    cadence: "Once a term",
    forWho: "Mixed teams",
    body: "A weekend and a problem worth solving. Projects that survive the weekend become guild projects.",
  },
];

/* ---------------------------------------------------------------
   Workshops the guild has written and runs. Build. Ship. Demo. is
   one of these, not the club's identity.
   --------------------------------------------------------------- */
export type Stage = {
  id: string;
  index: string;
  name: string;
  claim: string;
  body: string;
  rules: string[];
};

export const workshop = {
  slug: "build-ship-demo",
  name: "Build. Ship. Demo.",
  for: "DivHacks 2026",
  summary:
    "The guild's hackathon workshop, in three parts. Teams leave having picked a stack, put something live, and rehearsed a sixty-second demo.",
} as const;

export const stages: Stage[] = [
  {
    id: "build",
    index: "01",
    name: "Build",
    claim: "One tool per job.",
    body: "Switching tools costs more than it teaches. Pick a stack, write prompts worth reusing, and find out where the tools stop before they stop on you.",
    rules: [
      "Plan, build, verify — a different agent for each, with a file handed between them",
      "The repo is the memory. Models do not share one",
      "One chat per task; long threads drift",
      "Point at a path instead of pasting eight hundred lines",
    ],
  },
  {
    id: "ship",
    index: "02",
    name: "Ship",
    claim: "Deploy before it is done.",
    body: "The first deployment should happen while the thing is still rough. Your laptop has the passwords and the files; the live site might not.",
    rules: [
      "A link beats a screenshot — people can open it on their own phone",
      "Catch a bug when it is one change old, not fifty",
      "Every deploy is a save point you can roll back to",
      "Test the live link, not the copy on your laptop",
    ],
  },
  {
    id: "demo",
    index: "03",
    name: "Demo",
    claim: "Sixty seconds, no architecture tour.",
    body: "Name the person and the moment, run the core action, make the proof visible, own the result. Nobody was ever convinced by a feature list.",
    rules: [
      "Describe the moment: who, and when",
      "Execute the solution: why this and not a chat window",
      "Make proof visible: something the room can verify",
      "Own the result: what changed, and what comes next",
    ],
  },
];

/* ---------------------------------------------------------------
   Events. Honest order: the meetup came first.
   --------------------------------------------------------------- */
export type EventItem = {
  slug: string;
  title: string;
  kind: string;
  when: string;
  date: string; // ISO, used for ordering
  place: string;
  blurb: string;
  detail?: string[];
  status: "past" | "upcoming";
};

export const events: EventItem[] = [
  {
    slug: "divhacks-2026",
    title: workshop.name,
    kind: "Workshop",
    when: "Sep 26, 2026",
    date: "2026-09-26",
    place: "DivHacks, Columbia University",
    blurb: workshop.summary,
    detail: stages.map((s) => `${s.name} — ${s.claim}`),
    status: "past",
  },
  {
    slug: "sheep-meadow-2026",
    title: "Sheep Meadow meetup",
    kind: "Meetup",
    when: "Aug 25, 2026",
    date: "2026-08-25",
    place: "Central Park, Sheep Meadow",
    blurb:
      "The first thing the guild ever did. Incoming international master's students, a patch of grass, and no agenda beyond meeting each other before term started.",
    status: "past",
  },
];

/* ---------------------------------------------------------------
   People.

   PRIVACY: names and roles only, and only with that person's
   permission. Never phone numbers. No photos except Harsh's — everyone
   else is shown by name and initials.
   --------------------------------------------------------------- */
export type Person = {
  id: string;
  name: string;
  role: string;
  program?: string;
  photo?: string;
  bio?: string;
  links?: { label: string; href: string }[];
  coffee?: string;
  founder?: boolean;
};

export const people: Person[] = [
  {
    id: "siddhartha",
    name: "Siddhartha Reddy",
    role: "Founder & President",
    program: "MSAI",
    bio: "Started the guild after the Sheep Meadow meetup.",
    founder: true,
  },
  {
    id: "harsh",
    name: "Harsh Kumar",
    role: "Head of Research",
    program: "MSAI",
    photo: "/img/harsh.jpg",
    bio: "Runs workshops and builds the things the guild ships. Happy to talk to anyone thinking about joining, whatever they studied before.",
    links: [
      {
        label: "Google Scholar",
        href: "https://scholar.google.com/citations?user=1Niv33YAAAAJ&hl=en",
      },
    ],
    coffee: "hk3510@columbia.edu",
  },
  { id: "andy", name: "Andy He", role: "Head of Partnerships", program: "MSAI" },
  { id: "daniel", name: "Daniel Chen", role: "Head of Events & Programs", program: "MSAI" },
  { id: "iba", name: "Iba Baig", role: "Head of Growth", program: "MSAI" },
  { id: "rudra", name: "Rudra Patel", role: "Head of Marketing & Comms", program: "MSAI" },
  { id: "aditi", name: "Aditi Bansal", role: "Treasurer", program: "SPS" },
  { id: "vinayak", name: "Vinayak Sharma", role: "Head of Product", program: "MSCS" },
  { id: "nikillan", name: "Nikillan Rajesh", role: "Head of Operations", program: "MSAI" },
  { id: "euson", name: "Euson Wang", role: "PhD Product & Research Lead", program: "CS PhD" },
];

export const founder = people.find((p) => p.founder) ?? people[0];

export const contactEmail =
  people.find((p) => p.coffee)?.coffee ?? "TODO@columbia.edu";

/* Tools covered in the Build. Ship. Demo. workshop. */
export const tools: string[] = [
  "Cursor",
  "Claude Code",
  "Codex",
  "v0",
  "Lovable",
  "Bolt",
  "Replit Agent",
  "Supabase",
  "Convex",
  "Modal",
  "Pinecone",
  "Vercel",
  "Figma",
  "n8n",
  "Windsurf",
];
