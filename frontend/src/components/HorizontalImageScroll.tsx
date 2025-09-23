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
        const scrollAmount = e.deltaY * 0.2; // Увеличенная скорость скролла
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
    <div className="w-full h-screen relative overflow-hidden" style={{ cursor: 'none' }}>
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

      {/* Image Parallax Layer - для дополнительного эффекта вокруг изображений */}
      <motion.div
        className="fixed inset-0 h-full pointer-events-none"
        style={{
          width: `${(3840 * window.innerHeight) / 2160 * 1.5}px`,
          x: imageOffset * 1.5, // Движется быстрее основного фона
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(147, 197, 253, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 80% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 25%),
            radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.06) 0%, transparent 20%)
          `,
          backgroundSize: '600px 600px, 400px 400px, 500px 500px',
          backgroundPosition: '0% 0%, 100% 0%, 50% 100%'
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
          {/* Section 1 - Image 1 */}
          <div className="h-full flex items-end justify-center relative" style={{ width: '100vw' }}>
            <motion.div
              className="relative z-20"
              initial={{ opacity: 0, x: 0, filter: "blur(20px)" }}
              animate={{ 
                opacity: scrollProgress >= 0 && scrollProgress <= 0.4 ? 1 : 0,
                filter: scrollProgress >= 0 && scrollProgress <= 0.4 ? "blur(0px)" : "blur(15px)"
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Летающие звезды и метеориты */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Звезды с блеском */}
                <motion.div
                  className="absolute"
                  style={{ top: '10%', left: '20%' }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.7, 1.3, 0.7]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 bg-white rounded-full shadow-lg shadow-white/50"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-white to-blue-100 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-white/60 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-white/40 rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ top: '30%', right: '15%' }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-blue-300 rounded-full shadow-lg shadow-blue-300/60"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ bottom: '20%', left: '10%' }}
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.8, 1.4, 0.8]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-yellow-200 rounded-full shadow-lg shadow-yellow-200/60"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-yellow-100/80 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-yellow-100/60 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-yellow-100/40 rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Метеориты */}
                <motion.div
                  className="absolute w-1 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                  style={{ top: '15%', right: '25%' }}
                  animate={{
                    x: [0, 50, 100],
                    y: [0, 30, 60],
                    opacity: [0, 1, 0],
                    rotate: [0, 45, 90]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
                <motion.div
                  className="absolute w-1 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  style={{ top: '40%', left: '5%' }}
                  animate={{
                    x: [0, -40, -80],
                    y: [0, 20, 40],
                    opacity: [0, 0.8, 0],
                    rotate: [0, -30, -60]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 3 }}
                />
              </div>

              {/* Облако с надписью */}
              <motion.div
                className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: scrollProgress >= 0 && scrollProgress <= 0.4 ? 0.85 : 0,
                  y: scrollProgress >= 0 && scrollProgress <= 0.4 ? 0 : 20,
                  scale: scrollProgress >= 0 && scrollProgress <= 0.4 ? 1 : 0.8
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="relative">
                  {/* Основное облако с размытыми краями */}
                  <div className="relative bg-gradient-to-br from-white/80 via-blue-50/70 to-white/60 backdrop-blur-lg rounded-full px-10 py-8 shadow-2xl">
                    {/* Дополнительные слои для воздушности */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/40 rounded-full blur-sm"></div>
                    <div className="absolute -top-1 -right-3 w-6 h-6 bg-blue-100/50 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-2 -left-1 w-7 h-7 bg-white/30 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-blue-50/60 rounded-full blur-sm"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white/50 rounded-full blur-sm"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-blue-100/40 rounded-full blur-sm"></div>
                    
                    {/* Текст */}
                    <div className="relative z-10 text-2xl font-bold text-gray-800 text-center">
                      Для студентов...
                    </div>
                    
                    {/* Воздушная стрелочка */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/80"></div>
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/60"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <img
                src="/images/1.png"
                alt="Space 1"
                className="w-[800px] h-[800px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

          {/* Section 2 - Image 2 */}
          <div className="h-full flex items-end justify-center relative" style={{ width: '100vw' }}>
            <motion.div
              className="relative z-20"
              initial={{ opacity: 0, x: 0, filter: "blur(20px)" }}
              animate={{ 
                opacity: scrollProgress > 0.3 && scrollProgress <= 0.7 ? 1 : 0,
                filter: scrollProgress > 0.3 && scrollProgress <= 0.7 ? "blur(0px)" : "blur(15px)"
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Летающие звезды и метеориты */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Звезды с блеском */}
                <motion.div
                  className="absolute"
                  style={{ top: '15%', right: '20%' }}
                  animate={{
                    y: [0, -18, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.7, 1.2, 0.7]
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 bg-purple-300 rounded-full shadow-lg shadow-purple-300/60"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-purple-200 to-purple-400 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-purple-100/80 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-purple-100/60 rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ top: '25%', left: '25%' }}
                  animate={{
                    y: [0, -12, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-green-300 rounded-full shadow-lg shadow-green-300/60"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-green-200 to-green-400 rounded-full"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ bottom: '25%', right: '10%' }}
                  animate={{
                    y: [0, -22, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.8, 1.4, 0.8]
                  }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-pink-200 rounded-full shadow-lg shadow-pink-200/60"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-pink-100 to-pink-300 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-pink-100/80 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-pink-100/60 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-pink-100/40 rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Метеориты */}
                <motion.div
                  className="absolute w-1 h-7 bg-gradient-to-r from-green-400 to-teal-500 rounded-full"
                  style={{ top: '20%', left: '30%' }}
                  animate={{
                    x: [0, 60, 120],
                    y: [0, 35, 70],
                    opacity: [0, 1, 0],
                    rotate: [0, 60, 120]
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
                <motion.div
                  className="absolute w-1 h-5 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                  style={{ top: '35%', right: '8%' }}
                  animate={{
                    x: [0, -50, -100],
                    y: [0, 25, 50],
                    opacity: [0, 0.9, 0],
                    rotate: [0, -45, -90]
                  }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                />
              </div>

              {/* Облако с надписью */}
              <motion.div
                className="absolute -top-20 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: scrollProgress > 0.3 && scrollProgress <= 0.7 ? 1 : 0,
                  y: scrollProgress > 0.3 && scrollProgress <= 0.7 ? 0 : 20,
                  scale: scrollProgress > 0.3 && scrollProgress <= 0.7 ? 1 : 0.8
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="relative">
                  {/* Основное облако с размытыми краями */}
                  <div className="relative bg-gradient-to-br from-white/80 via-purple-50/70 to-white/60 backdrop-blur-lg rounded-full px-10 py-8 shadow-2xl">
                    {/* Дополнительные слои для воздушности */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/40 rounded-full blur-sm"></div>
                    <div className="absolute -top-1 -right-3 w-6 h-6 bg-purple-100/50 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-2 -left-1 w-7 h-7 bg-white/30 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-purple-50/60 rounded-full blur-sm"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white/50 rounded-full blur-sm"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-purple-100/40 rounded-full blur-sm"></div>
                    
                    {/* Текст */}
                    <div className="relative z-10 text-2xl font-bold text-gray-800 text-center">
                      Для выпускников и начинающих специалистов
                    </div>
                    
                    {/* Воздушная стрелочка */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/80"></div>
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/60"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <img
                src="/images/2.png"
                alt="Space 2"
                className="w-[800px] h-[800px] object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>

            {/* Section 3 - Image 3 */}
            <div className="h-full flex items-end justify-center relative" style={{ width: '100vw' }}>
            <motion.div
              className="relative z-20 mt-8 sm:mt-12 md:mt-16 lg:mt-20"
              initial={{ opacity: 0, x: 0, filter: "blur(20px)" }}
              animate={{ 
                opacity: scrollProgress > 0.6 ? 1 : 0,
                filter: scrollProgress > 0.6 ? "blur(0px)" : "blur(15px)"
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Летающие звезды и метеориты */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Звезды с блеском */}
                <motion.div
                  className="absolute"
                  style={{ top: '12%', left: '15%' }}
                  animate={{
                    y: [0, -16, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [0.8, 1.3, 0.8]
                  }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                >
                  <div className="relative">
                    <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-lg shadow-cyan-300/60"></div>
                    <div className="absolute top-0 left-0 w-3 h-3 bg-gradient-to-br from-cyan-200 to-cyan-400 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-cyan-100/80 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-cyan-100/60 rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ top: '35%', right: '20%' }}
                  animate={{
                    y: [0, -14, 0],
                    opacity: [0.8, 1, 0.8],
                    scale: [0.6, 1.1, 0.6]
                  }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-orange-300 rounded-full shadow-lg shadow-orange-300/60"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-orange-200 to-orange-400 rounded-full"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ bottom: '30%', left: '20%' }}
                  animate={{
                    y: [0, -24, 0],
                    opacity: [0.6, 1, 0.6],
                    scale: [0.9, 1.5, 0.9]
                  }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-200 rounded-full shadow-lg shadow-red-200/60"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-gradient-to-br from-red-100 to-red-300 rounded-full"></div>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-red-100/80 rounded-full"></div>
                    <div className="absolute -top-1 -right-1 w-0.5 h-0.5 bg-red-100/60 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-0.5 h-0.5 bg-red-100/40 rounded-full"></div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute"
                  style={{ top: '50%', right: '10%' }}
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                >
                  <div className="relative">
                    <div className="w-2 h-2 bg-indigo-300 rounded-full shadow-lg shadow-indigo-300/60"></div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-br from-indigo-200 to-indigo-400 rounded-full"></div>
                    <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                </motion.div>
                
                {/* Метеориты */}
                <motion.div
                  className="absolute w-1 h-9 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                  style={{ top: '18%', right: '30%' }}
                  animate={{
                    x: [0, 70, 140],
                    y: [0, 40, 80],
                    opacity: [0, 1, 0],
                    rotate: [0, 50, 100]
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
                />
                <motion.div
                  className="absolute w-1 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                  style={{ top: '45%', left: '8%' }}
                  animate={{
                    x: [0, -60, -120],
                    y: [0, 30, 60],
                    opacity: [0, 0.8, 0],
                    rotate: [0, -40, -80]
                  }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: "easeInOut", delay: 3.2 }}
                />
              <motion.div
                  className="absolute w-1 h-4 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full"
                  style={{ top: '60%', right: '5%' }}
                  animate={{
                    x: [0, 45, 90],
                    y: [0, 20, 40],
                    opacity: [0, 0.9, 0],
                    rotate: [0, 35, 70]
                  }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "easeInOut", delay: 4.1 }}
                />
          </div>

              {/* Облако с надписью */}
              <motion.div
                className="absolute top-20 sm:top-24 md:top-28 lg:top-32 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ 
                  opacity: scrollProgress > 0.6 ? 0.85 : 0,
                  y: scrollProgress > 0.6 ? 0 : 20,
                  scale: scrollProgress > 0.6 ? 1 : 0.8
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="relative">
                  {/* Основное облако с размытыми краями */}
                  <div className="relative bg-gradient-to-br from-white/80 via-cyan-50/70 to-white/60 backdrop-blur-lg rounded-full px-10 py-8 shadow-2xl">
                    {/* Дополнительные слои для воздушности */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/40 rounded-full blur-sm"></div>
                    <div className="absolute -top-1 -right-3 w-6 h-6 bg-cyan-100/50 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-2 -left-1 w-7 h-7 bg-white/30 rounded-full blur-sm"></div>
                    <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-cyan-50/60 rounded-full blur-sm"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white/50 rounded-full blur-sm"></div>
                    <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-100/40 rounded-full blur-sm"></div>
                    
                    {/* Текст */}
                    <div className="relative z-10 text-2xl font-bold text-gray-800 text-center">
                      Для всех-всех-всех!
                    </div>
                    
                    {/* Воздушная стрелочка */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/80"></div>
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white/60"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <img
                src="/images/3.png"
                alt="Space 3"
                className="h-[907px] w-auto object-contain drop-shadow-2xl"
              />

            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Touch Areas - Invisible but functional */}
      <div
        className="fixed left-0 top-0 w-20 h-full z-30 cursor-pointer"
        onClick={() => {
          if (scrollRef.current) {
            const scrollAmount = window.innerWidth;
            scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        }}
      />
      
      <div
        className="fixed right-0 top-0 w-20 h-full z-30 cursor-pointer"
        onClick={() => {
          if (scrollRef.current) {
            const scrollAmount = window.innerWidth;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
};

export default HorizontalImageScroll;