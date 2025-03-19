// Game object manager for handling interactions between game objects
class GameObjectManager {
  constructor() {
    this.gameObjects = new Map();
    this.listeners = new Set();
  }

  // Register a game object
  registerObject(id, object) {
    this.gameObjects.set(id, object);
  }

  // Unregister a game object
  unregisterObject(id) {
    this.gameObjects.delete(id);
  }

  // Add a listener for game events
  addListener(listener) {
    this.listeners.add(listener);
  }

  // Remove a listener
  removeListener(listener) {
    this.listeners.delete(listener);
  }

  // Check if a point intersects with any game object
  checkCollision(x, y) {
    for (const [id, object] of this.gameObjects) {
      if (object.isHit && object.isHit(x, y)) {
        // Notify all listeners of the hit
        this.notifyListeners({
          type: 'hit',
          objectId: id,
          objectType: object.type,
          x,
          y
        });
        return true;
      }
    }
    return false;
  }

  // Notify all listeners of an event
  notifyListeners(event) {
    this.listeners.forEach(listener => listener(event));
  }
}

// Create and export a singleton instance
const gameObjectManager = new GameObjectManager();
export default gameObjectManager; 