-- Enable Row Level Security
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE virality_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE virality_forecasts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public entities are viewable by everyone" 
ON entities FOR SELECT 
USING (true);

CREATE POLICY "Public metrics are viewable by everyone" 
ON daily_metrics FOR SELECT 
USING (true);

CREATE POLICY "Public funding data are viewable by everyone" 
ON funding_rounds FOR SELECT 
USING (true);

CREATE POLICY "Public indicators are viewable by everyone" 
ON virality_indicators FOR SELECT 
USING (true);

CREATE POLICY "Public forecasts are viewable by everyone" 
ON virality_forecasts FOR SELECT 
USING (true);

-- Admin write policies (you'll need to adjust based on your auth setup)
-- Example: Only authenticated users with admin role can insert/update/delete
-- CREATE POLICY "Admins can insert entities" 
-- ON entities FOR INSERT 
-- TO authenticated 
-- WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- For now, let's create service role policies for data ingestion
CREATE POLICY "Service role can manage entities" 
ON entities FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage daily_metrics" 
ON daily_metrics FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage funding_rounds" 
ON funding_rounds FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage virality_indicators" 
ON virality_indicators FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage virality_forecasts" 
ON virality_forecasts FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');