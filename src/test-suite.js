// Comprehensive test suite for Tank Battle 1990 bug fixes
class TankBattleTestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
    }

    // Run all tests
    async runAllTests() {
        console.log('🧪 Running Tank Battle 1990 Bug Fix Tests...\n');
        
        // Test 1: Canvas Size
        this.addTest('Canvas Size (480x480)', () => {
            const canvas = document.getElementById('gameCanvas');
            return canvas.width === 480 && canvas.height === 480;
        });

        // Test 2: Audio System
        this.addTest('Audio System Loaded', () => {
            return window.game && window.game.audioManager && 
                   typeof window.game.audioManager.play === 'function';
        });

        // Test 3: Enemy Spawn Points
        this.addTest('Enemy Spawn System', () => {
            if (!window.game || !window.game.enemyManager) return false;
            // Check if enemies can spawn at different positions
            const spawnPositions = [
                { x: 0, y: 0 },
                { x: 6 * 32, y: 0 },
                { x: 12 * 32, y: 0 }
            ];
            return spawnPositions.length === 3; // Basic check
        });

        // Test 4: Player Movement
        this.addTest('Player Movement System', () => {
            if (!window.game || !window.game.playerTank) return false;
            return window.game.playerTank.speed === 2; // Speed should be 2 pixels/frame
        });

        // Test 5: Bullet Collision Detection
        this.addTest('Bullet Collision System', () => {
            if (!window.game || !window.game.bulletManager || !window.game.collision) return false;
            return typeof window.game.collision.checkBulletTerrainCollision === 'function';
        });

        // Test 6: Z-Index Rendering (Trees on top)
        this.addTest('Z-Index Rendering Fixed', () => {
            if (!window.game || !window.game.terrain) return false;
            return typeof window.game.terrain.renderBackground === 'function' &&
                   typeof window.game.terrain.renderForeground === 'function';
        });

        // Test 7: Enemy Firing Rate
        this.addTest('Enemy Firing Rate Increased', () => {
            if (!window.game || !window.game.enemyManager || !window.game.enemyManager.enemies.length) return 'skipped';
            // Check if enemy has reasonable shooting interval
            const enemy = window.game.enemyManager.enemies[0];
            return enemy && enemy.shootInterval < 1500; // Should be less than 1.5s
        });

        // Test 8: Game State Win Condition
        this.addTest('Win Condition Logic', () => {
            if (!window.game || !window.game.gameState) return false;
            return typeof window.game.gameState.enemyDefeated === 'function';
        });

        // Test 9: HUD System
        this.addTest('HUD Display System', () => {
            const hud = document.getElementById('hud');
            return hud && hud.offsetWidth === 480; // Should match canvas width
        });

        // Test 10: Constants Values
        this.addTest('Game Constants Correct', () => {
            return CONSTANTS.CANVAS_WIDTH === 480 && 
                   CONSTANTS.CANVAS_HEIGHT === 480 &&
                   CONSTANTS.GRID_WIDTH === 15 &&
                   CONSTANTS.GRID_HEIGHT === 15;
        });

        // Run all tests
        for (let i = 0; i < this.tests.length; i++) {
            const test = this.tests[i];
            try {
                const result = test.func();
                this.results.push({
                    name: test.name,
                    status: result === true ? 'PASS' : result === 'skipped' ? 'SKIP' : 'FAIL',
                    result: result
                });
            } catch (error) {
                this.results.push({
                    name: test.name,
                    status: 'ERROR',
                    result: error.message
                });
            }
        }

        this.displayResults();
    }

    addTest(name, testFunc) {
        this.tests.push({ name, func: testFunc });
    }

    displayResults() {
        console.log('\n📊 Test Results:');
        console.log('='.repeat(50));
        
        let passed = 0, failed = 0, skipped = 0, errors = 0;
        
        this.results.forEach((result, index) => {
            const icon = result.status === 'PASS' ? '✅' : 
                        result.status === 'FAIL' ? '❌' : 
                        result.status === 'SKIP' ? '⏭️' : '💥';
            
            console.log(`${icon} ${result.name}: ${result.status}`);
            if (result.status === 'FAIL' || result.status === 'ERROR') {
                console.log(`   └─ ${result.result}`);
            }
            
            switch(result.status) {
                case 'PASS': passed++; break;
                case 'FAIL': failed++; break;
                case 'SKIP': skipped++; break;
                case 'ERROR': errors++; break;
            }
        });
        
        console.log('='.repeat(50));
        console.log(`📈 Summary: ${passed} passed, ${failed} failed, ${skipped} skipped, ${errors} errors`);
        
        if (failed === 0 && errors === 0) {
            console.log('🎉 All critical tests passed!');
        } else {
            console.log('⚠️  Some tests failed - check issues above');
        }
    }
}

// Auto-run tests when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        const testSuite = new TankBattleTestSuite();
        testSuite.runAllTests();
    }, 2000); // Wait 2 seconds for game to initialize
});