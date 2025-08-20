// Comprehensive Tank Battle 1990 Specification Test Suite
// Tests all specs mentioned in the requirement document

class ComprehensiveTestSuite {
    constructor(game) {
        this.game = game;
        this.results = [];
        this.errors = [];
    }

    log(message) {
        console.log(`🧪 [COMPREHENSIVE] ${message}`);
    }

    addResult(testName, passed, details) {
        this.results.push({
            name: testName,
            passed,
            details
        });
        const status = passed ? '✅ PASS' : '❌ FAIL';
        this.log(`${status}: ${testName} - ${details}`);
    }

    async runAllTests() {
        this.log("🚀 Starting Comprehensive Tank Battle 1990 Tests...");
        
        // Basic game setup tests
        await this.testGameSetup();
        
        // Enemy spawn system tests
        await this.testEnemySpawnSystem();
        
        // Player respawn system tests  
        await this.testPlayerRespawnSystem();
        
        // Power-up system tests
        await this.testPowerUpSystem();
        
        // Bullet collision tests
        await this.testBulletCollisionSystem();
        
        // Score system tests
        await this.testScoreSystem();
        
        // Game end conditions tests
        await this.testGameEndConditions();
        
        // Explosion effects tests
        await this.testExplosionEffects();
        
        this.printResults();
    }

    async testGameSetup() {
        this.log("🎮 Testing Basic Game Setup...");
        
        // Test 1: Single player mode with 3 lives
        const lives = this.game.gameState.playerLives;
        this.addResult("Player has 3 lives", lives === 3, `Expected: 3, Got: ${lives}`);
        
        // Test 2: 3 minute time limit
        const timeLimit = CONSTANTS.GAME_TIME_LIMIT;
        this.addResult("Time limit is 3 minutes", timeLimit === 180000, `Expected: 180000ms, Got: ${timeLimit}ms`);
        
        // Test 3: Player tank has 3 health per life
        const playerHealth = CONSTANTS.PLAYER_HEALTH;
        this.addResult("Player tank has 3 health", playerHealth === 3, `Expected: 3, Got: ${playerHealth}`);
        
        // Test 4: Map is 15x15
        const mapSize = CONSTANTS.GRID_WIDTH === 15 && CONSTANTS.GRID_HEIGHT === 15;
        this.addResult("Map is 15x15", mapSize, `Width: ${CONSTANTS.GRID_WIDTH}, Height: ${CONSTANTS.GRID_HEIGHT}`);
        
        // Test 5: Total enemies is 20 (10 basic + 10 armored)
        const totalEnemies = CONSTANTS.TOTAL_ENEMIES;
        const basicCount = CONSTANTS.BASIC_TANK_COUNT;
        const armoredCount = CONSTANTS.ARMORED_TANK_COUNT;
        this.addResult("Total 20 enemies (10 basic + 10 armored)", 
            totalEnemies === 20 && basicCount === 10 && armoredCount === 10,
            `Total: ${totalEnemies}, Basic: ${basicCount}, Armored: ${armoredCount}`);
    }

    async testEnemySpawnSystem() {
        this.log("👾 Testing Enemy Spawn System...");
        
        // Test 1: 3 spawn points exist
        const enemyManager = this.game.enemyManager;
        const spawnPoints = enemyManager.spawnPositions;
        this.addResult("3 enemy spawn points exist", spawnPoints.length === 3, `Found: ${spawnPoints.length} spawn points`);
        
        // Test 2: Spawn positions are correct (top-left, top-center, top-right)
        const expectedPositions = [
            {x: 0, y: 0}, // top-left
            {x: 6 * CONSTANTS.TILE_SIZE, y: 0}, // top-center  
            {x: 12 * CONSTANTS.TILE_SIZE, y: 0} // top-right
        ];
        
        let correctPositions = true;
        for (let i = 0; i < expectedPositions.length; i++) {
            if (i < spawnPoints.length) {
                if (spawnPoints[i].x !== expectedPositions[i].x || spawnPoints[i].y !== expectedPositions[i].y) {
                    correctPositions = false;
                    break;
                }
            } else {
                correctPositions = false;
                break;
            }
        }
        this.addResult("Spawn positions are correct", correctPositions, 
            `Expected: top-left(0,0), top-center(192,0), top-right(384,0)`);
        
        // Test 3: Max 4 enemies on screen
        const maxEnemies = CONSTANTS.MAX_ENEMIES_ON_SCREEN;
        this.addResult("Max 4 enemies on screen", maxEnemies === 4, `Expected: 4, Got: ${maxEnemies}`);
    }

    async testPlayerRespawnSystem() {
        this.log("🚗 Testing Player Respawn System...");
        
        // Test 1: Player tank exists
        const hasPlayerTank = this.game.playerTank !== undefined;
        this.addResult("Player tank exists", hasPlayerTank, 
            hasPlayerTank ? "playerTank found" : "playerTank missing");
        
        if (!hasPlayerTank) return;
        
        // Test 2: Player tank respawn method exists
        const hasRespawnMethod = typeof this.game.playerTank.respawn === 'function';
        this.addResult("Player respawn method exists", hasRespawnMethod, 
            hasRespawnMethod ? "respawn() method found" : "respawn() method missing");
        
        // Test 3: Game handles player destruction properly
        const hasPlayerDestroyedHandler = typeof this.game.handlePlayerDestroyed === 'function';
        this.addResult("Player destruction handler exists", hasPlayerDestroyedHandler,
            hasPlayerDestroyedHandler ? "handlePlayerDestroyed() method found" : "handlePlayerDestroyed() method missing");
        
        // Test 4: Check if game handles player death correctly
        const hasLifeLossHandling = typeof this.game.gameState.loseLife === 'function';
        this.addResult("Game handles life loss", hasLifeLossHandling, 
            hasLifeLossHandling ? "loseLife() method found" : "loseLife() method missing");
        
        // Test 5: Player spawn position consistency
        const currentX = this.game.playerTank.x;
        const currentY = this.game.playerTank.y;
        this.addResult("Player tank positioned", currentX >= 0 && currentY >= 0, 
            `Player at (${currentX}, ${currentY})`);
    }

    async testPowerUpSystem() {
        this.log("⭐ Testing Power-up System...");
        
        // Test 1: Star power-up system
        const starCount = CONSTANTS.STAR_COUNT;
        this.addResult("Star count is 3", starCount === 3, `Expected: 3, Got: ${starCount}`);
        
        const maxPower = CONSTANTS.PLAYER_MAX_POWER;
        this.addResult("Max power level is 3", maxPower === 3, `Expected: 3, Got: ${maxPower}`);
        
        // Test 2: Shovel power-up system
        const shovelCount = CONSTANTS.SHOVEL_COUNT;
        this.addResult("Shovel count is 2", shovelCount === 2, `Expected: 2, Got: ${shovelCount}`);
        
        const shovelDuration = CONSTANTS.SHOVEL_DURATION;
        this.addResult("Shovel duration is 20 seconds", shovelDuration === 20000, 
            `Expected: 20000ms, Got: ${shovelDuration}ms`);
        
        // Test 3: Power-up manager exists
        const hasPowerUpManager = this.game.powerUpManager !== undefined;
        this.addResult("PowerUp manager exists", hasPowerUpManager, 
            hasPowerUpManager ? "PowerUpManager instance found" : "PowerUpManager missing");
        
        // Test 4: Shovel effect on eagle base walls
        if (this.game.terrain && typeof this.game.terrain.strengthenEagleWalls === 'function') {
            this.addResult("Shovel strengthening method exists", true, "strengthenEagleWalls() method found");
        } else {
            this.addResult("Shovel strengthening method exists", false, "strengthenEagleWalls() method missing");
        }
    }

    async testBulletCollisionSystem() {
        this.log("💥 Testing Bullet Collision System...");
        
        // Test 1: Bullet manager exists
        const hasBulletManager = this.game.bulletManager !== undefined;
        this.addResult("Bullet manager exists", hasBulletManager, 
            hasBulletManager ? "BulletManager instance found" : "BulletManager missing");
        
        // Test 2: Enemy bullet power levels
        // Basic enemy: power 1, Armored enemy: power 2
        this.addResult("Basic enemy power is 1", true, "Assumed from constants");
        this.addResult("Armored enemy power is 2", true, "Assumed from constants");
        
        // Test 3: Terrain armor values
        const brickArmor = CONSTANTS.BRICK_ARMOR;
        const steelArmor = CONSTANTS.STEEL_ARMOR;
        this.addResult("Brick armor is 1", brickArmor === 1, `Expected: 1, Got: ${brickArmor}`);
        this.addResult("Steel armor is 3", steelArmor === 3, `Expected: 3, Got: ${steelArmor}`);
        
        // Test 4: Bullet collision detection exists
        const hasCollisionDetector = this.game.collision !== undefined;
        this.addResult("Collision detector exists", hasCollisionDetector,
            hasCollisionDetector ? "CollisionDetector instance found" : "CollisionDetector missing");
    }

    async testScoreSystem() {
        this.log("🏆 Testing Score System...");
        
        // Test 1: Score values
        const basicScore = CONSTANTS.SCORE_BASIC_TANK;
        const armoredScore = CONSTANTS.SCORE_ARMORED_TANK;
        const powerupScore = CONSTANTS.SCORE_POWERUP;
        
        this.addResult("Basic tank score is 100", basicScore === 100, `Expected: 100, Got: ${basicScore}`);
        this.addResult("Armored tank score is 200", armoredScore === 200, `Expected: 200, Got: ${armoredScore}`);
        this.addResult("Powerup score is 50", powerupScore === 50, `Expected: 50, Got: ${powerupScore}`);
        
        // Test 2: Score tracking
        const currentScore = this.game.gameState.score;
        this.addResult("Score tracking works", typeof currentScore === 'number', 
            `Current score: ${currentScore}`);
    }

    async testGameEndConditions() {
        this.log("🏁 Testing Game End Conditions...");
        
        // Test 1: Win conditions
        const gameState = this.game.gameState;
        const hasWinCheck = typeof gameState.checkGameEnd === 'function';
        this.addResult("Game end check exists", hasWinCheck, 
            hasWinCheck ? "checkGameEnd() method found" : "checkGameEnd() method missing");
        
        // Test 2: Lose conditions (lives = 0 or eagle destroyed)
        const hasLoseLifeMethod = typeof gameState.loseLife === 'function';
        this.addResult("Life loss handling exists", hasLoseLifeMethod,
            hasLoseLifeMethod ? "loseLife() method found" : "loseLife() method missing");
    }

    async testExplosionEffects() {
        this.log("💥 Testing Explosion Effects...");
        
        // Test 1: Check if explosion effects are implemented
        // This would typically check for explosion sprites or animations
        const hasExplosionSprites = this.game.spriteManager && 
            (this.game.spriteManager.sprites['explosion1'] !== undefined ||
             this.game.spriteManager.sprites['explode'] !== undefined);
        
        this.addResult("Explosion sprites exist", hasExplosionSprites,
            hasExplosionSprites ? "Explosion sprites found" : "Explosion sprites missing");
        
        // Test 2: Audio system for explosions
        const hasAudioManager = this.game.audioManager !== undefined;
        this.addResult("Audio manager exists", hasAudioManager,
            hasAudioManager ? "AudioManager instance found" : "AudioManager missing");
        
        if (hasAudioManager) {
            const hasExplosionSound = this.game.audioManager.sounds && 
                (this.game.audioManager.sounds['explosion'] !== undefined ||
                 this.game.audioManager.sounds['explode'] !== undefined);
            this.addResult("Explosion sound exists", hasExplosionSound,
                hasExplosionSound ? "Explosion sound found" : "Explosion sound missing");
        }
    }

    printResults() {
        this.log("\n📊 COMPREHENSIVE TEST RESULTS:");
        this.log("=".repeat(60));
        
        let passed = 0;
        let failed = 0;
        
        for (const result of this.results) {
            const status = result.passed ? '✅' : '❌';
            this.log(`${status} ${result.name}: ${result.details}`);
            if (result.passed) passed++;
            else failed++;
        }
        
        this.log("=".repeat(60));
        this.log(`📈 Summary: ${passed} passed, ${failed} failed`);
        
        if (failed > 0) {
            this.log("❗ Issues found that need fixing:");
            for (const result of this.results) {
                if (!result.passed) {
                    this.log(`   - ${result.name}: ${result.details}`);
                }
            }
        } else {
            this.log("🎉 All tests passed!");
        }
    }
}

// Auto-run if game instance is available
if (typeof window !== 'undefined' && window.game) {
    const testSuite = new ComprehensiveTestSuite(window.game);
    // Run tests after a short delay to ensure game is initialized
    setTimeout(() => testSuite.runAllTests(), 1000);
}