const API_KEY = '0a233d84fc55a74ae5753ab6a5e22375';
const BASE_URL = 'https://api.themoviedb.org/3';

// Obtiene todos los géneros
const getGenres = async (type) => {
  try {
    const response = await fetch(`${BASE_URL}/genre/${type}/list?api_key=${API_KEY}&language=es-ES`);
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

const getVideos = async (movieId, type) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}/videos?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener los videos de la película');
    }
    const data = await response.json();
    return data.results;
  }
  catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};

const getCredits = async (movieId, type) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}/credits?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener los créditos de la película');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching credits:', error);
    return [];
  }
}

const getProviders = async (movieId, type) => {
  try {
    const response = await fetch(`${BASE_URL}/${type}/${movieId}/watch/providers?api_key=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Error al obtener los proveedores de la película');
    }
    const data = await response.json();
    return data.results.ES.flatrate;
  } catch (error) {
    console.error('Error fetching providers:', error);
    return [];
  }
}

// Asocia géneros a las películas
const associateGenresAndVideosToMovies = async (movies) => {
  try {
    const genres = await getGenres('movie');
    const moviesWithGenresPromises = movies.map(async (movie) => {
      const videos = await getVideos(movie.id, "movie");
      return {
        ...movie,
        genres: movie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(genre => genre !== undefined),
        videos
      };
    });
    return await Promise.all(moviesWithGenresPromises);
  } catch (error) {
    console.error('Error associating genres and videos to movies:', error);
    return [];
  }
};

// Asocia géneros a las series
const associateGenresAndVideosToSeries = async (series) => {
  try {
    const genres = await getGenres('tv');
    const seriesWithGenresPromises = series.map(async (serie) => {
      const videos = await getVideos(serie.id, 'tv');
      return {
        ...serie,
        genres: serie.genre_ids.map(id => genres.find(genre => genre.id === id)).filter(genre => genre !== undefined),
        videos
      };
    });
    return await Promise.all(seriesWithGenresPromises);
  } catch (error) {
    console.error('Error associating genres and videos to series:', error);
    return [];
  }
}


// Películas Populares
export const getPopularMovies = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las películas populares');
    }
    const data = await response.json();
    const movies = await associateGenresAndVideosToMovies(data.results);
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
    const movies = await associateGenresAndVideosToMovies(data.results);
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
    const movies = await associateGenresAndVideosToMovies(data.results);
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
    const movies = await associateGenresAndVideosToMovies(data.results);
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
    const movies = await associateGenresAndVideosToMovies(data.results);
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
      movies: await associateGenresAndVideosToMovies(futureMovies),
      totalPages
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return { movies: [], totalPages: 0 };
  }
};

// Detalles de Película Genres and Videos
export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la película');
    }
    const movie = await response.json();
    return {
      ...movie,
      genres: movie.genres,
      videos: await getVideos(movieId, 'movie'),
      credits: await getCredits(movieId, 'movie'),
      providers: await getProviders(movieId, 'movie')
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Series Populares
export const getPopularSeries = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las series populares');
    }
    const data = await response.json();
    const series = await associateGenresAndVideosToSeries(data.results);
    return {series, totalPages: data.total_pages};
  } catch (error) {
    console.error('Error fetching popular series', error);
    return {series: [], totalPages: 1};
  }
};

// Top Rated Series
export const getTopRatedSeries = async (page) => {
  try{
    const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if(!response.ok){
      throw new Error('Error al obtener las series mejor valoradas');
    }
    const data = await response.json();
    const series = await associateGenresAndVideosToSeries(data.results);
    return { series, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return { series: [], totalPages: 1 };
  }
}

// Trending Series Week
export const getTrendingSeriesWeek = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las series de tendencia');
    }
    const data = await response.json();
    const series = await associateGenresAndVideosToSeries(data.results);
    return { series, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching trending series:', error);
    return { series: [], totalPages: 1 };
  }
};

// Trending Series Day
export const getTrendingSeriesDay = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/tv/day?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las series de tendencia del día');
    }
    const data = await response.json();
    const series = await associateGenresAndVideosToSeries(data.results);
    return { series, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching trending series:', error);
    return { series: [], totalPages: 1 };
  }
};

// Now Playing Series
export const getNowPlayingSeries = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las series en emisión');
    }
    const data = await response.json();
    const series = await associateGenresAndVideosToSeries(data.results);
    return { series, totalPages: data.total_pages };
  } catch (error) {
    console.error('Error fetching now playing series:', error);
    return { series: [], totalPages: 1 };
  }
};

// Upcoming Series
export const getUpcomingSeries = async (page) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/airing_today?api_key=${API_KEY}&language=es-ES&page=${page}`);
    if (!response.ok) {
      throw new Error('Error al obtener las series próximas');
    }
    const data = await response.json();
    const currentDate = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    const futureSeries = data.results.filter(serie => serie.first_air_date > currentDate); // Filtra series futuras
    const totalPages = data.total_pages;
    return {
      series: await associateGenresAndVideosToSeries(futureSeries),
      totalPages
    };
  } catch (error) {
    console.error('Error fetching upcoming series:', error);
    return { series: [], totalPages: 0 };
  }
};


// Serie Details
export const getSerieDetails = async (serieId) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${serieId}?api_key=${API_KEY}&language=es-ES`);
    if (!response.ok) {
      throw new Error('Error al obtener los detalles de la serie');
    }
    const serie = await response.json();
    return {
      ...serie,
      genres: serie.genres,
      videos: await getVideos(serieId, 'tv'),
      credits: await getCredits(serieId, 'tv'),
      providers: await getProviders(serieId, 'tv')
    };
  } catch (error) {
    console.error('Error fetching serie details:', error);
    return null;
  }
};

export const getAllMoviesAndSeries = async () => {
  try {
    // Fetch all movies and series
    const popularMovies = await getPopularMovies(1);
    const trendingMoviesWeek = await getTrendingMoviesWeek(1);
    const trendingMoviesDay = await getTrendingMoviesDay(1);
    const nowPlayingMovies = await getNowPlayingMovies(1);
    const topRatedMovies = await getTopRatedMovies(1);
    const upcomingMovies = await getUpcomingMovies(1);
    const popularSeries = await getPopularSeries(1);
    const topRatedSeries = await getTopRatedSeries(1);
    const trendingSeriesWeek = await getTrendingSeriesWeek(1);
    const trendingSeriesDay = await getTrendingSeriesDay(1);
    const nowPlayingSeries = await getNowPlayingSeries(1);
    const upcomingSeries = await getUpcomingSeries(1);


    // Save all items in an items[] array
    const items = [
      ...popularMovies.movies,
      ...trendingMoviesWeek.movies,
      ...trendingMoviesDay.movies,
      ...nowPlayingMovies.movies,
      ...topRatedMovies.movies,
      ...upcomingMovies.movies,
      ...popularSeries.series,
      ...topRatedSeries.series,
      ...trendingSeriesWeek.series,
      ...trendingSeriesDay.series,
      ...nowPlayingSeries.series,
      ...upcomingSeries.series
    ];

    // Delete repeated items
    const uniqueItems = items.filter((item, index, self) =>
      index === self.findIndex((t) => (
        t.id === item.id
      ))
    );
    return uniqueItems;


  } catch (error) {
    console.error('Error fetching all movies and series:', error);
    return [];
  }
}