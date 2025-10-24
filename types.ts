export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  stockQuantity: number;
  options: Record<string, string> | null;
  providerVariantId: string | null;
  name: string | null;
  image: string | null;
  sellingPrice: number | null;
  createdAt: string;
  updatedAt: string | null;
  color?: string;
  colorName?: string;
  stock?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  isPublished: boolean;
  variants: ProductVariant[];
  description?: string;
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}
