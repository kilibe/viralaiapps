// Import Supabase functions
import { supabase, fetchEntities, formatNumber, formatGrowth, formatFunding } from './supabase-client.js';

// Global variables
let selectedEntity = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initializeApp();
});

async function initializeApp() {
    console.log('Initializing test app...');
    
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
    
    console.log('Test app initialization complete!');
}

async function loadEntities(filters = {}) {
    try {
        const entities = await fetchEntities(filters);
        updateTable(entities);
    } catch (error) {
        console.error('Error loading entities:', error);
    }
}

function updateTable(entities) {
    const tbody = document.querySelector('.content-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    entities.forEach(entity => {
        const row = document.createElement('tr');
        row.className = 'clickable-row';
        row.dataset.entityId = entity.id;
        row.dataset.entityName = entity.name;
        
        row.innerHTML = `
            <td>
                <div class="app-info">
                    <strong>${entity.name}</strong>
                    <div class="app-description">${entity.short_description || ''}</div>
                </div>
            </td>
            <td class="growth-positive">${formatGrowth(entity.growth_rate_30d)}</td>
            <td>${formatNumber(entity.volume)} users</td>
            <td>${formatFunding(entity.latest_funding_amount)}</td>
            <td>${entity.latest_round_type || 'N/A'}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Re-initialize row click handlers
    initializeRowClickHandlers();
}

function initializeRowClickHandlers() {
    const rows = document.querySelectorAll('.clickable-row');
    console.log('Found', rows.length, 'clickable rows');
    
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const entityId = this.dataset.entityId;
            const entityName = this.dataset.entityName;
            console.log('Row clicked:', entityId, entityName);
            
            if (entityId && entityName) {
                // Navigate to detail page instead of showing popup
                window.location.href = `detail-test.html?id=${encodeURIComponent(entityId)}&name=${encodeURIComponent(entityName)}`;
            }
        });
    });
}

// Initialize dropdowns
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    console.log('Found', dropdowns.length, 'dropdowns');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        
        if (btn && content) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
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
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Prevent dropdown content clicks from closing dropdown
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Initialize navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    console.log('Found', navItems.length, 'navigation items');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load content based on navigation
            loadContent(this.textContent);
        });
    });
}

// Function to load different content based on navigation
function loadContent(section) {
    console.log(`Loading content for: ${section}`);
    
    switch(section.toLowerCase()) {
        case 'startups':
            // Already loaded
            break;
        case 'unicorns':
            showComingSoon('Unicorns');
            break;
        case 'tracking':
            showComingSoon('Tracking');
            break;
        case 'reports':
            showComingSoon('Reports');
            break;
        case 'api':
            showComingSoon('API');
            break;
        default:
            console.log('Unknown section:', section);
    }
}

function showComingSoon(feature) {
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.innerHTML = `
            <div class="coming-soon">
                <h2>${feature} Coming Soon</h2>
                <p>This feature is currently under development and will be available soon.</p>
            </div>
        `;
    }
}