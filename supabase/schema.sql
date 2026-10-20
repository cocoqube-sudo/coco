-- ========================================================
-- 1. Client Enquiries & RFQ Table
-- ========================================================
create table if not exists enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  form_type text not null default 'contact',
  name text not null,
  company text,
  phone text,
  email text,
  city text,
  country text,
  product text,
  quantity text,
  details jsonb default '{}'::jsonb,
  status text not null default 'new',
  notes text
);

alter table enquiries enable row level security;

drop policy if exists "Enable all for enquiries" on enquiries;
create policy "Enable all for enquiries" on enquiries
  for all
  using (true)
  with check (true);

-- ========================================================
-- 2. Cocoqube Blog Table Schema
-- ========================================================
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null default 'Agronomy',
  read_time text not null default '5 min read',
  published_at text default to_char(current_date, 'FMMonth YYYY'),
  author text not null default 'Cocoqube Technical Desk',
  image text not null default '/images/process-qc.jpg',
  image_alt text not null default 'Cocoqube substrate insights',
  excerpt text not null,
  content text not null,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table blogs enable row level security;

-- Policy 1: Anyone can read published blogs
drop policy if exists "Public read published blogs" on blogs;
create policy "Public read published blogs" on blogs
  for select
  using (is_published = true);

-- Policy 2: Allow all operations with the anon key (or restrict to service_role)
drop policy if exists "Enable full access for anon" on blogs;
create policy "Enable full access for anon" on blogs
  for all
  using (true)
  with check (true);

-- Insert initial sample articles
insert into blogs (slug, title, category, read_time, published_at, author, image, image_alt, excerpt, content, is_published)
values
(
  'science-of-buffering-coco-peat',
  'The Chemistry of Washing & Buffering: How Calcium Nitrate Displaces Sodium in Coir',
  'Substrate Chemistry',
  '6 min read',
  'March 2026',
  'Cocoqube Technical Agronomy Desk',
  '/images/process-qc.jpg',
  'Quality control testing of buffered coco peat',
  'Raw coconut coir pith contains naturally high cation exchange capacity loaded with sodium and potassium. Discover the exact buffering mechanism that prevents calcium lockout in sensitive greenhouse crops.',
  'Raw coconut coir naturally develops near coastal and tropical soils, absorbing potassium (K), sodium (Na), and chloride (Cl) ions into its complex cellular matrix. The cation exchange complex (CEC) of unbuffered coir naturally binds sodium and potassium tightly.

When an unbuffered coir substrate is used for commercial crops such as tomatoes, berries, or cut flowers, the standard calcium-rich fertigation solution triggers an immediate ionic displacement. The coir matrix greedily absorbs the calcium (Ca) and magnesium (Mg) ions from the nutrient feed and releases toxic spikes of sodium and potassium into the root zone.

This phenomenon causes acute calcium deficiency—often showing as blossom end rot in tomatoes, tip burn in leafy greens, or stunted root tip development—even when the grower supplies adequate calcium in their liquid reservoir.

To prevent this, true buffering treats washed coco pith with an agricultural-grade calcium nitrate solution for an extended immersion period. The high concentration of divalent calcium cations displaces the monovalent sodium and potassium ions, which are subsequently rinsed away with clean fresh water.

When sourcing buffered coco peat, buyers must demand a specification that reports not just electrical conductivity (EC), but also exchangeable sodium percentage (ESP) and the exact extraction ratio (e.g. 1:1.5 volume or 1:5 weight method) used by the laboratory.',
  true
),
(
  'optimizing-air-filled-porosity',
  'Air-Filled Porosity (AFP) & Drainage: Designing Coir Blends for High-Yield Crops',
  'Commercial Growing',
  '5 min read',
  'February 2026',
  'Cocoqube Crop Systems Specialist',
  '/images/nursery.jpg',
  'Commercial greenhouse container nursery with coir blend',
  'How commercial blenders combine washed coco pith with crushed coconut husk chips and graded coir fibers to maintain 25%+ air-filled porosity across multiple growing seasons.',
  'Air-filled porosity (AFP) is the proportion of substrate volume occupied by air after thorough irrigation and free gravitational drainage. In hydroponic and nursery crop production, roots require adequate dissolved oxygen to drive active nutrient uptake and cellular respiration.

Standard fine-particle coco peat pith offers exceptional water-holding capacity (typically 8 to 9 times its dry weight), but can have lower air-filled porosity (10–14%) if over-milled or compacted.

For sensitive perennial crops like blueberries, raspberries, or multi-year greenhouse peppers, fine pith alone can become overly waterlogged during winter periods with low transpirational demand, leading to anaerobic root rot (Pythium and Phytophthora).

The modern commercial solution is precision custom blending: combining washed coco pith (60–70%) with 10–18mm crushed coconut husk chips (20–30%) and graded short coir fibers (10%).

The structural elasticity of coconut husk chips creates resilient macropores that resist degradation and biological breakdown for over 3 to 5 growing seasons, guaranteeing 20% to 28% AFP throughout the plant’s entire productive lifecycle.',
  true
),
(
  'container-loading-export-coco-peat-blocks',
  'Container Logistics: Palletized vs Floor-Loaded 5kg Blocks for Ocean Freight',
  'Export Logistics',
  '7 min read',
  'January 2026',
  'Cocoqube Global Freight Operations',
  '/images/export-pallet.jpg',
  'Palletized cartons of coco peat blocks prepared for container loading',
  'Evaluating container payload limits, moisture barrier liners, phytosanitary fumigation protocols, and destination handling costs between floor-loaded and palletized dispatches.',
  'For global importers and commercial distributors, freight cost per metric tonne often represents 25% to 40% of the landed cost of compressed coco peat. Choosing between floor-loading and palletized loading is a critical economic decision.

In a 40ft High Cube (HC) ocean container, floor-loading 5kg compressed blocks (hand-stacked directly inside the container) allows shippers to maximize payload up to the statutory gross weight limit—typically 24 to 26 metric tonnes (approximately 4,800 to 5,200 blocks).

By comparison, palletizing the blocks on treated wooden or plastic pallets reduces container capacity to approximately 20 to 22 metric tonnes due to pallet tare weight and dimensional height restrictions inside the container door frame.

However, floor loading requires intensive manual labor at the destination discharge warehouse, taking 4 to 6 hours to de-stuff, whereas a palletized container can be unloaded by forklift in under 30 minutes, saving substantial demurrage and labor costs in high-wage regions such as Western Europe, North America, and Australia.

Cocoqube coordinates both modes: providing moisture-barrier desiccants, container thermal kraft paper liners, corner-board protectors, and ISPM-15 heat-treated pallets certified for international phytosanitary compliance.',
  true
)
on conflict (slug) do nothing;
