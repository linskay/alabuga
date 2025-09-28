import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login) return;
    localStorage.setItem('currentLogin', login);
    // Простая авторизация без бэкенда: сохраняем логин и обновляем UI
    window.dispatchEvent(new Event('auth:login'));
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-slate-800/95 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-2xl min-w-80"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <motion.h3
          className="text-xl font-semibold text-white text-center mb-6"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Вход в систему
        </motion.h3>

        <motion.input
          type="text"
          placeholder="Имя пользователя"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          value={login}
          onChange={e => setLogin(e.target.value)}
        />

        <motion.input
          type="password"
          placeholder="Пароль"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <motion.button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Продолжить
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
