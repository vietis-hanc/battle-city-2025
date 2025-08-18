// Enemy tank and AI system
// Enemy tank manager
class EnemyManager {
    constructor(grid, spriteManager, bulletManager, collisionDetector) {
        this.enemies = [];
        this.spawnQueue = [];
        this.maxEnemiesOnScreen = CONSTANTS.MAX_ENEMIES_ON_SCREEN;
        this.totalEnemiesSpawned = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 2000; // 2 seconds between spawns
        
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
        const spawnPositions = [
            { x: 0, y: 0 },
            { x: 6 * CONSTANTS.TILE_SIZE, y: 0 },
            { x: 12 * CONSTANTS.TILE_SIZE, y: 0 }
        ];
        
        // Try each spawn position
        for (const pos of spawnPositions) {
            if (!this.collision.isPositionBlocked(pos.x, pos.y)) {
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
    
    // Get remaining enemies count
    getRemainingCount() {
        return this.spawnQueue.length + this.getActiveEnemies().length;
    }
}