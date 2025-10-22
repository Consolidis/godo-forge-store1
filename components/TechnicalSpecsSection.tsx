import React from 'react';
import { motion } from 'framer-motion';

const TechnicalSpecsSection: React.FC = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl font-bold mb-12"
        >
          Spécifications Techniques
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={itemVariants} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Autonomie</h3>
            <p className="text-lg text-gray-300">Jusqu'à 36 heures en utilisation normale.</p>
            <p className="text-lg text-gray-300">Jusqu'à 18 heures avec l'affichage permanent activé.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Matériaux</h3>
            <p className="text-lg text-gray-300">Boîtier en titane de qualité aérospatiale.</p>
            <p className="text-lg text-gray-300">Verre saphir ultra-résistant aux rayures.</p>
          </motion.div>
          <motion.div variants={itemVariants} className="p-6 bg-gray-800 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">Capteurs</h3>
            <p className="text-lg text-gray-300">Capteur de fréquence cardiaque optique de 3e génération.</p>
            <p className="text-lg text-gray-300">Capteur de température, ECG, Boussole, GPS de précision.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalSpecsSection;
