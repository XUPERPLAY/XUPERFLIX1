// ===== CONFIGURACIÓN PERSONALIZADA XUPERFLIX =====
const XUPERFLIX = {
    name: 'XUPERFLIX',
    colors: {
        primary: '#ff0000',
        secondary: '#121212',
        background: '#000000',
        text: '#ffffff'
    },
    apiEndpoints: {
        movies: atob('aHR0cHM6Ly9hbnVzZGJzLm9ucmVuZGVyLmNvbS9tb3ZpZXM/YXBpLWtleT01NDA0Mzg='),
        series: atob('aHR0cHM6Ly9hbnVzZGJzLm9ucmVuZGVyLmNvbS9zZXJpZXMvP2FwaS1rZXk9NTQwNDM4')
    }
};

// ===== ELEMENTOS DEL DOM =====
const elements = {
    hero: document.getElementById('hero-section'),
    content: document.getElementById('content-container'),
    loading: document.getElementById('loading'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    tabs: document.querySelectorAll('.nav-tab'),
    container: document.getElementById('tabs')
};

// ===== ESTADO GLOBAL =====
let state = {
    movies: [],
    series: [],
    currentType: 'movies',
    isLoading: false,
    isSearchActive: false
};

// ===== FUNCIONES AUXILIARES =====
const utils = {
    shuffle: (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    getRating: () => (Math.random() * 2 + 7).toFixed(1),

    createElement: (tag, className, innerHTML) => {
        const element = document.createElement(tag);
        element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
};

// ===== GÉNEROS =====
const genres = [
    "Acción", "Animación", "Anime", "Aventura", "Bélica", "Ciencia Ficción",
    "Comedia", "Crimen", "Documental", "Drama", "Familia", "Fantasía",
    "Historia", "Infantil", "Misterio", "Música", "Romance", "Suspenso", "Terror"
];

// ===== FUNCIONES PRINCIPALES =====
async function loadXuperflixContent(type = 'movies') {
    state.isLoading = true;
    elements.loading.style.display = 'flex';
    elements.content.innerHTML = '';

    try {
        const endpoint = type === 'movies' ? XUPERFLIX.apiEndpoints.movies : XUPERFLIX.apiEndpoints.series;
        const response = await fetch(`${endpoint}&limit=500&random`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            if (type === 'movies') {
                state.movies = data.data;
            } else {
                state.series = data.data;
            }
            displayContent(type);
        }
    } catch (error) {
        console.error(`Error loading ${type}:`, error);
    } finally {
        state.isLoading = false;
        elements.loading.style.display = 'none';
        elements.container.style.display = 'flex';
    }
}

function displayContent(type) {
    const content = type === 'movies' ? state.movies : state.series;
    
    // Hero destacado
    const featured = content[Math.floor(Math.random() * content.length)];
    displayFeatured(featured, type);

    // Contenido por género
    genres.forEach(genre => {
        const items = content.filter(item => item.generos && item.generos.includes(genre));
        if (items.length > 0) {
            createGenreSection(genre, items, type);
        }
    });
}

function displayFeatured(content, type) {
    elements.hero.innerHTML = `
        <div class="xuper-hero">
            <img class="xuper-backdrop" src="${content.miniature || content.post}" alt="${content.titulo}">
            <div class="xuper-overlay"></div>
            <div class="xuper-hero-content">
                <h1>${content.titulo}</h1>
                <div class="xuper-meta">
                    <span>📅 ${content.año}</span>
                    <span>⭐ ${utils.getRating()}</span>
                    <span>🏷️ ${type === 'movies' ? 'Película' : 'Serie'}</span>
                </div>
                <button class="xuper-btn" onclick="openXuperPlayer('${type}', '${content.titulo}')">
                    ▶️ Ver ahora
                </button>
            </div>
        </div>
    `;
}

function createGenreSection(genre, items, type) {
    const section = utils.createElement('div', 'xuper-section');
    
    section.innerHTML = `
        <div class="xuper-section-header">
            <h2><i class="fas fa-play"></i> ${genre}</h2>
        </div>
        <div class="xuper-grid">
            ${items.slice(0, 20).map(item => `
                <div class="xuper-card" onclick="openXuperPlayer('${type}', '${item.titulo}')">
                    <img src="${item.post}" alt="${item.titulo}" loading="lazy">
                    <div class="xuper-info">
                        <h3>${item.titulo}</h3>
                        <div class="xuper-meta">
                            <span>${item.año}</span>
                            <span>⭐ ${utils.getRating()}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    elements.content.appendChild(section);
}

// ===== FUNCIONES BÚSQUEDA =====
async function searchXuperflix(query) {
    if (!query.trim()) {
        loadXuperflixContent(state.currentType);
        return;
    }

    elements.loading.style.display = 'flex';
    elements.content.innerHTML = '';

    try {
        // Búsqueda en películas
        const moviesResponse = await fetch(`${XUPERFLIX.apiEndpoints.movies}&search=titulo=${encodeURIComponent(query)}`);
        const moviesData = await moviesResponse.json();
        
        // Búsqueda en series
        const seriesResponse = await fetch(`${XUPERFLIX.apiEndpoints.series}&search=titulo=${encodeURIComponent(query)}`);
        const seriesData = await seriesResponse.json();

        const results = [
            ...(moviesData.success ? moviesData.data : []),
            ...(seriesData.success ? seriesData.data : [])
        ];

        if (results.length > 0) {
            createGenreSection(`Resultados para "${query}"`, results, 'search');
        } else {
            elements.content.innerHTML = `
                <div class="xuper-no-results">
                    <h2>🔍 No se encontró "${query}"</h2>
                    <p>Prueba con otro título</p>
                </div>
            `;
        }
    } catch (error) {
        elements.content.innerHTML = '<p>Error en la búsqueda</p>';
    } finally {
        elements.loading.style.display = 'none';
    }
}

// ===== EVENT LISTENERS =====
elements.searchBtn.addEventListener('click', () => {
    searchXuperflix(elements.searchInput.value);
});

elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchXuperflix(elements.searchInput.value);
    }
});

elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const type = tab.dataset.content;
        state.currentType = type;
        loadXuperflixContent(type);
    });
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log(`🎬 ${XUPERFLIX.name} está cargando...`);
    loadXuperflixContent('movies');
    
    // Agregar estilos dinámicos
    const style = document.createElement('style');
    style.textContent = `
        .xuper-hero { position: relative; height: 400px; overflow: hidden; border-radius: 15px; margin-bottom: 2rem; }
        .xuper-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%); }
        .xuper-hero-content { position: absolute; bottom: 2rem; left: 2rem; color: white; }
        .xuper-btn { background: #ff0000; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: bold; transition: all 0.3s; }
        .xuper-btn:hover { background: #cc0000; transform: translateY(-2px); }
        .xuper-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
        .xuper-section { margin-bottom: 2rem; }
        .xuper-section-header h2 { font-size: 1.5rem; margin-bottom: 1rem; color: #ff0000; }
        .xuper-no-results { text-align: center; padding: 3rem; color: white; }
    `;
    document.head.appendChild(style);
});

// ===== FUNCIONES GLOBALES =====
window.openXuperPlayer = (type, title) => {
    alert(`🎬 Reproduciendo ${title} en ${XUPERFLIX.name}`);
};
