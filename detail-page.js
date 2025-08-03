// Create a new script file that adds the detail page functionality
// This will work with the existing HTML table

// Wait for DOM to be fully loaded
// Make showDetailPage globally available
window.showDetailPage = showDetailPage;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Detail page functionality loaded');
    
    // Don't add handlers here since we're handling clicks in the main script
    // addDetailPageHandlers();
});

function addDetailPageHandlers() {
    // Get all clickable rows from the existing HTML
    const rows = document.querySelectorAll('.clickable-row');
    console.log('Found rows:', rows.length);
    
    rows.forEach(row => {
        row.addEventListener('click', function(e) {
            e.preventDefault();
            const entityName = this.dataset.entityName || 'Unknown';
            showDetailPage(entityName, this);
        });
    });
}

function showDetailPage(entityName, rowElement) {
    console.log('Showing detail page for:', entityName);
    
    // Extract data from the clicked row
    const cells = rowElement.querySelectorAll('td');
    const description = cells[0].querySelector('.app-description')?.textContent || '';
    const growth = cells[1]?.textContent || '+0%';
    const volume = cells[2]?.textContent || '0 users';
    const funding = cells[3]?.textContent || 'Undisclosed';
    const round = cells[4]?.textContent || 'Seed';
    const category = cells[5]?.querySelector('span')?.textContent || 'General AI';
    const categoryClass = cells[5]?.querySelector('span')?.className.replace('category-', '') || 'teal';
    
    // Get modal elements
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    
    if (!modalOverlay || !modalBody) {
        console.error('Modal elements not found');
        return;
    }
    
    // Add detail modal class
    modalOverlay.classList.add('detail-modal');
    
    // Create detail page content
    modalBody.innerHTML = `
        <div class="detail-page">
            <!-- Header Section -->
            <div class="detail-header">
                <div class="detail-title-section">
                    <h1>${entityName}</h1>
                    <p class="detail-description">${description || 'Innovative AI solution transforming the industry'}</p>
                </div>
                <div class="detail-metrics">
                    <div class="metric-card">
                        <div class="metric-value">${volume.replace(' users', '')}</div>
                        <div class="metric-label">Volume <span class="info-icon" title="Monthly active users">ⓘ</span></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value growth-positive">${growth}</div>
                        <div class="metric-label">Growth <span class="info-icon" title="30-day growth rate">ⓘ</span></div>
                    </div>
                </div>
            </div>
            
            <!-- Company Info Section -->
            <div class="detail-info-row">
                <div class="info-item">
                    <span class="info-label">Website</span>
                    <a href="#" class="info-value link">${entityName.toLowerCase().replace(/\s+/g, '')}.io</a>
                </div>
                <div class="info-item">
                    <span class="info-label">Social Media</span>
                    <div class="social-links">
                        <a href="#" class="social-link">𝕏</a>
                        <a href="#" class="social-link">in</a>
                        <a href="#" class="social-link">▶</a>
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-label">Total Funding</span>
                    <span class="info-value">${funding}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Latest Round</span>
                    <span class="info-value">${round}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Location</span>
                    <span class="info-value">San Francisco, CA</span>
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
                <div id="detail-virality-chart">
                    <svg width="100%" height="350" viewBox="0 0 900 350">
                        <!-- Simple chart placeholder -->
                        <path d="M50 300 L150 250 L250 200 L350 180 L450 150 L550 120 L650 100 L750 80 L850 50" 
                              stroke="#4F46E5" stroke-width="3" fill="none"/>
                        <line x1="50" y1="300" x2="850" y2="300" stroke="#e5e7eb" stroke-width="1"/>
                        <text x="450" y="330" text-anchor="middle" fill="#6b7280" font-size="14">Time →</text>
                        <text x="30" y="175" text-anchor="middle" fill="#6b7280" font-size="14" transform="rotate(-90 30 175)">Growth →</text>
                    </svg>
                </div>
            </div>
            
            <!-- Bottom Section with Channel Breakdown and Indicators -->
            <div class="detail-bottom-section">
                <!-- Channel Breakdown -->
                <div class="channel-breakdown-card">
                    <h3>Channel Breakdown <span class="info-icon" title="Traffic sources distribution">ⓘ</span></h3>
                    <div class="channel-list">
                        <div class="channel-item">
                            <div class="channel-icon">in</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 15%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">♪</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 45%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">▶</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 35%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">◧</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 25%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">𝕏</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 12%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">f</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 30%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">®</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 8%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">P</div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 40%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Key Indicators -->
                <div class="indicators-card">
                    <h3>Key Indicators</h3>
                    <div class="indicator-list">
                        <div class="indicator-item">
                            <div class="indicator-label">GROWTH <span class="info-icon" title="Growth trajectory">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn active">EXPLODING</button>
                                <button class="indicator-btn">REGULAR</button>
                                <button class="indicator-btn">PEAKED</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">SPEED <span class="info-icon" title="Growth acceleration">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn active">EXPONENTIAL</button>
                                <button class="indicator-btn">CONSTANT</button>
                                <button class="indicator-btn">STATIONARY</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">SEASONALITY <span class="info-icon" title="Seasonal patterns">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn active">HIGH</button>
                                <button class="indicator-btn">MEDIUM</button>
                                <button class="indicator-btn">LOW</button>
                            </div>
                        </div>
                        <div class="indicator-item">
                            <div class="indicator-label">VOLATILITY <span class="info-icon" title="Growth stability">ⓘ</span></div>
                            <div class="indicator-buttons">
                                <button class="indicator-btn">HIGH</button>
                                <button class="indicator-btn">AVERAGE</button>
                                <button class="indicator-btn active">LOW</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Category Box -->
                <div class="category-box-card">
                    <h3>Category</h3>
                    <div class="category-display">
                        <span class="category-tag category-${categoryClass}">${category}</span>
                    </div>
                    <div class="related-categories">
                        <p class="related-label">Related:</p>
                        <span class="related-category">AI Tools</span>
                        <span class="related-category">Productivity</span>
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
    
    // Initialize controls
    initializeDetailControls();
}

function initializeDetailControls() {
    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-option');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Export button
    const exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Export functionality coming soon!');
        });
    }
    
    // Track button
    const trackBtn = document.querySelector('.track-btn');
    if (trackBtn) {
        trackBtn.addEventListener('click', () => {
            alert('Tracking functionality coming soon!');
        });
    }
    
    // Forecast button
    const forecastBtn = document.querySelector('.forecast-btn');
    if (forecastBtn) {
        forecastBtn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
}

// Update the close modal function if it exists
const originalCloseModal = window.closeModal;
window.closeModal = function() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('detail-modal');
    }
    if (originalCloseModal) {
        originalCloseModal();
    }
};