"use client";

import React, { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuth } from "../providers/AuthProvider";

interface ShopInfo {
  name: string;
  themeCustomization: {
    logo: string;
    description: string;
  };
}

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string; // Assuming an imageUrl is available
  price: number; // Assuming a price is available
}

export default function Home() {
  const { isAuthenticated, user, logout } = useAuth();
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shop information
        const shopResponse = await api.get('/public/api/v1/shop');
        setShopInfo(shopResponse.data);

        // Fetch products
        const productsResponse = await api.get('/public/api/v1/products');
        setProducts(productsResponse.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        Erreur: {error}
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      {/* Shop Header Section */}
      <header className="text-center py-8">
        {shopInfo?.themeCustomization?.logo && (
          <img
            src={shopInfo.themeCustomization.logo}
            alt={`${shopInfo.name} Logo`}
            className="mx-auto mb-4 max-h-24"
          />
        )}
        <h1 className="text-5xl font-bold mb-2">{shopInfo?.name || 'Notre Boutique'}</h1>
        {shopInfo?.themeCustomization?.description && (
          <div
            className="text-xl text-gray-300"
            dangerouslySetInnerHTML={{ __html: shopInfo.themeCustomization.description }}
          />
        )}
      </header>

      {/* Authentication Section (if not authenticated) */}
      {!isAuthenticated && (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Connectez-vous ou inscrivez-vous pour une meilleure expérience.</p>
          <div className="flex gap-4 justify-center">
            <a href="/login" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300">
              Se connecter
            </a>
            <a href="/register" className="bg-gray-700 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-300">
              S'inscrire
            </a>
          </div>
        </div>
      )}

      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Nos Produits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                <img src={product.variants?.[0]?.image || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Produit'} alt={product.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-lg font-bold text-blue-400 mb-4">{(product.variants?.[0]?.sellingPrice || product.variants?.[0]?.price)?.toFixed(2)} $</p>
                  <a href={`/shop/${product.slug}`}
                     className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                    Voir les détails
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Authenticated User Info (if authenticated) */}
      {isAuthenticated && (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Bienvenue, {user?.email || 'Utilisateur'}!</h3>
          <button
            onClick={logout}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
}
