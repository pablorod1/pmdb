import { getSeriesByType } from "./series.api";
import type { SeriesResponse } from "./series.api-model";

/* "popular", "top_rated", "on_the_air", "airing_today"*/

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
    case "on_the_air":
      return "Proximamente";
    case "airing_today":
      return "En transmisión";
    default:
      return "Más Populares";
  }
};

export const fetchSeriesByType = async (
  type: string,
  page: number
): Promise<SeriesResponse> => {
  switch (type) {
    case "top-rated":
      return await getSeriesByType("top_rated", page);
    case "popular":
      return await getSeriesByType("popular", page);
    case "on_the_air":
      return await getSeriesByType("on_the_air", page);
    case "airing_today":
      return await getSeriesByType("airing_today", page);
    default:
      return await getSeriesByType("popular", page);
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
