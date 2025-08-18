// HUD (Heads-Up Display) management
class HUD {
    constructor(gameState) {
        this.gameState = gameState;
        this.setupElements();
    }
    
    // Setup DOM elements
    setupElements() {
        this.livesElement = document.getElementById('livesCount');
        this.enemiesElement = document.getElementById('enemiesCount');
        this.scoreElement = document.getElementById('scoreCount');
        this.timerElement = document.getElementById('timeCount');
        
        if (!this.livesElement || !this.enemiesElement || !this.scoreElement || !this.timerElement) {
            console.error('HUD elements not found in DOM');
        }
    }
    
    // Update HUD display
    update(playerTank, enemyManager) {
        if (!this.livesElement || !this.enemiesElement || !this.scoreElement || !this.timerElement) {
            return;
        }
        
        // Update lives count
        this.livesElement.textContent = this.gameState.playerLives;
        
        // Update enemies remaining count
        const enemiesRemaining = enemyManager ? enemyManager.getRemainingCount() : this.gameState.enemiesRemaining;
        this.enemiesElement.textContent = enemiesRemaining;
        
        // Update score
        this.scoreElement.textContent = this.gameState.score;
        
        // Update timer
        this.timerElement.textContent = this.gameState.getTimeString();
        
        // Update HUD styling based on game state
        this.updateHUDStyling();
    }
    
    // Update HUD styling based on game state
    updateHUDStyling() {
        const hudElement = document.getElementById('hud');
        if (!hudElement) return;
        
        // Change HUD color based on game state
        switch (this.gameState.currentState) {
            case CONSTANTS.GAME_STATES.PLAYING:
                hudElement.className = 'hud-playing';
                break;
            case CONSTANTS.GAME_STATES.PAUSED:
                hudElement.className = 'hud-paused';
                break;
            case CONSTANTS.GAME_STATES.GAME_OVER:
                hudElement.className = 'hud-game-over';
                break;
            case CONSTANTS.GAME_STATES.VICTORY:
                hudElement.className = 'hud-victory';
                break;
            default:
                hudElement.className = '';
        }
        
        // Flash timer when time is running low
        const remainingTime = this.gameState.getRemainingTime();
        if (remainingTime <= 30 && remainingTime > 0) { // Last 30 seconds
            this.timerElement.classList.add('warning');
        } else {
            this.timerElement.classList.remove('warning');
        }
        
        // Flash lives when low
        if (this.gameState.playerLives <= 1) {
            this.livesElement.classList.add('critical');
        } else {
            this.livesElement.classList.remove('critical');
        }
    }
    
    // Show game over screen
    showGameOver() {
        this.showOverlay('Game Over', `Final Score: ${this.gameState.score}`, 'game-over');
    }
    
    // Show victory screen
    showVictory() {
        const message = this.gameState.enemiesRemaining <= 0 ? 
            'All Enemies Defeated!' : 
            'Time\'s Up - Base Protected!';
        this.showOverlay('Victory!', `${message}\nFinal Score: ${this.gameState.score}`, 'victory');
    }
    
    // Show pause screen
    showPause() {
        this.showOverlay('Paused', 'Press ESC to resume', 'pause');
    }
    
    // Show overlay message
    showOverlay(title, message, className) {
        // Remove existing overlay
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = `game-overlay ${className}`;
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'overlay-content';
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        
        overlayContent.appendChild(titleElement);
        overlayContent.appendChild(messageElement);
        overlay.appendChild(overlayContent);
        
        document.body.appendChild(overlay);
    }
    
    // Hide overlay
    hideOverlay() {
        const existingOverlay = document.getElementById('gameOverlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }
    }
    
    // Show start screen
    showStartScreen() {
        this.showOverlay(
            'Tank Battle 1990',
            'Arrow Keys: Move\nSpace: Shoot\nEnter: Start Game\n\nProtect the Eagle!\nDefeat 20 enemy tanks!',
            'start-screen'
        );
    }
    
    // Reset HUD for new game
    reset() {
        this.hideOverlay();
        
        // Reset element classes
        if (this.timerElement) this.timerElement.classList.remove('warning');
        if (this.livesElement) this.livesElement.classList.remove('critical');
        
        const hudElement = document.getElementById('hud');
        if (hudElement) hudElement.className = '';
    }
}