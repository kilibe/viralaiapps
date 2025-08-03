import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNTYxNTIsImV4cCI6MjA2OTczMjE1Mn0.Stvxenw41DlbxmmW2plGWKePmMs6VHGu6KOVcBCMaJ8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Data fetching functions
export async function fetchEntities(filters = {}) {
  // Query entities table directly with a join
  let query = supabase
    .from('entities')
    .select(`
      *,
      funding_rounds!left(
        amount,
        round_type,
        announced_date
      ),
      virality_indicators!left(
        growth_rate_7d,
        growth_rate_30d,
        indicator_date
      )
    `)
    .order('created_at', { ascending: false })

  // Apply filters
  if (filters.category && filters.category !== 'All Categories') {
    query = query.contains('category', [filters.category])
  }

  if (filters.minGrowth) {
    query = query.gte('virality_indicators.growth_rate_30d', filters.minGrowth)
  }

  if (filters.minVolume) {
    query = query.gte('volume', filters.minVolume)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching entities:', error)
    return []
  }

  // Transform the data to match expected format
  const transformedData = data.map(entity => {
    // Get latest funding round
    const latestFunding = entity.funding_rounds?.sort((a, b) => 
      new Date(b.announced_date) - new Date(a.announced_date)
    )[0]
    
    // Get latest virality indicators
    const latestIndicators = entity.virality_indicators?.sort((a, b) => 
      new Date(b.indicator_date) - new Date(a.indicator_date)
    )[0]
    
    return {
      ...entity,
      latest_funding_amount: latestFunding?.amount || null,
      latest_round_type: latestFunding?.round_type || null,
      growth_rate_7d: latestIndicators?.growth_rate_7d || null,
      growth_rate_30d: latestIndicators?.growth_rate_30d || null,
      // Calculate total virality score
      total_virality: calculateViralityScore(entity.volume, latestIndicators?.growth_rate_30d)
    }
  })

  // Sort by virality score
  return transformedData.sort((a, b) => (b.total_virality || 0) - (a.total_virality || 0))
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