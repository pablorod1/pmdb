import { getMovieWhatchProviders, PROVIDERS, type Movie } from "../movies";
import { getSerieWhatchProviders, type Serie } from "../series";
import type { MediaResponse } from "./media.api-model";

const API_KEY = "0a233d84fc55a74ae5753ab6a5e22375";
const MULTI_URL = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}`;
const MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
const SERIES_URL = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=es-ES&page=1&watch_region=ES&with_watch_providers=${PROVIDERS.map(
  (provider) => provider.provider_id
).join("|")}`;

export const getPopularMoviesAndSeries = async (): Promise<MediaResponse> => {
  try {
    const moviesResponse = await fetch(MOVIES_URL);
    if (!moviesResponse.ok) {
      throw new Error("Network moviesResponse was not ok");
    }
    const moviesData = await moviesResponse.json();
    const moviesTotalPages = moviesData.total_pages;
    const moviesProvidersResponse = moviesData.results.map(
      async (movie: Movie) => {
        const providers = await getMovieWhatchProviders(movie.id);
        return { ...movie, providers };
      }
    );
    const moviesProviders = await Promise.all(moviesProvidersResponse);

    const seriesResponse = await fetch(SERIES_URL);
    if (!seriesResponse.ok) {
      throw new Error("Network seriesResponse was not ok");
    }
    const seriesData = await seriesResponse.json();
    const seriesTotalPages = seriesData.total_pages;
    const seriesProvidersResponse = seriesData.results.map(
      async (serie: Serie) => {
        const providers = await getSerieWhatchProviders(serie.id);
        return { ...serie, providers };
      }
    );
    const seriesProviders = await Promise.all(seriesProvidersResponse);

    return {
      media: [...seriesProviders, ...moviesProviders],
      totalPages: Math.max(moviesTotalPages, seriesTotalPages),
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    media: [],
    totalPages: 0,
  };
};

export const searchMediabyName = async (
  name: string
): Promise<MediaResponse> => {
  try {
    const response = await fetch(
      `${MULTI_URL}&query=${name}&language=es-ES&watch_region=ES&sort_by=vote_count.desc`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const dataProvidersResponse = data.results.map(
      async (media: Movie | Serie) => {
        if ("title" in media) {
          const providers = await getMovieWhatchProviders(media.id);
          return { ...media, providers };
        } else if ("name" in media) {
          const providers = await getSerieWhatchProviders(media.id);
          return { ...media, providers };
        }
      }
    );
    const dataProviders = await Promise.all(dataProvidersResponse);
    return {
      media: dataProviders,
      totalPages: 1,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    media: [],
    totalPages: 0,
  };
};
