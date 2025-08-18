// Player tank for tank battle game
class PlayerTank {
    constructor(x, y, grid, spriteManager, bulletManager, collisionDetector) {
        this.x = x;
        this.y = y;
        this.direction = CONSTANTS.DIRECTIONS.UP;
        this.health = CONSTANTS.PLAYER_HEALTH;
        this.powerLevel = 1;
        this.speed = CONSTANTS.PLAYER_SPEED;
        this.active = true;
        this.team = 'player';
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // Dependencies
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.bulletManager = bulletManager;
        this.collision = collisionDetector;
        
        // Shooting
        this.canShoot = true;
        this.lastShotTime = 0;
        this.shootCooldown = 250; // ms between shots
        
        // Snap to grid
        const snapped = this.grid.snapToGrid(this.x, this.y);
        this.x = snapped.x;
        this.y = snapped.y;
    }
    
    // Update player tank
    update(input, deltaTime, otherTanks) {
        if (!this.active) return;
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTime -= deltaTime;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 200) { // 200ms per frame
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
        
        // Handle movement
        this.handleMovement(input, otherTanks);
        
        // Handle shooting
        this.handleShooting(input);
        
        // Update shooting cooldown
        this.updateShootCooldown();
    }
    
    // Handle movement input
    handleMovement(input, otherTanks) {
        const newDirection = input.getMovementDirection();
        
        if (newDirection !== -1) {
            this.direction = newDirection;
            
            // Calculate new position
            const dir = DIRECTION_VECTORS[this.direction];
            const newX = this.x + dir.x * this.speed;
            const newY = this.y + dir.y * this.speed;
            
            // Check if movement is valid
            if (this.collision.canTankMoveTo(this.x, this.y, newX, newY)) {
                // Check tank-to-tank collision
                const tempX = this.x;
                const tempY = this.y;
                this.x = newX;
                this.y = newY;
                
                const tankCollision = this.collision.checkTankCollision(this, otherTanks);
                if (tankCollision) {
                    // Restore position if collision
                    this.x = tempX;
                    this.y = tempY;
                } else {
                    // Snap to grid for clean movement
                    const snapped = this.grid.snapToGrid(this.x, this.y);
                    this.x = snapped.x;
                    this.y = snapped.y;
                }
            }
        }
    }
    
    // Handle shooting input
    handleShooting(input) {
        if (input.isFirePressed() && this.canShoot) {
            this.shoot();
        }
    }
    
    // Shoot a bullet
    shoot() {
        if (!this.canShoot) return;
        
        // Calculate bullet spawn position
        const dir = DIRECTION_VECTORS[this.direction];
        const bulletX = this.x + dir.x * CONSTANTS.TILE_SIZE;
        const bulletY = this.y + dir.y * CONSTANTS.TILE_SIZE;
        
        this.bulletManager.createBullet(
            bulletX, 
            bulletY, 
            this.direction, 
            this.powerLevel, 
            this.team
        );
        
        this.canShoot = false;
        this.lastShotTime = Date.now();
    }
    
    // Update shooting cooldown
    updateShootCooldown() {
        if (!this.canShoot) {
            if (Date.now() - this.lastShotTime >= this.shootCooldown) {
                this.canShoot = true;
            }
        }
    }
    
    // Take damage
    takeDamage(damage) {
        if (this.invulnerable || !this.active) return false;
        
        this.health -= damage;
        
        if (this.health <= 0) {
            this.active = false;
            return true; // Tank destroyed
        }
        
        // Brief invulnerability after taking damage
        this.invulnerable = true;
        this.invulnerabilityTime = 1000; // 1 second
        
        return false;
    }
    
    // Respawn tank
    respawn(x, y) {
        this.x = x;
        this.y = y;
        this.health = CONSTANTS.PLAYER_HEALTH;
        this.powerLevel = 1; // Reset power level on respawn
        this.active = true;
        this.invulnerable = true;
        this.invulnerabilityTime = 2000; // 2 seconds invulnerability on respawn
        this.direction = CONSTANTS.DIRECTIONS.UP;
        
        // Snap to grid
        const snapped = this.grid.snapToGrid(this.x, this.y);
        this.x = snapped.x;
        this.y = snapped.y;
    }
    
    // Upgrade power level
    upgradePower() {
        if (this.powerLevel < CONSTANTS.PLAYER_MAX_POWER) {
            this.powerLevel++;
        }
    }
    
    // Render player tank
    render(ctx) {
        if (!this.active) return;
        
        // Don't render if invulnerable and blinking
        if (this.invulnerable && Math.floor(this.invulnerabilityTime / 100) % 2 === 0) {
            return;
        }
        
        // Get sprite name based on direction and animation frame
        const directionNames = ['up', 'right', 'down', 'left'];
        const dirName = directionNames[this.direction];
        const frame = this.animationFrame + 1;
        
        // Add power level suffix for upgraded tanks
        let powerSuffix = '';
        if (this.powerLevel > 1) {
            powerSuffix = `_s${this.powerLevel - 1}`;
        }
        
        const spriteName = `player_${dirName}_t${frame}${powerSuffix}`;
        
        this.spriteManager.drawSprite(ctx, spriteName, this.x, this.y);
    }
    
    // Get tank position info
    getPosition() {
        return {
            x: this.x,
            y: this.y,
            gridX: Math.floor(this.x / CONSTANTS.TILE_SIZE),
            gridY: Math.floor(this.y / CONSTANTS.TILE_SIZE)
        };
    }
}