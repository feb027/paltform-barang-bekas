/**
 * DonasiBerkat Tasikmalaya - Browse Page JavaScript
 * Contains functionality for browsing and searching donation items
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load all items initially
    loadDonationItems();
    
    // Initialize filters and search functionality
    initFilters();
    initSearch();
    
    // Initialize mobile filter toggle
    initMobileFilter();
});

/**
 * Load all donation items from data.js and display them in the grid
 */
function loadDonationItems(filteredItems = null) {
    const itemsGrid = document.getElementById('donation-items');
    if (!itemsGrid) return;
    
    // Clear any existing items or skeletons
    itemsGrid.innerHTML = '';
    
    // Determine which items to display
    let itemsToDisplay = filteredItems;
    
    if (!itemsToDisplay && typeof featuredItems !== 'undefined' && featuredItems.length > 0) {
        itemsToDisplay = [...featuredItems];
    }
    
    if (itemsToDisplay && itemsToDisplay.length > 0) {
        // Display items
        itemsToDisplay.forEach((item, index) => {
            const card = createItemCard(item);
            // Add staggered animation delay
            card.style.animationDelay = `${index * 0.1}s`;
            itemsGrid.appendChild(card);
        });
        
        // Initialize pagination if needed
        if (itemsToDisplay.length > 12) {
            initPagination(itemsToDisplay);
        } else {
            const paginationElement = document.getElementById('pagination');
            if (paginationElement) {
                paginationElement.innerHTML = '';
            }
        }
    } else {
        // Show empty state
        showEmptyState(itemsGrid);
    }
}

/**
 * Show empty state when no items are available
 */
function showEmptyState(container) {
    container.innerHTML = `
        <div class="no-items">
            <i class="fas fa-box-open fa-3x"></i>
            <h3>Tidak Ada Barang Ditemukan</h3>
            <p>Saat ini belum ada barang donasi yang sesuai dengan kriteria pencarian Anda. Coba ubah filter atau cari dengan kata kunci lain.</p>
            <button id="reset-filters" class="btn btn-primary">Reset Filter</button>
        </div>
    `;
    
    // Add reset filters functionality
    const resetButton = document.getElementById('reset-filters');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset all filters
            const categoryFilter = document.getElementById('category-filter');
            const locationFilter = document.getElementById('location-filter');
            const conditionFilter = document.getElementById('condition-filter');
            const sortSelect = document.getElementById('sort-select');
            const searchInput = document.getElementById('hero-search-input');
            
            if (categoryFilter) categoryFilter.value = '';
            if (locationFilter) locationFilter.value = '';
            if (conditionFilter) conditionFilter.value = '';
            if (sortSelect) sortSelect.value = 'newest';
            if (searchInput) searchInput.value = '';
            
            // Clear active filters
            updateActiveFilters();
            
            // Reload all items
            loadDonationItems();
        });
    }
}

/**
 * Create an item card element
 */
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.dataset.id = item.id;
    
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
    
    // Make the entire card clickable (except for buttons and links)
    card.addEventListener('click', function(e) {
        if (!e.target.closest('.btn') && !e.target.closest('a')) {
            window.location.href = `/detail.html?id=${item.id}`;
        }
    });
    
    return card;
}

/**
 * Initialize filtering and sorting functionality
 */
function initFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    const conditionFilter = document.getElementById('condition-filter');
    const sortSelect = document.getElementById('sort-select');
    
    // Skip if filters are not present
    if (!categoryFilter || !locationFilter || !conditionFilter || !sortSelect) return;
    
    // Populate category filter from data.js
    if (typeof categories !== 'undefined' && categories.length > 0) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }
    
    // Common function to apply all filters
    function applyFilters() {
        if (typeof featuredItems === 'undefined' || !featuredItems.length) return;
        
        const selectedCategory = categoryFilter.value;
        const selectedLocation = locationFilter.value;
        const selectedCondition = conditionFilter.value;
        const selectedSort = sortSelect.value;
        
        // Clone the original array
        let filteredItems = [...featuredItems];
        
        // Apply filters
        if (selectedCategory) {
            filteredItems = filteredItems.filter(item => item.category === selectedCategory);
        }
        
        if (selectedLocation) {
            filteredItems = filteredItems.filter(item => item.location.includes(selectedLocation));
        }
        
        if (selectedCondition) {
            filteredItems = filteredItems.filter(item => item.condition === selectedCondition);
        }
        
        // Apply sorting
        if (selectedSort === 'newest') {
            filteredItems.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        } else if (selectedSort === 'oldest') {
            filteredItems.sort((a, b) => new Date(a.posted) - new Date(b.posted));
        } else if (selectedSort === 'alphabetical') {
            filteredItems.sort((a, b) => a.title.localeCompare(b.title));
        }
        
        // Update active filters display
        updateActiveFilters();
        
        // Update the UI with filtered items
        loadDonationItems(filteredItems);
    }
    
    // Function to update active filters display
    function updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        if (!activeFiltersContainer) return;
        
        // Clear existing tags
        activeFiltersContainer.innerHTML = '';
        
        // Add category filter tag if active
        if (categoryFilter.value) {
            addFilterTag(activeFiltersContainer, 'category', 'Kategori', categoryFilter.value);
        }
        
        // Add location filter tag if active
        if (locationFilter.value) {
            addFilterTag(activeFiltersContainer, 'location', 'Lokasi', locationFilter.value);
        }
        
        // Add condition filter tag if active
        if (conditionFilter.value) {
            addFilterTag(activeFiltersContainer, 'condition', 'Kondisi', conditionFilter.value);
        }
    }
    
    // Helper function to add a filter tag
    function addFilterTag(container, type, label, value) {
        const tag = document.createElement('div');
        tag.className = 'filter-tag';
        tag.innerHTML = `
            <span>${label}: ${value}</span>
            <button class="remove-tag" data-type="${type}">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(tag);
        
        // Add click handler for the remove button
        const removeBtn = tag.querySelector('.remove-tag');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const filterType = this.dataset.type;
                
                // Reset the corresponding filter
                if (filterType === 'category') categoryFilter.value = '';
                if (filterType === 'location') locationFilter.value = '';
                if (filterType === 'condition') conditionFilter.value = '';
                
                // Re-apply filters
                applyFilters();
            });
        }
    }
    
    // Add event listeners to all filter controls
    categoryFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    conditionFilter.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
    
    // Initialize active filters
    updateActiveFilters();
}

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('hero-search-input');
    const searchButton = document.getElementById('hero-search-button');
    
    if (!searchInput || !searchButton) return;
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        // Skip empty searches
        if (!searchTerm || typeof featuredItems === 'undefined' || !featuredItems.length) {
            loadDonationItems();
            return;
        }
        
        // Filter items based on search term
        const filteredItems = featuredItems.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(searchTerm);
            const categoryMatch = item.category.toLowerCase().includes(searchTerm);
            const descriptionMatch = item.description?.toLowerCase().includes(searchTerm);
            const locationMatch = item.location.toLowerCase().includes(searchTerm);
            
            return titleMatch || categoryMatch || descriptionMatch || locationMatch;
        });
        
        // Update UI with search results
        loadDonationItems(filteredItems);
    }
    
    // Add event listeners
    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

/**
 * Initialize mobile filter toggle functionality
 */
function initMobileFilter() {
    const toggleButton = document.getElementById('toggle-filters');
    const filterContainer = document.getElementById('filter-container');
    
    if (toggleButton && filterContainer) {
        toggleButton.addEventListener('click', function() {
            filterContainer.classList.toggle('show');
            
            // Toggle icon and text
            if (filterContainer.classList.contains('show')) {
                this.innerHTML = '<i class="fas fa-times"></i> Tutup Filter';
            } else {
                this.innerHTML = '<i class="fas fa-sliders-h"></i> Filter';
            }
        });
    }
}

/**
 * Initialize simple pagination
 */
function initPagination(items) {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement) return;
    
    const itemsPerPage = 12;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    // Clear existing pagination
    paginationElement.innerHTML = '';
    
    // Don't show pagination if only one page
    if (totalPages <= 1) return;
    
    // Add prev button
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.disabled = true; // Disabled on first page
    prevButton.setAttribute('data-page', 'prev');
    paginationElement.appendChild(prevButton);
    
    // Add page buttons (up to 5 pages)
    const maxVisiblePages = 5;
    const startPage = 1;
    const endPage = Math.min(totalPages, maxVisiblePages);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.setAttribute('data-page', i);
        
        // Active state for first page
        if (i === 1) {
            pageButton.classList.add('active');
        }
        
        paginationElement.appendChild(pageButton);
    }
    
    // Add "..." if more pages
    if (totalPages > maxVisiblePages) {
        const morePagesBtn = document.createElement('button');
        morePagesBtn.textContent = '...';
        morePagesBtn.disabled = true;
        paginationElement.appendChild(morePagesBtn);
    }
    
    // Add next button
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('data-page', 'next');
    paginationElement.appendChild(nextButton);
    
    // Add event listener for pagination
    paginationElement.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button || button.disabled) return;
        
        const currentPage = parseInt(paginationElement.querySelector('.active').getAttribute('data-page'));
        let targetPage = button.getAttribute('data-page');
        
        if (targetPage === 'prev') {
            targetPage = currentPage - 1;
        } else if (targetPage === 'next') {
            targetPage = currentPage + 1;
        } else {
            targetPage = parseInt(targetPage);
        }
        
        // Don't process if same page or invalid
        if (targetPage === currentPage || targetPage < 1 || targetPage > totalPages) return;
        
        // Update active button
        paginationElement.querySelector('.active').classList.remove('active');
        
        // Find the button for the target page
        let targetButton = paginationElement.querySelector(`button[data-page="${targetPage}"]`);
        
        // If button doesn't exist (when clicking next/prev to pages beyond visible range)
        if (!targetButton) {
            // Recalculate visible page range
            const startPage = Math.max(1, targetPage - Math.floor(maxVisiblePages / 2));
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            // Clear and recreate pagination
            const prevBtn = paginationElement.querySelector('button[data-page="prev"]');
            const nextBtn = paginationElement.querySelector('button[data-page="next"]');
            
            paginationElement.innerHTML = '';
            paginationElement.appendChild(prevBtn);
            
            for (let i = startPage; i <= endPage; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.setAttribute('data-page', i);
                
                if (i === targetPage) {
                    pageButton.classList.add('active');
                }
                
                paginationElement.appendChild(pageButton);
            }
            
            // Add "..." if needed
            if (endPage < totalPages) {
                const morePagesBtn = document.createElement('button');
                morePagesBtn.textContent = '...';
                morePagesBtn.disabled = true;
                paginationElement.appendChild(morePagesBtn);
            }
            
            paginationElement.appendChild(nextBtn);
        } else {
            targetButton.classList.add('active');
        }
        
        // Update prev/next button states
        const prevBtn = paginationElement.querySelector('button[data-page="prev"]');
        prevBtn.disabled = targetPage === 1;
        
        const nextBtn = paginationElement.querySelector('button[data-page="next"]');
        nextBtn.disabled = targetPage === totalPages;
        
        // Show items for the selected page
        showItemsForPage(items, targetPage, itemsPerPage);
    });
    
    // Show the first page initially
    showItemsForPage(items, 1, itemsPerPage);
}

/**
 * Show items for specific page
 */
function showItemsForPage(items, page, itemsPerPage) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = items.slice(startIndex, endIndex);
    
    const itemsGrid = document.getElementById('donation-items');
    if (!itemsGrid) return;
    
    itemsGrid.innerHTML = '';
    
    pageItems.forEach((item, index) => {
        const card = createItemCard(item);
        // Reset animation delay for smoother page transitions
        card.style.animationDelay = `${index * 0.05}s`;
        itemsGrid.appendChild(card);
    });
    
    // Scroll to top of results
    window.scrollTo({ top: itemsGrid.offsetTop - 100, behavior: 'smooth' });
}
