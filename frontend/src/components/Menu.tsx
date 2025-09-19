import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MenuHeader from './MenuHeader';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-slate-900/95 backdrop-blur-xl"
        >
          {/* Menu Header */}
          <MenuHeader 
            onMenuToggle={onClose} 
            isMenuOpen={isOpen}
          />

          {/* Menu Content */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center h-full pt-20 px-4"
          >
            <div className="text-center space-y-8">
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-white bg-clip-text text-transparent mb-8"
              >
                Навигация
              </motion.h2>

              <div className="space-y-6">
                {[
                  { name: 'Главная', href: '#' },
                  { name: 'О нас', href: '#' },
                  { name: 'Услуги', href: '#' },
                  { name: 'Контакты', href: '#' },
                ].map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="block text-2xl sm:text-3xl text-white/80 hover:text-white transition-colors duration-300 hover:scale-105"
                    whileHover={{ scale: 1.05, x: 10 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Menu;
