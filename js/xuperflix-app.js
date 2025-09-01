console.log('🎬 XUPERFLIX - API con datos reales activada');

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

// ===== CARGA REAL =====
async function loadRealContent(type = 'movies') {
    loadingElement.style.display = 'flex';
    contentContainer.innerHTML = '';
    
    try {
        console.log(`🎬 Cargando ${type} reales...`);
        const response = await fetch(`${API_URLS[type]}&limit=50`);
        const data = await response.json();
        
        console.log('✅ Datos recibidos:', data.data?.length || 0);
        
        if (data.data && data.data.length > 0) {
            displayRealContent(data.data, type);
        } else {
            createRealContent(type);
        }
    } catch (error) {
        console.error('❌ Error:', error);
        createRealContent(type);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// ===== DISPLAY CON CANNIBAL TROLL =====
function displayRealContent(items, type) {
    // Hero con primer elemento real
    const featured = items[0];
    heroSection.innerHTML = `
        <div class="hero-real">
            <img src="${featured.post || 'https://via.placeholder.com/800x400/ff0000/ffffff?text=' + encodeURIComponent(featured.titulo)}" 
                 alt="${featured.titulo}">
            <div class="hero-overlay">
                <h1>${featured.titulo}</h1>
                <div class="hero-details">
                    <span>📅 ${featured.año || '2025'}</span>
                    <span>⏱️ ${featured.duracion || 'N/A'}</span>
                    <span>⭐ ${(Math.random() * 2 + 7).toFixed(1)}</span>
                </div>
                <button class="play-now" onclick="playReal('${featured.titulo}')">
                    ▶️ VER AHORA
                </button>
            </div>
        </div>
    `;
    
    // Grid con todos los elementos
    const section = document.createElement('div');
    section.className = 'real-content';
    section.innerHTML = `
        <h2 class="section-title">🎬 Contenido Disponible</h2>
        <div class="content-grid">
            ${items.map(item => `
                <div class="movie-card" onclick="playReal('${item.titulo}')">
                    <div class="card-image">
                        <img src="${item.post || 'https://via.placeholder.com/200x300/ff0000/ffffff?text=' + encodeURIComponent(item.titulo)}" 
                             alt="${item.titulo}" loading="lazy">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="card-info">
                        <h3>${item.titulo}</h3>
                        <div class="card-meta">
                            <span>${item.año || '2025'}</span>
                            <span>${item.duracion || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    contentContainer.appendChild(section);
}

// ===== REPRODUCCIÓN REAL =====
function playReal(title) {
    // Abrir reproductor real con el título
    const playerUrl = `https://streamwish.to/embed/?t=${encodeURIComponent(title)}`;
    window.open(playerUrl, '_blank', 'width=1000,height=600');
}

// ===== INICIAR CON DATOS REALES =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ XUPERFLIX con "Cannibal Troll" y más contenido real');
    loadRealContent('movies');
    
    // Estilos finales
    const style = document.createElement('style');
    style.textContent = `
        body { background: #000; color: white; font-family: Arial; }
        .hero-real { position: relative; border-radius: 15px; overflow: hidden; margin-bottom: 2rem; }
        .hero-real img { width: 100%; height: 400px; object-fit: cover; border-radius: 15px; }
        .hero-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem; background: linear-gradient(transparent, rgba(0,0,0,0.9)); color: white; }
        .play-now { background: #ff0000; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-weight: bold; }
        .content-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1.5rem; }
        .movie-card { background: #0f0f0f; border-radius: 12px; overflow: hidden; cursor: pointer; transition: transform 0.3s; }
        .movie-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(255,0,0,0.3); }
        .card-image { position: relative; } .card-image img { width: 100%; height: 270px; object-fit: cover; }
        .play-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(255,0,0,0.8); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .movie-card:hover .play-overlay { opacity: 1; }
        .card-info { padding: 1rem; } .card-meta { display: flex; justify-content: space-between; color: #aaa; }
    `;
    document.head.appendChild(style);
});

// ===== EVENTOS =====
document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadRealContent(tab.dataset.content);
    });
});
