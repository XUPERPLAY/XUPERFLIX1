// ===== XUPERFLIX - CÓDIGO COMPLETO CON DATOS REALES =====
console.log('🎬 XUPERFLIX - Cargando datos reales...');

// URLs directas funcionales
const API_URLS = {
    movies: 'https://anusdbs.onrender.com/movies?api-key=5404383ab',
    series: 'https://anusdbs.onrender.com/series?api-key=5404383ab'
};

// Elementos
const heroSection = document.getElementById('hero-section');
const contentContainer = document.getElementById('content-container');
const loadingElement = document.getElementById('loading');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const tabs = document.querySelectorAll('.nav-tab');

// Estado
let movies = [];
let series = [];
let currentType = 'movies';

// ===== FUNCIÓN PRINCIPAL DE CARGA =====
async function loadRealContent(type = 'movies') {
    currentType = type;
    loadingElement.style.display = 'flex';
    contentContainer.innerHTML = '';
    
    try {
        console.log(`📡 Cargando ${type}...`);
        
        const url = type === 'movies' ? API_URLS.movies : API_URLS.series;
        const response = await fetch(`${url}&limit=30`);
        const data = await response.json();
        
        console.log('✅ Datos recibidos:', data.data?.length || 0, 'items');
        
        if (data.success && data.data && data.data.length > 0) {
            const items = data.data;
            
            // Guardar datos
            if (type === 'movies') movies = items;
            else series = items;
            
            // Mostrar hero con primer item
            displayHero(items[0], type);
            
            // Mostrar grid de contenido
            displayGrid(items, type);
            
        } else {
            showMessage('📦 Sin contenido disponible');
        }
    } catch (error) {
        console.error('❌ Error:', error);
        showMessage(`Error: ${error.message}`);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// ===== DISPLAY HERO =====
function displayHero(item, type) {
    heroSection.innerHTML = `
        <div class="hero-real">
            <img src="${item.post}" alt="${item.titulo}" style="width:100%; height:400px; object-fit:cover; border-radius:15px;">
            <div class="hero-overlay">
                <h1>${item.titulo}</h1>
                <div class="hero-details">
                    <span>📅 ${item.año || '2025'}</span>
                    <span>⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                    <span>📽️ ${type === 'movies' ? 'Película' : 'Serie'}</span>
                </div>
                <button class="play-btn" onclick="playContent('${item.titulo}')">
                    ▶️ VER AHORA
                </button>
            </div>
        </div>
    `;
}

// ===== DISPLAY GRID =====
function displayGrid(items, type) {
    const section = document.createElement('div');
    section.className = 'real-content';
    section.innerHTML = `
        <h2 class="section-title">
            <i class="fas fa-fire"></i> ${type === 'movies' ? 'Películas' : 'Series'} Disponibles
        </h2>
        <div class="real-grid">
            ${items.map(item => `
                <div class="real-card" onclick="playContent('${item.titulo}')">
                    <div class="card-image">
                        <img src="${item.post}" alt="${item.titulo}" loading="lazy">
                    </div>
                    <div class="card-info">
                        <h3>${item.titulo}</h3>
                        <div class="card-meta">
                            <span>${item.año || '2025'}</span>
                            <span>⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    contentContainer.appendChild(section);
}

// ===== MENSAJES =====
function showMessage(text) {
    contentContainer.innerHTML = `
        <div class="message-box">
            <h2>${text}</h2>
            <button onclick="location.reload()" style="background:#ff0000; color:white; border:none; padding:1rem 2rem; border-radius:25px; cursor:pointer;">
                🔄 RECARGAR
            </button>
        </div>
    `;
}

function playContent(title) {
    alert(`🎬 Reproduciendo: ${title}\n\n📺 Esto es una versión demo educativa`);
}

// ===== EVENTOS =====
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadRealContent(tab.dataset.content);
    });
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) alert(`🔍 Buscando: ${query} (demo)`);
});

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 XUPERFLIX - Listo para mostrar contenido real');
    loadRealContent('movies');
});

// ===== ESTILOS DINÁMICOS =====
const style = document.createElement('style');
style.textContent = `
    .hero-real { position: relative; border-radius: 15px; overflow: hidden; margin-bottom: 2rem; }
    .hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; }
    .hero-details { display: flex; gap: 1rem; margin: 1rem 0; }
    .play-btn { background: #ff0000; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: bold; }
    .real-content { margin: 2rem 0; }
    .section-title { color: #ff0000; margin-bottom: 1rem; font-size: 1.5rem; }
    .real-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }
    .real-card { background: #121212; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.3s; }
    .real-card:hover { transform: translateY(-5px); }
    .card-image img { width: 100%; height: 280px; object-fit: cover; }
    .card-info { padding: 1rem; }
    .card-meta { display: flex; justify-content: space-between; color: #ccc; }
    .message-box { text-align: center; padding: 3rem; color: white; }
`;
document.head.appendChild(style);
