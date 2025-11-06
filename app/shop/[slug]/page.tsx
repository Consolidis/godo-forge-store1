import ProductDetailPageClient from '../../../components/ProductDetailPageClient';
import { Metadata, ResolvingMetadata } from 'next';

interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string; // Assuming a more detailed description
  imageUrl: string;
  price: number;
  variants: ProductVariant[]; // Assuming product has variants
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  sellingPrice?: number;
  image?: string;
  // Add other variant properties like color, size, etc.
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    // fetch data
    const slug = params.slug;
    const product = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/public/api/v1/products/${slug}`).then((res) => res.json());
    const shop = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/public/api/v1/shop`).then((res) => res.json());
   
    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || []
   
    return {
      title: `${product.title} - ${shop.name}`,
      description: product.description,
      openGraph: {
        title: `${product.title} - ${shop.name}`,
        description: product.description,
        images: [product.imageUrl, ...previousImages],
        url: `/shop/${product.slug}`,
        type: 'product',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} - ${shop.name}`,
        description: product.description,
        images: [product.imageUrl],
      },
    }
  } catch (error) {
    return {
      title: 'Product not found',
      description: 'This product is not available',
    };
  }
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  return <ProductDetailPageClient slug={params.slug} />;
}