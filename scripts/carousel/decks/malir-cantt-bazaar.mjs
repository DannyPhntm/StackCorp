/*
 * Deck: Malir Cantt Bazaar — StackCorp case study (LinkedIn carousel, 9 slides)
 * Render:  node scripts/carousel/render.mjs scripts/carousel/decks/malir-cantt-bazaar.mjs
 *
 * This doubles as the reference example for the deck schema. See
 * scripts/carousel/README.md for every slide type and field.
 */
export default {
  name: 'Malir Cantt Bazaar — Case Study',
  slug: 'stackcorp-slide',
  slides: [
    {
      type: 'cover',
      eyebrow: 'Case Study',
      // title: array of parts; { blue:true } tints a part with the accent
      title: [{ text: 'Malir Cantt' }, { text: 'Bazaar', blue: true }],
      upper: true, // uppercase brand treatment (drop for title-case)
      titleSize: 112, // uppercase looks best ~112; title-case ~132
      subtitle:
        'A production marketplace built for a real community — from first idea to a live, verified platform.',
      accent: 'From idea -> production',
      foot: 'Live at <b>malircanttbazaar.com</b>',
      foottag: 'First live product',
    },
    {
      type: 'statement',
      eyebrow: 'The Problem',
      title: "Building another marketplace<br>wasn't the goal.",
      paras: [
        { text: "The challenge wasn't listings. It was trust.", lede: true },
        { text: "General marketplaces weren't designed around a gated community where residents want confidence in who they're buying from." },
        { text: 'So instead of copying existing platforms, we designed a system around trust, moderation, and local discovery.' },
      ],
      cardsLabel: 'Problems we solved',
      cards: [
        { icon: 'search', title: 'Local discovery' },
        { icon: 'shieldCheck', title: 'Seller credibility' },
        { icon: 'store', title: 'Business visibility' },
        { icon: 'users', title: 'Community-first experience' },
      ],
    },
    {
      type: 'flow',
      eyebrow: 'Product Thinking',
      title: "Trust wasn't a feature.",
      subtitle: 'It became part of the architecture.',
      steps: [
        { icon: 'user', label: 'Resident', annot: 'Verified identity' },
        { icon: 'lock', label: 'Authentication', annot: 'Email verification' },
        { icon: 'shieldCheck', label: 'Business Verification', annot: 'Ownership validation' },
        { icon: 'users', label: 'Admin Review', annot: 'Admin approval' },
        { icon: 'store', label: 'Marketplace', annot: 'Moderation', hl: true },
        { icon: 'user', label: 'Buyer', annot: 'Role permissions' },
      ],
      foot: 'Everything from verification to moderation was designed to <b>reduce friction while protecting users.</b>',
    },
    {
      type: 'flow',
      wide: true, // full-width nodes with an inline layer tag
      eyebrow: 'System Architecture',
      title: 'Architecture',
      steps: [
        { icon: 'image', label: 'Frontend', sub: 'React + Vite', tag: 'Application' },
        { icon: 'server', label: 'Express API', sub: 'Node.js + Express', tag: 'Application' },
        { icon: 'sliders', label: 'Prisma ORM', sub: 'Type-safe data access', tag: 'Application' },
        { icon: 'database', label: 'Neon PostgreSQL', sub: 'Managed database', tag: 'Data' },
        { icon: 'cloud', label: 'Cloudinary + Resend', sub: 'Media uploads & transactional email', tag: 'Services' },
        { icon: 'globe', label: 'Railway + Vercel', sub: 'Backend & frontend hosting', tag: 'Deployment', hl: true },
      ],
      foot: '<b>A production deployment</b> — not a prototype.',
    },
    {
      type: 'checklist',
      eyebrow: 'Capabilities',
      title: 'What We Built',
      items: [
        'Marketplace', 'Search', 'Business Directory', 'Categories', 'Authentication',
        'WhatsApp Contact', 'Email Verification', 'Image Uploads', 'Business Applications',
        'Featured Listings', 'Admin Dashboard', 'Responsive Design', 'Moderation', 'Role-Based Access',
      ],
      foot: 'All core workflows <b>designed, built, and shipped to production.</b>',
    },
    {
      type: 'featureCards',
      eyebrow: 'Security',
      title: 'Security by Design',
      subtitle: "Security wasn't added after launch. It was designed into the system.",
      cards: [
        { icon: 'lock', title: 'Authentication', items: ['Hashed passwords', 'Verified sessions'] },
        { icon: 'shieldCheck', title: 'Authorization', items: ['Backend permission checks', 'Ownership validation'] },
        { icon: 'server', title: 'Infrastructure', items: ['Secure image uploads', 'Input validation', 'Rate limiting', 'Private verification documents', 'Protected admin routes'] },
      ],
      foot: 'Protecting users, businesses, and community data <b>at every layer.</b>',
    },
    {
      type: 'grid',
      eyebrow: 'Tech Stack',
      title: 'Production Stack',
      // monogram tiles — never fabricate brand logos
      cells: [
        { mono: 'Rt', name: 'React' }, { mono: 'Vt', name: 'Vite' }, { mono: 'Ex', name: 'Express' }, { mono: 'Pr', name: 'Prisma' },
        { mono: 'Ne', name: 'Neon' }, { mono: 'Pg', name: 'PostgreSQL' }, { mono: 'Cl', name: 'Cloudinary' }, { mono: 'Re', name: 'Resend' },
        { mono: 'Rw', name: 'Railway' }, { mono: 'Vc', name: 'Vercel' }, { mono: 'Pb', name: 'Porkbun' }, { mono: '+', name: 'And more' },
      ],
      foot: 'Choosing <b>boring, reliable infrastructure</b> lets you spend more time solving customer problems.',
    },
    {
      type: 'results',
      eyebrow: 'Results',
      title: 'What This Project Proved',
      paras: [
        { text: "Building software isn't just writing code. It's understanding the business problem, designing the right workflows, shipping reliable infrastructure, and making sure it can be operated long after launch." },
        { text: 'This project took us from concept to a <b>production-ready system used by a real community.</b>' },
      ],
      pills: [
        { icon: 'users', title: 'Multi-role system' },
        { icon: 'shieldCheck', title: 'Secure by design' },
        { icon: 'rocket', title: 'Live in production' },
        { icon: 'checkCircle', title: 'Built to scale' },
      ],
      cta: { title: 'Live today.', url: 'malircanttbazaar.com' },
    },
    {
      type: 'closing',
      eyebrow: 'The Next Chapter',
      title: 'This is just<br>the beginning.',
      paras: [
        { text: '<b>Malir Cantt Bazaar</b> is our first production product.', first: true },
        { text: "We're now applying the same engineering approach to <b>AI systems, internal tools, and business automation.</b>" },
      ],
      tagline: 'Building software businesses can rely on.',
      url: 'stackcorp.org',
    },
  ],
}
