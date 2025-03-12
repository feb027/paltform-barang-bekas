/**
 * DonasiBerkat Tasikmalaya - Footer JavaScript
 * Functionality for the footer section
 */

document.addEventListener('DOMContentLoaded', function() {
    initGoToTopButton();
    initNewsletterForm();
    initFooterYear();
});

/**
 * Initialize Go to Top button functionality
 */
function initGoToTopButton() {
    const goTopButton = document.querySelector('.go-top');
    
    if (goTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                goTopButton.classList.add('show');
            } else {
                goTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        goTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // In a real application, this would send the data to a server
                alert('Terima kasih telah berlangganan newsletter kami!');
                emailInput.value = '';
            } else {
                alert('Mohon masukkan alamat email yang valid.');
            }
        });
    }
}

/**
 * Simple email validation
 * @param {string} email - Email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Set current year in the copyright text
 */
function initFooterYear() {
    const yearElement = document.getElementById('current-year');
    
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
