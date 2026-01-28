// Gemini Assistant Panel Controller

class GeminiAssistant {
    constructor() {
        this.panel = document.getElementById('geminiAssistant');
        this.closeButton = document.getElementById('closeAssistant');
        this.toggleButton = document.getElementById('toggleAssistant');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');

        this.isVisible = true;

        this.init();
    }

    init() {
        // Close button
        this.closeButton.addEventListener('click', () => this.hide());

        // Toggle button
        this.toggleButton.addEventListener('click', () => this.show());

        // Send button
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Enter key to send
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Event delegation for entity links
        this.chatMessages.addEventListener('click', (e) => {
            const link = e.target.closest('.entity-link');
            if (link) {
                e.preventDefault();
                e.stopPropagation();
                const label = link.textContent.trim();
                console.log('Entity link clicked via delegation:', label);
                this.handleEntityLinkClick({ label, type: link.classList[1] }); // Get type from second class
            }

            // Handle suggestion chip clicks
            const suggestion = e.target.closest('.suggestion-chip');
            if (suggestion) {
                const query = suggestion.dataset.query;
                console.log('Suggestion clicked:', query);
                this.handleSuggestionClick(query);
            }
        });
    }

    handleSuggestionClick(query) {
        // Fill the input and send the message
        this.chatInput.value = query;
        this.sendMessage();

        // Hide suggestions after first query
        const suggestionsContainer = document.querySelector('.suggested-questions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    hide() {
        this.panel.classList.add('hidden');
        this.toggleButton.style.display = 'flex';
        this.isVisible = false;
    }

    show() {
        this.panel.classList.remove('hidden');
        this.toggleButton.style.display = 'none';
        this.isVisible = true;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        console.log('Sending message:', message);

        // Add user message to chat
        this.addUserMessage(message);

        // Clear input
        this.chatInput.value = '';

        // Process query through knowledge graph
        if (window.queryHandler) {
            console.log('Query handler found, processing query...');
            setTimeout(async () => {
                try {
                    const result = await window.queryHandler.processQuery(message);
                    console.log('Query result:', result);

                    // Add assistant response
                    this.addAssistantMessage(
                        result.response,
                        result.relatedLinks || []
                    );

                    // Highlight nodes in graph
                    if (window.universeGraph && result.highlightNodes) {
                        console.log('Highlighting nodes:', result.highlightNodes);
                        window.universeGraph.highlightNodes(result.highlightNodes);
                    }
                } catch (error) {
                    console.error('Error processing query:', error);
                    this.addAssistantMessage(
                        "I encountered an error processing your question. Please try again.",
                        []
                    );
                }
            }, 500);
        } else {
            console.warn('Query handler not found!');
            setTimeout(() => {
                this.addAssistantMessage(
                    "I'm still loading the knowledge graph. Please wait a moment and try again.",
                    []
                );
            }, 500);
        }
    }

    addUserMessage(text) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';

        messageGroup.innerHTML = `
            <div class="user-message">
                <div class="message-bubble">${this.escapeHtml(text)}</div>
            </div>
        `;

        this.chatMessages.appendChild(messageGroup);
        this.scrollToBottom();
    }

    addAssistantMessage(text, relatedLinks = []) {
        const messageGroup = document.createElement('div');
        messageGroup.className = 'message-group';

        let linksHtml = '';
        if (relatedLinks.length > 0) {
            linksHtml = `
                <div class="related-links">
                    <div class="link-label">Related links:</div>
                    ${relatedLinks.map(link =>
                        `<a href="#" class="entity-link ${link.type}">${this.escapeHtml(link.label)}</a>`
                    ).join('')}
                </div>
            `;
        }

        messageGroup.innerHTML = `
            <div class="assistant-message">
                <div class="gemini-icon-small">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z'/%3E%3C/svg%3E" alt="Gemini">
                </div>
                <div class="message-bubble">
                    <p>${this.escapeHtml(text)}</p>
                    ${linksHtml}
                </div>
            </div>
        `;

        this.chatMessages.appendChild(messageGroup);
        this.scrollToBottom();
    }

    handleEntityLinkClick(link) {
        console.log('Entity link clicked:', link);

        // Find the entity in the graph by name
        if (window.universeGraph && window.universeGraph.data) {
            // Try multiple matching strategies
            const entity = window.universeGraph.data.nodes.find(n => {
                // Exact name match
                if (n.name === link.label) return true;

                // Case-insensitive name match
                if (n.name.toLowerCase() === link.label.toLowerCase()) return true;

                // ID match (with spaces replaced by hyphens)
                const potentialId = link.label.toLowerCase().replace(/\s+/g, '-');
                if (n.id === potentialId) return true;

                return false;
            });

            if (entity) {
                console.log('Found entity:', entity);

                // Get connected nodes
                const connectedNodes = this.getConnectedNodes(entity.id);
                console.log('Connected nodes:', connectedNodes);

                // Highlight the entity and its connections
                window.universeGraph.highlightNodes([entity.id, ...connectedNodes], true);

                // Add a brief message showing what was focused
                this.addAssistantMessage(
                    `Focusing on ${entity.name} and its ${connectedNodes.length} connections.`,
                    []
                );
            } else {
                console.warn('Entity not found in graph:', link.label);
                console.log('Available nodes:', window.universeGraph.data.nodes.map(n => n.name));
            }
        } else {
            console.error('Graph not available');
        }
    }

    getConnectedNodes(entityId) {
        if (!window.universeGraph || !window.universeGraph.data) return [];

        const connected = new Set();

        window.universeGraph.data.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;

            if (sourceId === entityId) {
                connected.add(targetId);
            } else if (targetId === entityId) {
                connected.add(sourceId);
            }
        });

        return Array.from(connected);
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.geminiAssistant = new GeminiAssistant();
});
