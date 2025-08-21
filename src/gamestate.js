// Game state management for tank battle
class GameState {
    constructor() {
        this.currentState = CONSTANTS.GAME_STATES.MENU;
        this.gameStartTime = 0;
        this.gameTime = 0;
        this.score = 0;
        this.playerLives = CONSTANTS.PLAYER_LIVES;
        this.enemiesRemaining = CONSTANTS.TOTAL_ENEMIES;
        this.enemiesSpawned = 0;
        this.paused = false;
        this.gameWon = false;
        this.gameOver = false;
        this.timeUp = false;
    }
    
    // Initialize game state for new game
    startNewGame() {
        this.currentState = CONSTANTS.GAME_STATES.PLAYING;
        this.gameStartTime = Date.now();
        this.gameTime = 0;
        this.score = 0;
        this.playerLives = CONSTANTS.PLAYER_LIVES;
        this.enemiesRemaining = CONSTANTS.TOTAL_ENEMIES;
        this.enemiesSpawned = 0;
        this.paused = false;
        this.gameWon = false;
        this.gameOver = false;
        this.timeUp = false;
    }
    
    // Update game time and check win/lose conditions
    update() {
        if (this.currentState === CONSTANTS.GAME_STATES.PLAYING && !this.paused) {
            this.gameTime = Date.now() - this.gameStartTime;
            
            // Check time limit
            if (this.gameTime >= CONSTANTS.GAME_TIME_LIMIT) {
                this.timeUp = true;
                this.checkGameEnd();
            }
            
            // Check if all enemies defeated
            if (this.enemiesRemaining <= 0) {
                this.gameWon = true;
                this.checkGameEnd();
            }
        }
    }
    
    // Check and handle game end conditions
    checkGameEnd() {
        // Lose conditions
        if (this.playerLives <= 0) {
            this.gameOver = true;
            this.currentState = CONSTANTS.GAME_STATES.GAME_OVER;
            return;
        }
        
        // Win conditions
        if (this.enemiesRemaining <= 0 || 
            (this.timeUp && this.playerLives > 0)) {
            this.gameWon = true;
            this.currentState = CONSTANTS.GAME_STATES.VICTORY;
            return;
        }
    }
    
    // Player loses a life
    loseLife() {
        this.playerLives--;
        this.checkGameEnd();
    }
    
    // Enemy defeated
    enemyDefeated(enemyType) {
        this.enemiesRemaining--;
        
        // Add score based on enemy type
        if (enemyType === CONSTANTS.TANK_TYPES.BASIC_ENEMY) {
            this.score += CONSTANTS.SCORE_BASIC_TANK;
        } else if (enemyType === CONSTANTS.TANK_TYPES.ARMORED_ENEMY) {
            this.score += CONSTANTS.SCORE_ARMORED_TANK;
        }
        
        this.checkGameEnd();
    }
    
    // Powerup collected
    powerupCollected() {
        this.score += CONSTANTS.SCORE_POWERUP;
    }
    
    // Get remaining time in seconds
    getRemainingTime() {
        const remaining = Math.max(0, CONSTANTS.GAME_TIME_LIMIT - this.gameTime);
        return Math.ceil(remaining / 1000);
    }
    
    // Get time string for display
    getTimeString() {
        const seconds = this.getRemainingTime();
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Toggle pause
    togglePause() {
        if (this.currentState === CONSTANTS.GAME_STATES.PLAYING) {
            this.paused = !this.paused;
        }
    }
}