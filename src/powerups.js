// Power-up system for tank battle
class PowerUp {
    constructor(x, y, type, grid, spriteManager) {
        this.x = x;
        this.y = y;
        this.type = type; // 'star' or 'shovel'
        this.active = true;
        this.animationTimer = 0;
        this.blinkTimer = 0;
        this.visible = true;
        this.lifetime = 15000; // 15 seconds
        this.remainingTime = this.lifetime;
        
        this.grid = grid;
        this.spriteManager = spriteManager;
        
        // Snap to grid
        const snapped = this.grid.snapToGrid(this.x, this.y);
        this.x = snapped.x;
        this.y = snapped.y;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        // Update lifetime
        this.remainingTime -= deltaTime;
        
        // Start blinking when time is running out
        if (this.remainingTime <= 5000) { // Last 5 seconds
            this.blinkTimer += deltaTime;
            if (this.blinkTimer >= 250) { // Blink every 250ms
                this.visible = !this.visible;
                this.blinkTimer = 0;
            }
        }
        
        // Remove power-up when time runs out
        if (this.remainingTime <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active || !this.visible) return;
        
        this.spriteManager.drawSprite(ctx, this.type, this.x, this.y);
    }
    
    // Check collision with tank using bounding box with tolerance
    checkCollision(tank) {
        if (!this.active || !tank.active) return false;
        
        // Use bounding box collision with tolerance instead of exact position matching
        const tolerance = CONSTANTS.TILE_SIZE * 0.7; // Allow 70% overlap
        const dx = Math.abs(tank.x - this.x);
        const dy = Math.abs(tank.y - this.y);
        
        return dx < tolerance && dy < tolerance;
    }
    
    // Apply power-up effect
    applyEffect(tank, gameState, terrain) {
        if (this.type === 'star') {
            tank.upgradePower();
        } else if (this.type === 'shovel') {
            this.applyShovelEffect(terrain);
        }
        
        gameState.powerupCollected();
        this.active = false;
    }
    
    // Apply shovel effect (strengthen eagle walls)
    applyShovelEffect(terrain) {
        // Change eagle protective walls to steel for 20 seconds
        terrain.strengthenEagleWalls();
    }
}

class PowerUpManager {
    constructor(grid, spriteManager, terrain) {
        this.powerUps = [];
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.terrain = terrain;
        
        // Spawn counters
        this.starCount = 0;
        this.shovelCount = 0;
        this.maxStars = CONSTANTS.STAR_COUNT;
        this.maxShovels = CONSTANTS.SHOVEL_COUNT;
        
        // Spawn timers
        this.spawnTimer = 0;
        this.spawnInterval = Math.random() * 10000 + 15000; // 15-25 seconds
    }
    
    update(deltaTime, playerTank, gameState) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new power-ups
        if (this.spawnTimer >= this.spawnInterval && this.canSpawn()) {
            this.spawnPowerUp();
            this.spawnTimer = 0;
            this.spawnInterval = Math.random() * 10000 + 15000;
        }
        
        // Update existing power-ups
        for (const powerUp of this.powerUps) {
            powerUp.update(deltaTime);
            
            // Check collision with player
            if (powerUp.checkCollision(playerTank)) {
                powerUp.applyEffect(playerTank, gameState, this.terrain);
            }
        }
        
        // Remove inactive power-ups
        this.powerUps = this.powerUps.filter(powerUp => powerUp.active);
    }
    
    // Check if can spawn more power-ups
    canSpawn() {
        return (this.starCount < this.maxStars) || (this.shovelCount < this.maxShovels);
    }
    
    // Spawn a new power-up
    spawnPowerUp() {
        const availableTypes = [];
        
        if (this.starCount < this.maxStars) {
            availableTypes.push('star');
        }
        
        if (this.shovelCount < this.maxShovels) {
            availableTypes.push('shovel');
        }
        
        if (availableTypes.length === 0) return;
        
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const position = this.findEmptySpawnPosition();
        
        if (position) {
            const powerUp = new PowerUp(position.x, position.y, type, this.grid, this.spriteManager);
            this.powerUps.push(powerUp);
            
            if (type === 'star') {
                this.starCount++;
            } else if (type === 'shovel') {
                this.shovelCount++;
            }
        }
    }
    
    // Find an empty position to spawn power-up
    findEmptySpawnPosition() {
        const attempts = 50; // Try 50 random positions
        
        for (let i = 0; i < attempts; i++) {
            const gridX = Math.floor(Math.random() * this.grid.width);
            const gridY = Math.floor(Math.random() * this.grid.height);
            
            // Check if position is empty
            if (this.terrain.getTerrain(gridX, gridY) === CONSTANTS.TERRAIN.EMPTY) {
                const pixelPos = this.grid.gridToPixel(gridX, gridY);
                
                // Make sure no power-up already exists at this position
                const occupied = this.powerUps.some(powerUp => 
                    powerUp.active && powerUp.x === pixelPos.x && powerUp.y === pixelPos.y
                );
                
                if (!occupied) {
                    return pixelPos;
                }
            }
        }
        
        return null; // Couldn't find empty position
    }
    
    // Render all power-ups
    render(ctx) {
        for (const powerUp of this.powerUps) {
            powerUp.render(ctx);
        }
    }
    
    // Clear all power-ups
    clear() {
        this.powerUps = [];
        this.starCount = 0;
        this.shovelCount = 0;
    }
}