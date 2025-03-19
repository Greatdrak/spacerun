import React, { useRef, useEffect, useState } from "react";
import soundManager from "../utils/soundManager";
import gameObjectManager from "../utils/gameObjectManager";
import { useSelector } from 'react-redux';

/**
 * LaserCanvas Component
 * Handles the laser animations, enemy collisions, and explosions.
 */
const LaserCanvas = ({ isMissionComplete }) => {
  const canvasRef = useRef(null);
  const lasersRef = useRef([]);
  const explosionsRef = useRef([]);
  const particlesRef = useRef([]);
  const requestRef = useRef(null);
  const fireIntervalRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const [hasInteracted, setHasInteracted] = useState(false);
  const lastFiredSide = useRef('left'); // Track which side fired last

  // Event handlers
  const handleMouseDown = (event) => {
    if (isMissionComplete) return;
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    // Fire first shot immediately
    fireLaser();
    // Then start continuous firing
    fireIntervalRef.current = setInterval(fireLaser, 100);
  };

  const handleMouseUp = () => {
    if (fireIntervalRef.current) {
      clearInterval(fireIntervalRef.current);
      fireIntervalRef.current = null;
    }
  };

  const handleMouseMove = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    lastMousePosition.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  // Load sound effects
  useEffect(() => {
    soundManager.loadSound('laser', '/sounds/laser.wav');
    soundManager.loadSound('explosion', '/sounds/smallexplosion.wav');
    soundManager.loadSound('muffled-cat', '/sounds/muffledcat.wav');
    soundManager.loadSound('cat-purr', '/sounds/catquickpur.wav');
  }, []);

  // Handle game object hits
  useEffect(() => {
    const handleHit = (event) => {
      if (event.type === 'hit' && hasInteracted) {
        // Play impact sound based on object type
        soundManager.playImpactSound(event.objectType);
        
        // Create explosion at hit location
        explosionsRef.current.push({ 
          x: event.x, 
          y: event.y, 
          radius: 5, 
          alpha: 1 
        });
      }
    };

    gameObjectManager.addListener(handleHit);
    return () => gameObjectManager.removeListener(handleHit);
  }, [hasInteracted]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resize canvas to fill the screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Draw cannon apparatus
    const drawCannons = () => {
      const cannonWidth = 40;
      const cannonHeight = 60;
      const bottomOffset = canvas.height * 0.1; // 10% from bottom
      
      // Left cannon
      ctx.save();
      ctx.translate(cannonWidth, canvas.height - bottomOffset - cannonHeight);
      drawCannon(ctx, cannonWidth, cannonHeight, 'left');
      ctx.restore();

      // Right cannon
      ctx.save();
      ctx.translate(canvas.width - cannonWidth * 2, canvas.height - bottomOffset - cannonHeight);
      drawCannon(ctx, cannonWidth, cannonHeight, 'right');
      ctx.restore();
    };

    // Draw a single cannon
    const drawCannon = (ctx, width, height, side) => {
      // Cannon base
      ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      ctx.fillRect(0, 0, width, height);

      // Cannon barrel
      ctx.fillStyle = 'rgba(70, 70, 70, 0.8)';
      ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4);

      // Cannon glow
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.1)');
      gradient.addColorStop(1, 'rgba(0, 150, 255, 0.1)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Cannon details
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, width, height);
      ctx.strokeRect(width * 0.2, height * 0.3, width * 0.6, height * 0.4);
    };

    // Laser animation loop
    const updateLasers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw cannons
      drawCannons();

      // Draw and update lasers
      lasersRef.current = lasersRef.current.filter((laser) => {
        laser.x += laser.vx;
        laser.y += laser.vy;

        // Add trail points
        laser.trail = laser.trail || [];
        laser.trail.push({ x: laser.x, y: laser.y });
        if (laser.trail.length > 10) laser.trail.shift();

        // Draw laser trail
        laser.trail.forEach((point, index) => {
          const alpha = index / laser.trail.length;
          ctx.beginPath();
          ctx.moveTo(index === 0 ? laser.startX : laser.trail[index - 1].x, 
                    index === 0 ? laser.startY : laser.trail[index - 1].y);
          ctx.lineTo(point.x, point.y);
          ctx.strokeStyle = `rgba(0, ${255 - index * 20}, 255, ${alpha})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        });

        // Draw main laser beam with glow effect
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.x, laser.y);
        
        // Create gradient for glow effect
        const gradient = ctx.createLinearGradient(laser.startX, laser.startY, laser.x, laser.y);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)'); // Cyan
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.8)'); // Magenta
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0.8)'); // Electric blue
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Add particles at laser tip
        particlesRef.current.push({
          x: laser.x,
          y: laser.y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          color: `hsl(${Math.random() * 60 + 180}, 100%, 50%)` // Random color in cyan-blue range
        });

        // Check for collisions with game objects
        if (gameObjectManager.checkCollision(laser.x, laser.y)) {
          return false;
        }

        // Remove laser if it goes off-screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
          return false;
        }

        return true;
      });

      // Draw and update particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${particle.life})`);
        ctx.fill();

        return particle.life > 0;
      });

      // Draw and update explosions
      explosionsRef.current = explosionsRef.current.filter((explosion) => {
        explosion.radius += 1;
        explosion.alpha -= 0.05;

        // Create radial gradient for explosion
        const gradient = ctx.createRadialGradient(
          explosion.x, explosion.y, 0,
          explosion.x, explosion.y, explosion.radius
        );
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)'); // Cyan
        gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.4)'); // Magenta
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)'); // Electric blue

        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        return explosion.alpha > 0;
      });

      requestRef.current = requestAnimationFrame(updateLasers);
    };

    requestRef.current = requestAnimationFrame(updateLasers);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  /**
   * Fires a laser from either the bottom left or right corner.
   */
  const fireLaser = () => {
    if (isMissionComplete) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Play laser sound only if user has interacted
    if (hasInteracted) {
      soundManager.play('laser');
    }

    const { x: clientX, y: clientY } = lastMousePosition.current;
    
    // Determine starting position based on which side is firing
    const cannonWidth = 40;
    const startX = lastFiredSide.current === 'left' 
      ? cannonWidth 
      : canvas.width - cannonWidth;
    const startY = canvas.height * 0.9; // 10% from bottom
    
    // Calculate angle to target
    const angle = Math.atan2(clientY - startY, clientX - startX);
    const speed = 20;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // Add slight spread to the laser
    const spread = 0.1; // Adjust this value to control spread
    const spreadAngle = angle + (Math.random() - 0.5) * spread;
    const spreadVx = Math.cos(spreadAngle) * speed;
    const spreadVy = Math.sin(spreadAngle) * speed;

    lasersRef.current.push({
      startX,
      startY,
      x: startX,
      y: startY,
      targetX: clientX,
      targetY: clientY,
      vx: spreadVx,
      vy: spreadVy,
      trail: []
    });

    // Toggle the firing side
    lastFiredSide.current = lastFiredSide.current === 'left' ? 'right' : 'left';
  };

  // Event listeners setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Add event listeners to the canvas
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (fireIntervalRef.current) {
        clearInterval(fireIntervalRef.current);
      }
    };
  }, [hasInteracted, isMissionComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="laser-canvas"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        zIndex: 2,
        cursor: "crosshair"
      }}
    />
  );
};

export default LaserCanvas;
