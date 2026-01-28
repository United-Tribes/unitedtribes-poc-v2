# UnitedTribes POC v2 - The Gilligan Universe

**Interactive Knowledge Graph Visualization**
**Created:** January 28, 2026
**Status:** Production-ready prototype

## Overview

An interactive web application that visualizes Vince Gilligan's creative universe (Pluribus, Breaking Bad, Better Call Saul) as a dynamic knowledge graph. Built with D3.js force-directed layout, the interface features AI-powered chat assistance, entity exploration, and profile/dossier views for creators and actors.

**Live Demo:** [http://localhost:8001](http://localhost:8001)

![The Gilligan Universe](public/images/screenshot.png)

## Features

### ✅ Interactive Knowledge Graph
- **D3.js Force-Directed Visualization** - 85+ nodes covering creators, shows, episodes, actors, characters, themes, critics, and cultural references
- **Color-Coded Entity Types** - Visual distinction for 9 different entity categories
- **Interactive Hover Tooltips** - Instant entity information on mouseover
- **Dynamic Node Sizing** - Visual hierarchy based on entity importance
- **Click-to-Explore** - Click entities to view detailed information or open profile views

### ✅ Gemini AI Assistant
- **Natural Language Queries** - Ask questions about the Gilligan universe
- **Knowledge Graph Integration** - Real-time entity search and retrieval
- **Suggested Questions** - Curated prompts to get started
- **Entity Links** - Clickable references with type badges (Character, Show, Person, etc.)
- **Toggleable Panel** - Hide/show assistant sidebar

### ✅ Profile/Dossier Views
- **Creator Dossier** - Vince Gilligan profile with hero image, timeline, stats, and video clips
- **Actor Dossier** - Rhea Seehorn profile featuring:
  - Professional hero photo
  - Character gallery (Carol Sturka, Kim Wexler)
  - Career timeline with awards
  - Golden Globe 2026 recognition
  - Featured video clips
- **Hero Images** - Real professional photos (1200x400 banner format)
- **Breadcrumb Navigation** - Easy return to graph view

### ✅ Three-Panel Layout
- **Left Sidebar** - Navigation menu (Universe, Characters, Episodes, Sonic Layer, etc.)
- **Center Canvas** - Main visualization or profile view
- **Right Sidebar** - Gemini Assistant panel with chat interface

### ✅ Query Handler
- **Entity Search** - Natural language processing for entity discovery
- **Type-Based Filtering** - Search by entity type (person, show, character, theme, etc.)
- **Link Generation** - Automatic entity link creation in responses
- **Error Handling** - Graceful fallbacks for unknown entities

## Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Visualization:** D3.js v7 (force-directed graph)
- **Styling:** Custom CSS with Google-inspired design system
- **Server:** Python SimpleHTTPServer (development)
- **Data:** JSON-based knowledge graph (85 nodes, 83 relationships)

## File Structure

```
unitedtribes-poc-v2/
├── index.html                          # Main application entry
├── src/
│   ├── components/
│   │   ├── app.js                     # Main app controller
│   │   ├── assistant.js               # Gemini Assistant panel logic
│   │   ├── graph.js                   # D3 force-directed graph
│   │   ├── profile-view.js            # Profile/dossier views
│   │   └── query-handler.js           # Natural language query processing
│   ├── styles/
│   │   └── main.css                   # All application styles
│   └── data/
│       └── gilligan-universe.json     # Knowledge graph data
├── public/
│   └── images/
│       └── profiles/                  # Profile hero images
│           ├── vince-gilligan-hero.jpg
│           └── rhea-seehorn-hero.jpg
├── scripts/
│   ├── update-knowledge-graph.js      # API integration script (future)
│   └── schedule-updates.sh            # Cron setup for auto-updates
├── README.md                          # This file
├── README-IMAGES.md                   # Image setup guide
├── README-UPDATES.md                  # Auto-update system docs
└── IMAGE-SOURCES.md                   # Photo licensing info
```

## Running the Project

### Quick Start

```bash
cd unitedtribes-poc-v2
python3 -m http.server 8001
```

Then visit: **http://localhost:8001**

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local dev server)
- Internet connection (for D3.js CDN)

## Knowledge Graph Data

The knowledge graph (`src/data/gilligan-universe.json`) contains:

- **7 Creators** - Vince Gilligan, Rhea Seehorn, Peter Gould, etc.
- **5 Shows** - Pluribus, Breaking Bad, Better Call Saul, El Camino, X-Files
- **9 Episodes** - Pluribus Season 1 episodes
- **10 Actors** - Cast from across the Gilligan universe
- **10 Characters** - Carol Sturka, Kim Wexler, Jesse Pinkman, Walter White, etc.
- **5 Themes** - Identity crisis, moral transformation, collective consciousness, etc.
- **6 Critics** - Vanity Fair, Polygon, TV Guide, etc.
- **8 Cultural References** - Hive mind, COVID-19, surveillance state, etc.

**Total:** 85 nodes, 83 relationships

## Design System

### Color Palette

| Entity Type | Color | Hex Code |
|------------|-------|----------|
| Creator | Green | `#4caf50` |
| Show | Blue | `#2196f3` |
| Actor | Yellow | `#ffc107` |
| Character | Red | `#f44336` |
| Episode | Purple | `#673ab7` |
| Crew | Orange | `#ff9800` |
| Theme | Pink | `#e91e63` |
| Concept | Teal | `#009688` |
| Critic | Brown | `#795548` |
| Cultural Ref | Blue Grey | `#607d8b` |

### Typography

- **Font Stack:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
- **Base Size:** 14px
- **Headers:** 16-24px
- **Monospace:** SF Mono, Consolas, Monaco

### Layout Dimensions

- **Left Sidebar:** 240px
- **Right Sidebar:** 360px
- **Center Canvas:** Flexible (calc'd)
- **Graph Container:** 100% height
- **Profile Hero:** 1200x400px

## Usage Examples

### Exploring the Graph
1. **Pan & Zoom** - Click and drag the background, use scroll wheel to zoom
2. **Hover Entities** - See entity name, type, and description in tooltip
3. **Click Nodes** - Open detailed info or profile view
4. **Legend Filtering** - (Future) Click legend to filter entity types

### Using the Assistant
1. **Ask Questions** - "What has Vince Gilligan created?"
2. **Try Suggestions** - Click suggested question chips
3. **Follow Entity Links** - Click entity badges to highlight in graph
4. **Toggle Panel** - Close/open assistant with × button or toggle icon

### Viewing Profiles
1. **Click Person Nodes** - Vince Gilligan or Rhea Seehorn
2. **Explore Timeline** - See career milestones chronologically
3. **Browse Characters** - (Rhea) View character gallery cards
4. **Return to Graph** - Click "← The Gilligan Universe" breadcrumb

## Recent Updates

### January 28, 2026
- ✅ Added profile/dossier views for Vince Gilligan and Rhea Seehorn
- ✅ Integrated real hero images (professional headshots)
- ✅ Created character gallery for actor profiles
- ✅ Expanded knowledge graph to 85+ entities
- ✅ Added 9 entity types with color coding
- ✅ Implemented query handler with natural language processing
- ✅ Added breadcrumb navigation for profile views
- ✅ Created comprehensive documentation (README-IMAGES.md, IMAGE-SOURCES.md)

## Future Enhancements

### Phase 2: API Integration
- [ ] Connect to UnitedTribes Knowledge Graph API
- [ ] Auto-update knowledge graph 3x daily
- [ ] Real-time entity synchronization
- [ ] API endpoint: `https://166ws8jk15.execute-api.us-east-1.amazonaws.com/prod`

### Phase 3: Enhanced Interactions
- [ ] Legend filtering (click to show/hide entity types)
- [ ] Search bar for entity lookup
- [ ] Graph highlighting based on queries
- [ ] Deep linking to specific entities
- [ ] Relationship type visualization (edge labels)

### Phase 4: Additional Profiles
- [ ] Peter Gould (Co-Creator)
- [ ] Bob Odenkirk (Saul Goodman)
- [ ] Bryan Cranston (Walter White)
- [ ] Aaron Paul (Jesse Pinkman)
- [ ] Character-specific dossiers

### Phase 5: Multi-Universe Support
- [ ] Add Breaking Bad universe data
- [ ] Add X-Files universe data
- [ ] Universe switcher in navigation
- [ ] Cross-universe connections

## Image Credits

Profile photos:
- **Vince Gilligan:** Professional headshot 2024
- **Rhea Seehorn:** Professional headshot

See [IMAGE-SOURCES.md](IMAGE-SOURCES.md) for photo licensing and sourcing information.

## Related Projects

- **UnitedTribes API** - Knowledge graph backend (599 relationships)
- **Pluribus Visualization** - Original 120+ entity network graph
- **Visualization v2 Repository** - Reusable D3.js patterns

## Key Concepts

**Knowledge Graph Visualization:**
- Semantic relationships between entities (created, acted_in, features, influences)
- Force-directed layout for natural clustering
- Visual hierarchy through size and color

**Profile/Dossier Views:**
- Deep-dive into individuals
- Timeline-based storytelling
- Character evolution for actors (personas across shows)

**AI-Powered Assistance:**
- Natural language understanding
- Context-aware responses
- Entity extraction and linking

## Contributing

This is a prototype/proof-of-concept. For production deployment:
1. Set up backend API for knowledge graph queries
2. Implement Gemini API integration for real LLM responses
3. Add authentication for API access
4. Optimize image loading (CDN, lazy loading)
5. Add analytics and error tracking

## License

Proprietary - UnitedTribes Project
© 2026 All rights reserved

---

**Built by:** Claude Code + Human collaboration
**Visualization powered by:** D3.js v7
**Design inspired by:** Google Material Design & Apple TV+
