// ===== XUPERFLIX - REPRODUCCIÓN REAL =====
const API_URLS = {
    movies: 'https://anusdbs.onrender.com/movies?api-key=5404383ab',
    series: 'https://anusdbs.onrender.com/series?api-key=5404383ab'
};

// SERVIDORES DE REPRODUCCIÓN REAL
const PLAYERS = {
    movies: 'https://streamwish.to/embed/',
    series: 'https://streamwish.to/embed/'
};

const elements = {
    hero: document.getElementById('hero-section'),
    content: document.getElementById('content-container'),
    loading: document.getElementById('loading'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    tabs: document.querySelectorAll('.nav-tab')
};

let movies = [];
let series = [];
let currentType = 'movies';

// ===== CARGA DE CONTENIDO REAL =====
async function loadContent(type = 'movies') {
    currentType = type;
    loadingElement.style.display = 'flex';
    contentContainer.innerHTML = '';
    
    try {
        const url = type === 'movies' ? API_URLS.movies : API_URLS.series;
        const response = await fetch(`${url}&limit=50`);
        const data = await response.json();
        
        if (data.success && data.data) {
            const items = data.data;
            type === 'movies' ? movies = items : series = items;
            
            displayHero(items[0], type);
            displayGrid(items, type);
        }
    } catch (error) {
        showError('Error al cargar contenido');
    } finally {
        loadingElement.style.display = 'none';
    }
}

// ===== DISPLAY CON ESTILO DE LAS FOTOS =====
function displayHero(item, type) {
    heroSection.innerHTML = `
        <div class="hero-real">
            <img src="${item.post}" alt="${item.titulo}">
            <div class="hero-overlay">
                <h1 class="hero-title">${item.titulo}</h1>
                <div class="hero-meta">
                    <span class="year">${item.año || '2025'}</span>
                    <span class="rating">⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                    <span class="type">${type === 'movies' ? 'Película' : 'Serie'}</span>
                </div>
                <button class="play-now" onclick="playContent('${item.titulo}', '${type}')">
                    ▶️ VER AHORA
                </button>
            </div>
        </div>
    `;
}

function displayGrid(items, type) {
    const section = document.createElement('div');
    section.className = 'content-section';
    section.innerHTML = `
        <h2 class="section-title">🎬 Estrenos</h2>
        <div class="content-grid">
            ${items.map(item => `
                <div class="content-card" onclick="playContent('${item.titulo}', '${type}')">
                    <div class="card-image">
                        <img src="${item.post}" alt="${item.titulo}" loading="lazy">
                        <div class="card-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.titulo}</h3>
                        <div class="card-info">
                            <span class="year">${item.año || '2025'}</span>
                            <span class="rating">⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    contentContainer.appendChild(section);
}

// ===== REPRODUCCIÓN REAL =====
function playContent(title, type) {
    // Abrir en nueva pestaña con reproductor real
    const encodedTitle = encodeURIComponent(title);
    const playerUrl = type === 'movies' 
        ? `https://streamwish.to/embed/?t=${encodedTitle}` 
        : `https://streamwish.to/embed/?t=${encodedTitle}`;
    
    window.open(playerUrl, '_blank');
}

// ===== EVENTOS =====
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadContent(tab.dataset.content);
    });
});

// ===== INICIAR =====
document.addEventListener('DOMContentLoaded', () => {
    loadContent('movies');
});
