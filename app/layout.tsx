import { AuthProvider } from "@/providers/AuthProvider";
import SnackbarProviderWrapper from "@/components/SnackbarProviderWrapper";
import "./globals.css";
import { ShopProvider } from "../context/ShopContext";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ShopLoader from "@/components/ShopLoader"; // Import ShopLoader
import { Metadata } from 'next';
import AnalyticsAndPixelInjector from '@/components/AnalyticsAndPixelInjector'; // New import

interface IntegrationSettings {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const host = process.env.NEXT_PUBLIC_API_HOST;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    if (!host || !apiKey) {
      throw new Error('API host or key is not configured for metadata generation.');
    }

    const shopResponse = await fetch(`${apiUrl}/public/api/v1/shop`, {
      headers: {
        'X-Shop-Domain': host,
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    if (!shopResponse.ok) {
      throw new Error(`Failed to fetch shop metadata: ${shopResponse.statusText}`);
    }

    const shop = await shopResponse.json();

    const integrationSettingsResponse = await fetch(`${apiUrl}/public/api/v1/shop/integration-settings`, {
      headers: {
        'X-Shop-Domain': host,
        'Authorization': `Bearer ${apiKey}`,
      },
      next: { revalidate: 3600 } // Revalidate data every hour
    });

    let integrationSettings: IntegrationSettings = { googleAnalyticsId: null, facebookPixelId: null };
    if (integrationSettingsResponse.ok) {
      integrationSettings = await integrationSettingsResponse.json();
    }

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
    console.error("Error generating metadata:", error);
    return {
      title: 'Shop',
      description: 'Welcome to our shop',
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const host = process.env.NEXT_PUBLIC_API_HOST;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  let integrationSettings: IntegrationSettings = { googleAnalyticsId: null, facebookPixelId: null };
  try {
    const integrationSettingsResponse = await fetch(`${apiUrl}/public/api/v1/shop/integration-settings`, {
      headers: {
        'X-Shop-Domain': host!,
        'Authorization': `Bearer ${apiKey}!`, 
      },
      cache: 'no-store' // Ensure fresh data for runtime injection
    });

    if (integrationSettingsResponse.ok) {
      integrationSettings = await integrationSettingsResponse.json();
    }
  } catch (error) {
    console.error("Error fetching integration settings in RootLayout:", error);
  }

  return (
    <html lang="en">
      <body>
        <AnalyticsAndPixelInjector
          googleAnalyticsId={integrationSettings.googleAnalyticsId}
          facebookPixelId={integrationSettings.facebookPixelId}
        />
        <SnackbarProviderWrapper>
          <AuthProvider>
            <ShopProvider>
              <ShopLoader>
                <ClientOnly>
                  <Header />
                </ClientOnly>
                <br /><br /><br />
                {children}
                <Footer />
                <ScrollToTopButton />
              </ShopLoader>
            </ShopProvider>
          </AuthProvider>
        </SnackbarProviderWrapper>
      </body>
    </html>
  );
}