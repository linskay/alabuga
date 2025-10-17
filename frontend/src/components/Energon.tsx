import React from 'react';
import styled from 'styled-components';

type EnergonProps = {
  size?: number;
  className?: string;
  title?: string;
};

const Energon: React.FC<EnergonProps> = ({ size = 32, className, title = 'Энергон' }) => {
  return (
    <Wrapper className={className} style={{ width: size, height: size }} title={title}>
      <div className="fire">
        <div className="fire-left">
          <div className="main-fire" />
          <div className="particle-fire" />
        </div>
        <div className="fire-center">
          <div className="main-fire" />
          <div className="particle-fire" />
        </div>
        <div className="fire-right">
          <div className="main-fire" />
          <div className="particle-fire" />
        </div>
        <div className="fire-bottom">
          <div className="main-fire" />
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  .fire { position: absolute; inset: 0; margin: auto; width: 100%; height: 100%; }
  @keyframes scaleUpDown {
    0%, 100% { transform: scaleY(1) scaleX(1); }
    50%, 90% { transform: scaleY(1.1); }
    75% { transform: scaleY(0.95); }
    80% { transform: scaleX(0.95); }
  }
  @keyframes shake {
    0%, 100% { transform: skewX(0) scale(1); }
    50% { transform: skewX(5deg) scale(0.9); }
  }
  @keyframes particleUp {
    0% { opacity: 0; }
    20% { opacity: 1; }
    80% { opacity: 1; }
    100% { opacity: 0; top: -100%; transform: scale(0.5); }
  }
  @keyframes glow { 0%, 100% { background-color: #3cff1e; } 50% { background-color: #3cff1e; } }
  .fire-center { position: absolute; inset: 0; animation: scaleUpDown 3s ease-out infinite both; }
  .fire-center .main-fire { position: absolute; inset: 0; background-image: radial-gradient(farthest-corner at 10px 0,#3cff1e 0%,#3cff1e 95%); transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 6px #3cff1e); }
  .fire-center .particle-fire { position: absolute; top: 60%; left: 45%; width: 20%; height: 20%; background-color: #3cff1e; border-radius: 50%; filter: drop-shadow(0 0 6px #3cff1e); animation: particleUp 2s ease-out infinite both; }
  .fire-right { position: absolute; inset: 0; animation: shake 2s ease-out infinite both; }
  .fire-right .main-fire { position: absolute; top: 15%; right: -25%; width: 80%; height: 80%; background-color: #3cff1e; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 6px #3cff1e); }
  .fire-right .particle-fire { position: absolute; top: 45%; left: 50%; width: 25%; height: 25%; background-color: #3cff1e; transform: scaleX(0.8) rotate(45deg); border-radius: 50%; filter: drop-shadow(0 0 6px #3cff1e); animation: particleUp 2s ease-out infinite both; }
  .fire-left { position: absolute; inset: 0; animation: shake 3s ease-out infinite both; }
  .fire-left .main-fire { position: absolute; top: 15%; left: -20%; width: 80%; height: 80%; background-color: #3cff1e; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 60% 40%; filter: drop-shadow(0 0 6px #3cff1e); }
  .fire-left .particle-fire { position: absolute; top: 10%; left: 20%; width: 15%; height: 15%; background-color: #3cff1e; border-radius: 50%; filter: drop-shadow(0 0 6px #3cff1e); animation: particleUp 3s ease-out infinite both; }
  .fire-bottom .main-fire { position: absolute; top: 30%; left: 20%; width: 75%; height: 75%; background-color: #3cff1e; transform: scaleX(0.8) rotate(45deg); border-radius: 0 40% 100% 40%; filter: blur(6px); animation: glow 2s ease-out infinite both; }
`;

export default Energon;


