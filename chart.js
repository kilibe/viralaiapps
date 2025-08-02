// Chart component for displaying virality metrics
class ViralityChart {
  constructor(containerId, data, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
      margin: { top: 40, right: 80, bottom: 60, left: 80 },
      showForecast: options.showForecast || false,
      metricType: options.metricType || 'total_virality',
      ...options
    };
    
    this.svg = null;
    this.xScale = null;
    this.yScale = null;
    this.line = null;
    this.area = null;
  }

  init() {
    // Clear existing chart
    this.container.innerHTML = '';
    
    // Create SVG
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height);
    
    // Create gradient
    const gradient = this.svg.append('defs')
      .append('linearGradient')
      .attr('id', 'area-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', this.options.height - this.options.margin.bottom)
      .attr('x2', 0).attr('y2', this.options.margin.top);
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#4F46E5')
      .attr('stop-opacity', 0);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#4F46E5')
      .attr('stop-opacity', 0.3);
    
    // Create chart group
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    this.draw();
  }

  draw() {
    const innerWidth = this.options.width - this.options.margin.left - this.options.margin.right;
    const innerHeight = this.options.height - this.options.margin.top - this.options.margin.bottom;
    
    // Parse dates
    this.data.forEach(d => {
      d.date = new Date(d.metric_date);
      d.value = +d[this.options.metricType];
    });
    
    // Set scales
    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date))
      .range([0, innerWidth]);
    
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) * 1.1])
      .range([innerHeight, 0]);
    
    // Create line generator
    this.line = d3.line()
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Create area generator
    this.area = d3.area()
      .x(d => this.xScale(d.date))
      .y0(innerHeight)
      .y1(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Add X axis
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(this.xScale)
        .tickFormat(d3.timeFormat('%Y-%m'))
        .ticks(6));
    
    // Add Y axis
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(this.yScale)
        .tickFormat(d => this.formatNumber(d))
        .ticks(5));
    
    // Add gridlines
    this.chartGroup.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(this.yScale)
        .tickSize(-innerWidth)
        .tickFormat('')
        .ticks(5));
    
    // Add area
    this.chartGroup.append('path')
      .datum(this.data)
      .attr('class', 'area')
      .attr('fill', 'url(#area-gradient)')
      .attr('d', this.area);
    
    // Add line
    this.chartGroup.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('fill', 'none')
      .attr('stroke', '#4F46E5')
      .attr('stroke-width', 2)
      .attr('d', this.line);
    
    // Add dots
    this.chartGroup.selectAll('.dot')
      .data(this.data.filter((d, i) => i % 7 === 0)) // Show every 7th point
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => this.xScale(d.date))
      .attr('cy', d => this.yScale(d.value))
      .attr('r', 3)
      .attr('fill', '#4F46E5');
    
    // Add tooltip
    this.addTooltip();
    
    // Add metrics header
    this.addMetricsHeader();
  }
  
  addMetricsHeader() {
    const latestData = this.data[this.data.length - 1];
    const firstData = this.data[0];
    const growth = ((latestData.value - firstData.value) / firstData.value * 100).toFixed(0);
    
    const header = this.svg.append('g')
      .attr('class', 'metrics-header')
      .attr('transform', `translate(${this.options.margin.left}, 20)`);
    
    // Volume
    header.append('text')
      .attr('class', 'volume')
      .attr('x', 0)
      .attr('y', 0)
      .style('font-size', '24px')
      .style('font-weight', 'bold')
      .style('fill', '#1F2937')
      .text(this.formatNumber(latestData.value));
    
    // Growth
    header.append('text')
      .attr('class', 'growth')
      .attr('x', 120)
      .attr('y', 0)
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .style('fill', '#10B981')
      .text(`+${growth}%`);
    
    // Labels
    header.append('text')
      .attr('x', 0)
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Volume');
    
    header.append('text')
      .attr('x', 120)
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#6B7280')
      .text('Growth');
  }
  
  addTooltip() {
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
    
    const bisectDate = d3.bisector(d => d.date).left;
    
    const focus = this.chartGroup.append('g')
      .attr('class', 'focus')
      .style('display', 'none');
    
    focus.append('circle')
      .attr('r', 5)
      .attr('fill', '#4F46E5');
    
    focus.append('line')
      .attr('class', 'x-hover-line hover-line')
      .attr('y1', 0)
      .attr('y2', this.options.height - this.options.margin.top - this.options.margin.bottom)
      .style('stroke', '#4F46E5')
      .style('stroke-width', '1px')
      .style('stroke-dasharray', '3,3')
      .style('opacity', 0.5);
    
    this.svg.append('rect')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`)
      .attr('width', this.options.width - this.options.margin.left - this.options.margin.right)
      .attr('height', this.options.height - this.options.margin.top - this.options.margin.bottom)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', () => focus.style('display', null))
      .on('mouseout', () => {
        focus.style('display', 'none');
        tooltip.style('opacity', 0);
      })
      .on('mousemove', (event) => {
        const x0 = this.xScale.invert(d3.pointer(event)[0]);
        const i = bisectDate(this.data, x0, 1);
        const d0 = this.data[i - 1];
        const d1 = this.data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        
        focus.attr('transform', `translate(${this.xScale(d.date)},${this.yScale(d.value)})`);
        focus.select('.x-hover-line').attr('y2', this.options.height - this.options.margin.top - this.options.margin.bottom - this.yScale(d.value));
        
        tooltip
          .style('opacity', 1)
          .html(`
            <div><strong>${d3.timeFormat('%Y-%m-%d')(d.date)}</strong></div>
            <div>Value: ${this.formatNumber(d.value)}</div>
            ${d.growth_rate_7d ? `<div>7d Growth: ${d.growth_rate_7d.toFixed(1)}%</div>` : ''}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      });
  }
  
  formatNumber(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
  
  update(newData, newOptions = {}) {
    this.data = newData;
    this.options = { ...this.options, ...newOptions };
    this.draw();
  }
}

// Export for use in other files
window.ViralityChart = ViralityChart;