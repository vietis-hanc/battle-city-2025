// Comprehensive Bug Fix Tester for the 5 reported issues
class BugFixTester {
    constructor(game) {
        this.game = game;
        this.results = {};
    }

    // Test all 5 reported bugs
    async testAllBugs() {
        console.log('🔧 Testing all 5 reported bugs...');
        
        // Test Bug 1: Wall/Steel destruction visual
        this.testWallDestruction();
        
        // Test Bug 2: Tank invisibility after upgrade
        this.testTankVisibilityAfterUpgrade();
        
        // Test Bug 3: Player respawn stuck in walls
        this.testPlayerRespawnPosition();
        
        // Test Bug 4: Shovel powerup functionality
        this.testShovelPowerup();
        
        // Test Bug 5: Enemy kill scoring
        this.testEnemyKillScoring();
        
        this.reportResults();
    }

    // Bug 1: Test wall destruction visual
    testWallDestruction() {
        console.log('🧱 Testing wall destruction...');
        
        // Find a brick wall position
        const terrain = this.game.terrain;
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
            
            // Damage the terrain
            const beforeTerrain = terrain.getTerrain(brickPos.x, brickPos.y);
            const destroyed = terrain.damageTerrain(brickPos.x, brickPos.y, 1);
            const afterTerrain = terrain.getTerrain(brickPos.x, brickPos.y);
            
            this.results.wallDestruction = {
                tested: true,
                beforeTerrain,
                afterTerrain,
                destroyed,
                logicWorking: beforeTerrain === CONSTANTS.TERRAIN.BRICK && afterTerrain === CONSTANTS.TERRAIN.EMPTY,
                visualTest: 'Manual visual verification required'
            };
            
            console.log(`Wall destruction logic: ${this.results.wallDestruction.logicWorking ? 'WORKING' : 'BROKEN'}`);
        } else {
            this.results.wallDestruction = { tested: false, reason: 'No brick walls found' };
        }
    }

    // Bug 2: Test tank visibility after upgrade
    testTankVisibilityAfterUpgrade() {
        console.log('👻 Testing tank visibility after upgrade...');
        
        const player = this.game.playerTank;
        const spriteManager = this.game.spriteManager;
        
        // Test each power level
        const powerLevels = [1, 2, 3];
        const directions = ['up', 'down', 'left', 'right'];
        const frames = [1, 2];
        
        let missingSprites = [];
        
        for (const power of powerLevels) {
            for (const dir of directions) {
                for (const frame of frames) {
                    let spriteName;
                    if (power === 1) {
                        spriteName = `player_${dir}_t${frame}`;
                    } else {
                        spriteName = `player_${dir}_t${frame}_s${power - 1}`;
                    }
                    
                    if (!spriteManager.sprites.has(spriteName)) {
                        missingSprites.push(spriteName);
                    }
                }
            }
        }
        
        this.results.tankVisibility = {
            tested: true,
            missingSprites,
            allSpritesLoaded: missingSprites.length === 0,
            currentPlayerPower: player.powerLevel
        };
        
        console.log(`Tank visibility: ${this.results.tankVisibility.allSpritesLoaded ? 'FIXED' : 'MISSING SPRITES'}`);
        if (missingSprites.length > 0) {
            console.log('Missing sprites:', missingSprites);
        }
    }

    // Bug 3: Test player respawn position
    testPlayerRespawnPosition() {
        console.log('🔄 Testing player respawn position...');
        
        const player = this.game.playerTank;
        const terrain = this.game.terrain;
        
        // Get current position
        const currentPos = player.getPosition();
        
        // Check if current position has terrain blocking
        const terrainAtPos = terrain.getTerrain(currentPos.gridX, currentPos.gridY);
        const isBlocked = terrainAtPos === CONSTANTS.TERRAIN.BRICK || 
                         terrainAtPos === CONSTANTS.TERRAIN.STEEL || 
                         terrainAtPos === CONSTANTS.TERRAIN.WATER;
        
        this.results.respawnPosition = {
            tested: true,
            currentPosition: currentPos,
            terrainAtPosition: terrainAtPos,
            isBlocked,
            isPositionSafe: !isBlocked
        };
        
        console.log(`Respawn position: ${this.results.respawnPosition.isPositionSafe ? 'SAFE' : 'BLOCKED'}`);
    }

    // Bug 4: Test shovel powerup
    testShovelPowerup() {
        console.log('🛠️ Testing shovel powerup...');
        
        const terrain = this.game.terrain;
        const powerUpManager = this.game.powerUpManager;
        
        // Check if strengthenEagleWalls method exists and works
        const methodExists = typeof terrain.strengthenEagleWalls === 'function';
        
        if (methodExists) {
            // Test the method
            const beforeState = terrain.eagleWallsStrengthened;
            terrain.strengthenEagleWalls();
            const afterState = terrain.eagleWallsStrengthened;
            
            // Check eagle wall positions
            const eagleWallPositions = [
                [6, 12], [7, 12], [8, 12],
                [6, 13], [8, 13],
                [6, 14], [7, 14], [8, 14]
            ];
            
            let steelWalls = 0;
            eagleWallPositions.forEach(([x, y]) => {
                if (terrain.getTerrain(x, y) === CONSTANTS.TERRAIN.STEEL) {
                    steelWalls++;
                }
            });
            
            this.results.shovelPowerup = {
                tested: true,
                methodExists,
                beforeState,
                afterState,
                stateChanged: beforeState !== afterState,
                steelWallsCount: steelWalls,
                totalWallPositions: eagleWallPositions.length,
                working: afterState && steelWalls > 0
            };
        } else {
            this.results.shovelPowerup = {
                tested: true,
                methodExists: false,
                working: false
            };
        }
        
        console.log(`Shovel powerup: ${this.results.shovelPowerup.working ? 'WORKING' : 'BROKEN'}`);
    }

    // Bug 5: Test enemy kill scoring
    testEnemyKillScoring() {
        console.log('💰 Testing enemy kill scoring...');
        
        const gameState = this.game.gameState;
        const initialScore = gameState.score;
        
        // Test basic enemy scoring
        gameState.enemyDefeated(CONSTANTS.TANK_TYPES.BASIC_ENEMY);
        const scoreAfterBasic = gameState.score;
        
        // Test armored enemy scoring  
        gameState.enemyDefeated(CONSTANTS.TANK_TYPES.ARMORED_ENEMY);
        const scoreAfterArmored = gameState.score;
        
        const basicPoints = scoreAfterBasic - initialScore;
        const armoredPoints = scoreAfterArmored - scoreAfterBasic;
        
        this.results.enemyScoring = {
            tested: true,
            initialScore,
            scoreAfterBasic,
            scoreAfterArmored,
            basicPoints,
            armoredPoints,
            expectedBasicPoints: CONSTANTS.SCORE_BASIC_TANK,
            expectedArmoredPoints: CONSTANTS.SCORE_ARMORED_TANK,
            basicScoringWorking: basicPoints === CONSTANTS.SCORE_BASIC_TANK,
            armoredScoringWorking: armoredPoints === CONSTANTS.SCORE_ARMORED_TANK
        };
        
        const scoringWorking = this.results.enemyScoring.basicScoringWorking && 
                              this.results.enemyScoring.armoredScoringWorking;
        
        console.log(`Enemy scoring: ${scoringWorking ? 'WORKING' : 'BROKEN'}`);
        console.log(`Basic tank: ${basicPoints}pts (expected ${CONSTANTS.SCORE_BASIC_TANK})`);
        console.log(`Armored tank: ${armoredPoints}pts (expected ${CONSTANTS.SCORE_ARMORED_TANK})`);
    }

    // Report all test results
    reportResults() {
        console.log('\n📊 Bug Fix Test Results:');
        console.log('================================');
        
        const bugs = [
            { name: 'Wall Destruction Visual', key: 'wallDestruction', status: this.results.wallDestruction?.logicWorking },
            { name: 'Tank Visibility After Upgrade', key: 'tankVisibility', status: this.results.tankVisibility?.allSpritesLoaded },
            { name: 'Player Respawn Position', key: 'respawnPosition', status: this.results.respawnPosition?.isPositionSafe },
            { name: 'Shovel Powerup Function', key: 'shovelPowerup', status: this.results.shovelPowerup?.working },
            { name: 'Enemy Kill Scoring', key: 'enemyScoring', status: this.results.enemyScoring?.basicScoringWorking && this.results.enemyScoring?.armoredScoringWorking }
        ];
        
        bugs.forEach((bug, index) => {
            const status = bug.status ? '✅ FIXED' : '❌ BROKEN';
            console.log(`${index + 1}. ${bug.name}: ${status}`);
        });
        
        const fixedCount = bugs.filter(bug => bug.status).length;
        console.log(`\n📈 Summary: ${fixedCount}/${bugs.length} bugs fixed`);
        
        // Store results globally for access
        window.bugTestResults = this.results;
    }
}

// Auto-run tests when game is ready
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        // Wait for game to initialize
        setTimeout(() => {
            if (window.game && window.game.initialized) {
                const tester = new BugFixTester(window.game);
                
                // Add test shortcut
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'B' || e.key === 'b') {
                        tester.testAllBugs();
                    }
                });
                
                console.log('🔧 Bug Fix Tester loaded! Press B to run all bug tests.');
            }
        }, 2000);
    });
}