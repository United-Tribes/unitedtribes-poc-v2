// Profile/Dossier View Controller

class ProfileView {
    constructor() {
        this.graphContainer = document.querySelector('.graph-container');
        this.profileData = this.initializeProfileData();
        this.currentProfile = null;
    }

    initializeProfileData() {
        return {
            'vince-gilligan': {
                name: 'Vince Gilligan',
                title: 'Creator & Showrunner',
                type: 'creator',
                heroImage: 'public/images/profiles/vince-gilligan-hero.jpg',
                bio: 'Emmy Award-winning creator, writer, and director known for Breaking Bad, Better Call Saul, and Pluribus. Gilligan\'s work explores moral transformation and the duality of human nature.',
                timeline: [
                    { year: 1993, title: 'The X-Files', description: 'Writer/Producer' },
                    { year: 2008, title: 'Breaking Bad', description: 'Creator' },
                    { year: 2015, title: 'Better Call Saul', description: 'Co-Creator' },
                    { year: 2019, title: 'El Camino', description: 'Writer/Director' },
                    { year: 2025, title: 'Pluribus', description: 'Creator' }
                ],
                stats: {
                    'Emmy Awards': '10',
                    'Series Created': '3',
                    'Episodes Directed': '25+'
                },
                videoClips: [
                    { title: 'Pluribus Behind the Scenes', duration: '3:24' },
                    { title: 'Breaking Bad Legacy', duration: '8:15' },
                    { title: 'Creating Pluribus', duration: '12:40' }
                ]
            },
            'rhea-seehorn': {
                name: 'Rhea Seehorn',
                title: 'Actor',
                type: 'actor',
                heroImage: 'public/images/profiles/rhea-seehorn-hero.jpg',
                bio: 'Golden Globe-winning actress acclaimed for her nuanced portrayals of complex women. Best known for her transformative performances as Kim Wexler in Better Call Saul (2015-2022) and Carol Sturka in Pluribus (2025-present). Seehorn\'s work explores the interior lives of women navigating impossible choices, earning critical acclaim and a devoted following.',
                characters: [
                    {
                        name: 'Carol Sturka',
                        show: 'Pluribus',
                        year: '2025-Present',
                        image: 'https://via.placeholder.com/400x500/2c3e50/ffffff?text=Carol+Sturka%0APluribus',
                        description: 'A writer struggling with identity and agency in a post-pandemic world transformed by collective consciousness.',
                        archetype: 'Unraveled Survivor',
                        awards: 'Golden Globe 2026 - Best Actress'
                    },
                    {
                        name: 'Kim Wexler',
                        show: 'Better Call Saul',
                        year: '2015-2022',
                        image: 'https://via.placeholder.com/400x500/1a472a/ffffff?text=Kim+Wexler%0ABetter+Call+Saul',
                        description: 'A morally conflicted attorney whose relationship with Jimmy McGill leads her down an increasingly dark path.',
                        archetype: 'Stoic Lawyer',
                        awards: '3 Emmy Nominations'
                    }
                ],
                timeline: [
                    { year: 2015, title: 'Better Call Saul', description: 'Kim Wexler - Series Regular' },
                    { year: 2019, title: 'TCA Award', description: 'Individual Achievement in Drama' },
                    { year: 2022, title: 'Emmy Nomination', description: 'Outstanding Lead Actress' },
                    { year: 2025, title: 'Pluribus Premiere', description: 'Carol Sturka - Lead Role' },
                    { year: 2026, title: 'Golden Globe Win', description: 'Best Actress - Drama Series' }
                ],
                stats: {
                    'Golden Globes': '1',
                    'Emmy Nominations': '3',
                    'Years Active': '10+'
                },
                videoClips: [
                    { title: 'Golden Globe Acceptance Speech', duration: '2:45' },
                    { title: 'Creating Carol Sturka', duration: '5:12' },
                    { title: 'Kim Wexler: A Retrospective', duration: '8:30' }
                ]
            }
        };
    }

    show(entityId) {
        const profile = this.profileData[entityId];
        if (!profile) {
            console.warn('No profile data for:', entityId);
            return;
        }

        this.currentProfile = entityId;
        this.render(profile);

        // Hide graph, show profile
        const svg = document.getElementById('universe-graph');
        const placeholder = document.querySelector('.graph-placeholder');
        if (svg) svg.style.display = 'none';
        if (placeholder) placeholder.style.display = 'none';

        // Update header
        const viewTitle = document.querySelector('.view-title');
        if (viewTitle) {
            viewTitle.innerHTML = `
                <span style="cursor: pointer; color: #4285f4;" id="backToGraph">← The Gilligan Universe</span>
                <span style="color: #dadce0; margin: 0 8px;">/</span>
                <span>${profile.name}</span>
            `;

            document.getElementById('backToGraph').addEventListener('click', () => {
                this.hide();
            });
        }
    }

    hide() {
        // Remove profile view
        const existingProfile = document.getElementById('profile-view');
        if (existingProfile) {
            existingProfile.remove();
        }

        // Show graph again
        const svg = document.getElementById('universe-graph');
        if (svg) svg.style.display = 'block';

        // Reset header
        const viewTitle = document.querySelector('.view-title');
        if (viewTitle) {
            viewTitle.textContent = 'The Gilligan Universe';
        }

        this.currentProfile = null;
    }

    render(profile) {
        // Remove existing profile if any
        const existing = document.getElementById('profile-view');
        if (existing) existing.remove();

        const profileView = document.createElement('div');
        profileView.id = 'profile-view';
        profileView.className = 'profile-view';

        // Hero image
        const heroImageSrc = profile.heroImage;
        const heroHtml = `
            <div class="profile-hero">
                <img src="${heroImageSrc}" alt="${profile.name}">
            </div>
        `;

        // Build characters gallery if actor has characters
        let charactersHtml = '';
        if (profile.characters) {
            charactersHtml = `
                <div class="profile-characters">
                    <h4 class="section-title">Characters</h4>
                    <div class="characters-gallery">
                        ${profile.characters.map(char => `
                            <div class="character-card">
                                <div class="character-image">
                                    <img src="${char.image}" alt="${char.name}">
                                </div>
                                <div class="character-info">
                                    <div class="character-name">${char.name}</div>
                                    <div class="character-show">${char.show} (${char.year})</div>
                                    <div class="character-archetype">${char.archetype}</div>
                                    <div class="character-description">${char.description}</div>
                                    ${char.awards ? `<div class="character-awards">🏆 ${char.awards}</div>` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        profileView.innerHTML = `
            <div class="profile-header">
                <div class="profile-title-section">
                    <h2 class="profile-type">${profile.type === 'creator' ? 'Creator Dossier' : 'Actor Dossier'}</h2>
                    <h3 class="profile-subtitle">${profile.title}</h3>
                </div>
            </div>

            ${heroHtml}

            <div class="profile-content">
                <div class="profile-bio">
                    <p>${profile.bio}</p>
                </div>

                <div class="profile-stats">
                    ${Object.entries(profile.stats).map(([key, value]) => `
                        <div class="stat-item">
                            <div class="stat-label">${key}</div>
                            <div class="stat-value">${value}</div>
                        </div>
                    `).join('')}
                </div>

                ${charactersHtml}

                <div class="profile-timeline">
                    <h4 class="section-title">Timeline</h4>
                    <div class="timeline-container">
                        ${profile.timeline.map(event => `
                            <div class="timeline-event">
                                <div class="timeline-year">${event.year}</div>
                                <div class="timeline-marker"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">${event.title}</div>
                                    <div class="timeline-description">${event.description}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="profile-videos">
                    <h4 class="section-title">Featured Video Clips</h4>
                    <div class="video-grid">
                        ${profile.videoClips.map(video => `
                            <div class="video-card">
                                <div class="video-thumbnail">
                                    <div class="play-icon">▶</div>
                                    <div class="video-duration">${video.duration}</div>
                                </div>
                                <div class="video-title">${video.title}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        this.graphContainer.appendChild(profileView);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.profileView = new ProfileView();
});
