import React from 'react';

interface ExitButtonProps {
  onClick?: () => void;
}

const ExitButton: React.FC<ExitButtonProps> = ({ onClick }) => {
  return (
    <div className="inline-block">
      <button 
        onClick={onClick}
        className="group flex items-center justify-start w-11 h-11 border-none rounded-md cursor-pointer relative overflow-hidden transition-all duration-300 shadow-lg bg-slate-800 hover:bg-slate-700 hover:w-32 active:translate-x-0.5 active:translate-y-0.5"
      >
        {/* Icon */}
        <div className="w-full transition-all duration-300 flex items-center justify-center group-hover:w-[30%] group-hover:pl-5">
          <svg 
            width="17" 
            height="17" 
            viewBox="0 0 512 512"
            className="transition-all duration-300"
          >
            <path 
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" 
              fill="#f3f3f3"
            />
          </svg>
        </div>

        {/* Text */}
        <div className="absolute right-0 w-0 opacity-0 text-[#f3f3f3] text-lg font-semibold transition-all duration-300 group-hover:opacity-100 group-hover:w-[70%] group-hover:pr-2.5">
          Выход
        </div>
      </button>
    </div>
  );
};

export default ExitButton;
