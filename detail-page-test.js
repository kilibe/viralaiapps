// Detail page functionality for individual startup pages
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading detail page...');
    
    // Get startup data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const entityId = urlParams.get('id');
    const entityName = urlParams.get('name');
    
    if (entityId && entityName) {
        loadStartupDetails(entityId, entityName);
    } else {
        showError('Startup information not found');
    }
});

async function loadStartupDetails(entityId, entityName) {
    try {
        console.log('Loading details for:', entityId, entityName);
        
        // Check if this is a generated test ID
        if (entityId.startsWith('entity-')) {
            console.log('Using mock data for test entity');
            const mockStartup = createMockStartupData(entityId, entityName);
            displayStartupDetails(mockStartup);
            return;
        }
        
        // Try to fetch from Supabase for real IDs
        const { data: startup, error } = await supabase
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .single();
        
        if (error) {
            console.error('Error fetching startup data:', error);
            // Fallback to mock data if Supabase fails
            const mockStartup = createMockStartupData(entityId, entityName);
            displayStartupDetails(mockStartup);
            return;
        }
        
        if (startup) {
            displayStartupDetails(startup);
        } else {
            console.log('No startup found, using mock data');
            const mockStartup = createMockStartupData(entityId, entityName);
            displayStartupDetails(mockStartup);
        }
    } catch (error) {
        console.error('Error loading startup details:', error);
        // Fallback to mock data on any error
        const mockStartup = createMockStartupData(entityId, entityName);
        displayStartupDetails(mockStartup);
    }
}

function createMockStartupData(entityId, entityName) {
    // Create realistic mock data based on the entity name
    const mockData = {
        id: entityId,
        name: entityName,
        short_description: getMockDescription(entityName),
        volume: getMockVolume(entityName),
        growth_rate_30d: getMockGrowth(entityName),
        latest_funding_amount: getMockFunding(entityName),
        latest_round_type: getMockRoundType(entityName),
        location: 'San Francisco, CA',
        website: `${entityName.toLowerCase().replace(/\s+/g, '')}.com`,
        category: getMockCategory(entityName)
    };
    
    console.log('Created mock data:', mockData);
    return mockData;
}

function getMockDescription(name) {
    const descriptions = {
        'ChatGPT': 'AI-powered conversational assistant for various tasks and creative writing',
        'Midjourney': 'AI image generation platform for creative professionals and artists',
        'Stable Diffusion': 'Open-source AI model for text-to-image generation and creative content',
        'Notion AI': 'AI writing assistant integrated into productivity workspace and note-taking',
        'GitHub Copilot': 'AI-powered code completion and programming assistant for developers'
    };
    return descriptions[name] || `Innovative AI solution transforming the ${name} industry`;
}

function getMockVolume(name) {
    const volumes = {
        'ChatGPT': 100000000,
        'Midjourney': 15000000,
        'Stable Diffusion': 10000000,
        'Notion AI': 30000000,
        'GitHub Copilot': 5000000
    };
    return volumes[name] || Math.floor(Math.random() * 50000000) + 1000000;
}

function getMockGrowth(name) {
    const growths = {
        'ChatGPT': 2340,
        'Midjourney': 1890,
        'Stable Diffusion': 1567,
        'Notion AI': 987,
        'GitHub Copilot': 745
    };
    return growths[name] || Math.floor(Math.random() * 1000) + 100;
}

function getMockFunding(name) {
    const fundings = {
        'ChatGPT': 11300000000,
        'Midjourney': 200000000,
        'Stable Diffusion': 101000000,
        'Notion AI': 343000000,
        'GitHub Copilot': null
    };
    return fundings[name] !== undefined ? fundings[name] : Math.floor(Math.random() * 500000000) + 10000000;
}

function getMockRoundType(name) {
    const rounds = {
        'ChatGPT': 'Series C',
        'Midjourney': 'Series A',
        'Stable Diffusion': 'Seed',
        'Notion AI': 'Series C',
        'GitHub Copilot': 'Microsoft'
    };
    return rounds[name] || 'Series A';
}

function getMockCategory(name) {
    const categories = {
        'ChatGPT': 'General chatbots',
        'Midjourney': 'Image gen',
        'Stable Diffusion': 'Image gen',
        'Notion AI': 'Office tools & productivity',
        'GitHub Copilot': 'Build & code'
    };
    return categories[name] || 'General AI';
}

function displayStartupDetails(startup) {
    const detailContent = document.getElementById('detail-content');
    
    // Update page title
    document.title = `${startup.name} - Viral AI Apps`;
    
    detailContent.innerHTML = `
        <div class="detail-page">
            <!-- Header Section -->
            <div class="detail-header">
                <div class="detail-title-section">
                    <h1>${startup.name}</h1>
                    <p class="detail-description">${startup.short_description || 'Innovative AI solution transforming the industry'}</p>
                </div>
                <div class="detail-metrics">
                    <div class="metric-card">
                        <div class="metric-value">${formatNumber(startup.volume || 0)}</div>
                        <div class="metric-label">Volume <span class="info-icon" title="Monthly active users">ⓘ</span></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value growth-positive">${formatGrowth(startup.growth_rate_30d || 0)}</div>
                        <div class="metric-label">Growth <span class="info-icon" title="30-day growth rate">ⓘ</span></div>
                    </div>
                </div>
            </div>
            
            <!-- Company Info Section -->
            <div class="detail-info-row">
                <div class="info-item">
                    <span class="info-label">Website</span>
                    <a href="#" class="info-value link">${startup.website || startup.name.toLowerCase().replace(/\s+/g, '') + '.io'}</a>
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
                    <span class="info-value">${formatFunding(startup.latest_funding_amount)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Latest Round</span>
                    <span class="info-value">${startup.latest_round_type || 'Seed'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Location</span>
                    <span class="info-value">${startup.location || 'San Francisco, CA'}</span>
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
                        <span class="category-tag category-teal">${startup.category || 'General AI'}</span>
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
    
    // Initialize controls
    initializeDetailControls();
}

function showError(message) {
    const detailContent = document.getElementById('detail-content');
    detailContent.innerHTML = `
        <div class="error-container">
            <h2>Error</h2>
            <p>${message}</p>
            <a href="index-test.html" class="btn btn-primary">Back to Startups</a>
        </div>
    `;
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

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatGrowth(growth) {
    if (growth > 0) {
        return `+${growth.toFixed(1)}%`;
    } else if (growth < 0) {
        return `${growth.toFixed(1)}%`;
    }
    return '0%';
}

function formatFunding(amount) {
    if (!amount || amount === 0) {
        return 'Undisclosed';
    }
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
}