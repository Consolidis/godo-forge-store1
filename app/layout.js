import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

// This is a Server Component layout
export async function generateMetadata() {
  const headersList = headers();
  const host = headersList.get("host") || "localhost";

  // Fetch shop info from your API
  // This is a simplified example, you might need a dedicated server-side API client
  let shopInfo = null;
  try {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";
    const response = await fetch(`${apiBaseUrl}/public/api/v1/shop`, {
      headers: {
        "X-Shop-Domain": host,
      },
      cache: "no-store", // Ensure fresh data on each request
    });
    if (response.ok) {
      shopInfo = await response.json();
    }
  } catch (error) {
    console.error("Error fetching shop info for metadata:", error);
  }

  const title = shopInfo?.name || "GoDo-Forge.com";
  const description = shopInfo?.description || "Découvrez notre collection exclusive de montres intelligentes qui allient technologie de pointe et design raffiné";

  return {
    title: title,
    description: description,
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
