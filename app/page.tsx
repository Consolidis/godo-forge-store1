import HomePageClient from '../components/HomePageClient';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shop = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/public/api/v1/shop`).then((res) => res.json());

    return {
      title: `Home - ${shop.name}`,
      description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
      openGraph: {
        title: `Home - ${shop.name}`,
        description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
        images: [shop.themeCustomization.logo],
      },
      twitter: {
        card: 'summary_large_image',
        title: `Home - ${shop.name}`,
        description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
        images: [shop.themeCustomization.logo],
      },
    };
  } catch (error) {
    return {
      title: 'Home',
      description: 'Welcome to our shop',
    };
  }
}

export default function Home() {
  return <HomePageClient />;
}