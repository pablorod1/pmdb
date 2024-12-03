import type { Credits, Genre, Provider, Video } from "../media";
import { getTVProviders } from "./series.api";

export const TYPES = ["popular", "top_rated", "on_the_air", "airing_today"];
export const allProviders = await getTVProviders();
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

export interface Serie {
  id: number;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  providers: Provider[];
}

export interface SeriesResponse {
  series: Serie[];
  totalPages: number;
}

export interface SerieDetails {
  id: number;
  adult: boolean;
  backdrop_path: string;
  created_by: CreatedBy[];
  episode_run_time: number[];
  first_air_date: string;
  genres: Genre[];
  homepage: string;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  name: string;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  seasons: Season[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  providers: Provider[];
  videos: Video[];
  credits: Credits;
}

export interface CreatedBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}

export interface Network {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
