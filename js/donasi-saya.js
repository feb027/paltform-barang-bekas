/**
 * DonasiBerkat Tasikmalaya - Donasi Saya Page JavaScript
 * Handles functionality for the "Donasi Saya" page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Show login required message
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('my-donations-content').style.display = 'none';
    } else {
        // Show my donations content
        document.getElementById('auth-required').style.display = 'none';
        document.getElementById('my-donations-content').style.display = 'block';
        
        // Initialize my donations functionality
        initMyDonations();
    }
    
    // Initialize modal close buttons
    initModalControls();
});

/**
 * Initialize the "Donasi Saya" page with user data
 */
function initMyDonations() {
    // Load user donations from localStorage (in a real app, this would come from an API)
    const userDonations = getMockDonations();
    
    // Populate donation statistics
    updateDonationStatistics(userDonations);
    
    // Populate donations list
    populateDonationsList(userDonations);
    
    // Add event listeners for filter tabs
    initFilterTabs();
    
    // Add event listener for search
    initSearch();
}

/**
 * Update donation statistics
 * @param {Array} donations - Array of user donations
 */
function updateDonationStatistics(donations) {
    const totalDonations = donations.length;
    const activeDonations = donations.filter(d => d.status === 'active').length;
    const pendingDonations = donations.filter(d => d.status === 'pending').length;
    const completedDonations = donations.filter(d => d.status === 'completed').length;
    
    document.getElementById('total-donations').textContent = totalDonations;
    document.getElementById('active-donations').textContent = activeDonations;
    document.getElementById('pending-donations').textContent = pendingDonations;
    document.getElementById('completed-donations').textContent = completedDonations;
}

/**
 * Populate donations list
 * @param {Array} donations - Array of user donations
 */
function populateDonationsList(donations) {
    const donationsList = document.getElementById('donations-list');
    const loadingState = donationsList.querySelector('.loading-state');
    const emptyState = donationsList.querySelector('.empty-state');
    
    // Remove loading state
    if (loadingState) loadingState.remove();
    
    if (donations.length > 0) {
        // Create donation items
        const donationItemsHtml = donations.map(donation => createDonationItemHtml(donation)).join('');
        
        // Insert donation items
        if (emptyState) {
            emptyState.insertAdjacentHTML('beforebegin', donationItemsHtml);
            emptyState.style.display = 'none';
        } else {
            donationsList.innerHTML = donationItemsHtml;
        }
        
        // Add event listeners for donation actions
        initDonationActions();
    } else {
        // Show empty state
        if (emptyState) emptyState.style.display = 'block';
    }
}

/**
 * Create HTML for a donation item
 * @param {Object} donation - Donation object
 * @returns {string} HTML string for donation item
 */
function createDonationItemHtml(donation) {
    // Format status text and class
    let statusText = '';
    let statusClass = '';
    
    switch(donation.status) {
        case 'pending':
            statusText = 'Menunggu';
            statusClass = 'status-pending';
            break;
        case 'active':
            statusText = 'Aktif';
            statusClass = 'status-active';
            break;
        case 'completed':
            statusText = 'Selesai';
            statusClass = 'status-completed';
            break;
    }
    
    // Create HTML
    return `
        <div class="donation-card" data-id="${donation.id}">
            <div class="donation-card-header">
                <h3 class="donation-card-title">${donation.title}</h3>
                <span class="donation-status-badge ${statusClass}">
                    <i class="fas ${donation.status === 'pending' ? 'fa-clock' : donation.status === 'active' ? 'fa-check-circle' : 'fa-handshake'}"></i>
                    ${statusText}
                </span>
            </div>
            <div class="donation-card-body">
                <div class="donation-card-image">
                    <img src="${donation.image}" alt="${donation.title}">
                </div>
                <div class="donation-card-content">
                    <p class="donation-card-description">${truncateText(donation.description, 100)}</p>
                    <div class="donation-meta-info">
                        <div class="donation-meta-item">
                            <i class="fas fa-calendar-alt"></i> ${formatDate(donation.date)}
                        </div>
                        <div class="donation-meta-item">
                            <i class="fas fa-map-marker-alt"></i> ${donation.location}
                        </div>
                        <div class="donation-meta-item">
                            <i class="fas fa-tag"></i> ${donation.category}
                        </div>
                        <div class="donation-meta-item">
                            <i class="fas fa-box"></i> ${donation.condition}
                        </div>
                    </div>
                </div>
            </div>
            <div class="donation-card-footer">
                <div class="donation-date">${formatDate(donation.date)}</div>
                <div class="donation-actions">
                    <button class="btn btn-icon btn-outline detail-donation" data-id="${donation.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-outline delete-donation" data-id="${donation.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialize filter tabs
 */
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.donation-tabs .tab-btn');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter donations
            const filterType = this.getAttribute('data-tab');
            filterDonations(filterType);
        });
    });
}

/**
 * Filter donations based on status
 * @param {string} filterType - Type of filter (all, active, pending, completed)
 */
function filterDonations(filterType) {
    const donationItems = document.querySelectorAll('.donation-card');
    
    donationItems.forEach(item => {
        const status = item.querySelector('.donation-status-badge').classList[1].split('-')[1];
        
        if (filterType === 'all' || status === filterType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-donations');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const donationItems = document.querySelectorAll('.donation-card');
        
        donationItems.forEach(item => {
            const title = item.querySelector('.donation-card-title').textContent.toLowerCase();
            const description = item.querySelector('.donation-card-description').textContent.toLowerCase();
            
            if (title.includes(query) || description.includes(query)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/**
 * Initialize donation actions (detail and delete)
 */
function initDonationActions() {
    const detailButtons = document.querySelectorAll('.detail-donation');
    const deleteButtons = document.querySelectorAll('.delete-donation');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = parseInt(this.getAttribute('data-id'));
            showDonationDetails(donationId);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = parseInt(this.getAttribute('data-id'));
            showDeleteConfirmation(donationId);
        });
    });
}

/**
 * Show donation details in modal
 * @param {number} donationId - ID of donation to show
 */
function showDonationDetails(donationId) {
    const donation = getMockDonations().find(d => d.id === donationId);
    
    if (!donation) {
        return;
    }
    
    const modal = document.getElementById('detail-modal');
    const modalContent = document.getElementById('detail-content');
    
    // Format status
    let statusText = '';
    let statusClass = '';
    
    switch(donation.status) {
        case 'pending':
            statusText = 'Menunggu';
            statusClass = 'status-pending';
            break;
        case 'active':
            statusText = 'Aktif';
            statusClass = 'status-active';
            break;
        case 'completed':
            statusText = 'Selesai';
            statusClass = 'status-completed';
            break;
    }
    
    // Build timeline based on status
    let timelineHTML = '';
    
    // Created date (always shown)
    timelineHTML += `
        <div class="timeline-item">
            <div class="timeline-date">${formatDate(donation.date)}</div>
            <div class="timeline-title">Donasi Dibuat</div>
            <div class="timeline-description">Donasi telah berhasil dibuat dan sedang menunggu verifikasi.</div>
        </div>
    `;
    
    // If not pending, show verified
    if (donation.status !== 'pending') {
        const verifiedDate = new Date(new Date(donation.date).getTime() + 86400000); // day after creation
        timelineHTML += `
            <div class="timeline-item">
                <div class="timeline-date">${formatDate(verifiedDate.toISOString().split('T')[0])}</div>
                <div class="timeline-title">Donasi Diverifikasi</div>
                <div class="timeline-description">Donasi telah diverifikasi dan dipublikasikan.</div>
            </div>
        `;
    }
    
    // If completed, show completed
    if (donation.status === 'completed') {
        const completedDate = new Date(new Date(donation.date).getTime() + 7 * 86400000); // 7 days after creation
        timelineHTML += `
            <div class="timeline-item completed">
                <div class="timeline-date">${formatDate(completedDate.toISOString().split('T')[0])}</div>
                <div class="timeline-title">Donasi Selesai</div>
                <div class="timeline-description">Donasi telah berhasil diberikan kepada penerima.</div>
            </div>
        `;
    }
    
    // Create HTML for images gallery
    let imagesHTML = '';
    if (donation.images && donation.images.length > 0) {
        // Main image
        imagesHTML += `
            <div class="donation-detail-image main-image">
                <img src="${donation.images[0]}" alt="${donation.title}">
            </div>
        `;
        
        // Additional images
        if (donation.images.length > 1) {
            for (let i = 1; i < donation.images.length; i++) {
                imagesHTML += `
                    <div class="donation-detail-image">
                        <img src="${donation.images[i]}" alt="${donation.title}">
                    </div>
                `;
            }
        }
    }
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="donation-detail">
            <div class="donation-detail-header">
                <h2 class="donation-detail-title">${donation.title}</h2>
                
                <div class="donation-detail-meta">
                    <div class="donation-detail-meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        ${formatDate(donation.date)}
                    </div>
                    <div class="donation-detail-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        ${donation.location}
                    </div>
                    <div class="donation-detail-meta-item">
                        <i class="fas fa-tag"></i>
                        ${donation.category}
                    </div>
                    <div class="donation-detail-meta-item">
                        <i class="fas fa-box"></i>
                        ${donation.condition}
                    </div>
                </div>
                
                <div class="donation-status-badge ${statusClass}">
                    <i class="fas ${donation.status === 'pending' ? 'fa-clock' : donation.status === 'active' ? 'fa-check-circle' : 'fa-handshake'}"></i>
                    ${statusText}
                </div>
            </div>
            
            <div class="donation-detail-gallery">
                ${imagesHTML}
            </div>
            
            <div class="donation-detail-description">
                <h4>Deskripsi Barang</h4>
                <p>${donation.description}</p>
            </div>
            
            <div class="donation-detail-status">
                <h4>Status Donasi</h4>
                <div class="donation-timeline">
                    ${timelineHTML}
                </div>
            </div>
            
            <div class="donation-statistics">
                <div class="donation-stat">
                    <i class="fas fa-eye"></i> ${donation.views} Dilihat
                </div>
                <div class="donation-stat">
                    <i class="fas fa-users"></i> ${donation.interested} Peminat
                </div>
            </div>
            
            <div class="donation-detail-actions">
                ${donation.status !== 'completed' ? `
                    <a href="#" class="btn btn-primary edit-donation-btn" data-id="${donation.id}">
                        <i class="fas fa-edit"></i> Edit Donasi
                    </a>
                    <button class="btn btn-danger delete-donation" data-id="${donation.id}">
                        <i class="fas fa-trash"></i> Hapus Donasi
                    </button>
                ` : ''}
                <button class="btn btn-outline" id="close-detail-btn">
                    <i class="fas fa-times"></i> Tutup
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for close button
    const closeDetailBtn = document.getElementById('close-detail-btn');
    if (closeDetailBtn) {
        closeDetailBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Add event listeners for delete button
    const deleteButtons = modalContent.querySelectorAll('.delete-donation');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const donationId = parseInt(this.getAttribute('data-id'));
            showDeleteConfirmation(donationId);
            
            // Close detail modal
            modal.style.display = 'none';
        });
    });
    
    // Add event listener for edit button
    const editButton = modalContent.querySelector('.edit-donation-btn');
    if (editButton) {
        editButton.addEventListener('click', function(e) {
            e.preventDefault();
            const donationId = parseInt(this.getAttribute('data-id'));
            editDonation(donationId);
        });
    }
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Navigate to edit donation page
 * @param {number} donationId - ID of donation to edit
 */
function editDonation(donationId) {
    const donation = getMockDonations().find(d => d.id === donationId);
    
    if (!donation) {
        return;
    }
    
    // Store donation data in sessionStorage for access in the edit page
    sessionStorage.setItem('editDonationData', JSON.stringify(donation));
    
    // Navigate to edit page
    window.location.href = `donasi-edit.html?id=${donationId}`;
}

/**
 * Show delete confirmation modal
 * @param {number} donationId - ID of donation to delete
 */
function showDeleteConfirmation(donationId) {
    const donation = getMockDonations().find(d => d.id === donationId);
    
    if (!donation) {
        return;
    }
    
    const modal = document.getElementById('delete-modal');
    const donationToDelete = document.getElementById('donation-to-delete');
    const confirmDelete = document.getElementById('confirm-delete');
    
    // Create HTML for donation to delete
    donationToDelete.innerHTML = `
        <div class="donation-to-delete-image">
            <img src="${donation.images[0]}" alt="${donation.title}">
        </div>
        <div class="donation-to-delete-info">
            <h4>${donation.title}</h4>
            <p>Dibuat pada ${formatDate(donation.date)}</p>
        </div>
    `;
    
    // Set donation ID to confirm button
    confirmDelete.setAttribute('data-donation-id', donationId);
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Delete a donation
 * @param {number} donationId - ID of donation to delete
 */
function deleteDonation(donationId) {
    // In a real app, this would be an API call
    // For now, we just simulate the deletion
    
    // Find the donation card element
    const donationCard = document.querySelector(`.donation-card[data-id="${donationId}"]`);
    if (donationCard) {
        // Add deletion animation
        donationCard.classList.add('deleting');
        
        // Wait for animation to finish
        setTimeout(() => {
            // Remove the card
            donationCard.remove();
            
            // Update stats
            updateDonationStatistics(getMockDonations().filter(d => d.id !== donationId));
            
            // Check if there are no more donations
            const donationsList = document.getElementById('donations-list');
            const remainingCards = donationsList.querySelectorAll('.donation-card');
            
            if (remainingCards.length === 0) {
                // Show empty state
                const emptyState = donationsList.querySelector('.empty-state');
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
            
            // Show notification
            showNotification('Donasi berhasil dihapus', 'success');
        }, 300);
    }
}

/**
 * Show notification message
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, warning, error)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto-hide after delay
    const hideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideNotification(notification);
    });
}

/**
 * Hide and remove notification
 * @param {HTMLElement} notification - The notification element
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300); // Match the CSS transition time
}

/**
 * Get mock donations data for the user
 * @returns {Array} Array of mock donation objects
 */
function getMockDonations() {
    // In a real app, this would be an API call to get user's donations
    // For demo purposes, we're using mock data from data.js
    if (typeof userDonations !== 'undefined') {
        return userDonations;
    } else {
        // Fallback if userDonations is not defined in data.js
        return [
            {
                id: 101,
                title: "Laptop Asus 14 inch",
                description: "Laptop Asus 14 inch dengan RAM 8GB dan SSD 512GB. Kondisi masih sangat baik.",
                category: "Elektronik",
                condition: "Bekas - Kondisi 85%",
                location: "Cihideung",
                date: "2023-09-10",
                status: "active",
                image: "/assets/items/laptop.jpg",
                images: ["/assets/items/laptop.jpg"],
                views: 45,
                interested: 3
            },
            {
                id: 102,
                title: "Seragam Sekolah SD",
                description: "Paket seragam sekolah SD untuk anak usia 9-10 tahun.",
                category: "Pakaian",
                condition: "Bekas - Kondisi 90%",
                location: "Indihiang",
                date: "2023-10-05",
                status: "pending",
                image: "/assets/items/seragam-sd.jpg",
                images: ["/assets/items/seragam-sd.jpg"],
                views: 12,
                interested: 0
            },
            {
                id: 103,
                title: "Lemari Pakaian 2 Pintu",
                description: "Lemari pakaian 2 pintu dari kayu jati, ukuran 120x60x200 cm.",
                category: "Furnitur",
                condition: "Bekas - Kondisi 75%",
                location: "Tawang",
                date: "2023-08-15",
                status: "completed",
                image: "/assets/items/lemari.jpg",
                images: ["/assets/items/lemari.jpg"],
                views: 67,
                interested: 5
            }
        ];
    }
}

/**
 * Format date in Indonesian format
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return date.toLocaleDateString('id-ID', options);
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

/**
 * Initialize modal controls for closing modals
 */
function initModalControls() {
    // Detail Modal
    const detailModal = document.getElementById('detail-modal');
    const closeDetailModalBtn = document.getElementById('close-detail-modal');
    
    if (closeDetailModalBtn) {
        closeDetailModalBtn.addEventListener('click', function() {
            detailModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Delete Modal
    const deleteModal = document.getElementById('delete-modal');
    const closeDeleteModalBtn = document.getElementById('close-delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    
    if (closeDeleteModalBtn) {
        closeDeleteModalBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            deleteModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            const donationId = parseInt(this.getAttribute('data-donation-id'));
            deleteDonation(donationId);
            
            // Close the modal
            deleteModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close modals when clicking on overlay
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    });
}