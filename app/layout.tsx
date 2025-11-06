import { AuthProvider } from "@/providers/AuthProvider";
import SnackbarProviderWrapper from "@/components/SnackbarProviderWrapper";
import "./globals.css";
import ShopDataLoader from "../components/ShopDataLoader";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ShopProvider from "./ShopProvider";
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const shop = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/public/api/v1/shop`).then((res) => res.json());

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
            <ShopDataLoader /> {/* Render ShopDataLoader here */}
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