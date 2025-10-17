import React from 'react';
import styled from 'styled-components';

interface NotificationButtonProps {
  count: number;
  onClick: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ count, onClick }) => {
  return (
    <StyledWrapper>
      <div className="notification-container" onClick={onClick}>
        <span className="notification-icon">
          <span>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="notification-svg">
              <defs>
                <linearGradient id="nexus-gradient" x2={0} y2={1}>
                  <stop offset="0%" stopColor="rgb(0, 174, 239)" />
                  <stop offset="100%" stopColor="rgb(4, 58, 151)" />
                </linearGradient>
              </defs>
              <path fill="url(#nexus-gradient)" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
            </svg>
          </span>
          <span className="notification-lines">
            <span className="notification-line-1" />
            <span className="notification-line-2" />
          </span>
        </span>
        
        {/* Счетчик уведомлений */}
        {count > 0 && (
          <div className="notification-badge">
            {count > 99 ? '99+' : count}
          </div>
        )}
        
        <span className="text">
          <span className="notification-lines">
            <span className="notification-line-1" />
            <span className="notification-line-2" />
          </span>
        </span>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .notification-container {
    --background: rgba(0, 174, 239, 0.15);
    --inner-shadow: rgba(0, 174, 239, 0.4);
    --inner-outline: rgba(0, 174, 239, 0.8);
    --inner-outline-bottom: rgba(0, 174, 239, 0.3);
    --inner-outline-middle: rgba(0, 174, 239, 0.5);
    --inner-outline-outer-top: rgba(0, 174, 239, 0.2);
    --inner-outline-outer-bottom-1: rgba(0, 174, 239, 0.9);
    --inner-outline-outer-bottom-2: rgba(0, 174, 239, 0.7);
    --inner-outline-outer-bottom-3: rgba(4, 58, 151, 0.8);
    --line-1: rgba(0, 174, 239, 0.9);
    --line-2: rgba(0, 174, 239, 0.7);
    
    position: relative;
    background: var(--background);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    padding: 0.5em 1.2em;
    border-radius: 5px;
    overflow: visible;
    box-shadow: inset 0px 1px 8px 1px var(--inner-shadow),
      0px 2px 0px 0px var(--inner-outline-bottom),
      0px -2px 0px 0px var(--inner-outline),
      -2px -2px 0px 0px var(--inner-outline),
      2px -2px 0px 0px var(--inner-outline),
      0px 0px 0px 4px var(--inner-outline-middle),
      0px -2px 0px 5px var(--inner-outline-outer-top),
      0px 4px 0px 5px var(--inner-outline-outer-bottom-1);
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: inset 0px 1px 8px 1px var(--inner-shadow),
        0px 3px 0px 0px var(--inner-outline-bottom),
        0px -2px 0px 0px var(--inner-outline),
        -2px -2px 0px 0px var(--inner-outline),
        2px -2px 0px 0px var(--inner-outline),
        0px 0px 0px 4px var(--inner-outline-middle),
        0px -2px 0px 5px var(--inner-outline-outer-top),
        0px 4px 0px 5px var(--inner-outline-outer-bottom-1),
        0px 7px 0px 5px var(--inner-outline-outer-bottom-2),
        0px 10px 0px 5px var(--inner-outline-outer-bottom-3);
    }
  }

  .notification-svg {
    display: inline-block;
    vertical-align: top;
    width: 1.2em;
    height: 1.2em;
  }

  .notification-svg path {
    stroke-width: 1px;
    stroke: var(--inner-outline);
    stroke-linejoin: round;
  }

  .notification-lines {
    display: flex;
    flex-direction: column;
    gap: 0.3em;
  }

  .notification-line-1 {
    height: 0.15em;
    width: 3em;
    border-radius: 10em;
    display: inline-block;
    background: var(--line-1);
  }

  .notification-line-2 {
    height: 0.15em;
    width: 2.5em;
    border-radius: 10em;
    display: inline-block;
    background: var(--line-2);
  }

  .notification-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: linear-gradient(135deg, rgb(0, 174, 239), rgb(4, 58, 151));
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    border: 2px solid #191c29;
    box-shadow: 0 0 10px rgba(0, 174, 239, 0.5);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 10px rgba(0, 174, 239, 0.5);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 15px rgba(0, 174, 239, 0.8);
    }
  }

  .notification-icon {
    position: absolute;
    display: flex;
    gap: 0.3em;
    align-items: center;
    top: -4.5em;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.4em 0.6em;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
    background: var(--background);
    border-radius: 0.5em;
    z-index: 10001;

    box-shadow: inset 0px 1px 8px 1px var(--inner-shadow),
      0px 2px 0px 0px var(--inner-outline-bottom),
      0px -2px 0px 0px var(--inner-outline),
      -2px -2px 0px 0px var(--inner-outline),
      2px -2px 0px 0px var(--inner-outline),
      0px 0px 0px 4px var(--inner-outline-middle),
      0px -2px 0px 5px var(--inner-outline-outer-top),
      0px 4px 0px 5px var(--inner-outline-outer-bottom-1),
      0px 7px 0px 5px var(--inner-outline-outer-bottom-2),
      0px 10px 0px 5px var(--inner-outline-outer-bottom-3);
  }

  .notification-icon::before {
    content: "";
    position: absolute;
    height: 0.8em;
    width: 0.8em;
    bottom: -0.15em;
    left: 50%;
    transform: translate(-50%) translateY(2px) rotate(45deg);
    background: var(--background);
    border-radius: 0.15em;
    box-shadow: 1px 1px 0px rgba(0, 174, 239, 0.2), 
      3px 3px 0px rgba(0, 174, 239, 0.4),
      6px 6px 0px rgb(4, 58, 151), 
      8px 8px 0px rgba(0, 174, 239, 0.6),
      10px 10px 0px rgb(4, 58, 151), 
      inset -2px -2px 2px rgba(0, 174, 239, 0.2);
  }

  .notification-container:hover .notification-icon {
    top: -4.5em;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    z-index: 10001;
  }
`;

export default NotificationButton;
