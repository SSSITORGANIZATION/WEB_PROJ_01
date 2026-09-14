import React from 'react';
import { motion } from 'motion/react';

const Logo3D = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96"
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Globe */}
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #4a90e2 0%, #1e3c72 40%, #0a1929 100%)',
            boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.6), 0 0 50px rgba(30, 60, 114, 0.6), inset 10px 10px 20px rgba(135, 206, 250, 0.3)',
          }}
        >
          {/* Ocean grid lines */}
          <div className="absolute inset-0 rounded-full opacity-30">
            {[...Array(6)].map((_, i) => (
              <div
                key={`lat-${i}`}
                className="absolute w-full border border-cyan-400"
                style={{
                  top: `${15 + (i * 14)}%`,
                  transform: `rotateY(${i * 5}deg)`,
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`lon-${i}`}
                className="absolute h-full border border-cyan-400"
                style={{
                  left: `${10 + (i * 11)}%`,
                  transform: `rotateX(${i * 5}deg)`,
                }}
              />
            ))}
          </div>

          {/* Atmosphere glow */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(135, 206, 250, 0.4) 0%, transparent 50%, rgba(30, 60, 114, 0.2) 100%)',
              boxShadow: 'inset -10px -10px 25px rgba(0, 0, 0, 0.4), 0 0 40px rgba(135, 206, 250, 0.3), inset 5px 5px 12px rgba(255, 255, 255, 0.2)',
            }}
          />

          {/* Specular highlight */}
          <div
            className="absolute top-6 left-6 w-12 h-12 md:top-8 md:left-8 md:w-16 md:h-16 lg:top-10 lg:left-10 lg:w-20 lg:h-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 30%, transparent 70%)',
              filter: 'blur(2px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Logo3D;
