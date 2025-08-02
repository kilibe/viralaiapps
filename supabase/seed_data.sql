-- Insert sample entities
INSERT INTO entities (name, short_description, long_description, category, website_url, youtube_url, x_url, linkedin_url) VALUES
('ChatGPT', 'AI-powered conversational assistant for various tasks', 'ChatGPT is an advanced language model developed by OpenAI that can engage in human-like conversations, answer questions, help with writing, coding, and many other tasks.', 'General chatbots', 'https://chat.openai.com', 'https://youtube.com/@OpenAI', 'https://x.com/OpenAI', 'https://linkedin.com/company/openai'),
('Midjourney', 'AI image generation platform for creative professionals', 'Midjourney is an independent research lab exploring new mediums of thought and expanding the imaginative powers of the human species through AI-generated imagery.', 'Image gen', 'https://midjourney.com', 'https://youtube.com/@midjourney', 'https://x.com/midjourney', 'https://linkedin.com/company/midjourney'),
('Claude', 'AI assistant by Anthropic focused on safety and helpfulness', 'Claude is an AI assistant created by Anthropic to be helpful, harmless, and honest. It excels at complex reasoning, creative writing, and coding tasks.', 'General chatbots', 'https://claude.ai', 'https://youtube.com/@anthropic', 'https://x.com/AnthropicAI', 'https://linkedin.com/company/anthropic'),
('Stable Diffusion', 'Open-source AI model for text-to-image generation', 'Stable Diffusion is a latent text-to-image diffusion model capable of generating photo-realistic images given any text input.', 'Image gen', 'https://stability.ai', 'https://youtube.com/@StabilityAI', 'https://x.com/StabilityAI', 'https://linkedin.com/company/stability-ai'),
('Notion AI', 'AI writing assistant integrated into productivity workspace', 'Notion AI helps you work faster, write better, and think bigger by augmenting your productivity within the Notion workspace.', 'Writing', 'https://notion.so', 'https://youtube.com/@NotionHQ', 'https://x.com/NotionHQ', 'https://linkedin.com/company/notionhq');

-- Get entity IDs (in real app, you'd do this programmatically)
-- For this example, we'll use a CTE to reference them

WITH entity_ids AS (
  SELECT id, name FROM entities
)
-- Insert funding rounds
INSERT INTO funding_rounds (entity_id, round_type, amount, currency, funding_date, is_latest)
SELECT 
  e.id,
  fr.round_type,
  fr.amount,
  fr.currency,
  fr.funding_date::date,
  fr.is_latest
FROM entity_ids e
JOIN (VALUES
  ('ChatGPT', 'Series C', 11300000000, 'USD', '2024-01-15', true),
  ('Midjourney', 'Series A', 200000000, 'USD', '2023-09-20', true),
  ('Claude', 'Series C', 750000000, 'USD', '2024-03-10', true),
  ('Stable Diffusion', 'Seed', 101000000, 'USD', '2022-10-17', true),
  ('Notion AI', 'Series C', 343000000, 'USD', '2021-10-11', true)
) AS fr (name, round_type, amount, currency, funding_date, is_latest)
ON e.name = fr.name;

-- Generate sample daily metrics for the last 90 days
INSERT INTO daily_metrics (entity_id, metric_date, website_virality, youtube_virality, x_virality, volume)
SELECT 
  e.id,
  date_series.metric_date,
  -- Generate realistic virality scores with some randomness
  CASE e.name
    WHEN 'ChatGPT' THEN 8000 + (random() * 2000) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 50)
    WHEN 'Midjourney' THEN 5000 + (random() * 1000) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 30)
    WHEN 'Claude' THEN 3000 + (random() * 800) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 40)
    WHEN 'Stable Diffusion' THEN 4000 + (random() * 500) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 10)
    WHEN 'Notion AI' THEN 2000 + (random() * 400) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 20)
  END AS website_virality,
  CASE e.name
    WHEN 'ChatGPT' THEN 5000 + (random() * 1500) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 30)
    WHEN 'Midjourney' THEN 7000 + (random() * 2000) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 40)
    WHEN 'Claude' THEN 1000 + (random() * 300) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 15)
    WHEN 'Stable Diffusion' THEN 3000 + (random() * 800) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 20)
    WHEN 'Notion AI' THEN 1500 + (random() * 300) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 10)
  END AS youtube_virality,
  CASE e.name
    WHEN 'ChatGPT' THEN 10000 + (random() * 3000) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 60)
    WHEN 'Midjourney' THEN 4000 + (random() * 1000) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 25)
    WHEN 'Claude' THEN 2000 + (random() * 500) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 35)
    WHEN 'Stable Diffusion' THEN 3000 + (random() * 700) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 15)
    WHEN 'Notion AI' THEN 1000 + (random() * 200) + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 8)
  END AS x_virality,
  CASE e.name
    WHEN 'ChatGPT' THEN 100000000 + (random() * 10000000)::int + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 500000)::int
    WHEN 'Midjourney' THEN 15000000 + (random() * 1000000)::int + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 100000)::int
    WHEN 'Claude' THEN 8000000 + (random() * 500000)::int + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 80000)::int
    WHEN 'Stable Diffusion' THEN 10000000 + (random() * 800000)::int + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 50000)::int
    WHEN 'Notion AI' THEN 30000000 + (random() * 2000000)::int + (EXTRACT(epoch FROM date_series.metric_date - '2024-11-01'::date) / 86400 * 100000)::int
  END AS volume
FROM entities e
CROSS JOIN (
  SELECT generate_series(
    CURRENT_DATE - INTERVAL '90 days',
    CURRENT_DATE,
    '1 day'::interval
  )::date AS metric_date
) date_series;

-- Calculate growth indicators for all entities and dates
DO $$
DECLARE
  entity RECORD;
  date_rec RECORD;
BEGIN
  FOR entity IN SELECT id FROM entities LOOP
    FOR date_rec IN 
      SELECT DISTINCT metric_date 
      FROM daily_metrics 
      WHERE entity_id = entity.id 
      ORDER BY metric_date
    LOOP
      PERFORM calculate_growth_indicators(entity.id, date_rec.metric_date);
    END LOOP;
  END LOOP;
END $$;