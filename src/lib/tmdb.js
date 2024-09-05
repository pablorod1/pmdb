// src/lib/tmdb.js
const API_KEY = '0a233d84fc55a74ae5753ab6a5e22375';
const BASE_URL = 'https://api.themoviedb.org/3';


// Movies
export const getPopularMovies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas populares');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};

// Trending Movies Week
export const getTrendingMoviesWeek = async () => {
  try{
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las películas populares');
    }
    const data = await response.json();
    return data.results;
  } catch (error){
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

// Trending Movies Day
export const getTrendingMoviesDay = async () => {
  try{
    const response = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las películas: ');
    }
    const data = await response.json();
    return data.results;
  } catch (error){
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

// Now Playing Movies
export const getNowPlayingMovies = async () => {
  try{
    const response = await fetch(`${BASE_URL}/discover/movie?include_video=true&api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las películas: ');
    }
    const data = await response.json();
    return data.results;
  } catch (error){
    console.error('Error fetching trending movies:', error);
    return [];
  }
}

export const getMoviesWithVideos = async () => {
  try {
    // Paso 1: Obtener películas en los cines
    const nowPlayingMovies = await getUpcomingMovies();

    // Paso 2: Filtrar películas con videos
    const moviesWithVideosPromises = nowPlayingMovies.map(async (movie) => {
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

    // Esperar a que todas las promesas se resuelvan
    const moviesWithVideos = await Promise.all(moviesWithVideosPromises);

    // Filtrar películas que no tienen videos
    return moviesWithVideos.filter(movie => movie !== null);
  } catch (error) {
    console.error('Error fetching movies with videos:', error);
    return [];
  }
};

// Top Rated Movies
export const getTopRatedMovies = async () => {
  try{
    const response = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las películas: ');
    }
    const data = await response.json();
    return data.results;
  } catch (error){
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

// Upcoming Movies
export const getUpcomingMovies = async () => {
  try{
    const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las películas: ');
    }
    const data = await response.json();
    return data.results;
  } catch (error){
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

// Movie Details
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error(`Error al obtener detalles de la película con ID ${movieId}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error);
    return null;
  }
};

// TV series
export const getPopularSeries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok){
      throw new Error('Error al obtener las series populares');
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular series', error);
    return [];
  }
}
