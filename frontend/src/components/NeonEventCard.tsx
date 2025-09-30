import React from 'react';
import styled from 'styled-components';

type NeonEventCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
};

const NeonEventCard: React.FC<NeonEventCardProps> = ({ title, subtitle, description, children }) => {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.querySelector('#card') as HTMLDivElement | null;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const rx = (-py * 10).toFixed(2);
    const ry = (px * 10).toFixed(2);
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget.querySelector('#card') as HTMLDivElement | null;
    if (!el) return;
    el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };
  return (
    <StyledWrapper>
      <div className="container noselect" onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="canvas">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={`tracker tr-${i + 1}`} />
          ))}
          <div id="card">
            <div className="card-content">
              <div className="card-glare" />
              <div className="cyber-lines">
                <span /><span /><span /><span />
              </div>
              <div className="title">{title}</div>
              {subtitle && <div className="subtitle"><span>{subtitle}</span></div>}
              {description && <div className="desc">{description}</div>}
              <div className="glowing-elements">
                <div className="glow-1" />
                <div className="glow-2" />
                <div className="glow-3" />
              </div>
              <div className="card-particles">
                {Array.from({ length: 6 }).map((_, i) => <span key={i} />)}
              </div>
              <div className="corner-elements"><span /><span /><span /><span /></div>
              <div className="content-area">
                {children}
              </div>
              <div className="scan-line" />
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default NeonEventCard;

const StyledWrapper = styled.div`
  .container { position: relative; width: 100%; height: 220px; transition: 200ms; perspective: 800px; }
  #card { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; border-radius: 16px; transition: transform 400ms ease, filter 300ms ease; transform-style: preserve-3d; will-change: transform; background: linear-gradient(45deg, #0f172a, #111827); border: 1px solid rgba(255,255,255,0.12); overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.35), inset 0 0 20px rgba(0,0,0,0.25); }
  .card-content { position: relative; width: 100%; height: 100%; padding: 16px; }
  .title { position: absolute; top: 14px; left: 16px; right: 16px; text-align: left; font-size: 16px; font-weight: 800; letter-spacing: 2px; background: linear-gradient(45deg, #22d3ee, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 10px rgba(34,211,238,0.25)); }
  .subtitle { position: absolute; top: 38px; left: 16px; right: 16px; font-size: 12px; letter-spacing: 1px; color: rgba(255,255,255,0.78); }
  .desc { position: absolute; top: 56px; left: 16px; right: 16px; font-size: 12px; line-height: 1.2; color: rgba(255,255,255,0.65); }
  .content-area { position: absolute; left: 16px; right: 16px; bottom: 16px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; justify-content: flex-end; }
  .card-glare { position: absolute; inset: 0; background: linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 55%, rgba(255,255,255,0) 100%); opacity: 0; transition: opacity 300ms; }
  .cyber-lines span { position: absolute; background: linear-gradient(90deg, transparent, rgba(92,103,255,0.2), transparent); height: 1px; width: 100%; opacity: 0.6; }
  .cyber-lines span:nth-child(1){ top: 25%; }
  .cyber-lines span:nth-child(2){ top: 50%; }
  .cyber-lines span:nth-child(3){ top: 75%; }
  .cyber-lines span:nth-child(4){ top: 90%; }
  .glowing-elements { position: absolute; inset: 0; pointer-events: none; }
  .glow-1,.glow-2,.glow-3 { position: absolute; width: 120px; height: 120px; border-radius: 50%; background: radial-gradient(circle at center, rgba(167,139,250,0.25) 0%, rgba(167,139,250,0) 70%); filter: blur(18px); opacity: 0; transition: opacity .3s; }
  .glow-1{ top:-20px; left:-20px } .glow-2{ right:-30px; top:50%; transform:translateY(-50%) } .glow-3{ bottom:-20px; left:30% }
  .card-particles span{ position:absolute; width:3px; height:3px; background:#22d3ee; border-radius:50%; opacity:0; }
  .corner-elements span{ position:absolute; width:14px; height:14px; border:1px solid rgba(167,139,250,0.4); }
  .corner-elements span:nth-child(1){ top:8px; left:8px; border-right:0; border-bottom:0 }
  .corner-elements span:nth-child(2){ top:8px; right:8px; border-left:0; border-bottom:0 }
  .corner-elements span:nth-child(3){ bottom:8px; left:8px; border-right:0; border-top:0 }
  .corner-elements span:nth-child(4){ bottom:8px; right:8px; border-left:0; border-top:0 }
  .scan-line{ position:absolute; inset:0; background: linear-gradient(to bottom, transparent, rgba(92,103,255,0.1), transparent); transform: translateY(-100%); animation: scanMove 3s linear infinite }
  @keyframes scanMove{ 0%{ transform:translateY(-100%) } 100%{ transform:translateY(100%) } }
  .canvas{ position:absolute; inset:0; }
  .tracker{ position:absolute; inset:0; }
  .tracker:hover{ cursor:pointer }
  .tracker:hover ~ #card .card-glare{ opacity:1 }
  #card:hover{ filter: brightness(1.05) }
  #card:hover .glowing-elements div{ opacity:1 }
`;


