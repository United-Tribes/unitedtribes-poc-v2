#!/usr/bin/env node

/**
 * Knowledge Graph Updater
 *
 * Fetches entities from the UnitedTribes API and updates gilligan-universe.json
 * Run this script 3x daily to keep the knowledge graph fresh
 *
 * Usage:
 *   node scripts/update-knowledge-graph.js
 */

const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const API_BASE_URL = 'https://166ws8jk15.execute-api.us-east-1.amazonaws.com/prod';
const OUTPUT_FILE = path.join(__dirname, '../src/data/gilligan-universe.json');

// Entity type mapping from API to our graph types
const TYPE_MAPPING = {
    'creator': 'creator',
    'show': 'show',
    'tv-series': 'show',
    'film': 'show',
    'actor': 'actor',
    'character': 'character',
    'crew': 'crew',
    'cinematographer': 'crew',
    'producer': 'creator',
    'writer': 'creator',
    'director': 'creator',
    'episode': 'episode',
    'critic': 'critic',
    'journalist': 'critic',
    'theme': 'theme',
    'concept': 'concept',
    'cultural-reference': 'cultural_ref',
    'film-reference': 'cultural_ref',
    'tv-reference': 'cultural_ref',
    'book-reference': 'cultural_ref'
};

/**
 * Fetch data from API endpoint
 */
function fetchFromAPI(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`Fetching: ${url}`);

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error.message}`));
                    }
                } else {
                    reject(new Error(`API returned status ${res.statusCode}: ${data}`));
                }
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Fetch all entities with pagination support
 */
async function fetchAllEntities() {
    const allEntities = [];
    let page = 1;
    const limit = 100;
    let hasMore = true;

    while (hasMore) {
        try {
            const response = await fetchFromAPI(`/entities?page=${page}&limit=${limit}`);

            if (response.entities && Array.isArray(response.entities)) {
                allEntities.push(...response.entities);
                hasMore = response.entities.length === limit;
                page++;
                console.log(`Fetched ${allEntities.length} entities so far...`);
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error.message);
            hasMore = false;
        }
    }

    return allEntities;
}

/**
 * Filter entities related to Vince Gilligan's universe
 */
function filterGilliganEntities(entities) {
    const gilliganKeywords = [
        'pluribus',
        'breaking bad',
        'better call saul',
        'vince gilligan',
        'el camino',
        'x-files',
        'rhea seehorn',
        'carol sturka',
        'kim wexler',
        'walter white',
        'saul goodman',
        'jimmy mcgill'
    ];

    return entities.filter(entity => {
        const searchText = `${entity.name || ''} ${entity.description || ''} ${entity.metadata?.shows?.join(' ') || ''}`.toLowerCase();
        return gilliganKeywords.some(keyword => searchText.includes(keyword));
    });
}

/**
 * Transform API entities to graph format
 */
function transformToGraphFormat(entities) {
    const nodes = [];
    const links = [];
    const nodeIds = new Set();

    entities.forEach(entity => {
        // Create node
        const nodeId = entity.id || entity.name.toLowerCase().replace(/\s+/g, '-');

        // Avoid duplicates
        if (nodeIds.has(nodeId)) {
            return;
        }
        nodeIds.add(nodeId);

        const node = {
            id: nodeId,
            name: entity.name,
            type: TYPE_MAPPING[entity.type] || entity.type || 'concept',
            description: entity.description || `${entity.name} in the Gilligan universe`,
            metadata: entity.metadata || {}
        };

        nodes.push(node);

        // Extract relationships from entity
        if (entity.relationships && Array.isArray(entity.relationships)) {
            entity.relationships.forEach(rel => {
                const targetId = rel.target?.id || rel.targetId || rel.target;
                if (targetId) {
                    links.push({
                        source: nodeId,
                        target: targetId,
                        type: rel.type || 'related',
                        description: rel.description || `${entity.name} ${rel.type || 'related to'} ${rel.target?.name || targetId}`
                    });
                }
            });
        }
    });

    return { nodes, links };
}

/**
 * Generate knowledge graph JSON
 */
function generateKnowledgeGraph(nodes, links) {
    return {
        metadata: {
            title: "The Gilligan Universe",
            description: "Vince Gilligan's creative universe spanning Pluribus, Breaking Bad, and Better Call Saul",
            entity_count: nodes.length,
            relationship_count: links.length,
            last_updated: new Date().toISOString().split('T')[0]
        },
        nodes,
        links
    };
}

/**
 * Main execution
 */
async function main() {
    try {
        console.log('Starting knowledge graph update...');
        console.log(`Timestamp: ${new Date().toISOString()}\n`);

        // Fetch entities from API
        console.log('Fetching entities from UnitedTribes API...');
        const allEntities = await fetchAllEntities();
        console.log(`Total entities fetched: ${allEntities.length}\n`);

        // Filter for Gilligan universe
        console.log('Filtering for Gilligan universe entities...');
        const gilliganEntities = filterGilliganEntities(allEntities);
        console.log(`Gilligan entities found: ${gilliganEntities.length}\n`);

        // Transform to graph format
        console.log('Transforming to graph format...');
        const { nodes, links } = transformToGraphFormat(gilliganEntities);
        console.log(`Generated ${nodes.length} nodes and ${links.length} links\n`);

        // Generate final JSON
        const knowledgeGraph = generateKnowledgeGraph(nodes, links);

        // Write to file
        console.log(`Writing to ${OUTPUT_FILE}...`);
        await fs.writeFile(
            OUTPUT_FILE,
            JSON.stringify(knowledgeGraph, null, 2),
            'utf8'
        );

        console.log('\n✅ Knowledge graph updated successfully!');
        console.log(`   Entities: ${nodes.length}`);
        console.log(`   Relationships: ${links.length}`);
        console.log(`   Updated: ${knowledgeGraph.metadata.last_updated}`);

    } catch (error) {
        console.error('\n❌ Failed to update knowledge graph:');
        console.error(error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { main };
