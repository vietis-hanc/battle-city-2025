// Audio system for Tank Battle 1990
class AudioManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.5;
        this.loadAllSounds();
    }

    // Load all game sounds
    async loadAllSounds() {
        const soundFiles = {
            bulletShot: 'sound/bullet_shot.ogg',
            bulletHit1: 'sound/bullet_hit_1.ogg',
            bulletHit2: 'sound/bullet_hit_2.ogg',
            explosion1: 'sound/explosion_1.ogg',
            explosion2: 'sound/explosion_2.ogg',
            gameOver: 'sound/game_over.ogg',
            pause: 'sound/pause.ogg',
            powerupAppear: 'sound/powerup_appear.ogg',
            powerupPick: 'sound/powerup_pick.ogg',
            stageStart: 'sound/stage_start.ogg',
            statistics: 'sound/statistics_1.ogg'
        };

        for (const [key, path] of Object.entries(soundFiles)) {
            try {
                this.sounds[key] = new Audio(path);
                this.sounds[key].volume = this.volume;
                this.sounds[key].preload = 'auto';
            } catch (error) {
                console.warn(`Failed to load sound: ${path}`, error);
            }
        }
    }

    // Play a sound effect
    play(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        try {
            const sound = this.sounds[soundName].cloneNode();
            sound.volume = this.volume;
            sound.play().catch(e => console.warn('Audio play failed:', e));
        } catch (error) {
            console.warn(`Failed to play sound: ${soundName}`, error);
        }
    }

    // Set volume for all sounds
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        for (const sound of Object.values(this.sounds)) {
            sound.volume = this.volume;
        }
    }

    // Toggle audio on/off
    toggle() {
        this.enabled = !this.enabled;
    }

    // Stop all playing sounds
    stopAll() {
        for (const sound of Object.values(this.sounds)) {
            sound.pause();
            sound.currentTime = 0;
        }
    }
}