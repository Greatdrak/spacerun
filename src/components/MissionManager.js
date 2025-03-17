import React from "react";
import MissionSpaghettiMonster from "./MissionSpaghettiMonster";

/**
 * MissionManager Component
 * Controls which mission is currently active.
 */
const MissionManager = ({ missionActive, onMissionComplete }) => {
  return (
    <>
      {missionActive === "spaghetti-monster" && <MissionSpaghettiMonster onComplete={onMissionComplete} />}
    </>
  );
};

export default MissionManager;
