import React from 'react';
import styled from 'styled-components';

interface HoloNotificationButtonProps {
  count: number;
  onClick: () => void;
}

const HoloNotificationButton: React.FC<HoloNotificationButtonProps> = ({ count, onClick }) => {
  return (
    <StyledWrapper>
      <div className="notification-container" onClick={onClick}>
        <div className="grid-plane" />
        <div className="stars-container">
          <div className="star-layer" />
          <div className="star-layer" />
          <div className="star-layer" />
        </div>
        <div className="checkbox-container">
          <div className="holo-checkbox">
            <div className="holo-box">
              <div className="holo-inner" />
              <div className="scan-effect" />
              <div className="holo-particles">
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
                <div className="holo-particle" />
              </div>
              <div className="activation-rings">
                <div className="activation-ring" />
                <div className="activation-ring" />
                <div className="activation-ring" />
              </div>
              <div className="cube-transform">
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
                <div className="cube-face" />
              </div>
            </div>
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="corner-accent" />
            <div className="holo-glow" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .notification-container {
    position: relative;
    width: 80px;
    height: 80px;
    cursor: pointer;
    overflow: visible;
  }

  .stars-container {
    position: absolute;
    width: 100%;
    height: 100%;
    perspective: 500px;
    transform-style: preserve-3d;
  }

  .star-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.6;
  }

  .star-layer:nth-child(1) {
    transform: translateZ(-50px);
    animation: star-drift 150s linear infinite;
  }

  .star-layer:nth-child(2) {
    transform: translateZ(-100px);
    animation: star-drift 200s linear infinite reverse;
    opacity: 0.4;
  }

  .star-layer:nth-child(3) {
    transform: translateZ(-200px);
    animation: star-drift 250s linear infinite;
    opacity: 0.2;
  }

  @keyframes star-drift {
    0% {
      transform: translateZ(-50px) translateY(0);
    }
    100% {
      transform: translateZ(-50px) translateY(100%);
    }
  }

  .star-layer::before,
  .star-layer::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .star-layer:nth-child(1)::before {
    background-image: radial-gradient(1px 1px at 10% 10%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(1px 1px at 20% 20%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(2px 2px at 30% 30%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(1px 1px at 40% 40%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(2px 2px at 50% 50%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(1px 1px at 60% 60%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(2px 2px at 70% 70%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(1px 1px at 80% 80%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(2px 2px at 90% 90%, rgba(0, 174, 239, 0.8) 100%, transparent),
      radial-gradient(1px 1px at 15% 85%, rgba(0, 174, 239, 0.8) 100%, transparent);
  }

  .grid-plane {
    position: absolute;
    width: 200%;
    height: 200%;
    top: -50%;
    left: -50%;
    background-image: linear-gradient(
        rgba(0, 174, 239, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(0, 174, 239, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    transform: perspective(500px) rotateX(60deg);
    transform-origin: center;
    animation: grid-move 20s linear infinite;
    opacity: 0.2;
  }

  @keyframes grid-move {
    0% {
      transform: perspective(500px) rotateX(60deg) translateY(0);
    }
    100% {
      transform: perspective(500px) rotateX(60deg) translateY(30px);
    }
  }

  .checkbox-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  .holo-checkbox {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer;
    transform-style: preserve-3d;
    perspective: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .holo-box {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(4, 58, 151, 0.7);
    border-radius: 8px;
    background-color: rgba(4, 58, 151, 0.2);
    box-shadow:
      0 0 10px rgba(4, 58, 151, 0.5),
      inset 0 0 15px rgba(4, 58, 151, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: all 0.3s ease;
    transform-style: preserve-3d;
  }

  .holo-inner {
    position: absolute;
    width: 30%;
    height: 30%;
    background-color: rgba(0, 174, 239, 0.5);
    border-radius: 4px;
    opacity: 0;
    transform: scale(0) rotate(45deg);
    transition: all 0.3s ease;
    box-shadow: 0 0 15px rgba(0, 174, 239, 0.8);
  }

  .scan-effect {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 174, 239, 0.8),
      transparent
    );
    animation: scan-off 4s infinite;
    opacity: 0.3;
    transition: all 0.3s ease;
  }

  @keyframes scan-off {
    0% {
      left: -100%;
      opacity: 0.3;
    }
    100% {
      left: 100%;
      opacity: 0.3;
    }
  }

  .holo-glow {
    position: absolute;
    width: 200%;
    height: 200%;
    left: -50%;
    top: -50%;
    background: radial-gradient(
      ellipse at center,
      rgba(4, 58, 151, 0.2) 0%,
      rgba(4, 58, 151, 0.1) 40%,
      rgba(0, 0, 0, 0) 70%
    );
    pointer-events: none;
    filter: blur(10px);
    opacity: 0.5;
    z-index: -1;
    animation: glow-pulse 4s infinite alternate;
    transition: all 0.5s ease;
  }

  @keyframes glow-pulse {
    0% {
      opacity: 0.3;
      filter: blur(10px) brightness(0.8);
    }
    100% {
      opacity: 0.6;
      filter: blur(15px) brightness(1.2);
    }
  }

  .corner-accent {
    position: absolute;
    width: 12px;
    height: 12px;
    border-style: solid;
    border-width: 2px;
    border-color: rgba(4, 58, 151, 0.5);
    transition: all 0.3s ease;
  }

  .corner-accent:nth-child(1) {
    top: -4px;
    left: -4px;
    border-right: none;
    border-bottom: none;
    border-radius: 4px 0 0 0;
  }

  .corner-accent:nth-child(2) {
    top: -4px;
    right: -4px;
    border-left: none;
    border-bottom: none;
    border-radius: 0 4px 0 0;
  }

  .corner-accent:nth-child(3) {
    bottom: -4px;
    left: -4px;
    border-right: none;
    border-top: none;
    border-radius: 0 0 0 4px;
  }

  .corner-accent:nth-child(4) {
    bottom: -4px;
    right: -4px;
    border-left: none;
    border-top: none;
    border-radius: 0 0 4px 0;
  }


  .activation-rings {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .activation-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 40%;
    height: 40%;
    border: 1px solid rgba(0, 174, 239, 0);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .holo-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .holo-particle {
    position: absolute;
    background-color: rgba(0, 174, 239, 0.7);
    border-radius: 50%;
    width: 2px;
    height: 2px;
    opacity: 0;
    filter: blur(1px);
    transition: all 0.3s ease;
  }

  .holo-particle:nth-child(1) {
    top: 20%;
    left: 30%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 0.1s;
  }

  .holo-particle:nth-child(2) {
    top: 70%;
    left: 20%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 0.7s;
  }

  .holo-particle:nth-child(3) {
    top: 40%;
    left: 80%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 1.3s;
  }

  .holo-particle:nth-child(4) {
    top: 60%;
    left: 60%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 1.9s;
  }

  .holo-particle:nth-child(5) {
    top: 30%;
    left: 45%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 2.5s;
  }

  .holo-particle:nth-child(6) {
    top: 60%;
    left: 40%;
    animation: particle-float 3s infinite ease-in-out;
    animation-delay: 3.1s;
  }

  @keyframes particle-float {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      transform: translateY(-20px) scale(0);
      opacity: 0;
    }
  }

  .cube-transform {
    position: absolute;
    width: 30%;
    height: 30%;
    transform-style: preserve-3d;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .cube-face {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 174, 239, 0.3);
    border: 1px solid rgba(0, 174, 239, 0.5);
    box-shadow: 0 0 5px rgba(0, 174, 239, 0.3);
    transition: all 0.3s ease;
  }

  .cube-face:nth-child(1) {
    transform: translateZ(10px);
  }

  .cube-face:nth-child(2) {
    transform: rotateY(180deg) translateZ(10px);
  }

  .cube-face:nth-child(3) {
    transform: rotateY(90deg) translateZ(10px);
  }

  .cube-face:nth-child(4) {
    transform: rotateY(-90deg) translateZ(10px);
  }

  .cube-face:nth-child(5) {
    transform: rotateX(90deg) translateZ(10px);
  }

  .cube-face:nth-child(6) {
    transform: rotateX(-90deg) translateZ(10px);
  }





  /* Hover effects */
  .notification-container:hover .holo-box {
    border-color: rgba(0, 174, 239, 0.7);
    box-shadow:
      0 0 15px rgba(0, 174, 239, 0.6),
      inset 0 0 20px rgba(0, 174, 239, 0.4);
  }

  .notification-container:hover .holo-inner {
    background-color: rgba(0, 174, 239, 0.7);
    box-shadow: 0 0 20px rgba(0, 174, 239, 1);
    opacity: 1;
    transform: scale(1) rotate(45deg);
  }

  .notification-container:hover .scan-effect {
    animation: scan-on 2s infinite;
    opacity: 1;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 174, 239, 0.8),
      transparent
    );
  }

  @keyframes scan-on {
    0% {
      left: -100%;
      opacity: 1;
    }
    100% {
      left: 100%;
      opacity: 1;
    }
  }

  .notification-container:hover .holo-glow {
    background: radial-gradient(
      ellipse at center,
      rgba(0, 174, 239, 0.2) 0%,
      rgba(0, 174, 239, 0.1) 40%,
      rgba(0, 0, 0, 0) 70%
    );
    animation: active-glow-pulse 2s infinite alternate;
  }

  @keyframes active-glow-pulse {
    0% {
      opacity: 0.4;
      filter: blur(10px) brightness(1);
    }
    100% {
      opacity: 0.8;
      filter: blur(20px) brightness(1.5);
    }
  }

  .notification-container:hover .corner-accent {
    width: 16px;
    height: 16px;
    border-color: rgba(0, 174, 239, 0.7);
  }


  .notification-container:hover .activation-ring {
    animation: ring-expand 2s ease-out forwards;
    border-color: rgba(0, 174, 239, 0.7);
  }

  .notification-container:hover .activation-ring:nth-child(1) {
    animation-delay: 0s;
  }

  .notification-container:hover .activation-ring:nth-child(2) {
    animation-delay: 0.3s;
  }

  .notification-container:hover .activation-ring:nth-child(3) {
    animation-delay: 0.6s;
  }

  @keyframes ring-expand {
    0% {
      transform: translate(-50%, -50%) scale(0);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(2.5);
      opacity: 0;
    }
  }

  .notification-container:hover .cube-transform {
    opacity: 1;
    animation: cube-rotate 5s infinite linear;
  }

  @keyframes cube-rotate {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0);
    }
    100% {
      transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
    }
  }

`;

export default HoloNotificationButton;
