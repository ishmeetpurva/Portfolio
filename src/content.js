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
  current: { label: 'Currently at', company: 'Mercor', url: 'https://mercor.com' },
  workCta: 'View work',
  dotsLabel: '66,000 dots',
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
  body: 'Product designer with 4+ years across mobile and web. Currently at Mercor, using AI to accelerate design and delivery. I bridge research, prototyping and engineering.',
  stats: [
    { value: 4, suffix: '+', label: 'Years' },
    { value: 10, suffix: '+', label: 'Products' },
    { value: 3, suffix: '', label: 'Countries' },
  ],
};

export const work = {
  eyebrow: 'Work',
  heading: 'Selected *work*',
  linkLabel: 'More on Behance ↗',
  linkUrl: 'https://behance.net/IshmeetKaur',
  projects: [
    {
      title: 'KFC Dubai',
      year: '2024',
      role: 'UX Designer',
      summary: 'Fixing an iOS ordering journey where 70% of users abandoned checkout.',
      impact: '30% → 95% checkout completion',
      image: 'work/kfc.webp',
      logo: 'logos/kfc.png',
      url: '#/work/kfc',
      cta: 'Case study',
    },
    {
      title: 'GetSociable',
      year: '2024',
      role: 'Sole UX Designer',
      summary: 'A calmer homepage and a new Trip Planner for an events app.',
      impact: '23% Trip Planner adoption',
      image: 'work/getsociable.webp',
      logo: 'logos/getsociable.png',
      url: '#/work/getsociable',
      cta: 'Case study',
    },
    {
      title: 'Soil testing machine',
      year: '2020',
      role: 'UX Designer',
      summary: 'Guided on-device screens for a complex lab process.',
      impact: '85% positive feedback',
      image: 'work/soil.webp',
      logo: 'logos/absolute-foods.png',
      url: '#/work/soil',
      cta: 'Case study',
    },
    {
      title: 'Upaj',
      year: '2023',
      role: 'UX Designer',
      summary: 'Field research with farmers that reshaped a farming app.',
      impact: '2× engagement',
      image: 'work/upaj.webp',
      logo: 'logos/upaj.png',
      url: 'https://www.figma.com/proto/RHB5I4hGPZYzh0hFiUqUmG/Upaj_Mobile-App_CaseStudy?page-id=13%3A11915&node-id=117-6011&node-type=frame&viewport=9949%2C6409%2C0.44&t=mhMFQVIyBCFnLB5z-1&scaling=min-zoom&content-scaling=fixed',
      cta: 'Prototype',
    },
    {
      title: 'GoBig',
      year: '2025',
      role: 'Design + AI',
      summary: 'A full website for GoBig Creatives, built with AI.',
      impact: 'Shipped in 1 day',
      image: 'work/gobig.webp',
      logo: 'logos/gobig.png',
      url: 'https://gobig-creative-canvas.lovable.app',
      cta: 'Live site',
    },
  ],
};

export const why = {
  eyebrow: 'Why me',
  heading: 'What I bring to the *table.*',
  reasons: [
    { icon: 'icons/research.webp', title: 'Research-led', text: 'From farmers in the field to checkout drop-offs, every design starts with what users actually do.' },
    { icon: 'icons/engineer.webp', title: 'An engineer’s head for build', text: 'Designs developers can ship, and conversations grounded in what’s possible.' },
    { icon: 'icons/outcomes.webp', title: 'Measurable outcomes', text: '95% task completion, 2× engagement, 23% feature adoption.' },
    { icon: 'icons/ai.webp', title: 'AI-accelerated delivery', text: 'From idea to live product fast: the GoBig website went live in one day.' },
  ],
};

export const testimonials = {
  eyebrow: 'Testimonials',
  heading: 'Kind *words.*',
  items: [
    {
      quote: 'Ishmeet understood and elicited requirements before delivering a design and prototype that met all of the user stories. She displayed strong professionalism and quickly built rapport with the team.',
      name: 'Peter McCleery', role: 'Director', company: 'GetSociable', image: 'people/peter.webp',
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
