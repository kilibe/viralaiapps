// Global variables for filtering
let originalEntities = []; // Store original entities with their categories
let allEntities = [];
let allMetrics = {}; // Store all metrics data
let currentFilters = {
    timeFrame: 7, // Default to 7 days
    category: null,
    minGrowth: null,
    minVirality: null,
    minFunding: window.defaultMinFunding || null, // Use default if set (for unicorns page)
    roundType: null
};

// Make these available globally for navigation
window.allEntities = allEntities;
window.currentFilters = currentFilters;

// Initialize Supabase and load data directly
(async function() {
    // Check if we should load data based on the active navigation
    function shouldLoadTableData() {
        const activeNav = document.querySelector('.nav-item.active');
        if (!activeNav) return true; // Default to loading if no active nav
        
        const activeText = activeNav.textContent.toLowerCase();
        // Only load table data for startups and unicorns pages
        return activeText === 'startups' || activeText === 'unicorns';
    }
    
    // Don't load if we're not on a page that needs the table
    if (!shouldLoadTableData()) {
        console.log('Skipping table data load - not on startups/unicorns page');
        return;
    }
    
    console.log('Starting direct data load...');
    
    const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8';
    
    try {
        // Create Supabase client
        const { createClient } = window.supabase;
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        
        // Fetch entities
        const { data: entities, error } = await supabaseClient
            .from('entities')
            .select('*');
            
        console.log('Query result:', { entities, error });
        
        if (error) {
            throw error;
        }
        
        if (!entities || entities.length === 0) {
            document.getElementById('table-body').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No data found in database</td></tr>';
            return;
        }
        
        // Store original entities with their categories preserved
        originalEntities = entities.map(entity => ({
            ...entity,
            display_category: Array.isArray(entity.category) && entity.category.length > 0 ? entity.category[0] : 'AI'
        }));
        
        // Initialize allEntities as a copy of originalEntities
        allEntities = [...originalEntities];
        window.allEntities = allEntities; // Update global reference
        
        // Load ALL metrics data upfront
        await loadAllMetrics();
        
        // Calculate metrics for default time frame (7 days)
        calculateMetricsForTimeFrame(currentFilters.timeFrame);
        
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('table-body').innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: red;">Error: ${error.message}</td></tr>`;
    }
})();

// Function to load ALL metrics data
async function loadAllMetrics() {
    const { createClient } = window.supabase;
    const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8';
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const entityIds = originalEntities.map(e => e.id);
    
    // Get the date 365 days ago to have enough data
    const date = new Date();
    date.setDate(date.getDate() - 365);
    const startDate = date.toISOString().split('T')[0];
    
    // Fetch all metrics
    const { data: metrics } = await supabaseClient
        .from('daily_metrics')
        .select('entity_id, volume, total_virality, metric_date')
        .in('entity_id', entityIds)
        .gte('metric_date', startDate)
        .order('metric_date', { ascending: false });
    
    // Fetch all indicators
    const { data: indicators } = await supabaseClient
        .from('virality_indicators')
        .select('entity_id, growth_rate_30d, growth_rate_7d, indicator_date')
        .in('entity_id', entityIds)
        .gte('indicator_date', startDate);
    
    // Fetch funding data
    const { data: funding } = await supabaseClient
        .from('funding_rounds')
        .select('entity_id, amount, round_type')
        .in('entity_id', entityIds)
        .eq('is_latest', true);
    
    // Store all data
    allMetrics = {
        metrics: metrics || [],
        indicators: indicators || [],
        funding: funding || []
    };
}

// Function to calculate metrics for a specific time frame
function calculateMetricsForTimeFrame(days) {
    if (!originalEntities || originalEntities.length === 0) return;
    
    // Calculate date range
    let startDate = null;
    const endDate = new Date();
    
    if (days && days !== '') {
        const date = new Date();
        date.setDate(date.getDate() - days);
        startDate = date;
    }
    
    // Filter metrics by date range
    const filteredMetrics = days ? 
        allMetrics.metrics.filter(m => {
            const metricDate = new Date(m.metric_date);
            return metricDate >= startDate && metricDate <= endDate;
        }) : allMetrics.metrics;
    
    // Calculate growth rates based on filtered data
    const metricsMap = {};
    const growthMap = {};
    const fundingMap = {};
    
    // Group metrics by entity
    filteredMetrics.forEach(m => {
        if (!metricsMap[m.entity_id]) {
            metricsMap[m.entity_id] = [];
        }
        metricsMap[m.entity_id].push(m);
    });
    
    // Calculate growth rate for each entity based on time frame
    Object.keys(metricsMap).forEach(entityId => {
        const entityMetrics = metricsMap[entityId];
        if (entityMetrics.length > 1) {
            // Sort by date
            entityMetrics.sort((a, b) => new Date(a.metric_date) - new Date(b.metric_date));
            
            const oldestMetric = entityMetrics[0];
            const latestMetric = entityMetrics[entityMetrics.length - 1];
            
            if (oldestMetric.total_virality > 0) {
                const growthRate = ((latestMetric.total_virality - oldestMetric.total_virality) / oldestMetric.total_virality) * 100;
                growthMap[entityId] = {
                    growth_rate: growthRate,
                    latest_virality: latestMetric.total_virality,
                    latest_volume: latestMetric.volume
                };
            } else {
                growthMap[entityId] = {
                    growth_rate: 0,
                    latest_virality: latestMetric.total_virality,
                    latest_volume: latestMetric.volume
                };
            }
        } else if (entityMetrics.length === 1) {
            // Only one data point
            growthMap[entityId] = {
                growth_rate: 0,
                latest_virality: entityMetrics[0].total_virality,
                latest_volume: entityMetrics[0].volume
            };
        }
    });
    
    // For entities without metrics in time frame, use the latest available
    originalEntities.forEach(entity => {
        if (!growthMap[entity.id]) {
            const entityMetrics = allMetrics.metrics.filter(m => m.entity_id === entity.id);
            if (entityMetrics.length > 0) {
                // Sort by date and get the latest
                entityMetrics.sort((a, b) => new Date(b.metric_date) - new Date(a.metric_date));
                growthMap[entity.id] = {
                    growth_rate: 0,
                    latest_virality: entityMetrics[0].total_virality,
                    latest_volume: entityMetrics[0].volume
                };
            } else {
                growthMap[entity.id] = {
                    growth_rate: 0,
                    latest_virality: 0,
                    latest_volume: 0
                };
            }
        }
    });
    
    // Map funding data
    allMetrics.funding.forEach(f => fundingMap[f.entity_id] = f);
    
    // Update all entities with new calculations while preserving original categories
    allEntities = originalEntities.map(entity => {
        const growth = growthMap[entity.id] || { growth_rate: 0, latest_virality: 0, latest_volume: 0 };
        const fundingData = fundingMap[entity.id];
        
        return {
            ...entity,
            total_virality: growth.latest_virality,
            volume: growth.latest_volume,
            growth_rate_30d: growth.growth_rate,
            latest_funding_amount: fundingData?.amount || 0,
            latest_round_type: fundingData?.round_type || null
            // Keep all original fields including category and display_category
        };
    });
    
    // Update global reference
    window.allEntities = allEntities;
    
    // Apply filters and display
    applyFilters();
}

// Function to display entities in the table
function displayEntities(entities) {
    const tbody = document.getElementById('table-body');
    
    if (!entities || entities.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No entities match your filters</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    entities.forEach(entity => {
        const row = document.createElement('tr');
        row.className = 'clickable-row';
        row.dataset.entityId = entity.id;
        row.dataset.entityName = entity.name;
        
        // Format values
        const formatNumber = (num) => {
            if (!num || num === 0) return 'N/A';
            if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
            if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
            if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
            return Math.round(num).toString();
        };
        
        const growth = entity.growth_rate_30d || 0;
        const growthClass = growth > 0 ? 'growth-positive' : '';
        
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
            return categoryMap[category.toLowerCase()] || 'slate';
        };
        
        row.innerHTML = `
            <td>
                <div class="app-info">
                    <strong>${entity.name}</strong>
                    <div class="app-description">${entity.short_description || ''}</div>
                </div>
            </td>
            <td class="${growthClass}">${growth > 0 ? '+' : ''}${parseFloat(growth).toFixed(0)}%</td>
            <td>${formatNumber(entity.total_virality)}</td>
            <td>${formatNumber(entity.latest_funding_amount)}</td>
            <td>${entity.latest_round_type || 'N/A'}</td>
            <td><span class="category-${getCategoryClass(entity.display_category)}">${entity.display_category}</span></td>
        `;
        
        // Make row a link
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
            window.location.href = `entity/detail.html?id=${entity.id}&name=${encodeURIComponent(entity.name)}`;
        });
        
        tbody.appendChild(row);
    });
}

// Function to apply filters
window.applyFilters = function applyFilters() {
    let filteredEntities = [...allEntities];
    
    // Apply category filter
    if (currentFilters.category) {
        filteredEntities = filteredEntities.filter(entity => {
            if (Array.isArray(entity.category)) {
                return entity.category.some(cat => 
                    cat.toLowerCase() === currentFilters.category.toLowerCase()
                );
            } else {
                return entity.category?.toLowerCase() === currentFilters.category.toLowerCase();
            }
        });
    }
    
    // Apply growth filter
    if (currentFilters.minGrowth) {
        filteredEntities = filteredEntities.filter(entity => 
            (entity.growth_rate_30d || 0) >= currentFilters.minGrowth
        );
    }
    
    // Apply virality filter
    if (currentFilters.minVirality) {
        filteredEntities = filteredEntities.filter(entity => 
            (entity.total_virality || 0) >= currentFilters.minVirality
        );
    }
    
    // Apply funding filter
    if (currentFilters.minFunding) {
        if (currentFilters.minFunding < 0) {
            // Negative value means "less than" filter
            const maxFunding = Math.abs(currentFilters.minFunding);
            filteredEntities = filteredEntities.filter(entity => 
                (entity.latest_funding_amount || 0) < maxFunding
            );
        } else {
            // Positive value means "greater than or equal to" filter
            filteredEntities = filteredEntities.filter(entity => 
                (entity.latest_funding_amount || 0) >= currentFilters.minFunding
            );
        }
    }
    
    // Apply round type filter
    if (currentFilters.roundType) {
        if (currentFilters.roundType === 'Series C/+') {
            // For Series C/+, include Series C, D, E, F, etc.
            filteredEntities = filteredEntities.filter(entity => {
                const round = entity.latest_round_type;
                if (!round) return false;
                
                // Check if it's Series C or higher
                const seriesMatch = round.match(/Series\s+([C-Z])/i);
                if (seriesMatch) {
                    const letter = seriesMatch[1].toUpperCase();
                    return letter >= 'C';
                }
                return false;
            });
        } else {
            filteredEntities = filteredEntities.filter(entity => 
                entity.latest_round_type === currentFilters.roundType
            );
        }
    }
    
    // Sort by virality (highest first)
    filteredEntities.sort((a, b) => (b.total_virality || 0) - (a.total_virality || 0));
    
    displayEntities(filteredEntities);
}

// Initialize dropdowns and other features
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const btn = dropdown.querySelector('.dropdown-btn');
        const content = dropdown.querySelector('.dropdown-content');
        const filterType = dropdown.dataset.filter;
        
        if (btn && content) {
            // Toggle dropdown
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
            
            // Handle option selection
            const options = dropdown.querySelectorAll('.dropdown-content a');
            options.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const value = this.dataset.value;
                    const text = this.textContent;
                    
                    // Update button text
                    btn.innerHTML = text + ' <span class="arrow">▼</span>';
                    
                    // Update filter
                    if (value === '') {
                        currentFilters[filterType] = null;
                    } else {
                        currentFilters[filterType] = filterType.includes('min') || filterType === 'timeFrame' ? 
                            parseFloat(value) : value;
                    }
                    
                    // Close dropdown
                    dropdown.classList.remove('active');
                    
                    // For time frame changes, recalculate metrics
                    if (filterType === 'timeFrame') {
                        calculateMetricsForTimeFrame(currentFilters.timeFrame);
                    } else {
                        // Apply filters
                        applyFilters();
                    }
                });
            });
        }
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
});
