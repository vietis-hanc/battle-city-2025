// Main game loop and coordination
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Core systems
        this.grid = new Grid();
        this.spriteManager = new SpriteManager();
        this.input = new InputManager();
        this.gameState = new GameState();
        this.hud = new HUD(this.gameState);
        this.audioManager = new AudioManager();
        
        // Initialize mobile controls
        this.mobileControls = new MobileControls(this.input);
        
        // Game objects
        this.terrain = null;
        this.collision = null;
        this.bulletManager = null;
        this.explosionManager = null;
        this.playerTank = null;
        this.enemyManager = null;
        this.powerUpManager = null;
        
        // Game loop
        this.lastFrameTime = 0;
        this.running = false;
        this.initialized = false;
        
        this.init();
    }
    
    // Initialize game
    async init() {
        try {
            // Load sprites
            await this.spriteManager.loadAllSprites();
            
            // Initialize game systems
            this.terrain = new TerrainManager(this.grid, this.spriteManager);
            this.collision = new CollisionDetector(this.terrain, this.grid);
            this.explosionManager = new ExplosionManager(this.spriteManager);
            
            // Create bullet manager with callbacks
            const bulletCallbacks = {
                onEnemyDefeated: (enemyType) => this.gameState.enemyDefeated(enemyType),
                onPlayerDestroyed: () => this.handlePlayerDestroyed(),
                onEagleDestroyed: () => this.gameState.currentState = CONSTANTS.GAME_STATES.GAME_OVER
            };
            this.bulletManager = new BulletManager(this.grid, this.spriteManager, this.collision, this.terrain, this.audioManager, this.explosionManager, bulletCallbacks);
            
            // Initialize player tank at bottom center
            const playerStartX = 6 * CONSTANTS.TILE_SIZE;
            const playerStartY = 12 * CONSTANTS.TILE_SIZE;
            this.playerTank = new PlayerTank(
                playerStartX, playerStartY,
                this.grid, this.spriteManager, this.bulletManager, this.collision
            );
            
            // Initialize enemy manager
            this.enemyManager = new EnemyManager(
                this.grid, this.spriteManager, this.bulletManager, this.collision
            );
            
            // Initialize power-up manager
            this.powerUpManager = new PowerUpManager(this.grid, this.spriteManager, this.terrain);
            
            this.initialized = true;
            this.hud.showStartScreen();
            
            // Start game loop
            this.running = true;
            this.gameLoop();
            
        } catch (error) {
            console.error('Failed to initialize game:', error);
        }
    }
    
    // Main game loop
    gameLoop() {
        if (!this.running) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    // Update game logic
    update(deltaTime) {
        if (!this.initialized) return;
        
        // Handle input for menu/pause states
        if (this.gameState.currentState === CONSTANTS.GAME_STATES.MENU) {
            if (this.input.isEnterPressed()) {
                this.startNewGame();
            }
        } else if (this.gameState.currentState === CONSTANTS.GAME_STATES.GAME_OVER ||
                   this.gameState.currentState === CONSTANTS.GAME_STATES.VICTORY) {
            if (this.input.isEnterPressed()) {
                this.startNewGame();
            }
        } else if (this.gameState.currentState === CONSTANTS.GAME_STATES.PLAYING) {
            
            // Handle pause
            if (this.input.isEscapePressed()) {
                this.gameState.togglePause();
                if (this.gameState.paused) {
                    this.hud.showPause();
                } else {
                    this.hud.hideOverlay();
                }
            }
            
            if (!this.gameState.paused) {
                // Update game systems
                this.gameState.update();
                this.terrain.update(deltaTime);
                
                // Update player tank
                const allTanks = [this.playerTank].concat(this.enemyManager.getActiveEnemies());
                this.playerTank.update(this.input, deltaTime, allTanks);
                
                // Update enemies
                this.enemyManager.update(deltaTime, this.playerTank);
                
                // Check if all enemies defeated
                if (this.enemyManager.getTotalRemainingEnemies() <= 0) {
                    this.gameState.gameWon = true;
                    this.gameState.currentState = CONSTANTS.GAME_STATES.VICTORY;
                }
                
                // Update bullets and handle collisions
                this.updateBullets(deltaTime);
                
                // Update explosions
                this.explosionManager.update(deltaTime);
                
                // Update power-ups
                this.powerUpManager.update(deltaTime, this.playerTank, this.gameState);
                
                // Check game end conditions
                this.checkGameEndConditions();
            }
        }
        
        // Update HUD
        this.hud.update(this.playerTank, this.enemyManager);
        
        // Clear input states
        this.input.clearFrameStates();
    }
    
    // Update bullets and handle all collision logic
    updateBullets(deltaTime) {
        const allTanks = [this.playerTank].concat(this.enemyManager.getActiveEnemies());
        
        // Update bullets - BulletManager handles all collisions internally
        this.bulletManager.update(allTanks);
        
        // Check eagle destruction
        if (this.terrain.eagleDestroyed) {
            this.gameState.currentState = CONSTANTS.GAME_STATES.GAME_OVER;
        }
    }
    
    // Handle player tank destruction
    handlePlayerDestroyed() {
        this.gameState.loseLife();
        
        if (this.gameState.playerLives > 0) {
            // Respawn player at safe position (same as initial spawn)
            const playerStartX = 7 * CONSTANTS.TILE_SIZE;  // Center X position
            const playerStartY = 10 * CONSTANTS.TILE_SIZE; // Above the eagle base walls
            this.playerTank.respawn(playerStartX, playerStartY);
        }
    }
    
    // Check game end conditions
    checkGameEndConditions() {
        if (this.gameState.currentState === CONSTANTS.GAME_STATES.GAME_OVER) {
            this.audioManager.play('gameOver');
            this.hud.showGameOver();
        } else if (this.gameState.currentState === CONSTANTS.GAME_STATES.VICTORY) {
            this.audioManager.play('statistics');
            this.hud.showVictory();
        }
    }
    
    // Start a new game
    startNewGame() {
        this.gameState.startNewGame();
        this.hud.reset();
        
        // Play start sound
        this.audioManager.play('stageStart');
        
        // Reset all game objects
        this.terrain.initializeTerrain(); // Reset existing terrain instead of creating new instance
        this.collision = new CollisionDetector(this.terrain, this.grid);
        this.bulletManager.updateCollisionDetector(this.collision); // Update bullet manager's collision detector
        this.explosionManager.clear();
        this.bulletManager.clear();
        
        // Reset player - spawn at bottom center in a safe position
        const playerStartX = 7 * CONSTANTS.TILE_SIZE;  // Center X position
        const playerStartY = 10 * CONSTANTS.TILE_SIZE; // Above the eagle base walls
        this.playerTank.respawn(playerStartX, playerStartY);
        
        // Reset enemies
        this.enemyManager = new EnemyManager(
            this.grid, this.spriteManager, this.bulletManager, this.collision
        );
        
        // Reset power-ups
        this.powerUpManager.clear();
    }
    
    // Render game
    render() {
        if (!this.initialized) return;
        
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.gameState.currentState === CONSTANTS.GAME_STATES.PLAYING) {
            // Render game objects in correct z-order
            this.terrain.renderBackground(this.ctx); // Render everything except trees
            this.powerUpManager.render(this.ctx);
            this.playerTank.render(this.ctx);
            this.enemyManager.render(this.ctx);
            this.bulletManager.render(this.ctx);
            this.explosionManager.render(this.ctx); // Render explosions on top of bullets
            this.terrain.renderForeground(this.ctx); // Render trees on top
        }
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    window.game = new Game();
});