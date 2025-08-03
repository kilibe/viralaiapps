// Additional chart components for viral AI apps

class ComparisonChart {
  constructor(containerId, data, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
      margin: { top: 40, right: 120, bottom: 60, left: 80 },
      ...options
    };
  }

  init() {
    this.container.innerHTML = '';
    
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height);
    
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    this.draw();
  }

  draw() {
    const innerWidth = this.options.width - this.options.margin.left - this.options.margin.right;
    const innerHeight = this.options.height - this.options.margin.top - this.options.margin.bottom;
    
    // Group data by entity
    const entities = Array.from(new Set(this.data.map(d => d.name)));
    const colors = d3.scaleOrdinal(d3.schemeCategory10);
    
    // Parse dates and create series
    const series = entities.map(entity => {
      return {
        name: entity,
        values: this.data
          .filter(d => d.name === entity)
          .map(d => ({
            date: new Date(d.metric_date),
            value: +d.total_virality
          }))
      };
    });
    
    // Set scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => new Date(d.metric_date)))
      .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => +d.total_virality) * 1.1])
      .range([innerHeight, 0]);
    
    // Add axes
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y-%m')));
    
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).tickFormat(d => this.formatNumber(d)));
    
    // Add lines
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    series.forEach((s, i) => {
      this.chartGroup.append('path')
        .datum(s.values)
        .attr('class', 'comparison-line')
        .attr('fill', 'none')
        .attr('stroke', colors(i))
        .attr('stroke-width', 2)
        .attr('d', line);
    });
    
    // Add legend
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.options.width - this.options.margin.right + 10}, ${this.options.margin.top})`);
    
    entities.forEach((entity, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendRow.append('rect')
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', colors(i));
      
      legendRow.append('text')
        .attr('x', 18)
        .attr('y', 10)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(entity);
    });
  }
  
  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }
}

class CategoryBreakdownChart {
  constructor(containerId, data, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.options = {
      width: options.width || 400,
      height: options.height || 400,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      ...options
    };
  }

  init() {
    this.container.innerHTML = '';
    const radius = Math.min(this.options.width, this.options.height) / 2 - this.options.margin.top;
    
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height)
      .append('g')
      .attr('transform', `translate(${this.options.width / 2},${this.options.height / 2})`);
    
    this.draw(radius);
  }

  draw(radius) {
    // Process data
    const categoryData = d3.rollup(
      this.data,
      v => d3.sum(v, d => d.total_virality),
      d => d.category
    );
    
    const pie = d3.pie()
      .value(d => d[1])
      .sort(null);
    
    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);
    
    const colors = d3.scaleOrdinal()
      .domain(Array.from(categoryData.keys()))
      .range(['#008080', '#FF4500', '#003366', '#333333', '#CD7F32', '#800000', '#708090']);
    
    // Create arcs
    const arcs = this.svg.selectAll('arc')
      .data(pie(Array.from(categoryData.entries())))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => colors(d.data[0]))
      .style('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).style('opacity', 0.8);
      });
    
    // Add labels
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'white')
      .text(d => d.data[0]);
  }
}

class GrowthHeatmap {
  constructor(containerId, data, options = {}) {
    this.container = document.getElementById(containerId);
    this.data = data;
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
      margin: { top: 80, right: 40, bottom: 80, left: 120 },
      ...options
    };
  }

  init() {
    this.container.innerHTML = '';
    
    this.svg = d3.select(this.container)
      .append('svg')
      .attr('width', this.options.width)
      .attr('height', this.options.height);
    
    this.chartGroup = this.svg.append('g')
      .attr('transform', `translate(${this.options.margin.left},${this.options.margin.top})`);
    
    this.draw();
  }

  draw() {
    const innerWidth = this.options.width - this.options.margin.left - this.options.margin.right;
    const innerHeight = this.options.height - this.options.margin.top - this.options.margin.bottom;
    
    // Get unique entities and dates
    const entities = Array.from(new Set(this.data.map(d => d.name)));
    const dates = Array.from(new Set(this.data.map(d => d.metric_date))).sort();
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(dates)
      .range([0, innerWidth])
      .padding(0.05);
    
    const yScale = d3.scaleBand()
      .domain(entities)
      .range([0, innerHeight])
      .padding(0.05);
    
    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([-50, 50]); // Growth rate domain
    
    // Create heatmap cells
    this.chartGroup.selectAll('.heatmap-cell')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', d => xScale(d.metric_date))
      .attr('y', d => yScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.growth_rate_7d || 0))
      .on('mouseover', (event, d) => {
        // Add tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'heatmap-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0, 0, 0, 0.8)')
          .style('color', 'white')
          .style('padding', '8px')
          .style('border-radius', '4px')
          .style('font-size', '12px')
          .html(`
            <strong>${d.name}</strong><br>
            Date: ${d.metric_date}<br>
            7d Growth: ${d.growth_rate_7d ? d.growth_rate_7d.toFixed(1) + '%' : 'N/A'}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', () => {
        d3.selectAll('.heatmap-tooltip').remove();
      });
    
    // Add axes
    this.chartGroup.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale)
        .tickValues(xScale.domain().filter((d, i) => i % 7 === 0))
        .tickFormat(d3.timeFormat('%m/%d')));
    
    this.chartGroup.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale));
    
    // Add color legend
    this.addColorLegend(colorScale);
  }
  
  addColorLegend(colorScale) {
    const legendWidth = 200;
    const legendHeight = 20;
    
    const legend = this.svg.append('g')
      .attr('transform', `translate(${this.options.width / 2 - legendWidth / 2}, ${this.options.height - 30})`);
    
    // Create gradient
    const gradientId = 'growth-gradient';
    const gradient = this.svg.append('defs')
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');
    
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      const value = -50 + (100 * i / steps);
      gradient.append('stop')
        .attr('offset', `${i * 100 / steps}%`)
        .attr('stop-color', colorScale(value));
    }
    
    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', `url(#${gradientId})`);
    
    legend.append('text')
      .attr('x', 0)
      .attr('y', -5)
      .style('font-size', '12px')
      .text('-50%');
    
    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Growth Rate');
    
    legend.append('text')
      .attr('x', legendWidth)
      .attr('y', -5)
      .attr('text-anchor', 'end')
      .style('font-size', '12px')
      .text('+50%');
  }
}

// Export charts
window.ComparisonChart = ComparisonChart;
window.CategoryBreakdownChart = CategoryBreakdownChart;
window.GrowthHeatmap = GrowthHeatmap;