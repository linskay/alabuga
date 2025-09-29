import React from 'react';

type NeonSwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
};

const NeonSwitch: React.FC<NeonSwitchProps> = ({ checked = false, onChange, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-16 h-8', 
    lg: 'w-20 h-10'
  };

  const thumbSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const translateClasses = {
    sm: checked ? 'translate-x-6' : 'translate-x-0',
    md: checked ? 'translate-x-8' : 'translate-x-0', 
    lg: checked ? 'translate-x-10' : 'translate-x-0'
  };

  return (
    <div className="neon-switch-container">
      <label className={`relative inline-flex items-center cursor-pointer ${sizeClasses[size]}`}>
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <div className={`
          relative w-full h-full rounded-full transition-all duration-300 ease-in-out
          ${checked 
            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50' 
            : 'bg-gray-700 border border-gray-600'
          }
        `}>
          {/* Neon glow effect */}
          <div className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${checked 
              ? 'bg-gradient-to-r from-cyan-400/30 to-blue-400/30 shadow-inner' 
              : ''
            }
          `} />
          
          {/* Animated background pattern */}
          <div className={`
            absolute inset-0 rounded-full opacity-20 transition-all duration-300
            ${checked ? 'bg-gradient-to-r from-cyan-300/20 to-blue-300/20' : ''}
          `} />
          
          {/* Thumb */}
          <div className={`
            absolute top-0.5 left-0.5 ${thumbSizeClasses[size]} rounded-full transition-all duration-300 ease-in-out
            ${translateClasses[size]}
            ${checked 
              ? 'bg-white shadow-lg shadow-cyan-400/50 border-2 border-cyan-300' 
              : 'bg-gray-300 border border-gray-400'
            }
          `}>
            {/* Inner glow */}
            <div className={`
              absolute inset-1 rounded-full transition-all duration-300
              ${checked 
                ? 'bg-gradient-to-br from-cyan-100 to-blue-100' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200'
              }
            `} />
            
            {/* Sparkle effect when checked */}
            {checked && (
              <div className="absolute inset-0 rounded-full">
                <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-300 rounded-full animate-pulse" />
                <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-blue-300 rounded-full animate-ping" />
                <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Energy lines when checked */}
          {checked && (
            <>
              <div className="absolute top-1 left-2 w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent rounded-full animate-pulse" />
              <div className="absolute bottom-1 left-2 w-6 h-0.5 bg-gradient-to-r from-blue-400 to-transparent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
            </>
          )}
        </div>
      </label>
    </div>
  );
};

export default NeonSwitch;
