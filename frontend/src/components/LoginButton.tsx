import React from 'react';
import styled from 'styled-components';

interface LoginButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick, children, className = "" }) => {
  return (
    <StyledWrapper className={className}>
      <button onClick={onClick}>
        {children}
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  button {
    --cyan: rgb(106, 207, 246);
    font-size: 15px;
    padding: 0.7em 1.5em;
    letter-spacing: 0.06em;
    position: relative;
    font-family: inherit;
    border-radius: 0.6em;
    overflow: hidden;
    transition: all 0.3s;
    line-height: 1.4em;
    border: 2px solid var(--cyan);
    background: linear-gradient(to right, rgba(106, 207, 246, 0.1) 1%, transparent 40%,transparent 60% , rgba(106, 207, 246, 0.1) 100%);
    color: var(--cyan);
    box-shadow: inset 0 0 10px rgba(106, 207, 246, 0.4), 0 0 9px 3px rgba(106, 207, 246, 0.1);
    cursor: pointer;
  }

  button:hover {
    color: rgb(150, 220, 255);
    box-shadow: inset 0 0 10px rgba(106, 207, 246, 0.6), 0 0 9px 3px rgba(106, 207, 246, 0.2);
  }

  button:before {
    content: "";
    position: absolute;
    left: -4em;
    width: 4em;
    height: 100%;
    top: 0;
    transition: transform .4s ease-in-out;
    background: linear-gradient(to right, transparent 1%, rgba(106, 207, 246, 0.1) 40%,rgba(106, 207, 246, 0.1) 60% , transparent 100%);
  }

  button:hover:before {
    transform: translateX(15em);
  }
`;

export default LoginButton;
