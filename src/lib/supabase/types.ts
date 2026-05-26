export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  image_url: string | null;
  category_id: string | null;
  how_to_use: string | null;
  ingredients: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductWithCategory = Product & {
  category: Pick<Category, "id" | "name" | "slug"> | null;
};

export type Review = {
  id: string;
  product_id: string;
  author: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  notes: string | null;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  brand: string | null;
  name: string | null;
  unit_price: number;
  quantity: number;
};

export type CartItem = {
  product: Pick<Product, "id" | "slug" | "brand" | "name" | "price" | "image_url">;
  quantity: number;
};

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function productImageUrl(product: Pick<Product, "image_url">): string {
  return product.image_url || "/products/placeholder.svg";
}
