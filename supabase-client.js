import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase initialized:', supabase)

// Data fetching functions
export async function fetchEntities(filters = {}) {
  console.log('fetchEntities called with filters:', filters)
  
  try {
    // First, get all entities
    const { data: entities, error: entitiesError } = await supabase
      .from('entities')
      .select('*')
    
    if (entitiesError) {
      console.error('Error fetching entities:', entitiesError)
      return []
    }
    
    console.log(`Fetched ${entities.length} entities`)
    
    // Get metrics for all entities
    const entityIds = entities.map(e => e.id)
    
    // Fetch daily metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('entity_id, volume, metric_date')
      .in('entity_id', entityIds)
      .order('metric_date', { ascending: false })
    
    if (metricsError) {
      console.error('Error fetching metrics:', metricsError)
    }
    
    // Fetch virality indicators
    const { data: indicators, error: indicatorsError } = await supabase
      .from('virality_indicators')
      .select('entity_id, growth_rate_7d, growth_rate_30d, indicator_date')
      .in('entity_id', entityIds)
      .order('indicator_date', { ascending: false })
    
    if (indicatorsError) {
      console.error('Error fetching indicators:', indicatorsError)
    }
    
    // Fetch funding rounds
    const { data: funding, error: fundingError } = await supabase
      .from('funding_rounds')
      .select('entity_id, amount, round_type, announced_date')
      .in('entity_id', entityIds)
      .order('announced_date', { ascending: false })
    
    if (fundingError) {
      console.error('Error fetching funding:', fundingError)
    }
    
    // Group data by entity
    const metricsMap = {}
    const indicatorsMap = {}
    const fundingMap = {}
    
    metrics?.forEach(m => {
      if (!metricsMap[m.entity_id] || new Date(m.metric_date) > new Date(metricsMap[m.entity_id].metric_date)) {
        metricsMap[m.entity_id] = m
      }
    })
    
    indicators?.forEach(i => {
      if (!indicatorsMap[i.entity_id] || new Date(i.indicator_date) > new Date(indicatorsMap[i.entity_id].indicator_date)) {
        indicatorsMap[i.entity_id] = i
      }
    })
    
    funding?.forEach(f => {
      if (!fundingMap[f.entity_id] || new Date(f.announced_date) > new Date(fundingMap[f.entity_id].announced_date)) {
        fundingMap[f.entity_id] = f
      }
    })
    
    // Combine all data
    const combinedData = entities.map(entity => {
      const latestMetric = metricsMap[entity.id] || {}
      const latestIndicator = indicatorsMap[entity.id] || {}
      const latestFunding = fundingMap[entity.id] || {}
      
      return {
        ...entity,
        volume: latestMetric.volume || 0,
        growth_rate_7d: latestIndicator.growth_rate_7d || 0,
        growth_rate_30d: latestIndicator.growth_rate_30d || 0,
        latest_funding_amount: latestFunding.amount || null,
        latest_round_type: latestFunding.round_type || null,
        total_virality: calculateViralityScore(latestMetric.volume, latestIndicator.growth_rate_30d)
      }
    })
    
    // Sort by virality score
    combinedData.sort((a, b) => (b.total_virality || 0) - (a.total_virality || 0))
    
    console.log('Combined data:', combinedData)
    return combinedData
    
  } catch (error) {
    console.error('Error in fetchEntities:', error)
    return []
  }
}

// Calculate virality score
function calculateViralityScore(volume, growthRate) {
  if (!volume || !growthRate) return 0
  const v = parseFloat(volume) || 0
  const g = parseFloat(growthRate) || 0
  return Math.log10(v + 1) * Math.log10(g + 1) * 10
}

export async function fetchEntityMetrics(entityId, timeRange = '5 years') {
  let startDate = new Date()
  
  switch (timeRange) {
    case '7 days':
      startDate.setDate(startDate.getDate() - 7)
      break
    case '30 days':
      startDate.setDate(startDate.getDate() - 30)
      break
    case '3 months':
      startDate.setMonth(startDate.getMonth() - 3)
      break
    case '6 months':
      startDate.setMonth(startDate.getMonth() - 6)
      break
    case '1 year':
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
    case '5 years':
    default:
      startDate.setFullYear(startDate.getFullYear() - 5)
  }

  const { data, error } = await supabase
    .from('entity_metrics_timeseries')
    .select('*')
    .eq('entity_id', entityId)
    .gte('metric_date', startDate.toISOString().split('T')[0])
    .order('metric_date', { ascending: true })

  if (error) {
    console.error('Error fetching metrics:', error)
    return []
  }

  return data
}

export async function fetchEntityForecasts(entityId, metricType = 'total') {
  const { data, error } = await supabase
    .from('virality_forecasts')
    .select('*')
    .eq('entity_id', entityId)
    .eq('metric_type', metricType)
    .gte('forecast_date', new Date().toISOString().split('T')[0])
    .order('forecast_date', { ascending: true })

  if (error) {
    console.error('Error fetching forecasts:', error)
    return []
  }

  return data
}

// Function to format large numbers
export function formatNumber(num) {
  if (!num) return '0'
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Function to format growth percentage
export function formatGrowth(growth) {
  if (growth === null || growth === undefined) return 'N/A'
  const growthNum = parseFloat(growth)
  if (isNaN(growthNum)) return 'N/A'
  const sign = growthNum > 0 ? '+' : ''
  return `${sign}${growthNum.toFixed(0)}%`
}

// Function to format funding amount
export function formatFunding(amount) {
  if (!amount) return 'N/A'
  return '$' + formatNumber(amount)
}