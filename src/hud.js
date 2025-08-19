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
        this.showEnhancedOverlay('game-over', 'Game Over', this.gameState.score);
    }
    
    // Show victory screen
    showVictory() {
        const victoryReason = this.gameState.enemiesRemaining <= 0 ? 
            'All Enemies Defeated!' : 
            'Time\'s Up - Base Protected!';
        this.showEnhancedOverlay('victory', victoryReason, this.gameState.score);
    }
    
    // Show enhanced overlay with images
    showEnhancedOverlay(type, title, score) {
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = `game-overlay ${type}`;
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'overlay-content';
        
        // Add appropriate image
        if (type === 'game-over') {
            const img = document.createElement('img');
            img.src = 'images/game_over.png';
            img.className = 'game-over-image';
            img.alt = 'Game Over';
            overlayContent.appendChild(img);
        } else if (type === 'victory') {
            const img = document.createElement('img');
            img.src = 'images/flag.png';
            img.className = 'victory-flag';
            img.alt = 'Victory';
            overlayContent.appendChild(img);
        }
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        
        const scoreElement = document.createElement('div');
        scoreElement.className = 'score-display';
        scoreElement.textContent = `Final Score: ${score}`;
        
        const restartElement = document.createElement('div');
        restartElement.className = 'restart-prompt';
        restartElement.textContent = 'Press Enter to Play Again';
        
        overlayContent.appendChild(titleElement);
        overlayContent.appendChild(scoreElement);
        overlayContent.appendChild(restartElement);
        
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);
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
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = 'game-overlay start-screen';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'overlay-content';
        
        // Add Battle City logo
        const logo = document.createElement('img');
        logo.src = 'images/battle_city.png';
        logo.className = 'title-logo';
        logo.alt = 'Battle City';
        
        const instructions = document.createElement('div');
        instructions.className = 'instructions';
        instructions.innerHTML = `
            Arrow Keys: Move Tank<br>
            Space: Shoot<br>
            ESC: Pause Game<br><br>
            Protect the Eagle!<br>
            Defeat 20 enemy tanks!<br>
            You have 3 minutes!
        `;
        
        const enterPrompt = document.createElement('div');
        enterPrompt.className = 'press-enter';
        enterPrompt.textContent = 'Press Enter to Start';
        
        overlayContent.appendChild(logo);
        overlayContent.appendChild(instructions);
        overlayContent.appendChild(enterPrompt);
        
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);
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