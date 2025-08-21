// Quick test utility for Tank Battle 1990
// Add debugging and cheat functions for testing

class GameTester {
    constructor(game) {
        this.game = game;
        this.setupKeyboardShortcuts();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Only work in playing state
            if (this.game.gameState.currentState !== CONSTANTS.GAME_STATES.PLAYING) return;

            switch(event.key) {
                case 'k': // Kill all enemies quickly (for testing win condition)
                    this.killAllEnemies();
                    event.preventDefault();
                    break;
                case 'l': // Lose life (for testing respawn)
                    this.game.handlePlayerDestroyed();
                    event.preventDefault();
                    break;
                case 't': // Add time (for testing time limit)
                    this.addTime();
                    event.preventDefault();
                    break;
                case 'p': // Add powerup
                    this.addPowerup();
                    event.preventDefault();
                    break;
            }
        });
    }

    killAllEnemies() {
        // Kill all active enemies
        if (this.game.enemyManager) {
            this.game.enemyManager.enemies.forEach(enemy => {
                if (enemy.active) {
                    enemy.active = false;
                    // Don't call gameState.enemyDefeated here to avoid double counting
                }
            });
            
            // Clear spawn queue completely
            this.game.enemyManager.spawnQueue = [];
            
            console.log('🎯 All enemies defeated! Testing win condition...');
            console.log(`📊 Remaining enemies: ${this.game.enemyManager.getTotalRemainingEnemies()}`);
        }
    }

    addTime() {
        this.game.gameState.gameStartTime += 30000; // Add 30 seconds
        console.log('⏰ Added 30 seconds to game time');
    }

    addPowerup() {
        if (this.game.playerTank) {
            this.game.playerTank.powerLevel = Math.min(3, this.game.playerTank.powerLevel + 1);
            console.log(`⭐ Player power level: ${this.game.playerTank.powerLevel}`);
        }
    }

    logGameState() {
        console.log('🎮 Game State Debug:');
        console.log(`  State: ${this.game.gameState.currentState}`);
        console.log(`  Enemies Remaining: ${this.game.gameState.enemiesRemaining}`);
        console.log(`  Player Lives: ${this.game.gameState.playerLives}`);
        console.log(`  Score: ${this.game.gameState.score}`);
        console.log(`  Time Remaining: ${this.game.gameState.getRemainingTime()}s`);
        
        if (this.game.enemyManager) {
            console.log(`  Active Enemies: ${this.game.enemyManager.enemies.filter(e => e.active).length}`);
            console.log(`  Spawn Queue: ${this.game.enemyManager.spawnQueue.length}`);
        }
    }
}

// Auto-setup when game loads
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.game) {
            window.gameTester = new GameTester(window.game);
            console.log('🧪 Game Tester loaded!');
            console.log('📋 Test shortcuts:');
            console.log('  K - Kill all enemies (test win condition)');
            console.log('  L - Lose life (test respawn)');
            console.log('  T - Add 30 seconds');
            console.log('  P - Add power level');
            
            // Auto-log game state every 10 seconds
            setInterval(() => {
                if (window.game.gameState.currentState === CONSTANTS.GAME_STATES.PLAYING) {
                    window.gameTester.logGameState();
                }
            }, 10000);
        }
    }, 3000);
});