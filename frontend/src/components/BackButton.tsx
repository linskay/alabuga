import React from 'react';

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ onBack, className = "" }) => {
  return (
    <div className={`inline-block ${className}`}>
      <button 
        onClick={onBack}
        className="group flex items-center justify-start w-11 h-11 border-none rounded-md cursor-pointer relative overflow-hidden transition-all duration-300 shadow-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 hover:w-32 active:translate-x-0.5 active:translate-y-0.5"
      >
        {/* Icon */}
        <div className="w-full transition-all duration-300 flex items-center justify-center group-hover:w-[30%] group-hover:pl-5">
          <svg 
            width="17" 
            height="17" 
            viewBox="0 0 24 24"
            className="transition-all duration-300"
            fill="none"
            stroke="#f3f3f3"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </div>

        {/* Text */}
        <div className="absolute right-0 w-0 opacity-0 text-[#f3f3f3] text-lg font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-2.5">
          Назад
        </div>
      </button>
    </div>
  );
};

export default BackButton;
