"use client";

import React, { useEffect, useState } from 'react';
import api from '../../lib/api';

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string; // Assuming an imageUrl is available
  price: number; // Assuming a price is available
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/public/api/v1/products');
        setProducts(response.data); // Assuming response.data is an array of products
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement des produits...
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
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-12">Notre Collection</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
              <img src={product.imageUrl || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Produit'} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
                <div
                  className="text-gray-400 text-sm mb-4"
                  dangerouslySetInnerHTML={{ __html: product.description.substring(0, 100) + '...' }}
                />
                <p className="text-lg font-bold text-blue-400 mb-4">{product.price} €</p>
                <a href={`/shop/${product.slug}`}
                   className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                  Voir les détails
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
