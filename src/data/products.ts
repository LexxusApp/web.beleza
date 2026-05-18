import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "1",
    slug: "rouge-velours-chanel",
    brand: "CHANEL",
    name: "Rouge Allure Velours — Tom 58",
    price: 389.9,
    image: "/products/chanel-lipstick.jpg",
    category: "Maquiagem",
    howToUse:
      "Aplique diretamente nos lábios ou com pincel para maior precisão. Para um efeito degradê, concentre a cor no centro e esfume nas bordas com o dedo.",
    ingredients:
      "Dimethicone, Isododecane, Trisiloxane, Cera Alba, Tocopherol, Pigmentos CI 77491, CI 77492, CI 77499. Livre de parabenos.",
    reviews: [
      {
        id: "r1",
        author: "Marina S.",
        rating: 5,
        comment: "Textura aveludada impecável. Dura o dia inteiro sem ressecar.",
        date: "2026-03-12",
      },
      {
        id: "r2",
        author: "Camila R.",
        rating: 4,
        comment: "Cor intensa e sofisticada. Embalagem digna de luxo.",
        date: "2026-02-28",
      },
    ],
  },
  {
    id: "2",
    slug: "serum-advanced-night-estee",
    brand: "ESTÉE LAUDER",
    name: "Advanced Night Repair Serum",
    price: 649.0,
    image: "/products/estee-serum.jpg",
    category: "Skincare",
    howToUse:
      "Aplique 3 a 5 gotas no rosto limpo, de manhã e à noite, antes do hidratante. Massageie suavemente em movimentos ascendentes.",
    ingredients:
      "Aqua, Bifida Ferment Lysate, Tripeptide-32, Hyaluronic Acid, Glycerin, Sodium Hyaluronate. Dermatologicamente testado.",
    reviews: [
      {
        id: "r3",
        author: "Juliana M.",
        rating: 5,
        comment: "Minha pele ficou visivelmente mais luminosa em duas semanas.",
        date: "2026-04-01",
      },
    ],
  },
  {
    id: "3",
    slug: "black-opium-yves",
    brand: "YVES SAINT LAURENT",
    name: "Black Opium Eau de Parfum 90ml",
    price: 789.0,
    image: "/products/ysl-perfume.jpg",
    category: "Perfumaria",
    howToUse:
      "Borrife a 20 cm da pele nos pontos de pulsação: pulsos, pescoço e atrás das orelhas. Não esfregue — deixe secar naturalmente.",
    ingredients:
      "Alcohol Denat., Parfum, Aqua, Benzyl Salicylate, Linalool, Coumarin, Alpha-Isomethyl Ionone. Concentração Eau de Parfum.",
    reviews: [
      {
        id: "r4",
        author: "Fernanda L.",
        rating: 5,
        comment: "Fixação excelente. Notas doces com fundo amadeirado — viciante.",
        date: "2026-01-15",
      },
    ],
  },
  {
    id: "4",
    slug: "forever-skin-glow-dior",
    brand: "DIOR",
    name: "Forever Skin Glow Foundation",
    price: 459.0,
    image: "/products/dior-foundation.jpg",
    category: "Maquiagem",
    howToUse:
      "Aplique uma bomba no centro do rosto e espalhe com esponja úmida ou pincel kabuki em movimentos circulares para acabamento luminoso.",
    ingredients:
      "Aqua, Cyclopentasiloxane, Glycerin, Niacinamide, Rosa Centifolia Extract, Mica, Titanium Dioxide. FPS 15.",
    reviews: [
      {
        id: "r5",
        author: "Beatriz A.",
        rating: 4,
        comment: "Cobertura média com glow natural. Ideal para peles normais a secas.",
        date: "2026-03-20",
      },
    ],
  },
  {
    id: "5",
    slug: "la-mer-creme",
    brand: "LA MER",
    name: "Crème de la Mer Moisturizing Cream",
    price: 1890.0,
    image: "/products/lamer-cream.jpg",
    category: "Skincare",
    howToUse:
      "Aqueça uma pequena quantidade entre as pontas dos dedos até ficar translúcida. Pressione suavemente no rosto e pescoço.",
    ingredients:
      "Algae Extract (Miracle Broth™), Petrolatum, Glycerin, Lime Tea Concentrate, Sesame Seed Oil, Eucalyptus Oil.",
    reviews: [
      {
        id: "r6",
        author: "Patrícia H.",
        rating: 5,
        comment: "Investimento que vale cada centavo. Pele macia e regenerada.",
        date: "2025-12-08",
      },
    ],
  },
  {
    id: "6",
    slug: "nars-orgasm-blush",
    brand: "NARS",
    name: "Blush Orgasm — Edição Iconic",
    price: 279.0,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
    category: "Maquiagem",
    howToUse:
      "Sorria e aplique nas maçãs do rosto com pincel chanfrado. Construa a cor em camadas para intensidade desejada.",
    ingredients:
      "Mica, Talc, Titanium Dioxide, Iron Oxides, Silica, Tocopherol. Acabamento com partículas douradas.",
    reviews: [
      {
        id: "r7",
        author: "Larissa T.",
        rating: 5,
        comment: "O tom pêssego-dourado mais universal que existe.",
        date: "2026-02-14",
      },
    ],
  },
  {
    id: "7",
    slug: "charlotte-tilbury-pillow",
    brand: "CHARLOTTE TILBURY",
    name: "Pillow Talk Lip Cheat Liner",
    price: 219.0,
    image: "/products/charlotte-lip.jpg",
    category: "Maquiagem",
    howToUse:
      "Contorne os lábios seguindo o formato natural. Preencha levemente para prolongar a duração do batom.",
    ingredients:
      "Cyclopentasiloxane, Synthetic Wax, Iron Oxides, Mica, Tocopherol. Longa duração e à prova d'água.",
    reviews: [
      {
        id: "r8",
        author: "Amanda C.",
        rating: 5,
        comment: "Tom nude rosado perfeito. Não borra durante o dia.",
        date: "2026-04-05",
      },
    ],
  },
  {
    id: "8",
    slug: "tom-ford-ombre-leather",
    brand: "TOM FORD",
    name: "Ombré Leather Parfum 50ml",
    price: 1290.0,
    image: "/products/tomford-perfume.jpg",
    category: "Perfumaria",
    howToUse:
      "Duas borrifadas no peito e uma no pulso. Ideal para noite e ocasiões especiais.",
    ingredients:
      "Alcohol Denat., Parfum, Leather Accord, Jasmine Sambac, Patchouli, Amber. Concentração Parfum.",
    reviews: [
      {
        id: "r9",
        author: "Ricardo M.",
        rating: 5,
        comment: "Couro sofisticado sem ser agressivo. Assinatura olfativa marcante.",
        date: "2026-01-30",
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.brand.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
