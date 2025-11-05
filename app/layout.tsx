import { AuthProvider } from "@/providers/AuthProvider";
import SnackbarProviderWrapper from "@/components/SnackbarProviderWrapper";
import "./globals.css";
import ShopDataLoader from "../components/ShopDataLoader";
import ClientOnly from "@/components/ClientOnly";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import ShopProvider from "./ShopProvider";

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
              <br />
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