// Universe Graph Visualization Controller

class UniverseGraph {
    constructor() {
        this.svg = d3.select('#universe-graph');
        this.container = null;
        this.width = 0;
        this.height = 0;
        this.simulation = null;
        this.zoom = null;

        this.data = {
            nodes: [],
            links: []
        };

        this.nodes = null;
        this.links = null;
        this.labels = null;

        this.init();
    }

    init() {
        // Set up SVG dimensions
        this.updateDimensions();

        // Create container group for zoom/pan
        this.container = this.svg.append('g');

        // Set up zoom
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.container.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Window resize handler
        window.addEventListener('resize', () => {
            this.updateDimensions();
            if (this.simulation) {
                this.simulation
                    .force('center', d3.forceCenter(this.width / 2, this.height / 2))
                    .alpha(0.3)
                    .restart();
            }
        });

        // Load data
        this.loadData();

        // Set up auto-refresh every 8 hours (3x per day)
        this.setupAutoRefresh();
    }

    setupAutoRefresh() {
        // Refresh every 8 hours (8 * 60 * 60 * 1000 milliseconds)
        const refreshInterval = 8 * 60 * 60 * 1000;

        setInterval(() => {
            console.log('Auto-refreshing graph data...');
            this.refreshData();
        }, refreshInterval);

        console.log('Auto-refresh enabled: graph will reload every 8 hours');
    }

    async refreshData() {
        try {
            const response = await fetch('src/data/gilligan-universe.json?' + Date.now());
            const data = await response.json();

            console.log('Refreshed graph data:', data);

            // Update data
            this.data.nodes = data.nodes.map(node => ({
                id: node.id,
                name: node.name,
                type: node.type,
                description: node.description,
                metadata: node.metadata
            }));

            this.data.links = data.links.map(link => ({
                source: link.source,
                target: link.target,
                type: link.type,
                description: link.description
            }));

            console.log('Graph refreshed with', this.data.nodes.length, 'nodes and', this.data.links.length, 'links');

            // Re-render the graph
            this.container.selectAll('*').remove();
            this.render();

            // Re-initialize query handler with new data
            if (window.QueryHandler) {
                window.queryHandler = new QueryHandler(this.data);
                console.log('Query handler re-initialized with refreshed data');
            }
        } catch (error) {
            console.error('Failed to refresh graph data:', error);
        }
    }

    updateDimensions() {
        const graphContainer = document.querySelector('.graph-container');
        this.width = graphContainer.clientWidth;
        this.height = graphContainer.clientHeight;

        this.svg
            .attr('width', this.width)
            .attr('height', this.height);
    }

    async loadData() {
        try {
            const response = await fetch('src/data/gilligan-universe.json');
            const data = await response.json();

            console.log('Loaded graph data:', data);

            // Transform data for D3
            this.data.nodes = data.nodes.map(node => ({
                id: node.id,
                name: node.name,
                type: node.type,
                description: node.description,
                metadata: node.metadata
            }));

            this.data.links = data.links.map(link => ({
                source: link.source,
                target: link.target,
                type: link.type,
                description: link.description
            }));

            console.log('Graph has', this.data.nodes.length, 'nodes and', this.data.links.length, 'links');

            this.render();

            // Initialize query handler after data is loaded
            if (window.QueryHandler) {
                window.queryHandler = new QueryHandler(this.data);
                console.log('Query handler initialized with graph data');
            }
        } catch (error) {
            console.error('Failed to load graph data:', error);
        }
    }

    render() {
        // Remove placeholder
        const placeholder = document.querySelector('.graph-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Initialize force simulation
        this.simulation = d3.forceSimulation(this.data.nodes)
            .force('link', d3.forceLink(this.data.links)
                .id(d => d.id)
                .distance(d => {
                    if (d.type === 'created') return 100;
                    if (d.type === 'portrayed') return 120;
                    if (d.type === 'appears-in') return 140;
                    return 150;
                })
                .strength(0.2))
            .force('charge', d3.forceManyBody()
                .strength(d => {
                    if (d.type === 'creator') return -1000;
                    if (d.type === 'show') return -800;
                    return -600;
                }))
            .force('center', d3.forceCenter(this.width / 2, this.height / 2))
            .force('collision', d3.forceCollide()
                .radius(d => this.getNodeRadius(d) + 15))
            .alphaTarget(0)
            .alphaDecay(0.02)
            .velocityDecay(0.5);

        // Create links
        this.links = this.container.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(this.data.links)
            .enter()
            .append('line')
            .attr('stroke', '#dadce0')
            .attr('stroke-width', d => {
                if (d.type === 'created') return 2.5;
                if (d.type === 'portrayed') return 2;
                return 1.5;
            })
            .attr('stroke-opacity', 0.6);

        // Create nodes
        this.nodes = this.container.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(this.data.nodes)
            .enter()
            .append('circle')
            .attr('r', d => this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', '#fff')
            .attr('stroke-width', 2)
            .style('cursor', 'pointer')
            .call(d3.drag()
                .on('start', (event, d) => this.dragstarted(event, d))
                .on('drag', (event, d) => this.dragged(event, d))
                .on('end', (event, d) => this.dragended(event, d)))
            .on('click', (event, d) => this.handleNodeClick(event, d))
            .on('mouseover', (event, d) => this.handleNodeHover(event, d))
            .on('mousemove', (event, d) => this.handleNodeMove(event, d))
            .on('mouseout', () => this.handleNodeLeave());

        // Create labels
        this.labels = this.container.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(this.data.nodes)
            .enter()
            .append('text')
            .text(d => d.name)
            .attr('font-size', d => {
                if (d.type === 'creator') return '14px';
                if (d.type === 'show') return '13px';
                return '12px';
            })
            .attr('font-weight', d => (d.type === 'creator' || d.type === 'show') ? '500' : '400')
            .attr('fill', '#202124')
            .attr('text-anchor', 'middle')
            .attr('dy', d => this.getNodeRadius(d) + 16)
            .style('pointer-events', 'none')
            .style('user-select', 'none');

        // Start simulation
        this.simulation.on('tick', () => this.ticked());
    }

    getNodeRadius(d) {
        if (d.type === 'creator') return 24;
        if (d.type === 'show') return 20;
        if (d.type === 'actor' || d.type === 'character') return 14;
        if (d.type === 'theme' || d.type === 'concept') return 12;
        if (d.type === 'episode' || d.type === 'critic') return 11;
        if (d.type === 'cultural_ref') return 10;
        return 10;
    }

    getNodeColor(d) {
        const colorMap = {
            'creator': '#e91e63',
            'show': '#9c27b0',
            'actor': '#2196f3',
            'character': '#00bcd4',
            'crew': '#ff9800',
            'theme': '#4caf50',
            'concept': '#ba68c8',
            'episode': '#673ab7',
            'critic': '#795548',
            'cultural_ref': '#607d8b'
        };
        return colorMap[d.type] || '#607d8b';
    }

    ticked() {
        this.links
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        this.nodes
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);

        this.labels
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    }

    dragstarted(event, d) {
        if (!event.active) this.simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    dragended(event, d) {
        if (!event.active) this.simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    handleNodeClick(event, d) {
        event.stopPropagation();
        console.log('Node clicked:', d);

        // Check if this is a person with a profile view
        const peopleWithProfiles = ['vince-gilligan', 'rhea-seehorn'];

        if (peopleWithProfiles.includes(d.id) && window.profileView) {
            // Show profile view
            window.profileView.show(d.id);
        } else {
            // Show entity details in assistant panel for other entities
            if (window.geminiAssistant) {
                window.geminiAssistant.show();
                window.geminiAssistant.addAssistantMessage(
                    `${d.name}: ${d.description}`,
                    []
                );
            }
        }
    }

    handleNodeHover(event, d) {
        const tooltip = document.getElementById('graph-tooltip');
        if (!tooltip) return;

        // Get type name for display
        const typeNames = {
            'creator': 'Creator',
            'show': 'TV Series',
            'actor': 'Actor',
            'character': 'Character',
            'crew': 'Crew',
            'theme': 'Theme',
            'concept': 'Story Concept'
        };

        // Update tooltip content
        tooltip.querySelector('.tooltip-title').textContent = d.name;
        tooltip.querySelector('.tooltip-type').textContent = typeNames[d.type] || d.type;
        tooltip.querySelector('.tooltip-description').textContent = d.description || '';

        // Position tooltip near mouse cursor
        const containerRect = event.currentTarget.closest('.graph-container').getBoundingClientRect();
        const x = event.pageX - containerRect.left + 15;
        const y = event.pageY - containerRect.top + 15;

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
        tooltip.classList.add('visible');
    }

    handleNodeMove(event, d) {
        const tooltip = document.getElementById('graph-tooltip');
        if (!tooltip || !tooltip.classList.contains('visible')) return;

        // Update tooltip position to follow cursor
        const containerRect = event.currentTarget.closest('.graph-container').getBoundingClientRect();
        const x = event.pageX - containerRect.left + 15;
        const y = event.pageY - containerRect.top + 15;

        tooltip.style.left = x + 'px';
        tooltip.style.top = y + 'px';
    }

    handleNodeLeave() {
        const tooltip = document.getElementById('graph-tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    highlightNodes(nodeIds, focusOnFirst = true) {
        console.log('Highlighting nodes:', nodeIds);

        // Reset all nodes to normal state
        this.nodes
            .transition()
            .duration(300)
            .attr('opacity', d => nodeIds.includes(d.id) ? 1 : 0.15)
            .attr('r', d => {
                const baseRadius = this.getNodeRadius(d);
                return nodeIds.includes(d.id) ? baseRadius * 1.4 : baseRadius;
            })
            .attr('stroke-width', d => nodeIds.includes(d.id) ? 3 : 2);

        // Highlight relevant links
        this.links
            .transition()
            .duration(300)
            .attr('stroke-opacity', d => {
                const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
                const targetId = typeof d.target === 'object' ? d.target.id : d.target;
                return (nodeIds.includes(sourceId) && nodeIds.includes(targetId)) ? 0.9 : 0.05;
            })
            .attr('stroke-width', d => {
                const sourceId = typeof d.source === 'object' ? d.source.id : d.source;
                const targetId = typeof d.target === 'object' ? d.target.id : d.target;
                return (nodeIds.includes(sourceId) && nodeIds.includes(targetId)) ? 2.5 : 1.5;
            });

        // Highlight labels
        this.labels
            .transition()
            .duration(300)
            .attr('opacity', d => nodeIds.includes(d.id) ? 1 : 0.2)
            .attr('font-weight', d => nodeIds.includes(d.id) ? '600' : '400');

        // Focus/zoom on the primary node if requested
        if (focusOnFirst && nodeIds.length > 0) {
            const primaryNode = this.data.nodes.find(n => n.id === nodeIds[0]);
            if (primaryNode) {
                this.focusOnNode(primaryNode);
            }
        }

        // Auto-reset after 8 seconds
        setTimeout(() => this.resetHighlight(), 8000);
    }

    focusOnNode(node) {
        // Calculate zoom transform to center on this node
        const scale = 1.5;
        const x = this.width / 2 - node.x * scale;
        const y = this.height / 2 - node.y * scale;

        this.svg
            .transition()
            .duration(750)
            .call(
                this.zoom.transform,
                d3.zoomIdentity.translate(x, y).scale(scale)
            );
    }

    resetHighlight() {
        this.nodes
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('r', d => this.getNodeRadius(d))
            .attr('stroke-width', 2);

        this.links
            .transition()
            .duration(300)
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => {
                if (d.type === 'created') return 2.5;
                if (d.type === 'portrayed') return 2;
                return 1.5;
            });

        this.labels
            .transition()
            .duration(300)
            .attr('opacity', 1)
            .attr('font-weight', d => (d.type === 'creator' || d.type === 'show') ? '500' : '400');

        // Reset zoom to default view
        this.svg
            .transition()
            .duration(750)
            .call(
                this.zoom.transform,
                d3.zoomIdentity
            );
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.universeGraph = new UniverseGraph();
});
