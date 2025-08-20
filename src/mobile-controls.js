// Mobile controls manager for Tank Battle 1990
class MobileControls {
    constructor(inputManager) {
        this.inputManager = inputManager;
        this.isMobile = this.detectMobile();
        this.isEnabled = false;
        this.touchActiveButtons = new Set();
        
        this.init();
    }
    
    // Detect if device is mobile
    detectMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Check for mobile patterns
        const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
        const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
        
        // Check for touch capability
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Check screen size
        const isSmallScreen = window.innerWidth <= 768;
        
        // For testing/development: also enable for small screens even without touch
        const isTestingMobile = isSmallScreen && window.innerWidth < 600;
        
        return isMobileUserAgent || (isTouchDevice && isSmallScreen) || isTestingMobile;
    }
    
    // Initialize mobile controls
    init() {
        if (!this.isMobile) {
            return;
        }
        
        this.createMobileControlsHTML();
        this.bindTouchEvents();
        this.enable();
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.updateLayout(), 100);
        });
        
        // Listen for resize events
        window.addEventListener('resize', () => this.updateLayout());
    }
    
    // Create mobile controls HTML elements
    createMobileControlsHTML() {
        // Create main controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobileControls';
        controlsContainer.className = 'mobile-controls';
        
        // Create fire button (left side)
        const fireButton = document.createElement('button');
        fireButton.id = 'mobileFireBtn';
        fireButton.className = 'mobile-fire-button';
        fireButton.setAttribute('data-action', 'fire');
        
        // Create D-pad container (right side)
        const dpadContainer = document.createElement('div');
        dpadContainer.className = 'mobile-dpad';
        
        // Create direction buttons
        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(direction => {
            const button = document.createElement('button');
            button.id = `mobile${direction.charAt(0).toUpperCase() + direction.slice(1)}Btn`;
            button.className = `mobile-direction-btn ${direction}`;
            button.setAttribute('data-action', direction);
            dpadContainer.appendChild(button);
        });
        
        // Create center area
        const dpadCenter = document.createElement('div');
        dpadCenter.className = 'mobile-dpad-center';
        dpadContainer.appendChild(dpadCenter);
        
        // Create pause button
        const pauseButton = document.createElement('button');
        pauseButton.id = 'mobilePauseBtn';
        pauseButton.className = 'mobile-pause-button';
        pauseButton.textContent = 'PAUSE';
        pauseButton.setAttribute('data-action', 'pause');
        
        // Assemble controls
        controlsContainer.appendChild(fireButton);
        controlsContainer.appendChild(dpadContainer);
        controlsContainer.appendChild(pauseButton);
        
        // Add to document
        document.body.appendChild(controlsContainer);
        
        this.controlsElement = controlsContainer;
    }
    
    // Bind touch events to mobile controls
    bindTouchEvents() {
        if (!this.controlsElement) return;
        
        // Get all interactive buttons
        const buttons = this.controlsElement.querySelectorAll('button');
        
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            // Touch start events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.handleTouchStart(action);
            }, { passive: false });
            
            // Touch end events
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            }, { passive: false });
            
            // Touch cancel events (when finger moves off button)
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.handleTouchEnd(action);
            }, { passive: false });
            
            // Prevent context menu on long press
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
            });
        });
        
        // Prevent page scrolling when touching controls
        this.controlsElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    // Handle touch start on control
    handleTouchStart(action) {
        this.touchActiveButtons.add(action);
        
        // Map actions to input manager methods
        switch (action) {
            case 'up':
                this.inputManager.keys.ArrowUp = true;
                break;
            case 'down':
                this.inputManager.keys.ArrowDown = true;
                break;
            case 'left':
                this.inputManager.keys.ArrowLeft = true;
                break;
            case 'right':
                this.inputManager.keys.ArrowRight = true;
                break;
            case 'fire':
                this.inputManager.keys[' '] = true; // Space key
                break;
            case 'pause':
                this.inputManager.keys.Escape = true;
                break;
        }
    }
    
    // Handle touch end on control
    handleTouchEnd(action) {
        this.touchActiveButtons.delete(action);
        
        // Map actions to input manager methods
        switch (action) {
            case 'up':
                this.inputManager.keys.ArrowUp = false;
                break;
            case 'down':
                this.inputManager.keys.ArrowDown = false;
                break;
            case 'left':
                this.inputManager.keys.ArrowLeft = false;
                break;
            case 'right':
                this.inputManager.keys.ArrowRight = false;
                break;
            case 'fire':
                this.inputManager.keys[' '] = false;
                break;
            case 'pause':
                this.inputManager.keys.Escape = false;
                break;
        }
    }
    
    // Enable mobile controls
    enable() {
        if (!this.isMobile || !this.controlsElement) return;
        
        this.controlsElement.classList.add('active');
        this.isEnabled = true;
    }
    
    // Disable mobile controls
    disable() {
        if (!this.controlsElement) return;
        
        this.controlsElement.classList.remove('active');
        this.isEnabled = false;
        
        // Clear all active touches
        this.touchActiveButtons.clear();
    }
    
    // Update layout for orientation changes
    updateLayout() {
        if (!this.isMobile || !this.controlsElement) return;
        
        // Force a reflow to update positions
        this.controlsElement.style.display = 'none';
        setTimeout(() => {
            this.controlsElement.style.display = 'block';
        }, 10);
    }
    
    // Check if mobile controls are available
    isAvailable() {
        return this.isMobile && this.isEnabled;
    }
    
    // Get current touch state (for debugging)
    getTouchState() {
        return {
            isMobile: this.isMobile,
            isEnabled: this.isEnabled,
            activeButtons: Array.from(this.touchActiveButtons)
        };
    }
}