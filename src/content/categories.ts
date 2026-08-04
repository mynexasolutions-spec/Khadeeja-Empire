import type { Category, Collection } from "@/types";

export const categories: Category[] = [
  {
    slug: "short-kurtis",
    name: "Short Kurtis",
    description: "Tradition, cut for today. Breathable cottons and modern silhouettes.",
    image: "/assets/images/3932554101906649932.jpg",
  },
  {
    slug: "coord-sets",
    name: "Co-ord Sets",
    description: "One set. Endless moments. Crafted co-ord sets for every mood.",
    image: "/assets/images/3895371692098630743.jpg",
  },
  {
    slug: "everyday-tops",
    name: "Everyday Tops",
    description: "Easy elegance for daily wear. Tops that move with you.",
    image: "/assets/images/3923489547532341720.jpg",
  },
  {
    slug: "dresses",
    name: "Dresses",
    description: "Statement dresses for brunch, evening, and everything after.",
    image: "/assets/images/3920746353986469456.jpg",
  },
  {
    slug: "resort-and-whites",
    name: "Resort & Whites",
    description: "Light layers, lasting impressions. Vacation-ready whites.",
    image: "/assets/images/3942701400028659556.jpg",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "The latest from our studio. Fresh drops, timeless appeal.",
    image: "/assets/images/3952741041305855070.jpg",
  },
];

export const collections: Collection[] = [
  {
    slug: "short-kurtis",
    name: "Short Kurtis",
    description:
      "Tradition, cut for today. Our short kurti collection blends heritage prints with contemporary fits designed for the way women dress now.",
    image: "/assets/images/3932554101906649932.jpg",
    heroCopy: "Tradition, cut for today.",
  },
  {
    slug: "coord-sets",
    name: "Co-ord Sets",
    description:
      "One set. Endless moments. Co-ord sets crafted in Banaras with breathable fabrics and intricate detailing for effortless coordination.",
    image: "/assets/images/3895371692098630743.jpg",
    heroCopy: "One set. Endless moments.",
  },
  {
    slug: "everyday-tops",
    name: "Everyday Tops",
    description:
      "Easy elegance for daily wear. From halter styles to smocked waists, these tops are designed to be reached for again and again.",
    image: "/assets/images/3923489547532341720.jpg",
    heroCopy: "Effortless, every day.",
  },
  {
    slug: "dresses",
    name: "Dresses",
    description:
      "Statement dresses for every occasion. From flowing maxis to structured halters, each piece is designed to turn heads.",
    image: "/assets/images/3920746353986469456.jpg",
    heroCopy: "Dresses that speak for you.",
  },
  {
    slug: "resort-and-whites",
    name: "Resort & Whites",
    description:
      "Light layers, lasting impressions. Vacation-ready whites and breezy silhouettes for sun-soaked days and balmy evenings.",
    image: "/assets/images/3942701400028659556.jpg",
    heroCopy: "Light layers, lasting impressions.",
  },
  {
    slug: "new-arrivals",
    name: "New Arrivals",
    description:
      "The latest from our studio. Fresh drops with timeless appeal, designed and crafted in Banaras.",
    image: "/assets/images/3952741041305855070.jpg",
    heroCopy: "Fresh from the studio.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}