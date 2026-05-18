export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  category: string;
  howToUse: string;
  ingredients: string;
  reviews: Review[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
