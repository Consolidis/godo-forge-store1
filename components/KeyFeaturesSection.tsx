import React from 'react';
import { motion } from 'framer-motion';

const KeyFeaturesSection: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16"
        >
          Des fonctionnalités qui vous propulsent.
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <motion.div variants={itemVariants} className="text-center">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2058&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Données Avancées"
              className="mx-auto mb-8 rounded-lg shadow-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Progressez avec les données avancées.</h3>
            <p className="text-gray-400">
              Suivez chaque aspect de votre performance avec une précision inégalée.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center">
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Charge Entraînement"
              className="mx-auto mb-8 rounded-lg shadow-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Votre charge d'entraînement à la trace.</h3>
            <p className="text-gray-400">
              Optimisez vos séances et évitez le surentraînement grâce à un suivi intelligent.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="text-center">
            <img
              src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fréquence Cardiaque"
              className="mx-auto mb-8 rounded-lg shadow-lg"
            />
            <h3 className="text-2xl font-semibold mb-4">Surveillez vos zones de fréquence cardiaque.</h3>
            <p className="text-gray-400">
              Atteignez vos objectifs de fitness en restant toujours dans la bonne zone.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeaturesSection;
