// Import Supabase functions
import { supabase, fetchEntities, fetchEntityMetrics, fetchEntityForecasts, formatNumber, formatGrowth, formatFunding } from './supabase-client.js';

// Global variables
let currentChart = null;
let selectedEntity = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    initializeApp();
});

async function initializeApp() {
    // Initialize modal functionality
    initializeModal();
    
    // Initialize dropdowns
    initializeDropdowns();
    
    // Initialize navigation
    initializeNavigation();
    
    // Load entities from Supabase
    await loadEntities();
    
    // Add row click handlers
    initializeRowClickHandlers();
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
    rows.forEach(row => {
        row.addEventListener('click', function() {
            const entityId = this.dataset.entityId;
            const entityName = this.dataset.entityName;
            if (entityId) {
                showEntityChart(entityId, entityName);
            }
        });
    });
}

async function showEntityChart(entityId, entityName) {
    selectedEntity = { id: entityId, name: entityName };
    
    // Create modal content for chart
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    modalOverlay.classList.add('chart-modal');
    
    modalBody.innerHTML = `
        <div class="entity-header">
            <h2>${entityName}</h2>
            <p>View historical virality metrics and growth trends</p>
        </div>
        
        <div class="chart-container">
            <div class="chart-header-controls">
                <div class="chart-time-selector">
                    <button class="time-option active" data-range="7 days">7D</button>
                    <button class="time-option" data-range="30 days">30D</button>
                    <button class="time-option" data-range="3 months">3M</button>
                    <button class="time-option" data-range="6 months">6M</button>
                    <button class="time-option" data-range="1 year">1Y</button>
                    <button class="time-option" data-range="5 years">All</button>
                </div>
                <div class="forecast-toggle">
                    <label>
                        <input type="checkbox" id="forecastToggle"> 
                        Forecast
                    </label>
                </div>
            </div>
            
            <div class="metrics-toggle">
                <button class="metric-btn active" data-metric="total_virality">Total Virality</button>
                <button class="metric-btn" data-metric="website_virality">Website</button>
                <button class="metric-btn" data-metric="youtube_virality">YouTube</button>
                <button class="metric-btn" data-metric="x_virality">X (Twitter)</button>
                <button class="metric-btn" data-metric="volume">Volume</button>
            </div>
            
            <div id="virality-chart"></div>
        </div>
    `;
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load and display chart
    await loadChart(entityId, '7 days', 'total_virality');
    
    // Add event listeners
    initializeChartControls();
}

async function loadChart(entityId, timeRange, metricType) {
    try {
        // Fetch metrics data
        const metrics = await fetchEntityMetrics(entityId, timeRange);
        
        if (!metrics || metrics.length === 0) {
            document.getElementById('virality-chart').innerHTML = '<p>No data available for this time range</p>';
            return;
        }
        
        // Create or update chart
        if (currentChart) {
            currentChart.update(metrics, { metricType });
        } else {
            currentChart = new ViralityChart('virality-chart', metrics, {
                metricType,
                width: 850,
                height: 400
            });
            currentChart.init();
        }
    } catch (error) {
        console.error('Error loading chart:', error);
        document.getElementById('virality-chart').innerHTML = '<p>Error loading chart data</p>';
    }
}

function initializeChartControls() {
    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-option');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            // Update active state
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Reload chart
            const timeRange = this.dataset.range;
            const activeMetric = document.querySelector('.metric-btn.active').dataset.metric;
            await loadChart(selectedEntity.id, timeRange, activeMetric);
        });
    });
    
    // Metric buttons
    const metricButtons = document.querySelectorAll('.metric-btn');
    metricButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            // Update active state
            metricButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Reload chart
            const timeRange = document.querySelector('.time-option.active').dataset.range;
            const metricType = this.dataset.metric;
            await loadChart(selectedEntity.id, timeRange, metricType);
        });
    });
    
    // Forecast toggle
    const forecastToggle = document.getElementById('forecastToggle');
    if (forecastToggle) {
        forecastToggle.addEventListener('change', async function() {
            if (this.checked) {
                // Load forecast data
                const metricType = document.querySelector('.metric-btn.active').dataset.metric;
                const forecasts = await fetchEntityForecasts(selectedEntity.id, metricType);
                // Add forecast to chart (implement in chart.js)
            } else {
                // Remove forecast from chart
            }
        });
    }
}

// Initialize dropdowns with filter functionality
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        const options = dropdown.querySelectorAll('.dropdown-content a');
        
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
    const category = categoryBtn.textContent.trim().split(' ')[0];
    if (category !== 'Category' && category !== 'All') {
        filters.category = category;
    }
    
    // Get growth filter
    const growthBtn = document.querySelector('.dropdown:nth-child(3) .dropdown-btn');
    const growth = growthBtn.textContent.trim();
    if (growth.includes('%')) {
        filters.minGrowth = parseInt(growth.replace(/[^0-9]/g, ''));
    }
    
    // Get volume filter
    const volumeBtn = document.querySelector('.dropdown:nth-child(4) .dropdown-btn');
    const volume = volumeBtn.textContent.trim();
    if (volume.includes('K')) {
        filters.minVolume = parseInt(volume.replace(/[^0-9]/g, '')) * 1000;
    } else if (volume.includes('M')) {
        filters.minVolume = parseInt(volume.replace(/[^0-9]/g, '')) * 1000000;
    }
    
    // Get funding filter
    const fundingBtn = document.querySelector('.dropdown:nth-child(5) .dropdown-btn');
    const funding = fundingBtn.textContent.trim();
    if (funding.includes('$')) {
        const amount = funding.replace(/[^0-9]/g, '');
        if (funding.includes('M')) {
            filters.minFunding = parseInt(amount) * 1000000;
        } else if (funding.includes('B')) {
            filters.minFunding = parseInt(amount) * 1000000000;
        }
    }
    
    // Get round filter
    const roundBtn = document.querySelector('.dropdown:nth-child(6) .dropdown-btn');
    const round = roundBtn.textContent.trim().split(' ')[0];
    if (round !== 'Latest' && round !== 'Any') {
        filters.roundType = round;
    }
    
    // Reload entities with filters
    await loadEntities(filters);
}

// Initialize navigation
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Load content based on selection
            loadContent(this.textContent);
        });
    });
}

// Initialize modal functionality
function initializeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    
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
    modalOverlay.classList.remove('chart-modal');
    document.body.style.overflow = '';
    
    // Clean up chart
    if (currentChart) {
        currentChart = null;
    }
    selectedEntity = null;
}

// Function to load different content based on navigation
function loadContent(section) {
    console.log(`Loading content for: ${section}`);
    
    // Update page header based on selected section
    const pageHeader = document.querySelector('.page-header h1');
    const pageDescription = document.querySelector('.page-header p');
    
    // Show/hide appropriate content
    const filtersSection = document.querySelector('.filters-section');
    const tableContainer = document.querySelector('.table-container');
    
    switch(section.toLowerCase()) {
        case 'tracking':
            pageHeader.textContent = 'Tracking';
            pageDescription.textContent = 'Track your favorite AI applications and their growth metrics';
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showTrackingContent();
            break;
        case 'startups':
            pageHeader.textContent = 'AI Startups Directory';
            pageDescription.textContent = 'Comprehensive list of AI startups and emerging companies';
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            break;
        case 'unicorns':
            pageHeader.textContent = 'AI Unicorns';
            pageDescription.textContent = 'Billion-dollar AI companies leading the industry';
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            break;
        case 'reports':
            pageHeader.textContent = 'Viral AI Apps Weekly Reports';
            pageDescription.textContent = 'Weekly insights on viral AI trends.';
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showReportsContent();
            break;
        case 'api':
            pageHeader.textContent = 'API Documentation';
            pageDescription.textContent = 'Access our data programmatically with our REST API';
            filtersSection.style.display = 'none';
            tableContainer.style.display = 'none';
            showApiContent();
            break;
    }
}

// Placeholder functions for different sections
function showTrackingContent() {
    const mainContent = document.querySelector('.main-content');
    let trackingContainer = document.querySelector('.tracking-container');
    
    if (!trackingContainer) {
        trackingContainer = document.createElement('div');
        trackingContainer.className = 'tracking-container';
        trackingContainer.innerHTML = `
            <div class="coming-soon">
                <h2>Coming Soon</h2>
                <p>Track your favorite AI applications and get notified when they reach key milestones.</p>
            </div>
        `;
        mainContent.appendChild(trackingContainer);
    }
    
    trackingContainer.style.display = 'block';
}

function showReportsContent() {
    const mainContent = document.querySelector('.main-content');
    let reportsContainer = document.querySelector('.reports-container');
    
    if (!reportsContainer) {
        reportsContainer = document.createElement('div');
        reportsContainer.className = 'reports-container';
        reportsContainer.innerHTML = `
            <div class="newsletter-grid">
                <div class="newsletter-card">
                    <div class="newsletter-header">
                        <h3>Weekly Report #24</h3>
                        <span class="date">January 29, 2025</span>
                    </div>
                    <div class="newsletter-preview">
                        <p>This week: ChatGPT reaches 200M users, new AI coding assistants emerge, and breakthrough in multimodal AI...</p>
                    </div>
                    <a href="#" class="read-more">Read Full Report →</a>
                </div>
            </div>
        `;
        mainContent.appendChild(reportsContainer);
    }
    
    reportsContainer.style.display = 'block';
}

function showApiContent() {
    const mainContent = document.querySelector('.main-content');
    let apiContainer = document.querySelector('.api-container');
    
    if (!apiContainer) {
        apiContainer = document.createElement('div');
        apiContainer.className = 'api-container';
        apiContainer.innerHTML = `
            <div class="coming-soon">
                <h2>Coming Soon</h2>
                <p>Our API documentation and endpoints are currently under development.</p>
            </div>
        `;
        mainContent.appendChild(apiContainer);
    }
    
    apiContainer.style.display = 'block';
}