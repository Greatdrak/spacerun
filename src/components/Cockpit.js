import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { motion } from "framer-motion";
import MovingStars from "./MovingStars";
import CockpitDashboard from "./CockpitDashboard";
import SpaceCat from "./SpaceCat";
import * as THREE from "three";
import "../styles.css"; // Corrected import path

const Explosion = ({ position, onComplete }) => {
  const ref = useRef();
  const [life, setLife] = useState(0);
  
  useFrame(() => {
    if (life < 1) {
      setLife((prev) => prev + 0.05);
    } else {
      onComplete();
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[life * 0.5, 16, 16]} />
      <meshBasicMaterial color="red" transparent opacity={1 - life} />
    </mesh>
  );
};

const Cockpit = () => {
  const [hyperdrive, setHyperdrive] = useState(false);
  const [missionAccepted, setMissionAccepted] = useState(false);
  const [explosions, setExplosions] = useState([]);

  const toggleHyperdrive = () => {
    setHyperdrive((prev) => !prev);
  };

  const handleAcceptMission = () => {
    setMissionAccepted(true);
    console.log("Mission Accepted!"); // Placeholder for further actions
  };

  const handleCanvasClick = (event) => {
    if (!event || !event.nativeEvent) return;
    const { clientX, clientY, target } = event.nativeEvent;
    if (!target || !target.getBoundingClientRect) return;

    const canvasRect = target.getBoundingClientRect();
    const x = ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const y = -((clientY - canvasRect.top) / canvasRect.height) * 2 + 1;
    const targetPosition = [x * 8, y * 8, -10];
    
    setExplosions((prev) => [
      ...prev,
      { id: Date.now(), position: targetPosition }
    ]);
  };

  return (
    <div className="canvas-container" onClick={handleCanvasClick}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <Canvas camera={{ position: [0, 0, 5] }} className="full-canvas">
          <MovingStars hyperdrive={hyperdrive} />
          {explosions.map((exp) => (
            <Explosion key={exp.id} position={exp.position} onComplete={() => 
              setExplosions((prev) => prev.filter(e => e.id !== exp.id))
            } />
          ))}
        </Canvas>
        <CockpitDashboard toggleHyperdrive={toggleHyperdrive} hyperdrive={hyperdrive} />
        {!missionAccepted && <SpaceCat onAcceptMission={handleAcceptMission} />}
      </motion.div>
    </div>
  );
};

export default Cockpit;