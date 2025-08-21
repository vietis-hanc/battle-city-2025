// Input handling for tank battle game
class InputManager {
    constructor() {
        this.keys = new Set();
        this.keyPressed = new Set();
        this.keyReleased = new Set();
        // Mobile touch state tracking
        this.touchKeys = new Set();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (!this.keys.has(e.code)) {
                this.keyPressed.add(e.code);
            }
            this.keys.add(e.code);
            
            // Prevent default for arrow keys and space
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.code);
            this.keyReleased.add(e.code);
        });
    }
    
    // Check if key is currently pressed (includes mobile touch)
    isKeyDown(keyCode) {
        return this.keys.has(keyCode) || this.touchKeys.has(keyCode);
    }
    
    // Check if key was just pressed this frame (includes mobile touch)
    isKeyPressed(keyCode) {
        return this.keyPressed.has(keyCode);
    }
    
    // Check if key was just released this frame
    isKeyReleased(keyCode) {
        return this.keyReleased.has(keyCode);
    }
    
    // Mobile control methods
    setTouchKey(keyCode, pressed) {
        if (pressed) {
            if (!this.touchKeys.has(keyCode)) {
                this.keyPressed.add(keyCode); // Trigger key press event
            }
            this.touchKeys.add(keyCode);
        } else {
            this.touchKeys.delete(keyCode);
            this.keyReleased.add(keyCode); // Trigger key release event
        }
    }
    
    // Get player movement direction from arrow keys
    getMovementDirection() {
        if (this.isKeyDown('ArrowUp')) return CONSTANTS.DIRECTIONS.UP;
        if (this.isKeyDown('ArrowDown')) return CONSTANTS.DIRECTIONS.DOWN;
        if (this.isKeyDown('ArrowLeft')) return CONSTANTS.DIRECTIONS.LEFT;
        if (this.isKeyDown('ArrowRight')) return CONSTANTS.DIRECTIONS.RIGHT;
        return -1; // No movement
    }
    
    // Check if fire button is pressed
    isFirePressed() {
        return this.isKeyPressed('Space');
    }
    
    // Check if enter is pressed (for menu navigation)
    isEnterPressed() {
        return this.isKeyPressed('Enter');
    }
    
    // Check if escape is pressed (for pause)
    isEscapePressed() {
        return this.isKeyPressed('Escape');
    }
    
    // Clear frame-specific key states (call at end of each frame)
    clearFrameStates() {
        this.keyPressed.clear();
        this.keyReleased.clear();
    }
    
    // Get all currently pressed keys (for debugging)
    getPressedKeys() {
        return Array.from(this.keys);
    }
}