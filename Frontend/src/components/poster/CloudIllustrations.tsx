import React from 'react';
import { motion } from 'framer-motion';

export const CloudIllustrations: React.FC = () => {
  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] flex items-center justify-center">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#4285F4]/20 via-[#FBBC04]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* Floating 3D Cloud Cluster Container */}
      <motion.div
        animate={{
          y: [-5, 6, -5],
          rotate: [-0.5, 0.8, -0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-full"
      >
        <img
          src="/banner-assets/cloud-3d-cubes.png"
          alt="Google Cloud 3D Tech Cluster"
          className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(26,115,232,0.18)]"
          loading="eager"
        />
      </motion.div>

      {/* Decorative Floating Dots & Sparkles */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-3 left-6 w-3 h-3 rounded-full bg-[#FBBC04] shadow-sm pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1, ease: 'easeInOut' }}
        className="absolute bottom-6 right-2 w-2.5 h-2.5 rounded-full bg-[#4285F4] shadow-sm pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
        className="absolute top-1/2 -left-3 w-2 h-2 rounded-full bg-[#34A853] shadow-sm pointer-events-none"
      />
    </div>
  );
};
