// Sound manager utility for handling game audio
class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.activeSounds = new Map();
    this.volume = 0.3; // Default volume at 30%
  }

  // Load a sound file
  loadSound(name, url) {
    const audio = new Audio(url);
    audio.volume = this.volume;
    this.sounds.set(name, audio);
  }

  // Play a sound
  play(soundName) {
    const sound = this.sounds.get(soundName);
    if (!sound) return;

    // Create a new Audio instance for this play
    const audio = new Audio(sound.src);
    audio.volume = sound.volume;
    
    // Store the audio instance with a unique ID
    const id = Date.now();
    this.activeSounds.set(id, audio);

    // Play the sound
    audio.play().catch(error => {
      console.warn('Audio playback failed:', error);
      this.activeSounds.delete(id);
    });

    // Clean up when the sound finishes
    audio.onended = () => {
      this.activeSounds.delete(id);
    };
  }

  // Set volume for all sounds
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach((sound, name) => {
      sound.volume = this.volume;
    });
  }

  playImpactSound(objectType) {
    // Play explosion sound for enemies or default impact sound
    this.play('explosion');
  }

  stopAll() {
    this.activeSounds.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeSounds.clear();
  }
}

// Create and export a singleton instance
const soundManager = new SoundManager();
export default soundManager; 