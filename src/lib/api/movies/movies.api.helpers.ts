import { getMoviesByType } from "./movies.api";
import { type MoviesResponse } from "./movies.api-model";

export const translateType = (type: string) => {
  switch (type) {
    case "top_rated":
      return "Mejor Valoradas";
    case "popular":
      return "Más Populares";
    case "trendingDay":
      return "Tendencias de Hoy";
    case "trendingWeek":
      return "Tendencias de la Semana";
    case "now_playing":
      return "En el Cine";
    case "upcoming":
      return "Próximamente";
    default:
      return "Más Populares";
  }
};

export const fetchMoviesByType = async (
  type: string,
  page: number
): Promise<MoviesResponse> => {
  switch (type) {
    case "top-rated":
      return await getMoviesByType("top_rated", page);
    case "popular":
      return await getMoviesByType("popular", page);
    case "nowPlaying":
      return await getMoviesByType("now_playing", page);
    case "upcoming":
      return await getMoviesByType("upcoming", page);
    default:
      return await getMoviesByType("popular", page);
  }
};

export const getGenreClass = (genre: string): string => {
  switch (genre) {
    case "Acción":
      return "bg-blue-900 text-blue-300";
    case "Aventura":
      return "bg-gray-700 text-gray-300";
    case "Animación":
      return "bg-red-900 text-red-300";
    case "Comedia":
      return "bg-green-900 text-green-300";
    case "Crimen":
      return "bg-yellow-900 text-yellow-300";
    case "Documental":
      return "bg-indigo-900 text-indigo-300";
    case "Drama":
      return "bg-purple-900 text-purple-300";
    case "Familia":
      return "bg-pink-900 text-pink-300";
    case "Fantasía":
      return "bg-blue-900 text-blue-300";
    case "Historia":
      return "bg-gray-700 text-gray-300";
    case "Terror":
      return "bg-red-900 text-red-300";
    case "Música":
      return "bg-green-900 text-green-300";
    case "Misterio":
      return "bg-yellow-900 text-yellow-300";
    case "Romance":
      return "bg-indigo-900 text-indigo-300";
    case "Ciencia Ficción":
      return "bg-purple-900 text-purple-300";
    case "TV Movie":
      return "bg-pink-900 text-pink-300";
    case "Thriller":
      return "bg-blue-900 text-blue-300";
    case "Guerra":
      return "bg-gray-700 text-gray-300";
    case "Oeste":
      return "bg-red-900 text-red-300";
    default:
      return "bg-blue-900 text-blue-300";
  }
};
