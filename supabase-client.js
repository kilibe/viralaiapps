import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = 'https://gapyhqfwbnvuyhymqmod.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcHlocWZ3Ym52dXloeW1xbW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2OTY1NjQsImV4cCI6MjA2NzI3MjU2NH0.M2bVG-Gu_eTr2Gy33mq0PHAXWSTiP9gpOBaTHRUjwrc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Data fetching functions
export async function fetchEntities(filters = {}) {
  let query = supabase
    .from('entity_current_status')
    .select('*')
    .order('total_virality', { ascending: false })

  // Apply filters
  if (filters.category && filters.category !== 'All Categories') {
    query = query.eq('category', filters.category)
  }

  if (filters.minGrowth) {
    query = query.gte('growth_rate_30d', filters.minGrowth)
  }

  if (filters.minVolume) {
    query = query.gte('volume', filters.minVolume)
  }

  if (filters.minFunding) {
    query = query.gte('latest_funding_amount', filters.minFunding)
  }

  if (filters.roundType) {
    query = query.eq('latest_round_type', filters.roundType)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching entities:', error)
    return []
  }

  return data
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
  if (!growth) return 'N/A'
  const sign = growth > 0 ? '+' : ''
  return `${sign}${growth.toFixed(0)}%`
}

// Function to format funding amount
export function formatFunding(amount) {
  if (!amount) return 'N/A'
  return '$' + formatNumber(amount)
}