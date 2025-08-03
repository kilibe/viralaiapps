import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://rygermxpngibrkvmpqqf.supabase.co'
// Use service role key for data ingestion (you'll need to get this from Supabase dashboard)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2VybXhwbmdpYnJrdm1wcXFmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE1NjE1MiwiZXhwIjoyMDY5NzMyMTUyfQ.n-GVu-yhd-nUrsiApkicpTZzqJCLDDbr4_oV8rPCZZM'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Mock data sources - in production, these would be real APIs
class DataIngestionPipeline {
  constructor() {
    this.sources = {
      website: new WebsiteMetricsSource(),
      youtube: new YouTubeMetricsSource(),
      twitter: new TwitterMetricsSource(),
      funding: new FundingDataSource()
    }
  }

  async ingestDailyMetrics() {
    console.log('Starting daily metrics ingestion...')
    
    try {
      // Get all entities
      const { data: entities, error } = await supabase
        .from('entities')
        .select('*')
      
      if (error) throw error

      const today = new Date().toISOString().split('T')[0]
      const metrics = []

      // Collect metrics for each entity
      for (const entity of entities) {
        console.log(`Collecting metrics for ${entity.name}...`)
        
        const websiteData = await this.sources.website.getMetrics(entity.website_url)
        const youtubeData = await this.sources.youtube.getMetrics(entity.youtube_url)
        const twitterData = await this.sources.twitter.getMetrics(entity.x_url)
        
        metrics.push({
          entity_id: entity.id,
          metric_date: today,
          website_virality: websiteData.virality,
          youtube_virality: youtubeData.virality,
          x_virality: twitterData.virality,
          volume: websiteData.visitors + youtubeData.subscribers + twitterData.followers
        })
      }

      // Insert metrics
      const { error: insertError } = await supabase
        .from('daily_metrics')
        .insert(metrics)
      
      if (insertError) throw insertError

      // Calculate indicators
      for (const entity of entities) {
        await supabase.rpc('calculate_growth_indicators', {
          p_entity_id: entity.id,
          p_date: today
        })
      }

      console.log('Daily metrics ingestion complete!')
      return { success: true, metricsCount: metrics.length }

    } catch (error) {
      console.error('Error in daily metrics ingestion:', error)
      return { success: false, error: error.message }
    }
  }

  async updateFundingData() {
    console.log('Checking for funding updates...')
    
    try {
      const { data: entities } = await supabase
        .from('entities')
        .select('*')

      for (const entity of entities) {
        const fundingData = await this.sources.funding.getLatestRound(entity.name)
        
        if (fundingData && fundingData.isNew) {
          // Mark previous rounds as not latest
          await supabase
            .from('funding_rounds')
            .update({ is_latest: false })
            .eq('entity_id', entity.id)

          // Insert new funding round
          await supabase
            .from('funding_rounds')
            .insert({
              entity_id: entity.id,
              round_type: fundingData.round_type,
              amount: fundingData.amount,
              funding_date: fundingData.date,
              is_latest: true
            })
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Error updating funding data:', error)
      return { success: false, error: error.message }
    }
  }

  async generateForecasts() {
    console.log('Generating forecasts...')
    
    try {
      const { data: entities } = await supabase
        .from('entities')
        .select('*')

      const metricTypes = ['website', 'youtube', 'x', 'total', 'volume']
      const forecasts = []

      for (const entity of entities) {
        // Get historical data
        const { data: historicalData } = await supabase
          .from('daily_metrics')
          .select('*')
          .eq('entity_id', entity.id)
          .order('metric_date', { ascending: false })
          .limit(90)

        if (!historicalData || historicalData.length < 30) continue

        for (const metricType of metricTypes) {
          const forecast = this.calculateForecast(historicalData, metricType)
          
          // Generate forecasts for next 30 days
          for (let i = 1; i <= 30; i++) {
            const forecastDate = new Date()
            forecastDate.setDate(forecastDate.getDate() + i)
            
            forecasts.push({
              entity_id: entity.id,
              forecast_date: forecastDate.toISOString().split('T')[0],
              metric_type: metricType,
              forecasted_value: forecast.getValue(i),
              confidence_lower: forecast.getLowerBound(i),
              confidence_upper: forecast.getUpperBound(i),
              model_version: 'simple_linear_v1'
            })
          }
        }
      }

      // Insert forecasts
      if (forecasts.length > 0) {
        const { error } = await supabase
          .from('virality_forecasts')
          .upsert(forecasts, { onConflict: 'entity_id,forecast_date,metric_type' })
        
        if (error) throw error
      }

      return { success: true, forecastsCount: forecasts.length }
    } catch (error) {
      console.error('Error generating forecasts:', error)
      return { success: false, error: error.message }
    }
  }

  calculateForecast(historicalData, metricType) {
    // Simple linear regression forecast
    const values = historicalData.map(d => d[metricType] || d.total_virality).filter(v => v != null)
    const n = values.length
    
    if (n < 2) return { getValue: () => 0, getLowerBound: () => 0, getUpperBound: () => 0 }

    // Calculate trend
    const xSum = n * (n - 1) / 2
    const ySum = values.reduce((a, b) => a + b, 0)
    const xySum = values.reduce((sum, y, i) => sum + y * i, 0)
    const x2Sum = n * (n - 1) * (2 * n - 1) / 6

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum)
    const intercept = (ySum - slope * xSum) / n

    return {
      getValue: (day) => Math.max(0, intercept + slope * (n + day)),
      getLowerBound: (day) => Math.max(0, (intercept + slope * (n + day)) * 0.8),
      getUpperBound: (day) => Math.max(0, (intercept + slope * (n + day)) * 1.2)
    }
  }
}

// Mock data sources
class WebsiteMetricsSource {
  async getMetrics(url) {
    // In production, this would call actual analytics APIs
    return {
      virality: Math.floor(Math.random() * 1000) + 5000,
      visitors: Math.floor(Math.random() * 100000) + 500000
    }
  }
}

class YouTubeMetricsSource {
  async getMetrics(url) {
    // In production, use YouTube API
    return {
      virality: Math.floor(Math.random() * 800) + 3000,
      subscribers: Math.floor(Math.random() * 50000) + 100000
    }
  }
}

class TwitterMetricsSource {
  async getMetrics(url) {
    // In production, use Twitter API
    return {
      virality: Math.floor(Math.random() * 1500) + 4000,
      followers: Math.floor(Math.random() * 80000) + 200000
    }
  }
}

class FundingDataSource {
  async getLatestRound(companyName) {
    // In production, use Crunchbase API or similar
    // Simulate 5% chance of new funding
    if (Math.random() < 0.05) {
      return {
        isNew: true,
        round_type: ['Seed', 'Series A', 'Series B', 'Series C'][Math.floor(Math.random() * 4)],
        amount: Math.floor(Math.random() * 100000000) + 10000000,
        date: new Date().toISOString().split('T')[0]
      }
    }
    return null
  }
}

// Export for use in scheduled jobs
export const pipeline = new DataIngestionPipeline()

// Example usage:
// Run daily at midnight
// pipeline.ingestDailyMetrics()
// 
// Run every 6 hours
// pipeline.updateFundingData()
//
// Run daily at 2 AM
// pipeline.generateForecasts()