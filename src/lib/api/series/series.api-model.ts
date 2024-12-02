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

export interface Genre {
  id: number;
  name: string;
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

export interface Provider {
  provider_id: number;
  provider_name: string;
  display_priority: number;
  logo_path: string;
  display_priorities: number[];
}

export interface Video {
  id: number;
  name: string;
  key: string;
}

export interface Credits {
  id: number;
  cast: Cast[];
  crew: Crew[];
}

export interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
  department: string;
  job: string;
}
