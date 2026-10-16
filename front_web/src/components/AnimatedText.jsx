import { motion } from 'motion/react';

export const AnimatedText = ({ text = "SA Technologies", className = "", fontFamily = "'Inter', sans-serif", fontWeight = 700, delay = 0.05 }) => {
  const words = text.split(' ');
  
  return (
    <span className={`inline-flex items-baseline ${className}`} style={{ fontFamily, fontWeight }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-flex">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: (wordIndex * word.length + charIndex) * delay,
                ease: 'easeOut'
              }}
              style={{ display: 'inline-block', fontFamily, fontWeight }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block w-2" />}
        </span>
      ))}
    </span>
  );
};

export const AnimatedTextReveal = ({ text = "SA Technologies", className = "", fontFamily = "'Inter', sans-serif", fontWeight = 700, delay = 0.04 }) => {
  return (
    <motion.span
      className={className}
      style={{ fontFamily, fontWeight }}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 'auto' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <AnimatedText text={text} fontFamily={fontFamily} fontWeight={fontWeight} delay={delay} />
    </motion.span>
  );
};