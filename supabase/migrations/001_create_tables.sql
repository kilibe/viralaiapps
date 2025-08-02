-- Create main entity table (static information)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    short_description TEXT,
    long_description TEXT,
    category VARCHAR(100),
    website_url VARCHAR(500),
    youtube_url VARCHAR(500),
    x_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create funding information table
CREATE TABLE funding_rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    round_type VARCHAR(50), -- 'Seed', 'Series A', 'Series B', etc.
    amount DECIMAL(15, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    funding_date DATE,
    is_latest BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily metrics table (time-series data)
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    website_virality DECIMAL(10, 2),
    youtube_virality DECIMAL(10, 2),
    x_virality DECIMAL(10, 2),
    total_virality DECIMAL(10, 2), -- Can be calculated or stored
    volume INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_id, metric_date) -- Prevent duplicate entries per day
);

-- Create calculated indicators table
CREATE TABLE virality_indicators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    indicator_date DATE NOT NULL,
    growth_rate_7d DECIMAL(10, 4), -- 7-day growth rate
    growth_rate_30d DECIMAL(10, 4), -- 30-day growth rate
    momentum_score DECIMAL(10, 4), -- Custom momentum calculation
    volatility_index DECIMAL(10, 4), -- Virality volatility
    trend_direction VARCHAR(20), -- 'up', 'down', 'stable'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_id, indicator_date)
);

-- Create forecast data table
CREATE TABLE virality_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    forecast_date DATE NOT NULL,
    metric_type VARCHAR(50), -- 'website', 'youtube', 'x', 'total', 'volume'
    forecasted_value DECIMAL(10, 2),
    confidence_lower DECIMAL(10, 2), -- Lower bound of confidence interval
    confidence_upper DECIMAL(10, 2), -- Upper bound of confidence interval
    model_version VARCHAR(50), -- Track which model generated this
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(entity_id, forecast_date, metric_type)
);

-- Create indexes for performance
CREATE INDEX idx_daily_metrics_entity_date ON daily_metrics(entity_id, metric_date DESC);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date DESC);
CREATE INDEX idx_virality_indicators_entity_date ON virality_indicators(entity_id, indicator_date DESC);
CREATE INDEX idx_forecasts_entity_date ON virality_forecasts(entity_id, forecast_date);
CREATE INDEX idx_entities_category ON entities(category);

-- Create function to calculate total virality
CREATE OR REPLACE FUNCTION calculate_total_virality()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_virality = COALESCE(NEW.website_virality, 0) + 
                        COALESCE(NEW.youtube_virality, 0) + 
                        COALESCE(NEW.x_virality, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for total virality calculation
CREATE TRIGGER calc_total_virality 
BEFORE INSERT OR UPDATE ON daily_metrics
FOR EACH ROW EXECUTE FUNCTION calculate_total_virality();