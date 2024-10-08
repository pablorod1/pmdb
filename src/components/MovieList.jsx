import { useState, useEffect } from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getTrendingMoviesDay,
  getTrendingMoviesWeek,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@lib/tmdb";

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatRating(rating) {
  return rating.toFixed(1);
}

export function formatVotes(votes) {
  if (votes >= 1000000) {
    return `${(votes / 1000000).toFixed(1)}M`;
  } else {
    return votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

function getGenreClass(genre) {
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
}

const fetchMovies = async (type, page) => {
  switch (type) {
    case "top-rated":
      return await getTopRatedMovies(page);
    case "trendingDay":
      return await getTrendingMoviesDay(page);
    case "trendingWeek":
      return await getTrendingMoviesWeek(page);
    case "nowPlaying":
      return await getNowPlayingMovies(page);
    case "upcoming":
      return await getUpcomingMovies(page);
    default:
      return await getPopularMovies(page);
  }
};

export default function MovieList({ initialMovies, initialType }) {
  const [movies, setMovies] = useState(initialMovies.movies);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(initialMovies.totalPages);
  const [type, setType] = useState(initialType);

  // Función para comprobar si una película ya existe en el array
  const isMovieInList = (movieId) => {
    return movies.some((movie) => movie.id === movieId);
  };

  const loadMoreMovies = async () => {
    const { movies: newMovies, totalPages: newTotalPages } = await fetchMovies(
      type,
      page
    );

    // Filtrar las películas nuevas para eliminar duplicados
    const uniqueNewMovies = newMovies.filter(
      (movie) => !isMovieInList(movie.id)
    );

    setMovies((prevMovies) => [...prevMovies, ...uniqueNewMovies]);
    setPage((prevPage) => prevPage + 1);
    setTotalPages(newTotalPages);

    // Ordenar por vote_average
    // setMovies((prevMovies) =>
    //   prevMovies.sort((a, b) => b.vote_average - a.vote_average)
    // );
  };

  const handleTypeChange = async (newType) => {
    setType(newType);
    setPage(1);
    const { movies: newMovies, totalPages: newTotalPages } = await fetchMovies(
      newType,
      1
    );
    setMovies(newMovies);
    // Ordenar por vote_average
    setMovies((prevMovies) =>
      prevMovies.sort((a, b) => b.vote_average - a.vote_average)
    );
    setTotalPages(newTotalPages);
  };

  const movieDetails = async (movieId) => {
    window.open(`/peliculas/${movieId}`, "_self");
  }

  const translateType = (type) => {
    switch (type) {
      case "top-rated":
        return "Mejor Valoradas";
      case "popular":
        return "Más Populares";
      case "trendingDay":
        return "Tendencias de Hoy";
      case "trendingWeek":
        return "Tendencias de la Semana";
      case "nowPlaying":
        return "En el Cine";
      case "upcoming":
        return "Próximamente";
      default:
        return "Más Populares";
    }
  }

  return (
    <div className="flex flex-col justify-center mx-6 md:mx-12 pb-20">
      <div className="flex items-center gap-x-8 mb-12">
        <h1 className="text-3xl font-bold text-white">Películas</h1>
        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-[var(--background-color)] focus:ring-2 focus:outline-none focus:ring-[var(--primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center capitalize" type="button"> {translateType(type)} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>


        <div id="dropdown" className="z-10 hidden bg-[var(--background-color)] shadow-[2px_2px_5px_0_rgba(203,196,0,1)] divide-y divide-gray-100 rounded-lg  w-44">
            <ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
              <li>
                <button
                className="block w-full text-left px-4 py-2 hover:bg-[--primary-color-hover] hover:text-[var(--background-color)]"
                onClick={() => handleTypeChange("top-rated")}
                          >
                Mejor Valoradas
                          </button>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[--primary-color-hover] hover:text-[var(--background-color)]"
                  onClick={() => handleTypeChange("popular")}
                >
                  Más Populares
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[--primary-color-hover] hover:text-[var(--background-color)]"
                  onClick={() => handleTypeChange("trendingDay")}
                >
                  Tendencias de Hoy
                </button>
              </li>
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[--primary-color-hover] hover:text-[var(--background-color)]"
                  onClick={() => handleTypeChange("trendingWeek")}
                >
                  Tendencias de la Semana
                </button>
              </li>
              
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-[--primary-color-hover] hover:text-[var(--background-color)]"
                  onClick={() => handleTypeChange("nowPlaying")}
                >
                  En el Cine
                </button>
              </li>
            </ul>
        </div>
      </div>
      <div className="movies-container grid grid-cols-1 gap-10 md:gap-8 md:grid-cols-4 lg:grid-cols-5 mb-24">
        {movies.map((movie, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-y-4 w-full h-full"
          >
            <img
              className="w-80 md:w-full md:h-full md:min-h-[280px] md:max-h-[280px] lg:min-h-[320px] lg:max-h-[320px] rounded-xl object-fill cursor-pointer"
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              loading="lazy"
              onClick={() => movieDetails(movie.id)}
              alt={movie.title}
            />
            <div className="flex flex-col gap-y-4">
              <h1 className="text-white text-2xl font-medium cursor-pointer hover:underline"
              onClick={() => movieDetails(movie.id)}
              >{movie.title}</h1>
              <span className="text-gray-300">
                Puntuación: {formatRating(movie.vote_average)} ({formatVotes(movie.vote_count)})
              </span>
              {/* <div className="flex gap-x-1 py-2">
                {movie.genres.map((genre, index) => (
                  <span
                    key={index}
                    className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${getGenreClass(
                      genre.name
                    )}`}
                  >
                    {genre.name}
                  </span>
                ))}
              </div> */}
            </div>
          </div>
        ))}
      </div>
      {page <= totalPages && (
        <div className="w-full flex justify-center items-center">
          <button
            onClick={loadMoreMovies}
            style={{
              cursor: "pointer",
              position: "relative",
              padding: "10px 24px",
              fontSize: "18px",
              color: "var(--primary-color)",
              border: "2px solid var(--primary-color)",
              borderRadius: "34px",
              backgroundColor: "transparent",
              fontWeight: "600",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
              overflow: "hidden",
              zIndex: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "var(--background-color)";
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 0px 20px var(--primary-color-shadow)";
              e.currentTarget.style.backgroundColor = "var(--primary-color)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "var(--primary-color)";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
          >
            Mostrar más{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-chevrons-down"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 7l5 5l5 -5" />
              <path d="M7 13l5 5l5 -5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
