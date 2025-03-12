/**
 * DonasiBerkat Tasikmalaya - Item Detail JavaScript
 * Functionality for the item detail page
 */

// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadItemDetails();
    initContactModal();
});

/**
 * Load item details from the data using URL parameter
 */
function loadItemDetails() {
    // Get the item ID from URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');
    
    // Show loading state
    const loadingState = document.getElementById('loading-state');
    const detailContent = document.getElementById('detail-content');
    const errorState = document.getElementById('error-state');
    
    // If no ID provided, show error
    if (!itemId) {
        showErrorState();
        return;
    }
    
    // Look for the item in our mock data
    // In a real app, this would be an API call
    if (typeof featuredItems !== 'undefined') {
        const item = featuredItems.find(item => item.id == itemId);
        
        if (item) {
            // Item found, populate the page
            populateItemDetails(item);
            
            // Hide loading, show content
            loadingState.style.display = 'none';
            detailContent.style.display = 'block';
            errorState.style.display = 'none';
            
            // Load related items
            loadRelatedItems(item);
        } else {
            // Item not found
            showErrorState();
        }
    } else {
        // Data not available
        showErrorState();
    }
}

/**
 * Show error state when item is not found
 */
function showErrorState() {
    const loadingState = document.getElementById('loading-state');
    const detailContent = document.getElementById('detail-content');
    const errorState = document.getElementById('error-state');
    
    loadingState.style.display = 'none';
    detailContent.style.display = 'none';
    errorState.style.display = 'block';
}

/**
 * Populate the page with item details
 */
function populateItemDetails(item) {
    // Update page title
    document.title = `${item.title} - DonasiBerkat Tasikmalaya`;
    
    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = item.title;
    
    // Update main item information
    document.getElementById('main-image').src = item.image || './assets/items/placeholder.jpg';
    document.getElementById('main-image').alt = item.title;
    document.getElementById('item-category').textContent = item.category;
    document.getElementById('item-title').textContent = item.title;
    document.getElementById('item-condition').textContent = item.condition;
    document.getElementById('item-location').textContent = item.location;
    
    // Format and set post date
    const postedDate = formatDate(item.posted);
    document.getElementById('item-posted').textContent = postedDate;
    
    // Set description
    document.getElementById('item-description-text').innerHTML = `<p>${item.description}</p>`;
    
    // Set donor information
    const donorInitial = item.donor.charAt(0).toUpperCase();
    document.getElementById('donor-avatar').innerHTML = donorInitial;
    document.getElementById('donor-name').textContent = item.donor;
    document.getElementById('donor-location').textContent = item.location;
    
    // For demo purposes, set some mock donor stats
    document.getElementById('donor-items').textContent = Math.floor(Math.random() * 20) + 1;
    document.getElementById('donor-rating').textContent = (4 + Math.random()).toFixed(1);
}

/**
 * Load related items (similar category)
 */
function loadRelatedItems(currentItem) {
    if (typeof featuredItems === 'undefined') return;
    
    // Find items in the same category, excluding the current item
    const relatedItems = featuredItems.filter(item => 
        item.category === currentItem.category && item.id !== currentItem.id
    );
    
    const relatedItemsGrid = document.getElementById('related-items-grid');
    relatedItemsGrid.innerHTML = '';
    
    // If no related items, show message
    if (relatedItems.length === 0) {
        relatedItemsGrid.innerHTML = `
            <div class="no-items">
                <p>Tidak ada barang terkait saat ini.</p>
            </div>
        `;
        return;
    }
    
    // Show up to 3 related items
    const itemsToShow = relatedItems.slice(0, 3);
    
    // Create card for each related item
    itemsToShow.forEach(item => {
        const card = createItemCard(item);
        relatedItemsGrid.appendChild(card);
    });
}

/**
 * Create an item card element
 * @param {Object} item - The item data
 * @returns {HTMLElement} The created item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    
    card.innerHTML = `
        <div class="item-image">
            <span class="item-category">${item.category}</span>
            <img src="${item.image || './assets/items/placeholder.jpg'}" alt="${item.title}" loading="lazy">
        </div>
        <div class="item-content">
            <h3 class="item-title">
                <a href="./detail.html?id=${item.id}">${item.title}</a>
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
            <a href="./detail.html?id=${item.id}" class="btn btn-primary">Lihat Detail</a>
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
 * Initialize contact modal functionality
 */
function initContactModal() {
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const contactForm = document.getElementById('contact-form');
    const loginRequired = document.getElementById('login-required');
    
    if (!contactBtn || !contactModal) return;
    
    // Open modal when clicking contact button
    contactBtn.addEventListener('click', function() {
        contactModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Check if user is logged in to show appropriate content
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && contactForm && loginRequired) {
            loginRequired.style.display = 'none';
            contactForm.style.display = 'block';
        } else if (contactForm && loginRequired) {
            loginRequired.style.display = 'block';
            contactForm.style.display = 'none';
        }
    });
    
    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Also close when clicking outside modal content
    contactModal.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            closeModal();
        }
    });
    
    // Close when pressing Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && contactModal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // If contact form is present, add submit handler
    const messageForm = contactForm ? contactForm.querySelector('.form-control') : null;
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    
    if (messageForm && submitButton) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const message = messageForm.value.trim();
            if (!message) {
                alert('Silakan masukkan pesan untuk pendonor.');
                return;
            }
            
            // In a real app, this would send the message to a backend
            alert('Pesan Anda telah terkirim ke pendonor. Anda akan mendapat notifikasi jika pendonor membalas pesan Anda.');
            messageForm.value = '';
            closeModal();
        });
    }
    
    function closeModal() {
        contactModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scrolling
    }
}

/**
 * Share functionality using Web Share API if available
 */
document.addEventListener('DOMContentLoaded', function() {
    const shareBtn = document.querySelector('.share-btn');
    
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const title = document.title;
            const url = window.location.href;
            
            // Use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                }).then(() => {
                    console.log('Shared successfully');
                }).catch(err => {
                    console.error('Share failed:', err);
                    fallbackShare();
                });
            } else {
                fallbackShare();
            }
            
            // Fallback for browsers without Web Share API
            function fallbackShare() {
                // Create temporary input to copy URL
                const input = document.createElement('input');
                input.style.position = 'absolute';
                input.style.opacity = 0;
                input.value = url;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                
                // Show notification
                alert('Tautan telah disalin ke clipboard. Bagikan ke teman Anda!');
            }
        });
    }
});
