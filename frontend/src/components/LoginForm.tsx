import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { backend } from '../api';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) {
      setError('Введите логин');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await backend.auth.login(login.trim(), password);
      
      if (response.success) {
        // Сохраняем данные пользователя
        localStorage.setItem('currentLogin', login.trim());
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        
        // Уведомляем о успешном входе
        window.dispatchEvent(new Event('auth:login'));
        window.location.reload();
      } else {
        setError('Ошибка входа в систему');
      }
    } catch (err: any) {
      console.error('Ошибка аутентификации:', err);
      setError(err?.response?.data?.message || err?.message || 'Ошибка входа в систему');
    } finally {
      setLoading(false);
    }
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

        {/* Отображение ошибок */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 text-sm text-center p-2 bg-red-900/20 rounded-lg border border-red-500/30"
          >
            {error}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl ${
            loading 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400'
          }`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? 'Вход...' : 'Продолжить'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default LoginForm;
