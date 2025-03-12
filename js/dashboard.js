/**
 * DonasiBerkat Tasikmalaya - Dashboard JavaScript
 * Handles functionality for the admin dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and is an admin
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    
    if (!isLoggedIn || !isAdmin) {
        // Show access denied message
        document.getElementById('auth-required').style.display = 'flex';
        document.getElementById('dashboard-content').style.display = 'none';
        return;
    }
    
    // Show dashboard content
    document.getElementById('auth-required').style.display = 'none';
    document.getElementById('dashboard-content').style.display = 'grid';
    
    // Set admin name and avatar
    const userName = localStorage.getItem('userName') || 'Admin';
    const userAvatar = localStorage.getItem('userAvatar') || 'assets/admin-avatar.jpg';
    
    document.getElementById('admin-name').textContent = userName;
    document.getElementById('header-username').textContent = userName;
    
    const avatarElements = document.querySelectorAll('#admin-avatar, #header-avatar');
    avatarElements.forEach(avatar => {
        avatar.src = userAvatar;
        avatar.alt = userName;
    });
    
    // Initialize dashboard functionality
    initSidebar();
    initNavigation();
    initCharts();
    initLogout();
    
    // Load initial data
    updateDashboardCounts();
});

/**
 * Initialize sidebar toggle functionality
 */
function initSidebar() {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const dashboardContainer = document.querySelector('.dashboard-container');
    
    toggleBtn.addEventListener('click', function() {
        dashboardContainer.classList.toggle('expanded');
    });
}

/**
 * Initialize navigation between dashboard sections
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => {
                navLink.parentElement.classList.remove('active');
            });
            this.parentElement.classList.add('active');
            
            // Show selected section, hide others
            const sections = document.querySelectorAll('.dashboard-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const activeSection = document.getElementById(`${sectionId}-section`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            
            // Update URL hash without scrolling
            history.replaceState(null, null, `#${sectionId}`);
        });
    });
    
    // Check URL hash on load
    const hash = window.location.hash.substring(1);
    if (hash) {
        const activeLink = document.querySelector(`.sidebar-nav a[data-section="${hash}"]`);
        if (activeLink) {
            activeLink.click();
        }
    }
}

/**
 * Initialize charts for the dashboard
 */
function initCharts() {
    // Donations activity chart
    const donationsCtx = document.getElementById('donations-chart');
    if (donationsCtx) {
        new Chart(donationsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Donasi',
                    data: [12, 19, 15, 17, 22, 25, 31, 38, 42, 47, 49, 52],
                    borderColor: '#24a85b',
                    backgroundColor: 'rgba(36, 168, 91, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });
    }
    
    // Category distribution chart
    const categoryCtx = document.getElementById('category-chart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pakaian', 'Furnitur', 'Elektronik', 'Mainan', 'Buku', 'Lainnya'],
                datasets: [{
                    data: [25, 15, 20, 18, 12, 10],
                    backgroundColor: [
                        '#24a85b',
                        '#3498db',
                        '#9b59b6',
                        '#f39c12',
                        '#e74c3c',
                        '#95a5a6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

/**
 * Update dashboard counts and badges
 */
function updateDashboardCounts() {
    // Set donation badge count
    const pendingDonations = 12;  // This would come from API in real app
    document.getElementById('donations-badge').textContent = pendingDonations;
    
    // Set verification badge count
    const verificationCount = 8;  // This would come from API in real app
    document.getElementById('verification-badge').textContent = verificationCount;
}

/**
 * Initialize logout functionality
 */
function initLogout() {
    const logoutButtons = document.querySelectorAll('#admin-logout, #header-logout');
    
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userName');
            localStorage.removeItem('userToken');
            localStorage.removeItem('userAvatar');
            localStorage.removeItem('userRole');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    });
}
