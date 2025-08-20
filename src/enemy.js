// Enemy tank and AI system - complete implementation
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
        this.directionChangeInterval = Math.random() * 1000 + 1500;
        this.shootTimer = 0;
        this.shootInterval = Math.random() * 800 + 600; // Increased firing rate
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
    
    update(deltaTime, playerTank, otherTanks) {
        if (!this.active) return;
        
        this.animationTimer += deltaTime;
        if (this.animationTimer >= 300) {
            this.animationFrame = (this.animationFrame + 1) % 2;
            this.animationTimer = 0;
        }
        
        this.updateAI(deltaTime, playerTank, otherTanks);
    }
    
    updateAI(deltaTime, playerTank, otherTanks) {
        this.moveTimer += deltaTime;
        this.shootTimer += deltaTime;
        this.stuckTimer += deltaTime;
        
        if (this.stuckTimer >= 500) {
            if (this.x === this.lastPosition.x && this.y === this.lastPosition.y) {
                this.changeDirection();
            }
            this.lastPosition = { x: this.x, y: this.y };
            this.stuckTimer = 0;
        }
        
        this.handleMovement(otherTanks);
        this.handleShooting(playerTank);
        
        if (this.moveTimer >= this.directionChangeInterval) {
            if (Math.random() < 0.3) {
                this.changeDirection();
            }
            this.moveTimer = 0;
            this.directionChangeInterval = Math.random() * 1000 + 1500;
        }
    }
    
    handleMovement(otherTanks) {
        const dir = DIRECTION_VECTORS[this.direction];
        const newX = this.x + dir.x * this.speed;
        const newY = this.y + dir.y * this.speed;
        
        if (this.collision.canTankMoveTo(this.x, this.y, newX, newY)) {
            const tempX = this.x;
            const tempY = this.y;
            this.x = newX;
            this.y = newY;
            
            const tankCollision = this.collision.checkTankCollision(this, otherTanks);
            if (tankCollision) {
                this.x = tempX;
                this.y = tempY;
                this.changeDirection();
            }
            // Remove grid snapping from movement - let tanks move smoothly
        } else {
            this.changeDirection();
        }
    }
    
    handleShooting(playerTank) {
        if (this.shootTimer >= this.shootInterval) {
            let shootChance = 0.2; // Increased base chance from 0.1 to 0.2
            
            if (this.canSeePlayer(playerTank)) {
                shootChance = 0.9; // Increased from 0.8 to 0.9
            }
            
            if (Math.random() < shootChance) {
                this.shoot();
            }
            
            this.shootTimer = 0;
            this.shootInterval = Math.random() * 800 + 600; // Reduced from 2000+1000 to 800+600
        }
    }
    
    canSeePlayer(playerTank) {
        if (!playerTank.active) return false;
        
        const myGridPos = this.grid.pixelToGrid(this.x, this.y);
        const playerGridPos = this.grid.pixelToGrid(playerTank.x, playerTank.y);
        
        const sameRow = myGridPos.y === playerGridPos.y;
        const sameCol = myGridPos.x === playerGridPos.x;
        
        if (!sameRow && !sameCol) return false;
        
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
    
    changeDirection() {
        const possibleDirections = [];
        
        for (let i = 0; i < 4; i++) {
            if (i === this.direction) continue;
            
            const dir = DIRECTION_VECTORS[i];
            const testX = this.x + dir.x * this.speed * 3;
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
    
    shoot() {
        const dir = DIRECTION_VECTORS[this.direction];
        const bulletX = this.x + dir.x * CONSTANTS.TILE_SIZE;
        const bulletY = this.y + dir.y * CONSTANTS.TILE_SIZE;
        
        this.bulletManager.createBullet(bulletX, bulletY, this.direction, this.power, this.team);
    }
    
    takeDamage(damage) {
        if (!this.active) return false;
        
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            return true;
        }
        return false;
    }
    
    render(ctx) {
        if (!this.active) return;
        
        const directionNames = ['up', 'right', 'down', 'left'];
        const dirName = directionNames[this.direction];
        const frame = this.animationFrame + 1;
        const typePrefix = this.type === CONSTANTS.TANK_TYPES.BASIC_ENEMY ? 'basic' : 'armor';
        
        const spriteName = `${typePrefix}_${dirName}_t${frame}`;
        this.spriteManager.drawSprite(ctx, spriteName, this.x, this.y);
    }
}
class EnemyManager {
    constructor(grid, spriteManager, bulletManager, collisionDetector) {
        this.enemies = [];
        this.spawnQueue = [];
        this.maxEnemiesOnScreen = CONSTANTS.MAX_ENEMIES_ON_SCREEN;
        this.totalEnemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // 2 seconds between spawns
        
        // Define spawn positions
        this.spawnPositions = [
            { x: 0, y: 0 },
            { x: 6 * CONSTANTS.TILE_SIZE, y: 0 },
            { x: 12 * CONSTANTS.TILE_SIZE, y: 0 }
        ];
        
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.bulletManager = bulletManager;
        this.collision = collisionDetector;
        
        this.initializeSpawnQueue();
    }
    
    // Initialize the enemy spawn queue
    initializeSpawnQueue() {
        // Add 10 basic tanks
        for (let i = 0; i < CONSTANTS.BASIC_TANK_COUNT; i++) {
            this.spawnQueue.push(CONSTANTS.TANK_TYPES.BASIC_ENEMY);
        }
        
        // Add 10 armored tanks
        for (let i = 0; i < CONSTANTS.ARMORED_TANK_COUNT; i++) {
            this.spawnQueue.push(CONSTANTS.TANK_TYPES.ARMORED_ENEMY);
        }
        
        // Shuffle the queue
        for (let i = this.spawnQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.spawnQueue[i], this.spawnQueue[j]] = [this.spawnQueue[j], this.spawnQueue[i]];
        }
    }
    
    // Update all enemies
    update(deltaTime, playerTank) {
        // Update spawn timer
        this.spawnTimer += deltaTime;
        
        // Spawn new enemies
        if (this.shouldSpawnEnemy()) {
            this.spawnEnemy();
        }
        
        // Update all active enemies
        for (const enemy of this.enemies) {
            if (enemy.active) {
                enemy.update(deltaTime, playerTank, this.enemies.concat([playerTank]));
            }
        }
        
        // Remove inactive enemies
        this.enemies = this.enemies.filter(enemy => enemy.active);
    }
    
    // Check if should spawn a new enemy
    shouldSpawnEnemy() {
        const activeEnemies = this.enemies.filter(e => e.active).length;
        return this.spawnTimer >= this.spawnInterval &&
               activeEnemies < this.maxEnemiesOnScreen &&
               this.spawnQueue.length > 0;
    }
    
    // Spawn a new enemy
    spawnEnemy() {
        if (this.spawnQueue.length === 0) return;
        
        const enemyType = this.spawnQueue.shift();
        
        // Try each spawn position
        for (const pos of this.spawnPositions) {
            // Check if position is blocked by terrain
            if (this.collision.isPositionBlocked(pos.x, pos.y)) {
                continue;
            }
            
            // Check if position is occupied by another tank (using collision detection)
            let positionOccupied = false;
            for (const existingEnemy of this.enemies) {
                if (existingEnemy.active && 
                    this.collision.checkRectCollision(
                        pos.x, pos.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE,
                        existingEnemy.x, existingEnemy.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE
                    )) {
                    positionOccupied = true;
                    break;
                }
            }
            
            if (!positionOccupied) {
                const enemy = new EnemyTank(
                    pos.x, pos.y, enemyType,
                    this.grid, this.spriteManager, 
                    this.bulletManager, this.collision
                );
                
                this.enemies.push(enemy);
                this.totalEnemiesSpawned++;
                this.spawnTimer = 0;
                break;
            }
        }
    }
    
    // Render all enemies
    render(ctx) {
        for (const enemy of this.enemies) {
            enemy.render(ctx);
        }
    }
    
    // Get all active enemies
    getActiveEnemies() {
        return this.enemies.filter(enemy => enemy.active);
    }
    
    // Get total remaining enemies (active + in queue)
    getTotalRemainingEnemies() {
        return this.getActiveEnemies().length + this.spawnQueue.length;
    }
    
    // Get remaining count for HUD (alias for compatibility)
    getRemainingCount() {
        return this.getTotalRemainingEnemies();
    }
}