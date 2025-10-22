"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-black text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors duration-300">
          Watchtech
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:text-blue-400 transition-colors duration-300">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-blue-400 transition-colors duration-300">
                Boutique
              </Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="text-white hover:text-blue-400 transition-colors duration-300"
            >
              Se déconnecter
            </button>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-blue-400 transition-colors duration-300">
                Se connecter
              </Link>
              <Link href="/register" className="text-white hover:text-blue-400 transition-colors duration-300">
                S'inscrire
              </Link>
            </>
          )}
          {/* Cart Icon */}
          <Link href="/cart" className="text-white hover:text-blue-400 transition-colors duration-300">
            {/* Placeholder for cart icon */}
            🛒
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
