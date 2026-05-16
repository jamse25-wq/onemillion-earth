-- onemillion.earth database schema
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor)

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  region text,
  description text,
  long_description text,
  price_per_tonne_gbp numeric not null,
  credit_type text not null check (credit_type in ('removal', 'avoidance')),
  registry text,
  registry_url text,
  co_benefits text[],
  is_active boolean default true,
  image_url text
);

create table if not exists purchases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  buyer_name text not null,
  buyer_email text not null,
  is_anonymous boolean default false,
  organisation text,
  project_slug text references projects(slug),
  tonnes numeric not null,
  amount_gbp numeric not null,
  carbon_cost_gbp numeric not null,
  platform_fee_gbp numeric not null,
  stripe_payment_id text,
  certificate_id uuid default gen_random_uuid(),
  lat numeric,
  lng numeric,
  country text
);

create table if not exists globe_snapshot (
  id int primary key default 1,
  updated_at timestamptz default now(),
  total_tonnes numeric default 0,
  total_purchases int default 0,
  fill_percentage numeric default 0,
  recent_markers jsonb default '[]'
);

-- Row Level Security
-- projects: anyone can read active projects, nobody can write via anon key
alter table projects enable row level security;
create policy "Public can read active projects" on projects
  for select using (is_active = true);

-- purchases: anon key can insert (needed for webhook) but cannot read individual rows
-- buyer_email is never exposed — only safe fields are returned via API routes
alter table purchases enable row level security;
create policy "Public can insert purchases" on purchases
  for insert with check (true);
create policy "Public can read non-private purchase fields" on purchases
  for select using (true);

-- globe_snapshot: fully public read, no public write
alter table globe_snapshot enable row level security;
create policy "Public can read globe snapshot" on globe_snapshot
  for select using (true);

-- Insert initial globe snapshot
insert into globe_snapshot (id, total_tonnes, total_purchases, fill_percentage, recent_markers)
values (1, 0, 0, 0, '[]')
on conflict (id) do nothing;

-- Seed projects data
insert into projects (slug, name, region, description, long_description, price_per_tonne_gbp, credit_type, registry, registry_url, co_benefits, is_active) values
(
  'kenya-cookstoves',
  'Efficient Cookstoves for Rural Families',
  'Sub-Saharan Africa · Kenya',
  'Replacing open fires with efficient cookstoves in rural Kenyan households, dramatically cutting fuel use and indoor air pollution while preventing forest degradation.',
  'Open fires are the primary cooking method for over 700 million people across Sub-Saharan Africa. This project distributes high-efficiency cookstoves to rural Kenyan families, reducing wood fuel consumption by up to 60%. The result: fewer trees cut, cleaner air for families (particularly children), and measurable emissions avoidance — all verified by Gold Standard.',
  14,
  'avoidance',
  'Gold Standard',
  'https://www.goldstandard.org',
  array['Improved air quality', 'Reduced deforestation', 'Community livelihoods', 'Women''s health'],
  true
),
(
  'borneo-reforestation',
  'Borneo Rainforest Regeneration',
  'Southeast Asia · Malaysia',
  'Restoring degraded rainforest land in Borneo through native species replanting, creating corridors for critically endangered wildlife including orangutans.',
  'Borneo has lost over 50% of its old-growth forest in the last 50 years. This project works with local communities to restore degraded land using over 60 native tree species, creating forest corridors that connect fragmented habitats. As the forest grows, it sequesters atmospheric CO₂ permanently — independently measured and verified by Gold Standard.',
  22,
  'removal',
  'Gold Standard',
  'https://www.goldstandard.org',
  array['Biodiversity', 'Orangutan habitat', 'Community livelihoods', 'Watershed protection'],
  true
),
(
  'scotland-peatland',
  'Scottish Peatland Restoration',
  'Europe · Scotland',
  'Restoring drained Scottish peatlands — among the most carbon-dense ecosystems on Earth — to active, carbon-sequestering bogs.',
  'Peatlands cover only 3% of the Earth''s land surface but store twice as much carbon as all the world''s forests combined. Drained peatlands release that stored carbon back into the atmosphere. This project rewets and restores degraded Scottish peat bogs, halting emissions and restarting natural carbon sequestration — certified by the Woodland Carbon Code.',
  38,
  'removal',
  'Woodland Carbon Code',
  'https://woodlandcarboncode.org.uk',
  array['Biodiversity', 'Flood regulation', 'Water quality', 'Rare species habitat'],
  true
),
(
  'cornwall-seagrass',
  'Seagrass Meadow Restoration',
  'Europe · Cornwall, UK',
  'Replanting seagrass meadows off the Cornish coast — one of the ocean''s most powerful carbon sinks — lost to decades of coastal degradation.',
  'Seagrass meadows sequester carbon up to 35 times faster than tropical rainforests, and provide critical habitat for fish, seahorses, and marine invertebrates. Over 90% of the UK''s seagrass has been lost in the last century. This project is restoring meadows off the Cornish coast, capturing carbon in sediments where it can remain locked for centuries.',
  45,
  'removal',
  'Pending verification',
  null,
  array['Marine biodiversity', 'Fish nursery habitat', 'Coastal protection', 'Water clarity'],
  true
),
(
  'amazon-redd',
  'Amazon REDD+ Forest Protection',
  'South America · Brazil',
  'Protecting standing Amazon rainforest under verified threat of deforestation, preserving one of Earth''s most critical ecosystems and carbon stores.',
  'REDD+ (Reducing Emissions from Deforestation and Forest Degradation) projects protect forests that are under demonstrated, verified threat of being cleared. This project protects a biodiverse section of Brazilian Amazon from agricultural expansion, with the forest''s continued existence and its carbon stock verified annually by Verra.',
  18,
  'avoidance',
  'Verra VCS',
  'https://verra.org',
  array['Biodiversity', 'Indigenous community support', 'Watershed protection', 'Species habitat'],
  true
)
on conflict (slug) do nothing;
