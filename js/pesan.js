/**
 * DonasiBerkat Tasikmalaya - Messages Page JavaScript
 * Handles functionality for the messaging features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        // Show login required message
        document.getElementById('auth-required').style.display = 'block';
        document.getElementById('messages-content').style.display = 'none';
    } else {
        // Show messages content
        document.getElementById('auth-required').style.display = 'none';
        document.getElementById('messages-content').style.display = 'block';
        
        // Initialize messaging functionality
        initMessaging();
    }
});

/**
 * Initialize the messaging functionality
 */
function initMessaging() {
    // Get messages data (in a real app, this would come from an API)
    const chatData = getChatData();
    
    // Initialize conversations list
    initConversations(chatData);
    
    // Add event listener for search
    initSearch();
    
    // Initialize message form submission
    initMessageForm();
    
    // Add event listener for mark as read button
    document.getElementById('mark-as-read').addEventListener('click', function() {
        markConversationAsRead();
    });
}

/**
 * Initialize the conversations list
 * @param {Object} chatData - Data containing conversations and messages
 */
function initConversations(chatData) {
    const conversationsList = document.getElementById('conversations-list');
    const loadingState = conversationsList.querySelector('.loading-state');
    const emptyState = conversationsList.querySelector('.empty-state');
    
    // Remove loading state
    if (loadingState) loadingState.remove();
    
    if (chatData.conversations && chatData.conversations.length > 0) {
        // Sort conversations by latest message timestamp
        const sortedConversations = [...chatData.conversations].sort((a, b) => {
            const dateA = new Date(a.lastMessage.timestamp);
            const dateB = new Date(b.lastMessage.timestamp);
            return dateB - dateA;
        });
        
        // Create conversation items
        sortedConversations.forEach(conversation => {
            const conversationItem = createConversationItem(conversation);
            conversationsList.appendChild(conversationItem);
        });
        
        // Hide empty state
        if (emptyState) emptyState.style.display = 'none';
        
        // Add event listeners for conversation selection
        addConversationListeners();
        
        // Select the first conversation by default
        const firstConversation = conversationsList.querySelector('.conversation-item');
        if (firstConversation) {
            firstConversation.click();
        }
    } else {
        // Show empty state
        if (emptyState) emptyState.style.display = 'flex';
    }
}

/**
 * Create a conversation list item
 * @param {Object} conversation - Conversation data object
 * @returns {HTMLElement} The conversation list item element
 */
function createConversationItem(conversation) {
    const template = document.getElementById('conversation-template');
    const conversationItem = template.content.cloneNode(true).querySelector('.conversation-item');
    
    // Set conversation ID
    conversationItem.setAttribute('data-id', conversation.id);
    
    // Find the other participant (not the current user)
    const currentUserId = 1; // In a real app, this would come from authentication
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    
    // Set avatar
    const avatar = conversationItem.querySelector('.conversation-avatar img');
    avatar.src = otherParticipant.avatar;
    avatar.alt = otherParticipant.name;
    
    // Set name
    conversationItem.querySelector('.conversation-name').textContent = otherParticipant.name;
    
    // Set donation title
    conversationItem.querySelector('.conversation-donation').textContent = conversation.donation.title;
    
    // Set message preview
    conversationItem.querySelector('.conversation-preview').textContent = conversation.lastMessage.content;
    
    // Set time
    const messageTime = formatMessageTime(conversation.lastMessage.timestamp);
    conversationItem.querySelector('.conversation-time').textContent = messageTime;
    
    // Set unread indicator
    if (conversation.unreadCount > 0) {
        conversationItem.classList.add('unread');
        const unreadBadge = conversationItem.querySelector('.unread-badge');
        unreadBadge.textContent = conversation.unreadCount;
    } else {
        const unreadBadge = conversationItem.querySelector('.unread-badge');
        unreadBadge.style.display = 'none';
    }
    
    return conversationItem;
}

/**
 * Add event listeners to conversation items
 */
function addConversationListeners() {
    const conversationItems = document.querySelectorAll('.conversation-item');
    
    conversationItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update active state
            conversationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // Load messages for the selected conversation
            const conversationId = parseInt(this.getAttribute('data-id'));
            loadConversation(conversationId);
        });
    });
}

/**
 * Load conversation messages
 * @param {number} conversationId - ID of conversation to load
 */
function loadConversation(conversationId) {
    const chatData = getChatData();
    
    // Find conversation
    const conversation = chatData.conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    // Find messages for this conversation
    const messages = chatData.messages.filter(m => m.conversationId === conversationId);
    
    // Hide empty chat state, show chat content
    document.getElementById('empty-chat').style.display = 'none';
    document.getElementById('chat-content').style.display = 'flex';
    
    // Find the other participant (not the current user)
    const currentUserId = 1; // In a real app, this would come from authentication
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    
    // Update chat header
    document.getElementById('chat-user-avatar').src = otherParticipant.avatar;
    document.getElementById('chat-user-name').textContent = otherParticipant.name;
    
    // Set donation link
    const donationLink = document.getElementById('chat-donation-link');
    donationLink.textContent = conversation.donation.title;
    donationLink.href = `detail-donasi.html?id=${conversation.donation.id}`;
    
    // Clear messages list
    const messagesList = document.getElementById('messages-list');
    messagesList.innerHTML = '';
    
    // Add messages
    messages.forEach(message => {
        const messageElement = createMessageElement(message, currentUserId);
        messagesList.appendChild(messageElement);
    });
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
    
    // Store current conversation ID
    messagesList.setAttribute('data-conversation-id', conversationId);
}

/**
 * Create a message element
 * @param {Object} message - Message data object
 * @param {number} currentUserId - Current user ID
 * @returns {HTMLElement} The message element
 */
function createMessageElement(message, currentUserId) {
    const template = document.getElementById('message-template');
    const messageElement = template.content.cloneNode(true).querySelector('.message');
    
    // Check if outgoing or incoming
    const isOutgoing = message.senderId === currentUserId;
    
    // Add appropriate class
    messageElement.classList.add(isOutgoing ? 'outgoing' : 'incoming');
    
    // Set message text
    messageElement.querySelector('.message-text').textContent = message.content;
    
    // Set message time
    messageElement.querySelector('.message-time').textContent = formatMessageTime(message.timestamp, true);
    
    return messageElement;
}

/**
 * Format message time
 * @param {string} timestamp - ISO timestamp
 * @param {boolean} showTime - Whether to show time details
 * @returns {string} Formatted time string
 */
function formatMessageTime(timestamp, showTime = false) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date; // Difference in milliseconds
    
    if (!showTime) {
        // For conversation list, show relative time
        if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 7 * 24 * 60 * 60 * 1000) { // Less than 7 days
            return ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
        } else {
            return date.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
        }
    } else {
        // For message bubbles, show detailed time
        if (diff < 24 * 60 * 60 * 1000) { // Today
            return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else if (date.getFullYear() === now.getFullYear()) { // This year
            return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) + ' ' + 
                   date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        } else { // Previous years
            return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' + 
                   date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        }
    }
}

/**
 * Mark the current conversation as read
 */
function markConversationAsRead() {
    // Get current conversation ID
    const messagesList = document.getElementById('messages-list');
    const conversationId = parseInt(messagesList.getAttribute('data-conversation-id'));
    
    if (!conversationId) return;
    
    // Find conversation item
    const conversationItem = document.querySelector(`.conversation-item[data-id="${conversationId}"]`);
    
    if (conversationItem) {
        // Remove unread class
        conversationItem.classList.remove('unread');
        
        // Hide unread badge
        const unreadBadge = conversationItem.querySelector('.unread-badge');
        if (unreadBadge) {
            unreadBadge.style.display = 'none';
        }
        
        // Show confirmation message (in a real app, this would be an API call)
        showNotification('Pesan ditandai telah dibaca', 'success');
    }
}

/**
 * Initialize message form submission
 */
function initMessageForm() {
    const messageForm = document.getElementById('message-form');
    const messageText = document.getElementById('message-text');
    
    // Handle form submission
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get message text
        const text = messageText.value.trim();
        
        if (text) {
            // Get current conversation ID
            const messagesList = document.getElementById('messages-list');
            const conversationId = parseInt(messagesList.getAttribute('data-conversation-id'));
            
            if (conversationId) {
                // Send message (in a real app, this would be an API call)
                sendMessage(conversationId, text);
                
                // Clear input
                messageText.value = '';
            }
        }
    });
    
    // Handle textarea resize and enter key
    messageText.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    messageText.addEventListener('keydown', function(e) {
        // Send on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });
}

/**
 * Send a new message
 * @param {number} conversationId - Conversation ID
 * @param {string} text - Message text
 */
function sendMessage(conversationId, text) {
    // Create message element
    const messagesList = document.getElementById('messages-list');
    
    // Create message object
    const message = {
        id: Date.now(), // Use timestamp as ID
        conversationId: conversationId,
        senderId: 1, // Current user
        content: text,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Add message to UI
    const messageElement = createMessageElement(message, 1);
    messagesList.appendChild(messageElement);
    
    // Scroll to bottom
    messagesList.scrollTop = messagesList.scrollHeight;
    
    // Update conversation preview
    updateConversationPreview(conversationId, text);
}

/**
 * Update conversation preview after sending message
 * @param {number} conversationId - Conversation ID
 * @param {string} text - Message text
 */
function updateConversationPreview(conversationId, text) {
    const conversationItem = document.querySelector(`.conversation-item[data-id="${conversationId}"]`);
    
    if (conversationItem) {
        // Update preview text
        const previewElement = conversationItem.querySelector('.conversation-preview');
        if (previewElement) {
            previewElement.textContent = text;
        }
        
        // Update time
        const timeElement = conversationItem.querySelector('.conversation-time');
        if (timeElement) {
            timeElement.textContent = formatMessageTime(new Date().toISOString());
        }
        
        // Move conversation to top (first child of the list)
        const conversationsList = document.getElementById('conversations-list');
        if (conversationsList.firstChild !== conversationItem) {
            conversationsList.insertBefore(conversationItem, conversationsList.firstChild);
        }
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('search-conversations');
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const conversationItems = document.querySelectorAll('.conversation-item');
        
        conversationItems.forEach(item => {
            const name = item.querySelector('.conversation-name').textContent.toLowerCase();
            const donation = item.querySelector('.conversation-donation').textContent.toLowerCase();
            const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (name.includes(query) || donation.includes(query) || preview.includes(query)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

/**
 * Show notification message
 * @param {string} message - Message to show
 * @param {string} type - Notification type (success, warning, error)
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
    
    // Add show class for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto hide after delay
    const hideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, 3000);
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideNotification(notification);
    });
}

/**
 * Hide and remove notification
 * @param {HTMLElement} notification - Notification element
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Get chat data from data.js
 * @returns {Object} Chat data object
 */
function getChatData() {
    // In a real app, this would be an API call
    if (typeof chatData !== 'undefined') {
        return chatData;
    } else {
        // Return empty data if chatData is not defined
        return {
            conversations: [],
            messages: []
        };
    }
}
