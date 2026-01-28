#!/bin/bash

# Schedule Knowledge Graph Updates (3x daily)
# This script sets up a cron job to update the knowledge graph at 8 AM, 4 PM, and 12 AM

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
UPDATE_SCRIPT="$SCRIPT_DIR/update-knowledge-graph.js"

# Cron schedule: Run at 8 AM, 4 PM, and 12 AM daily
CRON_SCHEDULE="0 8,16,0 * * *"

# Path to node (use which to find it)
NODE_PATH=$(which node)

# Cron command
CRON_COMMAND="cd $PROJECT_DIR && $NODE_PATH $UPDATE_SCRIPT >> $PROJECT_DIR/logs/knowledge-graph-updates.log 2>&1"

echo "Setting up cron job for knowledge graph updates..."
echo "Schedule: 3x daily (8 AM, 4 PM, 12 AM)"
echo "Script: $UPDATE_SCRIPT"
echo ""

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_DIR/logs"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$UPDATE_SCRIPT"; then
    echo "⚠️  Cron job already exists. Removing old entry..."
    crontab -l 2>/dev/null | grep -v "$UPDATE_SCRIPT" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_SCHEDULE $CRON_COMMAND") | crontab -

echo "✅ Cron job installed successfully!"
echo ""
echo "Current crontab:"
crontab -l | grep "$UPDATE_SCRIPT"
echo ""
echo "To view update logs:"
echo "  tail -f $PROJECT_DIR/logs/knowledge-graph-updates.log"
echo ""
echo "To remove this cron job:"
echo "  crontab -e"
echo "  (then delete the line containing 'update-knowledge-graph.js')"
