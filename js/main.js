/**
 * Main JavaScript for Vitrine Climatisation Airton ADS
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    // Other initializations will be called from their respective scripts
});

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Smooth scroll for navigation links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const mainNav = document.querySelector('.main-nav');
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            
            // Get the target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate header height for offset
                const header = document.querySelector('.site-header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Scroll to the target with offset
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize Google Map for zone d'intervention
 * This function will be called by the Google Maps API script
 */
function initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('intervention-map');
    
    if (!mapContainer) return;
    
    // Eysines coordinates
    const eysinces = { lat: 44.8836, lng: -0.6644 };
    
    // Create the map
    const map = new google.maps.Map(mapContainer, {
        center: eysinces,
        zoom: 11,
        styles: [/* Custom map styles can be added here */]
    });
    
    // Add marker for Eysines
    const marker = new google.maps.Marker({
        position: eysinces,
        map: map,
        title: 'Eysines - Centre de notre zone d\'intervention'
    });
    
    // Add circle overlay for 30km radius
    const circle = new google.maps.Circle({
        strokeColor: '#0066cc',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0066cc',
        fillOpacity: 0.1,
        map: map,
        center: eysinces,
        radius: 30000 // 30km in meters
    });
}

/**
 * Display error message
 * @param {string} message - Error message to display
 * @param {Element} container - Container to append error to
 */
function showError(message, container) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Remove any existing error messages
    const existingErrors = container.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());
    
    // Add the new error message
    container.appendChild(errorElement);
    
    // Automatically remove after 5 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

/**
 * Display success message
 * @param {string} message - Success message to display
 * @param {Element} container - Container to append message to
 */
function showSuccess(message, container) {
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    
    // Remove any existing success messages
    const existingMessages = container.querySelectorAll('.success-message');
    existingMessages.forEach(msg => msg.remove());
    
    // Add the new success message
    container.appendChild(successElement);
    
    // Automatically remove after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}