import type { MovieDetails, MoviesResponse, Movie } from "./movies.api-model";
import type { Provider, Video, Credits } from "../media";

const API_KEY = "0a233d84fc55a74ae5753ab6a5e22375";
const MOVIE_URL = "https://api.themoviedb.org/3/movie";

export const getAllMovies = async (): Promise<MoviesResponse> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/now_playing?api_key=${API_KEY}&language=es-ES&page=1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const totalPages = data.total_pages;
    for (let i = 2; i <= totalPages; i++) {
      const response = await fetch(
        `${MOVIE_URL}/now_playing?api_key=${API_KEY}&language=es-ES&page=${i}`
      );
      const dataPage = await response.json();
      data.results = [...data.results, ...dataPage.results];
    }
    return {
      movies: data.results,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    movies: [],
    totalPages: 0,
  };
};

export const getMoviesByType = async (
  type: string,
  page: number
): Promise<MoviesResponse> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/${type}?api_key=${API_KEY}&language=es-ES&page=${page}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      movies: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    movies: [],
    totalPages: 0,
  };
};

export const getMoviesVideos = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/now_playing?api_key=${API_KEY}&language=es-ES&page=1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const movies = data.results;
    for (let i = 0; i < movies.length; i++) {
      const response = await fetch(
        `${MOVIE_URL}/${movies[i].id}/videos?api_key=${API_KEY}&language=es-ES`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const dataVideos = await response.json();
      movies[i].videos = dataVideos.results;
    }
    return movies;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

export const getMovieByName = async (name: string) => {
  try {
    for (let i = 1; i <= 100; i++) {
      const response = await fetch(
        `${MOVIE_URL}/search?api_key=${API_KEY}&language=es-ES&query=${name}&page=${i}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      if (data.total_pages === 0) {
        break;
      }
      if (i === 1) {
        return data.results;
      }
      return [...data.results];
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

export const getMovieById = async (id: number): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/${id}?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const providers = await getMovieWhatchProviders(id);
    const videos = await getMovieVideos(id);
    const credits = await getMovieCredits(id);
    return {
      ...data,
      providers,
      videos,
      credits,
    } as MovieDetails;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as MovieDetails;
};

export const getMovieWhatchProviders = async (
  id: number
): Promise<Provider> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/${id}/watch/providers?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results.ES;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as Provider;
};

const getMovieVideos = async (id: number): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/${id}/videos?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

const getMovieCredits = async (id: number): Promise<Credits> => {
  try {
    const response = await fetch(
      `${MOVIE_URL}/${id}/credits?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as Credits;
};

export const getMoviesProviders = async (): Promise<Provider[]> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/movie?language=es-ES&watch_region=ES&sort_by=display_priority.desc&api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

export const discoverMoviesByProvider = async (
  page: number,
  provider: string
): Promise<MoviesResponse> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?language=es-ES&page=${page}&with_watch_providers=${provider}&watch_region=ES&sort_by=popularity.desc&api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      movies: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    movies: [],
    totalPages: 0,
  };
};
