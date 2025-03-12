/**
 * DonasiBerkat Tasikmalaya - Donation Guide JavaScript
 * Contains functionality for the donation guide page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize accordion functionality
    initAccordion();
    
    // Add smooth scrolling for internal links
    initSmoothScroll();
});

/**
 * Initialize accordion functionality
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    if (!accordionItems.length) return;
    
    // Add click event to each accordion header
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        if (header) {
            header.addEventListener('click', function() {
                // Toggle active class on the item
                const isActive = item.classList.contains('active');
                
                // Close all items first (optional - for single open accordion)
                accordionItems.forEach(accItem => {
                    accItem.classList.remove('active');
                });
                
                // If it wasn't active before, open it
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
    
    // Open the first accordion item by default
    if (accordionItems.length > 0 && !window.location.hash) {
        accordionItems[0].classList.add('active');
    }
}

/**
 * Initialize smooth scrolling for in-page links
 */
function initSmoothScroll() {
    // Get all links that have an href starting with #
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's just "#" or if the target doesn't exist
            if (targetId === '#' || !document.querySelector(targetId)) return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            const headerOffset = 80; // Adjust this value based on your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
    
    // Check for hash in URL on page load
    if (window.location.hash) {
        setTimeout(function() {
            const targetId = window.location.hash;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // If target is an accordion item, open it
                const parentAccordion = targetElement.closest('.accordion-item');
                if (parentAccordion) {
                    parentAccordion.classList.add('active');
                }
            }
        }, 100);
    }
}

/**
 * Track which guide sections have been seen (optional for analytics)
 */
function trackSectionViews() {
    const sections = document.querySelectorAll('.guide-section');
    
    if (!sections.length) return;
    
    // Create an Intersection Observer to detect when sections come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Here you would normally track the view with analytics
                console.log('Section viewed:', sectionId);
                
                // Stop observing this section (we only need to track the first view)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Section is considered 'viewed' when 50% visible
    });
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}
