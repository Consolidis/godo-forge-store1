"use client";

import React from 'react';
import { useShop } from '@/context/ShopContext';

const Footer: React.FC = () => {
  const { shop, loading: shopLoading } = useShop();
  const shopName = shopLoading ? '...' : (shop?.name || 'godoforge.com'); // Fallback to default name

  return (
    <footer className="bg-black text-gray-400 py-8 text-center">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} {shopName}. All rights reserved.</p>
        <br />
        {/* <div className="flex justify-center space-x-4 mt-4">
          <a href="#" className="hover:text-white">Contact</a> &nbsp; | &nbsp;
          <a href="#" className="hover:text-white">FAQ</a> &nbsp; | &nbsp;
          <a href="#" className="hover:text-white">Privacy Policy</a> &nbsp; | &nbsp;
          <a href="#" className="hover:text-white">Social Media</a>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;