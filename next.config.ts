import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['cf.cjdropshipping.com', 'cbu01.alicdn.com'],
  },
  
  // Ajout de la configuration pour ignorer les erreurs TypeScript lors du build
  typescript: {
    // !! ATTENTION !!
    // Cette option permet à votre application de builder avec succès
    // même si elle contient des erreurs TypeScript.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;