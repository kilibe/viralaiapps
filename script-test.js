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
    console.log('Initializing app...');
    
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
            if (entityId && entityName) {
                // Navigate to detail page instead of showing popup
                window.location.href = `detail-test.html?id=${encodeURIComponent(entityId)}&name=${encodeURIComponent(entityName)}`;
            }
        });
    });
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