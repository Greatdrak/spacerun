import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addCredits } from '../store/creditsSlice';
import MissionSpaghettiMonster from "./MissionSpaghettiMonster";

/**
 * MissionManager Component
 * Controls which mission is currently active and loads the corresponding mission.
 */
const MISSION_REWARDS = {
  "spaghetti-monster": 1000
};

const MissionManager = ({ missionActive, onMissionComplete, setMissionInstructions }) => {
  const dispatch = useDispatch();
  const currentCredits = useSelector(state => state.credits);

  useEffect(() => {
    if (missionActive === "spaghetti-monster") {
      setMissionInstructions("Engage hyperdrive to escape the spaghetti monster!");
    }
  }, [missionActive, setMissionInstructions]);

  const handleMissionComplete = () => {
    const reward = MISSION_REWARDS[missionActive];
    
    if (reward) {
      console.log('Awarding credits:', reward);
      console.log('Current credits before:', currentCredits);
      dispatch(addCredits(reward));
      console.log('Current credits after:', currentCredits + reward);
      
      // Add a small delay to ensure credits are updated before completing mission
      setTimeout(() => {
        onMissionComplete();
      }, 100);
    } else {
      onMissionComplete();
    }
  };

  const renderMission = () => {
    switch (missionActive) {
      case "spaghetti-monster":
        return <MissionSpaghettiMonster onComplete={handleMissionComplete} setMissionInstructions={setMissionInstructions} />;
      // Future missions can be added here
      default:
        return null;
    }
  };

  return <>{renderMission()}</>;
};

export default MissionManager;
