// Test suite for eagle destruction and restart functionality
class EagleRestartTest {
    constructor() {
        this.results = [];
    }
    
    test(name, condition, details = '') {
        const passed = condition;
        this.results.push({ name, passed, details });
        console.log(`${passed ? '✅' : '❌'} ${name}: ${passed ? 'PASS' : 'FAIL'}`);
        if (details && !passed) {
            console.log(`   └─ ${details}`);
        }
    }
    
    async runTests() {
        console.log('🧪 Testing Eagle Destruction and Restart Functionality...');
        console.log('================================================');
        
        // Wait for game to be initialized
        await this.waitForGame();
        
        // Test 1: Initial game state
        this.test('Game initialized correctly', 
            window.game && window.game.gameState.currentState === 'playing');
        
        // Test 2: Eagle is not initially destroyed
        this.test('Eagle not initially destroyed', 
            !window.game.terrain.eagleDestroyed);
        
        // Test 3: Destroy eagle and check game over
        window.game.terrain.eagleDestroyed = true;
        
        // Wait a frame for the game loop to process
        await this.waitFrames(2);
        
        this.test('Eagle destruction triggers game over', 
            window.game.gameState.currentState === 'gameOver');
        
        this.test('Player still has lives after eagle destruction', 
            window.game.gameState.playerLives > 0);
        
        // Test 4: Simulate Enter key press to restart
        window.game.startNewGame();
        
        // Wait a frame for initialization
        await this.waitFrames(2);
        
        this.test('Game restarts after Enter press', 
            window.game.gameState.currentState === 'playing');
        
        this.test('Eagle is restored after restart', 
            !window.game.terrain.eagleDestroyed);
        
        this.test('Player lives reset to 3', 
            window.game.gameState.playerLives === 3);
        
        this.test('Game timer reset', 
            window.game.gameState.getRemainingTime() > 170); // Should be close to 180 (3 minutes)
        
        // Test multiple eagle destruction cycles
        for (let i = 1; i <= 3; i++) {
            // Destroy eagle
            window.game.terrain.eagleDestroyed = true;
            await this.waitFrames(2);
            
            this.test(`Eagle destruction cycle ${i}: Game over triggered`, 
                window.game.gameState.currentState === 'gameOver');
            
            // Restart
            window.game.startNewGame();
            await this.waitFrames(2);
            
            this.test(`Eagle destruction cycle ${i}: Game restarted`, 
                window.game.gameState.currentState === 'playing' && !window.game.terrain.eagleDestroyed);
        }
        
        // Summary
        console.log('================================================');
        const passed = this.results.filter(r => r.passed).length;
        const total = this.results.length;
        console.log(`📈 Eagle Restart Test Summary: ${passed}/${total} tests passed`);
        
        if (passed === total) {
            console.log('🎉 All eagle restart tests passed!');
        } else {
            console.log('❌ Some eagle restart tests failed');
        }
    }
    
    waitForGame() {
        return new Promise(resolve => {
            const check = () => {
                if (window.game && window.game.initialized && window.game.gameState) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }
    
    waitFrames(frames) {
        return new Promise(resolve => {
            let count = 0;
            const frame = () => {
                count++;
                if (count >= frames) {
                    resolve();
                } else {
                    requestAnimationFrame(frame);
                }
            };
            requestAnimationFrame(frame);
        });
    }
}

// Run tests when page loads
window.addEventListener('load', async () => {
    // Wait a bit for other systems to initialize
    setTimeout(async () => {
        const tester = new EagleRestartTest();
        await tester.runTests();
    }, 2000);
});

console.log('🦅 Eagle Restart Test Suite loaded');