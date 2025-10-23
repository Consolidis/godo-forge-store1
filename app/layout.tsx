import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthProvider } from "../providers/AuthProvider";
import ClientAuthInitializer from "../components/ClientAuthInitializer";

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
        <AuthProvider>
          <ClientAuthInitializer />
          <Header />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}