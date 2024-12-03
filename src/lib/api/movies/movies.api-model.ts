import type { Credits, Genre, Provider, Video } from "../media";
import { getMoviesProviders } from "./movies.api";

export const TYPES = ["popular", "top_rated", "now_playing", "upcoming"];
export const allProviders = await getMoviesProviders();
export const PROVIDERS = allProviders.filter(
  (provider: Provider) =>
    provider.provider_name === "Netflix" ||
    provider.provider_name === "Max" ||
    provider.provider_name === "Amazon Prime Video" ||
    provider.provider_name === "Disney Plus" ||
    provider.provider_name === "SkyShowtime" ||
    provider.provider_name === "Movistar Plus+" ||
    provider.provider_name === "Atres Player"
);
export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

export interface Movie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  videos: Video[];
  providers: Provider[];
}

export interface MovieDetails {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: any;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  providers: Provider[];
  videos: Video[];
  credits: Credits;
}
