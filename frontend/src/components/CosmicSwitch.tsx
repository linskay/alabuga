import React from 'react';

type CosmicSwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const CosmicSwitch: React.FC<CosmicSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="cosmic-switch-wrapper">
      <label className="cosmic-toggle">
        <input 
          className="toggle" 
          type="checkbox" 
          checked={!!checked}
          onChange={e => onChange?.(e.target.checked)}
        />
        <div className="slider">
          <div className="cosmos" />
          <div className="energy-line" />
          <div className="energy-line" />
          <div className="energy-line" />
          <div className="toggle-orb">
            <div className="inner-orb" />
            <div className="ring" />
          </div>
          <div className="particles">
            <div style={{ ['--angle' as any]: '30deg' }} className="particle" />
            <div style={{ ['--angle' as any]: '60deg' }} className="particle" />
            <div style={{ ['--angle' as any]: '90deg' }} className="particle" />
            <div style={{ ['--angle' as any]: '120deg' }} className="particle" />
            <div style={{ ['--angle' as any]: '150deg' }} className="particle" />
            <div style={{ ['--angle' as any]: '180deg' }} className="particle" />
          </div>
        </div>
      </label>
    </div>
  );
};

export default CosmicSwitch;