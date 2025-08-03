// Import Supabase functions
import { supabase, fetchEntities, fetchEntityMetrics, fetchEntityForecasts, formatNumber, formatGrowth, formatFunding } from './supabase-client.js';

// Global variables
let currentChart = null;
let selectedEntity = null;

// Add debugging
console.log('script-updated.js loaded');
console.log('Supabase client:', supabase);

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    // Initialize everything
    initializeApp();
});

async function initializeApp() {
    console.log('Initializing app...');
    
    try {
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
        
        // Set up real-time subscriptions
        console.log('Setting up real-time subscriptions...');
        setupRealtimeSubscriptions();
        
        console.log('App initialization complete!');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}

async function loadEntities(filters = {}) {
    try {
        console.log('Loading entities with filters:', filters);
        
        // Add a loading message
        const tbody = document.querySelector('.content-table tbody');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">Loading data from Supabase...</td></tr>';
        }
        
        const entities = await fetchEntities(filters);
        console.log('Loaded entities:', entities.length, 'items');
        console.log('First entity:', entities[0]);
        
        if (entities.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No data found. Check console for errors.</td></tr>';
        } else {
            updateTable(entities);
        }
    } catch (error) {
        console.error('Error loading entities:', error);
        const tbody = document.querySelector('.content-table tbody');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Error loading data: ${error.message}</td></tr>`;
        }
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
        
        // Determine growth class based on value
        const growthClass = entity.growth_rate_30d > 0 ? 'growth-positive' : 'growth-negative';
        
        // Handle category which is an array
        const primaryCategory = Array.isArray(entity.category) && entity.category.length > 0 
            ? entity.category[0] 
            : (entity.category || 'General AI');
        
        // Add category column with proper styling
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
    
    // Fetch entity details from Supabase
    const entity = await fetchEntityDetails(entityId);
    
    // Create modal content for detail page
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    modalOverlay.classList.add('detail-modal');
    
    modalBody.innerHTML = `
        <div class="detail-page">
            <!-- Header Section -->
            <div class="detail-header">
                <div class="detail-title-section">
                    <h1>${entity.name}</h1>
                    <p class="detail-description">${entity.description || entity.short_description || 'Innovative AI solution transforming the industry'}</p>
                </div>
                <div class="detail-metrics">
                    <div class="metric-card">
                        <div class="metric-value">${formatNumber(entity.volume)}</div>
                        <div class="metric-label">Volume <span class="info-icon" title="Monthly active users">ⓘ</span></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value growth-positive">${formatGrowth(entity.growth_rate_30d)}</div>
                        <div class="metric-label">Growth <span class="info-icon" title="30-day growth rate">ⓘ</span></div>
                    </div>
                </div>
            </div>
            
            <!-- Company Info Section -->
            <div class="detail-info-row">
                <div class="info-item">
                    <span class="info-label">Website</span>
                    <a href="${entity.website || '#'}" target="_blank" class="info-value link">${entity.website || 'pyroscope.io'}</a>
                </div>
                <div class="info-item">
                    <span class="info-label">Social Media</span>
                    <div class="social-links">
                        ${entity.twitter ? `<a href="${entity.twitter}" target="_blank" class="social-link">𝕏</a>` : ''}
                        ${entity.linkedin ? `<a href="${entity.linkedin}" target="_blank" class="social-link">in</a>` : ''}
                        ${entity.youtube ? `<a href="${entity.youtube}" target="_blank" class="social-link">▶</a>` : ''}
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-label">Total Funding</span>
                    <span class="info-value">${formatFunding(entity.latest_funding_amount) || 'Undisclosed'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Latest Round</span>
                    <span class="info-value">${entity.latest_round_type || 'Seed'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Location</span>
                    <span class="info-value">${entity.location || 'Oakland, United States, North America'}</span>
                </div>
            </div>
            
            <!-- Chart Section -->
            <div class="detail-chart-container">
                <div class="chart-header-controls">
                    <div class="chart-time-selector">
                        <button class="time-option" data-range="7 days">7D</button>
                        <button class="time-option" data-range="30 days">30D</button>
                        <button class="time-option" data-range="3 months">3M</button>
                        <button class="time-option" data-range="6 months">6M</button>
                        <button class="time-option" data-range="1 year">1Y</button>
                        <button class="time-option active" data-range="5 years">5 Years</button>
                    </div>
                    <div class="chart-actions">
                        <button class="btn-icon forecast-btn" title="Toggle Forecast">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 10L7 6L11 10L17 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                <path d="M13 4H17V8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Forecast
                        </button>
                        <span class="info-icon" title="AI-powered growth forecast">ⓘ</span>
                    </div>
                </div>
                <div id="detail-virality-chart"></div>
            </div>
            
            <!-- Bottom Section with Channel Breakdown and Indicators -->
            <div class="detail-bottom-section">
                <!-- Channel Breakdown -->
                <div class="channel-breakdown-card">
                    <h3>Channel Breakdown <span class="info-icon" title="Traffic sources distribution">ⓘ</span></h3>
                    <div class="channel-list">
                        ${generateChannelBreakdown(entity.channels || getDefaultChannels())}
                    </div>
                </div>
                
                <!-- Key Indicators -->
                <div class="indicators-card">
                    <h3>Key Indicators</h3>
                    <div class="indicator-list">
                        <div class="indicator-item">
                            <div class="indicator-label">GROWTH <span class="info-icon" title="Growth trajectory">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn ${entity.growth_indicator === 'exploding' ? 'active' : ''}">EXPLODING</button>
                                <button class="indicator-btn ${entity.growth_indicator === 'regular' ? 'active' : ''}">REGULAR</button>
                                <button class="indicator-btn ${entity.growth_indicator === 'peaked' ? 'active' : ''}">PEAKED</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">SPEED <span class="info-icon" title="Growth acceleration">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn ${entity.speed_indicator === 'exponential' ? 'active' : ''}">EXPONENTIAL</button>
                                <button class="indicator-btn ${entity.speed_indicator === 'constant' ? 'active' : ''}">CONSTANT</button>
                                <button class="indicator-btn ${entity.speed_indicator === 'stationary' ? 'active' : ''}">STATIONARY</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">SEASONALITY <span class="info-icon" title="Seasonal patterns">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn ${entity.seasonality === 'high' ? 'active' : ''}">HIGH</button>
                                <button class="indicator-btn ${entity.seasonality === 'medium' ? 'active' : ''}">MEDIUM</button>
                                <button class="indicator-btn ${entity.seasonality === 'low' ? 'active' : ''}">LOW</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">VOLATILITY <span class="info-icon" title="Growth stability">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn ${entity.volatility === 'high' ? 'active' : ''}">HIGH</button>
                                <button class="indicator-btn ${entity.volatility === 'average' ? 'active' : ''}">AVERAGE</button>
                                <button class="indicator-btn ${entity.volatility === 'low' ? 'active' : ''}">LOW</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Category Box -->
                <div class="category-box-card">
                    <h3>Category</h3>
                    <div class="category-display">
                        <span class="category-tag category-${getCategoryClass(entity.category)}">${entity.category || 'General AI'}</span>
                    </div>
                    <div class="related-categories">
                        <p class="related-label">Related:</p>
                        ${generateRelatedCategories(entity.category)}
                    </div>
                </div>
            </div>
            
            <!-- Export/Track Actions -->
            <div class="detail-actions">
                <button class="btn btn-secondary export-btn">Export To CSV</button>
                <button class="btn btn-primary track-btn">Track Topic</button>
            </div>
        </div>
    `;
    
    // Show modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load and display chart
    await loadDetailChart(entityId, '5 years');
    
    // Initialize controls
    initializeDetailControls();
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
    console.log('Found navigation items:', navItems.length);
    
    navItems.forEach((item, index) => {
        console.log(`Setting up click listener for item ${index}:`, item.textContent);
        item.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Navigation clicked:', this.textContent);
            
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
    modalOverlay.classList.remove('detail-modal');
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
    
    // Clear any custom content first
    clearCustomContent();
    
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
            // Reload entities for startups
            loadEntities({ type: 'startup' });
            break;
        case 'unicorns':
            pageHeader.textContent = 'AI Unicorns';
            pageDescription.textContent = 'Billion-dollar AI companies leading the industry';
            filtersSection.style.display = 'block';
            tableContainer.style.display = 'block';
            // Load only unicorns (companies with $1B+ valuation)
            loadEntities({ minValuation: 1000000000 });
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

function clearCustomContent() {
    const customContent = document.querySelector('.custom-content');
    if (customContent) {
        customContent.remove();
    }
}

// Placeholder functions for different sections
function showTrackingContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="coming-soon" style="text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px; margin-top: 20px;">
            <h2 style="color: #2d3748; margin-bottom: 16px;">🎯 Personal Tracking Dashboard</h2>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">Track your favorite AI applications and get notified when they reach key milestones.</p>
            <p style="color: #718096; font-size: 14px;">Coming Soon - Stay Tuned!</p>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function showReportsContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="newsletter-grid" style="margin-top: 20px;">
            <div class="newsletter-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div class="newsletter-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: #2d3748; margin: 0;">📊 Weekly Report #24</h3>
                    <span class="date" style="color: #718096; font-size: 14px;">January 29, 2025</span>
                </div>
                <div class="newsletter-preview" style="margin-bottom: 16px;">
                    <p style="color: #4a5568; line-height: 1.6; margin: 0;">This week: ChatGPT reaches 200M users, new AI coding assistants emerge, and breakthrough in multimodal AI technology reshapes the industry landscape...</p>
                </div>
                <a href="#" class="read-more" style="color: #FF4500; text-decoration: none; font-weight: 500;">Read Full Report →</a>
            </div>
            <div class="newsletter-card" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <div class="newsletter-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="color: #2d3748; margin: 0;">📈 Weekly Report #23</h3>
                    <span class="date" style="color: #718096; font-size: 14px;">January 22, 2025</span>
                </div>
                <div class="newsletter-preview" style="margin-bottom: 16px;">
                    <p style="color: #4a5568; line-height: 1.6; margin: 0;">Major AI funding rounds this week, including $50M Series B for leading AI video platform, plus analysis of emerging trends in AI-powered productivity tools...</p>
                </div>
                <a href="#" class="read-more" style="color: #FF4500; text-decoration: none; font-weight: 500;">Read Full Report →</a>
            </div>
        </div>
    `;
    mainContent.appendChild(customContent);
}

function showApiContent() {
    const mainContent = document.querySelector('.main-content');
    const customContent = document.createElement('div');
    customContent.className = 'custom-content';
    customContent.innerHTML = `
        <div class="api-docs" style="margin-top: 20px;">
            <div class="api-section" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h3 style="color: #2d3748; margin-bottom: 16px;">🚀 Get Started</h3>
                <p style="color: #4a5568; line-height: 1.6; margin-bottom: 16px;">Access our comprehensive AI startup database through our REST API.</p>
                <div class="code-block" style="background: #f7fafc; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                    <code style="color: #2d3748; font-family: 'Monaco', 'Consolas', monospace;">
                        GET https://api.viralaiapps.com/v1/startups<br>
                        Authorization: Bearer YOUR_API_KEY
                    </code>
                </div>
                <p style="color: #718096; font-size: 14px; margin: 0;">API documentation and endpoints are currently under development. Sign up to be notified when they're ready!</p>
            </div>
            <div class="api-section" style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h3 style="color: #2d3748; margin-bottom: 16px;">📋 Available Endpoints</h3>
                <ul style="color: #4a5568; line-height: 1.8; margin: 0; padding-left: 20px;">
                    <li>/startups - Get AI startup data</li>
                    <li>/unicorns - Get billion-dollar AI companies</li>
                    <li>/metrics - Get growth and usage metrics</li>
                    <li>/forecasts - Get AI-powered growth predictions</li>
                </ul>
            </div>
        </div>
    `;
    mainContent.appendChild(customContent);
}

// Helper function to fetch entity details
async function fetchEntityDetails(entityId) {
    try {
        const { data, error } = await supabase
            .from('entity_current_status')
            .select('*')
            .eq('id', entityId)
            .single();
            
        if (error) throw error;
        
        // Set default indicators based on growth if not present
        if (!data.growth_indicator) {
            const growth = parseFloat(data.growth_rate_30d) || 0;
            data.growth_indicator = growth > 1000 ? 'exploding' : growth > 100 ? 'regular' : 'peaked';
        }
        
        if (!data.speed_indicator) {
            data.speed_indicator = data.growth_indicator === 'exploding' ? 'exponential' : 'constant';
        }
        
        if (!data.seasonality) {
            data.seasonality = 'medium'; // Default
        }
        
        if (!data.volatility) {
            data.volatility = 'average'; // Default
        }
        
        // Handle category array
        if (Array.isArray(data.category) && data.category.length > 0) {
            data.category = data.category[0];
        } else if (!data.category) {
            data.category = 'General AI';
        }
        
        // Map website_url to website for compatibility
        data.website = data.website_url;
        data.twitter = data.x_url;
        data.linkedin = data.linkedin_url;
        data.youtube = data.youtube_url;
        
        return data;
    } catch (error) {
        console.error('Error fetching entity details:', error);
        // Return mock data for development
        return {
            id: entityId,
            name: 'Company Name',
            description: 'AI-powered solution',
            volume: 2900,
            growth_rate_30d: 9900,
            website: 'https://example.com',
            category: 'General AI',
            growth_indicator: 'exploding',
            speed_indicator: 'exponential',
            seasonality: 'high',
            volatility: 'low'
        };
    }
}

// Generate channel breakdown HTML
function generateChannelBreakdown(channels) {
    const defaultChannels = [
        { name: 'LinkedIn', icon: 'in', percentage: 15 },
        { name: 'TikTok', icon: '♪', percentage: 45 },
        { name: 'YouTube', icon: '▶', percentage: 35 },
        { name: 'Instagram', icon: '◧', percentage: 25 },
        { name: 'X', icon: '𝕏', percentage: 12 },
        { name: 'Facebook', icon: 'f', percentage: 30 },
        { name: 'Reddit', icon: '®', percentage: 8 },
        { name: 'Pinterest', icon: 'P', percentage: 40 }
    ];
    
    const channelsToUse = channels.length > 0 ? channels : defaultChannels;
    
    return channelsToUse.map(channel => `
        <div class="channel-item">
            <div class="channel-icon">${channel.icon}</div>
            <div class="channel-bar">
                <div class="channel-fill" style="width: ${channel.percentage}%"></div>
            </div>
        </div>
    `).join('');
}

// Get default channels if none provided
function getDefaultChannels() {
    return [];
}

// Get category class for styling
function getCategoryClass(category) {
    // Normalize category string
    if (!category) return 'slate';
    
    const normalizedCategory = category.toLowerCase().replace(/[\s&]+/g, '-');
    
    const categoryMap = {
        'general-chatbots': 'teal',
        'writing': 'teal',
        'research': 'teal',
        'browser': 'teal',
        'translation': 'teal',
        'reader': 'teal',
        'image-gen': 'orange',
        'video-gen': 'orange',
        'voice-gen': 'orange',
        'avatar-gen': 'orange',
        'workflow': 'navy',
        'office-tools-productivity': 'navy',
        'prompts': 'navy',
        'memory': 'navy',
        'organize': 'navy',
        'build-code': 'dark',
        'design-ui': 'dark',
        'marketing-seo': 'bronze',
        'sales-crm': 'bronze',
        'companion': 'maroon',
        'music': 'maroon',
        'finance': 'maroon',
        'mobile': 'maroon',
        'architect': 'maroon',
        'llms': 'slate',
        'training': 'slate',
        'benchmark': 'slate',
        'apis': 'slate',
        'enterprise': 'slate',
        'security': 'slate',
        'health': 'slate'
    };
    
    return categoryMap[normalizedCategory] || 'slate';
}

// Set up real-time subscriptions for database changes
function setupRealtimeSubscriptions() {
    // Subscribe to changes in entity_current_status view
    // Note: Supabase doesn't support direct subscriptions to views,
    // so we'll subscribe to the underlying tables
    
    // Subscribe to entities table changes
    const entitiesSubscription = supabase
        .channel('entities-changes')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'entities' 
        }, handleEntityChange)
        .subscribe();
    
    // Subscribe to daily_metrics table changes
    const metricsSubscription = supabase
        .channel('metrics-changes')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'daily_metrics' 
        }, handleMetricsChange)
        .subscribe();
    
    // Subscribe to funding_rounds table changes
    const fundingSubscription = supabase
        .channel('funding-changes')
        .on('postgres_changes', { 
            event: '*', 
            schema: 'public', 
            table: 'funding_rounds' 
        }, handleFundingChange)
        .subscribe();
    
    console.log('Real-time subscriptions set up successfully');
}

// Handle entity table changes
function handleEntityChange(payload) {
    console.log('Entity change detected:', payload);
    // Reload the entities to reflect the change
    loadEntities();
}

// Handle metrics table changes
function handleMetricsChange(payload) {
    console.log('Metrics change detected:', payload);
    // Reload entities to get updated metrics
    loadEntities();
}

// Handle funding table changes
function handleFundingChange(payload) {
    console.log('Funding change detected:', payload);
    // Reload entities to get updated funding info
    loadEntities();
}

// Generate related categories
function generateRelatedCategories(mainCategory) {
    const relatedMap = {
        'General chatbots': ['Writing', 'Research'],
        'Image gen': ['Video gen', 'Avatar gen'],
        'Build & code': ['Design & UI', 'APIs']
    };
    
    const related = relatedMap[mainCategory] || ['AI Tools', 'Productivity'];
    return related.map(cat => 
        `<span class="related-category">${cat}</span>`
    ).join('');
}

// Load chart for detail page
async function loadDetailChart(entityId, timeRange) {
    try {
        const metrics = await fetchEntityMetrics(entityId, timeRange);
        
        if (!metrics || metrics.length === 0) {
            document.getElementById('detail-virality-chart').innerHTML = '<p>No data available</p>';
            return;
        }
        
        // Create chart with detail page specific config
        if (currentChart) {
            currentChart.update(metrics, { showGrid: true });
        } else {
            currentChart = new ViralityChart('detail-virality-chart', metrics, {
                width: 900,
                height: 350,
                showGrid: true,
                color: '#4F46E5'
            });
            currentChart.init();
        }
    } catch (error) {
        console.error('Error loading detail chart:', error);
    }
}

// Initialize detail page controls
function initializeDetailControls() {
    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-option');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', async function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            await loadDetailChart(selectedEntity.id, this.dataset.range);
        });
    });
    
    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportToCSV);
    }
    
    // Track button
    const trackBtn = document.querySelector('.track-btn');
    if (trackBtn) {
        trackBtn.addEventListener('click', trackTopic);
    }
    
    // Forecast button
    const forecastBtn = document.querySelector('.forecast-btn');
    if (forecastBtn) {
        forecastBtn.addEventListener('click', toggleForecast);
    }
}

// Export functionality
function exportToCSV() {
    // Implementation for CSV export
    console.log('Exporting to CSV...');
    alert('Export functionality coming soon!');
}

// Track topic functionality
function trackTopic() {
    console.log('Tracking topic...');
    alert('Tracking functionality coming soon!');
}

// Toggle forecast
function toggleForecast() {
    this.classList.toggle('active');
    // Add forecast logic here
}

// Make supabase available globally for debugging
window.supabase = supabase;