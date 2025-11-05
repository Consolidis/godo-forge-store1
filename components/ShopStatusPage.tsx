"use client";

import React from 'react';

interface ShopStatusPageProps {
  message: string;
  reason?: string;
}

const ShopStatusPage: React.FC<ShopStatusPageProps> = ({ message, reason }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-premium-black text-white p-4">
      <div className="bg-premium-gray-900 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4">
          {message}
        </h1>
        {reason && (
          <p className="text-base mb-6">
            {reason}
          </p>
        )}
        <button 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          onClick={() => window.location.reload()}
        >
          Reload Page
        </button>
      </div>
    </div>
  );
};

export default ShopStatusPage;
