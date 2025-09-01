// Configuración de XUPERFLIX
const config = {
    tmdbApiKey: 'TU_API_KEY_AQUI', // Regístrate gratis en themoviedb.org
    language: 'es-ES',
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p/w500'
};

// Elementos del DOM
const contentContainer = document.getElementById('content-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const navTabs = document.querySelectorAll('.nav-tab');

// Estado actual
let currentTab = 'movies';
let currentPage = 1;

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadContent();
    setupEventListeners();
});

function setupEventListeners() {
    // Navegación
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentTab = tab.dataset.content;
            loadContent();
        });
    });

    // Búsqueda
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}

async function loadContent() {
    contentContainer.innerHTML = '<div class="loading">Cargando...</div>';
    
    try {
        let url;
        if (currentTab === 'movies') {
            url = `${config.baseUrl}/movie/popular?api_key=${config.tmdbApiKey}&language=${config.language}&page=${currentPage}`;
        } else if (currentTab === 'series') {
            url = `${config.baseUrl}/tv/popular?api_key=${config.tmdbApiKey}&language=${config.language}&page=${currentPage}`;
        } else {
            await loadAllContent();
            return;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        displayContent(data.results);
    } catch (error) {
        contentContainer.innerHTML = '<p>Error al cargar contenido</p>';
    }
}

function displayContent(items) {
    contentContainer.innerHTML = '';
    
    items.forEach(item => {
        const card = createCard(item);
        contentContainer.appendChild(card);
    });
}

function createCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const isMovie = item.title !== undefined;
    const title = isMovie ? item.title : item.name;
    const year = (isMovie ? item.release_date : item.first_air_date)?.split('-')[0] || '';
    
    card.innerHTML = `
        <img class="movie-poster" src="${config.imageBaseUrl}${item.poster_path}" 
             alt="${title}" onerror="this.src='https://via.placeholder.com/200x300/cc0000/ffffff?text=XUPERFLIX'">
        <div class="movie-info">
            <h3 class="movie-title">${title}</h3>
            <p>${year}</p>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showDetails(item, isMovie);
    });
    
    return card;
}

function showDetails(item, isMovie) {
    const title = isMovie ? item.title : item.name;
    const year = (isMovie ? item.release_date : item.first_air_date)?.split('-')[0] || '';
    
    alert(`📺 ${title} (${year})
    
🎬 Para ver esta película/serie, copia este código:
${isMovie ? 'movie' : 'tv'}/${item.id}
    
⚠️ Recuerda: Esto es solo una demo educativa`);
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        const url = `${config.baseUrl}/search/multi?api_key=${config.tmdbApiKey}&language=${config.language}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        displayContent(data.results.filter(item => item.media_type !== 'person'));
    } catch (error) {
        alert('Error en la búsqueda');
    }
}
