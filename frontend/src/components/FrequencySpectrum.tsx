import React from 'react';
import styled from 'styled-components';

const FrequencySpectrum: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="frequency-spectrum">
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
        <div className="frequency-bar" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .frequency-spectrum {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    height: 40px;
    width: 300px;
    gap: 3px;
    margin: -60px 0 20px 10px;
    position: relative;
    z-index: 20;
  }

  @media (min-width: 640px) {
    .frequency-spectrum {
      margin: -60px 0 20px 20px;
    }
  }

  @media (min-width: 768px) {
    .frequency-spectrum {
      margin: -60px 0 20px 25px;
    }
  }

  @media (min-width: 800px) {
    .frequency-spectrum {
      margin: -60px 0 20px 28px;
    }
  }

  @media (min-width: 900px) {
    .frequency-spectrum {
      margin: -60px 0 20px 32px;
    }
  }

  @media (min-width: 1024px) {
    .frequency-spectrum {
      margin: -60px 0 20px 35px;
    }
  }

  .frequency-bar {
    width: 4px;
    height: 5px;
    background: rgba(0, 174, 239, 0.5);
    border-radius: 2px 2px 0 0;
    transition: height 0.3s ease, background 0.3s ease;
    animation: frequency-animation 1.5s infinite ease;
  }

  .frequency-bar:nth-child(1) { animation-delay: 0.1s; }
  .frequency-bar:nth-child(2) { animation-delay: 0.2s; }
  .frequency-bar:nth-child(3) { animation-delay: 0.1s; }
  .frequency-bar:nth-child(4) { animation-delay: 0.3s; }
  .frequency-bar:nth-child(5) { animation-delay: 0.5s; }
  .frequency-bar:nth-child(6) { animation-delay: 0.2s; }
  .frequency-bar:nth-child(7) { animation-delay: 0.4s; }
  .frequency-bar:nth-child(8) { animation-delay: 0.1s; }
  .frequency-bar:nth-child(9) { animation-delay: 0.3s; }
  .frequency-bar:nth-child(10) { animation-delay: 0.2s; }
  .frequency-bar:nth-child(11) { animation-delay: 0.5s; }
  .frequency-bar:nth-child(12) { animation-delay: 0.3s; }
  .frequency-bar:nth-child(13) { animation-delay: 0.1s; }
  .frequency-bar:nth-child(14) { animation-delay: 0.4s; }
  .frequency-bar:nth-child(15) { animation-delay: 0.2s; }
  .frequency-bar:nth-child(16) { animation-delay: 0.3s; }
  .frequency-bar:nth-child(17) { animation-delay: 0.1s; }
  .frequency-bar:nth-child(18) { animation-delay: 0.5s; }
  .frequency-bar:nth-child(19) { animation-delay: 0.2s; }
  .frequency-bar:nth-child(20) { animation-delay: 0.4s; }

  @keyframes frequency-animation {
    0% {
      height: 5px;
    }
    50% {
      height: 35px;
    }
    100% {
      height: 5px;
    }
  }
`;

export default FrequencySpectrum;
