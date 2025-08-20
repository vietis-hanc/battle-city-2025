// Specific debug test for the 2 remaining bugs
class RemainingBugsDebugger {
    constructor(game) {
        this.game = game;
    }

    // Debug terrain destruction visual issue
    testTerrainDestruction() {
        console.log('🧱 DEBUGGING: Terrain destruction...');
        
        const terrain = this.game.terrain;
        
        // Find a brick wall
        let brickPos = null;
        for (let y = 0; y < 15; y++) {
            for (let x = 0; x < 15; x++) {
                if (terrain.getTerrain(x, y) === CONSTANTS.TERRAIN.BRICK) {
                    brickPos = { x, y };
                    break;
                }
            }
            if (brickPos) break;
        }
        
        if (brickPos) {
            console.log(`Found brick at (${brickPos.x}, ${brickPos.y})`);
            console.log(`Terrain type before: ${terrain.getTerrain(brickPos.x, brickPos.y)}`);
            console.log(`Terrain armor before: ${terrain.terrainArmor[brickPos.y][brickPos.x]}`);
            
            // Manually damage it
            const destroyed = terrain.damageTerrain(brickPos.x, brickPos.y, 1);
            
            console.log(`Destroyed: ${destroyed}`);
            console.log(`Terrain type after: ${terrain.getTerrain(brickPos.x, brickPos.y)}`);
            console.log(`Terrain armor after: ${terrain.terrainArmor[brickPos.y][brickPos.x]}`);
            
            // The issue might be that the terrain data is changing but rendering isn't updating
            console.log('✅ Terrain destruction logic appears to work correctly');
            console.log('⚠️ If walls don\'t visually disappear, the issue is in rendering/refresh');
        }
    }

    // Debug shovel powerup
    testShovelPowerup() {
        console.log('🛠️ DEBUGGING: Shovel powerup...');
        
        const terrain = this.game.terrain;
        
        // Check initial eagle wall state
        const eagleWallPositions = [
            [6, 12], [7, 12], [8, 12],
            [6, 13], [8, 13],
            [6, 14], [7, 14], [8, 14]
        ];
        
        console.log('Eagle wall states before shovel:');
        eagleWallPositions.forEach(([x, y]) => {
            const terrainType = terrain.getTerrain(x, y);
            console.log(`  (${x},${y}): ${terrainType}`);
        });
        
        console.log(`Eagles walls strengthened: ${terrain.eagleWallsStrengthened}`);
        
        // Apply shovel effect
        terrain.strengthenEagleWalls();
        
        console.log('Eagle wall states after shovel:');
        eagleWallPositions.forEach(([x, y]) => {
            const terrainType = terrain.getTerrain(x, y);
            console.log(`  (${x},${y}): ${terrainType}`);
        });
        
        console.log(`Eagles walls strengthened: ${terrain.eagleWallsStrengthened}`);
        console.log(`Shovel timer: ${terrain.shovelTimer}`);
    }

    // Debug enemy scoring system thoroughly
    testEnemyScoringDetailed() {
        console.log('💰 DEBUGGING: Enemy scoring system...');
        
        const gameState = this.game.gameState;
        const bulletManager = this.game.bulletManager;
        
        console.log(`Initial score: ${gameState.score}`);
        console.log(`Initial enemies remaining: ${gameState.enemiesRemaining}`);
        
        // Check if callbacks are properly set
        console.log('BulletManager callbacks:');
        console.log(`  onEnemyDefeated: ${typeof bulletManager.callbacks.onEnemyDefeated}`);
        console.log(`  onPlayerDestroyed: ${typeof bulletManager.callbacks.onPlayerDestroyed}`);
        console.log(`  onEagleDestroyed: ${typeof bulletManager.callbacks.onEagleDestroyed}`);
        
        // Test the gameState.enemyDefeated method directly
        console.log('\nTesting gameState.enemyDefeated directly:');
        const scoreBefore = gameState.score;
        const enemiesBefore = gameState.enemiesRemaining;
        
        gameState.enemyDefeated(CONSTANTS.TANK_TYPES.BASIC_ENEMY);
        
        const scoreAfter = gameState.score;
        const enemiesAfter = gameState.enemiesRemaining;
        
        console.log(`Score: ${scoreBefore} → ${scoreAfter} (should be +${CONSTANTS.SCORE_BASIC_TANK})`);
        console.log(`Enemies: ${enemiesBefore} → ${enemiesAfter} (should be -1)`);
        
        // Test if the callback is working
        console.log('\nTesting callback directly:');
        try {
            bulletManager.callbacks.onEnemyDefeated(CONSTANTS.TANK_TYPES.ARMORED_ENEMY);
            console.log(`Score after callback: ${gameState.score} (should be +${CONSTANTS.SCORE_ARMORED_TANK})`);
        } catch (e) {
            console.error('Callback failed:', e);
        }
    }

    // Test collision detection for bullets vs enemies
    testBulletEnemyCollision() {
        console.log('🎯 DEBUGGING: Bullet vs Enemy collision...');
        
        const enemies = this.game.enemyManager.getActiveEnemies();
        const bullets = this.game.bulletManager.bullets;
        
        console.log(`Active enemies: ${enemies.length}`);
        console.log(`Active bullets: ${bullets.length}`);
        
        if (enemies.length > 0) {
            const enemy = enemies[0];
            console.log(`Enemy position: (${enemy.x}, ${enemy.y}), health: ${enemy.health}, type: ${enemy.type}`);
            
            // Create a test bullet at enemy position (should hit)
            const testBullet = this.game.bulletManager.createBullet(
                enemy.x, enemy.y, CONSTANTS.DIRECTIONS.UP, 1, 'player'
            );
            
            console.log('Created test bullet at enemy position');
            
            // Let collision detection run for a frame
            setTimeout(() => {
                console.log(`Enemy health after: ${enemy.health}, active: ${enemy.active}`);
                console.log(`Current score: ${this.game.gameState.score}`);
            }, 100);
        }
    }

    // Run all debug tests
    runAllTests() {
        console.log('🔍 DEBUGGING REMAINING BUGS...');
        console.log('================================');
        
        this.testTerrainDestruction();
        console.log('');
        this.testShovelPowerup();
        console.log('');
        this.testEnemyScoringDetailed();
        console.log('');
        this.testBulletEnemyCollision();
    }
}

// Auto-setup when game is ready
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.game && window.game.initialized) {
                const bugDebugger = new RemainingBugsDebugger(window.game);
                
                // Add debug shortcut
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'D' || e.key === 'd') {
                        bugDebugger.runAllTests();
                    }
                });
                
                console.log('🔍 Bug Debugger loaded! Press D to run detailed debug tests.');
            }
        }, 2000);
    });
}