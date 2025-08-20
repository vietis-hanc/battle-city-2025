// Explosion effect system for Tank Battle 1990
class Explosion {
    constructor(x, y, type, spriteManager) {
        this.x = x;
        this.y = y;
        this.type = type; // 'bullet', 'tank', 'big'
        this.active = true;
        this.frame = 0;
        this.frameTimer = 0;
        this.frameInterval = 100; // 100ms per frame
        this.maxFrames = this.getMaxFrames();
        this.spriteManager = spriteManager;
    }
    
    getMaxFrames() {
        switch (this.type) {
            case 'bullet': return 3; // bullet_explosion_1, 2, 3
            case 'tank': return 3;   // bullet_explosion_1, 2, 3 (same for tank hits)
            case 'big': return 5;    // big_explosion_1, 2, 3, 4, 5
            default: return 3;
        }
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        this.frameTimer += deltaTime;
        
        if (this.frameTimer >= this.frameInterval) {
            this.frame++;
            this.frameTimer = 0;
            
            if (this.frame >= this.maxFrames) {
                this.active = false;
            }
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        
        let spriteName;
        switch (this.type) {
            case 'bullet':
            case 'tank':
                spriteName = `bullet_explosion_${this.frame + 1}`;
                break;
            case 'big':
                spriteName = `big_explosion_${this.frame + 1}`;
                break;
            default:
                spriteName = `bullet_explosion_${this.frame + 1}`;
        }
        
        this.spriteManager.drawSprite(ctx, spriteName, this.x, this.y, CONSTANTS.TILE_SIZE, CONSTANTS.TILE_SIZE);
    }
}

class ExplosionManager {
    constructor(spriteManager) {
        this.explosions = [];
        this.spriteManager = spriteManager;
    }
    
    // Create bullet explosion (when bullet hits terrain)
    createBulletExplosion(x, y) {
        const explosion = new Explosion(x, y, 'bullet', this.spriteManager);
        this.explosions.push(explosion);
    }
    
    // Create tank explosion (when bullet hits tank)
    createTankExplosion(x, y) {
        const explosion = new Explosion(x, y, 'tank', this.spriteManager);
        this.explosions.push(explosion);
    }
    
    // Create big explosion (when eagle is destroyed)
    createBigExplosion(x, y) {
        const explosion = new Explosion(x, y, 'big', this.spriteManager);
        this.explosions.push(explosion);
    }
    
    update(deltaTime) {
        // Update all explosions
        for (const explosion of this.explosions) {
            explosion.update(deltaTime);
        }
        
        // Remove inactive explosions
        this.explosions = this.explosions.filter(explosion => explosion.active);
    }
    
    render(ctx) {
        for (const explosion of this.explosions) {
            explosion.render(ctx);
        }
    }
    
    clear() {
        this.explosions = [];
    }
}