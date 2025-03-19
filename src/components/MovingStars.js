// MovingStars.js
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MovingStars = ({ hyperdrive }) => {
  const starsRef = useRef();
  const stars = useRef(
    new Array(1000).fill().map(() => [
      (Math.random() - 0.5) * 2000,
      (Math.random() - 0.5) * 2000,
      Math.random() * -1000,
    ])
  );

  useFrame(() => {
    if (starsRef.current) {
      const speed = hyperdrive ? 2 : 0.3;
      stars.current.forEach((star) => {
        star[2] += speed;
        if (star[2] > 0) star[2] = -1000;
      });
      starsRef.current.geometry.setFromPoints(
        stars.current.map((star) => new THREE.Vector3(...star))
      );
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry />
      <pointsMaterial color="white" size={2} sizeAttenuation={true} />
    </points>
  );
};

export default MovingStars;