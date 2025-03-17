import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SpaceCat = ({ onAcceptMission }) => {
  const [showCat, setShowCat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCat(true);
    }, 1000); // Show cat after 10 seconds
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
        <p className="cat-text">Welcome to space, Cadet! Are you ready for your first mission?</p>
        <button className="accept-mission-button" onClick={onAcceptMission}>Accept Mission</button>
      </motion.div>
    )
  );
};

export default SpaceCat;
