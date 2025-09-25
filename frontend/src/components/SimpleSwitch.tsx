import React from 'react';

type SimpleSwitchProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

const SimpleSwitch: React.FC<SimpleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <label style={{ 
        position: 'relative',
        display: 'inline-block',
        width: '60px',
        height: '34px'
      }}>
        <input
          type="checkbox"
          checked={!!checked}
          onChange={e => onChange?.(e.target.checked)}
          style={{
            opacity: 0,
            width: 0,
            height: 0
          }}
        />
        <span style={{
          position: 'absolute',
          cursor: 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: checked ? '#4ecdc4' : '#ccc',
          transition: '0.4s',
          borderRadius: '34px'
        }}>
          <span style={{
            position: 'absolute',
            content: '""',
            height: '26px',
            width: '26px',
            left: '4px',
            bottom: '4px',
            backgroundColor: 'white',
            transition: '0.4s',
            borderRadius: '50%',
            transform: checked ? 'translateX(26px)' : 'translateX(0)'
          }} />
        </span>
      </label>
    </div>
  );
};

export default SimpleSwitch;
