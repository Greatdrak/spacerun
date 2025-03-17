import React from "react";
import { Canvas } from "@react-three/fiber";
import MovingStars from "./MovingStars";

/**
 * CockpitScene Component
 * Handles the 3D environment, including the starfield and cockpit visuals.
 */
const CockpitScene = ({ hyperdrive }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }} className="full-canvas">
      <MovingStars hyperdrive={hyperdrive} />
    </Canvas>
  );
};

export default CockpitScene;
