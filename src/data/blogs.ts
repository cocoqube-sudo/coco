export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  imageAlt: string;
  excerpt: string;
  author: string;
  content: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'science-of-buffering-coco-peat',
    title: 'The Chemistry of Washing & Buffering: How Calcium Nitrate Displaces Sodium in Coir',
    category: 'Substrate Chemistry',
    readTime: '6 min read',
    date: 'March 2026',
    author: 'Cocoqube Technical Agronomy Desk',
    image: '/images/process-qc.jpg',
    imageAlt: 'Quality control technician measuring EC and testing coco peat wash levels',
    excerpt: 'Raw coconut coir pith contains naturally high cation exchange capacity loaded with sodium and potassium. Discover the exact buffering mechanism that prevents calcium lockout in sensitive greenhouse crops.',
    content: [
      'Raw coconut coir naturally develops near coastal and tropical soils, absorbing potassium (K), sodium (Na), and chloride (Cl) ions into its complex cellular matrix. The cation exchange complex (CEC) of unbuffered coir naturally binds sodium and potassium tightly.',
      'When an unbuffered coir substrate is used for commercial crops such as tomatoes, berries, or cut flowers, the standard calcium-rich fertigation solution triggers an immediate ionic displacement. The coir matrix greedily absorbs the calcium (Ca) and magnesium (Mg) ions from the nutrient feed and releases toxic spikes of sodium and potassium into the root zone.',
      'This phenomenon causes acute calcium deficiency—often showing as blossom end rot in tomatoes, tip burn in leafy greens, or stunted root tip development—even when the grower supplies adequate calcium in their liquid reservoir.',
      'To prevent this, true buffering treats washed coco pith with an agricultural-grade calcium nitrate solution for an extended immersion period. The high concentration of divalent calcium cations displaces the monovalent sodium and potassium ions, which are subsequently rinsed away with clean fresh water.',
      'When sourcing buffered coco peat, buyers must demand a specification that reports not just electrical conductivity (EC), but also exchangeable sodium percentage (ESP) and the exact extraction ratio (e.g. 1:1.5 volume or 1:5 weight method) used by the laboratory.',
    ],
  },
  {
    slug: 'optimizing-air-filled-porosity',
    title: 'Air-Filled Porosity (AFP) & Drainage: Designing Coir Blends for High-Yield Crops',
    category: 'Commercial Growing',
    readTime: '5 min read',
    date: 'February 2026',
    author: 'Cocoqube Crop Systems Specialist',
    image: '/images/nursery.jpg',
    imageAlt: 'Modern greenhouse nursery container cultivation with coir substrate',
    excerpt: 'How commercial blenders combine washed coco pith with crushed coconut husk chips and graded coir fibers to maintain 25%+ air-filled porosity across multiple growing seasons.',
    content: [
      'Air-filled porosity (AFP) is the proportion of substrate volume occupied by air after thorough irrigation and free gravitational drainage. In hydroponic and nursery crop production, roots require adequate dissolved oxygen to drive active nutrient uptake and cellular respiration.',
      'Standard fine-particle coco peat pith offers exceptional water-holding capacity (typically 8 to 9 times its dry weight), but can have lower air-filled porosity (10–14%) if over-milled or compacted.',
      'For sensitive perennial crops like blueberries, raspberries, or multi-year greenhouse peppers, fine pith alone can become overly waterlogged during winter periods with low transpirational demand, leading to anaerobic root rot (Pythium and Phytophthora).',
      'The modern commercial solution is precision custom blending: combining washed coco pith (60–70%) with 10–18mm crushed coconut husk chips (20–30%) and graded short coir fibers (10%).',
      'The structural elasticity of coconut husk chips creates resilient macropores that resist degradation and biological breakdown for over 3 to 5 growing seasons, guaranteeing 20% to 28% AFP throughout the plant’s entire productive lifecycle.',
    ],
  },
  {
    slug: 'container-loading-export-coco-peat-blocks',
    title: 'Container Logistics: Palletized vs Floor-Loaded 5kg Blocks for Ocean Freight',
    category: 'Export Logistics',
    readTime: '7 min read',
    date: 'January 2026',
    author: 'Cocoqube Global Freight Operations',
    image: '/images/export-pallet.jpg',
    imageAlt: 'Labelled cartons of compressed coco peat blocks strapped on export pallets',
    excerpt: 'Evaluating container payload limits, moisture barrier liners, phytosanitary fumigation protocols, and destination handling costs between floor-loaded and palletized dispatches.',
    content: [
      'For global importers and commercial distributors, freight cost per metric tonne often represents 25% to 40% of the landed cost of compressed coco peat. Choosing between floor-loading and palletized loading is a critical economic decision.',
      'In a 40ft High Cube (HC) ocean container, floor-loading 5kg compressed blocks (hand-stacked directly inside the container) allows shippers to maximize payload up to the statutory gross weight limit—typically 24 to 26 metric tonnes (approximately 4,800 to 5,200 blocks).',
      'By comparison, palletizing the blocks on treated wooden or plastic pallets reduces container capacity to approximately 20 to 22 metric tonnes due to pallet tare weight and dimensional height restrictions inside the container door frame.',
      'However, floor loading requires intensive manual labor at the destination discharge warehouse, taking 4 to 6 hours to de-stuff, whereas a palletized container can be unloaded by forklift in under 30 minutes, saving substantial demurrage and labor costs in high-wage regions such as Western Europe, North America, and Australia.',
      'Cocoqube coordinates both modes: providing moisture-barrier desiccants, container thermal kraft paper liners, corner-board protectors, and ISPM-15 heat-treated pallets certified for international phytosanitary compliance.',
    ],
  },
];
