import React from 'react';
import { motion } from 'framer-motion';

const EagleSpinner = ({ size = 64, className = "" }: { size?: number, className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      
      {/* Outer Radar Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border-t border-l border-red-600/30 border-dashed"
        style={{ width: size * 1.5, height: size * 1.5 }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute rounded-full border-b border-r border-red-500/20"
        style={{ width: size * 1.25, height: size * 1.25 }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-red-600/5 blur-xl pointer-events-none"
      />

      {/* Flappy / Bobbing Eagle */}
      <motion.div
        animate={{ 
          y: [-size * 0.08, size * 0.08, -size * 0.08],
          scale: [0.95, 1.05, 0.95]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img 
          src="/assets/kizuna_taka_origami_v2_transparent.png" 
          alt="Loading..."
          className="object-contain filter drop-shadow-[0_0_15px_rgba(220,38,38,0.3)] animate-pulse"
          style={{ width: size, height: size }}
        />
      </motion.div>

    </div>
  );
};

export default EagleSpinner;
