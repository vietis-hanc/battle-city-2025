// Collision detection system for tank battle
class CollisionDetector {
    constructor(terrain, grid) {
        this.terrain = terrain;
        this.grid = grid;
    }
    
    // Check if a position is blocked by terrain
    isPositionBlocked(x, y, width = CONSTANTS.TILE_SIZE, height = CONSTANTS.TILE_SIZE) {
        // Convert to grid coordinates and check all covered tiles
        const startGridX = Math.floor(x / CONSTANTS.TILE_SIZE);
        const startGridY = Math.floor(y / CONSTANTS.TILE_SIZE);
        const endGridX = Math.floor((x + width - 1) / CONSTANTS.TILE_SIZE);
        const endGridY = Math.floor((y + height - 1) / CONSTANTS.TILE_SIZE);
        
        for (let gridY = startGridY; gridY <= endGridY; gridY++) {
            for (let gridX = startGridX; gridX <= endGridX; gridX++) {
                if (!this.grid.isInBounds(gridX, gridY)) {
                    return true; // Out of bounds is blocked
                }
                
                const terrainType = this.terrain.getTerrain(gridX, gridY);
                if (this.isTerrainBlocking(terrainType)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    // Check if terrain type blocks movement
    isTerrainBlocking(terrainType) {
        return terrainType === CONSTANTS.TERRAIN.BRICK ||
               terrainType === CONSTANTS.TERRAIN.STEEL ||
               terrainType === CONSTANTS.TERRAIN.WATER ||
               terrainType === CONSTANTS.TERRAIN.EAGLE;
    }
    
    // Check if terrain blocks bullets (water doesn't block bullets)
    isTerrainBlockingBullets(terrainType) {
        return terrainType === CONSTANTS.TERRAIN.BRICK ||
               terrainType === CONSTANTS.TERRAIN.STEEL ||
               terrainType === CONSTANTS.TERRAIN.EAGLE;
    }
    
    // Check collision between two rectangles
    checkRectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
               x1 + w1 > x2 &&
               y1 < y2 + h2 &&
               y1 + h1 > y2;
    }
    
    // Check if tank can move to new position
    canTankMoveTo(currentX, currentY, newX, newY, tankSize = CONSTANTS.TILE_SIZE) {
        // Check bounds
        if (!this.grid.isPixelInBounds(newX, newY) ||
            !this.grid.isPixelInBounds(newX + tankSize - 1, newY + tankSize - 1)) {
            return false;
        }
        
        // Check terrain collision
        return !this.isPositionBlocked(newX, newY, tankSize, tankSize);
    }
    
    // Check collision between tank and other tanks
    checkTankCollision(tank, otherTanks) {
        for (const other of otherTanks) {
            if (other === tank || !other.active) continue;
            
            if (this.checkRectCollision(
                tank.x, tank.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE,
                other.x, other.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE
            )) {
                return other;
            }
        }
        return null;
    }
    
    // Check bullet collision with terrain
    checkBulletTerrainCollision(bullet) {
        const gridPos = this.grid.pixelToGrid(bullet.x, bullet.y);
        
        if (!this.grid.isInBounds(gridPos.x, gridPos.y)) {
            return { hit: true, terrain: null };
        }
        
        const terrainType = this.terrain.getTerrain(gridPos.x, gridPos.y);
        if (this.isTerrainBlockingBullets(terrainType)) {
            return { 
                hit: true, 
                terrain: terrainType,
                gridX: gridPos.x,
                gridY: gridPos.y
            };
        }
        
        return { hit: false };
    }
    
    // Check bullet collision with tanks
    checkBulletTankCollision(bullet, tanks) {
        for (const tank of tanks) {
            if (!tank.active || tank.team === bullet.team) continue;
            
            if (this.checkRectCollision(
                bullet.x, bullet.y, 8, 8, // Bullet is smaller
                tank.x, tank.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE
            )) {
                return tank;
            }
        }
        return null;
    }
    
    // Check bullet vs bullet collision
    checkBulletCollision(bullet, otherBullets) {
        for (const other of otherBullets) {
            if (other === bullet || !other.active || other.team === bullet.team) continue;
            
            if (this.checkRectCollision(
                bullet.x, bullet.y, 8, 8,
                other.x, other.y, 8, 8
            )) {
                return other;
            }
        }
        return null;
    }
}