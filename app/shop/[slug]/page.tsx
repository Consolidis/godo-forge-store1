"use client";

import React, { useEffect, useState } from 'react';
import api from '../../../lib/api';

interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string; // Assuming a more detailed description
  imageUrl: string;
  price: number;
  variants: ProductVariant[]; // Assuming product has variants
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  // Add other variant properties like color, size, etc.
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/public/api/v1/products/${slug}`);
        setProduct(response.data); // Assuming response.data is a single product object
        if (response.data.variants && response.data.variants.length > 0) {
          setSelectedVariant(response.data.variants[0]); // Select first variant by default
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Chargement du produit...
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

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Produit introuvable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <img src={product.imageUrl} alt={product.title} className="w-full h-auto rounded-lg shadow-lg" />
          </div>
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <p className="text-2xl font-bold text-blue-400 mb-6">{(selectedVariant?.sellingPrice || selectedVariant?.price)?.toFixed(2)} $</p>
            <div
              className="text-gray-300 mb-6"
              dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
            />

            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <label htmlFor="variant-select" className="block text-gray-400 text-sm font-bold mb-2">
                  Sélectionner une variante:
                </label>
                <select
                  id="variant-select"
                  className="block appearance-none w-full bg-gray-800 border border-gray-700 text-white py-2 px-3 rounded-md leading-tight focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={selectedVariant?.id || ''}
                  onChange={(e) => {
                    const variant = product.variants.find(v => v.id === e.target.value);
                    if (variant) setSelectedVariant(variant);
                  }}
                >
                  {product.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.name} - {variant.price} €
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
