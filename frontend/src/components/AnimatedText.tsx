import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedText: React.FC = () => {
  const fullText = "Ты — курсант Академии Звёздного Симбиоза, основанной в орбитальном городе Алабуга.TECH. Главная цель: подготовить команду исследователей и лидеров, которые откроют новые миры для Федерации. Каждый игрок проходит путь от Рядового Искателя до Командира Колонии, выполняя миссии, зарабатывая артефакты и прокачивая навыки.";
  
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (currentIndex < fullText.length && isTyping) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 40); 

      return () => clearTimeout(timeout);
    } else if (currentIndex >= fullText.length) {
      setTimeout(() => {
        setIsTyping(false);
        setShowCursor(false);
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }, 1000);
    }
  }, [currentIndex, isTyping, fullText]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-4xl px-8 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="text-center">
            <motion.div
              className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed"
              style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8), 0 0 10px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 0 5px rgba(0, 0, 0, 0.5))'
              }}
            >
              {displayedText}
              {showCursor && (
                <motion.span
                  className="inline-block w-0.5 h-6 bg-white ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedText;
