// Bullet system for tank battle
class Bullet {
    constructor(x, y, direction, power, team, grid, spriteManager) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.power = power;
        this.team = team; // 'player' or 'enemy'
        this.active = true;
        this.speed = CONSTANTS.BULLET_SPEED;
        this.grid = grid;
        this.spriteManager = spriteManager;
        
        // Center bullet in tile
        this.x += (CONSTANTS.TILE_SIZE - 8) / 2;
        this.y += (CONSTANTS.TILE_SIZE - 8) / 2;
    }
    
    update() {
        if (!this.active) return;
        
        // Move bullet
        const dir = DIRECTION_VECTORS[this.direction];
        this.x += dir.x * this.speed;
        this.y += dir.y * this.speed;
        
        // Check bounds
        if (!this.grid.isPixelInBounds(this.x, this.y)) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        
        const spriteNames = ['bullet_up', 'bullet_right', 'bullet_down', 'bullet_left'];
        const spriteName = spriteNames[this.direction];
        
        this.spriteManager.drawSprite(ctx, spriteName, this.x, this.y, 8, 8);
    }
    
    // Get bullet center position
    getCenterPosition() {
        return {
            x: this.x + 4,
            y: this.y + 4
        };
    }
}

class BulletManager {
    constructor(grid, spriteManager, collisionDetector, terrain, audioManager, explosionManager) {
        this.bullets = [];
        this.grid = grid;
        this.spriteManager = spriteManager;
        this.collision = collisionDetector;
        this.terrain = terrain;
        this.audioManager = audioManager;
        this.explosionManager = explosionManager;
    }
    
    // Create a new bullet
    createBullet(x, y, direction, power, team) {
        const bullet = new Bullet(x, y, direction, power, team, this.grid, this.spriteManager);
        this.bullets.push(bullet);
        
        // Play shot sound
        if (this.audioManager) {
            this.audioManager.play('bulletShot');
        }
        
        return bullet;
    }
    
    // Update all bullets
    update(tanks) {
        for (const bullet of this.bullets) {
            if (!bullet.active) continue;
            
            bullet.update();
            
            // Check terrain collision
            const terrainHit = this.collision.checkBulletTerrainCollision(bullet);
            if (terrainHit.hit) {
                this.handleTerrainHit(bullet, terrainHit);
                continue;
            }
            
            // Check tank collision
            const tankHit = this.collision.checkBulletTankCollision(bullet, tanks);
            if (tankHit) {
                this.handleTankHit(bullet, tankHit);
                continue;
            }
            
            // Check bullet vs bullet collision
            const bulletHit = this.collision.checkBulletCollision(bullet, this.bullets);
            if (bulletHit) {
                this.handleBulletCollision(bullet, bulletHit);
                continue;
            }
        }
        
        // Remove inactive bullets
        this.bullets = this.bullets.filter(bullet => bullet.active);
    }
    
    // Handle bullet hitting terrain
    handleTerrainHit(bullet, terrainHit) {
        bullet.active = false;
        
        // Create explosion effect
        if (this.explosionManager) {
            this.explosionManager.createBulletExplosion(bullet.x - 8, bullet.y - 8);
        }
        
        // Play hit sound
        if (this.audioManager) {
            this.audioManager.play('bulletHit1');
        }
        
        if (terrainHit.terrain) {
            // Damage terrain
            const destroyed = this.terrain.damageTerrain(
                terrainHit.gridX, 
                terrainHit.gridY, 
                bullet.power
            );
            
            // Handle eagle destruction
            if (terrainHit.terrain === CONSTANTS.TERRAIN.EAGLE) {
                // Game over - eagle destroyed
                if (this.audioManager) {
                    this.audioManager.play('explosion2');
                }
                
                // Create big explosion for eagle
                if (this.explosionManager) {
                    const eaglePixelPos = this.grid.gridToPixel(terrainHit.gridX, terrainHit.gridY);
                    this.explosionManager.createBigExplosion(eaglePixelPos.x, eaglePixelPos.y);
                }
                
                return { eagleDestroyed: true };
            }
        }
        
        return null;
    }
    
    // Handle bullet hitting tank
    handleTankHit(bullet, tank) {
        bullet.active = false;
        
        // Create explosion effect on tank
        if (this.explosionManager) {
            this.explosionManager.createTankExplosion(tank.x, tank.y);
        }
        
        // Play explosion sound
        if (this.audioManager) {
            this.audioManager.play('explosion1');
        }
        
        // Damage tank
        tank.takeDamage(bullet.power);
        
        return { tankHit: tank };
    }
    
    // Handle bullet vs bullet collision
    handleBulletCollision(bullet1, bullet2) {
        // Both bullets are destroyed
        bullet1.active = false;
        bullet2.active = false;
    }
    
    // Render all bullets
    render(ctx) {
        for (const bullet of this.bullets) {
            bullet.render(ctx);
        }
    }
    
    // Get bullets by team
    getBulletsByTeam(team) {
        return this.bullets.filter(bullet => bullet.active && bullet.team === team);
    }
    
    // Clear all bullets
    clear() {
        this.bullets = [];
    }
    
    // Get active bullet count
    getActiveCount() {
        return this.bullets.filter(bullet => bullet.active).length;
    }
}