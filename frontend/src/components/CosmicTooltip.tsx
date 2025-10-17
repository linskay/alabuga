import React from 'react';
import styled from 'styled-components';

interface CosmicTooltipProps {
  children: React.ReactNode;
  tooltip: string;
}

const CosmicTooltip: React.FC<CosmicTooltipProps> = ({ children, tooltip }) => {
  return (
    <StyledWrapper>
      <div className="cosmic-tooltip-container">
        <div className="tooltip-trigger" data-tooltip={tooltip}>
          {children}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .cosmic-tooltip-container {
    display: inline-block;
  }

  .tooltip-trigger {
    --primary: #00aee0;
    --secondary: #7e03aa;
    position: relative;
    cursor: help;
    transition: transform 0.1s ease-out;
  }

  .tooltip-trigger::before {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 0.3rem);
    left: 50%;
    transform: translateX(-50%) translateY(0.3rem);
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(0, 174, 224, 0.6) 0%, rgba(126, 3, 170, 0.6) 100%);
    color: #fff;
    padding: 0.3rem 0.6rem;
    border-radius: 0.3rem;
    font-family: "Share Tech Mono", monospace;
    font-size: 0.7rem;
    font-weight: bold;
    white-space: nowrap;
    box-shadow: 
      0 0.3rem 0.6rem rgba(0, 0, 0, 0.3),
      0 0 15px rgba(0, 174, 224, 0.2);
    border: 1px solid rgba(0, 174, 224, 0.3);
    backdrop-filter: blur(10px);
    transition:
      transform 0.3s cubic-bezier(0.2, 1.5, 0.5, 1),
      opacity 0.3s ease;
    z-index: 1000;
  }

  .tooltip-trigger::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 0.3rem solid transparent;
    border-right: 0.3rem solid transparent;
    border-top: 0.3rem solid rgba(126, 3, 170, 0.6);
    transform: translateX(-50%) translateY(0.3rem);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.3s cubic-bezier(0.2, 1.5, 0.5, 1),
      opacity 0.3s ease;
    z-index: 1000;
  }

  .tooltip-trigger:hover {
    animation: cosmic-shock 0.25s linear infinite;
  }

  .tooltip-trigger:hover::before,
  .tooltip-trigger:hover::after {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }

  @keyframes cosmic-shock {
    0% {
      transform: translate(0, 0);
      filter: drop-shadow(0 0 0px var(--primary));
    }
    20% {
      transform: translate(-1px, 1px);
      filter: drop-shadow(0 0 8px var(--primary));
    }
    40% {
      transform: translate(-1px, -1px);
      filter: drop-shadow(0 0 0px var(--primary));
    }
    60% {
      transform: translate(1px, 1px);
      filter: drop-shadow(0 0 8px var(--primary));
    }
    80% {
      transform: translate(1px, -1px);
      filter: drop-shadow(0 0 0px var(--primary));
    }
    100% {
      transform: translate(0, 0);
      filter: drop-shadow(0 0 0px var(--primary));
    }
  }
`;

export default CosmicTooltip;
