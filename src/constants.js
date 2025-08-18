// Game constants for Tank Battle 1990
const CONSTANTS = {
    // Grid and display
    TILE_SIZE: 32,
    GRID_WIDTH: 15,
    GRID_HEIGHT: 15,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Game timing
    GAME_TIME_LIMIT: 180000, // 3 minutes in milliseconds
    FRAME_RATE: 60,
    
    // Player settings
    PLAYER_LIVES: 3,
    PLAYER_HEALTH: 3,
    PLAYER_MAX_POWER: 3,
    PLAYER_SPEED: 2, // pixels per frame
    
    // Enemy settings
    TOTAL_ENEMIES: 20,
    MAX_ENEMIES_ON_SCREEN: 4,
    BASIC_TANK_COUNT: 10,
    ARMORED_TANK_COUNT: 10,
    ENEMY_SPEED: 1,
    
    // Bullet settings
    BULLET_SPEED: 4,
    
    // Powerup settings
    STAR_COUNT: 3,
    SHOVEL_COUNT: 2,
    SHOVEL_DURATION: 20000, // 20 seconds
    
    // Scoring
    SCORE_BASIC_TANK: 100,
    SCORE_ARMORED_TANK: 200,
    SCORE_POWERUP: 50,
    
    // Terrain armor values
    BRICK_ARMOR: 1,
    STEEL_ARMOR: 3,
    
    // Directions
    DIRECTIONS: {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3
    },
    
    // Terrain types
    TERRAIN: {
        EMPTY: 0,
        BRICK: 1,
        STEEL: 2,
        WATER: 3,
        TREES: 4,
        EAGLE: 5
    },
    
    // Tank types
    TANK_TYPES: {
        PLAYER: 'player',
        BASIC_ENEMY: 'basic',
        ARMORED_ENEMY: 'armored'
    },
    
    // Game states
    GAME_STATES: {
        MENU: 'menu',
        PLAYING: 'playing',
        PAUSED: 'paused',
        GAME_OVER: 'gameOver',
        VICTORY: 'victory'
    }
};

// Movement vectors for each direction
const DIRECTION_VECTORS = [
    { x: 0, y: -1 }, // UP
    { x: 1, y: 0 },  // RIGHT
    { x: 0, y: 1 },  // DOWN
    { x: -1, y: 0 }  // LEFT
];

// Input key codes
const KEYS = {
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    SPACE: ' ',
    ENTER: 'Enter',
    ESCAPE: 'Escape'
};