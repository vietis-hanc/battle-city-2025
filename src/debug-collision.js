// Debug bullet collision system
function debugBulletCollision() {
    if (!window.game) {
        console.log('❌ Game not available');
        return;
    }
    
    console.log('🔍 Debug: Bullet Collision System');
    console.log('='.repeat(40));
    
    // Check constants
    console.log(`Brick Armor: ${CONSTANTS.BRICK_ARMOR}`);
    console.log(`Steel Armor: ${CONSTANTS.STEEL_ARMOR}`);
    
    // Check enemy power levels
    const enemies = window.game.enemyManager.getActiveEnemies();
    if (enemies.length > 0) {
        enemies.forEach((enemy, i) => {
            console.log(`Enemy ${i}: Type=${enemy.type}, Power=${enemy.power}`);
        });
    }
    
    // Check terrain at known brick positions
    const brickPositions = [[3, 3], [4, 3], [5, 3], [5, 14], [6, 14], [7, 14]];
    console.log('\nTerrain Check:');
    brickPositions.forEach(([x, y]) => {
        const terrain = window.game.terrain.getTerrain(x, y);
        const armor = window.game.terrain.terrainArmor[y] ? window.game.terrain.terrainArmor[y][x] : 'undefined';
        console.log(`  (${x}, ${y}): Terrain=${terrain}, Armor=${armor}`);
    });
    
    // Test manual terrain damage
    console.log('\n🧪 Testing manual terrain damage...');
    const testX = 3, testY = 3;
    const beforeTerrain = window.game.terrain.getTerrain(testX, testY);
    const beforeArmor = window.game.terrain.terrainArmor[testY][testX];
    
    console.log(`Before: Terrain=${beforeTerrain}, Armor=${beforeArmor}`);
    
    const destroyed = window.game.terrain.damageTerrain(testX, testY, 1);
    
    const afterTerrain = window.game.terrain.getTerrain(testX, testY);
    const afterArmor = window.game.terrain.terrainArmor[testY][testX];
    
    console.log(`After: Terrain=${afterTerrain}, Armor=${afterArmor}, Destroyed=${destroyed}`);
    
    console.log('\n💡 To use: Press F5 to call this function in browser console');
}

// Make globally accessible
window.debugBulletCollision = debugBulletCollision;

// Auto-run once
setTimeout(() => {
    if (window.game && window.game.gameState.currentState === 'playing') {
        debugBulletCollision();
    }
}, 5000);