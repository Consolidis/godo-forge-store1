import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Placeholder for background image/video */}
      <motion.img
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        src="https://images.unsplash.com/photo-1612817288484-6f9160067419?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Watchtech Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="relative z-10 text-center p-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
        >
          Puissance. Record.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="text-xl md:text-2xl mb-8"
        >
          Découvrez la montre intelligente qui redéfinit vos limites.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
        >
          Acheter
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;

