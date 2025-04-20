/**
 * Configuration module for Vitrine Climatisation Airton ADS
 * Handles product selection and configuration logic
 */

// Configuration data (this would typically come from a backend API)
const productConfigurations = {
    'mono-split': {
        name: 'Climatiseur Mono-Split Airton',
        description: 'Climatiseur Airton avec une unité intérieure, idéal pour une pièce unique.',
        basePrice: 1290,
        options: {
            '4m': { price: 0, description: 'Liaison ReadyClim 4 mètres - Recommandée' },
            '6m': { price: 50, description: 'Liaison ReadyClim 6 mètres - Recommandée' },
            '8m': { price: 120, description: 'Liaison ReadyClim 8 mètres' },
            '10m': { price: 180, description: 'Liaison ReadyClim 10 mètres' },
            '12m': { price: 250, description: 'Liaison ReadyClim 12 mètres' }
        }
    },
    'bi-split': {
        name: 'Climatiseur Bi-Split Airton',
        description: 'Climatiseur Airton avec deux unités intérieures, idéal pour deux pièces distinctes.',
        basePrice: 1790,
        options: {
            '4m': { price: 0, description: 'Liaisons ReadyClim 4 mètres - Recommandées' },
            '6m': { price: 90, description: 'Liaisons ReadyClim 6 mètres - Recommandées' },
            '8m': { price: 220, description: 'Liaisons ReadyClim 8 mètres' },
            '10m': { price: 320, description: 'Liaisons ReadyClim 10 mètres' },
            '12m': { price: 480, description: 'Liaisons ReadyClim 12 mètres' }
        }
    },
    'tri-split': {
        name: 'Climatiseur Tri-Split Airton',
        description: 'Climatiseur Airton avec trois unités intérieures, idéal pour trois pièces distinctes.',
        basePrice: 2290,
        options: {
            '4m': { price: 0, description: 'Liaisons ReadyClim 4 mètres - Recommandées' },
            '6m': { price: 140, description: 'Liaisons ReadyClim 6 mètres - Recommandées' },
            '8m': { price: 330, description: 'Liaisons ReadyClim 8 mètres' },
            '10m': { price: 480, description: 'Liaisons ReadyClim 10 mètres' },
            '12m': { price: 690, description: 'Liaisons ReadyClim 12 mètres' }
        }
    },
    'quad-split': {
        name: 'Climatiseur Quad-Split Airton',
        description: 'Climatiseur Airton avec quatre unités intérieures, solution complète pour climatiser un logement entier.',
        basePrice: 2790,
        options: {
            '4m': { price: 0, description: 'Liaisons ReadyClim 4 mètres - Recommandées' },
            '6m': { price: 190, description: 'Liaisons ReadyClim 6 mètres - Recommandées' },
            '8m': { price: 440, description: 'Liaisons ReadyClim 8 mètres' },
            '10m': { price: 640, description: 'Liaisons ReadyClim 10 mètres' },
            '12m': { price: 880, description: 'Liaisons ReadyClim 12 mètres' }
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize configuration handlers
    initConfigHandlers();
});

/**
 * Initialize configuration form handlers
 */
function initConfigHandlers() {
    const modelSelect = document.getElementById('model-select');
    const lengthSelect = document.getElementById('length-select');
    const configDetails = document.getElementById('config-details');
    const priceValue = document.getElementById('price-value');
    const reserveButton = document.getElementById('reserve-button');
    
    if (!modelSelect || !lengthSelect || !configDetails || !priceValue || !reserveButton) {
        console.error('Configuration form elements not found.');
        return;
    }
    
    // Handle model selection change
    modelSelect.addEventListener('change', updateConfiguration);
    
    // Handle length selection change
    lengthSelect.addEventListener('change', updateConfiguration);
    
    /**
     * Update configuration details and price based on selections
     */
    function updateConfiguration() {
        const selectedModel = modelSelect.value;
        const selectedLength = lengthSelect.value;
        
        // Clear previous content
        configDetails.innerHTML = '';
        
        // If both selections are made
        if (selectedModel && selectedLength && productConfigurations[selectedModel]) {
            const modelConfig = productConfigurations[selectedModel];
            const lengthOption = modelConfig.options[selectedLength];
            
            if (lengthOption) {
                // Calculate total price
                const totalPrice = modelConfig.basePrice + lengthOption.price;
                
                // Update configuration details
                configDetails.innerHTML = `
                    <div class="config-item">
                        <h4>${modelConfig.name}</h4>
                        <p>${modelConfig.description}</p>
                    </div>
                    <div class="config-item">
                        <h4>Liaison ReadyClim</h4>
                        <p>${lengthOption.description}</p>
                    </div>
                    <div class="config-item">
                        <h4>Installation</h4>
                        <p>Installation professionnelle incluse, mise en service en 20 minutes</p>
                    </div>
                `;
                
                // Update price display
                priceValue.textContent = totalPrice.toFixed(2);
                
                // Enable reserve button
                reserveButton.removeAttribute('disabled');
                
                // Store selected configuration for reservation
                window.selectedConfiguration = {
                    model: selectedModel,
                    modelName: modelConfig.name,
                    length: selectedLength,
                    lengthDescription: lengthOption.description,
                    price: totalPrice
                };
            }
        } else {
            // Display default message if selections are incomplete
            configDetails.innerHTML = `<p>Veuillez sélectionner un modèle et une longueur de liaison pour voir les détails.</p>`;
            priceValue.textContent = '--';
            reserveButton.setAttribute('disabled', 'disabled');
            window.selectedConfiguration = null;
        }
    }
    
    // Initialize reserve button click handler
    reserveButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Scroll to reservation section
        const reservationSection = document.getElementById('reservation');
        if (reservationSection) {
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.offsetHeight : 0;
            
            window.scrollTo({
                top: reservationSection.offsetTop - headerHeight,
                behavior: 'smooth'
            });
        }
    });
}