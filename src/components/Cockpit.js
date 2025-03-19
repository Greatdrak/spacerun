import React, { useState, useRef } from "react";
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";
import CockpitScene from "./CockpitScene";
import CockpitDashboard from "./CockpitDashboard";
import SpaceCat from "./SpaceCat";
import LaserCanvas from "./LaserCanvas";
import MissionManager from "./MissionManager";
import ScrollingText from "./ScrollingText";
import "../styles.css";

/**
 * Cockpit Component
 * Manages the spaceship cockpit UI and integrates game elements.
 */
const Cockpit = () => {
  const [missionActive, setMissionActive] = useState(null); // No mission active initially
  const [missionStatus, setMissionStatus] = useState("not-started"); // Tracks mission progress
  const [missionInstructions, setMissionInstructions] = useState("Welcome to space, Cadet! Are you ready for your first mission?");
  const [showScrollingText, setShowScrollingText] = useState(false);
  const hyperdrive = useSelector(state => state.hyperdrive);
  const audioContext = useRef(null);

  // Initialize audio context
  const initAudio = () => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Play sound function
  const playSound = async (soundFile) => {
    initAudio();
    try {
      const response = await fetch(soundFile);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  /**
   * Handles accepting a mission.
   * Updates mission status and activates the mission.
   */
  const handleAcceptMission = () => {
    setMissionActive("spaghetti-monster");
    setMissionStatus("in-progress");
    playSound('/sounds/muffledcat.wav');
  };

  /**
   * Handles completing a mission.
   * Resets mission state and displays the completion message.
   */
  const handleMissionComplete = () => {
    setMissionStatus("completed");
    setMissionActive(null);
    setShowScrollingText(true);
    playSound('/sounds/catquickpur.wav');
  };

  return (
    <div className="canvas-container">
      <div className="scene-container">
        <CockpitScene 
          hyperdrive={hyperdrive} 
          isMissionActive={missionActive === "spaghetti-monster"} 
        />
      </div>
      <LaserCanvas isMissionComplete={missionStatus === "completed"} />
      <div className="mission-container">
        <MissionManager
          missionActive={missionActive}
          onMissionComplete={handleMissionComplete}
          setMissionInstructions={setMissionInstructions}
        />
      </div>
      <div className="ui-container">
        <CockpitDashboard 
          isMissionActive={missionActive === "spaghetti-monster"}
          shipHealth={100}
          shipShields={100}
        />
        <SpaceCat
          missionActive={missionActive}
          missionStatus={missionStatus}
          missionInstructions={missionInstructions}
          onAcceptMission={handleAcceptMission}
        />
        {showScrollingText && <ScrollingText text="Mission Complete" />}
      </div>
    </div>
  );
};

export default Cockpit;
