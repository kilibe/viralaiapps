// Get entity ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const entityId = urlParams.get('id');
const entityName = urlParams.get('name');

// Supabase configuration
const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8';

// Load entity details
async function loadEntityDetails() {
    const detailContent = document.getElementById('detail-content');
    
    if (!entityId) {
        detailContent.innerHTML = `
            <div class="error-container">
                <h2>Entity not found</h2>
                <p>No entity ID provided in the URL.</p>
                <a href="../index.html" class="btn btn-primary">Return to Directory</a>
            </div>
        `;
        return;
    }
    
    try {
        // Create Supabase client
        const { createClient } = window.supabase;
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        
        // Fetch entity details
        const { data: entity, error } = await supabaseClient
            .from('entities')
            .select('*')
            .eq('id', entityId)
            .single();
            
        if (error || !entity) {
            throw new Error('Entity not found');
        }
        
        // Update page title
        document.title = `${entity.name} - Viral AI Apps`;
        
        // Get metrics
        const { data: metrics } = await supabaseClient
            .from('daily_metrics')
            .select('*')
            .eq('entity_id', entityId)
            .order('metric_date', { ascending: false })
            .limit(1);
            
        // Get indicators
        const { data: indicators } = await supabaseClient
            .from('virality_indicators')
            .select('*')
            .eq('entity_id', entityId)
            .order('indicator_date', { ascending: false })
            .limit(1);
            
        // Get funding
        const { data: funding } = await supabaseClient
            .from('funding_rounds')
            .select('*')
            .eq('entity_id', entityId)
            .order('announced_date', { ascending: false })
            .limit(1);
        
        // Get historical metrics for chart
        const { data: historicalMetrics } = await supabaseClient
            .from('daily_metrics')
            .select('metric_date, volume')
            .eq('entity_id', entityId)
            .order('metric_date', { ascending: true })
            .limit(30);
        
        const latestMetric = metrics?.[0] || {};
        const latestIndicator = indicators?.[0] || {};
        const latestFunding = funding?.[0] || {};
        
        // Format values
        const formatNumber = (num) => {
            if (!num) return 'N/A';
            if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return num.toString();
        };
        
        const virality = latestMetric.total_virality || 0;
        const volume = latestMetric.volume || 0;
        const growth = latestIndicator.growth_rate_30d || 0;
        const fundingAmount = latestFunding.amount || 0;
        
        // Get category class
        const getCategoryClass = (category) => {
            const categoryMap = {
                'general chatbots': 'teal',
                'writing': 'teal',
                'research': 'teal',
                'browser': 'teal',
                'translation': 'teal',
                'reader': 'teal',
                'image gen': 'orange',
                'video gen': 'orange',
                'voice gen': 'orange',
                'avatar gen': 'orange',
                'workflow': 'navy',
                'office tools & productivity': 'navy',
                'prompts': 'navy',
                'memory': 'navy',
                'organize': 'navy',
                'build & code': 'dark',
                'design & ui': 'dark',
                'marketing & seo': 'bronze',
                'sales & crm': 'bronze',
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
            return categoryMap[category?.toLowerCase()] || 'slate';
        };
        
        // Render the detail page
        detailContent.innerHTML = `
            <!-- Header Section -->
            <div class="detail-header">
                <div class="detail-title-section">
                    <h1>${entity.name}</h1>
                    <p class="detail-description">${entity.long_description || entity.short_description || 'Innovative AI solution transforming the industry'}</p>
                </div>
                <div class="detail-metrics">
                    <div class="metric-card">
                        <div class="metric-value">${formatNumber(virality)}</div>
                        <div class="metric-label">Virality <span class="info-icon" title="Total virality score">ⓘ</span></div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-value ${growth > 0 ? 'growth-positive' : ''}">${growth > 0 ? '+' : ''}${parseFloat(growth).toFixed(0)}%</div>
                        <div class="metric-label">Growth <span class="info-icon" title="30-day growth rate">ⓘ</span></div>
                    </div>
                </div>
            </div>
            
            <!-- Company Info Section -->
            <div class="detail-info-row">
                <div class="info-item">
                    <span class="info-label">Website</span>
                    <a href="${entity.website_url || '#'}" target="_blank" class="info-value link">${entity.website_url || 'Not available'}</a>
                </div>
                <div class="info-item">
                    <span class="info-label">Social Media</span>
                    <div class="social-links">
                        ${entity.x_url ? `<a href="${entity.x_url}" target="_blank" class="social-link">𝕏</a>` : ''}
                        ${entity.linkedin_url ? `<a href="${entity.linkedin_url}" target="_blank" class="social-link">in</a>` : ''}
                        ${entity.youtube_url ? `<a href="${entity.youtube_url}" target="_blank" class="social-link">▶</a>` : ''}
                    </div>
                </div>
                <div class="info-item">
                    <span class="info-label">Total Funding</span>
                    <span class="info-value">${formatNumber(fundingAmount)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Latest Round</span>
                    <span class="info-value">${latestFunding.round_type || 'N/A'}</span>
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
                    ${historicalMetrics && historicalMetrics.length > 1 ? 
                        '<canvas id="growthChart" width="800" height="350"></canvas>' : 
                        `<div style="padding: 80px; text-align: center; color: #999;">
                            <h3>Volume Chart</h3>
                            <p>${historicalMetrics && historicalMetrics.length === 1 ? 
                                'Not enough historical data to display a chart' : 
                                'No historical data available for this entity'}</p>
                        </div>`
                    }
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
                        ${Array.isArray(entity.category) ? entity.category.map(cat => 
                            `<span class="category-tag category-${getCategoryClass(cat)}">${cat}</span>`
                        ).join('') : `<span class="category-tag category-${getCategoryClass(entity.category)}">${entity.category || 'AI'}</span>`}
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
        `;
        
        // Initialize chart if we have data
        if (historicalMetrics && historicalMetrics.length > 1) {
            setTimeout(() => {
                drawVolumeChart(historicalMetrics);
            }, 100);
        }
        
        // Initialize controls
        initializeDetailControls();
        
    } catch (error) {
        console.error('Error loading entity details:', error);
        detailContent.innerHTML = `
            <div class="error-container">
                <h2>Error loading entity</h2>
                <p>${error.message}</p>
                <a href="../index.html" class="btn btn-primary">Return to Directory</a>
            </div>
        `;
    }
}

// Draw volume chart
function drawVolumeChart(historicalMetrics) {
    const canvas = document.getElementById('growthChart');
    if (!canvas || !canvas.getContext) return;
    
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 350;
    const padding = 60;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get data points
    const data = historicalMetrics.map(d => ({
        date: new Date(d.metric_date),
        value: d.volume || 0
    }));
    
    // Find min and max values
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - 2 * padding) * i / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw line chart with gradient fill
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)');
    
    // Draw filled area
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    // Complete the fill area
    ctx.lineTo(padding + (width - 2 * padding), height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the line on top
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    
    // Draw points
    ctx.fillStyle = '#4F46E5';
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Add labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X-axis labels
    const dateFormat = (date) => {
        return (date.getMonth() + 1) + '/' + date.getDate();
    };
    
    ctx.fillText(dateFormat(data[0].date), padding, height - padding + 20);
    ctx.fillText(dateFormat(data[data.length - 1].date), width - padding, height - padding + 20);
    
    // Y-axis labels
    ctx.textAlign = 'right';
    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };
    
    ctx.fillText(formatNumber(maxValue), padding - 10, padding + 5);
    ctx.fillText(formatNumber(minValue), padding - 10, height - padding + 5);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Volume Over Time', width / 2, padding - 20);
}

// Initialize detail controls
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

// Load entity details when page loads
document.addEventListener('DOMContentLoaded', loadEntityDetails);