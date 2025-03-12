/**
 * DonasiBerkat Tasikmalaya - Donasi Edit Page JavaScript
 * Handles donation editing functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Show login required message
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('donation-form-content').style.display = 'none';
        return;
    }
    
    // Show donation form content
    document.getElementById('auth-required').style.display = 'none';
    document.getElementById('donation-form-content').style.display = 'block';
    
    // Get donation ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const donationId = parseInt(urlParams.get('id'));
    
    // Initialize the form with donation data
    initEditForm(donationId);
    
    // Add event listener for cancel button
    document.getElementById('cancel-edit').addEventListener('click', function() {
        window.location.href = 'donasi-saya.html';
    });
    
    // Add event listener for image upload
    document.getElementById('donation-images').addEventListener('change', handleImageUpload);
    
    // Add event listener for form submission
    document.getElementById('edit-donation-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEditedDonation(donationId);
    });
});

/**
 * Initialize the edit form with donation data
 * @param {number} donationId - ID of donation to edit
 */
function initEditForm(donationId) {
    // Try to get donation data from sessionStorage first
    let donation = null;
    const sessionData = sessionStorage.getItem('editDonationData');
    
    if (sessionData) {
        try {
            donation = JSON.parse(sessionData);
        } catch (e) {
            console.error('Error parsing session data:', e);
        }
    }
    
    // If not found in session, try to find in mock data
    if (!donation && typeof userDonations !== 'undefined') {
        donation = userDonations.find(d => d.id === donationId);
    }
    
    // If still not found, show error
    if (!donation) {
        document.getElementById('loading-state').style.display = 'none';
        document.getElementById('donation-not-found').style.display = 'block';
        return;
    }
    
    // Populate form fields
    document.getElementById('donation-title').value = donation.title || '';
    document.getElementById('donation-description').value = donation.description || '';
    
    // Set select fields
    setSelectValue('donation-category', donation.category);
    setSelectValue('donation-condition', donation.condition);
    setSelectValue('donation-location', donation.location);
    
    // Display existing images
    if (donation.images && donation.images.length > 0) {
        const existingImagesContainer = document.getElementById('existing-images');
        existingImagesContainer.innerHTML = '';
        
        donation.images.forEach((imageSrc, index) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-preview';
            
            const image = document.createElement('img');
            image.src = imageSrc;
            image.alt = `Donasi Image ${index + 1}`;
            
            imageWrapper.appendChild(image);
            existingImagesContainer.appendChild(imageWrapper);
        });
    }
    
    // Show the form
    document.getElementById('loading-state').style.display = 'none';
    document.getElementById('edit-donation-form').style.display = 'block';
}

/**
 * Set the value of a select element
 * @param {string} elementId - ID of select element
 * @param {string} value - Value to set
 */
function setSelectValue(elementId, value) {
    const selectElement = document.getElementById(elementId);
    
    if (selectElement && value) {
        for (let i = 0; i < selectElement.options.length; i++) {
            if (selectElement.options[i].value === value) {
                selectElement.selectedIndex = i;
                break;
            }
        }
    }
}

/**
 * Handle image file upload
 * @param {Event} event - Change event from file input
 */
function handleImageUpload(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('image-preview');
    
    // Clear previous previews
    previewContainer.innerHTML = '';
    
    // Check if files are selected
    if (files.length > 0) {
        // Limit to 3 images
        const maxFiles = Math.min(files.length, 3);
        
        for (let i = 0; i < maxFiles; i++) {
            const file = files[i];
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Ukuran file terlalu besar. Maksimal 5MB per file.');
                continue;
            }
            
            // Create image preview
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'image-preview';
            
            const image = document.createElement('img');
            const reader = new FileReader();
            
            reader.onload = function(e) {
                image.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
            image.alt = file.name;
            
            imageWrapper.appendChild(image);
            previewContainer.appendChild(imageWrapper);
        }
    }
}

/**
 * Save the edited donation
 * @param {number} donationId - ID of donation to save
 */
function saveEditedDonation(donationId) {
    // Get form values
    const title = document.getElementById('donation-title').value;
    const description = document.getElementById('donation-description').value;
    const category = document.getElementById('donation-category').value;
    const condition = document.getElementById('donation-condition').value;
    const location = document.getElementById('donation-location').value;
    
    // Validate form
    if (!title || !description || !category || !condition || !location) {
        alert('Harap isi semua field yang wajib diisi.');
        return;
    }
    
    // In real application, would send data to server
    // For demo, just simulate successful update
    
    // Show success notification
    const notification = document.getElementById('save-notification');
    notification.style.display = 'block';
    
    // Add show class for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide notification after delay
    setTimeout(() => {
        hideNotification();
    }, 3000);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', hideNotification);
    
    // After successful save, redirect back to donasi-saya.html
    setTimeout(() => {
        window.location.href = 'donasi-saya.html';
    }, 1500);
}

/**
 * Hide the notification
 */
function hideNotification() {
    const notification = document.getElementById('save-notification');
    notification.classList.remove('show');
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 300);
}
