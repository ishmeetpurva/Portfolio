// ─────────────────────────────────────────────────────────────
//  ALL SITE TEXT LIVES HERE.
//  Wrap ONE word per headline in *asterisks* to set it in the
//  Fraunces italic accent, e.g. "Let's go *deeper.*"
//  Images live in /public and are referenced without a leading slash.
//  Content is taken from github.com/ishmeetpurva/Portfolio.
// ─────────────────────────────────────────────────────────────


export const site = {
  name: 'Ishmeet Kaur',
  logo: 'Ishmeet.',
  role: 'Product designer',
  tagline: 'Designing products that make real *impact.*',
  status: 'Open to opportunities',
  workCta: 'View work',
  hint: 'Move the light',
  dotsLabel: '66,000 dots',
  howMadeLabel: 'How this page was made ↗',
  howMadeUrl: 'https://github.com/ishmeetpurva', // point this at the new repo's README once it's pushed
  email: 'ishmeet.purva@gmail.com',
  resumeUrl: 'https://docs.google.com/document/d/1dpl4oSdBFGOtKocAEQ7pzBCrZzTXIgL4/view?usp=sharing',
  socials: [
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ishmeet-k-671a3198' },
    { label: 'Behance', url: 'https://behance.net/IshmeetKaur' },
  ],
};

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'why', label: 'Why me' },
];

export const about = {
  eyebrow: 'About',
  heading: 'Engineer turned product *designer.*',
  body: [
    'Product designer with 4+ years of experience across mobile and web. Currently co-founding GoBig Creatives, using AI to accelerate design and delivery.',
    'I bridge research, prototyping, and engineering to build products that solve real problems. And yes — I’m usually the most energetic person in the room.',
  ],
  chips: ['UX design', 'User research', 'Mobile and web', 'AI-assisted delivery'],
  stats: [
    { value: 4, suffix: '+', label: 'Years of experience' },
    { value: 10, suffix: '+', label: 'Products designed' },
    { value: 3, suffix: '', label: 'Countries' },
  ],
};

export const work = {
  eyebrow: 'Selected work',
  heading: 'Selected *work*',
  linkLabel: 'More on Behance ↗',
  linkUrl: 'https://behance.net/IshmeetKaur',
  projects: [
    {
      title: 'KFC Dubai',
      category: 'UX design · Research',
      year: '2024',
      role: 'UX Designer',
      summary: '70% of users were failing to check out in the KFC Dubai iOS app — redesigning the ordering journey.',
      approach: 'Audited 10 heuristics, 500+ reviews and 8 competitor apps, then decluttered the homepage, rebuilt the menu and added live order states.',
      impact: '↑ 95% task completion',
      tags: ['UX design', 'Research', 'iOS'],
      image: 'work/kfc.jpg',
      logo: 'logos/kfc.png',
      url: '#/work/kfc',
      cta: 'Case study',
    },
    {
      title: 'GetSociable',
      category: 'UX design · Research',
      year: '2024',
      role: 'Sole UX Designer',
      summary: 'Redesigning an events app experience to surface better entertainment options.',
      approach: 'Three research methods to find the pain points, then navigation fixes, a calmer homepage and a new Trip Planner.',
      impact: '↑ 23% feature adoption',
      tags: ['UX design', 'Research', 'Mobile'],
      image: 'work/getsociable.jpg',
      logo: 'logos/getsociable.png',
      url: '#/work/getsociable',
      cta: 'Case study',
    },
    {
      title: 'Soil testing machine',
      category: 'UX design · Research',
      year: '2020',
      role: 'UX Designer · Absolute Foods',
      summary: 'A soil testing machine that helped agri-scientists get faster test results.',
      approach: 'Field research with lab technicians, then broke a complex lab process into guided, step-by-step screens.',
      impact: '↑ 85% positive feedback',
      tags: ['UX design', 'Research', 'Hardware UI'],
      image: 'work/soil.jpg',
      logo: 'logos/absolute-foods.png',
      url: '#/work/soil',
      cta: 'Case study',
    },
    {
      title: 'Upaj',
      category: 'UX design · Research',
      year: '2023',
      role: 'UX Designer',
      summary: 'Field research with farmers that reshaped the Upaj app and doubled engagement.',
      approach: 'Took the research into the field with farmers and built the prototype around what they told us.',
      impact: '↑ 2× engagement',
      tags: ['Field research', 'Mobile', 'Prototype'],
      image: 'work/upaj.jpg',
      logo: 'logos/upaj.png',
      url: 'https://www.figma.com/proto/RHB5I4hGPZYzh0hFiUqUmG/Upaj_Mobile-App_CaseStudy?page-id=13%3A11915&node-id=117-6011&node-type=frame&viewport=9949%2C6409%2C0.44&t=mhMFQVIyBCFnLB5z-1&scaling=min-zoom&content-scaling=fixed',
      cta: 'Prototype',
    },
    {
      title: 'GoBig',
      category: 'AI · UX design',
      year: '2025',
      role: 'Design + AI',
      summary: 'A complete website for GoBig Creatives, designed and shipped in a single day with AI.',
      approach: 'Paired design judgement with AI tools like Lovable to go from brief to live website in a day.',
      impact: 'Shipped in 1 day',
      tags: ['AI', 'Web', 'Lovable'],
      image: 'work/gobig.jpg',
      url: 'https://gobig-creative-canvas.lovable.app',
      cta: 'Live site',
    },
  ],
};

// Reasons and skills are drafted from your old site's bio and project list — edit freely.
export const why = {
  eyebrow: 'Why hire me',
  heading: 'What I bring to the *table.*',
  reasons: [
    { title: 'Research before pixels', text: 'From farmers in the field (Upaj) to checkout drop-offs (KFC Dubai), every design starts with what users actually do.' },
    { title: 'An engineer’s head for build', text: 'An engineering background means designs that developers can ship, and conversations that stay grounded in what’s possible.' },
    { title: 'Measurable outcomes', text: '95% task completion, 2× engagement, 23% feature adoption — I design for results you can point to.' },
    { title: 'AI-accelerated delivery', text: 'As co-founder of GoBig Creatives I use AI to move from idea to live product fast — a full website shipped in one day.' },
  ],
  skills: [
    'UX design', 'User research', 'Field research', 'Prototyping', 'Figma', 'Mobile apps',
    'Web design', 'iOS', 'Hardware UI', 'AI tools', 'Lovable', 'Branding',
    'Packaging', 'Logo design', 'Poster design',
  ],
};

// Titles are your design principles from the old site.
export const qualities = {
  eyebrow: 'Principles',
  heading: 'How I *work.*',
  items: [
    { title: 'Research before pixels', text: 'I start with people and evidence, not screens.' },
    { title: 'Clarity is earned', text: 'Clear experiences come from testing assumptions, not making them.' },
    { title: 'Design for behaviour', text: 'I design for what people do, not just how screens look.' },
    { title: 'Constraints make better design', text: 'Limits in time, tech or budget sharpen the solution.' },
    { title: 'Advocate for the end user', text: 'The user’s goal is the brief — I speak for them in every room.' },
    { title: 'Every detail is intentional', text: 'Simplicity takes the most work. Measure twice, ship once.' },
  ],
};

export const testimonials = {
  eyebrow: 'Kind words',
  items: [
    {
      quote: 'Ishmeet understood and elicited requirements before delivering a design and prototype that met all of the user stories. She displayed strong professionalism and quickly built rapport with the team.',
      name: 'Peter McCleery', role: 'Director', company: 'GetSociable', image: 'people/peter.jpg',
    },
    {
      quote: 'Ishmeet is an excellent communicator with exceptional creativity and worked closely with design, development, and marketing teams to deliver real value.',
      name: 'Gagan Sahni', role: 'Design Lead', company: 'Absolute Foods', image: 'people/gagan.jpg',
    },
    {
      quote: 'Ishmeet is an amazing personality and an excellent team member. It was a pleasure working with her, guiding her and learning from her as well. I truly recommend her design skills and her ability to speak for users and prioritise them while solving a problem.',
      name: 'Syed Nouman', role: 'Design Consultant', company: 'NCLE', image: 'people/syed.jpg',
    },
  ],
};

export const contact = {
  eyebrow: 'Open to opportunities',
  heading: "Let's build something *delightful.*",
  cta: 'Email me ↗',
};

/** Resolves a /public asset against the deploy base path. */
export const asset = (p) => (p && !/^https?:/.test(p) ? import.meta.env.BASE_URL + p : p);
