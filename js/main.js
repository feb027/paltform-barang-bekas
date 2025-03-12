/**
 * DonasiBerkat Tasikmalaya - Main JavaScript File
 * Contains common functionality used across the entire website
 */

// Initialize base functionality when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    checkAuthentication();
    initHeaderScroll();
});

/**
 * Mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navOverlay = document.querySelector('.nav-overlay');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Close menu when clicking on overlay
        if (navOverlay) {
            navOverlay.addEventListener('click', function() {
                toggleMobileMenu(false);
            });
        }
        
        // Close menu when clicking on a menu item
        const menuItems = mainNav.querySelectorAll('a');
        menuItems.forEach(item => {
            item.addEventListener('click', function() {
                toggleMobileMenu(false);
            });
        });
        
        // Close menu when ESC key is pressed
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('show')) {
                toggleMobileMenu(false);
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && mainNav.classList.contains('show')) {
                toggleMobileMenu(false);
            }
        });
    }
    
    function toggleMobileMenu(show) {
        const mainNav = document.querySelector('.main-nav');
        const navOverlay = document.querySelector('.nav-overlay');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (show === undefined) {
            // Toggle based on current state
            mainNav.classList.toggle('show');
            if (navOverlay) navOverlay.classList.toggle('show');
            mobileMenuToggle.classList.toggle('active');
        } else if (show) {
            // Force show
            mainNav.classList.add('show');
            if (navOverlay) navOverlay.classList.add('show');
            mobileMenuToggle.classList.add('active');
        } else {
            // Force hide
            mainNav.classList.remove('show');
            if (navOverlay) navOverlay.classList.remove('show');
            mobileMenuToggle.classList.remove('active');
        }
        
        // Change icon based on menu state
        const iconElement = mobileMenuToggle.querySelector('span');
        if (iconElement) {
            if (mainNav.classList.contains('show')) {
                iconElement.className = 'fas fa-times';
            } else {
                iconElement.className = 'fas fa-bars';
            }
        }
        
        // Control body scrolling
        if (mainNav.classList.contains('show')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

/**
 * Handle header scrolling effects
 */
function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    
    if (header) {
        // Apply scrolled class when page scrolls
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        
        // Check initial scroll position
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
    }
}

/**
 * Check if user is authenticated and update UI accordingly
 */
function checkAuthentication() {
    // In a real application, this would check session/token storage
    // For now, we'll use localStorage as an example
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userActions = document.querySelector('.user-actions');
    
    if (isLoggedIn && userActions) {
        const userName = localStorage.getItem('userName') || 'Pengguna';
        const userInitial = userName.charAt(0).toUpperCase();
        const isAdmin = localStorage.getItem('userRole') === 'admin'; // Check for admin role
        
        // Replace login/register buttons with user dropdown
        userActions.innerHTML = `
            <div class="dropdown">
                <div class="dropdown-toggle">
                    <div class="user-avatar">
                        ${localStorage.getItem('userAvatar') ? 
                          `<img src="${localStorage.getItem('userAvatar')}" alt="${userName}">` : 
                          userInitial}
                    </div>
                    <span class="user-name">${userName}</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
                <div class="dropdown-menu">
                    <a href="profil.html"><i class="fas fa-user"></i> Profil Saya</a>
                    <a href="donasi-saya.html"><i class="fas fa-box-open"></i> Donasi Saya</a>
                    <a href="pesan.html"><i class="fas fa-envelope"></i> Pesan</a>
                    ${isAdmin ? `<a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard Admin</a>` : ''}
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Keluar</a>
                </div>
            </div>
        `;
        
        // Add logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Clear authentication data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userToken');
                localStorage.removeItem('userAvatar');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPhone');
                localStorage.removeItem('userAddress');
                localStorage.removeItem('userBio');
                localStorage.removeItem('userRole');
                // Reload page
                window.location.reload();
            });
        }
        
        // Show admin floating button if user is admin and not on dashboard page
        if (isAdmin && !window.location.href.includes('dashboard.html')) {
            const adminButton = document.getElementById('admin-button');
            if (adminButton) {
                adminButton.style.display = 'block';
            }
        }
    } else if (userActions) {
        // Show login/register buttons for non-authenticated users
        userActions.innerHTML = `
            <a href="login.html" class="btn btn-outline">Masuk</a>
            <a href="register.html" class="btn btn-primary">Daftar</a>
        `;
    }
}

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
function formatRupiah(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

/**
 * Format date to Indonesian format
 * @param {string} dateString - The date string to format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

/**
 * Display error message
 * @param {string} message - The error message to display
 * @param {string} containerId - ID of container to show error in
 */
function showError(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
    }
}

/**
 * Truncate text to specified length
 * @param {string} text - The text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, length) {
    if (!text) return '';
    return text.length > length ? text.substring(0, length) + '...' : text;
}
