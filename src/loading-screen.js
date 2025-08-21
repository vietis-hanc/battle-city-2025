// Loading screen for game assets
class LoadingScreen {
    constructor() {
        this.overlay = null;
        this.progressBar = null;
        this.progressText = null;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }
    
    // Show loading screen
    show(totalAssets = 100) {
        this.totalAssets = totalAssets;
        this.loadedAssets = 0;
        
        // Create loading overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'loadingOverlay';
        this.overlay.className = 'loading-overlay';
        
        const loadingContent = document.createElement('div');
        loadingContent.className = 'loading-content';
        
        // Game title
        const title = document.createElement('div');
        title.className = 'loading-title';
        title.textContent = 'TANK BATTLE 1990';
        
        // Subtitle
        const subtitle = document.createElement('div');
        subtitle.className = 'loading-subtitle';
        subtitle.textContent = 'VietIS AI Challenge 2025';
        
        // Loading text
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'LOADING ASSETS...';
        
        // Progress bar container
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        this.progressBar.appendChild(progressFill);
        
        // Progress text
        this.progressText = document.createElement('div');
        this.progressText.className = 'progress-text';
        this.progressText.textContent = '0%';
        
        progressContainer.appendChild(this.progressBar);
        progressContainer.appendChild(this.progressText);
        
        // Assembly
        loadingContent.appendChild(title);
        loadingContent.appendChild(subtitle);
        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(progressContainer);
        
        this.overlay.appendChild(loadingContent);
        document.body.appendChild(this.overlay);
    }
    
    // Update loading progress
    updateProgress(loaded, total = null) {
        if (total) this.totalAssets = total;
        this.loadedAssets = loaded;
        
        const percentage = Math.floor((this.loadedAssets / this.totalAssets) * 100);
        
        if (this.progressText) {
            this.progressText.textContent = `${percentage}%`;
        }
        
        if (this.progressBar) {
            const progressFill = this.progressBar.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }
        }
    }
    
    // Hide loading screen
    hide() {
        if (this.overlay) {
            // Add a minimum display time for better UX
            setTimeout(() => {
                if (this.overlay) {
                    this.overlay.remove();
                    this.overlay = null;
                    this.progressBar = null;
                    this.progressText = null;
                }
            }, 1000); // Show loading screen for at least 1 second
        }
    }
}