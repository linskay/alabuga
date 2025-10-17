import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type NotificationVariant = 'success' | 'info' | 'warning' | 'error';

interface SystemNotificationProps {
  open: boolean;
  title: string;
  message?: string;
  variant?: NotificationVariant;
  actionLabel?: string;
  onAction?: () => void;
  onClose?: () => void;
  autoCloseMs?: number;
}

const variantClasses: Record<NotificationVariant, { border: string; from: string; to: string; glow: string; icon: JSX.Element }> = {
  success: {
    border: 'border-emerald-400/40',
    from: 'from-emerald-600/30',
    to: 'to-emerald-400/5',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.35)]',
    icon: (
      <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    )
  },
  info: {
    border: 'border-cyan-400/40',
    from: 'from-cyan-600/30',
    to: 'to-cyan-400/5',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.35)]',
    icon: (
      <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8h.01M11 12h2v4h-2z" />
      </svg>
    )
  },
  warning: {
    border: 'border-amber-400/40',
    from: 'from-amber-600/30',
    to: 'to-amber-400/5',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    icon: (
      <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </svg>
    )
  },
  error: {
    border: 'border-rose-400/40',
    from: 'from-rose-600/30',
    to: 'to-rose-400/5',
    glow: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    icon: (
      <svg className="w-5 h-5 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    )
  }
};

const SystemNotification: React.FC<SystemNotificationProps> = ({
  open,
  title,
  message,
  variant = 'info',
  actionLabel,
  onAction,
  onClose,
  autoCloseMs
}) => {
  React.useEffect(() => {
    if (!autoCloseMs || !open) return;
    const t = setTimeout(() => onClose?.(), autoCloseMs);
    return () => clearTimeout(t);
  }, [autoCloseMs, open, onClose]);

  const v = variantClasses[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`fixed bottom-6 right-6 z-[9999] max-w-sm w-[22rem] select-none`}
        >
          <div className={`relative h-auto w-full border ${v.border} rounded-2xl bg-gradient-to-br ${v.from} ${v.to} text-white font-sans p-4 flex flex-col gap-3 backdrop-blur-xl ${v.glow}`}
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)' }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{v.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold leading-6">{title}</h3>
                {message && (
                  <p className="text-sm text-slate-200/90 leading-5 mt-1">{message}</p>
                )}
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="ml-1 p-1 rounded-md text-slate-200/80 hover:text-white hover:bg-white/10 transition"
                  aria-label="Закрыть уведомление"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {(actionLabel && onAction) && (
              <div className="flex items-center justify-end">
                <button
                  onClick={onAction}
                  className="h-9 px-4 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 active:translate-y-[1px] transition flex items-center gap-2"
                >
                  <span className="text-sm font-medium">{actionLabel}</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            )}

            {/* Decorative glow ring */}
            <div className="pointer-events-none absolute -z-10 -inset-2 rounded-3xl opacity-60"
              style={{ background: 'radial-gradient(120% 120% at 80% 0%, rgba(255,255,255,0.08), transparent 60%)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemNotification;


