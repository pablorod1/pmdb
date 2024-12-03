import type { Movie } from "../movies";
import type { Serie } from "../series";

export interface MediaResponse {
  media: (Movie | Serie)[];
  totalPages: number;
}

export interface MediaProvider {
  movieProviders: Provider[];
  serieProviders: Provider[];
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
