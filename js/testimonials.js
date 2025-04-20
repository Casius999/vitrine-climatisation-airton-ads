/**
 * Testimonials module for Vitrine Climatisation Airton ADS
 * Handles loading and display of customer reviews
 */

// Sample testimonial data (in a real implementation, this would come from an API)
const testimonials = [
    {
        name: 'Sophie Martin',
        date: '15/03/2025',
        rating: 5,
        content: 'Installation impeccable et ultra-rapide ! J\'étais impressionné de voir mon climatiseur fonctionnel en seulement 20 minutes. Le technicien était ponctuel, professionnel et m\'a parfaitement expliqué le fonctionnement. À recommander sans hésitation !',
        source: 'Allovoisin'
    },
    {
        name: 'Thomas Dubois',
        date: '02/03/2025',
        rating: 5,
        content: 'Service de grande qualité. La technologie ReadyClim est vraiment révolutionnaire, aucune manipulation de gaz et une installation très propre. Le rapport qualité-prix est excellent et le confort apporté par le climatiseur Airton est au rendez-vous.',
        source: 'Allovoisin'
    },
    {
        name: 'Marie Leclerc',
        date: '18/02/2025',
        rating: 4,
        content: 'Très satisfaite de mon installation bi-split. Le technicien a été de bon conseil pour le positionnement des unités intérieures. L\'installation a été rapide et sans surprise. Un point en moins car j\'aurais aimé plus d\'informations sur l\'entretien, mais sinon parfait !',
        source: 'Allovoisin'
    },
    {
        name: 'Pierre Moreau',
        date: '05/02/2025',
        rating: 5,
        content: 'Excellente prestation. J\'ai apprécié la réactivité et le professionnalisme. L\'installation a été effectuée exactement comme promis, en un temps record. Le système fonctionne parfaitement bien et je suis ravi de mon achat. Je recommande vivement.',
        source: 'Allovoisin'
    },
    {
        name: 'Isabelle Bernard',
        date: '22/01/2025',
        rating: 5,
        content: 'Installation impeccable de mon climatiseur mono-split. La technologie ReadyClim est vraiment un plus, aucune odeur de gaz et une mise en service très rapide. Le technicien était ponctuel et très compétent. Je suis très satisfaite du résultat !',
        source: 'Allovoisin'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize testimonials carousel
    initTestimonialsCarousel();
});

/**
 * Initialize the testimonials carousel
 */
function initTestimonialsCarousel() {
    const carouselContainer = document.querySelector('.testimonials-carousel');
    if (!carouselContainer) return;
    
    // Clear placeholder
    carouselContainer.innerHTML = '';
    
    // Create carousel structure
    const carousel = document.createElement('div');
    carousel.className = 'carousel';
    
    const carouselTrack = document.createElement('div');
    carouselTrack.className = 'carousel-track';
    
    // Create testimonial slides
    testimonials.forEach(testimonial => {
        const slide = createTestimonialSlide(testimonial);
        carouselTrack.appendChild(slide);
    });
    
    // Create carousel navigation
    const carouselNav = document.createElement('div');
    carouselNav.className = 'carousel-nav';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-prev';
    prevButton.innerHTML = '&laquo;';
    prevButton.setAttribute('aria-label', 'Avis précédent');
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-next';
    nextButton.innerHTML = '&raquo;';
    nextButton.setAttribute('aria-label', 'Avis suivant');
    
    const indicators = document.createElement('div');
    indicators.className = 'carousel-indicators';
    
    // Create indicators for each testimonial
    testimonials.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.className = 'carousel-indicator';
        indicator.setAttribute('aria-label', `Avis ${index + 1}`);
        indicator.dataset.index = index;
        
        // Set first indicator as active
        if (index === 0) indicator.classList.add('active');
        
        // Add click event to jump to specific slide
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        
        indicators.appendChild(indicator);
    });
    
    // Add navigation to carousel
    carouselNav.appendChild(prevButton);
    carouselNav.appendChild(indicators);
    carouselNav.appendChild(nextButton);
    
    // Add all elements to carousel
    carousel.appendChild(carouselTrack);
    carousel.appendChild(carouselNav);
    
    // Add carousel to container
    carouselContainer.appendChild(carousel);
    
    // Initialize carousel state
    let currentSlide = 0;
    const slideWidth = 100; // Using percentage for responsive design
    const totalSlides = testimonials.length;
    
    // Set initial position
    updateCarousel();
    
    // Add event listeners for navigation
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    
    // Add autoplay
    let autoplayTimer = setInterval(nextSlide, 5000);
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayTimer);
    });
    
    // Resume autoplay on mouse leave
    carousel.addEventListener('mouseleave', () => {
        autoplayTimer = setInterval(nextSlide, 5000);
    });
    
    /**
     * Go to previous slide
     */
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }
    
    /**
     * Go to next slide
     */
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }
    
    /**
     * Go to a specific slide
     * @param {number} index - Slide index to go to
     */
    function goToSlide(index) {
        currentSlide = index;
        updateCarousel();
    }
    
    /**
     * Update carousel position and indicators
     */
    function updateCarousel() {
        // Update track position
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update indicators
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }
}

/**
 * Create a testimonial slide element
 * @param {Object} testimonial - Testimonial data
 * @returns {HTMLElement} - Testimonial slide element
 */
function createTestimonialSlide(testimonial) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    
    // Create testimonial card
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    
    // Create header with name, date and rating
    const header = document.createElement('div');
    header.className = 'testimonial-header';
    
    const nameDate = document.createElement('div');
    nameDate.className = 'testimonial-name-date';
    
    const name = document.createElement('h3');
    name.className = 'testimonial-name';
    name.textContent = testimonial.name;
    
    const date = document.createElement('span');
    date.className = 'testimonial-date';
    date.textContent = testimonial.date;
    
    nameDate.appendChild(name);
    nameDate.appendChild(date);
    
    const rating = document.createElement('div');
    rating.className = 'testimonial-rating';
    
    // Create star rating
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = i <= testimonial.rating ? 'star filled' : 'star';
        star.innerHTML = '★';
        rating.appendChild(star);
    }
    
    header.appendChild(nameDate);
    header.appendChild(rating);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'testimonial-content';
    content.textContent = testimonial.content;
    
    // Create source
    const source = document.createElement('div');
    source.className = 'testimonial-source';
    source.textContent = `Source: ${testimonial.source}`;
    
    // Add all elements to card
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(source);
    
    // Add card to slide
    slide.appendChild(card);
    
    return slide;
}