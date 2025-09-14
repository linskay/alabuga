import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParallaxBackgroundProps {
  scrollY: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ scrollY }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800" />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-cyan-500/20"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
            'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
            'linear-gradient(225deg, rgba(59, 130, 246, 0.2), rgba(6, 182, 212, 0.2))',
            'linear-gradient(315deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Large geometric shapes for depth */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 border border-blue-400/10 rounded-full"
        style={{
          x: mousePosition.x * 0.05,
          y: mousePosition.y * 0.05,
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 30, repeat: Infinity, ease: "linear" },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-48 h-48 border border-cyan-400/10 rounded-lg"
        style={{
          x: mousePosition.x * -0.03,
          y: mousePosition.y * 0.03,
        }}
        animate={{
          rotate: -360,
          scale: [1, 0.9, 1],
        }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      />

      <motion.div
        className="absolute bottom-40 left-1/3 w-32 h-32 border border-white/5 rounded-full"
        style={{
          x: mousePosition.x * 0.04,
          y: mousePosition.y * -0.04,
        }}
        animate={{
          rotate: 180,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
      />
    </div>
  );
};

export default ParallaxBackground;