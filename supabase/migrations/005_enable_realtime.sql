-- Enable real-time for tables
-- This allows the website to receive real-time updates when data changes

-- Enable real-time for entities table
ALTER PUBLICATION supabase_realtime ADD TABLE entities;

-- Enable real-time for daily_metrics table
ALTER PUBLICATION supabase_realtime ADD TABLE daily_metrics;

-- Enable real-time for funding_rounds table
ALTER PUBLICATION supabase_realtime ADD TABLE funding_rounds;

-- Enable real-time for virality_indicators table
ALTER PUBLICATION supabase_realtime ADD TABLE virality_indicators;

-- Note: This needs to be run on your Supabase project
-- You can also enable real-time through the Supabase dashboard
-- by going to Database > Replication and enabling the tables