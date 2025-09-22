import React from 'react';
import { motion } from 'framer-motion';
import CompetencyMap from '../CompetencyMap';
import RanksDiagram from '../RanksDiagram';
import LaserFlow from '../LaserFlow';
import ShinyText from '../ShinyText';

const MapScreen: React.FC = () => {
  return (
    <div className="min-h-screen pb-8 overflow-y-auto">

      {/* Competency Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-0 overflow-visible">
          <h3 className="mb-4">
            <ShinyText text="КАРТА КОМПЕТЕНЦИЙ" speed={6} className="text-xl font-bold text-white tracking-wide" />
          </h3>
          <div className="w-full flex items-center justify-center overflow-visible">
            <CompetencyMap />
          </div>
        </div>
      </motion.div>

      {/* Connector between map and ranks */}
      <div className="-mt-[1px] -mb-[1px] rounded-none overflow-hidden" style={{ height: '18vh', minHeight: 140, maxHeight: 300 }}>
        <LaserFlow color="#00AEEF" wispDensity={1.2} flowSpeed={0.45} />
      </div>

      {/* Ranks Diagram (under branches) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl p-6 overflow-visible">
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
