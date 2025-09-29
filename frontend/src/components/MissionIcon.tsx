import React from 'react';
import styled from 'styled-components';

interface MissionIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const MissionIcon: React.FC<MissionIconProps> = ({ 
  size = 24, 
  color = '#51e4dc', 
  className 
}) => {
  return (
    <StyledWrapper size={size} color={color} className={className}>
      <div className="mission-icon">
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
        <div className="mission-icon__box" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ size: number; color: string }>`
  .mission-icon {
    position: relative;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    display: inline-block;
  }

  .mission-icon__box {
    float: left;
    position: relative;
    width: ${props => props.size / 3.6}px;
    height: ${props => props.size / 3.6}px;
    margin-right: ${props => props.size / 12}px;
  }

  .mission-icon__box:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: ${props => props.color};
    border-radius: ${props => props.size / 12}px;
    transform: rotate(45deg);
    opacity: 70%;
  }

  .mission-icon__box:nth-child(3n) {
    margin-right: 0;
    margin-bottom: ${props => props.size / 12}px;
  }

  .mission-icon__box:nth-child(1):before,
  .mission-icon__box:nth-child(4):before {
    margin-left: ${props => props.size / 2.77}px;
  }

  .mission-icon__box:nth-child(3):before {
    margin-top: ${props => props.size / 1.38}px;
  }

  .mission-icon__box:last-child {
    margin-bottom: 0;
  }

  @keyframes moveBox-1 {
    9.0909090909% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    18.1818181818% {
      transform: translate(0px, 0);
    }
    27.2727272727% {
      transform: translate(0px, 0);
    }
    36.3636363636% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    45.4545454545% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    54.5454545455% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    63.6363636364% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    72.7272727273% {
      transform: translate(${props => props.size / 2.77}px, 0px);
    }
    81.8181818182% {
      transform: translate(0px, 0px);
    }
    90.9090909091% {
      transform: translate(-${props => props.size / 2.77}px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(1) {
    animation: moveBox-1 4s infinite;
  }

  @keyframes moveBox-2 {
    9.0909090909% {
      transform: translate(0, 0);
    }
    18.1818181818% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(0px, 0);
    }
    36.3636363636% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    45.4545454545% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    54.5454545455% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    63.6363636364% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    72.7272727273% {
      transform: translate(${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    81.8181818182% {
      transform: translate(0px, ${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(0px, ${props => props.size / 2.77}px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(2) {
    animation: moveBox-2 4s infinite;
  }

  @keyframes moveBox-3 {
    9.0909090909% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    18.1818181818% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(0px, 0);
    }
    36.3636363636% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    45.4545454545% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    54.5454545455% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    63.6363636364% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    72.7272727273% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    81.8181818182% {
      transform: translate(-${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(3) {
    animation: moveBox-3 4s infinite;
  }

  @keyframes moveBox-4 {
    9.0909090909% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    18.1818181818% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(-${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    36.3636363636% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    45.4545454545% {
      transform: translate(0px, 0px);
    }
    54.5454545455% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    63.6363636364% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    72.7272727273% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    81.8181818182% {
      transform: translate(-${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(-${props => props.size / 2.77}px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(4) {
    animation: moveBox-4 4s infinite;
  }

  @keyframes moveBox-5 {
    9.0909090909% {
      transform: translate(0, 0);
    }
    18.1818181818% {
      transform: translate(0, 0);
    }
    27.2727272727% {
      transform: translate(0, 0);
    }
    36.3636363636% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    45.4545454545% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    54.5454545455% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    63.6363636364% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    72.7272727273% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    81.8181818182% {
      transform: translate(${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(5) {
    animation: moveBox-5 4s infinite;
  }

  @keyframes moveBox-6 {
    9.0909090909% {
      transform: translate(0, 0);
    }
    18.1818181818% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    36.3636363636% {
      transform: translate(0px, 0);
    }
    45.4545454545% {
      transform: translate(0px, 0);
    }
    54.5454545455% {
      transform: translate(0px, 0);
    }
    63.6363636364% {
      transform: translate(0px, 0);
    }
    72.7272727273% {
      transform: translate(0px, ${props => props.size / 2.77}px);
    }
    81.8181818182% {
      transform: translate(-${props => props.size / 2.77}px, ${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(-${props => props.size / 2.77}px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(6) {
    animation: moveBox-6 4s infinite;
  }

  @keyframes moveBox-7 {
    9.0909090909% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    18.1818181818% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(${props => props.size / 2.77}px, 0);
    }
    36.3636363636% {
      transform: translate(0px, 0);
    }
    45.4545454545% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    54.5454545455% {
      transform: translate(${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    63.6363636364% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    72.7272727273% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    81.8181818182% {
      transform: translate(0px, 0px);
    }
    90.9090909091% {
      transform: translate(${props => props.size / 2.77}px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(7) {
    animation: moveBox-7 4s infinite;
  }

  @keyframes moveBox-8 {
    9.0909090909% {
      transform: translate(0, 0);
    }
    18.1818181818% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(-${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    36.3636363636% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    45.4545454545% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    54.5454545455% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    63.6363636364% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    72.7272727273% {
      transform: translate(0px, -${props => props.size / 2.77}px);
    }
    81.8181818182% {
      transform: translate(${props => props.size / 2.77}px, -${props => props.size / 2.77}px);
    }
    90.9090909091% {
      transform: translate(${props => props.size / 2.77}px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mission-icon__box:nth-child(8) {
    animation: moveBox-8 4s infinite;
  }

  @keyframes moveBox-9 {
    9.0909090909% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    18.1818181818% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    27.2727272727% {
      transform: translate(0px, 0);
    }
    36.3636363636% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    45.4545454545% {
      transform: translate(0px, 0);
    }
    54.5454545455% {
      transform: translate(0px, 0);
    }
    63.6363636364% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    72.7272727273% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    81.8181818182% {
      transform: translate(-${props => props.size / 1.38}px, 0);
    }
    90.9090909091% {
      transform: translate(-${props => props.size / 2.77}px, 0);
    }
    100% {
      transform: translate(0px, 0);
    }
  }

  .mission-icon__box:nth-child(9) {
    animation: moveBox-9 4s infinite;
  }
`;

export default MissionIcon;
