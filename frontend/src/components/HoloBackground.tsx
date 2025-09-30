import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';

const HoloBackground: React.FC = () => {
  // create some stars once
  const stars = useMemo(() => Array.from({ length: 120 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.6 + 0.2,
  })), []);

  useEffect(() => {
    // no-op, placeholder if we need to bind to resize
  }, []);

  return (
    <Wrapper aria-hidden>
      <div className="stars-container">
        <div className="star-layer" />
        <div className="star-layer" />
        <div className="star-layer" />
        {stars.map((s, i) => (
          <div key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, opacity: s.opacity, animationDelay: `${s.delay}s` }} />
        ))}
      </div>
      <div className="nebula" />
      <div className="grid-plane" />
      <div className="loader-container">
        <div className="hologram-platform" />
        <div className="platform-rings">
          <div className="platform-ring" />
          <div className="platform-ring" />
          <div className="platform-ring" />
        </div>
        <div className="projection-beams">
          <div className="beam" />
          <div className="beam" />
          <div className="beam" />
          <div className="beam" />
        </div>
        <div className="holo-container">
          <div className="holo-sphere">
            <div className="holo-ring" />
            <div className="holo-ring" />
            <div className="holo-ring" />
            <div className="holo-ring" />
            <div className="holo-ring" />
            <div className="holo-particles">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="holo-particle" />
              ))}
            </div>
          </div>
          <div className="glitch-effect" />
          <div className="lightning" />
        </div>
        {/* removed on-screen labels */}
        <div className="progress-container"><div className="progress-bar" /></div>
      </div>
    </Wrapper>
  );
};

export default HoloBackground;

const Wrapper = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  width: min(520px, 45vw);
  height: min(420px, 40vh);
  pointer-events: none;
  z-index: 0;
  opacity: 0.8;
  overflow: hidden; /* prevent any overflow from causing page scroll */
  max-width: 100vw;
  contain: layout paint; /* isolate layout/paint to this fixed element */

  .stars-container { position: absolute; inset: 0; perspective: 500px; transform-style: preserve-3d; }
  .star-layer { position: absolute; inset: 0; opacity: 0.5; }
  .star-layer:nth-child(1) { transform: translateZ(-50px); animation: star-drift 150s linear infinite; }
  .star-layer:nth-child(2) { transform: translateZ(-100px); animation: star-drift 200s linear infinite reverse; opacity: 0.4; }
  .star-layer:nth-child(3) { transform: translateZ(-200px); animation: star-drift 250s linear infinite; opacity: 0.3; }
  @keyframes star-drift { 0% { transform: translateZ(-50px) translateY(0); } 100% { transform: translateZ(-50px) translateY(100%); } }
  .star { position: absolute; background: white; border-radius: 50%; filter: blur(1px); animation: blink 3s infinite ease-in-out; }
  @keyframes blink { 0%,100% { opacity: .2 } 50% { opacity: 1 } }

  .nebula { display:none }
  @keyframes nebula-shift { 0% { transform: scale(1) rotate(0deg); opacity: .3 } 50% { opacity: .5 } 100% { transform: scale(1.2) rotate(5deg); opacity: .4 } }

  .grid-plane { display:none }
  @keyframes grid-move { 0% { transform: perspective(500px) rotateX(60deg) translateY(0)} 100% { transform: perspective(500px) rotateX(60deg) translateY(40px)} }

  .loader-container { position: absolute; right: 24px; bottom: 24px; width: 320px; height: 320px; display: flex; justify-content: center; align-items: center; perspective: 800px; transform-style: preserve-3d; z-index: 1; }
  .hologram-platform { position: absolute; width: 260px; height: 56px; bottom: -70px; border-radius: 50%; background: none; box-shadow: none; transform: rotateX(60deg); filter: blur(8px); animation: none; }
  .platform-rings { position: absolute; width: 260px; height: 56px; bottom: -70px; transform: rotateX(60deg); }
  .platform-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; opacity: .4; animation: platform-ring-pulse 4s infinite alternate; }
  .platform-ring:nth-child(1) { border-color: rgba(0,221,255,.4); animation-delay: -1s; }
  .platform-ring:nth-child(2) { width: 85%; height: 85%; top: 7.5%; left: 7.5%; border-color: rgba(255,0,255,.4); animation-delay: -2s; }
  .platform-ring:nth-child(3) { width: 70%; height: 70%; top: 15%; left: 15%; border-color: rgba(0,221,255,.4); animation-delay: -3s; }
  @keyframes platform-ring-pulse { 0% { transform: scale(1); opacity: .2 } 100% { transform: scale(1.05); opacity: .6 } }
  @keyframes platform-glow { 0% { box-shadow: 0 0 30px rgba(0,221,255,.4) } 100% { box-shadow: 0 0 50px rgba(255,0,255,.6) } }

  .projection-beams { position: absolute; width: 300px; height: 300px; bottom: -70px; transform-style: preserve-3d; opacity: .3; pointer-events: none; }
  .beam { position: absolute; width: 1px; height: 240px; background: linear-gradient(0deg, rgba(0,221,255,.8) 0%, rgba(255,255,255,.4) 40%, rgba(0,0,0,0) 100%); bottom: 0; transform-origin: bottom; filter: blur(1px); opacity: .7; }
  .beam:nth-child(1) { left: 30%; transform: rotateY(10deg) rotateX(-30deg); animation: beam-flicker 4s infinite alternate; animation-delay: .5s }
  .beam:nth-child(2) { left: 45%; transform: rotateY(-5deg) rotateX(-25deg); animation: beam-flicker 3s infinite alternate; animation-delay: 1.5s }
  .beam:nth-child(3) { left: 55%; transform: rotateY(5deg) rotateX(-25deg); animation: beam-flicker 4s infinite alternate; animation-delay: .7s }
  .beam:nth-child(4) { left: 70%; transform: rotateY(-10deg) rotateX(-30deg); animation: beam-flicker 3.5s infinite alternate; animation-delay: 2s }
  @keyframes beam-flicker { 0%,100% { opacity: .3 } 50% { opacity: .7 } }

  .holo-container { position: relative; width: 200px; height: 200px; transform-style: preserve-3d; animation: float-container 6s infinite ease-in-out; }
  @keyframes float-container { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }
  .holo-sphere { position: relative; width: 180px; height: 180px; left: 10px; top: 10px; transform-style: preserve-3d; animation: rotate 15s infinite linear; }
  .holo-ring { position: absolute; inset: 0; border-radius: 50%; border: 2px solid transparent; box-shadow: 0 0 20px rgba(255,0,222,.5), 0 0 20px rgba(0,221,255,.5); filter: blur(1px); animation: pulse 3s infinite ease-in-out alternate; transform-style: preserve-3d; }
  .holo-ring:nth-child(1){ border-top-color:#ff00de; border-bottom-color:#00ddff; animation-delay:-.5s }
  .holo-ring:nth-child(2){ border-top-color:#00ddff; border-bottom-color:#ff00de; animation-delay:-1s; transform: rotateX(60deg) }
  .holo-ring:nth-child(3){ border-top-color:#ff00de; border-bottom-color:#00ddff; animation-delay:-1.5s; transform: rotateY(60deg) }
  .holo-ring:nth-child(4){ width:90%; height:90%; top:5%; left:5%; border-left-color:#00ff77; border-right-color:#ff5500; animation-delay:-2s; transform: rotateZ(45deg) }
  .holo-ring:nth-child(5){ width:110%; height:110%; top:-5%; left:-5%; border-left-color:#ff00b3; border-right-color:#3300ff; animation-delay:-2.5s; transform: rotateX(30deg) rotateY(30deg) }
  .holo-particles { position: absolute; inset: 0; transform-style: preserve-3d; }
  .holo-particle { position: absolute; background: radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,0) 70%); border-radius: 50%; filter: blur(1px); opacity: 0; transform-style: preserve-3d; animation: particle-float 4s infinite ease-in-out; }
  .holo-particle:nth-child(1){ width:8px;height:8px; top:20%; left:30%; animation-delay:.1s }
  .holo-particle:nth-child(2){ width:6px;height:6px; top:70%; left:60%; animation-delay:.7s }
  .holo-particle:nth-child(3){ width:10px;height:10px; top:40%; left:80%; animation-delay:1.3s }
  .holo-particle:nth-child(4){ width:5px;height:5px; top:80%; left:25%; animation-delay:1.9s }
  .holo-particle:nth-child(5){ width:7px;height:7px; top:30%; left:50%; animation-delay:2.5s }
  .holo-particle:nth-child(6){ width:9px;height:9px; top:60%; left:40%; animation-delay:3.1s }
  .holo-particle:nth-child(7){ width:4px;height:4px; top:50%; left:75%; animation-delay:3.7s }
  .holo-particle:nth-child(8){ width:8px;height:8px; top:25%; left:85%; animation-delay:4.3s }
  @keyframes particle-float { 0%,100% { transform: translateZ(0) translateX(0) translateY(0) scale(.8); opacity: 0 } 25% { opacity: 1; transform: translateZ(30px) translateX(10px) translateY(-10px) scale(1)} 50% { transform: translateZ(60px) translateX(20px) translateY(-20px) scale(1.2); opacity: .8 } 75% { opacity: .4; transform: translateZ(30px) translateX(10px) translateY(-10px) scale(1) } }
  @keyframes rotate { 0% { transform: rotateX(0) rotateY(0) rotateZ(0)} 100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg)} }

  .glitch-effect { position: absolute; inset: 0; opacity: 0; animation: glitch 7s infinite; pointer-events: none; z-index: 2; background: none; }
  @keyframes glitch { 0%,100% { opacity: 0 } 94%,96% { opacity: 0 } 94.5% { opacity: .8; transform: translate(5px,-5px) skew(-5deg,5deg)} 95% { opacity: .8; transform: translate(-5px,5px) skew(5deg,-5deg)} 95.5% { opacity: .8; transform: translate(5px,0) skew(-5deg,0)} }

  .loading-text { position: absolute; bottom: -72px; right: 24px; text-align: center; font-size: 12px; letter-spacing: 2px; color: rgba(255,255,255,.8); text-shadow: 0 0 10px rgba(0,221,255,.6); animation: text-flicker 2s infinite; }
  @keyframes text-flicker { 0%,100% { opacity: 1 } 8%,10% { opacity: .6 } 9% { opacity: .9 } 52%,54% { opacity: .6 } 53% { opacity: .9 } }
  .progress-container { position: absolute; bottom: -96px; right: 24px; width: 180px; height: 4px; background: rgba(255,255,255,.1); border-radius: 2px; overflow: hidden; }
  .progress-bar { height: 100%; width: 0; background: linear-gradient(90deg, #00ddff, #ff00de); box-shadow: 0 0 10px rgba(0,221,255,.7); animation: progress 5s linear infinite; }
  @keyframes progress { 0%{ width:0 } 20%{ width:20% } 40%{ width:38% } 50%{ width:52% } 60%{ width:65% } 75%{ width:82% } 100%{ width:100% } }
`;


