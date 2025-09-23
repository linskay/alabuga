import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CosmicProgressBarProps {
  value?: number;
  maxValue?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
  color?: string;
}

const CosmicProgressBar: React.FC<CosmicProgressBarProps> = ({
  value = 65,
  maxValue = 100,
  size = "md",
  showValue = true,
  animated = true,
  className,
  label = "Progress",
  color = "from-purple-500 via-pink-500 to-cyan-500"
}) => {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min((animatedValue / maxValue) * 100, 100);

  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {/* Label and Value */}
      <div className="flex justify-between items-center">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`font-semibold text-white ${textSizeClasses[size]} flex-1`}
        >
          {label}
        </motion.span>
        {showValue && (
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent ${textSizeClasses[size]} ml-4`}
          >
            {Math.round(animatedValue)}/{maxValue}
          </motion.span>
        )}
      </div>

      {/* Progress Bar Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.95 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="relative group w-full"
      >
        {/* Cosmic Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        
        {/* Outer Glow Ring */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 rounded-full blur-md opacity-20 animate-pulse" />
        
        {/* Progress Track */}
        <div
          className={`relative bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-600/50 overflow-hidden w-full ${sizeClasses[size]}`}
          style={{ width: '100%' }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/40" />
          
          {/* Animated Stars Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          {/* Progress Fill */}
          <motion.div
            className={`relative h-full bg-gradient-to-r ${color} rounded-full overflow-hidden`}
            initial={{ width: "0%" }}
            animate={{ width: `${percentage}%` }}
            transition={{
              duration: animated ? 2 : 0,
              ease: "easeOut",
              delay: 0.5,
            }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut",
              }}
            />
            
            {/* Cosmic Particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    left: `${10 + i * 15}%`,
                    top: "50%",
                  }}
                  animate={{
                    y: [-2, 2, -2],
                    opacity: [0.5, 1, 0.5],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Progress Head Glow */}
            <div className="absolute right-0 top-0 h-full w-4 bg-gradient-to-l from-white/50 to-transparent" />
          </motion.div>

          {/* Cosmic Energy Pulse */}
          <AnimatePresence>
            {percentage > 0 && (
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"
                style={{ right: `${100 - percentage}%` }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Floating Cosmic Orbs */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: size === "lg" ? "-8px" : "-6px",
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.div>

    </div>
  );
};

export default CosmicProgressBar;
