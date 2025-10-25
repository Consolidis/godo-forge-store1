import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import ClientOnly from "../components/ClientOnly"; // Import ClientOnly
import Footer from "../components/Footer";
import { AuthProvider } from "../providers/AuthProvider";

import SnackbarProviderWrapper from "../components/SnackbarProviderWrapper";
import ScrollToTopButton from "../components/ScrollToTopButton";

export const metadata: Metadata = {
  title: "Watchtech",
  description: "Découvrez Watchtech, la montre intelligente qui redéfinit la puissance et le style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="pt-20">
        <SnackbarProviderWrapper>
          <AuthProvider>

          <ClientOnly>
            <Header />
          </ClientOnly>
          {children}
          <Footer />
          <ScrollToTopButton />
        </AuthProvider>
        </SnackbarProviderWrapper>
      </body>
    </html>
  );
}