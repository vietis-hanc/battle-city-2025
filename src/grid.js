// Grid system for tank battle game
class Grid {
    constructor() {
        this.width = CONSTANTS.GRID_WIDTH;
        this.height = CONSTANTS.GRID_HEIGHT;
        this.tileSize = CONSTANTS.TILE_SIZE;
    }
    
    // Convert pixel coordinates to grid coordinates
    pixelToGrid(x, y) {
        return {
            x: Math.floor(x / this.tileSize),
            y: Math.floor(y / this.tileSize)
        };
    }
    
    // Convert grid coordinates to pixel coordinates
    gridToPixel(gridX, gridY) {
        return {
            x: gridX * this.tileSize,
            y: gridY * this.tileSize
        };
    }
    
    // Snap pixel coordinates to grid
    snapToGrid(x, y) {
        const gridPos = this.pixelToGrid(x, y);
        return this.gridToPixel(gridPos.x, gridPos.y);
    }
    
    // Check if grid coordinates are within bounds
    isInBounds(gridX, gridY) {
        return gridX >= 0 && gridX < this.width && 
               gridY >= 0 && gridY < this.height;
    }
    
    // Check if pixel coordinates are within game area
    isPixelInBounds(x, y) {
        return x >= 0 && x < this.width * this.tileSize &&
               y >= 0 && y < this.height * this.tileSize;
    }
    
    // Get center of a grid cell
    getCellCenter(gridX, gridY) {
        return {
            x: gridX * this.tileSize + this.tileSize / 2,
            y: gridY * this.tileSize + this.tileSize / 2
        };
    }
    
    // Calculate distance between two grid positions
    getDistance(x1, y1, x2, y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }
    
    // Get neighboring cells
    getNeighbors(gridX, gridY) {
        const neighbors = [];
        for (let i = 0; i < 4; i++) {
            const dir = DIRECTION_VECTORS[i];
            const newX = gridX + dir.x;
            const newY = gridY + dir.y;
            if (this.isInBounds(newX, newY)) {
                neighbors.push({ x: newX, y: newY, direction: i });
            }
        }
        return neighbors;
    }
}