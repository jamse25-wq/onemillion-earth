export type CreditType = "removal" | "avoidance";

export interface Project {
  slug: string;
  name: string;
  region: string;
  description: string;
  longDescription: string;
  pricePerTonneGbp: number;
  creditType: CreditType;
  registry: string;
  registryUrl: string | null;
  coBenefits: string[];
  imageUrl: string | null;
}

export const projects: Project[] = [
  {
    slug: "kenya-cookstoves",
    name: "Efficient Cookstoves for Rural Families",
    region: "Sub-Saharan Africa · Kenya",
    description:
      "Replacing open fires with efficient cookstoves in rural Kenyan households, dramatically cutting fuel use and indoor air pollution while preventing forest degradation.",
    longDescription:
      "Open fires are the primary cooking method for over 700 million people across Sub-Saharan Africa. This project distributes high-efficiency cookstoves to rural Kenyan families, reducing wood fuel consumption by up to 60%. The result: fewer trees cut, cleaner air for families (particularly children), and measurable emissions avoidance — all verified by Gold Standard.",
    pricePerTonneGbp: 14,
    creditType: "avoidance",
    registry: "Gold Standard",
    registryUrl: "https://www.goldstandard.org",
    coBenefits: [
      "Improved air quality",
      "Reduced deforestation",
      "Community livelihoods",
      "Women's health",
    ],
    imageUrl: null,
  },
  {
    slug: "borneo-reforestation",
    name: "Borneo Rainforest Regeneration",
    region: "Southeast Asia · Malaysia",
    description:
      "Restoring degraded rainforest land in Borneo through native species replanting, creating corridors for critically endangered wildlife including orangutans.",
    longDescription:
      "Borneo has lost over 50% of its old-growth forest in the last 50 years. This project works with local communities to restore degraded land using over 60 native tree species, creating forest corridors that connect fragmented habitats. As the forest grows, it sequesters atmospheric CO₂ permanently — independently measured and verified by Gold Standard.",
    pricePerTonneGbp: 22,
    creditType: "removal",
    registry: "Gold Standard",
    registryUrl: "https://www.goldstandard.org",
    coBenefits: [
      "Biodiversity",
      "Orangutan habitat",
      "Community livelihoods",
      "Watershed protection",
    ],
    imageUrl: null,
  },
  {
    slug: "scotland-peatland",
    name: "Scottish Peatland Restoration",
    region: "Europe · Scotland",
    description:
      "Restoring drained Scottish peatlands — among the most carbon-dense ecosystems on Earth — to active, carbon-sequestering bogs.",
    longDescription:
      "Peatlands cover only 3% of the Earth's land surface but store twice as much carbon as all the world's forests combined. Drained peatlands release that stored carbon back into the atmosphere. This project rewets and restores degraded Scottish peat bogs, halting emissions and restarting natural carbon sequestration — certified by the Woodland Carbon Code.",
    pricePerTonneGbp: 38,
    creditType: "removal",
    registry: "Woodland Carbon Code",
    registryUrl: "https://woodlandcarboncode.org.uk",
    coBenefits: [
      "Biodiversity",
      "Flood regulation",
      "Water quality",
      "Rare species habitat",
    ],
    imageUrl: null,
  },
  {
    slug: "cornwall-seagrass",
    name: "Seagrass Meadow Restoration",
    region: "Europe · Cornwall, UK",
    description:
      "Replanting seagrass meadows off the Cornish coast — one of the ocean's most powerful carbon sinks — lost to decades of coastal degradation.",
    longDescription:
      "Seagrass meadows sequester carbon up to 35 times faster than tropical rainforests, and provide critical habitat for fish, seahorses, and marine invertebrates. Over 90% of the UK's seagrass has been lost in the last century. This project is restoring meadows off the Cornish coast, capturing carbon in sediments where it can remain locked for centuries. Registry certification is in progress — this project will go live upon verification.",
    pricePerTonneGbp: 45,
    creditType: "removal",
    registry: "Pending verification",
    registryUrl: null,
    coBenefits: [
      "Marine biodiversity",
      "Fish nursery habitat",
      "Coastal protection",
      "Water clarity",
    ],
    imageUrl: null,
  },
  {
    slug: "amazon-redd",
    name: "Amazon REDD+ Forest Protection",
    region: "South America · Brazil",
    description:
      "Protecting standing Amazon rainforest under verified threat of deforestation, preserving one of Earth's most critical ecosystems and carbon stores.",
    longDescription:
      "REDD+ (Reducing Emissions from Deforestation and Forest Degradation) projects protect forests that are under demonstrated, verified threat of being cleared. This project protects a biodiverse section of Brazilian Amazon from agricultural expansion, with the forest's continued existence and its carbon stock verified annually by Verra. Each credit represents avoided deforestation of one tonne of CO₂ equivalent.",
    pricePerTonneGbp: 18,
    creditType: "avoidance",
    registry: "Verra VCS",
    registryUrl: "https://verra.org",
    coBenefits: [
      "Biodiversity",
      "Indigenous community support",
      "Watershed protection",
      "Species habitat",
    ],
    imageUrl: null,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
