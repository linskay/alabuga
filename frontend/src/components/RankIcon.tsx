import React from 'react';
import styled from 'styled-components';

type RankIconProps = {
  size?: number;
  color?: string;
};

const RankIcon: React.FC<RankIconProps> = ({ size = 28, color = '#ffa600' }) => {
  return (
    <StyledWrapper $size={size} $color={color}>
      <div className="custom-loader" />
    </StyledWrapper>
  );
};

export default RankIcon;

const StyledWrapper = styled.div<{ $size: number; $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .custom-loader {
    width: ${p => p.$size}px;
    height: ${p => p.$size}px;
    background: ${p => p.$color};
    border-radius: ${p => Math.round(p.$size * 0.71)}px;
    -webkit-mask: radial-gradient(circle ${p => Math.round(p.$size * 0.44)}px at 50% calc(100% + ${p => Math.round(p.$size * 0.185)}px), #000 95%, #0000) top ${p => Math.round(p.$size * 0.057)}px left 50%,
      radial-gradient(circle ${p => Math.round(p.$size * 0.44)}px, #000 95%, #0000) center,
      radial-gradient(circle ${p => Math.round(p.$size * 0.44)}px at 50% -${p => Math.round(p.$size * 0.185)}px, #000 95%, #0000) bottom ${p => Math.round(p.$size * 0.057)}px left 50%,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    -webkit-mask-repeat: no-repeat;
    animation: cu10 1.5s infinite;
  }

  @keyframes cu10 {
    0% {
      -webkit-mask-size: 0    18px,0    18px,0    18px,auto
    }
    16.67% {
      -webkit-mask-size: 100% 18px,0    18px,0    18px,auto
    }
    33.33% {
      -webkit-mask-size: 100% 18px,100% 18px,0    18px,auto
    }
    50% {
      -webkit-mask-size: 100% 18px,100% 18px,100% 18px,auto
    }
    66.67% {
      -webkit-mask-size: 0    18px,100% 18px,100% 18px,auto
    }
    83.33% {
      -webkit-mask-size: 0    18px,0    18px,100% 18px,auto
    }
    100% {
      -webkit-mask-size: 0    18px,0    18px,0    18px,auto
    }
  }
`;


