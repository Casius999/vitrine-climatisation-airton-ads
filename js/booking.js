/**
 * Booking module for Vitrine Climatisation Airton ADS
 * Handles reservation calendar and payment processing logic
 */

// Google Calendar API key and Client ID (these should be replaced with real credentials)
const GOOGLE_API_KEY = 'YOUR_API_KEY';
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID';
const GOOGLE_CALENDAR_ID = 'YOUR_CALENDAR_ID';

// Stripe API key (this should be replaced with a real key)
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_KEY';

// Available time slots (hours)
const AVAILABLE_HOURS = [9, 10, 11, 14, 15, 16, 17];

// Store selected date and time
let selectedDateTime = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking system
    initBookingSystem();
});

/**
 * Initialize the booking system components
 */
function initBookingSystem() {
    // Check if necessary elements exist
    const calendarContainer = document.getElementById('calendar-container');
    const bookingForm = document.getElementById('booking-details-form');
    const paymentButton = document.getElementById('payment-button');
    
    if (!calendarContainer || !bookingForm || !paymentButton) {
        console.error('Booking system elements not found.');
        return;
    }
    
    // Initialize Google Calendar API
    initGoogleCalendar();
    
    // Initialize Stripe payment
    initStripePayment();
    
    // Handle form validation
    initFormValidation();
}

/**
 * Initialize Google Calendar integration for availability checking
 */
function initGoogleCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    if (!calendarContainer) return;
    
    // For demo purposes, we'll create a simple calendar interface
    // In a real implementation, this would connect to the Google Calendar API
    
    // Create date picker container
    const datePickerContainer = document.createElement('div');
    datePickerContainer.className = 'date-picker';
    
    // Get current date and set date limits (booking available for next 30 days)
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    // Create month navigation
    const monthNav = document.createElement('div');
    monthNav.className = 'month-navigation';
    
    const prevMonth = document.createElement('button');
    prevMonth.type = 'button';
    prevMonth.className = 'prev-month';
    prevMonth.innerHTML = '&laquo;';
    
    const monthDisplay = document.createElement('div');
    monthDisplay.className = 'current-month';
    
    const nextMonth = document.createElement('button');
    nextMonth.type = 'button';
    nextMonth.className = 'next-month';
    nextMonth.innerHTML = '&raquo;';
    
    monthNav.appendChild(prevMonth);
    monthNav.appendChild(monthDisplay);
    monthNav.appendChild(nextMonth);
    
    // Create calendar grid container
    const calendarGrid = document.createElement('div');
    calendarGrid.className = 'calendar-grid';
    
    // Create time slots container
    const timeSlots = document.createElement('div');
    timeSlots.className = 'time-slots';
    timeSlots.innerHTML = '<h4>Horaires Disponibles</h4><div class="slots-container"></div>';
    
    // Add all elements to the date picker
    datePickerContainer.appendChild(monthNav);
    datePickerContainer.appendChild(calendarGrid);
    datePickerContainer.appendChild(timeSlots);
    
    // Add date picker to the calendar container
    calendarContainer.innerHTML = '';
    calendarContainer.appendChild(datePickerContainer);
    
    // Current view date (start with current month)
    let currentViewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    
    // Render initial calendar
    renderCalendar(currentViewDate);
    
    // Event listener for previous month button
    prevMonth.addEventListener('click', function() {
        // Can't go back from current month
        if (currentViewDate.getMonth() === today.getMonth() && 
            currentViewDate.getFullYear() === today.getFullYear()) {
            return;
        }
        
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar(currentViewDate);
    });
    
    // Event listener for next month button
    nextMonth.addEventListener('click', function() {
        // Can't go beyond max date month
        const nextMonthDate = new Date(currentViewDate);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        
        if (nextMonthDate.getMonth() > maxDate.getMonth() && 
            nextMonthDate.getFullYear() >= maxDate.getFullYear()) {
            return;
        }
        
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        renderCalendar(currentViewDate);
    });
    
    /**
     * Render the calendar for a given month
     * @param {Date} date - Date object representing the month to render
     */
    function renderCalendar(date) {
        // Update month display
        const options = { month: 'long', year: 'numeric' };
        monthDisplay.textContent = date.toLocaleDateString('fr-FR', options);
        
        // Clear calendar grid
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        dayNames.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get first day of month and adjust for starting week on Monday (0 = Monday, 6 = Sunday)
        let firstDay = date.getDay() - 1;
        if (firstDay === -1) firstDay = 6; // Sunday becomes last day
        
        // Get number of days in month
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day empty';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add days of the month
        for (let day = 1; day <= lastDay; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'day';
            
            // Create the date for this cell
            const cellDate = new Date(date.getFullYear(), date.getMonth(), day);
            
            // Check if day is in the past or beyond max date
            if (cellDate < today || cellDate > maxDate) {
                dayCell.classList.add('disabled');
            } else {
                dayCell.classList.add('available');
                
                // Add click event to show time slots
                dayCell.addEventListener('click', function() {
                    // Remove selected class from all days
                    document.querySelectorAll('.day.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Add selected class to this day
                    dayCell.classList.add('selected');
                    
                    // Show time slots for this day
                    showTimeSlots(cellDate);
                });
            }
            
            dayCell.textContent = day;
            calendarGrid.appendChild(dayCell);
        }
    }
    
    /**
     * Show available time slots for a given date
     * @param {Date} date - Date to show time slots for
     */
    function showTimeSlots(date) {
        const slotsContainer = document.querySelector('.slots-container');
        if (!slotsContainer) return;
        
        // Clear previous slots
        slotsContainer.innerHTML = '';
        
        // In a real implementation, we would check Google Calendar for actual availability
        // For demo purposes, we'll use predefined available hours and simulate some slots being taken
        
        // Randomly mark some slots as unavailable (for demo purposes)
        const unavailableSlots = [];
        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * AVAILABLE_HOURS.length);
            unavailableSlots.push(AVAILABLE_HOURS[randomIndex]);
        }
        
        // Create time slot buttons
        AVAILABLE_HOURS.forEach(hour => {
            const slotButton = document.createElement('button');
            slotButton.type = 'button';
            slotButton.className = 'time-slot';
            
            // Format time display
            const displayTime = `${hour}:00`;
            slotButton.textContent = displayTime;
            
            // Check if slot is unavailable
            if (unavailableSlots.includes(hour)) {
                slotButton.classList.add('unavailable');
                slotButton.disabled = true;
            } else {
                // Add click handler for available slots
                slotButton.addEventListener('click', function() {
                    // Remove selected class from all slots
                    document.querySelectorAll('.time-slot.selected').forEach(el => {
                        el.classList.remove('selected');
                    });
                    
                    // Add selected class to this slot
                    slotButton.classList.add('selected');
                    
                    // Store selected date and time
                    const selectedDate = new Date(date);
                    selectedDate.setHours(hour, 0, 0, 0);
                    selectedDateTime = selectedDate;
                    
                    // Enable payment button if configuration is selected
                    checkBookingCompletion();
                });
            }
            
            slotsContainer.appendChild(slotButton);
        });
    }
}

/**
 * Initialize Stripe payment integration
 */
function initStripePayment() {
    const paymentContainer = document.getElementById('payment-form-container');
    if (!paymentContainer) return;
    
    // In a real implementation, this would integrate with Stripe.js
    // For demo purposes, we'll create a simplified payment form
    
    paymentContainer.innerHTML = `
        <div class="payment-form">
            <div class="form-group">
                <label for="card-name">Nom sur la carte</label>
                <input type="text" id="card-name" required>
            </div>
            <div class="form-group">
                <label for="card-number">Numéro de carte</label>
                <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="card-expiry">Date d'expiration</label>
                    <input type="text" id="card-expiry" placeholder="MM/AA" required>
                </div>
                <div class="form-group">
                    <label for="card-cvc">CVC</label>
                    <input type="text" id="card-cvc" placeholder="123" required>
                </div>
            </div>
            <div class="secure-payment-note">
                <img src="assets/secure-payment.svg" alt="Paiement Sécurisé">
                <p>Paiement sécurisé via Stripe. Vos informations bancaires ne sont jamais stockées sur notre serveur.</p>
            </div>
        </div>
    `;
    
    // Add event listener to payment button
    const paymentButton = document.getElementById('payment-button');
    if (paymentButton) {
        paymentButton.addEventListener('click', processPayment);
    }
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    const bookingForm = document.getElementById('booking-details-form');
    if (!bookingForm) return;
    
    // Add input event listeners to form fields
    const formInputs = bookingForm.querySelectorAll('input[required], select[required], textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('input', checkBookingCompletion);
    });
    
    // Add change listener to confirmation checkbox
    const confirmationCheck = document.getElementById('confirmation-check');
    if (confirmationCheck) {
        confirmationCheck.addEventListener('change', checkBookingCompletion);
    }
}

/**
 * Check if all required booking information is complete and enable payment button
 */
function checkBookingCompletion() {
    const paymentButton = document.getElementById('payment-button');
    if (!paymentButton) return;
    
    // Check if configuration is selected
    const hasConfiguration = window.selectedConfiguration !== null;
    
    // Check if date and time are selected
    const hasDateTime = selectedDateTime !== null;
    
    // Check if all required form fields are filled
    const bookingForm = document.getElementById('booking-details-form');
    let formComplete = true;
    
    if (bookingForm) {
        const requiredFields = bookingForm.querySelectorAll('input[required], select[required], textarea[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                formComplete = false;
            }
        });
        
        // Check confirmation checkbox
        const confirmationCheck = document.getElementById('confirmation-check');
        if (confirmationCheck && !confirmationCheck.checked) {
            formComplete = false;
        }
    } else {
        formComplete = false;
    }
    
    // Enable or disable payment button
    if (hasConfiguration && hasDateTime && formComplete) {
        paymentButton.removeAttribute('disabled');
    } else {
        paymentButton.setAttribute('disabled', 'disabled');
    }
}

/**
 * Process payment and confirm booking
 */
function processPayment() {
    // In a real implementation, this would submit the payment to Stripe
    // and handle the response accordingly
    
    // For demo purposes, simulate a successful payment
    const paymentContainer = document.querySelector('.payment-section');
    
    if (paymentContainer) {
        // Show loading state
        const originalButtonText = document.getElementById('payment-button').textContent;
        document.getElementById('payment-button').textContent = 'Traitement en cours...';
        document.getElementById('payment-button').disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Show success message
            paymentContainer.innerHTML = `
                <div class="payment-success">
                    <img src="assets/success-icon.svg" alt="Succès" class="success-icon">
                    <h3>Réservation Confirmée !</h3>
                    <p>Votre acompte de 40% a été traité avec succès.</p>
                    <div class="booking-summary">
                        <h4>Récapitulatif de votre réservation</h4>
                        <ul>
                            <li><strong>Modèle:</strong> ${window.selectedConfiguration.modelName}</li>
                            <li><strong>Liaison:</strong> ${window.selectedConfiguration.lengthDescription}</li>
                            <li><strong>Date et Heure:</strong> ${selectedDateTime.toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</li>
                            <li><strong>Prix Total:</strong> ${window.selectedConfiguration.price.toFixed(2)} €</li>
                            <li><strong>Acompte Payé:</strong> ${(window.selectedConfiguration.price * 0.4).toFixed(2)} €</li>
                            <li><strong>Reste à Payer:</strong> ${(window.selectedConfiguration.price * 0.6).toFixed(2)} €</li>
                        </ul>
                    </div>
                    <div class="installer-details">
                        <h4>Coordonnées du Technicien</h4>
                        <p><strong>Nom:</strong> Jean Dupont</p>
                        <p><strong>Téléphone:</strong> 06 12 34 56 78</p>
                        <p><strong>Email:</strong> contact@installation-climatisation.fr</p>
                    </div>
                    <p class="confirmation-note">Une confirmation a été envoyée à votre adresse email. Notre technicien vous contactera 24h avant l'intervention pour confirmer le rendez-vous.</p>
                </div>
            `;
            
            // Scroll to booking summary
            window.scrollTo({
                top: paymentContainer.offsetTop - 100,
                behavior: 'smooth'
            });
            
            // In a real implementation, we would also:
            // 1. Create the booking in Google Calendar
            // 2. Send confirmation email via Gmail API
            // 3. Store booking details in database
        }, 2000);
    }
}