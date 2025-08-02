# Viral AI Apps - Database Setup Guide

## Overview
This project uses Supabase as the backend database to track AI application virality metrics over time. The database structure includes entities (AI apps), daily metrics, funding information, calculated indicators, and forecasts.

## Database Structure

### Tables
1. **entities** - Static information about AI applications
2. **funding_rounds** - Funding history for each entity
3. **daily_metrics** - Time-series data for virality metrics
4. **virality_indicators** - Calculated growth indicators
5. **virality_forecasts** - Predicted future metrics

### Views
- **entity_current_status** - Latest metrics and funding for each entity
- **entity_metrics_timeseries** - Time series data optimized for charting

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Save your project URL and API keys

### 2. Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Run each migration file in order:
   - `/supabase/migrations/001_create_tables.sql`
   - `/supabase/migrations/002_create_views_functions.sql`
   - `/supabase/migrations/003_enable_rls.sql`

3. Seed the database with sample data:
   - Run `/supabase/seed_data.sql`

### 3. Configure Your Application

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. Update `supabase-client.js` with your credentials:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL'
   const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
   ```

### 4. Install Dependencies

No npm installation needed! The project uses CDN links for:
- Supabase JS Client
- D3.js for charting
- EmailJS for contact forms

### 5. Update Your HTML

Replace the existing `script.js` with `script-updated.js`:
```bash
mv script.js script-old.js
mv script-updated.js script.js
```

Or update the script tag in `index.html`:
```html
<script type="module" src="script-updated.js"></script>
```

### 6. Run the Application

1. Open `index.html` in a web browser
2. Or use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

## Data Ingestion

### Manual Data Entry
You can add new entities and metrics directly in the Supabase dashboard or via SQL:

```sql
-- Add a new entity
INSERT INTO entities (name, short_description, category, website_url) 
VALUES ('New AI App', 'Description here', 'General chatbots', 'https://example.com');

-- Add daily metrics
INSERT INTO daily_metrics (entity_id, metric_date, website_virality, youtube_virality, x_virality, volume)
VALUES ('entity-uuid-here', '2025-01-30', 1000, 500, 2000, 50000);
```

### Automated Data Ingestion
Create a scheduled function or use Supabase Edge Functions to automatically update metrics daily.

## Chart Features

- **Interactive Charts**: Click any row in the table to view historical data
- **Multiple Metrics**: Toggle between Total, Website, YouTube, X, and Volume metrics
- **Time Ranges**: View data for 7D, 30D, 3M, 6M, 1Y, or All time
- **Forecast Toggle**: Enable to see predicted future trends (requires forecast data)
- **Responsive Design**: Charts adapt to different screen sizes

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Make sure you're running from a local server, not file://
2. Check your Supabase project settings for allowed origins
3. Add your domain to the allowed list

### No Data Showing
1. Verify migrations ran successfully
2. Check if seed data was inserted
3. Look for errors in browser console
4. Verify Supabase credentials are correct

### Chart Not Loading
1. Ensure D3.js is loaded (check network tab)
2. Verify data is being fetched from Supabase
3. Check browser console for JavaScript errors

## Next Steps

1. **Add Real Data Sources**: Integrate with APIs to fetch real virality metrics
2. **Implement Authentication**: Use Supabase Auth for user accounts
3. **Add More Visualizations**: Create comparison charts, category breakdowns
4. **Build Admin Panel**: For managing entities and reviewing metrics
5. **Set Up Automated Ingestion**: Use cron jobs or webhooks to update data

## Support

For issues or questions:
- Email: kate@ihaveamy.ai
- Check Supabase documentation: https://supabase.com/docs
- Review D3.js examples: https://d3js.org/examples