// Enemy tank class
class EnemyTank {
    constructor(x, y, type, grid, spriteManager, bulletManager, collisionDetector) {
        this.x = x;
        this.y = y;
        this.type = type; // 'basic' or 'armored'
        this.direction = CONSTANTS.DIRECTIONS.DOWN;
        this.health = type === CONSTANTS.TANK_TYPES.BASIC_ENEMY ? 1 : 3;
        this.power = type === CONSTANTS.TANK_TYPES.BASIC_ENEMY ? 1 : 2;
        this.speed = CONSTANTS.ENEMY_SPEED;
        this.active = true;
        this.team = 'enemy';
        this.animationFrame = 0;
        this.animationTimer = 0;
        
        // AI behavior
        this.moveTimer = 0;
        this.directionChangeInterval = Math.random() * 1000 + 1500; // 1.5-2.5 seconds
        this.shootTimer = 0;
        this.shootInterval = Math.random() * 2000 + 1000; // 1-3 seconds
        this.stuckTimer = 0;
        this.lastPosition = { x: this.x, y: this.y };
        
        // Dependencies
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.bulletManager = bulletManager;
        this.collision = collisionDetector;
        
        // Snap to grid
        const snapped = this.grid.snapToGrid(this.x, this.y);
        this.x = snapped.x;
        this.y = snapped.y;
    }
    
    // Update enemy tank AI
    update(deltaTime, playerTank, otherTanks) {
        if (!this.active) return;
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 300) { // Slower animation for enemies
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
        
        // AI behavior
        this.updateAI(deltaTime, playerTank, otherTanks);
    }
    
    // AI decision making
    updateAI(deltaTime, playerTank, otherTanks) {
        // Update timers
        this.moveTimer += deltaTime;
        this.shootTimer += deltaTime;
        this.stuckTimer += deltaTime;
        
        // Check if stuck
        if (this.stuckTimer >= 500) { // Check every 0.5 seconds
            if (this.x === this.lastPosition.x && this.y === this.lastPosition.y) {
                this.changeDirection();
            }
            this.lastPosition = { x: this.x, y: this.y };
            this.stuckTimer = 0;
        }
        
        // Movement AI
        this.handleMovement(otherTanks);
        
        // Shooting AI
        this.handleShooting(playerTank);
        
        // Random direction change
        if (this.moveTimer >= this.directionChangeInterval) {
            if (Math.random() < 0.3) { // 30% chance to change direction
                this.changeDirection();
            }
            this.moveTimer = 0;
            this.directionChangeInterval = Math.random() * 1000 + 1500;
        }
    }
    
    // Handle movement
    handleMovement(otherTanks) {
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
                // Restore position and change direction
                this.x = tempX;
                this.y = tempY;
                this.changeDirection();
            } else {
                // Snap to grid for clean movement
                const snapped = this.grid.snapToGrid(this.x, this.y);
                this.x = snapped.x;
                this.y = snapped.y;
            }
        } else {
            // Can't move, change direction
            this.changeDirection();
        }
    }
    
    // Handle shooting
    handleShooting(playerTank) {
        if (this.shootTimer >= this.shootInterval) {
            let shootChance = 0.1; // Base 10% chance
            
            // Increase chance if player is in line of sight
            if (this.canSeePlayer(playerTank)) {
                shootChance = 0.8; // 80% chance if player is visible
            }
            
            if (Math.random() < shootChance) {
                this.shoot();
            }
            
            this.shootTimer = 0;
            this.shootInterval = Math.random() * 2000 + 1000;
        }
    }
    
    // Check if player is in line of sight
    canSeePlayer(playerTank) {
        if (!playerTank.active) return false;
        
        const myGridPos = this.grid.pixelToGrid(this.x, this.y);
        const playerGridPos = this.grid.pixelToGrid(playerTank.x, playerTank.y);
        
        // Check if on same row or column
        const sameRow = myGridPos.y === playerGridPos.y;
        const sameCol = myGridPos.x === playerGridPos.x;
        
        if (!sameRow && !sameCol) return false;
        
        // Check if tank is facing the right direction
        if (sameRow) {
            if (playerGridPos.x > myGridPos.x && this.direction !== CONSTANTS.DIRECTIONS.RIGHT) return false;
            if (playerGridPos.x < myGridPos.x && this.direction !== CONSTANTS.DIRECTIONS.LEFT) return false;
        }
        
        if (sameCol) {
            if (playerGridPos.y > myGridPos.y && this.direction !== CONSTANTS.DIRECTIONS.DOWN) return false;
            if (playerGridPos.y < myGridPos.y && this.direction !== CONSTANTS.DIRECTIONS.UP) return false;
        }
        
        return true;
    }
    
    // Change direction intelligently
    changeDirection() {
        const possibleDirections = [];
        
        // Try perpendicular directions first
        for (let i = 0; i < 4; i++) {
            if (i === this.direction) continue; // Don't go backwards immediately
            
            const dir = DIRECTION_VECTORS[i];
            const testX = this.x + dir.x * this.speed * 3; // Look ahead
            const testY = this.y + dir.y * this.speed * 3;
            
            if (this.collision.canTankMoveTo(this.x, this.y, testX, testY)) {
                possibleDirections.push(i);
            }
        }
        
        if (possibleDirections.length > 0) {
            this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
        } else {
            this.direction = Math.floor(Math.random() * 4);
        }
    }
    
    // Shoot a bullet
    shoot() {
        const dir = DIRECTION_VECTORS[this.direction];
        const bulletX = this.x + dir.x * CONSTANTS.TILE_SIZE;
        const bulletY = this.y + dir.y * CONSTANTS.TILE_SIZE;
        
        this.bulletManager.createBullet(bulletX, bulletY, this.direction, this.power, this.team);
    }
    
    // Take damage
    takeDamage(damage) {
        if (!this.active) return false;
        
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            return true; // Tank destroyed
        }
        return false;
    }
    
    // Render enemy tank
    render(ctx) {
        if (!this.active) return;
        
        const directionNames = ['up', 'right', 'down', 'left'];
        const dirName = directionNames[this.direction];
        const frame = this.animationFrame + 1;
        const typePrefix = this.type === CONSTANTS.TANK_TYPES.BASIC_ENEMY ? 'basic' : 'armor';
        
        const spriteName = `${typePrefix}_${dirName}_t${frame}`;
        this.spriteManager.drawSprite(ctx, spriteName, this.x, this.y);
    }