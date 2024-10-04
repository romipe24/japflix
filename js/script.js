let movieData = [];

// Cargar los datos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  fetch('https://japceibal.github.io/japflix_api/movies-data.json')
    .then(response => response.json())
    .then(data => {
      console.log("Datos cargados correctamente:", data); // Verificar si se cargan los datos
      movieData = data;
      // Mostrar las películas al cargar la página
      mostrarPeliculas(movieData);
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });
});

///////////////////////////////////////////////////////////////////////////////////////
// Función para buscar películas al presionar el botón buscar
document.getElementById('btnBuscar').addEventListener('click', () => {
  const searchText = document.getElementById('inputBuscar').value.toLowerCase();

  if (searchText.trim() !== '') {
    // Filtrar las películas por title, genres, tagline u overview
    const filteredMovies = movieData.filter(movie =>
      movie.title.toLowerCase().includes(searchText) ||
      movie.genres.some(genre => genre.name.toLowerCase().includes(searchText)) ||
      (movie.tagline && movie.tagline.toLowerCase().includes(searchText)) ||
      (movie.overview && movie.overview.toLowerCase().includes(searchText))
    );

    // Mostrar las películas filtradas
    mostrarPeliculas(filteredMovies);
  } else {
    // Si el campo está vacío, mostrar todas las películas
    mostrarPeliculas(movieData);
  }
});

//////////////////////////////////////////////////////////////////////////////////////////////
// Función para mostrar las películas en el contenedor
function mostrarPeliculas(movies) {
    const lista = document.getElementById('lista');
    lista.innerHTML = ''; // Limpiar lista previa
  
    if (movies.length === 0) {
      lista.innerHTML = '<li class="list-group-item bg-dark text-light">No se encontraron resultados</li>';
      return;
    }
  
    // Crear elementos para cada película
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.className = 'list-group-item bg-dark text-light mb-2';
      li.innerHTML = `
        <h5>${movie.title}</h5>
        <p>${movie.tagline || ''}</p>
        <div>${mostrarEstrellas(movie.vote_average)}</div>
      `;
  
      // Agregar el evento para mostrar la información en el offcanvas
      li.addEventListener('click', () => {
        // Llenar los campos del offcanvas con la información de la película seleccionada
        document.getElementById('offcanvasTopLabel').innerText = movie.title;
        document.getElementById('movieOverview').innerText = movie.overview;
  
        // Crear una lista de géneros y mostrarla
        const genres = movie.genres.map(genre => genre.name).join(' - ');
        document.getElementById('movieGenres').innerText = genres;
  
        // Llenar el desplegable con la información adicional
        const additionalInfo = document.getElementById('additionalInfo');
        additionalInfo.innerHTML = `
          <li><span class="dropdown-item">Year: ${new Date(movie.release_date).getFullYear()}</span></li>
          <li><span class="dropdown-item">Runtime: ${movie.runtime} mins</span></li>
          <li><span class="dropdown-item">Budget: $${movie.budget.toLocaleString()}</span></li>
          <li><span class="dropdown-item">Revenue: $${movie.revenue.toLocaleString()}</span></li>
        `;
  
        // Mostrar el offcanvas usando Bootstrap
        const offcanvasElement = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
        offcanvasElement.show();
      });
  
      lista.appendChild(li);
    });
  }
  
  
///////////////////////////////////////////////////////////////////////////////////////////////
// Función para mostrar las estrellas según el `vote_average`
function mostrarEstrellas(vote) {
    const rating = Math.round(vote / 2); // Convertir el voto promedio a una escala de 1 a 5
    let estrellas = '';
  
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        estrellas += '<span class="fa fa-star checked"></span>'; // Estrella llena
      } else {
        estrellas += '<span class="fa fa-star"></span>'; // Estrella vacía
      }
    }
    return estrellas;
  }
