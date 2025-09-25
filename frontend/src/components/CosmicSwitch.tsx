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
            <div className="particle" style={{ ['--angle' as any]: '30deg' }} />
            <div className="particle" style={{ ['--angle' as any]: '60deg' }} />
            <div className="particle" style={{ ['--angle' as any]: '90deg' }} />
            <div className="particle" style={{ ['--angle' as any]: '120deg' }} />
            <div className="particle" style={{ ['--angle' as any]: '150deg' }} />
            <div className="particle" style={{ ['--angle' as any]: '180deg' }} />
          </div>
        </div>
      </label>
    </div>
  );
};

export default CosmicSwitch;