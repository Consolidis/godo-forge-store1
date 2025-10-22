import React from 'react';
import { motion } from 'framer-motion';

interface FeatureZoomSectionProps {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  reverse?: boolean; // Optional prop to reverse layout
}

const FeatureZoomSection: React.FC<FeatureZoomSectionProps> = ({
  title,
  description,
  imageUrl,
  imageAlt,
  reverse = false,
}) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } },
  };

  const textVariants = {
    hidden: { opacity: 0, x: reverse ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } },
  };

  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="py-20 bg-black text-white"
    >
      <div
        className={`container mx-auto px-4 flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center justify-between gap-12`}
      >
        <motion.div variants={imageVariants} className="w-full md:w-1/2">
          <img src={imageUrl} alt={imageAlt} className="w-full h-auto rounded-lg shadow-lg" />
        </motion.div>
        <motion.div variants={textVariants} className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg text-gray-300">{description}</p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeatureZoomSection;
