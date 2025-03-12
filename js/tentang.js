/**
 * DonasiBerkat Tasikmalaya - About Us JavaScript
 * Contains functionality for the about us page
 */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initTeamInteractions();
});

/**
 * Initialize contact form functionality
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real application, we would send this data to a server
            // For demo purposes, we'll just show a success message
            
            // Reset the form
            contactForm.reset();
            
            // Show success message (you could enhance this with a proper notification component)
            alert('Terima kasih! Pesan Anda telah terkirim. Kami akan merespon secepatnya.');
        });
    }
}

/**
 * Initialize team member interaction effects
 */
function initTeamInteractions() {
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        // Add staggered animation delays for initial load
        const index = Array.from(teamMembers).indexOf(member);
        member.style.animationDelay = `${index * 0.1}s`;
        member.style.animationName = 'fadeInUp';
        member.style.animationDuration = '0.8s';
        member.style.animationFillMode = 'backwards';
    });
}

/**
 * Animate section elements when they come into view
 */
function initScrollAnimations() {
    const sections = document.querySelectorAll('.about-card, .vision-card, .mission-card');
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
}

// On page load, initialize the page-specific animations
window.addEventListener('load', function() {
    // Add a class to the body to trigger page transition animations
    document.body.classList.add('page-loaded');
    
    // Init scroll animations if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        initScrollAnimations();
    }
});
