import React from 'react';
// inlined styles; external css removed

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;
  return (
    <>
      <style>{`
        .__shiny_text__ {
          color: #b5b5b5a4;
          background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
          animation: __shine__ linear infinite;
        }
        @keyframes __shine__ {
          0% { background-position: 100%; }
          100% { background-position: -100%; }
        }
        .__shiny_text__disabled { animation: none; }
      `}</style>
      <div
        className={`__shiny_text__ ${disabled ? '__shiny_text__disabled' : ''} ${className}`}
        style={{ animationDuration }}
      >
        {text}
      </div>
    </>
  );
};

export default ShinyText;


