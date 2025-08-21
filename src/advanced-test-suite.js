// Advanced test suite for specific bugs mentioned in comment
class AdvancedTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.game = null;
    }
    
    // Initialize test suite with game instance
    init(game) {
        this.game = game;
        console.log('🔍 Advanced Bug Tests Initialized');
    }
    
    // Test 1: Enemy bullets breaking bricks
    testEnemyBulletBrickCollision() {
        console.log('🧱 Testing enemy bullet vs brick collision...');
        
        if (!this.game || !this.game.enemyManager || !this.game.bulletManager) {
            return { status: 'FAIL', reason: 'Game components not available' };
        }
        
        // Get a brick position
        let brickFound = false;
        let brickX = -1, brickY = -1;
        
        for (let y = 0; y < CONSTANTS.GRID_HEIGHT; y++) {
            for (let x = 0; x < CONSTANTS.GRID_WIDTH; x++) {
                if (this.game.terrain.getTerrain(x, y) === CONSTANTS.TERRAIN.BRICK) {
                    brickX = x;
                    brickY = y;
                    brickFound = true;
                    break;
                }
            }
            if (brickFound) break;
        }
        
        if (!brickFound) {
            return { status: 'SKIP', reason: 'No bricks found on map' };
        }
        
        // Create enemy bullet pointing at brick
        const bulletX = brickX * CONSTANTS.TILE_SIZE - CONSTANTS.TILE_SIZE;
        const bulletY = brickY * CONSTANTS.TILE_SIZE;
        
        const bullet = this.game.bulletManager.createBullet(
            bulletX, bulletY, 
            CONSTANTS.DIRECTIONS.RIGHT, 
            1, 
            'enemy'
        );
        
        // Simulate bullet movement until it hits the brick
        let iterations = 0;
        const maxIterations = 50;
        
        while (bullet.active && iterations < maxIterations) {
            bullet.update();
            
            // Check collision manually
            const terrainHit = this.game.collision.checkBulletTerrainCollision(bullet);
            if (terrainHit.hit) {
                this.game.bulletManager.handleTerrainHit(bullet, terrainHit);
                break;
            }
            iterations++;
        }
        
        // Check if brick was damaged
        const newTerrainType = this.game.terrain.getTerrain(brickX, brickY);
        if (newTerrainType !== CONSTANTS.TERRAIN.BRICK) {
            return { status: 'PASS', reason: 'Enemy bullet successfully damaged brick' };
        } else {
            return { status: 'FAIL', reason: 'Enemy bullet did not damage brick' };
        }
    }
    
    // Test 2: Player tank movement against bricks
    testPlayerMovementAgainstBricks() {
        console.log('🚗 Testing player movement against bricks...');
        
        if (!this.game || !this.game.playerTank) {
            return { status: 'FAIL', reason: 'Player tank not available' };
        }
        
        // Store original position
        const originalX = this.game.playerTank.x;
        const originalY = this.game.playerTank.y;
        
        // Try to move player into a brick wall
        // Find a brick near the player
        let brickX = -1, brickY = -1;
        let playerGridX = Math.floor(originalX / CONSTANTS.TILE_SIZE);
        let playerGridY = Math.floor(originalY / CONSTANTS.TILE_SIZE);
        
        // Check adjacent positions for bricks
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 1, y: 0 },  // right
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }  // left
        ];
        
        for (const dir of directions) {
            const checkX = playerGridX + dir.x;
            const checkY = playerGridY + dir.y;
            
            if (this.game.grid.isInBounds(checkX, checkY)) {
                if (this.game.terrain.getTerrain(checkX, checkY) === CONSTANTS.TERRAIN.BRICK) {
                    brickX = checkX;
                    brickY = checkY;
                    break;
                }
            }
        }
        
        if (brickX === -1) {
            return { status: 'SKIP', reason: 'No adjacent bricks found for testing' };
        }
        
        // Try to move towards the brick
        const targetX = brickX * CONSTANTS.TILE_SIZE;
        const targetY = brickY * CONSTANTS.TILE_SIZE;
        
        // Test movement collision detection
        const canMove = this.game.collision.canTankMoveTo(
            originalX, originalY, 
            targetX, targetY, 
            CONSTANTS.TILE_SIZE
        );
        
        if (!canMove) {
            return { status: 'PASS', reason: 'Collision detection correctly blocks movement into brick' };
        } else {
            return { status: 'FAIL', reason: 'Collision detection allows movement into brick' };
        }
    }
    
    // Test 3: Check game constants
    testGameConstants() {
        console.log('📏 Testing game constants...');
        
        const errors = [];
        
        if (typeof CONSTANTS === 'undefined') {
            errors.push('CONSTANTS object not defined');
        } else {
            if (CONSTANTS.CANVAS_WIDTH !== 480) errors.push(`Canvas width: ${CONSTANTS.CANVAS_WIDTH}, expected: 480`);
            if (CONSTANTS.CANVAS_HEIGHT !== 480) errors.push(`Canvas height: ${CONSTANTS.CANVAS_HEIGHT}, expected: 480`);
            if (CONSTANTS.GRID_WIDTH !== 15) errors.push(`Grid width: ${CONSTANTS.GRID_WIDTH}, expected: 15`);
            if (CONSTANTS.GRID_HEIGHT !== 15) errors.push(`Grid height: ${CONSTANTS.GRID_HEIGHT}, expected: 15`);
            if (CONSTANTS.TILE_SIZE !== 32) errors.push(`Tile size: ${CONSTANTS.TILE_SIZE}, expected: 32`);
        }
        
        if (errors.length === 0) {
            return { status: 'PASS', reason: 'All constants correct' };
        } else {
            return { status: 'FAIL', reason: errors.join('; ') };
        }
    }
    
    // Test 4: Enemy spawn system
    testEnemySpawnSystem() {
        console.log('👾 Testing enemy spawn system...');
        
        if (!this.game || !this.game.enemyManager) {
            return { status: 'FAIL', reason: 'Enemy manager not available' };
        }
        
        const spawnPositions = this.game.enemyManager.spawnPositions;
        if (!spawnPositions || spawnPositions.length !== 3) {
            return { status: 'FAIL', reason: `Expected 3 spawn positions, got: ${spawnPositions ? spawnPositions.length : 0}` };
        }
        
        // Check if spawn positions are different
        const pos1 = spawnPositions[0];
        const pos2 = spawnPositions[1];
        const pos3 = spawnPositions[2];
        
        if (pos1.x === pos2.x && pos1.y === pos2.y) {
            return { status: 'FAIL', reason: 'Spawn positions 1 and 2 are identical' };
        }
        
        if (pos1.x === pos3.x && pos1.y === pos3.y) {
            return { status: 'FAIL', reason: 'Spawn positions 1 and 3 are identical' };
        }
        
        if (pos2.x === pos3.x && pos2.y === pos3.y) {
            return { status: 'FAIL', reason: 'Spawn positions 2 and 3 are identical' };
        }
        
        return { status: 'PASS', reason: 'Enemy spawn system has 3 unique positions' };
    }
    
    // Test 5: Z-index rendering system
    testZIndexRendering() {
        console.log('🌳 Testing Z-index rendering system...');
        
        if (!this.game || !this.game.terrain) {
            return { status: 'FAIL', reason: 'Terrain system not available' };
        }
        
        // Check if terrain has separate background/foreground rendering
        const hasBackgroundRender = typeof this.game.terrain.renderBackground === 'function';
        const hasForegroundRender = typeof this.game.terrain.renderForeground === 'function';
        
        if (!hasBackgroundRender) {
            return { status: 'FAIL', reason: 'Missing renderBackground function' };
        }
        
        if (!hasForegroundRender) {
            return { status: 'FAIL', reason: 'Missing renderForeground function' };
        }
        
        return { status: 'PASS', reason: 'Z-index rendering system properly implemented' };
    }
    
    // Run all advanced tests
    async runAllTests() {
        console.log('🔬 Running Advanced Bug Tests...\n');
        
        const tests = [
            { name: 'Game Constants', func: () => this.testGameConstants() },
            { name: 'Enemy Spawn System', func: () => this.testEnemySpawnSystem() },
            { name: 'Player Movement System', func: () => this.testPlayerMovementAgainstBricks() },
            { name: 'Bullet Collision System', func: () => this.testEnemyBulletBrickCollision() },
            { name: 'Z-Index Rendering Fixed', func: () => this.testZIndexRendering() }
        ];
        
        for (const test of tests) {
            try {
                const result = test.func();
                this.results.push({
                    name: test.name,
                    ...result
                });
            } catch (error) {
                this.results.push({
                    name: test.name,
                    status: 'ERROR',
                    reason: error.message
                });
            }
        }
        
        this.displayResults();
    }
    
    displayResults() {
        console.log('\n🔍 Advanced Test Results:');
        console.log('='.repeat(50));
        
        let passed = 0, failed = 0, skipped = 0, errors = 0;
        
        this.results.forEach((result) => {
            const icon = result.status === 'PASS' ? '✅' : 
                        result.status === 'FAIL' ? '❌' : 
                        result.status === 'SKIP' ? '⏭️' : '💥';
            
            console.log(`${icon} ${result.name}: ${result.status}`);
            if (result.status === 'FAIL' || result.status === 'ERROR' || result.status === 'SKIP') {
                console.log(`   └─ ${result.reason}`);
            }
            
            switch(result.status) {
                case 'PASS': passed++; break;
                case 'FAIL': failed++; break;
                case 'SKIP': skipped++; break;
                case 'ERROR': errors++; break;
            }
        });
        
        console.log('='.repeat(50));
        console.log(`📈 Advanced Summary: ${passed} passed, ${failed} failed, ${skipped} skipped, ${errors} errors`);
        
        if (failed > 0 || errors > 0) {
            console.log('⚠️  Critical bugs detected - see details above');
        }
    }
}

// Auto-initialize and run tests
window.addEventListener('load', () => {
    if (window.game) {
        setTimeout(() => {
            const advancedTests = new AdvancedTestSuite();
            advancedTests.init(window.game);
            advancedTests.runAllTests();
        }, 3000); // Wait 3 seconds for game to fully initialize
    }
});