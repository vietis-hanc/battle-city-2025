// HUD (Heads-Up Display) management
class HUD {
    constructor(gameState) {
        this.gameState = gameState;
        this.game = null; // Will be set by the game instance
        this.setupElements();
    }
    
    // Set game reference for restart functionality
    setGame(game) {
        this.game = game;
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
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = 'game-overlay retro-game-over';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'retro-overlay-content';
        
        // Game Over image
        const gameOverImg = document.createElement('img');
        gameOverImg.src = 'images/game_over.png';
        gameOverImg.className = 'retro-game-over-image';
        gameOverImg.alt = 'Game Over';
        
        // Score display
        const scoreElement = document.createElement('div');
        scoreElement.className = 'retro-score-display';
        scoreElement.textContent = `SCORE: ${this.gameState.score}`;
        
        // Restart prompt
        const restartElement = document.createElement('div');
        restartElement.className = 'retro-restart-prompt';
        restartElement.textContent = 'PUSH START BUTTON';
        
        // Desktop restart button
        const desktopRestartBtn = document.createElement('button');
        desktopRestartBtn.className = 'desktop-start-button';
        desktopRestartBtn.textContent = 'RESTART';
        desktopRestartBtn.onclick = () => {
            // Direct restart game call
            if (this.game) {
                this.game.startNewGame();
            }
        };

        // Mobile restart button
        const mobileRestartBtn = document.createElement('button');
        mobileRestartBtn.className = 'mobile-start-button';
        mobileRestartBtn.textContent = 'RESTART';
        mobileRestartBtn.onclick = () => {
            // Direct restart game call
            if (this.game) {
                this.game.startNewGame();
            }
        };
        
        overlayContent.appendChild(gameOverImg);
        overlayContent.appendChild(scoreElement);
        overlayContent.appendChild(restartElement);
        overlayContent.appendChild(desktopRestartBtn);
        overlayContent.appendChild(mobileRestartBtn);
        
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);
    }
    
    // Show victory screen
    showVictory() {
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = 'game-overlay retro-victory';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'retro-overlay-content';
        
        // Victory logo
        const logo = document.createElement('img');
        logo.src = 'images/battle_city.png';
        logo.className = 'retro-victory-logo';
        logo.alt = 'Battle City';
        
        // Victory text
        const victoryText = document.createElement('div');
        victoryText.className = 'retro-victory-text';
        const victoryReason = this.gameState.enemiesRemaining <= 0 ? 
            'MISSION ACCOMPLISHED!' : 
            'BASE DEFENDED!';
        victoryText.textContent = victoryReason;
        
        // Score display
        const scoreElement = document.createElement('div');
        scoreElement.className = 'retro-score-display';
        scoreElement.textContent = `FINAL SCORE: ${this.gameState.score}`;
        
        // Restart prompt
        const restartElement = document.createElement('div');
        restartElement.className = 'retro-restart-prompt';
        restartElement.textContent = 'PUSH START BUTTON';
        
        // Desktop restart button
        const desktopRestartBtn = document.createElement('button');
        desktopRestartBtn.className = 'desktop-start-button';
        desktopRestartBtn.textContent = 'NEXT GAME';
        desktopRestartBtn.onclick = () => {
            // Direct restart game call
            if (this.game) {
                this.game.startNewGame();
            }
        };

        // Mobile restart button  
        const mobileRestartBtn = document.createElement('button');
        mobileRestartBtn.className = 'mobile-start-button';
        mobileRestartBtn.textContent = 'NEXT GAME';
        mobileRestartBtn.onclick = () => {
            // Direct restart game call
            if (this.game) {
                this.game.startNewGame();
            }
        };
        
        overlayContent.appendChild(logo);
        overlayContent.appendChild(victoryText);
        overlayContent.appendChild(scoreElement);
        overlayContent.appendChild(restartElement);
        overlayContent.appendChild(desktopRestartBtn);
        overlayContent.appendChild(mobileRestartBtn);
        
        overlay.appendChild(overlayContent);
        document.body.appendChild(overlay);
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
            img.src = 'images/battle_city.png';
            img.className = 'victory-logo';
            img.alt = 'Battle City';
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
        // Detect if mobile device
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            this.showMobilePause();
        } else {
            this.showDesktopPause();
        }
    }
    
    // Show desktop-specific pause screen with Resume button
    showDesktopPause() {
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = 'game-overlay pause retro-start-screen';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'retro-overlay-content';
        
        const titleElement = document.createElement('div');
        titleElement.className = 'retro-game-title';
        titleElement.textContent = 'PAUSED';
        
        const messageElement = document.createElement('div');
        messageElement.className = 'retro-player-text';
        messageElement.textContent = 'Game is paused';
        
        // Add Resume button for desktop
        const resumeButton = document.createElement('button');
        resumeButton.className = 'desktop-start-button';
        resumeButton.textContent = 'RESUME';
        resumeButton.style.marginTop = '20px';
        resumeButton.onclick = () => {
            // Trigger resume by simulating escape key
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' });
            document.dispatchEvent(escEvent);
        };
        
        const instructionElement = document.createElement('div');
        instructionElement.className = 'retro-start-prompt';
        instructionElement.textContent = 'Press ESC to resume';
        
        overlayContent.appendChild(titleElement);
        overlayContent.appendChild(messageElement);
        overlayContent.appendChild(resumeButton);
        overlayContent.appendChild(instructionElement);
        overlay.appendChild(overlayContent);
        
        document.body.appendChild(overlay);
    }
    
    // Show mobile-specific pause screen with Resume button
    showMobilePause() {
        this.hideOverlay();
        
        const overlay = document.createElement('div');
        overlay.id = 'gameOverlay';
        overlay.className = 'game-overlay pause';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'overlay-content';
        
        const titleElement = document.createElement('h2');
        titleElement.textContent = 'Paused';
        
        const messageElement = document.createElement('p');
        messageElement.textContent = 'Game is paused';
        
        // Add Resume button for mobile
        const resumeButton = document.createElement('button');
        resumeButton.className = 'mobile-start-button';
        resumeButton.textContent = 'RESUME';
        resumeButton.style.marginTop = '20px';
        resumeButton.onclick = () => {
            // Trigger resume by simulating escape key
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape' });
            document.dispatchEvent(escEvent);
        };
        
        overlayContent.appendChild(titleElement);
        overlayContent.appendChild(messageElement);
        overlayContent.appendChild(resumeButton);
        overlay.appendChild(overlayContent);
        
        document.body.appendChild(overlay);
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
        overlay.className = 'game-overlay retro-start-screen';
        
        const overlayContent = document.createElement('div');
        overlayContent.className = 'retro-overlay-content';
        
        // Battle City logo
        const logo = document.createElement('img');
        logo.src = 'images/battle_city.png';
        logo.className = 'retro-title-logo';
        logo.alt = 'Battle City';
        
        // Retro text content
        const gameTitle = document.createElement('div');
        gameTitle.className = 'retro-game-title';
        gameTitle.textContent = 'TANK BATTLE 1990';
        
        // Challenge subtitle
        const challengeSubtitle = document.createElement('div');
        challengeSubtitle.className = 'retro-challenge-subtitle';
        challengeSubtitle.textContent = 'VietIS AI Challenge 2025';
        
        const romanOne = document.createElement('div');
        romanOne.className = 'retro-level-indicator';
        const romanImg = document.createElement('img');
        romanImg.src = 'images/roman_one.png';
        romanImg.className = 'roman-numeral';
        romanImg.alt = 'I';
        romanOne.appendChild(romanImg);
        
        const playerText = document.createElement('div');
        playerText.className = 'retro-player-text';
        playerText.textContent = '1 PLAYER';
        
        // Copyright notice
        const copyright = document.createElement('div');
        copyright.className = 'retro-copyright';
        const copyrightImg = document.createElement('img');
        copyrightImg.src = 'images/copyright.png';
        copyrightImg.className = 'copyright-image';
        copyrightImg.alt = '©';
        const copyrightText = document.createElement('span');
        copyrightText.textContent = ' 1985 NAMCO LTD.';
        copyright.appendChild(copyrightImg);
        copyright.appendChild(copyrightText);
        
        // Start prompt
        const startPrompt = document.createElement('div');
        startPrompt.className = 'retro-start-prompt';
        startPrompt.textContent = 'PUSH START BUTTON';
        
        // Desktop start button
        const desktopStartBtn = document.createElement('button');
        desktopStartBtn.className = 'desktop-start-button';
        desktopStartBtn.textContent = 'START';
        desktopStartBtn.onclick = () => {
            // Direct start game call
            if (this.game) {
                this.game.startNewGame();
            }
        };

        // Mobile start button
        const mobileStartBtn = document.createElement('button');
        mobileStartBtn.className = 'mobile-start-button';
        mobileStartBtn.textContent = 'START';
        mobileStartBtn.onclick = () => {
            // Direct start game call
            if (this.game) {
                this.game.startNewGame();
            }
        };
        
        overlayContent.appendChild(gameTitle);
        overlayContent.appendChild(challengeSubtitle);
        overlayContent.appendChild(romanOne);
        overlayContent.appendChild(playerText);
        overlayContent.appendChild(copyright);
        overlayContent.appendChild(startPrompt);
        overlayContent.appendChild(desktopStartBtn);
        overlayContent.appendChild(mobileStartBtn);
        
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