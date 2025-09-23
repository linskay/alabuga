import React from 'react';

interface NeonGradientCardProps {
  className?: string;
  children?: React.ReactNode;
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({ className = '', children }) => {
  return (
    <div
      className={`relative rounded-2xl p-6 overflow-hidden ${className}`}
      style={{
        background: 'radial-gradient(120% 120% at 50% 30%, rgba(0,174,239,0.18), rgba(0,174,239,0.10) 45%, rgba(10,12,20,0.85) 75%)',
        border: '1px solid rgba(0,174,239,0.25)',
        boxShadow: '0 0 24px rgba(0,174,239,0.12)'
      }}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};


