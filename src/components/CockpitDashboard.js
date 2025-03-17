// CockpitDashboard.js
import React from "react";

const CockpitDashboard = ({ toggleHyperdrive, hyperdrive }) => {
  return (
    <div className="dashboard">
      <div className={`dashboard-screen ${hyperdrive ? "active" : ""}`}>
        {hyperdrive ? "HYPERDRIVE ENGAGED" : "SYSTEMS ONLINE"}
      </div>
      <div className="dashboard-controls">
        <button className="control-button">THRUST</button>
        <button className="control-button">SHIELDS</button>
        <button className={`control-button ${hyperdrive ? "active" : ""}`} onClick={toggleHyperdrive}>
          {hyperdrive ? "DISENGAGE HYPERDRIVE" : "ENGAGE HYPERDRIVE"}
        </button>
      </div>
    </div>
  );
};

export default CockpitDashboard;