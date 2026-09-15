export interface Room {
  name: string;
  images: string[];
  materials?: string[];
}

export interface FloorPlan {
  label: string;
  image: string;
}

export interface Project {
  id: string;
  name: string;
  category: string;
  location: string;
  year: number;
  status: "published" | "draft";
  thumbnail: string;
  heroImage: string;
  area: string;
  floorPlans: FloorPlan[];
  rooms: Room[];
  description: string;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export const STUDIO = {
  name: "Red Door Studio",
  shortName: "RDS",
  tagline: "We Design Homes From The Ground Up",
  email: "reddoorstudio25@gmail.com",
  phone: "+20 11 18324473",
  address: "Villa No. 28, Banafsag 10, New Cairo — Settlement 1, Cairo, Egypt",
  instagram: "https://www.instagram.com/ahmedyounis25",
  pinterest: "https://www.pinterest.com/reddoorstudio25/",
  facebook: "https://www.facebook.com/ahmedyounis25",
};

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Projects", count: 6 },
  { id: "villas", name: "Villas", count: 3 },
  { id: "kitchens", name: "Kitchens", count: 2 },
  { id: "bedrooms", name: "Bedrooms", count: 2 },
  { id: "reception", name: "Reception", count: 2 },
  { id: "bathrooms", name: "Bathrooms", count: 1 },
  { id: "pools", name: "Swimming Pools", count: 1 },
];

export const PROJECTS: Project[] = [
  {
    id: "banafsag-villa",
    name: "Banafsag Residence",
    category: "villas",
    location: "New Cairo, Egypt",
    year: 2024,
    status: "published",
    area: "680 m²",
    thumbnail:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&h=1200&fit=crop&auto=format",
    description:
      "A six-bedroom family villa in New Cairo designed around natural light and the garden axis. The material palette — black Marquina marble, custom walnut millwork, and brushed brass — unifies the interior sequence from entry to roof terrace.",
    floorPlans: [
      {
        label: "Ground Floor",
        image:
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&auto=format",
      },
      {
        label: "First Floor",
        image:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&auto=format",
      },
      {
        label: "Roof Terrace",
        image:
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&h=800&fit=crop&auto=format",
      },
    ],
    rooms: [
      {
        name: "Reception",
        images: [
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Black Marquina marble", "Custom walnut shelving", "Brushed brass handles"],
      },
      {
        name: "Kitchen",
        images: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Calacatta Gold marble island", "Olive matte cabinetry", "Integrated brass tapware"],
      },
      {
        name: "Master Bedroom",
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Boucle headboard panel", "Walnut platform bed", "Sheer linen drapery"],
      },
      {
        name: "Master Bathroom",
        images: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Fior di Bosco stone", "Freestanding soaking tub", "Recessed brass niches"],
      },
    ],
  },
  {
    id: "shorouk-villa",
    name: "Shorouk Estate",
    category: "villas",
    location: "Al Shorouk, Cairo",
    year: 2023,
    status: "published",
    area: "850 m²",
    thumbnail:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=2000&h=1200&fit=crop&auto=format",
    description:
      "A landmark contemporary estate with a double-height reception pavilion, outdoor pool, and a landscaped roof garden. The architecture mediates between the desert scale of the site and the intimate scale of family living.",
    floorPlans: [
      {
        label: "Ground Floor",
        image:
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop&auto=format",
      },
      {
        label: "First Floor",
        image:
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&h=800&fit=crop&auto=format",
      },
    ],
    rooms: [
      {
        name: "Reception Hall",
        images: [
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Bianco Carrara floor", "Smoked oak panels", "Custom brass chandelier"],
      },
      {
        name: "Swimming Pool",
        images: [
          "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Travertine pool deck", "Mosaic pool liner", "Teak sun loungers"],
      },
    ],
  },
  {
    id: "fifth-kitchen",
    name: "Fifth Settlement Kitchen",
    category: "kitchens",
    location: "Fifth Settlement, Cairo",
    year: 2024,
    status: "published",
    area: "48 m²",
    thumbnail:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2000&h=1200&fit=crop&auto=format",
    description:
      "A chef's kitchen designed around a 3.4m island in Calacatta Gold marble. Olive-green cabinetry in matte lacquer with full-height fluted glass display pantries.",
    floorPlans: [],
    rooms: [
      {
        name: "Kitchen",
        images: [
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Calacatta Gold marble island", "Olive matte lacquer cabinetry", "Integrated Miele appliances"],
      },
    ],
  },
  {
    id: "new-cairo-master",
    name: "The Master Suite",
    category: "bedrooms",
    location: "New Cairo, Egypt",
    year: 2024,
    status: "published",
    area: "95 m²",
    thumbnail:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=2000&h=1200&fit=crop&auto=format",
    description:
      "A master suite conceived as a sanctuary. Arched walnut joinery frames a bespoke dressing room; the bedroom opens directly onto a private roof garden through full-height pivot doors.",
    floorPlans: [],
    rooms: [
      {
        name: "Bedroom",
        images: [
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Boucle wall panel", "Walnut platform bed", "Raw linen drapery"],
      },
      {
        name: "Ensuite",
        images: [
          "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Fior di Bosco stone", "Brass rain shower", "Fluted glass screen"],
      },
    ],
  },
  {
    id: "katameya-reception",
    name: "Katameya Formal Hall",
    category: "reception",
    location: "Katameya, Cairo",
    year: 2023,
    status: "published",
    area: "120 m²",
    thumbnail:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=2000&h=1200&fit=crop&auto=format",
    description:
      "A double-height formal reception room anchored by a 6m smoked-oak bookcase wall and a suspended brass sculptural chandelier. The floor is bookmatched Nero Marquina with inlaid brass stripes.",
    floorPlans: [],
    rooms: [
      {
        name: "Reception",
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Nero Marquina floor", "Smoked oak bookcase", "Suspended brass chandelier"],
      },
    ],
  },
  {
    id: "madinaty-pool",
    name: "Madinaty Pool Residence",
    category: "pools",
    location: "Madinaty, Cairo",
    year: 2023,
    status: "published",
    area: "320 m² landscape",
    thumbnail:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&h=600&fit=crop&auto=format",
    heroImage:
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=2000&h=1200&fit=crop&auto=format",
    description:
      "An infinity-edge pool with integrated outdoor kitchen and teak-decked lounge zone. Stone coping in Limestone Beige continues the material language of the villa's exterior terrace.",
    floorPlans: [],
    rooms: [
      {
        name: "Pool",
        images: [
          "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=1200&h=800&fit=crop&auto=format",
        ],
        materials: ["Infinity-edge detail", "Limestone Beige coping", "Mosaic pool liner"],
      },
    ],
  },
];

export const MATERIALS = [
  {
    name: "Black Marquina",
    subtitle: "Marble",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Custom Walnut",
    subtitle: "Millwork",
    image:
      "https://images.unsplash.com/photo-1530435460869-d13625c69bbf?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Brushed Brass",
    subtitle: "Hardware",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Calacatta Gold",
    subtitle: "Marble",
    image:
      "https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Smoked Oak",
    subtitle: "Panelling",
    image:
      "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&h=800&fit=crop&auto=format",
  },
  {
    name: "Olive Lacquer",
    subtitle: "Cabinetry",
    image:
      "https://images.unsplash.com/photo-1617104678098-de229db51175?w=600&h=800&fit=crop&auto=format",
  },
];

export const SERVICES = [
  {
    title: "Full Villa Design",
    description:
      "End-to-end design from site analysis and architectural concept through to furniture placement and art curation. We manage every consultant and contractor on your behalf.",
  },
  {
    title: "Architectural Floor Plans",
    description:
      "Precise technical drawings — ground, upper floors, and roof — optimised for spatial flow, natural light, and your family's programme.",
  },
  {
    title: "Interior Design",
    description:
      "Material boards, custom millwork drawings, furniture specifications, and lighting design that read as a single cohesive vision rather than assembled pieces.",
  },
  {
    title: "Kitchen Design",
    description:
      "Bespoke kitchen design around your cooking style. We work with specialist fabricators to deliver custom joinery in olive lacquer, walnut, or whatever your palette demands.",
  },
  {
    title: "Bedroom & Bathroom Design",
    description:
      "Private rooms conceived as sanctuaries — layered lighting, material warmth, and every joinery detail resolved before a single screw is fixed.",
  },
  {
    title: "Landscape & Pool Design",
    description:
      "Garden, terrace, and pool environments that extend the architecture outward. Infinity edges, pergolas, outdoor kitchens, and planting plans that suit Egypt's climate.",
  },
  {
    title: "Custom Furniture & Lighting",
    description:
      "When the market doesn't have what the space needs, we design it. Dining tables, beds, chandeliers, shelving systems — fabricated by craftsmen who share our standards.",
  },
];
