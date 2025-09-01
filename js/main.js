document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM
    const heroSection = document.getElementById("hero-section")
    const contentContainer = document.getElementById("content-container")
    const loadingElement = document.getElementById("loading")
    const searchInput = document.getElementById("search-input")
    const searchBtn = document.getElementById("search-btn")
    const movieModal = document.getElementById("movie-modal")
    const modalClose = document.getElementById("modal-close")
    const navTabs = document.querySelectorAll(".nav-tab")
    const tabs = document.getElementById("tabs")
    const playerContainer = document.getElementById("player-container")
    const playerIframe = document.getElementById("player-iframe")
    const playerClose = document.getElementById("player-close")
    const playerTitle = document.getElementById("player-title")
    const feedbackBtn = document.getElementById("feedback-btn")

    // Encriptación de las URLs de la API en base64
    const apiUrlMoviesBase64 = "aHR0cHM6Ly9hbnVzZGJzLm9ucmVuZGVyLmNvbS9tb3ZpZXM/YXBpLWtleT01NDA0MzgzYWI="
    const apiUrlSeriesBase64 = "aHR0cHM6Ly9hbnVzZGJzLm9ucmVuZGVyLmNvbS9zZXJpZXMvP2FwaS1rZXk9NTQwNDM4M2Fi"

    // Función para decodificar las URLs de la API
    function getApiUrl(type) {
        return type === "movies" ? atob(apiUrlMoviesBase64): atob(apiUrlSeriesBase64)
    }

    // Lista de géneros disponibles
    const allGenres = [
        "Accion",
        "Animacion",
        "Anime",
        "Aventura",
        "Belica",
        "Ciencia Ficcion",
        "Comedia",
        "Crimen",
        "Documental",
        "Drama",
        "Familia",
        "Fantasia",
        "Historia",
        "Infantil",
        "Misterio",
        "Musica",
        "News",
        "Película de TV",
        "Politica",
        "Reality",
        "Romance",
        "Suspenso",
        "Talk",
        "Telenovela",
        "Terror",
        "Western",
    ]

    // Variables para el estado de la aplicación
    let isLoading = false
    let allMovies = []
    let allSeries = []
    let featuredContent = null
    let searchResultsMovies = []
    let searchResultsSeries = []
    let isSearchActive = false
    let currentContentType = "movies" // 'movies', 'series' o 'all'
    heroSection.style.display = "none"
    contentContainer.style.display = "none"
    tabs.style.display = "none"

    // Función para cargar contenido según el tipo
    async function loadContent(type) {
        currentContentType = type
        isLoading = true
        isSearchActive = false // Resetear estado de búsqueda

        // Ocultar todo excepto el loading al inicio
        /* heroSection.style.display = "flex"
    contentContainer.style.display = "flex"
    tabs.style.display = "flex" */
        loadingElement.style.display = "flex"
        contentContainer.innerHTML = ""

        try {
            // Si es la primera vez que cargamos películas o series, hacemos la petición
            if (type === "movies" && allMovies.length === 0) {
                const apiUrl = getApiUrl("movies")
                const response = await fetch(`${apiUrl}&limit=1000&random`)
                const data = await response.json()
                if (data.success && data.data.length > 0) {
                    allMovies = data.data
                }
            }

            if ((type === "series" || type === "all") && allSeries.length === 0) {
                const apiUrl = getApiUrl("series")
                const response = await fetch(`${apiUrl}&limit=1000&random`)
                const data = await response.json()
                if (data.success && data.data.length > 0) {
                    allSeries = data.data
                }
            }

            // Seleccionar contenido destacado
            if (type === "movies" && allMovies.length > 0) {
                featuredContent = allMovies[Math.floor(Math.random() * allMovies.length)]
                updateHeroSection(featuredContent, "movies")
            } else if (type === "series" && allSeries.length > 0) {
                featuredContent = allSeries[Math.floor(Math.random() * allSeries.length)]
                updateHeroSection(featuredContent, "series")
            } else if (type === "all") {
                // Para "Todo", elegimos aleatoriamente entre películas y series mezcladas
                const allContent = [...allMovies,
                    ...allSeries];
                shuffleArray(allContent);
                if (allContent.length > 0) {
                    featuredContent = allContent[0]; // Ahora ya está mezclado
                    const contentType = allMovies.includes(featuredContent) ? "movies": "series";
                    updateHeroSection(featuredContent, contentType);
                }
            }

            // Organizar contenido por género según el tipo
            if (type === "movies") {
                organizeContentByGenre("movies")
            } else if (type === "series") {
                organizeContentByGenre("series")
            } else if (type === "all") {
                // Para "Todo", mostramos tanto películas como series
                organizeAllContentByGenre()
            }
        } catch (error) {
            console.error(`Error al cargar contenido:`, error)
            contentContainer.innerHTML = `<p>Error al cargar el contenido. Por favor, intenta de nuevo más tarde.</p>`
        } finally {
            isLoading = false
            loadingElement.style.display = "none"
            // Mostrar los elementos después de cargar
            tabs.style.display = "flex"
            heroSection.style.display = "block"
            contentContainer.style.display = "block"
            // Hacer scroll suave hasta arriba
            scrollToTop()
        }
    }

    // Función para organizar todo el contenido (películas y series) por género
    function organizeAllContentByGenre() {
        // Primero mostramos los estrenos recientes (películas y series)
        const recentMovies = allMovies.filter((item) => item.año === "2025" || item.año === "2026");
        const recentSeries = allSeries.filter((item) => item.año === "2025" || item.año === "2026");

        if (recentMovies.length > 0 || recentSeries.length > 0) {
            const recentContent = [...recentMovies,
                ...recentSeries];
            // Mezclar los estrenos
            shuffleArray(recentContent);
            createGenreSection("Estrenos", recentContent, "fas fa-fire", "mixed");
        }

        // Luego agrupamos por género
        allGenres.forEach((genre) => {
            const moviesInGenre = allMovies.filter((item) => item.generos && item.generos.includes(genre));
            const seriesInGenre = allSeries.filter((item) => item.generos && item.generos.includes(genre));

            // Si hay contenido en este género, lo mostramos
            if (moviesInGenre.length > 0 || seriesInGenre.length > 0) {
                const contentInGenre = [...moviesInGenre,
                    ...seriesInGenre];
                // Mezclar el contenido dentro del género
                shuffleArray(contentInGenre);

                // Asignar iconos según el género
                let icon = "fas fa-film";
                if (genre === "Accion") icon = "fas fa-running";
                else if (genre === "Comedia") icon = "fas fa-laugh";
                else if (genre === "Terror") icon = "fas fa-ghost";
                else if (genre === "Ciencia Ficcion") icon = "fas fa-robot";
                else if (genre === "Romance") icon = "fas fa-heart";
                else if (genre === "Animacion" || genre === "Anime") icon = "fas fa-child";

                createGenreSection(genre, contentInGenre, icon, "mixed");
            }
        });
    }

    // Función para mezclar un array (algoritmo Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i],
                array[j]] = [array[j],
                array[i]];
        }
        return array;
    }

    // Función para actualizar la sección hero
    function updateHeroSection(content, type) {
        if (!content) return

        heroSection.innerHTML = `
        <img class="hero-backdrop" src="${content.miniature || content.post}" alt="${content.titulo}">
        <div class="hero-overlay"></div>
        <div class="hero-content fadeInUp">
        <h1 class="hero-title">${content.titulo}</h1>
        <div class="hero-meta">
        <span><i class="far fa-calendar-alt"></i> ${content.año}</span>
        ${content.duracion ? `<span><i class="far fa-clock"></i> ${content.duracion}</span>`: ""}
        <span><i class="fas fa-star"></i> ${(Math.random() * 2 + 7).toFixed(1)}</span>
        <span><i class="fas fa-tag"></i> ${type === "movies" ? "Película": "Serie"}</span>
        </div>
        <!-- <p class="hero-description">${content.descripcion || "Sin descripción disponible."}</p> -->
        <div class="hero-buttons">
        <button class="btn btn-red" onclick="openContentModal('${type}', ${type === "movies" ? allMovies.indexOf(content): allSeries.indexOf(content)})">
        <i class="fas fa-play"></i> Ver ahora
        </button>
        <!-- <button class="btn btn-secondary" onclick="openContentModal('${type}', ${type === "movies" ? allMovies.indexOf(content): allSeries.indexOf(content)})">
        <i class="fas fa-info-circle"></i> Más información
        </button> -->
        </div>
        </div>
        `
    }

    // Función para organizar contenido por género
    function organizeContentByGenre(type) {
        // Primero agrupamos el contenido por género
        const contentByGenre = {}
        const contentArray = type === "movies" ? allMovies: allSeries

        allGenres.forEach((genre) => {
            contentByGenre[genre] = contentArray.filter((item) => item.generos && item.generos.includes(genre))
        })

        // Ahora mostramos cada género que tenga contenido
        displayGenresWithContent(contentByGenre, type)
    }

    // Función para mostrar géneros con su contenido
    function displayGenresWithContent(contentByGenre, type) {
        contentContainer.innerHTML = ""

        // Mostrar primero el contenido más reciente
        const contentArray = type === "movies" ? allMovies: type === "series" ? allSeries: [...allMovies,
            ...allSeries]
        const recentContent = contentArray.filter((item) => item.año === "2025" || item.año === "2026")
        if (recentContent.length > 0) {
            createGenreSection("Estrenos", recentContent, "fas fa-fire", type)
        }

        // Luego mostrar los géneros
        for (const [genre, content] of Object.entries(contentByGenre)) {
            if (content.length > 0) {
                let icon = "fas fa-film"

                // Asignar iconos según el género
                if (genre === "Accion") icon = "fas fa-running"
                else if (genre === "Comedia") icon = "fas fa-laugh"
                else if (genre === "Terror") icon = "fas fa-ghost"
                else if (genre === "Ciencia Ficcion") icon = "fas fa-robot"
                else if (genre === "Romance") icon = "fas fa-heart"
                else if (genre === "Animacion" || genre === "Anime") icon = "fas fa-child"

                createGenreSection(genre, content, icon, type)
            }
        }
    }

    // Función para crear una sección de género con su contenido
    function createGenreSection(genreTitle, content, icon = "fas fa-film", type) {
        const section = document.createElement("div")
        section.className = "genre-section fadeInUp"

        const sectionHeader = document.createElement("div")
        sectionHeader.className = "section-header"

        const title = document.createElement("h2")
        title.className = "section-title"
        title.innerHTML = `<i class="${icon}"></i> ${genreTitle}`

        const carouselNav = document.createElement("div")
        carouselNav.className = "carousel-nav"

        const prevBtn = document.createElement("button")
        prevBtn.className = "carousel-btn"
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'

        const nextBtn = document.createElement("button")
        nextBtn.className = "carousel-btn"
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'

        const seeAll = document.createElement("a")
        seeAll.className = "see-all"
        seeAll.href = "#"
        /* seeAll.innerHTML = 'Ver todo <i class="fas fa-arrow-right"></i>'; */

        carouselNav.appendChild(prevBtn)
        carouselNav.appendChild(nextBtn)
        carouselNav.appendChild(seeAll)

        sectionHeader.appendChild(title)
        sectionHeader.appendChild(carouselNav)

        const row = document.createElement("div")
        row.className = "movies-row"

        // Mostrar hasta 20 items por género
        content.slice(0, 100).forEach((item, index) => {
            const card = document.createElement("div")
            card.className = "movie-card"

            // Generar una calificación aleatoria entre 7 y 9
            const rating = (Math.random() * 2 + 7).toFixed(1)

            // Determinar si es película o serie
            const contentType = type === "mixed" ? (allMovies.includes(item) ? "movies": "series"): type

            card.innerHTML = `
            <div class="movie-poster-container">
            <img class="movie-poster" src="${item.post}" alt="${item.titulo}" loading="lazy">
            <div class="movie-overlay">
            <button class="movie-play-btn">
            <i class="fas fa-play"></i>
            </button>
            </div>
            <div class="movie-type">${contentType === "movies" ? "Movie": "Serie"}</div>
            </div>
            <div class="movie-info">
            <h3 class="movie-title">${item.titulo}</h3>
            <div class="movie-meta">
            <div class="movie-rating">
            <i class="fas fa-star"></i>
            <span>${rating}</span>
            </div>
            <div class="movie-year">
            <i class="far fa-calendar-alt"></i>
            <span>${item.año}</span>
            </div>
            </div>
            </div>
            `

            card.addEventListener("click", () => {
                let contentArray, realIndex

                if (isSearchActive) {
                    contentArray = contentType === "movies" ? searchResultsMovies: searchResultsSeries
                } else {
                    contentArray = contentType === "movies" ? allMovies: allSeries
                }

                realIndex = contentArray.findIndex((c) => c.titulo === item.titulo && c.año === item.año)
                openContentModal(contentType, realIndex)
            })

            row.appendChild(card)
        })

        // Configurar navegación del carrusel
        prevBtn.addEventListener("click", () => {
            row.scrollBy({
                left: -600,
                behavior: "smooth",
            })
        })

        nextBtn.addEventListener("click", () => {
            row.scrollBy({
                left: 600,
                behavior: "smooth",
            })
        })

        section.appendChild(sectionHeader)
        section.appendChild(row)
        contentContainer.appendChild(section)
    }

    // Función para hacer scroll suave hasta arriba
    function scrollToTop() {
        // Verificar si el navegador soporta 'behavior: smooth'
        if ("scrollBehavior" in document.documentElement.style) {
            // Método moderno (Chrome, Firefox, Edge, Safari)
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        } else {
            // Fallback para navegadores antiguos (IE, Safari antiguo)
            const scrollDuration = 500 // Duración en milisegundos
            const scrollStep = -window.scrollY / (scrollDuration / 15)

            const scrollInterval = setInterval(() => {
                if (window.scrollY !== 0) {
                    window.scrollBy(0, scrollStep)
                } else {
                    clearInterval(scrollInterval)
                }
            },
                15)
        }
    }

    // Función para buscar contenido
    async function searchContent(query) {
        isLoading = true
        isSearchActive = true // Activar modo búsqueda
        loadingElement.style.display = "flex"
        contentContainer.innerHTML = ""
        heroSection.style.display = "none"
        tabs.style.display = "none"

        try {
            // Buscar en películas
            const apiUrlMovies = getApiUrl("movies")
            const responseMovies = await fetch(`${apiUrlMovies}&search=titulo=${encodeURIComponent(query)}`)
            const dataMovies = await responseMovies.json()

            // Buscar en series
            const apiUrlSeries = getApiUrl("series")
            const responseSeries = await fetch(`${apiUrlSeries}&search=titulo=${encodeURIComponent(query)}`)
            const dataSeries = await responseSeries.json()

            const hasMovies = dataMovies.success && dataMovies.data.length > 0
            const hasSeries = dataSeries.success && dataSeries.data.length > 0

            if (hasMovies || hasSeries) {
                if (hasMovies) {
                    searchResultsMovies = dataMovies.data
                    createGenreSection(`Películas para: "${query}"`, dataMovies.data, "fas fa-film", "movies")
                }

                if (hasSeries) {
                    searchResultsSeries = dataSeries.data
                    createGenreSection(`Series para: "${query}"`, dataSeries.data, "fas fa-tv", "series")
                }

                // Agrega esto justo después de crear las secciones de resultados (dentro del if (hasMovies || hasSeries))
                const backButton = document.createElement("div")
                backButton.innerHTML = `
                <div style="text-align: center; margin: 30px 0;">
                <button class="btn btn-primary" onclick="volverAlInicio()"
                style="padding: 10px 20px; font-size: 1rem; border-radius: 0.5rem;">
                <i class="fas fa-home"></i> Volver al inicio
                </button>
                </div>
                `
                contentContainer.appendChild(backButton)
            } else {
                contentContainer.innerHTML = `
                <div class="fadeInUp" style="text-align: center; padding: 3rem 1rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem;"></i>
                <h2>No se encontraron resultados para "${query}"</h2>
                <p style="color: var(--text-secondary); margin: 1rem 0;">Intenta con otro término de búsqueda o explora nuestras categorías.</p>
                <button class="btn btn-primary" onclick="volverAlInicio()"
                style="padding: 10px 20px; font-size: 1rem; border-radius: 0.5rem;">
                <i class="fas fa-home"></i> Volver al inicio
                </button>
                </div>
                `
            }
        } catch (error) {
            console.error("Error al buscar contenido:", error)
            contentContainer.innerHTML = "<p>Error al buscar el contenido</p>"
        } finally {
            isLoading = false
            loadingElement.style.display = "none"
            tabs.style.display = "none"
        }
    }

    // Función para volver al inicio
    window.volverAlInicio = () => {
        loadContent(currentContentType) // Recarga el contenido principal
        tabs.style.display = "flex" // Muestra las tabs
        heroSection.style.display = "block" // Muestra el hero
        searchInput.value = "" // Limpia el campo de búsqueda
        isSearchActive = false
    }

    // Función para abrir el modal con los detalles del c
