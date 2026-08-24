import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { Shield, Star, Zap, Cpu, Sparkles, Crown, Globe } from 'lucide-react';

const Logo3D = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isReduced, setIsReduced] = useState(false);
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  useEffect(() => {
    setIsReduced(shouldReduceMotion);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e) => {
    if (!ref.current || isReduced) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const logoSize = isReduced ? "w-32 h-32" : "w-48 h-48 md:w-64 md:h-64";
  const coreSize = isReduced ? "w-16 h-16" : "w-24 h-24 md:w-32 md:h-32";
  const orbitSize = isReduced ? "w-20 h-20" : "w-32 h-32 md:w-48 md:h-48";
  const elementSize = isReduced ? "w-6 h-6" : "w-8 h-8 md:w-12 md:h-12";
  const particleCount = isReduced ? 4 : 12;
  const sparkleCount = isReduced ? 4 : 8;

  return (
    <motion.div
      ref={ref}
      className={`relative ${logoSize} mx-auto mb-8 cursor-pointer`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => !isReduced && setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: !isReduced && isHovered ? rotateX : 0,
        rotateY: !isReduced && isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
    >
      {/* Main 3D Container */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={
          isReduced
            ? {}
            : {
              rotateY: isHovered ? 0 : [0, 360],
              rotateZ: isHovered ? 0 : [0, 5, -5, 0]
            }
        }
        transition={
          isReduced
            ? {}
            : {
              rotateY: { duration: 12, repeat: Infinity, ease: "linear" },
              rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
        }
      >
        {/* Core Sphere */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            transformStyle: 'preserve-3d',
            width: coreSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px',
            height: coreSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px'
          }}
          animate={
            isReduced
              ? {}
              : {
                scale: isHovered ? 1.2 : 1,
                rotateX: [0, 360],
                rotateY: [0, 360]
              }
          }
          transition={
            isReduced
              ? {}
              : {
                scale: { duration: 0.3 },
                rotateX: { duration: 20, repeat: Infinity, ease: "linear" },
                rotateY: { duration: 15, repeat: Infinity, ease: "linear" }
              }
          }
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent animate-shimmer" />
            <div className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, transparent 50%)',
              }}
            />
          </div>
        </motion.div>

        {/* Orbiting Elements */}
        {!isReduced && [...Array(5)].map((_, i) => (
          <motion.div
            key={`orbit-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              transformStyle: 'preserve-3d',
              width: orbitSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px',
              height: orbitSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px',
              transform: `rotateY(${i * 72}deg) rotateX(${i * 36}deg)`
            }}
          >
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                transformStyle: 'preserve-3d',
                width: elementSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px',
                height: elementSize.replace(/w-|h-|md:w-|md:h-/g, '').split(' ')[0] + 'px'
              }}
              animate={{
                rotateY: [0, 360],
                translateZ: [60, 80, 60]
              }}
              transition={{
                rotateY: { duration: 8 + i * 2, repeat: Infinity, ease: "linear" },
                translateZ: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className={`w-full h-full rounded-full flex items-center justify-center ${i === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                i === 1 ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                  i === 2 ? 'bg-gradient-to-br from-pink-400 to-rose-500' :
                    i === 3 ? 'bg-gradient-to-br from-purple-400 to-indigo-500' :
                      'bg-gradient-to-br from-blue-400 to-cyan-500'
                } shadow-lg`}>
                {i === 0 && <Star className="w-4 h-4 md:w-6 md:h-6 text-white" />}
                {i === 1 && <Zap className="w-4 h-4 md:w-6 md:h-6 text-white" />}
                {i === 2 && <Cpu className="w-4 h-4 md:w-6 md:h-6 text-white" />}
                {i === 3 && <Crown className="w-4 h-4 md:w-6 md:h-6 text-white" />}
                {i === 4 && <Globe className="w-4 h-4 md:w-6 md:h-6 text-white" />}
              </div>
            </motion.div>
          </motion.div>
        ))}

        {/* Ring System */}
        {!isReduced && [...Array(3)].map((_, i) => (
          <motion.div
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4"
            style={{
              width: `${isReduced ? 120 + i * 20 : 180 + i * 30}px`,
              height: `${isReduced ? 120 + i * 20 : 180 + i * 30}px`,
              borderColor: i === 0 ? 'rgba(34, 211, 238, 0.6)' :
                i === 1 ? 'rgba(168, 85, 247, 0.4)' :
                  'rgba(251, 146, 60, 0.3)',
              transform: `rotateX(${60 + i * 15}deg) rotateY(${i * 30}deg)`,
              transformStyle: 'preserve-3d'
            }}
            animate={{
              rotateY: [0, 360],
              rotateX: [60 + i * 15, 60 + i * 15 + 20, 60 + i * 15]
            }}
            transition={{
              rotateY: { duration: 15 + i * 5, repeat: Infinity, ease: "linear" },
              rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}

        {/* Floating Particles */}
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
              z: Math.random() * 100 - 50
            }}
            animate={
              isReduced
                ? {}
                : {
                  x: Math.random() * 200 - 100,
                  y: Math.random() * 200 - 100,
                  z: Math.random() * 100 - 50,
                  opacity: [0.3, 1, 0.3]
                }
            }
            transition={
              isReduced
                ? {}
                : {
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2
                }
            }
            style={{
              boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              transform: `translateZ(${Math.random() * 50}px)`
            }}
          />
        ))}

        {/* Sparkles on Hover */}
        {!isReduced && isHovered && [...Array(sparkleCount)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: Math.cos((i * Math.PI * 2) / sparkleCount) * 100,
              y: Math.sin((i * Math.PI * 2) / sparkleCount) * 100
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Sparkles className="w-full h-full text-yellow-400" />
          </motion.div>
        ))}

        {/* Glow Effects */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.4) 0%, rgba(168, 85, 247, 0.2) 50%, transparent 70%)',
            filter: 'blur(30px)',
            transform: 'translateZ(-20px) scale(1.2)'
          }}
          animate={
            isReduced
              ? {}
              : {
                opacity: isHovered ? [0.6, 1, 0.6] : [0.3, 0.6, 0.3],
                scale: isHovered ? [1.2, 1.4, 1.2] : [1.2, 1.3, 1.2]
              }
          }
          transition={
            isReduced
              ? {}
              : {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
          }
        />

        {/* Central 3D Globe */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          animate={
            isReduced
              ? {}
              : {
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }
          }
          transition={{ duration: 0.3 }}
          style={{ perspective: '1000px' }}
        >
          <div className="relative w-12 h-12 md:w-16 md:h-20 lg:w-24 lg:h-24" style={{ transformStyle: 'preserve-3d' }}>
            {/* Globe Container */}
            <motion.div
              className="w-full h-full rounded-full relative overflow-hidden shadow-2xl"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #4a90e2 0%, #1e3c72 40%, #0a1929 100%)',
                boxShadow: 'inset -15px -15px 30px rgba(0,0,0,0.6), 0 0 40px rgba(30, 60, 114, 0.6), inset 5px 5px 15px rgba(135, 206, 250, 0.3)',
                transformStyle: 'preserve-3d'
              }}
              animate={
                isReduced
                  ? {}
                  : {
                    rotateY: [0, 360]
                  }
              }
              transition={
                isReduced
                  ? {}
                  : {
                    rotateY: { duration: 20, repeat: Infinity, ease: "linear" }
                  }
              }
            >
              {/* Sphere surface overlay for 3D effect */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle at 70% 70%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                  transform: 'translateZ(1px)'
                }}
              />

              {/* Continent shapes with 3D positioning */}
              <div className="absolute inset-0 rounded-full overflow-hidden" style={{ transformStyle: 'preserve-3d' }}>
                {/* Africa/Europe continent */}
                <motion.div
                  className="absolute top-8 left-6 w-8 h-12 md:top-10 md:left-8 md:w-12 md:h-16 lg:top-12 lg:left-12 lg:w-16 lg:h-20"
                  style={{
                    background: 'radial-gradient(ellipse, #2d5016 0%, #3a6b1e 50%, #4a7c28 100%)',
                    borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
                    boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    transform: 'translateZ(2px)'
                  }}
                  animate={
                    isReduced
                      ? {}
                      : {
                        rotateZ: [-5, 5, -5]
                      }
                  }
                  transition={{
                    rotateZ: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                  }}
                />

                {/* Americas continent */}
                <motion.div
                  className="absolute top-6 right-4 w-6 h-16 md:top-8 md:right-6 md:w-8 md:h-20 lg:top-10 lg:right-8 lg:w-12 lg:h-24"
                  style={{
                    background: 'radial-gradient(ellipse, #2d5016 0%, #3a6b1e 50%, #4a7c28 100%)',
                    borderRadius: '60% 40% 40% 60% / 40% 60% 40% 60%',
                    boxShadow: 'inset -2px 2px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    transform: 'translateZ(2px)'
                  }}
                  animate={
                    isReduced
                      ? {}
                      : {
                        rotateZ: [5, -5, 5]
                      }
                  }
                  transition={{
                    rotateZ: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                  }}
                />

                {/* Asia continent */}
                <motion.div
                  className="absolute top-4 left-8 w-10 h-8 md:top-6 md:left-12 md:w-14 md:h-12 lg:top-8 lg:left-16 lg:w-20 lg:h-16"
                  style={{
                    background: 'radial-gradient(ellipse, #2d5016 0%, #3a6b1e 50%, #4a7c28 100%)',
                    borderRadius: '50% 50% 40% 60% / 50% 50% 40% 60%',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                    transform: 'translateZ(2px)'
                  }}
                  animate={
                    isReduced
                      ? {}
                      : {
                        scale: [1, 1.05, 1]
                      }
                  }
                  transition={{
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </div>

              {/* Ocean waves with 3D depth */}
              <div className="absolute inset-0 rounded-full opacity-40" style={{ transformStyle: 'preserve-3d' }}>
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={`wave-${i}`}
                    className="absolute inset-0 rounded-full border border-cyan-400"
                    style={{
                      transform: `translateZ(${1 + i * 0.5}px)`,
                      boxShadow: '0 0 10px rgba(135, 206, 250, 0.3)'
                    }}
                    animate={
                      isReduced
                        ? {}
                        : {
                          scale: [1, 1.15, 1],
                          opacity: [0.4, 0.2, 0.4]
                        }
                    }
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>

              {/* Enhanced atmosphere glow for 3D sphere */}
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, rgba(135, 206, 250, 0.6) 0%, transparent 50%, rgba(30, 60, 114, 0.2) 100%)',
                  boxShadow: 'inset -8px -8px 20px rgba(0, 0, 0, 0.4), 0 0 30px rgba(135, 206, 250, 0.4), inset 3px 3px 10px rgba(255, 255, 255, 0.2)',
                  transform: 'translateZ(3px)'
                }}
              />

              {/* Specular highlight for sphere */}
              <div
                className="absolute top-4 left-4 w-6 h-6 md:top-6 md:left-6 md:w-8 md:h-8 lg:top-8 lg:left-8 lg:w-12 lg:h-12 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, transparent 70%)',
                  transform: 'translateZ(4px)',
                  filter: 'blur(1px)'
                }}
              />
            </motion.div>

            {/* Star indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse z-20">
              <Star className="w-2 h-2 md:w-3 md:h-3 text-black" fill="black" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Logo3D;
