import { AuthProvider } from "@/providers/AuthProvider";
import SnackbarProviderWrapper from "@/components/SnackbarProviderWrapper";
import "./globals.css";
import { ShopProvider } from "../context/ShopContext";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const host = process.env.NEXT_PUBLIC_API_HOST;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    if (!host || !apiKey) {
      throw new Error('API host or key is not configured for metadata generation.');
    }

    const response = await fetch(`${apiUrl}/public/api/v1/shop`, {
      headers: {
        'X-Shop-Domain': host,
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch shop metadata: ${response.statusText}`);
    }

    const shop = await response.json();

    return {
      title: {
        template: `%s - ${shop.name}`,
        default: shop.name,
      },
      description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
      openGraph: {
        title: shop.name,
        description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
        images: [shop.themeCustomization.logo],
      },
      twitter: {
        card: 'summary_large_image',
        title: shop.name,
        description: shop.themeCustomization.description || `Welcome to ${shop.name}`,
        images: [shop.themeCustomization.logo],
      },
    };
  } catch (error) {
    return {
      title: 'Shop',
      description: 'Welcome to our shop',
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SnackbarProviderWrapper>
          <AuthProvider>
            <ShopProvider>
              <ClientOnly>
                <Header />
              </ClientOnly>
              <br /><br /><br />
              {children}
              <Footer />
              <ScrollToTopButton />
            </ShopProvider>
          </AuthProvider>
        </SnackbarProviderWrapper>
      </body>
    </html>
  );
}