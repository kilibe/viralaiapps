// Import Supabase functions
import { supabase, fetchEntities, formatNumber, formatGrowth, formatFunding } from './supabase-client.js';

// Global variables
let currentChart = null;
let selectedEntity = null;

// Add debugging
console.log('script-updated.js loaded');
console.log('Supabase client:', supabase);

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

async function initializeApp() {
    console.log('DOM ready, initializing app...');
    
    try {
        // Test Supabase connection first
        console.log('Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase
            .from('entities')
            .select('id, name')
            .limit(1);
            
        if (testError) {
            console.error('Supabase test failed:', testError);
        } else {
            console.log('Supabase test successful:', testData);
        }
        
        // Initialize modal functionality
        console.log('Initializing modal...');
        initializeModal();
        
        // Initialize dropdowns
        console.log('Initializing dropdowns...');
        initializeDropdowns();
        
        // Initialize navigation
        console.log('Initializing navigation...');
        initializeNavigation();
        
        // Load entities from Supabase
        console.log('Loading entities...');
        await loadEntities();
        
        // Add row click handlers
        console.log('Initializing row click handlers...');
        initializeRowClickHandlers();
        
        console.log('App initialization complete!');
    } catch (error) {
        console.error('Error during initialization:', error);
        // Show error in the table
        const tbody = document.querySelector('.content-table tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Error: ${error.message}</td></tr>`;
        }
    }
}

async function loadEntities(filters = {}) {
    try {
        console.log('loadEntities called with filters:', filters);
        
        // Show loading message
        const tbody = document.querySelector('.content-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading data from Supabase...</td></tr>';
        }
        
        // Fetch entities
        const entities = await fetchEntities(filters);
        console.log('Entities received:', entities);
        
        if (!entities || entities.length === 0) {
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No data found. Check console for details.</td></tr>';
            }
            return;
        }
        
        // Update the table
        updateTable(entities);
        
    } catch (error) {
        console.error('Error in loadEntities:', error);
        const tbody = document.querySelector('.content-table tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Error: ${error.message}</td></tr>`;
        }
    }
}

function updateTable(entities) {
    console.log('Updating table with', entities.length, 'entities');
    
    const tbody = document.querySelector('.content-table tbody');
    if (!tbody) {
        console.error('Table body not found!');
        return;
    }
    
    tbody.innerHTML = '';
    
    entities.forEach(entity => {
        const row = document.createElement('tr');
        row.className = 'clickable-row';
        row.dataset.entityId = entity.id;
        row.dataset.entityName = entity.name;
        
        // Determine growth class based on value
        const growthValue = parseFloat(entity.growth_rate_30d) || 0;
        const growthClass = growthValue > 0 ? 'growth-positive' : 'growth-negative';
        
        // Handle category which is an array
        let primaryCategory = 'General AI';
        if (Array.isArray(entity.category) && entity.category.length > 0) {
            primaryCategory = entity.category[0];
        } else if (typeof entity.category === 'string') {
            primaryCategory = entity.category;
        }
        
        // Create row HTML
        row.innerHTML = `
            <td>
                <div class="app-info">
                    <strong>${entity.name}</strong>
                    <div class="app-description">${entity.short_description || ''}</div>
                </div>
            </td>
            <td class="${growthClass}">${formatGrowth(entity.growth_rate_30d)}</td>
            <td>${entity.volume ? formatNumber(entity.volume) + ' users' : 'N/A'}</td>
            <td>${formatFunding(entity.latest_funding_amount)}</td>
            <td>${entity.latest_round_type || 'N/A'}</td>
            <td><span class="category-${getCategoryClass(primaryCategory)}">${primaryCategory}</span></td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('Table updated successfully');
    
    // Re-initialize row click handlers
    initializeRowClickHandlers();
}

function initializeRowClickHandlers() {
    const rows = document.querySelectorAll('.clickable-row');
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const entityId = this.dataset.entityId;
            const entityName = this.dataset.entityName;
            if (entityId) {
                console.log('Row clicked:', entityName);
                // For now, just log the click
                alert(`Details for ${entityName} coming soon!`);
            }
        });
    });
}

// Initialize dropdowns with filter functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        const options = dropdown.querySelectorAll('.dropdown-content a');
        
        if (!btn || !content) return;
        
        // Toggle dropdown on button click
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close other dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
        });
        
        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', async function(e) {
                e.preventDefault();
                
                // Update button text (keep the arrow)
                btn.innerHTML = this.textContent + ' <span class="arrow">▼</span>';
                
                // Close dropdown
                dropdown.classList.remove('active');
                
                // Apply filter
                await applyFilters();
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
}

async function applyFilters() {
    const filters = {};
    
    // Get category filter
    const categoryBtn = document.querySelector('.dropdown:nth-child(2) .dropdown-btn');
    if (categoryBtn) {
        const category = categoryBtn.textContent.trim().split(' ')[0];
        if (category !== 'Category' && category !== 'All') {
            filters.category = category;
        }
    }
    
    // Reload entities with filters
    await loadEntities(filters);
}

// Initialize navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found navigation items:', navItems.length);
    
    navItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // For now, just reload the main content
            if (this.textContent.toLowerCase().includes('startup')) {
                loadEntities();
            }
        });
    });
}

// Initialize modal functionality
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
    if (!modalOverlay || !modalClose) return;
    
    // Close modal on close button click
    modalClose.addEventListener('click', closeModal);
    
    // Close modal on overlay click
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
}

function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Get category class for styling
function getCategoryClass(category) {
    if (!category) return 'slate';
    
    const normalizedCategory = category.toLowerCase().replace(/[\s&]+/g, '-');
    
    const categoryMap = {
        'general-chatbots': 'teal',
        'writing': 'teal',
        'research': 'teal',
        'llms': 'slate',
        'apis': 'slate',
        'workflow': 'navy',
        'build-code': 'dark',
        'office-tools-productivity': 'navy',
        'enterprise': 'slate',
        'security': 'slate'
    };
    
    return categoryMap[normalizedCategory] || 'slate';
}

// Make functions available globally for debugging
window.loadEntities = loadEntities;
window.supabase = supabase;