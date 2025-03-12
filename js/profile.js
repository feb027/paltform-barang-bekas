/**
 * DonasiBerkat Tasikmalaya - Profile Page JavaScript
 * Handles functionality for the user profile page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Show login required message
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('profile-content').style.display = 'none';
    } else {
        // Show profile content
        document.getElementById('auth-required').style.display = 'none';
        document.getElementById('profile-content').style.display = 'block';
        
        // Initialize profile functionality
        initProfile();
    }
    
    // Add event listeners for tab navigation
    initTabNavigation();
    
    // Add event listeners for modals and forms
    initModals();
});

/**
 * Initialize the profile page with user data
 */
function initProfile() {
    // Load user data from localStorage (in a real app, this would come from an API)
    const userName = localStorage.getItem('userName') || 'Pengguna';
    const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
    const userPhone = localStorage.getItem('userPhone') || 'Belum diisi';
    const userAddress = localStorage.getItem('userAddress') || 'Belum diisi';
    const userBio = localStorage.getItem('userBio') || 'Belum ada informasi tentang pengguna ini.';
    const userAvatar = localStorage.getItem('userAvatar');
    
    // Populate profile information
    document.getElementById('profile-name').textContent = userName;
    document.getElementById('profile-email').textContent = userEmail;
    
    // Set avatar
    const avatarElement = document.getElementById('profile-avatar');
    if (userAvatar) {
        avatarElement.innerHTML = `<img src="${userAvatar}" alt="${userName}">`;
    } else {
        avatarElement.textContent = userName.charAt(0).toUpperCase();
    }
    
    // Populate view mode fields
    document.getElementById('view-name').textContent = userName;
    document.getElementById('view-email').textContent = userEmail;
    document.getElementById('view-phone').textContent = userPhone;
    document.getElementById('view-address').textContent = userAddress;
    document.getElementById('view-bio').textContent = userBio;
    
    // Populate edit form fields
    document.getElementById('edit-name').value = userName;
    document.getElementById('edit-email').value = userEmail;
    document.getElementById('edit-phone').value = userPhone !== 'Belum diisi' ? userPhone : '';
    document.getElementById('edit-address').value = userAddress !== 'Belum diisi' ? userAddress : '';
    document.getElementById('edit-bio').value = userBio !== 'Belum ada informasi tentang pengguna ini.' ? userBio : '';
    
    // Handle profile edit toggle
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const profileViewSection = document.getElementById('profile-view');
    const profileEditSection = document.getElementById('profile-edit');
    
    editProfileBtn.addEventListener('click', function() {
        profileViewSection.style.display = 'none';
        profileEditSection.style.display = 'block';
    });
    
    cancelEditBtn.addEventListener('click', function() {
        profileViewSection.style.display = 'block';
        profileEditSection.style.display = 'none';
    });
    
    // Handle profile edit submission
    const editProfileForm = document.getElementById('edit-profile-form');
    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const newName = document.getElementById('edit-name').value;
        const newPhone = document.getElementById('edit-phone').value;
        const newAddress = document.getElementById('edit-address').value;
        const newBio = document.getElementById('edit-bio').value;
        
        // Validate input
        if (!newName.trim()) {
            alert('Nama tidak boleh kosong');
            return;
        }
        
        // Save to localStorage (in a real app, this would be an API call)
        localStorage.setItem('userName', newName);
        localStorage.setItem('userPhone', newPhone || 'Belum diisi');
        localStorage.setItem('userAddress', newAddress || 'Belum diisi');
        localStorage.setItem('userBio', newBio || 'Belum ada informasi tentang pengguna ini.');
        
        // Update UI
        document.getElementById('profile-name').textContent = newName;
        document.getElementById('view-name').textContent = newName;
        document.getElementById('view-phone').textContent = newPhone || 'Belum diisi';
        document.getElementById('view-address').textContent = newAddress || 'Belum diisi';
        document.getElementById('view-bio').textContent = newBio || 'Belum ada informasi tentang pengguna ini.';
        
        // Update avatar text if no image
        if (!userAvatar) {
            avatarElement.textContent = newName.charAt(0).toUpperCase();
        }
        
        // Switch back to view mode
        profileViewSection.style.display = 'block';
        profileEditSection.style.display = 'none';
        
        // Show success message
        showNotification('Profil berhasil diperbarui!', 'success');
    });
    
    // Initialize avatar change functionality
    initAvatarChange();
    
    // Load donations, requests, and messages
    loadDonations();
    loadRequests();
    loadMessages();
}

/**
 * Initialize tab navigation
 */
function initTabNavigation() {
    const tabLinks = document.querySelectorAll('.profile-menu li');
    const tabContents = document.querySelectorAll('.profile-tab');
    
    // Handle tab clicks
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            tabLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
            
            // Update URL hash
            window.location.hash = tabId;
        });
    });
    
    // Check for hash in URL to activate specific tab
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1);
        const tabLink = document.querySelector(`.profile-menu li[data-tab="${tabId}"]`);
        if (tabLink) {
            tabLink.click();
        }
    }
}

/**
 * Initialize modals and related functionality
 */
function initModals() {
    // Password change modal
    const passwordModal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closePasswordModal = document.getElementById('close-password-modal');
    const cancelPasswordChange = document.getElementById('cancel-password-change');
    const passwordForm = document.getElementById('change-password-form');
    const passwordModalOverlay = document.querySelector('#password-modal .modal-overlay');
    
    if (changePasswordBtn && passwordModal) {
        changePasswordBtn.addEventListener('click', function() {
            passwordModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal events
        [closePasswordModal, cancelPasswordChange, passwordModalOverlay].forEach(element => {
            if (element) {
                element.addEventListener('click', function() {
                    passwordModal.style.display = 'none';
                    document.body.style.overflow = '';
                    passwordForm.reset();
                });
            }
        });
        
        // Handle password form submission
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Simple validation
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Semua kolom harus diisi');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Kata sandi baru dan konfirmasi kata sandi tidak cocok');
                return;
            }
            
            // Password change logic (in a real app, this would be an API call)
            passwordModal.style.display = 'none';
            document.body.style.overflow = '';
            passwordForm.reset();
            
            showNotification('Kata sandi berhasil diubah!', 'success');
        });
        
        // Toggle password visibility
        const togglePasswordBtns = document.querySelectorAll('.toggle-password');
        togglePasswordBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    icon.className = 'fas fa-eye-slash';
                } else {
                    passwordInput.type = 'password';
                    icon.className = 'fas fa-eye';
                }
            });
        });
        
        // Password strength meter
        const newPasswordInput = document.getElementById('new-password');
        const strengthProgress = document.getElementById('strength-progress');
        const strengthText = document.getElementById('strength-text');
        
        newPasswordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            // Update strength indicator
            strengthProgress.style.width = strength.percentage + '%';
            strengthText.textContent = 'Kekuatan: ' + strength.label;
            
            // Update progress bar color
            if (strength.score <= 1) {
                strengthProgress.style.backgroundColor = '#dc3545'; // danger
            } else if (strength.score === 2) {
                strengthProgress.style.backgroundColor = '#ffc107'; // warning
            } else if (strength.score === 3) {
                strengthProgress.style.backgroundColor = '#17a2b8'; // info
            } else {
                strengthProgress.style.backgroundColor = '#28a745'; // success
            }
        });
    }
    
    // Delete account modal
    const deleteAccountModal = document.getElementById('delete-account-modal');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const closeDeleteModal = document.getElementById('close-delete-modal');
    const cancelAccountDeletion = document.getElementById('cancel-account-deletion');
    const deleteAccountForm = document.getElementById('delete-account-form');
    const deleteModalOverlay = document.querySelector('#delete-account-modal .modal-overlay');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const deleteConfirmationInput = document.getElementById('delete-confirmation');
    
    if (deleteAccountBtn && deleteAccountModal) {
        deleteAccountBtn.addEventListener('click', function() {
            deleteAccountModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal events
        [closeDeleteModal, cancelAccountDeletion, deleteModalOverlay].forEach(element => {
            if (element) {
                element.addEventListener('click', function() {
                    deleteAccountModal.style.display = 'none';
                    document.body.style.overflow = '';
                    deleteAccountForm.reset();
                    confirmDeleteBtn.disabled = true;
                });
            }
        });
        
        // Enable delete button only when confirmation text is correct
        if (deleteConfirmationInput && confirmDeleteBtn) {
            deleteConfirmationInput.addEventListener('input', function() {
                confirmDeleteBtn.disabled = this.value !== 'HAPUS AKUN SAYA';
            });
        }
        
        // Handle delete account form submission
        if (deleteAccountForm) {
            deleteAccountForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Account deletion logic (in a real app, this would be an API call)
                // Clear all user data
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userPhone');
                localStorage.removeItem('userAddress');
                localStorage.removeItem('userBio');
                localStorage.removeItem('userAvatar');
                
                // Redirect to home page
                window.location.href = '/';
            });
        }
    }
}

/**
 * Initialize avatar change functionality
 */
function initAvatarChange() {
    const avatarChangeBtn = document.querySelector('.change-avatar-btn');
    
    if (avatarChangeBtn) {
        avatarChangeBtn.addEventListener('click', function() {
            // Create a file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            
            // Handle file selection
            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Save avatar to localStorage
                        localStorage.setItem('userAvatar', e.target.result);
                        
                        // Update avatar in UI
                        const avatarElement = document.getElementById('profile-avatar');
                        avatarElement.innerHTML = `<img src="${e.target.result}" alt="${localStorage.getItem('userName')}">`;
                        
                        showNotification('Foto profil berhasil diubah!', 'success');
                    };
                    
                    reader.readAsDataURL(this.files[0]);
                }
            });
            
            // Trigger file dialog
            fileInput.click();
        });
    }
}

/**
 * Load user's donations
 */
function loadDonations() {
    // This would typically be an API call
    // For now, we'll use mock data
    
    // Simulate loading delay
    setTimeout(function() {
        const donationsList = document.getElementById('donations-list');
        const loadingState = donationsList.querySelector('.loading-state');
        const emptyState = donationsList.querySelector('.empty-state');
        
        // Check if user has any donations
        const mockDonations = getMockDonations();
        
        if (mockDonations && mockDonations.length > 0) {
            // Remove loading state
            if (loadingState) loadingState.remove();
            
            // Update badge count
            document.getElementById('donations-count').textContent = mockDonations.length;
            
            // Create donation items
            const donationItemsHtml = mockDonations.map(donation => createDonationItemHtml(donation)).join('');
            
            // Insert donation items
            if (emptyState) {
                emptyState.insertAdjacentHTML('beforebegin', donationItemsHtml);
                emptyState.style.display = 'none';
            } else {
                donationsList.innerHTML = donationItemsHtml;
            }
            
            // Add event listeners for donation filter tabs
            const donationTabs = document.querySelectorAll('.donation-tabs .tab-btn');
            donationTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // Update active tab
                    donationTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter donations
                    const filterType = this.getAttribute('data-tab');
                    filterDonations(filterType);
                });
            });
        } else {
            // Show empty state
            if (loadingState) loadingState.remove();
            if (emptyState) emptyState.style.display = 'block';
        }
    }, 1000); // Simulate network delay
}

/**
 * Get mock donation data
 */
function getMockDonations() {
    return [
        {
            id: 1,
            title: 'Sepeda Anak Bekas',
            image: 'assets/items/sepeda.jpg',
            status: 'active',
            date: '2023-09-15',
            location: 'Cihideung',
            views: 45,
            interested: 3
        },
        {
            id: 2,
            title: 'Meja Belajar Kayu',
            image: 'assets/items/meja.jpg',
            status: 'completed',
            date: '2023-08-20',
            location: 'Tawang',
            views: 78,
            interested: 5
        },
        {
            id: 3,
            title: 'Buku Pelajaran SD Kelas 5',
            image: 'assets/items/buku.jpg',
            status: 'pending',
            date: '2023-09-28',
            location: 'Indihiang',
            views: 12,
            interested: 0
        }
    ];
}

/**
 * Create HTML for a donation item
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
        <div class="donation-item" data-status="${donation.status}">
            <div class="donation-item-header">
                <h3 class="donation-title">${donation.title}</h3>
                <span class="donation-status ${statusClass}">${statusText}</span>
            </div>
            <div class="donation-item-body">
                <div class="donation-image">
                    <img src="${donation.image}" alt="${donation.title}">
                </div>
                <div class="donation-details">
                    <p>${formatDate(donation.date)}</p>
                    <div class="donation-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${donation.location}</span>
                        <span><i class="fas fa-eye"></i> ${donation.views} Dilihat</span>
                        <span><i class="fas fa-users"></i> ${donation.interested} Peminat</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Filter donations based on status
 */
function filterDonations(filterType) {
    const donationItems = document.querySelectorAll('.donation-item');
    
    donationItems.forEach(item => {
        const status = item.getAttribute('data-status');
        
        if (filterType === 'all' || status === filterType) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Load user's requests
 */
function loadRequests() {
    // This would be an API call in a real app
    // For now, just set the badge count
    document.getElementById('requests-count').textContent = '0';
}

/**
 * Load user's messages
 */
function loadMessages() {
    // This would be an API call in a real app
    setTimeout(function() {
        const messagesList = document.getElementById('messages-list');
        const emptyState = messagesList.querySelector('.empty-state');
        
        // Check if user has any conversations (simulating current user as ID 1)
        const currentUserId = 1; // In a real app, this would come from authentication
        const userConversations = chatData.conversations.filter(conv => 
            conv.participants.some(p => p.id === currentUserId)
        );
        
        if (userConversations && userConversations.length > 0) {
            // Remove empty state if present
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Update badge count with unread messages
            const totalUnread = userConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
            document.getElementById('messages-count').textContent = totalUnread > 0 ? totalUnread : '';
            
            // Create conversation list
            const conversationListHtml = `
                <div class="chat-container">
                    <div class="conversations-list">
                        ${userConversations.map(conv => createConversationItemHtml(conv, currentUserId)).join('')}
                    </div>
                    <div class="messages-container" id="messages-container">
                        <div class="chat-header">
                            <div class="chat-user-info">
                                <div class="chat-avatar">
                                    <img src="${userConversations[0].participants.find(p => p.id !== currentUserId).avatar}" alt="User">
                                </div>
                                <div class="chat-user-details">
                                    <h4>${userConversations[0].participants.find(p => p.id !== currentUserId).name}</h4>
                                    <p class="chat-donation-info">
                                        <span class="chat-donation-title">${userConversations[0].donation.title}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div class="chat-messages" id="chat-messages">
                            ${loadConversationMessages(userConversations[0].id, currentUserId)}
                        </div>
                        <div class="chat-input-container">
                            <form id="chat-form">
                                <input type="text" id="chat-input" class="form-control" placeholder="Ketik pesan...">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Insert conversation HTML
            messagesList.insertAdjacentHTML('afterbegin', conversationListHtml);
            
            // Add event listeners for conversation items
            initChatInteractions(currentUserId);
        } else {
            // Show empty state
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }, 800); // Simulate loading delay
}

/**
 * Create HTML for a conversation item
 */
function createConversationItemHtml(conversation, currentUserId) {
    const otherUser = conversation.participants.find(p => p.id !== currentUserId);
    const isUnread = conversation.unreadCount > 0;
    const formattedTime = formatChatTime(conversation.lastMessage.timestamp);
    
    return `
        <div class="conversation-item ${isUnread ? 'unread' : ''}" data-id="${conversation.id}">
            <div class="conversation-avatar">
                <img src="${otherUser.avatar}" alt="${otherUser.name}">
                ${isUnread ? `<span class="unread-badge">${conversation.unreadCount}</span>` : ''}
            </div>
            <div class="conversation-details">
                <div class="conversation-header">
                    <h4 class="conversation-name">${otherUser.name}</h4>
                    <span class="conversation-time">${formattedTime}</span>
                </div>
                <div class="conversation-last-message">
                    ${truncateText(conversation.lastMessage.content, 40)}
                </div>
                <div class="conversation-item-info">
                    <span class="conversation-item-name">
                        <img src="${conversation.donation.image}" alt="${conversation.donation.title}">
                        ${truncateText(conversation.donation.title, 20)}
                    </span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Load messages for a specific conversation
 */
function loadConversationMessages(conversationId, currentUserId) {
    const messages = chatData.messages.filter(m => m.conversationId === conversationId);
    
    if (messages.length === 0) return '<p class="no-messages">Belum ada pesan</p>';
    
    return messages.map(msg => {
        const isSender = msg.senderId === currentUserId;
        const messageClass = isSender ? 'outgoing' : 'incoming';
        const formattedTime = formatChatTime(msg.timestamp);
        
        return `
            <div class="message ${messageClass}">
                <div class="message-content">
                    <p>${msg.content}</p>
                    <span class="message-time">${formattedTime}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Format chat timestamp to a readable format
 */
function formatChatTime(timestamp) {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show only time
    if (messageDate.toDateString() === now.toDateString()) {
        return messageDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    } 
    // If message is from yesterday, show 'Kemarin'
    else if (messageDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
        return 'Kemarin';
    }
    // Otherwise show date
    else {
        return messageDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    }
}

/**
 * Initialize chat interactions (conversation switching and messaging)
 */
function initChatInteractions(currentUserId) {
    const conversationItems = document.querySelectorAll('.conversation-item');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Handle conversation switching
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active state
            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            this.classList.remove('unread');
            
            // Get conversation ID and load messages
            const conversationId = parseInt(this.getAttribute('data-id'));
            const conversation = chatData.conversations.find(c => c.id === conversationId);
            const otherUser = conversation.participants.find(p => p.id !== currentUserId);
            
            // Update chat header
            const chatHeader = document.querySelector('.chat-header');
            chatHeader.innerHTML = `
                <div class="chat-user-info">
                    <div class="chat-avatar">
                        <img src="${otherUser.avatar}" alt="User">
                    </div>
                    <div class="chat-user-details">
                        <h4>${otherUser.name}</h4>
                        <p class="chat-donation-info">
                            <span class="chat-donation-title">${conversation.donation.title}</span>
                        </p>
                    </div>
                </div>
            `;
            
            // Load messages
            chatMessages.innerHTML = loadConversationMessages(conversationId, currentUserId);
            
            // Scroll to bottom
            scrollToBottom(chatMessages);
            
            // Mark messages as read (simulation)
            const unreadBadge = this.querySelector('.unread-badge');
            if (unreadBadge) {
                unreadBadge.remove();
            }
        });
    });
    
    // Set first conversation as active initially
    if (conversationItems.length > 0) {
        conversationItems[0].classList.add('active');
    }
    
    // Handle send message
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const messageText = chatInput.value.trim();
            if (!messageText) return;
            
            // Get active conversation
            const activeConversation = document.querySelector('.conversation-item.active');
            if (!activeConversation) return;
            
            const conversationId = parseInt(activeConversation.getAttribute('data-id'));
            
            // Add new message (client-side only, would be sent to API in real app)
            const newMessageHtml = `
                <div class="message outgoing">
                    <div class="message-content">
                        <p>${messageText}</p>
                        <span class="message-time">Baru saja</span>
                    </div>
                </div>
            `;
            
            chatMessages.insertAdjacentHTML('beforeend', newMessageHtml);
            
            // Clear input and scroll to bottom
            chatInput.value = '';
            scrollToBottom(chatMessages);
            
            // Update last message in conversation list (simulation)
            const conversationDetails = activeConversation.querySelector('.conversation-details');
            if (conversationDetails) {
                const lastMessage = conversationDetails.querySelector('.conversation-last-message');
                const time = conversationDetails.querySelector('.conversation-time');
                
                if (lastMessage) lastMessage.textContent = truncateText(messageText, 40);
                if (time) time.textContent = 'Baru saja';
            }
        });
    }
}

/**
 * Scroll chat messages to the bottom
 */
function scrollToBottom(container) {
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

/**
 * Calculate password strength
 * Returns a score from 0-4 and a label
 */
function calculatePasswordStrength(password) {
    if (!password) {
        return { score: 0, percentage: 0, label: 'Lemah' };
    }
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Cap score at 4
    score = Math.min(score, 4);
    
    // Calculate percentage for progress bar
    const percentage = (score / 4) * 100;
    
    // Get label based on score
    let label = 'Lemah';
    if (score === 2) label = 'Sedang';
    else if (score === 3) label = 'Kuat';
    else if (score >= 4) label = 'Sangat Kuat';
    
    return { score, percentage, label };
}

/**
 * Show a notification
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
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300); // Match the CSS transition time
}
