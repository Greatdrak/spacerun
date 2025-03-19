import React from 'react';
import { motion } from 'framer-motion';

const ScrollingText = ({ text }) => {
  return (
    <div className="scrolling-text-container">
      <motion.div
        className="scrolling-text"
        initial={{ y: "-100vh" }}
        animate={{ y: "100vh" }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: 0
        }}
      >
        <div className="text-content">
          <h1>{text}</h1>
          <p>Great job, Cadet!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ScrollingText; 