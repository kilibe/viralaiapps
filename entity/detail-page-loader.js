// Get entity ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const entityId = urlParams.get('id');
const entityName = urlParams.get('name');

// Supabase configuration
const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8';

// Global variables
let allHistoricalData = []; // Store all historical data
let currentTimeRange = '7 days'; // Current selected time range - default to 7 days
let entityData = null; // Store entity data globally

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
        
        // Get ALL historical metrics for chart (we'll filter client-side)
        const { data: historicalMetrics } = await supabaseClient
            .from('daily_metrics')
            .select('metric_date, volume, total_virality')
            .eq('entity_id', entityId)
            .order('metric_date', { ascending: true });
        
        // Store all historical data globally
        allHistoricalData = historicalMetrics || [];
        entityData = entity;
        
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
                <div class="detail-metrics-wrapper">
                    <div class="detail-metrics">
                        <div class="metric-card">
                            <div class="metric-value">${formatNumber(virality)}</div>
                            <div class="metric-label">Virality <span class="info-icon" title="Total virality score">ⓘ</span></div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-value ${growth > 0 ? 'growth-positive' : growth < 0 ? 'growth-negative' : ''}">${growth > 0 ? '+' : ''}${parseFloat(growth).toFixed(0)}%</div>
                            <div class="metric-label">Growth <span class="info-icon" title="30-day growth rate">ⓘ</span></div>
                        </div>
                    </div>
                    <!-- Company Info Box below metrics -->
                    <div class="company-info-box">
                        <div class="info-box-content">
                            <strong>Website:</strong> <a href="${entity.website_url || '#'}" target="_blank" class="info-link">${entity.website_url || 'Not available'}</a><br>
                            <strong>Social Media:</strong> 
                            ${entity.x_url ? `<a href="${entity.x_url}" target="_blank" class="social-inline-link">𝕏</a>` : ''}
                            ${entity.linkedin_url ? `<a href="${entity.linkedin_url}" target="_blank" class="social-inline-link">in</a>` : ''}
                            ${entity.youtube_url ? `<a href="${entity.youtube_url}" target="_blank" class="social-inline-link">▶</a>` : ''}<br>
                            <strong>Total Funding:</strong> ${formatNumber(fundingAmount)}<br>
                            <strong>Latest Round:</strong> ${latestFunding.round_type || 'N/A'}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Chart Section -->
            <div class="detail-chart-container">
                <div class="chart-header-controls">
                    <div class="chart-time-selector">
                        <button class="time-option" data-range="any">Any Time</button>
                        <button class="time-option active" data-range="7 days">Last 7 days</button>
                        <button class="time-option" data-range="30 days">Last 30 days</button>
                        <button class="time-option" data-range="3 months">Last 3 months</button>
                        <button class="time-option" data-range="6 months">Last 6 months</button>
                        <button class="time-option" data-range="12 months">Last 12 months</button>
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
                        '<canvas id="growthChart" width="800" height="400" style="max-width: 100%; height: auto;"></canvas>' : 
                        `<div style="padding: 80px; text-align: center; color: #999;">
                            <h3>Virality Chart</h3>
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
                    <h3>Channel Virality <span class="info-icon" title="Traffic sources distribution">ⓘ</span></h3>
                    <div class="channel-list">
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 45%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 35%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 25%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF4500">
                                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                                </svg>
                            </div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 20%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#E4405F">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
                                </svg>
                            </div>
                            <div class="channel-bar">
                                <div class="channel-fill" style="width: 30%"></div>
                            </div>
                        </div>
                        <div class="channel-item">
                            <div class="channel-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="#000000">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                </svg>
                            </div>
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
                        <div class="related-categories-wrapper">
                            <span class="related-category">AI Tools</span>
                            <span class="related-category">Productivity</span>
                        </div>
                    </div>
                </div>
            </div>
            

        `;
        
        // Initialize chart with filtered data - default to 7 days
        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            updateChartWithTimeRange('7 days');
        }, 100);
        
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
    console.log('Drawing chart with data points:', historicalMetrics.length);
    const canvas = document.getElementById('growthChart');
    if (!canvas || !canvas.getContext) {
        console.error('Canvas element not found or canvas not supported');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 400;
    const padding = 60;
    const bottomPadding = 80; // Increased for rotated labels
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Get data points
    console.log('Raw historical metrics:', historicalMetrics);
    const data = historicalMetrics.map(d => ({
        date: new Date(d.metric_date),
        value: d.volume || 0
    }));
    console.log('Mapped data:', data);
    
    // Find min and max values
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - bottomPadding);
    ctx.lineTo(width - padding, height - bottomPadding);
    ctx.stroke();
    
    // Draw grid lines
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines (5 lines for 5 Y-axis labels)
    for (let i = 0; i <= 4; i++) {
        const y = padding + (height - bottomPadding - padding) * i / 4;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw line chart with gradient fill
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    
    // Create gradient fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - bottomPadding);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.02)');
    
    // Draw filled area
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - bottomPadding - ((point.value - minValue) / valueRange) * (height - bottomPadding - padding);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    // Complete the fill area
    ctx.lineTo(padding + (width - 2 * padding), height - bottomPadding);
    ctx.lineTo(padding, height - bottomPadding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw the line on top
    ctx.beginPath();
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        const y = height - bottomPadding - ((point.value - minValue) / valueRange) * (height - bottomPadding - padding);
        
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
        const y = height - bottomPadding - ((point.value - minValue) / valueRange) * (height - bottomPadding - padding);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Add labels
    ctx.fillStyle = '#666';
    ctx.font = '10px sans-serif';
    
    // X-axis labels - Add label for EACH data point
    const dateFormat = (date) => {
        return (date.getMonth() + 1) + '/' + date.getDate();
    };
    
    // Draw date label for each data point
    data.forEach((point, index) => {
        const x = padding + (width - 2 * padding) * index / (data.length - 1);
        ctx.save();
        ctx.translate(x, height - bottomPadding + 15);
        
        // Always rotate labels to fit better
        ctx.rotate(-45 * Math.PI / 180);
        ctx.textAlign = 'right';
        ctx.fillText(dateFormat(point.date), 0, 0);
        
        ctx.restore();
    });
    
    // Y-axis labels - Draw 5 labels (including top and bottom)
    ctx.textAlign = 'right';
    ctx.font = '11px sans-serif';
    const formatNumber = (num) => {
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return Math.round(num).toString();
    };
    
    // Draw 5 Y-axis labels matching the grid lines
    for (let i = 0; i <= 4; i++) {
        const value = minValue + (valueRange * (4 - i) / 4);
        const y = padding + (height - bottomPadding - padding) * i / 4;
        ctx.fillText(formatNumber(value), padding - 10, y + 5);
    }
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Virality Over Time', width / 2, padding - 20);
}

// Function to filter data based on time range
function filterDataByTimeRange(timeRange) {
    if (!allHistoricalData || allHistoricalData.length === 0) return [];
    
    if (timeRange === 'any') {
        return allHistoricalData;
    }
    
    const endDate = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
        case '7 days':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case '30 days':
            startDate.setDate(startDate.getDate() - 30);
            break;
        case '3 months':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
        case '6 months':
            startDate.setMonth(startDate.getMonth() - 6);
            break;
        case '12 months':
            startDate.setFullYear(startDate.getFullYear() - 1);
            break;
    }
    
    return allHistoricalData.filter(item => {
        const itemDate = new Date(item.metric_date);
        return itemDate >= startDate && itemDate <= endDate;
    });
}

// Function to update chart with new time range
function updateChartWithTimeRange(timeRange) {
    currentTimeRange = timeRange;
    const filteredData = filterDataByTimeRange(timeRange);
    
    // Update the chart
    if (filteredData && filteredData.length > 1) {
        drawVolumeChart(filteredData);
        
        // Calculate and update metrics for the selected time range
        updateMetricsForTimeRange(filteredData);
    } else {
        // Show no data message
        const chartContainer = document.getElementById('detail-virality-chart');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="padding: 80px; text-align: center; color: #999;">
                    <h3>Virality Chart</h3>
                    <p>${filteredData.length === 1 ? 
                        'Not enough data points in this time range' : 
                        'No data available for this time range'}</p>
                </div>
            `;
        }
        
        // Reset metrics to N/A
        updateMetricsForTimeRange([]);
    }
}

// Function to update metrics based on filtered data
function updateMetricsForTimeRange(filteredData) {
    const metricsContainer = document.querySelector('.detail-metrics');
    if (!metricsContainer) return;
    
    let virality = 0;
    let growth = 0;
    
    if (filteredData.length > 0) {
        // Get latest virality
        const latestData = filteredData[filteredData.length - 1];
        virality = latestData.total_virality || 0;
        
        // Calculate growth for the time range
        if (filteredData.length > 1) {
            const oldestData = filteredData[0];
            if (oldestData.total_virality > 0) {
                growth = ((latestData.total_virality - oldestData.total_virality) / oldestData.total_virality) * 100;
            }
        }
    }
    
    // Format values
    const formatNumber = (num) => {
        if (!num || num === 0) return 'N/A';
        if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };
    
    // Update the metrics display
    const viralityCard = metricsContainer.querySelector('.metric-card:first-child .metric-value');
    const growthCard = metricsContainer.querySelector('.metric-card:last-child .metric-value');
    
    if (viralityCard) {
        viralityCard.textContent = formatNumber(virality);
    }
    
    if (growthCard) {
        growthCard.textContent = `${growth > 0 ? '+' : ''}${parseFloat(growth).toFixed(0)}%`;
        growthCard.className = `metric-value ${growth > 0 ? 'growth-positive' : growth < 0 ? 'growth-negative' : ''}`;
    }
}

// Initialize detail controls
function initializeDetailControls() {
    // Time range buttons
    const timeButtons = document.querySelectorAll('.time-option');
    timeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            timeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get the time range and update the chart
            const timeRange = this.dataset.range;
            updateChartWithTimeRange(timeRange);
        });
    });
    
    // Export button - now in top bar
    const exportBtn = document.querySelector('.detail-top-bar .export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Export functionality coming soon!');
        });
    }
    
    // Track button - now in top bar
    const trackBtn = document.querySelector('.detail-top-bar .track-btn');
    if (trackBtn) {
        trackBtn.addEventListener('click', (e) => {
            e.preventDefault();
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