import React, { useState, useEffect, useRef } from "react";
import gameObjectManager from "../utils/gameObjectManager";

const Monster = ({ monster, onRef }) => (
  <div
    ref={onRef}
    style={{
      position: "absolute",
      left: `${monster.x}%`,
      top: `${monster.y}%`,
      transform: "translate(-50%, -50%)",
      width: "200px",
      height: "100px",
      backgroundImage: "url('/spaghetti-monster.png')",
      backgroundSize: "cover",
      color: "white",
      transition: "transform 0.1s linear",
      pointerEvents: "none",
      zIndex: 3
    }}
  >
    <p style={{ pointerEvents: "none" }}>{monster.health} HP</p>
  </div>
);

/**
 * MissionSpaghettiMonster Component
 * Spawns Flying Spaghetti Monsters that take laser hits.
 */
const MissionSpaghettiMonster = ({ onComplete, setMissionInstructions }) => {
  const [wave, setWave] = useState(1);
  const [monsters, setMonsters] = useState([]);
  const monsterRefs = useRef({});
  const monsterIds = useRef(new Set());
  const animationFrameRef = useRef(null);

  // Initialize first wave
  useEffect(() => {
    setMonsters([{ id: 1, health: 100, x: 50, y: 25 }]);
  }, []);

  // Handle wave transitions
  useEffect(() => {
    if (wave === 2) {
      setMonsters([
        { id: 2, health: 100, x: 30, y: 15 },
        { id: 3, health: 100, x: 70, y: 15 }
      ]);
    }
  }, [wave]);

  // Movement animation
  useEffect(() => {
    if (wave !== 2) return;

    const moveMonsters = () => {
      setMonsters(prevMonsters => {
        return prevMonsters.map(monster => {
          // Move horizontally
          let newX = monster.x + (0.5 * (monster.id === 2 ? 1 : -1));
          
          // Bounce off screen edges
          if (newX > 80) {
            newX = 80;
          } else if (newX < 20) {
            newX = 20;
          }

          // Slowly move down
          let newY = monster.y + 0.1;
          
          // Stop at bottom of screen
          if (newY > 70) {
            newY = 70;
          }

          return { ...monster, x: newX, y: newY };
        });
      });
      animationFrameRef.current = requestAnimationFrame(moveMonsters);
    };

    animationFrameRef.current = requestAnimationFrame(moveMonsters);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [wave]);

  // Register monsters with game object manager
  useEffect(() => {
    const registerMonster = (id) => {
      const monsterId = `monster-${id}-${Date.now()}`;
      monsterIds.current.add(monsterId);
      
      const monster = {
        type: 'monster',
        isHit: (x, y) => {
          const monsterElement = monsterRefs.current[id];
          if (!monsterElement) return false;
          
          const rect = monsterElement.getBoundingClientRect();
          return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
          );
        }
      };
      
      gameObjectManager.registerObject(monsterId, monster);
      return monsterId;
    };

    // Register all current monsters
    monsters.forEach(monster => {
      registerMonster(monster.id);
    });

    // Cleanup
    return () => {
      Array.from(monsterIds.current).forEach(id => {
        gameObjectManager.unregisterObject(id);
      });
    };
  }, [monsters]);

  // Update mission instructions
  useEffect(() => {
    setMissionInstructions(
      wave === 1 
        ? "Shoot lasers at the Spaghetti Monster by clicking on it!"
        : "Defeat the remaining Spaghetti Monsters!"
    );
  }, [setMissionInstructions, wave]);

  // Handle hits
  useEffect(() => {
    const handleHit = (event) => {
      if (event.type !== 'hit' || !monsterIds.current.has(event.objectId)) return;

      const monsterId = parseInt(event.objectId.split('-')[1]);
      
      setMonsters(prevMonsters => {
        const updatedMonsters = prevMonsters.map(monster => {
          if (monster.id !== monsterId) return monster;
          
          const newHealth = monster.health - 5;
          if (newHealth <= 0) return null;
          
          return { ...monster, health: newHealth };
        }).filter(Boolean);

        // Handle wave transitions
        if (updatedMonsters.length === 0) {
          if (wave === 1) {
            setWave(2);
            return [];
          } else {
            setMissionInstructions("Great Job, Cadet! You're a real natural.");
            onComplete();
            return [];
          }
        }

        return updatedMonsters;
      });
    };

    gameObjectManager.addListener(handleHit);
    return () => gameObjectManager.removeListener(handleHit);
  }, [wave, onComplete, setMissionInstructions]);

  return (
    <>
      {monsters.map(monster => (
        <Monster
          key={monster.id}
          monster={monster}
          onRef={el => monsterRefs.current[monster.id] = el}
        />
      ))}
    </>
  );
};

export default MissionSpaghettiMonster;
