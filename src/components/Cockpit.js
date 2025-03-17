import React, { useState } from "react";
import { motion } from "framer-motion";
import CockpitScene from "./CockpitScene";
import CockpitDashboard from "./CockpitDashboard";
import SpaceCat from "./SpaceCat";
import LaserCanvas from "./LaserCanvas";
import "../styles.css";

/**
 * Cockpit Component
 * Manages the spaceship cockpit UI and integrates game elements.
 */
const Cockpit = () => {
  const [hyperdrive, setHyperdrive] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);

  return (
    <div className="canvas-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2 }}>
        <CockpitScene hyperdrive={hyperdrive} />
        <LaserCanvas />
      </motion.div>
      <CockpitDashboard toggleHyperdrive={() => setHyperdrive((prev) => !prev)} hyperdrive={hyperdrive} />
      {!missionAccepted && <SpaceCat onAcceptMission={() => setMissionAccepted(true)} />}
    </div>
  );
};

export default Cockpit;
