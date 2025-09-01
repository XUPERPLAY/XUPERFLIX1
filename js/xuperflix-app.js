// ===== CONFIGURACIÓN PERSONALIZADA XUPERFLIX =====
const XUPERFLIX = {
    name: 'XUPERFLIX',
    api: {
        base: 'https://anusdbs.onrender.com',
        key: '5404383ab',
        endpoints: {
            movies: 'https://anusdbs.onrender.com/movies?api-key=5404383ab',
            series: 'https://anusdbs.onrender.com/series?api-key=5404383ab'
        }
    }
};

// ===== ELEMENTOS DEL DOM =====
const elements = {
    hero: document.getElementById('hero-section'),
    content: document.getElementById('content-container'),
    loading: document.getElementById('loading'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    tabs: document.querySelectorAll('.nav-tab')
};

// ===== ESTADO =====
let state = {
    movies: [],
    series: [],
    currentType: 'movies'
};

// ===== FUNCIONES =====
async function loadContent(type = 'movies') {
    state.currentType = type;
    elements.loading.style.display = 'flex';
    elements.content.innerHTML = '';
    
    try {
        const url = type === 'movies' ? XUPERFLIX.api.endpoints.movies : XUPERFLIX.api.endpoints.series;
        const response = await fetch(`${url}&limit=50`);
        const data = await response.json();
        
        console.log('📡 API Response:', data);
        
        if (data.success && data.data) {
            if (type === 'movies') state.movies = data.data;
            else state.series = data.data;
            
            displayContent(type);
        } else {
            showError('No hay contenido disponible');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showError('Error al cargar contenido');
    } finally {
        elements.loading.style.display = 'none';
    }
}

function displayContent(type) {
    const content = type === 'movies' ? state.movies : state.series;
    
    // Hero destacado
    if (content.length > 0) {
        const featured = content[Math.floor(Math.random() * content.length)];
        displayFeatured(featured, type);
    }
    
    // Mostrar todo el contenido
    const section = document.createElement('div');
    section.className = 'xuper-section';
    section.innerHTML = `
        <div class="xuper-section-header">
            <h2><i class="fas fa-star"></i> Contenido Disponible</h2>
        </div>
        <div class="xuper-grid">
            ${content.map(item => createCard(item, type)).join('')}
        </div>
    `;
    
    elements.content.appendChild(section);
}

function displayFeatured(content, type) {
    elements.hero.innerHTML = `
        <div class="xuper-hero">
            <img class="xuper-backdrop" src="${content.post || content.miniature}" alt="${content.titulo}">
            <div class="xuper-overlay"></div>
            <div class="xuper-hero-content">
                <h1>${content.titulo}</h1>
                <div class="xuper-meta">
                    <span>📅 ${item.año || '2025'}</span>
                    <span>⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                    <span>🏷️ ${type === 'movies' ? 'Película' : 'Serie'}</span>
                </div>
                <button class="xuper-btn" onclick="playContent('${item.titulo}')">
                    ▶️ Ver ahora
                </button>
            </div>
        </div>
    `;
}

function createCard(item, type) {
    return `
        <div class="xuper-card" onclick="playContent('${item.titulo}')">
            <img src="${item.post}" alt="${item.titulo}" loading="lazy">
            <div class="xuper-info">
                <h3>${item.titulo}</h3>
                <div class="xuper-meta">
                    <span>${item.año || '2025'}</span>
                    <span>⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                </div>
            </div>
        </div>
    `;
}

function showError(message) {
    elements.content.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h2>❌ ${message}</h2>
            <p>Intenta refrescar la página</p>
        </div>
    `;
}

function playContent(title) {
    alert(`🎬 Reproduciendo "${title}" en ${XUPERFLIX.name}`);
}

// ===== EVENT LISTENERS =====
elements.searchBtn.addEventListener('click', () => {
    const query = elements.searchInput.value.trim();
    if (query) {
        alert(`🔍 Buscando: ${query}`);
    }
});

elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        elements.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadContent(tab.dataset.content);
    });
});

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 XUPERFLIX iniciando...');
    loadContent('movies');
});
