// CockpitDashboard.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleHyperdrive, toggleShields } from '../store/actions';
import "../styles.css";

const CockpitDashboard = () => {
  const dispatch = useDispatch();
  const { isEngaged: isHyperdriveEngaged } = useSelector((state) => state.hyperdrive);
  const { isEngaged: isShieldsEngaged } = useSelector((state) => state.shields);
  const credits = useSelector((state) => state.credits);

  const handleHyperdriveToggle = () => {
    dispatch(toggleHyperdrive());
  };

  const handleShieldsToggle = () => {
    dispatch(toggleShields());
  };

  return (
    <div className="cockpit-dashboard">
      <div className="status-display">
        <div className="status-item">
          <span className="status-label">CREDITS</span>
          <span className="status-value">{credits}</span>
        </div>
        <div className="status-item">
          <span className="status-label">HEALTH</span>
          <div className="status-bar">
            <div className="status-fill health-fill" style={{ width: '100%' }} />
          </div>
          <span className="status-value">100%</span>
        </div>
        <div className="status-item">
          <span className="status-label">SHIELDS</span>
          <div className="status-bar">
            <div className="status-fill shield-fill" style={{ width: '100%' }} />
          </div>
          <span className="status-value">100%</span>
        </div>
      </div>
      <div className="controls">
        <button 
          className={`hyperdrive-button ${isHyperdriveEngaged ? 'active' : ''}`}
          onClick={handleHyperdriveToggle}
        >
          Hyperdrive <span className="keyboard-key">1</span>
        </button>
        <button 
          className={`shield-button ${isShieldsEngaged ? 'active' : ''}`}
          onClick={handleShieldsToggle}
        >
          Shields <span className="keyboard-key">2</span>
        </button>
      </div>
    </div>
  );
};

export default CockpitDashboard;