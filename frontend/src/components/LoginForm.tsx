import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { backend } from '../api';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login.trim()) return setError('Введите логин');
    if (!password) return setError('Введите пароль');
    
    setLoading(true);
    setError('');
    
    try {
      const response = await backend.auth.login(login.trim(), password);
      
      if (response.success) {
        localStorage.setItem('currentLogin', login.trim());
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        if (remember) {
          try { localStorage.setItem('rememberMe', '1'); } catch {}
        } else {
          try { localStorage.removeItem('rememberMe'); } catch {}
        }
        
        window.location.hash = '#dashboard';
        window.dispatchEvent(new Event('auth:login'));
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
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="relative overflow-hidden bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-[0_20px_80px_rgba(2,6,23,0.75)] min-w-80 w-[24rem]"
    >
      {/* Neon gradient border */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
        padding: 1,
        background: 'linear-gradient(135deg, rgba(37,99,235,0.35), rgba(168,85,247,0.35), rgba(20,184,166,0.35))'
      }} />
      <div className="pointer-events-none absolute inset-[1px] rounded-[0.95rem] bg-slate-950/50" />

      {/* Soft inner glow */}
      <div className="pointer-events-none absolute -inset-8 opacity-60" style={{
        background: 'radial-gradient(60% 40% at 80% 0%, rgba(59,130,246,0.12), transparent 70%), radial-gradient(50% 35% at 0% 100%, rgba(168,85,247,0.12), transparent 70%)'
      }} />

      {/* Floating glow particles */}
      <div className="pointer-events-none absolute -z-10 -inset-10"
           style={{ background: 'radial-gradient(120% 120% at 20% -10%, rgba(255,255,255,0.06), transparent 60%)' }} />

      <form className="space-y-5" onSubmit={handleSubmit}>
        <motion.div
          className="text-center mb-2"
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <h3 className="text-2xl font-semibold text-white tracking-tight drop-shadow-[0_0_12px_rgba(59,130,246,0.35)]">Вход</h3>
          <p className="text-sm text-white/70 mt-1">Авторизуйтесь, чтобы продолжить</p>
        </motion.div>

        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <input
            type="text"
            id="login"
            value={login}
            onChange={e => setLogin(e.target.value)}
            className="peer w-full px-4 pt-5 pb-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition"
            placeholder="Имя пользователя"
            autoComplete="username"
          />
          <label htmlFor="login" className="absolute left-4 top-2 text-[12px] tracking-wide text-white/60 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-[12px] peer-focus:text-white transition-all">
            Имя пользователя
          </label>
        </motion.div>

        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="relative"
        >
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="peer w-full pr-12 px-4 pt-5 pb-2 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-400/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] transition"
            placeholder="Пароль"
            autoComplete="current-password"
          />
          <label htmlFor="password" className="absolute left-4 top-2 text-[12px] tracking-wide text-white/60 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/50 peer-focus:top-2 peer-focus:text-[12px] peer-focus:text-white transition-all">
            Пароль
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition"
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.46-1.04 1.1-2.05 1.9-3M10.58 10.58a2 2 0 0 0 2.84 2.84M6.1 6.1 1 1m22 22-5.1-5.1M9.88 9.88 4.12 4.12M14.12 14.12 19.88 19.88" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-rose-300 text-sm text-center p-2 bg-rose-900/20 rounded-lg border border-rose-500/30"
          >
            {error}
          </motion.div>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 select-none text-white/80">
            <input
              type="checkbox"
              className="appearance-none w-4 h-4 rounded border border-white/20 bg-white/10 checked:bg-cyan-500 checked:border-cyan-400 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] transition"
              checked={remember}
              onChange={() => setRemember(v => !v)}
            />
            Запомнить меня
          </label>
          <span className="text-white/50 hover:text-white/70 transition select-none">Забыли пароль?</span>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          className={`relative overflow-hidden w-full h-11 font-semibold rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(59,130,246,0.25)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.35)] ${
            loading 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-500 text-white hover:from-cyan-400 hover:via-blue-500 hover:to-violet-400'
          }`}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.99 } : {}}
        >
          {loading ? 'Вход...' : 'Войти'}
        </motion.button>

        <div className="text-center text-[11px] text-white/60 pt-1">
          Тестовые данные: <span className="text-white">admin/admin</span> или <span className="text-white">user/user</span>
        </div>
      </form>
    </motion.div>
  );
};

export default LoginForm;
