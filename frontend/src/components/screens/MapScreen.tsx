import React from 'react';
import { motion } from 'framer-motion';
import CompetencyMap from '../CompetencyMap';
import RanksDiagram from '../RanksDiagram';
import LaserFlow from '../LaserFlow';
import ShinyText from '../ShinyText';
import HoloBackground from '../HoloBackground';

const MapScreen: React.FC = () => {
  return (
    <div className="min-h-screen pb-8 relative">
      <HoloBackground />

      {/* Competency Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative z-10 p-4 md:p-6 mb-0 overflow-visible">
          <h3 className="mb-4">
            <ShinyText text="КАРТА КОМПЕТЕНЦИЙ" speed={6} className="text-xl font-bold text-white tracking-wide" />
          </h3>
          <div className="w-full flex items-center justify-center overflow-visible">
            <CompetencyMap />
          </div>
        </div>
      </motion.div>

      {/* Connector between map and ranks */}
      <div className="w-full overflow-visible -mt-14 -mb-14 relative z-0 pointer-events-none" style={{ height: '26vh', minHeight: 180, maxHeight: 420 }}>
        <div className="mx-auto" style={{ width: '100%', maxWidth: 720 }}>
          <LaserFlow color="#A78BFA" wispDensity={1.3} flowSpeed={0.5} />
        </div>
      </div>

      {/* Ranks Diagram (under branches) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative z-10 p-4 md:p-6 overflow-visible">
          <h3 className="mb-4">
            <ShinyText text="СИСТЕМА РАНГОВ" speed={6} className="text-xl font-bold text-white tracking-wide" />
          </h3>
          <RanksDiagram />
        </div>
      </motion.div>

      {/* Journal removed as requested */}
    </div>
  );
};

export default MapScreen;
