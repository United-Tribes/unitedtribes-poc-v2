// Natural Language Query Handler for Knowledge Graph

class QueryHandler {
    constructor(graphData) {
        this.graphData = graphData;
        this.patterns = this.initializePatterns();
    }

    initializePatterns() {
        return [
            {
                patterns: [
                    /what.*has.*vince gilligan.*made/i,
                    /what.*vince gilligan.*created/i,
                    /show.*vince gilligan/i,
                    /vince gilligan.*shows/i
                ],
                handler: () => this.handleCreatorWorks('vince-gilligan')
            },
            {
                patterns: [
                    /who.*cinematographer/i,
                    /who.*shot/i,
                    /who.*filmed/i
                ],
                handler: () => this.handleCinematographerQuery()
            },
            {
                patterns: [
                    /who.*rhea seehorn/i,
                    /rhea seehorn.*character/i,
                    /rhea seehorn.*play/i
                ],
                handler: () => this.handleActorCharacters('rhea-seehorn')
            },
            {
                patterns: [
                    /connection.*pluribus.*better call saul/i,
                    /pluribus.*better call saul/i,
                    /better call saul.*pluribus/i
                ],
                handler: () => this.handleShowConnections('pluribus', 'better-call-saul')
            },
            {
                patterns: [
                    /what.*hive/i,
                    /explain.*hive/i,
                    /hive mind/i
                ],
                handler: () => this.handleHiveMindQuery()
            },
            {
                patterns: [
                    /theme/i,
                    /about/i
                ],
                handler: (query) => this.handleThemeQuery(query)
            }
        ];
    }

    async processQuery(query) {
        // Find matching pattern
        for (const pattern of this.patterns) {
            for (const regex of pattern.patterns) {
                if (regex.test(query)) {
                    return await pattern.handler(query);
                }
            }
        }

        // Default response if no pattern matches
        return this.handleGenericQuery(query);
    }

    handleCreatorWorks(creatorId) {
        const shows = this.graphData.links
            .filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                return sourceId === creatorId && (link.type === 'created' || link.type === 'co-created');
            })
            .map(link => {
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return this.graphData.nodes.find(n => n.id === targetId);
            })
            .filter(Boolean);

        const showNames = shows.map(s => s.name).join(', ');

        return {
            response: `Vince Gilligan has created ${shows.length} major shows: ${showNames}. His work spans from The X-Files to the interconnected universe of Breaking Bad, Better Call Saul, and now Pluribus.`,
            relatedLinks: [
                { type: 'creator', label: 'Vince Gilligan' },
                ...shows.map(s => ({ type: 'show', label: s.name }))
            ],
            highlightNodes: [creatorId, ...shows.map(s => s.id)]
        };
    }

    handleCinematographerQuery() {
        const cinematographer = this.graphData.nodes.find(n => n.id === 'marshall-adams');

        if (!cinematographer) {
            return this.handleGenericQuery();
        }

        const shows = this.graphData.links
            .filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                return sourceId === 'marshall-adams' && link.type === 'cinematography';
            })
            .map(link => {
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return this.graphData.nodes.find(n => n.id === targetId);
            })
            .filter(Boolean);

        return {
            response: `Marshall Adams is the cinematographer for both Better Call Saul and Pluribus. His signature "Albuquerque Noir" lighting style creates the distinctive visual atmosphere you're noticing.`,
            relatedLinks: [
                { type: 'crew', label: 'Marshall Adams' },
                ...shows.map(s => ({ type: 'show', label: s.name }))
            ],
            highlightNodes: ['marshall-adams', ...shows.map(s => s.id)]
        };
    }

    handleActorCharacters(actorId) {
        const actor = this.graphData.nodes.find(n => n.id === actorId);

        const characters = this.graphData.links
            .filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                return sourceId === actorId && link.type === 'portrayed';
            })
            .map(link => {
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return this.graphData.nodes.find(n => n.id === targetId);
            })
            .filter(Boolean);

        if (actor && actor.id === 'rhea-seehorn') {
            return {
                response: `Rhea Seehorn has portrayed two iconic characters: Kim Wexler in Better Call Saul (the "Stoic Lawyer") and Carol Sturka in Pluribus (the "Unraveled Survivor"). She won a Golden Globe for her performance in Pluribus.`,
                relatedLinks: [
                    { type: 'actor', label: 'Rhea Seehorn' },
                    { type: 'character', label: 'Kim Wexler' },
                    { type: 'character', label: 'Carol Sturka' }
                ],
                highlightNodes: [actorId, ...characters.map(c => c.id)]
            };
        }

        return this.handleGenericQuery();
    }

    handleShowConnections(show1Id, show2Id) {
        // Find shared entities between shows
        const show1Connections = this.graphData.links
            .filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return targetId === show1Id || sourceId === show1Id;
            })
            .map(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return sourceId === show1Id ? targetId : sourceId;
            });

        const show2Connections = this.graphData.links
            .filter(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return targetId === show2Id || sourceId === show2Id;
            })
            .map(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;
                return sourceId === show2Id ? targetId : sourceId;
            });

        const sharedEntities = show1Connections.filter(id => show2Connections.includes(id));
        const entities = sharedEntities
            .map(id => this.graphData.nodes.find(n => n.id === id))
            .filter(Boolean);

        const entityNames = entities.map(e => e.name).join(', ');

        return {
            response: `Pluribus and Better Call Saul share several key connections: ${entityNames}. Most notably, Rhea Seehorn stars in both shows, and they share creative team members like Peter Gould and cinematographer Marshall Adams.`,
            relatedLinks: entities.slice(0, 4).map(e => ({
                type: e.type,
                label: e.name
            })),
            highlightNodes: [show1Id, show2Id, ...sharedEntities]
        };
    }

    handleHiveMindQuery() {
        return {
            response: `The "Hive" in Pluribus refers to a collective consciousness created by The Pluribus Virus - a sentient AI that inhabits multiple human bodies simultaneously. It's a central theme exploring what happens when individual identity merges with group consciousness.`,
            relatedLinks: [
                { type: 'concept', label: 'The Pluribus Virus' },
                { type: 'concept', label: 'The Hive Mind' },
                { type: 'theme', label: 'Collective Consciousness' }
            ],
            highlightNodes: ['the-pluribus-virus', 'the-hive-mind', 'collective-consciousness']
        };
    }

    handleThemeQuery(query) {
        const themes = this.graphData.nodes.filter(n => n.type === 'theme');

        return {
            response: `The Gilligan universe explores several interconnected themes: Transformation (Breaking Bad, Better Call Saul) and Collective Consciousness (Pluribus). These themes examine how people change and what happens to individual identity under external pressures.`,
            relatedLinks: themes.map(t => ({
                type: 'theme',
                label: t.name
            })),
            highlightNodes: themes.map(t => t.id)
        };
    }

    handleGenericQuery(query) {
        return {
            response: `I'm exploring the Vince Gilligan universe knowledge graph. Try asking about connections between shows, what Vince Gilligan has created, or specific themes like the hive mind in Pluribus.`,
            relatedLinks: [
                { type: 'entity', label: 'Vince Gilligan' },
                { type: 'show', label: 'Pluribus' },
                { type: 'show', label: 'Breaking Bad' }
            ],
            highlightNodes: ['vince-gilligan', 'pluribus', 'breaking-bad']
        };
    }
}

// Export for use in assistant
window.QueryHandler = QueryHandler;
