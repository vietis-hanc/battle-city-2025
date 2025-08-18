// Sprite management for tank battle game
class SpriteManager {
    constructor() {
        this.sprites = new Map();
        this.loaded = false;
        this.loadQueue = [];
        this.loadedCount = 0;
    }
    
    // Load a sprite image
    loadSprite(name, path) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.sprites.set(name, img);
                this.loadedCount++;
                resolve(img);
            };
            img.onerror = reject;
            img.src = path;
        });
    }
    
    // Load all required sprites
    async loadAllSprites() {
        const spriteDefinitions = [
            // Player tank sprites
            ['player_up_t1', 'images/tank_player1_up_c0_t1.png'],
            ['player_up_t2', 'images/tank_player1_up_c0_t2.png'],
            ['player_down_t1', 'images/tank_player1_down_c0_t1.png'],
            ['player_down_t2', 'images/tank_player1_down_c0_t2.png'],
            ['player_left_t1', 'images/tank_player1_left_c0_t1.png'],
            ['player_left_t2', 'images/tank_player1_left_c0_t2.png'],
            ['player_right_t1', 'images/tank_player1_right_c0_t1.png'],
            ['player_right_t2', 'images/tank_player1_right_c0_t2.png'],
            
            // Enemy tank sprites
            ['basic_up_t1', 'images/tank_basic_up_c0_t1.png'],
            ['basic_up_t2', 'images/tank_basic_up_c0_t2.png'],
            ['basic_down_t1', 'images/tank_basic_down_c0_t1.png'],
            ['basic_down_t2', 'images/tank_basic_down_c0_t2.png'],
            ['basic_left_t1', 'images/tank_basic_left_c0_t1.png'],
            ['basic_left_t2', 'images/tank_basic_left_c0_t2.png'],
            ['basic_right_t1', 'images/tank_basic_right_c0_t1.png'],
            ['basic_right_t2', 'images/tank_basic_right_c0_t2.png'],
            
            ['armor_up_t1', 'images/tank_armor_up_c0_t1.png'],
            ['armor_up_t2', 'images/tank_armor_up_c0_t2.png'],
            ['armor_down_t1', 'images/tank_armor_down_c0_t1.png'],
            ['armor_down_t2', 'images/tank_armor_down_c0_t2.png'],
            ['armor_left_t1', 'images/tank_armor_left_c0_t1.png'],
            ['armor_left_t2', 'images/tank_armor_left_c0_t2.png'],
            ['armor_right_t1', 'images/tank_armor_right_c0_t1.png'],
            ['armor_right_t2', 'images/tank_armor_right_c0_t2.png'],
            
            // Terrain sprites
            ['brick', 'images/wall_brick.png'],
            ['steel', 'images/wall_steel.png'],
            ['water1', 'images/water_1.png'],
            ['water2', 'images/water_2.png'],
            ['trees', 'images/trees.png'],
            ['eagle', 'images/base.png'],
            ['eagle_destroyed', 'images/base_destroyed.png'],
            
            // Bullet sprites
            ['bullet_up', 'images/bullet_up.png'],
            ['bullet_down', 'images/bullet_down.png'],
            ['bullet_left', 'images/bullet_left.png'],
            ['bullet_right', 'images/bullet_right.png'],
            
            // Powerup sprites
            ['star', 'images/powerup_star.png'],
            ['shovel', 'images/powerup_shovel.png'],
            
            // Effect sprites
            ['explosion1', 'images/big_explosion_1.png'],
            ['explosion2', 'images/big_explosion_2.png'],
            ['explosion3', 'images/big_explosion_3.png']
        ];
        
        const promises = spriteDefinitions.map(([name, path]) => 
            this.loadSprite(name, path)
        );
        
        await Promise.all(promises);
        this.loaded = true;
    }
    
    // Get a sprite by name
    getSprite(name) {
        return this.sprites.get(name);
    }
    
    // Check if sprites are loaded
    isLoaded() {
        return this.loaded;
    }
    
    // Draw a sprite at specified position
    drawSprite(ctx, spriteName, x, y, width = CONSTANTS.TILE_SIZE, height = CONSTANTS.TILE_SIZE) {
        const sprite = this.getSprite(spriteName);
        if (sprite) {
            ctx.drawImage(sprite, x, y, width, height);
        }
    }
}