import React from 'react';

const EagleIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => {
  return (
    <img 
      src="/assets/kizuna_taka_origami_v2_transparent.png" 
      alt="Kizuna Taka"
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
    />
  );
};

export default EagleIcon;
