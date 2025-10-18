import React from 'react';
import { motion } from 'framer-motion';

type GooseHintProps = {
  text: string;
  visible: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClose?: () => void;
};

const GooseHint: React.FC<GooseHintProps> = ({ text, visible, className, style, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
      transition={{ duration: 0.35 }}
      style={style}
      className={`pointer-events-none fixed z-[9999] ${className || ''}`}
    >
      <div className="relative flex items-end gap-2">
        <div className="max-w-xs bg-white/95 text-slate-900 rounded-xl px-3 py-2 shadow-xl border border-white/60">
          <div className="text-[12px] leading-snug font-medium whitespace-pre-line">{text}</div>
        </div>
        <img src="/images/gaga.gif" alt="gaga" className="w-16 h-16 object-contain drop-shadow-[0_0_18px_rgba(255,255,255,0.4)]" />
        {onClose && (
          <button
            type="button"
            className="absolute -top-2 -right-2 pointer-events-auto bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center border border-white/30"
            onClick={onClose}
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default GooseHint;
