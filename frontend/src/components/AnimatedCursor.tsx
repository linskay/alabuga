import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.onclick) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseEnter);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseEnter);
      window.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor - White border circle */}
      <motion.div
        className="fixed w-28 h-28 border-3 border-white rounded-full pointer-events-none z-50"
        style={{
          left: mousePosition.x - 56,
          top: mousePosition.y - 56,
        }}
        animate={{
          scale: isHovering ? 1.3 : isClicking ? 0.9 : 1,
          opacity: isHovering ? 1 : 0.9,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      />

      {/* Cursor trail - White border */}
      <motion.div
        className="fixed w-40 h-40 border border-white/50 rounded-full pointer-events-none z-40"
        style={{
          left: mousePosition.x - 80,
          top: mousePosition.y - 80,
        }}
        animate={{
          scale: isHovering ? 1.1 : 1,
          opacity: isHovering ? 0.5 : 0.2,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 25,
        }}
      />

      {/* Cursor text - White text */}
      <motion.div
        className="fixed text-white text-base font-bold pointer-events-none z-50"
        style={{
          left: mousePosition.x - 24,
          top: mousePosition.y - 12,
        }}
        animate={{
          opacity: isHovering ? 1 : 0.9,
          scale: isHovering ? 1.1 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        КРУТИ
      </motion.div>
    </>
  );
};

export default AnimatedCursor;
