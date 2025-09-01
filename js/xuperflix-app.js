console.log('🎬 XUPERFLIX - Leyendo texto de API...');

const API_URLS = {
    movies: 'https://anusdbs.onrender.com/movies?api-key=5404383ab',
    series: 'https://anusdbs.onrender.com/series?api-key=5404383ab'
};

const elements = {
    hero: document.getElementById('hero-section'),
    content: document.getElementById('content-container'),
    loading: document.getElementById('loading'),
    tabs: document.querySelectorAll('.nav-tab')
};

// ===== FUNCIÓN PARA TEXTO =====
async function loadTextContent(type = 'movies') {
    loadingElement.style.display = 'flex';
    contentContainer.innerHTML = '';
    
    try {
        console.log(`📡 Cargando ${type} como texto...`);
        
        const response = await fetch(`${API_URLS[type]}&limit=30`);
        const text = await response.text();
        
        console.log('📄 Texto recibido:', text.substring(0, 200) + '...');
        
        // Parsear texto a JSON
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            // Si es texto plano, crear estructura
            const lines = text.split('\n').filter(l => l.trim());
            data = {
                success: true,
                data: lines.map(line => ({
                    titulo: line.split(' - ')[0] || line,
                    año: '2025',
                    post: `https://via.placeholder.com/200x300/ff0000/ffffff?text=${encodeURIComponent(line)}`
                }))
            };
        }
        
        if (data.data && data.data.length > 0) {
            displayRealContent(data.data, type);
        } else {
            createMockContent(type);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        createMockContent(type);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// ===== DISPLAY CON ESTILO =====
function displayRealContent(items, type) {
    // Hero
    const featured = items[0];
    heroSection.innerHTML = `
        <div class="hero-card">
            <img src="${featured.post || 'https://via.placeholder.com/800x400/ff0000/ffffff?text=XUPERFLIX'}" 
                 alt="${featured.titulo}">
            <div class="hero-info">
                <h1>${featured.titulo}</h1>
                <button class="play-btn" onclick="playReal('${featured.titulo}')">
                    ▶️ VER AHORA
                </button>
            </div>
        </div>
    `;
    
    // Grid
    const section = document.createElement('div');
    section.className = 'content-section';
    section.innerHTML = `
        <h2 class="section-title">🎬 ${type === 'movies' ? 'Películas' : 'Series'}</h2>
        <div class="content-grid">
            ${items.map(item => `
                <div class="movie-card" onclick="playReal('${item.titulo}')">
                    <div class="card-image">
                        <img src="${item.post || 'https://via.placeholder.com/200x300/ff0000/ffffff?text=' + encodeURIComponent(item.titulo)}" 
                             alt="${item.titulo}">
                        <div class="play-icon">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="card-details">
                        <h3>${item.titulo}</h3>
                        <div class="meta">
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

// ===== MOCK PARA PRUEBA =====
function createMockContent(type) {
    const mockData = type === 'movies' 
        ? [
            { titulo: 'LA CAÍDA DE DIDDY', año: '2025', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=DIDDY' },
            { titulo: 'TIERRA DE MAFIA', año: '2025', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=MAFIA' },
            { titulo: 'LOS CRÍMENES', año: '2025', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=CRIMENES' }
        ]
        : [
            { titulo: 'MobLand', año: '2025', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=MOBLAND' },
            { titulo: 'Dentro de las cárceles', año: '2016', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=CARCELES' },
            { titulo: 'Becoming', año: '2025', post: 'https://via.placeholder.com/200x300/ff0000/ffffff?text=BECOMING' }
        ];
    
    displayRealContent(mockData, type);
}

// ===== REPRODUCCIÓN REAL =====
function playReal(title) {
    // Abrir en reproductor real
    const playerUrl = `https://streamwish.to/embed/?t=${encodeURIComponent(title)}`;
    window.open(playerUrl, '_blank', 'width=800,height=600');
}

// ===== EVENTOS =====
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadTextContent(tab.dataset.content);
    });
});

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', () => {
    loadTextContent('movies');
    
    // Estilos finales
    const style = document.createElement('style');
    style.textContent = `
        .hero-card { position: relative; border-radius: 15px; overflow: hidden; margin-bottom: 2rem; }
        .hero-card img { width: 100%; height: 400px; object-fit: cover; }
        .hero-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.9)); color: white; }
        .play-btn { background: #ff0000; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: bold; }
        .content-section { margin: 2rem 0; }
        .section-title { color: #ff0000; margin-bottom: 1.5rem; font-size: 1.8rem; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .movie-card { background: #0f0f0f; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s; }
        .movie-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(255,0,0,0.3); }
        .card-image { position: relative; }
        .card-image img { width: 100%; height: 270px; object-fit: cover; }
        .play-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,0,0,0.8); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .movie-card:hover .play-icon { opacity: 1; }
        .card-details { padding: 1rem; }
        .card-title { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
        .meta { display: flex; justify-content: space-between; color: #aaa; font-size: 0.9rem; }
    `;
    document.head.appendChild(style);
});
