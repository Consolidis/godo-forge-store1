import { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/public/api/v1/products`).then((res) => res.json());

  const productEntries: MetadataRoute.Sitemap = products.map((product: { slug: string; updatedAt: string }) => ({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/shop/${product.slug}`,
    lastModified: new Date(product.updatedAt),
  }));

  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
    },
    ...productEntries,
  ]
}