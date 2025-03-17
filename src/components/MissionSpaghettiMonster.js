import React, { useState, useEffect } from "react";

/**
 * MissionSpaghettiMonster Component
 * Spawns a Flying Spaghetti Monster that takes laser hits.
 */
const MissionSpaghettiMonster = ({ onComplete }) => {
  const [health, setHealth] = useState(100);
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: 100 });

  /**
   * Handles laser impact detection.
   */
  const handleLaserHit = () => {
    setHealth((prev) => {
      const newHealth = prev - 1;
      if (newHealth <= 0) {
        onComplete(); // Mission success
      }
      return newHealth;
    });
  };

  /**
   * Listens for laser impacts from LaserCanvas.
   */
  useEffect(() => {
    const handleLaserCollision = (event) => {
      const { detail } = event;
      const { x, y } = detail;

      // Simple collision detection based on position
      if (
        x > position.x - 50 &&
        x < position.x + 50 &&
        y > position.y - 50 &&
        y < position.y + 50
      ) {
        handleLaserHit();
      }
    };

    window.addEventListener("laser-hit", handleLaserCollision);
    return () => {
      window.removeEventListener("laser-hit", handleLaserCollision);
    };
  }, [position]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "100px",
        height: "100px",
        backgroundImage: "url('/spaghetti-monster.png')",
        backgroundSize: "cover",
      }}
    >
      <p style={{ color: "white", textAlign: "center" }}>{health} HP</p>
    </div>
  );
};

export default MissionSpaghettiMonster;
