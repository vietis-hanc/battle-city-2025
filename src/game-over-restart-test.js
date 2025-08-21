// Test specifically for Game Over Screen and Restart Button bugs
class GameOverRestartTester {
    constructor(game) {
        this.game = game;
        this.testResults = [];
    }

    // Test that Game Over screen is only shown once, not every frame
    async testGameOverScreenOnlyOnce() {
        console.log('🧪 Testing Game Over screen rendering only once...');
        
        // Force game over state
        this.game.gameState.currentState = CONSTANTS.GAME_STATES.GAME_OVER;
        this.game.gameOverSoundPlayed = false;
        
        // Count how many overlays exist before
        let overlaysBefore = document.querySelectorAll('#gameOverlay').length;
        
        // Call checkGameEndConditions multiple times (simulating multiple frames)
        this.game.checkGameEndConditions();
        this.game.checkGameEndConditions();
        this.game.checkGameEndConditions();
        
        // Count overlays after
        let overlaysAfter = document.querySelectorAll('#gameOverlay').length;
        
        const passed = (overlaysAfter - overlaysBefore) === 1;
        this.testResults.push({
            test: 'Game Over Screen Only Once',
            passed: passed,
            details: `Expected 1 overlay to be added, got ${overlaysAfter - overlaysBefore}`
        });
        
        console.log(passed ? '✅ PASS' : '❌ FAIL', 'Game Over screen shown only once');
        return passed;
    }

    // Test that restart button properly clears overlay and restarts game
    async testRestartButtonFunction() {
        console.log('🧪 Testing Restart button functionality...');
        
        // First ensure we have a game over overlay
        this.game.gameState.currentState = CONSTANTS.GAME_STATES.GAME_OVER;
        this.game.gameOverSoundPlayed = false;
        this.game.checkGameEndConditions();
        
        // Verify overlay exists
        let overlayExists = document.getElementById('gameOverlay') !== null;
        if (!overlayExists) {
            this.testResults.push({
                test: 'Restart Button Function',
                passed: false,
                details: 'Could not create game over overlay for testing'
            });
            return false;
        }
        
        // Simulate restart button click by calling startNewGame
        this.game.startNewGame();
        
        // Check if overlay is removed and game state is correct
        let overlayRemoved = document.getElementById('gameOverlay') === null;
        let gameStatePlaying = this.game.gameState.currentState === CONSTANTS.GAME_STATES.PLAYING;
        let flagsReset = !this.game.gameOverSoundPlayed && !this.game.victorySoundPlayed;
        
        const passed = overlayRemoved && gameStatePlaying && flagsReset;
        this.testResults.push({
            test: 'Restart Button Function',
            passed: passed,
            details: `Overlay removed: ${overlayRemoved}, State PLAYING: ${gameStatePlaying}, Flags reset: ${flagsReset}`
        });
        
        console.log(passed ? '✅ PASS' : '❌ FAIL', 'Restart button functionality');
        return passed;
    }

    // Test victory screen as well (same pattern)
    async testVictoryScreenOnlyOnce() {
        console.log('🧪 Testing Victory screen rendering only once...');
        
        // Force victory state
        this.game.gameState.currentState = CONSTANTS.GAME_STATES.VICTORY;
        this.game.victorySoundPlayed = false;
        
        // Count how many overlays exist before
        let overlaysBefore = document.querySelectorAll('#gameOverlay').length;
        
        // Call checkGameEndConditions multiple times
        this.game.checkGameEndConditions();
        this.game.checkGameEndConditions();
        this.game.checkGameEndConditions();
        
        // Count overlays after
        let overlaysAfter = document.querySelectorAll('#gameOverlay').length;
        
        const passed = (overlaysAfter - overlaysBefore) === 1;
        this.testResults.push({
            test: 'Victory Screen Only Once',
            passed: passed,
            details: `Expected 1 overlay to be added, got ${overlaysAfter - overlaysBefore}`
        });
        
        console.log(passed ? '✅ PASS' : '❌ FAIL', 'Victory screen shown only once');
        return passed;
    }

    // Run all tests
    async runAllTests() {
        console.log('🔧 Testing Game Over and Restart Bug Fixes...');
        
        const results = await Promise.all([
            this.testGameOverScreenOnlyOnce(),
            this.testRestartButtonFunction(),
            this.testVictoryScreenOnlyOnce()
        ]);
        
        this.reportResults();
        return results.every(result => result);
    }

    // Report test results
    reportResults() {
        console.log('\n📊 Game Over & Restart Test Results:');
        console.log('=' .repeat(50));
        
        let passed = 0;
        let total = this.testResults.length;
        
        this.testResults.forEach(result => {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${result.test}`);
            if (result.details) {
                console.log(`    Details: ${result.details}`);
            }
            if (result.passed) passed++;
        });
        
        console.log(`\n📈 Overall: ${passed}/${total} tests passed`);
        if (passed === total) {
            console.log('🎉 All Game Over & Restart bugs fixed!');
        } else {
            console.log('⚠️  Some bugs still need attention');
        }
    }
}

// Auto-run tests when game is available
if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (window.game && window.game.initialized) {
                const tester = new GameOverRestartTester(window.game);
                window.gameOverRestartTester = tester; // Make available for manual testing
                
                // Uncomment to auto-run tests
                // tester.runAllTests();
            }
        }, 2000);
    });
}