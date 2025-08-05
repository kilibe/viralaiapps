// Chart implementation for detail pages with proper axis labels
function createDetailChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Set dimensions
    const width = options.width || 900;
    const height = options.height || 350;
    const margin = { top: 40, right: 60, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Create main group
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Generate sample data if none provided
    if (!data || data.length === 0) {
        data = generateSampleData();
    }
    
    // Parse dates and values
    data.forEach(d => {
        d.date = new Date(d.date);
        d.value = +d.value;
    });
    
    // Create scales
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value) * 1.1])
        .range([innerHeight, 0]);
    
    // Create line generator
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
    
    // Create area generator
    const area = d3.area()
        .x(d => xScale(d.date))
        .y0(innerHeight)
        .y1(d => yScale(d.value))
        .curve(d3.curveMonotoneX);
    
    // Add gradient
    const gradient = svg.append('defs')
        .append('linearGradient')
        .attr('id', 'area-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0).attr('y1', yScale(0))
        .attr('x2', 0).attr('y2', yScale(d3.max(data, d => d.value)));
    
    gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#4F46E5')
        .attr('stop-opacity', 0.1);
    
    gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#4F46E5')
        .attr('stop-opacity', 0.3);
    
    // Add grid lines
    // Y-axis grid lines (5 lines)
    const yGridLines = g.append('g')
        .attr('class', 'grid y-grid')
        .attr('opacity', 0.1);
    
    const yTicks = yScale.ticks(5);
    yTicks.forEach(tick => {
        yGridLines.append('line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', yScale(tick))
            .attr('y2', yScale(tick))
            .attr('stroke', '#e5e7eb')
            .attr('stroke-width', 1);
    });
    
    // Add area
    g.append('path')
        .datum(data)
        .attr('class', 'area')
        .attr('fill', 'url(#area-gradient)')
        .attr('d', area);
    
    // Add line
    g.append('path')
        .datum(data)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', '#4F46E5')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Add dots
    g.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        .attr('r', 4)
        .attr('fill', '#4F46E5');
    
    // X-axis with label for EACH data point
    const xAxis = g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerHeight})`);
    
    // Add x-axis line
    xAxis.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1);
    
    // Add date label for each data point
    data.forEach((d, i) => {
        const x = xScale(d.date);
        
        // Add tick
        xAxis.append('line')
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', 0)
            .attr('y2', 6)
            .attr('stroke', '#6b7280');
        
        // Add label
        xAxis.append('text')
            .attr('x', x)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('fill', '#6b7280')
            .attr('font-size', '11px')
            .attr('transform', `rotate(-45, ${x}, 20)`)
            .text(d3.timeFormat('%m/%d')(d.date));
    });
    
    // Y-axis with 5 labels (including top and bottom)
    const yAxis = g.append('g')
        .attr('class', 'y-axis');
    
    // Add y-axis line
    yAxis.append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', innerHeight)
        .attr('stroke', '#e5e7eb')
        .attr('stroke-width', 1);
    
    // Add 5 y-axis labels
    yTicks.forEach(tick => {
        const y = yScale(tick);
        
        // Add tick
        yAxis.append('line')
            .attr('x1', -6)
            .attr('x2', 0)
            .attr('y1', y)
            .attr('y2', y)
            .attr('stroke', '#6b7280');
        
        // Add label
        yAxis.append('text')
            .attr('x', -10)
            .attr('y', y)
            .attr('dy', '0.32em')
            .attr('text-anchor', 'end')
            .attr('fill', '#6b7280')
            .attr('font-size', '11px')
            .text(formatNumber(tick));
    });
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#1f2937')
        .text('Virality Over Time');
    
    // Add axis labels
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#6b7280')
        .text('Date');
    
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#6b7280')
        .text('Virality Score');
    
    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'chart-tooltip')
        .style('opacity', 0)
        .style('position', 'absolute')
        .style('background', 'rgba(0, 0, 0, 0.8)')
        .style('color', 'white')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('font-size', '12px')
        .style('pointer-events', 'none');
    
    // Add invisible rect for mouse events
    g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mousemove', function(event) {
            const [mouseX] = d3.pointer(event);
            const bisectDate = d3.bisector(d => d.date).left;
            const x0 = xScale.invert(mouseX);
            const i = bisectDate(data, x0, 1);
            const d0 = data[i - 1];
            const d1 = data[i];
            const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
            
            tooltip
                .style('opacity', 1)
                .html(`
                    <div><strong>${d3.timeFormat('%Y-%m-%d')(d.date)}</strong></div>
                    <div>Value: ${formatNumber(d.value)}</div>
                `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('opacity', 0);
        });
}

// Generate sample data for testing
function generateSampleData() {
    const data = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    let value = 50000;
    for (let i = 0; i <= 30; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        
        // Add some randomness for realistic growth
        value = value * (1 + (Math.random() * 0.1 - 0.02));
        
        data.push({
            date: date.toISOString().split('T')[0],
            value: Math.round(value)
        });
    }
    
    return data;
}

// Format number for display
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
}

// Export for use
window.createDetailChart = createDetailChart;