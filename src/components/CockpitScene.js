import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import MovingStars from "./MovingStars";
import Ship from "./Ship";

/**
 * CockpitScene Component
 * Handles the 3D environment, including the starfield and cockpit visuals.
 */
const CockpitScene = ({ hyperdrive, isMissionActive, onMissionFailed }) => {
  const [shipHealth, setShipHealth] = useState(100);
  const [shipShields, setShipShields] = useState(100);

  const handleShipDamage = (newHealth) => {
    setShipHealth(newHealth);
    if (newHealth <= 0) {
      onMissionFailed?.();
    }
  };

  const handleShieldChange = (newShields) => {
    setShipShields(newShields);
  };

  return (
    <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
      <color attach="background" args={[0, 0, 0]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <MovingStars hyperdrive={hyperdrive} />
      <Ship 
        onDamage={handleShipDamage}
        onShieldChange={handleShieldChange}
      />
    </Canvas>
  );
};

export default CockpitScene;
