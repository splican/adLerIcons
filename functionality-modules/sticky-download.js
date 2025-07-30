class StickyDownloadManager {
    constructor() {
        this.stickyContainer = document.getElementById('sticky-download-container');
        this.stickyCountElement = document.getElementById('sticky-selection-count');
        this.stickyButton = document.getElementById('sticky-download-btn');
        this.isVisible = false;
        this.scrollThreshold = 200; // Pixel ab denen der Button erscheint
        
        this.init();
    }

    init() {
        if (!this.stickyContainer) return;
        
        // Scroll-Event Listener
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Intersection Observer für bessere Performance
        this.setupIntersectionObserver();
        
        // Initial hide
        this.hide();
    }

    setupIntersectionObserver() {
        // Beobachte die Original-Download-Buttons
        const originalDownloadSection = document.querySelector('.download-buttons-section');
        
        if (!originalDownloadSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && this.hasSelectedIcons()) {
                    this.show();
                } else if (entry.isIntersecting) {
                    this.hide();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '-50px 0px 0px 0px'
        });

        observer.observe(originalDownloadSection);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > this.scrollThreshold && this.hasSelectedIcons() && !this.isVisible) {
            this.show();
        } else if ((scrollTop <= this.scrollThreshold || !this.hasSelectedIcons()) && this.isVisible) {
            this.hide();
        }
    }

    hasSelectedIcons() {
        return typeof selectedIcons !== 'undefined' && selectedIcons.size > 0;
    }

    show() {
        if (!this.stickyContainer || this.isVisible) return;
        
        this.stickyContainer.classList.add('visible');
        document.body.classList.add('sticky-download-active');
        this.isVisible = true;
        
        // Update content
        this.updateContent();
    }

    hide() {
        if (!this.stickyContainer || !this.isVisible) return;
        
        this.stickyContainer.classList.remove('visible');
        document.body.classList.remove('sticky-download-active');
        this.isVisible = false;
    }

    updateContent() {
        if (!this.hasSelectedIcons()) {
            this.hide();
            return;
        }

        const selectedCount = selectedIcons.size;
        
        // Update counter
        if (this.stickyCountElement) {
            this.stickyCountElement.textContent = selectedCount;
        }
        
        // Update button state
        if (this.stickyButton) {
            this.stickyButton.disabled = selectedCount === 0;
        }
        
        // Show if not visible and has selections
        if (selectedCount > 0 && !this.isVisible && window.pageYOffset > this.scrollThreshold) {
            this.show();
        }
    }

    // Public method to update from external sources
    update() {
        this.updateContent();
    }

    // Zusätzliche Methoden für die StickyDownloadManager Klasse:

    // Smooth scroll zu den Original-Buttons
    scrollToOriginal() {
        const originalSection = document.querySelector('.download-buttons-section');
        if (originalSection) {
            originalSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Progress-Anzeige während Download
    showDownloadProgress() {
        if (this.stickyButton) {
            this.stickyButton.innerHTML = '<span>⏳ Herunterladen...</span>';
            this.stickyButton.disabled = true;
        }
    }

    resetDownloadButton() {
        if (this.stickyButton) {
            const span = this.stickyButton.querySelector('span');
            if (span) {
                span.setAttribute('data-translate', 'download_selected');
                span.textContent = translations[currentLanguage].download_selected;
            }
            this.stickyButton.disabled = !this.hasSelectedIcons();
        }
    }

    // Keyboard accessibility
    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            // ESC zum Ausblenden
            if (e.key === 'Escape' && this.isVisible) {
                this.scrollToOriginal();
            }
            
            // Ctrl/Cmd + Enter für Download
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && this.hasSelectedIcons()) {
                downloadSelectedIcons();
            }
        });
    }
}

// Initialize Sticky Download Manager
let stickyDownloadManager;

document.addEventListener('DOMContentLoaded', () => {
    stickyDownloadManager = new StickyDownloadManager();
});

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.stickyDownloadManager = stickyDownloadManager;
}