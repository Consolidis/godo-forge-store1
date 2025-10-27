"use client";

import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import ClientOnly from "../components/ClientOnly"; // Import ClientOnly
import Footer from "../components/Footer";
import { AuthProvider } from "../providers/AuthProvider";

import SnackbarProviderWrapper from "../components/SnackbarProviderWrapper";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { useShopStore } from "../store/shopStore"; // Import useShopStore
import { useEffect } from "react"; // Import useEffect

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { fetchShop } = useShopStore();

  useEffect(() => {
    const host = window.location.hostname;
    fetchShop(host);
  }, [fetchShop]);

  return (
    <html lang="en">
      <body>
        <SnackbarProviderWrapper>
          <AuthProvider>

          <ClientOnly>
            <Header />
          </ClientOnly>
          <br /><br /><br />
          {children}
          <Footer />
          <ScrollToTopButton />
        </AuthProvider>
        </SnackbarProviderWrapper>
      </body>
    </html>
  );
}