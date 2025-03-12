/**
 * DonasiBerkat Tasikmalaya - Donation Page JavaScript
 * Contains functionality for user donations and donation form
 */

// Initialize donation page functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status and update UI
    checkAuthForDonation();
    
    // Initialize donation form and modal
    initDonationForm();
    
    // Initialize categories in form
    populateCategories();
});

/**
 * Check if user is authenticated and show appropriate content
 */
function checkAuthForDonation() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginContainer = document.getElementById('login-required-container');
    const donationList = document.getElementById('donation-list');
    
    if (isLoggedIn) {
        // User is logged in, show their donations
        if (loginContainer) loginContainer.style.display = 'none';
        if (donationList) donationList.style.display = 'block';
        
        loadUserDonations();
    } else {
        // User is not logged in, show login prompt
        if (loginContainer) loginContainer.style.display = 'block';
        if (donationList) donationList.style.display = 'none';
    }
}

/**
 * Load user's donations
 */
function loadUserDonations() {
    const userEmail = localStorage.getItem('userEmail');
    const donationsGrid = document.getElementById('my-donations');
    const noDonationsEl = document.getElementById('no-donations');
    
    if (!donationsGrid || !noDonationsEl) return;
    
    // Clear the skeleton loaders
    donationsGrid.innerHTML = '';
    
    // In a real app, we would fetch user's donations from the server
    // For demo, we'll filter featuredItems to simulate user's donations
    if (typeof featuredItems !== 'undefined' && featuredItems.length > 0) {
        // Filter items where the donor email matches current user (simulate)
        // In our mock data, we don't have emails, so we'll use the first 2 items as demo
        const userDonations = featuredItems.slice(0, 2);
        
        if (userDonations.length > 0) {
            // We have donations to display
            userDonations.forEach(item => {
                const itemCard = createDonationCard(item);
                donationsGrid.appendChild(itemCard);
            });
            noDonationsEl.style.display = 'none';
        } else {
            // No donations
            donationsGrid.innerHTML = '';
            noDonationsEl.style.display = 'block';
        }
    } else {
        // No data available
        noDonationsEl.style.display = 'block';
    }
    
    // Add tab functionality
    initTabs();
}

/**
 * Create a donation card with status and actions
 */
function createDonationCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    card.dataset.status = item.status || 'active';
    
    // Add status badge based on item status
    let statusBadge = '';
    switch (item.status) {
        case 'pending':
            statusBadge = '<span class="status-badge pending">Menunggu Persetujuan</span>';
            break;
        case 'completed':
            statusBadge = '<span class="status-badge completed">Telah Didonasikan</span>';
            break;
        default:
            statusBadge = '<span class="status-badge active">Aktif</span>';
    }
    
    card.innerHTML = `
        <div class="item-image">
            <span class="item-category">${item.category}</span>
            ${statusBadge}
            <img src="${item.image || '/assets/items/placeholder.jpg'}" alt="${item.title}" loading="lazy">
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
                <div class="item-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(item.posted)}</span>
                </div>
            </div>
            <div class="item-actions">
                <a href="./detail.html?id=${item.id}" class="btn btn-outline">Lihat Detail</a>
                <button class="btn btn-danger btn-small delete-donation" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for delete button
    const deleteBtn = card.querySelector('.delete-donation');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Apakah Anda yakin ingin menghapus donasi ini?')) {
                // In a real app, we would send a delete request to the server
                // For demo, just remove the card with animation
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                    
                    // Check if there are no more donations
                    if (document.getElementById('my-donations').children.length === 0) {
                        document.getElementById('no-donations').style.display = 'block';
                    }
                }, 300);
            }
        });
    }
    
    return card;
}

/**
 * Initialize tabs for donation filters
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const donations = document.querySelectorAll('#my-donations .item-card');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the tab to show
            const tabToShow = this.dataset.tab;
            
            // Show/hide donations based on tab
            donations.forEach(donation => {
                if (tabToShow === 'all' || donation.dataset.status === tabToShow) {
                    donation.style.display = 'block';
                } else {
                    donation.style.display = 'none';
                }
            });
            
            // Check if there are no visible donations
            const hasVisibleDonations = Array.from(donations).some(el => 
                el.style.display !== 'none'
            );
            
            document.getElementById('no-donations').style.display = 
                hasVisibleDonations ? 'none' : 'block';
        });
    });
}

/**
 * Populate category dropdowns with data from data.js
 */
function populateCategories() {
    const categorySelect = document.getElementById('item-category');
    
    if (!categorySelect || typeof categories === 'undefined') return;
    
    // Clear existing options except the first one
    while (categorySelect.options.length > 1) {
        categorySelect.remove(1);
    }
    
    // Add categories from data.js
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

/**
 * Initialize the donation form and modal
 */
function initDonationForm() {
    const openModalBtn = document.getElementById('open-donation-form');
    const modal = document.getElementById('donation-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-donation');
    const donationForm = document.getElementById('donation-form');
    const loginRequiredMessage = document.getElementById('login-required-message');
    const successModal = document.getElementById('success-modal');
    const closeSuccessBtn = document.getElementById('close-success');
    const viewDonationsBtn = document.getElementById('view-donations');
    
    if (!openModalBtn || !modal) return;
    
    // Function to open the modal
    openModalBtn.addEventListener('click', function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';  // Prevent background scrolling
        
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            // Show the donation form for logged-in users
            if (donationForm) donationForm.style.display = 'block';
            if (loginRequiredMessage) loginRequiredMessage.style.display = 'none';
        } else {
            // Show login required message for guests
            if (donationForm) donationForm.style.display = 'none';
            if (loginRequiredMessage) loginRequiredMessage.style.display = 'block';
        }
    });
    
    // Function to close the modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';  // Restore background scrolling
    }
    
    // Add close event listeners
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Close when clicking outside of modal content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Handle file inputs for image upload
    initImageUploads();
    
    // Handle "Other" location option
    initLocationSelect();
    
    // Handle character count for description
    initDescriptionCounter();
    
    // Handle form submission
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('#submit-donation');
            const buttonText = submitButton.querySelector('.btn-text');
            const buttonLoader = submitButton.querySelector('.btn-loader');
            
            // Show loading state
            buttonText.style.display = 'none';
            buttonLoader.style.display = 'inline-block';
            
            // Simulate form submission delay
            setTimeout(() => {
                // Close modal
                closeModal();
                
                // Show success modal
                if (successModal) {
                    successModal.classList.add('show');
                    
                    // Add event listeners for success modal buttons
                    if (closeSuccessBtn) {
                        closeSuccessBtn.addEventListener('click', function() {
                            successModal.classList.remove('show');
                        });
                    }
                    
                    if (viewDonationsBtn) {
                        viewDonationsBtn.addEventListener('click', function() {
                            successModal.classList.remove('show');
                            // Refresh the donations list
                            loadUserDonations();
                        });
                    }
                }
                
                // Reset form
                donationForm.reset();
                
                // Reset button state
                buttonText.style.display = 'inline';
                buttonLoader.style.display = 'none';
                
                // Reset file uploads
                resetFileUploads();
            }, 1500);
        });
    }
}

/**
 * Initialize file upload previews
 */
function initImageUploads() {
    const fileInputs = document.querySelectorAll('.file-input');
    const removeButtons = document.querySelectorAll('.remove-image');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                const previewBox = this.parentElement.querySelector('.upload-preview');
                const previewImage = previewBox.querySelector('img');
                const placeholderBox = this.parentElement.querySelector('.upload-placeholder');
                
                reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    previewBox.style.display = 'flex';
                    placeholderBox.style.display = 'none';
                };
                
                reader.readAsDataURL(this.files[0]);
            }
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.dataset.target;
            const uploadBox = document.getElementById(targetId);
            
            if (uploadBox) {
                const fileInput = uploadBox.querySelector('.file-input');
                const previewBox = uploadBox.querySelector('.upload-preview');
                const placeholderBox = uploadBox.querySelector('.upload-placeholder');
                
                // Reset file input
                if (fileInput) fileInput.value = '';
                
                // Hide preview, show placeholder
                if (previewBox) previewBox.style.display = 'none';
                if (placeholderBox) placeholderBox.style.display = 'flex';
            }
        });
    });
}

/**
 * Reset all file uploads to their initial state
 */
function resetFileUploads() {
    const uploadBoxes = document.querySelectorAll('.upload-box');
    
    uploadBoxes.forEach(box => {
        const fileInput = box.querySelector('.file-input');
        const previewBox = box.querySelector('.upload-preview');
        const placeholderBox = box.querySelector('.upload-placeholder');
        
        // Reset file input
        if (fileInput) fileInput.value = '';
        
        // Hide preview, show placeholder
        if (previewBox) previewBox.style.display = 'none';
        if (placeholderBox) placeholderBox.style.display = 'flex';
    });
}

/**
 * Handle "Other" option in location select
 */
function initLocationSelect() {
    const locationSelect = document.getElementById('item-location');
    const otherLocationGroup = document.getElementById('other-location-group');
    const otherLocationInput = document.getElementById('other-location');
    
    if (locationSelect && otherLocationGroup && otherLocationInput) {
        locationSelect.addEventListener('change', function() {
            if (this.value === 'Lainnya') {
                otherLocationGroup.style.display = 'block';
                otherLocationInput.setAttribute('required', 'required');
            } else {
                otherLocationGroup.style.display = 'none';
                otherLocationInput.removeAttribute('required');
            }
        });
    }
}

/**
 * Initialize character counter for description
 */
function initDescriptionCounter() {
    const descriptionInput = document.getElementById('item-description');
    const charCount = document.getElementById('char-count');
    
    if (descriptionInput && charCount) {
        descriptionInput.addEventListener('input', function() {
            const minLength = 50;
            const currentLength = this.value.length;
            const remaining = Math.max(0, minLength - currentLength);
            
            charCount.textContent = remaining;
            
            if (remaining > 0) {
                charCount.style.color = 'var(--color-danger)';
            } else {
                charCount.style.color = 'var(--color-success)';
                charCount.textContent = '0';
            }
        });
    }
}
