/**
 * DonasiBerkat Tasikmalaya - Homepage JavaScript File
 * Contains functionality specific to the homepage
 */

// Initialize all homepage functionality when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedItems();
    initTestimonialSlider();
    initStatisticsCounter();
});

/**
 * Load featured items from data.js and display them in the featured items grid
 */
function loadFeaturedItems() {
    const itemsGrid = document.querySelector('.items-grid');
    
    if (!itemsGrid) return;
    
    // Clear the skeleton loaders
    itemsGrid.innerHTML = '';
    
    if (featuredItems && featuredItems.length > 0) {
        // Sort items by date (newest first)
        const sortedItems = [...featuredItems].sort((a, b) => 
            new Date(b.posted) - new Date(a.posted)
        );
        
        // Only display the 3 newest items
        const recentItems = sortedItems.slice(0, 4);
        
        // Display the items
        recentItems.forEach(item => {
            const itemCard = createItemCard(item);
            itemsGrid.appendChild(itemCard);
        });
    } else {
        // No items to display or data fetch error
        itemsGrid.innerHTML = `
            <div class="no-items">
                <i class="fas fa-box-open fa-3x" style="color: var(--color-gray-400); margin-bottom: var(--spacing-md);"></i>
                <h3>Belum Ada Barang</h3>
                <p>Saat ini belum ada barang donasi yang tersedia.</p>
            </div>
        `;
    }
}

/**
 * Create an item card element
 * @param {Object} item - The item data
 * @returns {HTMLElement} The created item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    // Create the card HTML with improved structure
    card.innerHTML = `
        <div class="item-image">
            <span class="item-category">${item.category}</span>
            <img src="${item.image || '/assets/items/placeholder.jpg'}" alt="${item.title}" loading="lazy">
        </div>
        <div class="item-content">
            <h3 class="item-title">
                <a href="/detail.html?id=${item.id}">${item.title}</a>
            </h3>
            <div class="item-condition">${item.condition}</div>
            <div class="item-details">
                <div class="item-location">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${item.location}</span>
                </div>
                <div class="item-donor">
                    <i class="fas fa-user"></i>
                    <span>${item.donor}</span>
                </div>
            </div>
            <a href="/detail.html?id=${item.id}" class="btn btn-primary">Lihat Detail</a>
        </div>
    `;
    
    // Add click event for the entire card (except the button)
    card.addEventListener('click', function(e) {
        // If the click is on the button or a link, don't do anything
        if (e.target.closest('.btn') || e.target.closest('a')) return;
        
        window.location.href = `/detail.html?id=${item.id}`;
    });
    
    return card;
}

/**
 * Initialize the testimonial slider
 */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonial-slider');
    const prevBtn = document.querySelector('.slider-controls .prev');
    const nextBtn = document.querySelector('.slider-controls .next');
    
    if (!slider || !prevBtn || !nextBtn) return;
    
    // Check if we need to add testimonials from data.js
    const existingTestimonials = slider.querySelectorAll('.testimonial');
    
    // If there are already testimonials in the HTML and no data in testimonialData,
    // or testimonialData is not defined, use the existing ones
    if (existingTestimonials.length > 0 && 
        (typeof testimonialData === 'undefined' || testimonialData.length === 0)) {
        // Use existing testimonials
    } 
    // Otherwise, if we have data to display, replace existing testimonials
    else if (typeof testimonialData !== 'undefined' && testimonialData.length > 0) {
        // Clear the default testimonials
        slider.innerHTML = '';
        
        // Add all testimonials from data
        testimonialData.forEach(testimonial => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial';
            testimonialElement.innerHTML = `
                <div class="quote">${testimonial.quote}</div>
                <div class="author">${testimonial.author}</div>
            `;
            slider.appendChild(testimonialElement);
        });
    }
    
    // Variables to track current slide and animation state
    let currentSlide = 0;
    let isAnimating = false;
    const testimonials = slider.querySelectorAll('.testimonial');
    const totalSlides = testimonials.length;
    
    if (totalSlides <= 1) {
        // Hide controls if there's only one testimonial
        document.querySelector('.slider-controls').style.display = 'none';
        return;
    }
    
    // Set initial position of slides
    testimonials.forEach((slide, index) => {
        slide.style.transform = `translateX(${index * 100}%)`;
    });
    
    // Function to go to a specific slide
    function goToSlide(index) {
        if (isAnimating || index === currentSlide) return;
        
        isAnimating = true;
        
        // Ensure the index is within bounds
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        
        // Move each slide to its new position
        testimonials.forEach((slide, i) => {
            const position = (i - index) * 100;
            slide.style.transition = 'transform 0.5s ease';
            slide.style.transform = `translateX(${position}%)`;
        });
        
        // Update the current slide
        currentSlide = index;
        
        // Reset animation flag after transition completes
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    // Add click handlers for the controls
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    
    // Auto-advance the slider every 5 seconds
    let autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 5000);
    
    // Pause auto-advance when hovering over the slider
    slider.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    slider.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(() => goToSlide(currentSlide + 1), 5000);
    });
}

/**
 * Initialize counter animation for statistics section
 */
function initStatisticsCounter() {
    const statsSection = document.querySelector('.statistics');
    
    if (!statsSection) return;
    
    // Check if we need to create the stats section (not in the HTML)
    if (!statsSection.querySelector('.stats-container')) {
        // Create the stats container from data.js
        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        
        statsData.forEach(stat => {
            statsContainer.innerHTML += `
                <div class="stat-item">
                    <div class="stat-number" data-target="${stat.value}">0</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `;
        });
        
        statsSection.querySelector('.container').appendChild(statsContainer);
    }
    
    // Setup Intersection Observer to start animation when section is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start the counter animation
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    
                    // Animation duration in milliseconds
                    const duration = 2000;
                    const startTime = Date.now();
                    
                    // Animate the counter
                    function updateCounter() {
                        const currentTime = Date.now();
                        const elapsedTime = currentTime - startTime;
                        
                        if (elapsedTime < duration) {
                            const progress = elapsedTime / duration;
                            const current = Math.floor(target * progress);
                            counter.textContent = current.toLocaleString();
                            
                            // Continue the animation
                            requestAnimationFrame(updateCounter);
                        } else {
                            // Animation complete
                            counter.textContent = target.toLocaleString();
                        }
                    }
                    
                    // Start the animation
                    updateCounter();
                });
                
                // Stop observing once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Start observing the stats section
    observer.observe(statsSection);
}
