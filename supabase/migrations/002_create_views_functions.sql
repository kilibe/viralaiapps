-- Create views for easy querying

-- Current status view with latest metrics and funding
CREATE VIEW entity_current_status AS
SELECT 
    e.*,
    dm.website_virality,
    dm.youtube_virality,
    dm.x_virality,
    dm.total_virality,
    dm.volume,
    f.amount as latest_funding_amount,
    f.round_type as latest_round_type,
    f.funding_date as latest_funding_date
FROM entities e
LEFT JOIN LATERAL (
    SELECT * FROM daily_metrics 
    WHERE entity_id = e.id 
    ORDER BY metric_date DESC 
    LIMIT 1
) dm ON true
LEFT JOIN funding_rounds f ON e.id = f.entity_id AND f.is_latest = true;

-- Time series view for charting
CREATE VIEW entity_metrics_timeseries AS
SELECT 
    e.id,
    e.name,
    e.category,
    dm.metric_date,
    dm.website_virality,
    dm.youtube_virality,
    dm.x_virality,
    dm.total_virality,
    dm.volume,
    vi.growth_rate_7d,
    vi.growth_rate_30d,
    vi.momentum_score
FROM entities e
JOIN daily_metrics dm ON e.id = dm.entity_id
LEFT JOIN virality_indicators vi ON e.id = vi.entity_id 
    AND dm.metric_date = vi.indicator_date
ORDER BY e.id, dm.metric_date;

-- Function to calculate growth indicators
CREATE OR REPLACE FUNCTION calculate_growth_indicators(
    p_entity_id UUID,
    p_date DATE
) RETURNS void AS $$
DECLARE
    v_current_total DECIMAL;
    v_7d_ago_total DECIMAL;
    v_30d_ago_total DECIMAL;
    v_growth_7d DECIMAL;
    v_growth_30d DECIMAL;
BEGIN
    -- Get current total
    SELECT total_virality INTO v_current_total
    FROM daily_metrics
    WHERE entity_id = p_entity_id AND metric_date = p_date;

    -- Get 7 days ago total
    SELECT total_virality INTO v_7d_ago_total
    FROM daily_metrics
    WHERE entity_id = p_entity_id AND metric_date = p_date - INTERVAL '7 days';

    -- Get 30 days ago total
    SELECT total_virality INTO v_30d_ago_total
    FROM daily_metrics
    WHERE entity_id = p_entity_id AND metric_date = p_date - INTERVAL '30 days';

    -- Calculate growth rates
    IF v_7d_ago_total > 0 THEN
        v_growth_7d = ((v_current_total - v_7d_ago_total) / v_7d_ago_total) * 100;
    END IF;

    IF v_30d_ago_total > 0 THEN
        v_growth_30d = ((v_current_total - v_30d_ago_total) / v_30d_ago_total) * 100;
    END IF;

    -- Insert or update indicators
    INSERT INTO virality_indicators (
        entity_id, indicator_date, growth_rate_7d, growth_rate_30d
    ) VALUES (
        p_entity_id, p_date, v_growth_7d, v_growth_30d
    )
    ON CONFLICT (entity_id, indicator_date) 
    DO UPDATE SET 
        growth_rate_7d = EXCLUDED.growth_rate_7d,
        growth_rate_30d = EXCLUDED.growth_rate_30d;
END;
$$ LANGUAGE plpgsql;