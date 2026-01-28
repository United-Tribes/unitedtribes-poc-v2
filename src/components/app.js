// Main Application Controller

class App {
    constructor() {
        this.currentView = 'universe';
        this.init();
    }

    init() {
        // Navigation handlers
        this.setupNavigation();

        console.log('UnitedTribes POC v2 initialized');
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Get the view name from the nav label
                const label = item.querySelector('.nav-label').textContent.toLowerCase();

                // TODO: Switch views based on navigation
                console.log('Navigating to:', label);
            });
        });
    }

    // TODO: View switching logic
    // TODO: State management
    // TODO: API integration setup
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
