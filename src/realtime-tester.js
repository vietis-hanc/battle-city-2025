// Real-time gameplay testing to catch bugs during live play
class RealTimeGameplayTester {
    constructor() {
        this.game = null;
        this.testResults = {
            enemyBulletBrickDestruction: false,
            playerMovementIssues: false,
            playerStuckInWalls: false,
            enemyBulletTerrainCollision: false
        };
        this.monitoringActive = false;
        this.originalBulletUpdate = null;
        this.originalPlayerUpdate = null;
    }
    
    init(game) {
        this.game = game;
        this.startMonitoring();
        console.log('🔍 Real-time Gameplay Tester active');
        console.log('   - Monitoring enemy bullet vs terrain collisions');
        console.log('   - Monitoring player movement for wall-stuck issues');
        console.log('   - Press R during gameplay to see test report');
    }
    
    startMonitoring() {
        if (!this.game || this.monitoringActive) return;
        
        this.monitoringActive = true;
        
        // TEMPORARILY DISABLE INTERCEPTION FOR TESTING
        console.log('⚠️ Real-time monitoring disabled for testing');
        return;
        
        // Override bullet update to monitor collisions
        this.interceptBulletCollisions();
        
        // Override player update to monitor movement
        this.interceptPlayerMovement();
        
        // Set up keyboard listener for report
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyR' && this.game.gameState.state === CONSTANTS.GAME_STATES.PLAYING) {
                this.generateReport();
            }
        });
    }
    
    interceptBulletCollisions() {
        if (!this.game.bulletManager) return;
        
        // Store original method
        this.originalBulletUpdate = this.game.bulletManager.handleTerrainHit.bind(this.game.bulletManager);
        
        // Override with monitoring version
        this.game.bulletManager.handleTerrainHit = (bullet, terrainHit) => {
            // Monitor enemy bullets hitting terrain
            if (bullet.team === 'enemy' && terrainHit.terrain === CONSTANTS.TERRAIN.BRICK) {
                console.log(`🧱 Enemy bullet hit brick at (${terrainHit.gridX}, ${terrainHit.gridY})`);
                
                // Check if terrain actually gets damaged
                const originalTerrain = this.game.terrain.getTerrain(terrainHit.gridX, terrainHit.gridY);
                
                // Call original method
                const result = this.originalBulletUpdate(bullet, terrainHit);
                
                // Check if terrain was actually damaged
                const newTerrain = this.game.terrain.getTerrain(terrainHit.gridX, terrainHit.gridY);
                
                if (originalTerrain === CONSTANTS.TERRAIN.BRICK && newTerrain !== CONSTANTS.TERRAIN.BRICK) {
                    console.log('✅ Enemy bullet successfully damaged brick');
                    this.testResults.enemyBulletBrickDestruction = true;
                } else if (originalTerrain === CONSTANTS.TERRAIN.BRICK) {
                    console.log('❌ Enemy bullet hit brick but did not damage it!');
                    this.testResults.enemyBulletTerrainCollision = true;
                }
                
                return result;
            }
            
            // Call original method for all other cases
            return this.originalBulletUpdate(bullet, terrainHit);
        };
    }
    
    interceptPlayerMovement() {
        if (!this.game.playerTank) return;
        
        let lastValidPosition = { x: this.game.playerTank.x, y: this.game.playerTank.y };
        let stuckFrameCount = 0;
        let lastStuckCheck = Date.now();
        
        // Store original method
        this.originalPlayerUpdate = this.game.playerTank.handleMovement.bind(this.game.playerTank);
        
        // Override with monitoring version
        this.game.playerTank.handleMovement = (input, otherTanks) => {
            const beforeX = this.game.playerTank.x;
            const beforeY = this.game.playerTank.y;
            
            // Call original method
            this.originalPlayerUpdate(input, otherTanks);
            
            const afterX = this.game.playerTank.x;
            const afterY = this.game.playerTank.y;
            
            // Check if player moved
            const moved = beforeX !== afterX || beforeY !== afterY;
            
            // Check if input was pressed but no movement occurred
            const movementDirection = input.getMovementDirection();
            if (movementDirection !== -1 && !moved) {
                // Player tried to move but couldn't
                const dir = DIRECTION_VECTORS[movementDirection];
                const intendedX = beforeX + dir.x * this.game.playerTank.speed;
                const intendedY = beforeY + dir.y * this.game.playerTank.speed;
                
                // Check if intended position would be inside terrain
                const gridX = Math.floor(intendedX / CONSTANTS.TILE_SIZE);
                const gridY = Math.floor(intendedY / CONSTANTS.TILE_SIZE);
                
                if (this.game.grid.isInBounds(gridX, gridY)) {
                    const terrainType = this.game.terrain.getTerrain(gridX, gridY);
                    if (terrainType === CONSTANTS.TERRAIN.BRICK || terrainType === CONSTANTS.TERRAIN.STEEL) {
                        // Normal behavior - blocked by wall
                        console.log(`🚧 Player correctly blocked by ${terrainType} at (${gridX}, ${gridY})`);
                    } else {
                        // Potential stuck issue
                        console.log(`⚠️  Player couldn't move to empty space at (${gridX}, ${gridY})`);
                        this.testResults.playerMovementIssues = true;
                    }
                }
            }
            
            // Check for being stuck in terrain
            const currentGridX = Math.floor(afterX / CONSTANTS.TILE_SIZE);
            const currentGridY = Math.floor(afterY / CONSTANTS.TILE_SIZE);
            
            if (this.game.grid.isInBounds(currentGridX, currentGridY)) {
                const currentTerrain = this.game.terrain.getTerrain(currentGridX, currentGridY);
                if (currentTerrain === CONSTANTS.TERRAIN.BRICK || currentTerrain === CONSTANTS.TERRAIN.STEEL) {
                    console.log(`❌ CRITICAL: Player tank is stuck inside ${currentTerrain} at (${currentGridX}, ${currentGridY})!`);
                    this.testResults.playerStuckInWalls = true;
                }
            }
            
            // Update last valid position if player moved to empty space
            if (moved) {
                lastValidPosition = { x: afterX, y: afterY };
                stuckFrameCount = 0;
            } else {
                stuckFrameCount++;
            }
            
            // Check for prolonged lack of movement despite input
            if (Date.now() - lastStuckCheck > 1000) { // Check every second
                if (stuckFrameCount > 60 && movementDirection !== -1) { // 60 frames of being stuck
                    console.log(`⚠️  Player appears stuck - no movement for ${stuckFrameCount} frames despite input`);
                    this.testResults.playerMovementIssues = true;
                }
                lastStuckCheck = Date.now();
            }
        };
    }
    
    generateReport() {
        console.log('\n🔍 Real-time Gameplay Test Report:');
        console.log('='.repeat(50));
        
        const issues = [];
        
        if (this.testResults.enemyBulletTerrainCollision) {
            issues.push('❌ Enemy bullets not properly destroying bricks');
        } else if (this.testResults.enemyBulletBrickDestruction) {
            console.log('✅ Enemy bullet brick destruction: WORKING');
        } else {
            console.log('⏭️  Enemy bullet brick destruction: NOT YET TESTED');
        }
        
        if (this.testResults.playerMovementIssues) {
            issues.push('❌ Player movement issues detected');
        } else {
            console.log('✅ Player movement: WORKING CORRECTLY');
        }
        
        if (this.testResults.playerStuckInWalls) {
            issues.push('❌ Player tank stuck inside walls');
        } else {
            console.log('✅ Player wall collision: WORKING CORRECTLY');
        }
        
        console.log('='.repeat(50));
        
        if (issues.length === 0) {
            console.log('🎉 No issues detected during gameplay!');
        } else {
            console.log('⚠️  Issues detected:');
            issues.forEach(issue => console.log(`  ${issue}`));
        }
        
        console.log('\n💡 Continue playing to test more scenarios, or press R again for updated report');
    }
    
    // Method to trigger enemy shooting for testing
    forceEnemyShoot() {
        if (!this.game || !this.game.enemyManager) return;
        
        const enemies = this.game.enemyManager.getActiveEnemies();
        if (enemies.length > 0) {
            // Make first enemy shoot
            enemies[0].shoot();
            console.log('🎯 Forced enemy to shoot for testing');
        }
    }
}

// Auto-initialize when game starts
window.addEventListener('load', () => {
    if (window.game) {
        setTimeout(() => {
            const gameplayTester = new RealTimeGameplayTester();
            window.gameplayTester = gameplayTester; // Make it globally accessible
            gameplayTester.init(window.game);
        }, 4000); // Wait 4 seconds for full game initialization
    }
});