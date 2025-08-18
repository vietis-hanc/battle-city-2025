// Terrain management for tank battle
class TerrainManager {
    constructor(grid, spriteManager) {
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.terrain = [];
        this.terrainArmor = []; // Separate armor values for destructible terrain
        this.initializeTerrain();
        this.eagleDestroyed = false;
        
        // Shovel effect
        this.eagleWallsStrengthened = false;
        this.shovelTimer = 0;
        this.originalEagleWalls = [];
    }
    
    // Initialize terrain grid
    initializeTerrain() {
        // Initialize with empty terrain
        for (let y = 0; y < this.grid.height; y++) {
            this.terrain[y] = [];
            this.terrainArmor[y] = [];
            for (let x = 0; x < this.grid.width; x++) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.EMPTY;
                this.terrainArmor[y][x] = 0;
            }
        }
        
        // Create basic level layout
        this.createLevel();
    }
    
    // Create the game level layout
    createLevel() {
        // Add some brick walls
        this.addBrickWalls();
        
        // Add steel walls
        this.addSteelWalls();
        
        // Add water
        this.addWater();
        
        // Add trees
        this.addTrees();
        
        // Add eagle base at bottom center
        this.addEagleBase();
    }
    
    // Add brick walls to the map
    addBrickWalls() {
        // Random brick walls scattered around
        const brickPositions = [
            [3, 3], [4, 3], [5, 3],
            [9, 3], [10, 3], [11, 3],
            [2, 6], [3, 6], [4, 6],
            [10, 6], [11, 6], [12, 6],
            [1, 9], [2, 9], [3, 9],
            [11, 9], [12, 9], [13, 9]
        ];
        
        brickPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.BRICK;
                this.terrainArmor[y][x] = CONSTANTS.BRICK_ARMOR;
            }
        });
    }
    
    // Add steel walls to the map
    addSteelWalls() {
        const steelPositions = [
            [7, 1], [7, 2],
            [1, 7], [2, 7],
            [12, 7], [13, 7],
            [7, 12], [7, 13]
        ];
        
        steelPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.STEEL;
                this.terrainArmor[y][x] = CONSTANTS.STEEL_ARMOR;
            }
        });
    }
    
    // Add water to the map
    addWater() {
        const waterPositions = [
            [5, 8], [6, 8], [7, 8], [8, 8], [9, 8]
        ];
        
        waterPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.WATER;
            }
        });
    }
    
    // Add trees to the map
    addTrees() {
        const treePositions = [
            [0, 5], [1, 5], [13, 5], [14, 5],
            [6, 0], [7, 0], [8, 0]
        ];
        
        treePositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.TREES;
            }
        });
    }
    
    // Add eagle base with protective walls
    addEagleBase() {
        const eagleX = 7;
        const eagleY = 13;
        
        // Place eagle
        this.terrain[eagleY][eagleX] = CONSTANTS.TERRAIN.EAGLE;
        
        // Add protective brick walls around eagle (2 layers)
        const wallPositions = [
            // Inner layer
            [6, 12], [7, 12], [8, 12],
            [6, 13], [8, 13],
            [6, 14], [7, 14], [8, 14],
            
            // Outer layer
            [5, 11], [6, 11], [7, 11], [8, 11], [9, 11],
            [5, 12], [9, 12],
            [5, 13], [9, 13],
            [5, 14], [9, 14]
        ];
        
        wallPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y) && this.terrain[y][x] === CONSTANTS.TERRAIN.EMPTY) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.BRICK;
                this.terrainArmor[y][x] = CONSTANTS.BRICK_ARMOR;
            }
        });
    }
    
    // Get terrain type at grid position
    getTerrain(gridX, gridY) {
        if (!this.grid.isInBounds(gridX, gridY)) {
            return CONSTANTS.TERRAIN.EMPTY;
        }
        return this.terrain[gridY][gridX];
    }
    
    // Damage terrain at position
    damageTerrain(gridX, gridY, damage) {
        if (!this.grid.isInBounds(gridX, gridY)) return false;
        
        const terrainType = this.terrain[gridY][gridX];
        
        if (terrainType === CONSTANTS.TERRAIN.EAGLE) {
            this.eagleDestroyed = true;
            return true;
        }
        
        if (terrainType === CONSTANTS.TERRAIN.BRICK || terrainType === CONSTANTS.TERRAIN.STEEL) {
            this.terrainArmor[gridY][gridX] -= damage;
            
            if (this.terrainArmor[gridY][gridX] <= 0) {
                this.terrain[gridY][gridX] = CONSTANTS.TERRAIN.EMPTY;
                this.terrainArmor[gridY][gridX] = 0;
                return true; // Terrain destroyed
            }
        }
        
        return false;
    }
    
    // Render terrain
    render(ctx) {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                const terrainType = this.terrain[y][x];
                const pixelPos = this.grid.gridToPixel(x, y);
                
                this.renderTerrainTile(ctx, terrainType, pixelPos.x, pixelPos.y);
            }
        }
    }
    
    // Render a single terrain tile
    renderTerrainTile(ctx, terrainType, x, y) {
        switch (terrainType) {
            case CONSTANTS.TERRAIN.BRICK:
                this.spriteManager.drawSprite(ctx, 'brick', x, y);
                break;
            case CONSTANTS.TERRAIN.STEEL:
                this.spriteManager.drawSprite(ctx, 'steel', x, y);
                break;
            case CONSTANTS.TERRAIN.WATER:
                this.spriteManager.drawSprite(ctx, 'water1', x, y);
                break;
            case CONSTANTS.TERRAIN.TREES:
                this.spriteManager.drawSprite(ctx, 'trees', x, y);
                break;
            case CONSTANTS.TERRAIN.EAGLE:
                const eagleSprite = this.eagleDestroyed ? 'eagle_destroyed' : 'eagle';
                this.spriteManager.drawSprite(ctx, eagleSprite, x, y);
                break;
        }
    }
    
    // Update shovel effect timer
    update(deltaTime) {
        if (this.eagleWallsStrengthened) {
            this.shovelTimer -= deltaTime;
            
            if (this.shovelTimer <= 0) {
                this.restoreEagleWalls();
            }
        }
    }
    
    // Strengthen eagle walls (shovel effect)
    strengthenEagleWalls() {
        if (this.eagleWallsStrengthened) return; // Already strengthened
        
        // Store original wall positions and convert to steel
        this.originalEagleWalls = [];
        const eagleX = 7;
        const eagleY = 13;
        
        // Wall positions around eagle
        const wallPositions = [
            [6, 12], [7, 12], [8, 12],
            [6, 13], [8, 13],
            [6, 14], [7, 14], [8, 14]
        ];
        
        wallPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.originalEagleWalls.push({
                    x: x,
                    y: y,
                    terrain: this.terrain[y][x],
                    armor: this.terrainArmor[y][x]
                });
                
                this.terrain[y][x] = CONSTANTS.TERRAIN.STEEL;
                this.terrainArmor[y][x] = CONSTANTS.STEEL_ARMOR;
            }
        });
        
        this.eagleWallsStrengthened = true;
        this.shovelTimer = CONSTANTS.SHOVEL_DURATION;
    }
    
    // Restore original eagle walls
    restoreEagleWalls() {
        // Restore walls to fresh brick state (2 layers)
        const wallPositions = [
            [6, 12], [7, 12], [8, 12],
            [6, 13], [8, 13],
            [6, 14], [7, 14], [8, 14]
        ];
        
        wallPositions.forEach(([x, y]) => {
            if (this.grid.isInBounds(x, y)) {
                this.terrain[y][x] = CONSTANTS.TERRAIN.BRICK;
                this.terrainArmor[y][x] = CONSTANTS.BRICK_ARMOR;
            }
        });
        
        this.eagleWallsStrengthened = false;
        this.shovelTimer = 0;
        this.originalEagleWalls = [];
    }
}