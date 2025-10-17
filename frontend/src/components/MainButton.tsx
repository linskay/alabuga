import React from 'react';
import styled from 'styled-components';

interface MainButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  hueRotation?: number;
}

const MainButton: React.FC<MainButtonProps> = ({ children, onClick, className = '', disabled = false, hueRotation = 0 }) => {
  return (
    <StyledWrapper $hueRotation={hueRotation}>
      <button 
        className={`button ${className}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $hueRotation: number }>`
  .button {
    /* Основные цвета в диапазоне от rgb(40, 58, 151) до rgb(0, 174, 239) */
    --main-color: rgb(0, 174, 239);
    --main-bg-color: rgba(0, 174, 239, 0.36);
    --pattern-color: rgba(0, 174, 239, 0.073);

    /* Поворот цвета для вариаций */
    filter: hue-rotate(${props => props.$hueRotation}deg);

    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.3rem;
    background: radial-gradient(
        circle,
        var(--main-bg-color) 0%,
        rgba(0, 0, 0, 0) 95%
      ),
      linear-gradient(var(--pattern-color) 1px, transparent 1px),
      linear-gradient(to right, var(--pattern-color) 1px, transparent 1px);
    background-size:
      cover,
      15px 15px,
      15px 15px;
    background-position:
      center center,
      center center,
      center center;
    border-image: radial-gradient(
        circle,
        var(--main-color) 0%,
        rgba(0, 0, 0, 0) 100%
      )
      1;
    border-width: 1px 0 1px 0;
    color: var(--main-color);
    padding: 1rem 2rem;
    font-weight: 700;
    font-size: 1rem;
    transition: background-size 0.2s ease-in-out;
    outline: none;
    min-width: 8rem;
  }

  .button:hover {
    background-size:
      cover,
      10px 10px,
      10px 10px;
  }

  .button:active {
    filter: hue-rotate(${props => props.$hueRotation + 250}deg);
  }

  .button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    filter: grayscale(50%);
  }

  .button:disabled:hover {
    background-size:
      cover,
      15px 15px,
      15px 15px;
  }
`;

export default MainButton;
