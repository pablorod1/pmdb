import type { Movie, Provider } from "../movies";
import type { Serie } from "../series";

export interface MediaResponse {
  media: (Movie | Serie)[];
  totalPages: number;
}

export interface MediaProvider {
  movieProviders: Provider[];
  serieProviders: Provider[];
}
