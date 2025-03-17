import React, { useRef, useEffect } from "react";

/**
 * LaserCanvas Component
 * Handles the laser animations, enemy collisions, and explosions.
 */
const LaserCanvas = () => {
  const canvasRef = useRef(null);
  const lasersRef = useRef([]);
  const explosionsRef = useRef([]);
  const requestRef = useRef(null);
  const fireIntervalRef = useRef(null);
  const lastMousePosition = useRef({ x: 0, y: 0 });

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

    // Laser animation loop
    const updateLasers = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update lasers
      lasersRef.current = lasersRef.current.filter((laser) => {
        laser.x += laser.vx;
        laser.y += laser.vy;

        // Draw laser beam
        ctx.beginPath();
        ctx.moveTo(laser.startX, laser.startY);
        ctx.lineTo(laser.x, laser.y);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dispatch event for mission targets to detect laser hits
        const hitEvent = new CustomEvent("laser-hit", {
          detail: { x: laser.x, y: laser.y },
        });
        window.dispatchEvent(hitEvent);

        // If laser reaches the target, trigger explosion
        if (Math.hypot(laser.x - laser.targetX, laser.y - laser.targetY) < 5) {
          explosionsRef.current.push({ x: laser.x, y: laser.y, radius: 5, alpha: 1 });
          return false; // Remove laser
        }

        // Remove laser if it goes off-screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
          return false;
        }

        return true;
      });

      // Draw and update explosions
      explosionsRef.current = explosionsRef.current.filter((explosion) => {
        explosion.radius += 1;
        explosion.alpha -= 0.05;

        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 165, 0, ${explosion.alpha})`;
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
   * Fires a laser from the ship's center bottom to the target position.
   */
  const fireLaser = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x: clientX, y: clientY } = lastMousePosition.current;
    const startX = canvas.width / 2;
    const startY = canvas.height - 50;

    const angle = Math.atan2(clientY - startY, clientX - startX);
    const speed = 12;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    lasersRef.current.push({
      startX,
      startY,
      x: startX,
      y: startY,
      targetX: clientX,
      targetY: clientY,
      vx,
      vy,
    });
  };

  /**
   * Starts firing lasers continuously while the mouse is held down.
   */
  const handleMouseDown = () => {
    fireLaser(); // Fire first shot immediately
    fireIntervalRef.current = setInterval(fireLaser, 100); // Continuous fire
  };

  /**
   * Stops firing lasers when the mouse button is released.
   */
  const handleMouseUp = () => {
    clearInterval(fireIntervalRef.current);
  };

  /**
   * Updates the target position while the mouse moves.
   */
  const handleMouseMove = (event) => {
    lastMousePosition.current = { x: event.clientX, y: event.clientY };
  };

  return (
    <canvas
      ref={canvasRef}
      className="laser-canvas"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "auto",
        zIndex: 10,
      }}
    />
  );
};

export default LaserCanvas;
