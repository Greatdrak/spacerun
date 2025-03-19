import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * SpaceCat Component
 * Provides mission instructions and reacts dynamically to mission progress.
 */
const SpaceCat = ({ missionActive, missionStatus, missionInstructions, onAcceptMission }) => {
  const [showCat, setShowCat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCat(true);
    }, 1000); // Show cat after 1 second
    return () => clearTimeout(timer);
  }, []);

  return (
    showCat && (
      <motion.div 
        className="space-cat-overlay" 
        initial={{ x: "100vw", opacity: 0 }}
        animate={{ x: "50%", opacity: 1, y: "50%" }}
        transition={{ duration: 2 }}
      >
        <img src="/space-cat.png" alt="Space Cat" className="cat-image" />
        <p className="cat-text">{missionInstructions}</p>
        {missionStatus === "not-started" && (
          <button className="accept-mission-button" onClick={onAcceptMission}>Accept Mission</button>
        )}
      </motion.div>
    )
  );
};

export default SpaceCat;
