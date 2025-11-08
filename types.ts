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

export interface WishlistItem {
  id: string;
  product: Product; // Assuming Product interface is correct
  createdAt: string;
  updatedAt: string | null;
}

export interface Wishlist {
  id: string;
  shopId: string; // Assuming shop ID is exposed
  customerId: string | null; // Nullable for guest wishlists
  guestToken: string | null; // Nullable for authenticated wishlists
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string | null;
}

export interface Shop {
  id: string;
  name: string;
  domaine: string;
  is_active: boolean;
  shopType: string;
  displayCurrencyCode: string;
  exchangeRates: { [key: string]: number };
}
