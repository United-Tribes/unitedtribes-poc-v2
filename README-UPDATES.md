# Knowledge Graph Auto-Update System

This document explains how the knowledge graph automatically updates from the UnitedTribes API.

## Overview

The knowledge graph (`src/data/gilligan-universe.json`) is automatically updated **3 times daily** by fetching fresh data from the UnitedTribes API.

## How It Works

### 1. API Fetch Script
**Location:** `scripts/update-knowledge-graph.js`

This Node.js script:
- Fetches all entities from `https://166ws8jk15.execute-api.us-east-1.amazonaws.com/prod/entities`
- Filters for Gilligan universe entities (Pluribus, Breaking Bad, Better Call Saul, etc.)
- Transforms API data into the graph format
- Updates `gilligan-universe.json` with new data
- Logs the update timestamp and entity count

### 2. Auto-Refresh (Browser)
**Location:** `src/components/graph.js`

The browser visualization automatically reloads the JSON file every 8 hours, ensuring users see fresh data without manual page refresh.

### 3. Scheduled Updates (Server)
**Location:** `scripts/schedule-updates.sh`

A cron job runs the update script 3 times daily:
- **8:00 AM** - Morning update
- **4:00 PM** - Afternoon update
- **12:00 AM** - Midnight update

## Setup Instructions

### Install the Cron Job

```bash
# Make scripts executable
chmod +x scripts/update-knowledge-graph.js
chmod +x scripts/schedule-updates.sh

# Install the cron job
./scripts/schedule-updates.sh
```

### Manual Update

To manually update the knowledge graph:

```bash
node scripts/update-knowledge-graph.js
```

### View Update Logs

```bash
# View recent logs
tail -f logs/knowledge-graph-updates.log

# View all logs
cat logs/knowledge-graph-updates.log
```

## Monitoring

### Check if Cron Job is Running

```bash
crontab -l | grep update-knowledge-graph
```

You should see:
```
0 8,16,0 * * * cd /Users/justin/unitedtribes-poc-v2 && node scripts/update-knowledge-graph.js >> logs/knowledge-graph-updates.log 2>&1
```

### Verify Updates are Happening

```bash
# Check the last_updated timestamp in the JSON
cat src/data/gilligan-universe.json | grep last_updated
```

## Troubleshooting

### Updates Not Running

1. **Check cron job exists:**
   ```bash
   crontab -l
   ```

2. **Check logs for errors:**
   ```bash
   tail -50 logs/knowledge-graph-updates.log
   ```

3. **Test script manually:**
   ```bash
   node scripts/update-knowledge-graph.js
   ```

### API Connection Issues

If the script can't reach the API:

```bash
# Test API connectivity
curl https://166ws8jk15.execute-api.us-east-1.amazonaws.com/prod/entities?limit=1
```

### Wrong Data

The script filters for Gilligan universe entities using keywords:
- pluribus, breaking bad, better call saul
- vince gilligan, rhea seehorn
- Character names: carol sturka, kim wexler, walter white, etc.

Edit the `gilliganKeywords` array in `update-knowledge-graph.js` to adjust filtering.

## Remove Auto-Updates

To stop automatic updates:

```bash
# Remove cron job
crontab -e
# Delete the line containing 'update-knowledge-graph.js'
```

## Alternative: AWS Lambda

For production deployment, consider running the update script in AWS Lambda on a schedule:

1. Package `update-knowledge-graph.js` as a Lambda function
2. Set up EventBridge (CloudWatch Events) rule to trigger 3x daily
3. Store updated JSON in S3
4. Update the browser app to fetch from S3 URL instead of local file

This removes the need for local cron jobs and works better for deployed applications.
