-- User profile table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"email_notifications": true, "weekly_report": true, "dark_mode": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User tracked entities table
CREATE TABLE IF NOT EXISTS user_tracked_entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    tracked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, entity_id)
);

-- User alerts table
CREATE TABLE IF NOT EXISTS user_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'growth_threshold', 'funding_update', 'volume_milestone'
    threshold_value DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, entity_id, alert_type)
);

-- Alert notifications table
CREATE TABLE IF NOT EXISTS alert_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID NOT NULL REFERENCES user_alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metric_value DECIMAL(10, 2),
    message TEXT,
    is_read BOOLEAN DEFAULT false
);

-- Create indexes
CREATE INDEX idx_user_tracked_entities_user ON user_tracked_entities(user_id);
CREATE INDEX idx_user_alerts_user ON user_alerts(user_id);
CREATE INDEX idx_alert_notifications_alert ON alert_notifications(alert_id);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracked_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Tracked entities
CREATE POLICY "Users can view own tracked entities" ON user_tracked_entities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own tracked entities" ON user_tracked_entities
    FOR ALL USING (auth.uid() = user_id);

-- Alerts
CREATE POLICY "Users can view own alerts" ON user_alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts" ON user_alerts
    FOR ALL USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON alert_notifications
    FOR SELECT USING (
        alert_id IN (
            SELECT id FROM user_alerts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own notifications" ON alert_notifications
    FOR UPDATE USING (
        alert_id IN (
            SELECT id FROM user_alerts WHERE user_id = auth.uid()
        )
    );

-- Function to check and trigger alerts
CREATE OR REPLACE FUNCTION check_user_alerts() RETURNS void AS $$
DECLARE
    alert RECORD;
    current_value DECIMAL;
    should_trigger BOOLEAN;
BEGIN
    -- Check each active alert
    FOR alert IN 
        SELECT ua.*, e.name as entity_name 
        FROM user_alerts ua
        JOIN entities e ON ua.entity_id = e.id
        WHERE ua.is_active = true
    LOOP
        should_trigger := false;
        
        -- Get current metric value based on alert type
        IF alert.alert_type = 'growth_threshold' THEN
            SELECT growth_rate_30d INTO current_value
            FROM virality_indicators
            WHERE entity_id = alert.entity_id
            ORDER BY indicator_date DESC
            LIMIT 1;
            
            should_trigger := current_value >= alert.threshold_value;
            
        ELSIF alert.alert_type = 'volume_milestone' THEN
            SELECT volume INTO current_value
            FROM daily_metrics
            WHERE entity_id = alert.entity_id
            ORDER BY metric_date DESC
            LIMIT 1;
            
            should_trigger := current_value >= alert.threshold_value;
        END IF;
        
        -- Create notification if threshold met
        IF should_trigger THEN
            INSERT INTO alert_notifications (
                alert_id,
                metric_value,
                message
            ) VALUES (
                alert.id,
                current_value,
                format('%s alert: %s reached %s', 
                    alert.alert_type, 
                    alert.entity_name, 
                    current_value::text)
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;