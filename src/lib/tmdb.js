const API_KEY = '0a233d84fc55a74ae5753ab6a5e22375';
const BASE_URL = 'https://api.themoviedb.org/3';

// Obtiene todos los géneros
const getGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener los géneros');
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    return [];
  }
};

// Asocia géneros a las películas
const associateGenresToMovies = async (movies) => {
  try {
    const genres = await getGenres();
    return movies.map(movie => ({
      ...movie,
      genres: movie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(genre => genre !== undefined)
    }));
  } catch (error) {
    console.error('Error associating genres to movies:', error);
    return movies;
  }
};

// Películas Populares
export const getPopularMovies = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas populares');
    }
    const data = await response.json();
    const movies = await associateGenresToMovies(data.results);
    return { movies, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { movies: [], totalPages: 1 };
  }
};

// Películas de Tendencia de la Semana
export const getTrendingMoviesWeek = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas de tendencia');
    }
    const data = await response.json();
    const movies = await associateGenresToMovies(data.results);
    return { movies, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { movies: [], totalPages: 1 };
  }
};

// Películas de Tendencia del Día
export const getTrendingMoviesDay = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas de tendencia del día');
    }
    const data = await response.json();
    const movies = await associateGenresToMovies(data.results);
    return { movies, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { movies: [], totalPages: 1 };
  }
};

// Películas en los Cines
export const getNowPlayingMovies = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas en los cines');
    }
    const data = await response.json();
    const movies = await associateGenresToMovies(data.results);
    return { movies, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return { movies: [], totalPages: 1 };
  }
};

// Películas con Videos
export const getMoviesWithVideos = async () => {
  try {
    const nowPlayingMovies = await getNowPlayingMovies(1);
    const moviesWithVideosPromises = nowPlayingMovies.movies.map(async (movie) => {
      try {
        const videoResponse = await fetch(`${BASE_URL}/movie/${movie.id}/videos?api_key=${API_KEY}&language=es-ES`);
        if (!videoResponse.ok) {
          throw new Error('Error al obtener los videos de la película');
        }
        const videoData = await videoResponse.json();
        if (videoData.results.length > 0) {
          return { ...movie, videos: videoData.results };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching videos for movie ID ${movie.id}:`, error);
        return null;
      }
    });
    const moviesWithVideos = await Promise.all(moviesWithVideosPromises);
    return moviesWithVideos.filter(movie => movie !== null);
  } catch (error) {
    console.error('Error fetching movies with videos:', error);
    return [];
  }
};

// Películas Mejor Valoradas
export const getTopRatedMovies = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas mejor valoradas');
    }
    const data = await response.json();
    const movies = await associateGenresToMovies(data.results);
    return { movies, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { movies: [], totalPages: 1 };
  }
};

// Películas Próximamente
export const getUpcomingMovies = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas próximas');
    }
    const data = await response.json();
    const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    const futureMovies = data.results.filter(movie => movie.release_date > currentDate); // Filtra películas futuras
    const totalPages = data.total_pages;
    return {
      movies: await associateGenresToMovies(futureMovies),
      totalPages
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return { movies: [], totalPages: 0 };
  }
};

// Detalles de Película
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalles de la película con ID ${movieId}`);
    }
    const data = await response.json();
    const genres = await getGenres();
    return {
      ...data,
      genres: data.genres.map(id => genres.find(genre => genre.id === id)).filter(genre => genre !== undefined)
    };
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error);
    return null;
  }
};

// Series Populares
export const getPopularSeries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener las series populares');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular series', error);
    return [];
  }
};
