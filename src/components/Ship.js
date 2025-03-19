import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';

const Ship = ({ onPositionChange, onDamage, onShieldChange }) => {
  const { camera } = useThree();
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [targetVelocity, setTargetVelocity] = useState({ x: 0, y: 0, z: 0 });
  const [health, setHealth] = useState(100);
  const [shields, setShields] = useState(100);
  const [lastDamageTime, setLastDamageTime] = useState(0);
  const [shieldRegenRate] = useState(0.5); // Shield regeneration rate per second
  const [shieldDrainRate] = useState(1.0); // Shield energy drain rate per second
  const isShieldsActive = useSelector(state => state.shields);

  // Movement speed and rotation speed
  const MOVEMENT_SPEED = 10.0;
  const ROTATION_SPEED = 0.15;
  const MAX_SPEED = 50;
  const ACCELERATION = 0.5;
  const DECELERATION = 0.3;
  const SHIP_RADIUS = 5; // Collision radius
  const DAMAGE_COOLDOWN = 1.0; // Seconds between damage events

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
          setTargetVelocity(prev => ({ ...prev, z: -MOVEMENT_SPEED }));
          break;
        case 's':
          setTargetVelocity(prev => ({ ...prev, z: MOVEMENT_SPEED }));
          break;
        case 'a':
          setTargetVelocity(prev => ({ ...prev, x: -MOVEMENT_SPEED }));
          break;
        case 'd':
          setTargetVelocity(prev => ({ ...prev, x: MOVEMENT_SPEED }));
          break;
        case 'q':
          setTargetVelocity(prev => ({ ...prev, y: MOVEMENT_SPEED }));
          break;
        case 'e':
          setTargetVelocity(prev => ({ ...prev, y: -MOVEMENT_SPEED }));
          break;
        case 'arrowleft':
          setRotation(prev => ({ ...prev, y: prev.y + ROTATION_SPEED }));
          break;
        case 'arrowright':
          setRotation(prev => ({ ...prev, y: prev.y - ROTATION_SPEED }));
          break;
        case 'arrowup':
          setRotation(prev => ({ ...prev, x: prev.x + ROTATION_SPEED }));
          break;
        case 'arrowdown':
          setRotation(prev => ({ ...prev, x: prev.x - ROTATION_SPEED }));
          break;
      }
    };

    const handleKeyUp = (e) => {
      switch(e.key.toLowerCase()) {
        case 'w':
        case 's':
          setTargetVelocity(prev => ({ ...prev, z: 0 }));
          break;
        case 'a':
        case 'd':
          setTargetVelocity(prev => ({ ...prev, x: 0 }));
          break;
        case 'q':
        case 'e':
          setTargetVelocity(prev => ({ ...prev, y: 0 }));
          break;
        case 'arrowleft':
        case 'arrowright':
          setRotation(prev => ({ ...prev, y: prev.y }));
          break;
        case 'arrowup':
        case 'arrowdown':
          setRotation(prev => ({ ...prev, x: prev.x }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Check for collisions with debris
  const checkCollisions = (debrisPositions) => {
    if (!debrisPositions) return;
    
    const currentTime = Date.now() / 1000;
    if (currentTime - lastDamageTime < DAMAGE_COOLDOWN) return;

    for (let i = 0; i < debrisPositions.length; i += 3) {
      const debrisX = debrisPositions[i];
      const debrisY = debrisPositions[i + 1];
      const debrisZ = debrisPositions[i + 2];

      const dx = position.x - debrisX;
      const dy = position.y - debrisY;
      const dz = position.z - debrisZ;

      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < SHIP_RADIUS) {
        handleCollision();
        setLastDamageTime(currentTime);
        break;
      }
    }
  };

  // Handle collision with debris
  const handleCollision = () => {
    if (isShieldsActive && shields > 0) {
      // Shields take damage
      const newShields = Math.max(0, shields - 20);
      setShields(newShields);
      onShieldChange?.(newShields);
    } else {
      // Hull takes damage
      const newHealth = Math.max(0, health - 10);
      setHealth(newHealth);
      onDamage?.(newHealth);
    }
  };

  // Smoothly interpolate velocity towards target velocity
  const interpolateVelocity = (current, target, delta) => {
    const diff = target - current;
    if (Math.abs(diff) < 0.01) return target;
    
    const step = diff > 0 ? ACCELERATION : DECELERATION;
    return current + diff * step * delta * 60;
  };

  // Update camera position and rotation based on velocity and rotation
  useFrame((state, delta) => {
    // Update shields
    if (isShieldsActive && shields > 0) {
      const newShields = Math.max(0, shields - shieldDrainRate * delta);
      setShields(newShields);
      onShieldChange?.(newShields);
    } else if (!isShieldsActive && shields < 100) {
      const newShields = Math.min(100, shields + shieldRegenRate * delta);
      setShields(newShields);
      onShieldChange?.(newShields);
    }

    // Smoothly interpolate velocity towards target velocity
    const newVelocity = {
      x: interpolateVelocity(velocity.x, targetVelocity.x, delta),
      y: interpolateVelocity(velocity.y, targetVelocity.y, delta),
      z: interpolateVelocity(velocity.z, targetVelocity.z, delta)
    };

    // Calculate movement based on rotation and velocity
    const newPosition = {
      x: position.x + newVelocity.x * delta * 60,
      y: position.y + newVelocity.y * delta * 60,
      z: position.z + newVelocity.z * delta * 60
    };

    // Limit speed
    const speed = Math.sqrt(
      newPosition.x * newPosition.x + 
      newPosition.y * newPosition.y + 
      newPosition.z * newPosition.z
    );

    if (speed > MAX_SPEED) {
      const ratio = MAX_SPEED / speed;
      newPosition.x *= ratio;
      newPosition.y *= ratio;
      newPosition.z *= ratio;
    }

    setPosition(newPosition);
    setVelocity(newVelocity);
    
    // Update camera position and rotation
    camera.position.set(newPosition.x, newPosition.y, newPosition.z);
    camera.rotation.set(rotation.x, rotation.y, rotation.z);
    
    onPositionChange?.(newPosition);
  });

  return null; // No need to render anything since we're controlling the camera
};

export default Ship; 