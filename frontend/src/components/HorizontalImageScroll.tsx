import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type ProgressBarProps = {
  value: number;
  height?: number;
  rounded?: boolean;
  label?: string;
};

const clamp = (v: number) => Math.max(0, Math.min(100, v));

const BlueWhiteProgressBar: React.FC<ProgressBarProps> = ({
  value,
  height = 6,
  rounded = true,
  label,
}) => {
  const percent = clamp(value);
  const widthPercent = percent + "%";

  return (
    <div className="w-full">
      {label && <div className="mb-1 text-xs text-white/70 font-medium">{label}</div>}
      <div
        className={`relative overflow-hidden bg-gradient-to-r from-white/20 via-white/30 to-white/20 backdrop-blur-sm ${
          rounded ? "rounded-full" : "rounded"
        }`}
        style={{ height }}
      >
        <motion.div
          className="absolute top-0 bottom-0 left-1/2"
          style={{
            width: 0,
            transform: "translateX(-50%)",
          }}
          animate={{ width: widthPercent }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
        >
          <div
            className="h-full relative overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, #2563eb 0%, #3b82f6 25%, #93c5fd 50%, #3b82f6 75%, #2563eb 100%)",
              borderRadius: rounded ? "9999px" : undefined,
              boxShadow: "0 0 10px rgba(147,197,253,0.6)",
            }}
          >
            {/* белое сияние */}
            <motion.div
              className="absolute top-0 bottom-0 left-0 w-1/3 opacity-40"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const HorizontalImageScroll: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imageOffset, setImageOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const currentScroll = container.scrollLeft;
        const progress = maxScroll > 0 ? currentScroll / maxScroll : 0;
        
        setScrollProgress(progress);
        // Для видео 3840x2160: растягиваем видео в 1.5 раза для создания горизонтального скролла
        // Максимальное смещение = ширина растянутого видео - ширина экрана
        const videoWidth = (3840 * window.innerHeight) / 2160 * 1.5; // Ширина видео в пикселях (растянуто в 1.5 раза)
        const maxOffset = videoWidth - window.innerWidth; // Максимальное смещение
        setImageOffset(-progress * maxOffset);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (scrollRef.current) {
        const container = scrollRef.current;
        const scrollAmount = e.deltaY * 0.5; // Делаем прокрутку медленнее
        container.scrollLeft += scrollAmount;
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, []);

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Progress Bar - 150px from bottom */}
      <div className="fixed left-1/2 z-50" style={{ 
        width: 'min(400px, 80vw)',
        transform: 'translateX(-50%)',
        bottom: '150px'
      }}>
        <BlueWhiteProgressBar 
          value={scrollProgress * 100} 
          height={4}
        />
      </div>

      {/* Fixed Background Video that moves with scroll */}
      <motion.div
        className="fixed inset-0 h-full overflow-hidden"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`, // Ширина видео в пикселях (растянуто в 1.5 раза)
          x: imageOffset
        }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          style={{
            width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`, // Ширина видео в пикселях (растянуто в 1.5 раза)
            height: '100vh',
            objectPosition: 'left center'
          }}
        >
          <source src="/images/0_Space_Galaxy_3840x2160.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Parallax Layer 1 - Background elements moving slower */}
      <motion.div
        className="fixed inset-0 h-full pointer-events-none"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`,
          x: imageOffset * 0.3, // Движется медленнее основного фона
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: '800px 800px, 600px 600px',
          backgroundPosition: '0% 0%, 100% 100%'
        }}
      />


      {/* Parallax Layer 3 - Foreground elements moving faster */}
      <motion.div
        className="fixed inset-0 h-full pointer-events-none"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`,
          x: imageOffset * 1.2, // Движется быстрее основного фона
          backgroundImage: `
            radial-gradient(circle at 60% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.08) 0%, transparent 40%)
          `,
          backgroundSize: '400px 400px, 300px 300px',
          backgroundPosition: '20% 20%, 80% 80%'
        }}
      />

      {/* Animated Smoke Overlay */}
      <motion.div
        className="fixed inset-0 h-full pointer-events-none"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`,
          x: imageOffset * 0.8 // Дым движется немного медленнее основного фона
        }}
      >
        {/* Smoke Layer 1 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-blue-300/15 to-white/25"
          animate={{
            opacity: [0.5, 0.9, 0.5],
            x: [-20, 20, -20],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Smoke Layer 2 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-blue-500/25 via-cyan-200/20 to-white/30"
          animate={{
            opacity: [0.6, 1, 0.6],
            x: [15, -15, 15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Smoke Layer 3 */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-sky-400/18 via-blue-200/25 to-white/35"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </motion.div>

      {/* Static Grid Overlay */}
      <motion.div
        className="fixed inset-0 h-full pointer-events-none"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`,
          x: imageOffset * 0.5, // Сетка движется медленнее основного фона
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '400px 1080px',
          backgroundPosition: '0px -100px'
        }}
      />

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="relative z-10 w-full h-full overflow-x-auto overflow-y-hidden"
        style={{ 
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex h-full" style={{ width: `${(3840 * window.innerHeight) / 2160 * 1.5}px` }}>
          {/* Section 1 - Welcome */}
          <div className="h-full flex items-center justify-center relative" style={{ width: `${(3840 * window.innerHeight) / 2160 * 1.5}px` }}>
            <motion.div
              className="text-center px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{
                x: imageOffset * -0.2 // Карточка движется в обратную сторону для параллакса
              }}
            >
              <motion.div
                className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  Добро пожаловать в Алабугу
                </h2>
                <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-lg">
                  Самая эффективная особая экономическая зона России
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Section 2 - Industrial Zone */}
          <div className="h-full flex items-center justify-center relative" style={{ width: `${(3840 * window.innerHeight) / 2160 * 1.5}px` }}>
            <motion.div
              className="text-center px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              style={{
                x: imageOffset * -0.3 // Карточка движется в обратную сторону для параллакса
              }}
            >
              <motion.div
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  Промышленная зона
                </h2>
                <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-lg">
                  Современные производственные мощности и инновационные технологии
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Section 3 - Infrastructure */}
          <div className="h-full flex items-center justify-center relative" style={{ width: `${(3840 * window.innerHeight) / 2160 * 1.5}px` }}>
            <motion.div
              className="text-center px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              style={{
                x: imageOffset * -0.1 // Карточка движется в обратную сторону для параллакса
              }}
            >
              <motion.div
                className="bg-black/45 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  Инфраструктура
                </h2>
                <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-lg">
                  Развитая транспортная и логистическая сеть
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Section 4 - Technology */}
          <div className="h-full flex items-center justify-center relative" style={{ width: `${(3840 * window.innerHeight) / 2160 * 1.5}px` }}>
            <motion.div
              className="text-center px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              style={{
                x: imageOffset * -0.4 // Карточка движется в обратную сторону для параллакса
              }}
            >
              <motion.div
                className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                whileHover={{ scale: 1.02 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  Технологии
                </h2>
                <p className="text-lg text-white/90 max-w-xl mx-auto drop-shadow-lg">
                  Инновационные решения и цифровизация процессов
                </p>
              </motion.div>
            </motion.div>
          </div>


        </div>
      </div>

      {/* Mobile Touch Areas - Invisible but functional */}
      <div
        className="fixed left-0 top-0 w-20 h-full z-30 cursor-pointer"
        onClick={() => {
          if (scrollRef.current) {
            const scrollAmount = (3840 * window.innerHeight) / 2160 * 1.5;
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        }}
      />
      
      <div
        className="fixed right-0 top-0 w-20 h-full z-30 cursor-pointer"
        onClick={() => {
          if (scrollRef.current) {
            const scrollAmount = (3840 * window.innerHeight) / 2160 * 1.5;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
};

export default HorizontalImageScroll;