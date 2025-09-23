import React from 'react';
import { motion } from 'framer-motion';

interface ActivityDataPoint {
  day: string;
  value: number;
}

interface ActivityCardProps {
  title?: string;
  totalValue: string;
  data: ActivityDataPoint[];
  className?: string;
  ranges?: string[];
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title = 'АКТИВНОСТЬ',
  totalValue,
  data,
  className = '',
  ranges = ['Неделя', 'Месяц', 'Год']
}) => {
  const maxValue = React.useMemo(() => data.reduce((m, d) => Math.max(m, d.value), 0), [data]);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(ranges[0]);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current && menuRef.current.contains(t)) return;
      if (triggerRef.current && triggerRef.current.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);

  const chartVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0, transformOrigin: 'bottom' as const },
    visible: { scaleY: 1, opacity: 1, transformOrigin: 'bottom' as const, transition: { duration: 0.5, ease: 'easeInOut' as const } }
  };

  return (
    <div
      className={`relative rounded-2xl p-5 overflow-hidden max-w-sm ${className}`}
      style={{
        background: 'radial-gradient(120% 120% at 50% 30%, rgba(0,174,239,0.18), rgba(0,174,239,0.10) 45%, rgba(10,12,20,0.85) 75%)',
        border: '1px solid rgba(0,174,239,0.35)',
        boxShadow: '0 0 24px rgba(0,174,239,0.12)'
      }}
      aria-labelledby="activity-card-title"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 id="activity-card-title" className="text-cyan-400 font-bold text-lg tracking-wide">
          {title}
        </h3>
        <div className="relative">
          <button
            ref={triggerRef}
            className="text-xs text-cyan-200/90 hover:text-white/90 bg-cyan-400/10 border border-cyan-300/30 rounded-md px-2 py-1 flex items-center gap-1"
            onClick={() => setOpen(v => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
          >
            {selected}
            <span aria-hidden>▾</span>
          </button>
          {open && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-1 min-w-[7rem] rounded-md border border-cyan-300/30 bg-[#0a0c14]/95 shadow-lg z-20"
              role="listbox"
            >
              {ranges.map(r => (
                <button
                  key={r}
                  className={`w-full text-left text-xs px-3 py-2 hover:bg-cyan-400/10 ${r === selected ? 'text-cyan-300' : 'text-cyan-100/90'}`}
                  onClick={() => { setSelected(r); setOpen(false); }}
                  role="option"
                  aria-selected={r === selected}
                >
                  {r}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="flex flex-col min-w-[8rem]">
          <p className="text-4xl font-extrabold tracking-tight text-white">{totalValue}</p>
          <div className="flex items-center gap-1 text-xs text-emerald-400">
            <span>▲</span>
            <span>+12% за прошлую неделю</span>
          </div>
        </div>

        <motion.div
          className="flex h-28 w-full items-end justify-between gap-2"
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          aria-label="График активности"
        >
          {data.map((item, idx) => (
            <div key={idx} className="flex h-full w-full flex-col items-center justify-end gap-2" role="presentation">
              <motion.div
                className="w-full rounded-md"
                style={{
                  height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                  background: 'linear-gradient(180deg, rgba(0,225,255,0.95), rgba(0,174,239,0.85))',
                  boxShadow: '0 0 12px rgba(0,225,255,0.35)'
                }}
                variants={barVariants}
                aria-label={`${item.day}: ${item.value}`}
              />
              <span className="text-[10px] text-cyan-200/80">
                {item.day}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ActivityCard;


