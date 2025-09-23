import React from 'react';
import styled from 'styled-components';

interface StonesMenuProps {
  onNavigateToPage: (page: 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin') => void;
}

const StonesMenu: React.FC<StonesMenuProps> = ({ onNavigateToPage }) => {
  const stones = [
    { 
      id: 'profile', 
      name: 'ПРОФИЛЬ', 
      gradientId: 'profileGlow',
      lightColor: 'rgb(100, 120, 200)',
      mediumColor: 'rgb(4, 58, 151)',
      darkColor: 'rgb(2, 30, 80)',
      strokeColor: 'rgb(4, 58, 151)',
      textColor: 'rgb(4, 58, 151)',
      path: 'M30,20 L70,10 L90,40 L80,80 L40,90 L10,60 Z'
    },
    { 
      id: 'map', 
      name: 'КАРТА', 
      gradientId: 'mapGlow',
      lightColor: 'rgb(100, 200, 255)',
      mediumColor: 'rgb(0, 174, 239)',
      darkColor: 'rgb(0, 100, 150)',
      strokeColor: 'rgb(0, 174, 239)',
      textColor: 'rgb(0, 174, 239)',
      path: 'M20,30 L60,10 L90,50 L70,90 L30,80 L10,40 Z'
    },
    { 
      id: 'missions', 
      name: 'МИССИИ', 
      gradientId: 'missionsGlow',
      lightColor: 'rgb(100, 120, 200)',
      mediumColor: 'rgb(4, 58, 151)',
      darkColor: 'rgb(2, 30, 80)',
      strokeColor: 'rgb(4, 58, 151)',
      textColor: 'rgb(4, 58, 151)',
      path: 'M40,10 L80,30 L90,70 L60,90 L20,80 L10,40 Z'
    },
    { 
      id: 'ship', 
      name: 'КОРАБЛЬ', 
      gradientId: 'shipGlow',
      lightColor: 'rgb(100, 200, 255)',
      mediumColor: 'rgb(0, 174, 239)',
      darkColor: 'rgb(0, 100, 150)',
      strokeColor: 'rgb(0, 174, 239)',
      textColor: 'rgb(0, 174, 239)',
      path: 'M30,20 L70,10 L90,50 L70,90 L30,80 L10,30 Z'
    },
    { 
      id: 'crew', 
      name: 'ЭКИПАЖ', 
      gradientId: 'crewGlow',
      lightColor: 'rgb(100, 120, 200)',
      mediumColor: 'rgb(4, 58, 151)',
      darkColor: 'rgb(2, 30, 80)',
      strokeColor: 'rgb(4, 58, 151)',
      textColor: 'rgb(4, 58, 151)',
      path: 'M20,20 L60,10 L90,40 L80,80 L40,90 L10,50 Z'
    },
    { 
      id: 'terminal', 
      name: 'ТЕРМИНАЛ', 
      gradientId: 'terminalGlow',
      lightColor: 'rgb(100, 200, 255)',
      mediumColor: 'rgb(0, 174, 239)',
      darkColor: 'rgb(0, 100, 150)',
      strokeColor: 'rgb(0, 174, 239)',
      textColor: 'rgb(0, 174, 239)',
      path: 'M30,10 L70,20 L90,50 L70,80 L30,90 L10,40 Z'
    },
    { 
      id: 'admin', 
      name: 'ЦУП', 
      gradientId: 'adminGlow',
      lightColor: 'rgb(100, 120, 200)',
      mediumColor: 'rgb(4, 58, 151)',
      darkColor: 'rgb(2, 30, 80)',
      strokeColor: 'rgb(4, 58, 151)',
      textColor: 'rgb(4, 58, 151)',
      path: 'M30,20 L70,10 L90,40 L80,80 L40,90 L10,60 Z'
    }
  ];

  return (
    <StyledWrapper>
      <div className="card">
        <div className="stones-container">
          {stones.map((stone) => (
            <div key={stone.id} className="stone-item">
              <div className="stone-wrapper" onClick={() => onNavigateToPage(stone.id as 'profile' | 'map' | 'missions' | 'ship' | 'crew' | 'terminal' | 'admin')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="stone">
                  <defs>
                    <radialGradient r="50%" cy="50%" cx="50%" id={stone.gradientId}>
                      <stop style={{stopColor: stone.lightColor}} offset="0%" />
                      <stop style={{stopColor: stone.mediumColor}} offset="20%" />
                      <stop style={{stopColor: stone.darkColor}} offset="100%" />
                    </radialGradient>
                  </defs>
                  <path fill={`url(#${stone.gradientId})`} d={stone.path} className="glow" stroke={stone.strokeColor} />
                </svg>
              </div>
              <div style={{color: stone.textColor}} className="stone-name">{stone.name}</div>
            </div>
          ))}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 100%;
    height: auto;
    min-height: 120px;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Arial", sans-serif;
    overflow: visible;
    padding-top: 1.5rem; /* even closer to header */
  }

  .stones-container {
    position: relative;
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    flex-wrap: nowrap;
    gap: 0.4rem;
    margin: 0 auto;
  }

  .stone-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-shrink: 0;
  }

  .stone-wrapper {
    position: relative;
    width: 70px;
    height: 70px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .stone {
    position: absolute;
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
  }

  .stone:hover {
    transform: scale(1.2) translateY(-5px);
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
  }

  .stone-name {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: -40px;
    left: 0;
    margin-top: 10px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    text-shadow: 
      0 0 1px #fff,
      0 0 2px #fff,
      0 0 3px #fff,
      0 0 4px #fff,
      0 0 5px #fff,
      0 0 6px #fff,
      0 0 7px #fff,
      0 0 8px #fff,
      0 0 9px #fff,
      0 0 10px #fff;
  }

  .stone-item:hover .stone-name {
    opacity: 1;
    transform: translateY(0);
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  .stone-wrapper {
    animation: float 4s ease-in-out infinite;
  }

  .stone-wrapper:nth-child(2) {
    animation-delay: -0.5s;
  }
  .stone-wrapper:nth-child(3) {
    animation-delay: -1s;
  }
  .stone-wrapper:nth-child(4) {
    animation-delay: -1.5s;
  }
  .stone-wrapper:nth-child(5) {
    animation-delay: -2s;
  }
  .stone-wrapper:nth-child(6) {
    animation-delay: -2.5s;
  }
  .stone-wrapper:nth-child(7) {
    animation-delay: -3s;
  }


  /* Large screens */
  @media (min-width: 1200px) {
    .stones-container {
      padding: 1.5rem;
      gap: 0.8rem;
      max-width: 700px;
    }
    
    .stone-wrapper {
      width: 80px;
      height: 80px;
    }
    
    .stone-name {
      font-size: 14px;
      bottom: -35px;
    }
  }

  /* Medium screens */
  @media (max-width: 1024px) {
    .stones-container {
      padding: 1rem;
      gap: 0.4rem;
      max-width: 600px;
    }
    
    .stone-wrapper {
      width: 70px;
      height: 70px;
    }
    
    .stone-name {
      font-size: 12px;
      bottom: -30px;
    }
  }

  /* Tablets */
  @media (max-width: 768px) {
    .stones-container {
      padding: 0.8rem;
      gap: 0.3rem;
      max-width: 500px;
    }
    
    .stone-wrapper {
      width: 60px;
      height: 60px;
    }
    
    .stone-name {
      font-size: 10px;
      bottom: -25px;
    }
  }

  /* >=640px (sm) — header height h-20 ≈ 5rem */
  @media (min-width: 640px) {
    .card { padding-top: 2.5rem; }
  }

  /* Small tablets */
  @media (max-width: 640px) {
    .stones-container {
      padding: 0.6rem;
      gap: 0.25rem;
      max-width: 450px;
    }
    
    .stone-wrapper {
      width: 50px;
      height: 50px;
    }
    
    .stone-name {
      font-size: 8px;
      bottom: -20px;
    }
  }

  /* Mobile phones */
  @media (max-width: 480px) {
    .stones-container {
      padding: 0.4rem;
      gap: 0.2rem;
      max-width: 400px;
    }
    
    .stone-wrapper {
      width: 45px;
      height: 45px;
    }
    
    .stone-name {
      font-size: 7px;
      bottom: -18px;
    }
  }

  /* Small mobile phones */
  @media (max-width: 375px) {
    .stones-container {
      padding: 0.3rem;
      gap: 0.15rem;
      max-width: 350px;
    }
    
    .stone-wrapper {
      width: 40px;
      height: 40px;
    }
    
    .stone-name {
      font-size: 6px;
      bottom: -16px;
    }
  }

  /* Very small screens */
  @media (max-width: 320px) {
    .stones-container {
      padding: 0.2rem;
      gap: 0.1rem;
      max-width: 300px;
    }
    
    .stone-wrapper {
      width: 35px;
      height: 35px;
    }
    
    .stone-name {
      font-size: 5px;
      bottom: -14px;
    }
  }
`;

export default StonesMenu;
