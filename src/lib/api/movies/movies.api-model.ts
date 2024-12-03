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

export interface Genre {
  id: number;
  name: string;
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

export interface Provider {
  provider_id: number;
  provider_name: string;
  display_priority: number;
  logo_path: string;
}

export interface Video {
  id: number;
  name: string;
  key: string;
}
