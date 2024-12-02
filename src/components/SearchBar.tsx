import { getMovieByName, type Movie } from "@lib/api/movies";
import { getAllMoviesAndSeries, getTrendingMoviesWeek } from "@lib/tmdb";
import React from "react";
import { formatDate } from "src/common";

const SearchBar: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const searchWrapper = document.getElementById("searchWrapper");
  const searchContainer = document.getElementById("searchContainer");
  const html = document.querySelector("html");
  const closeSearchBarButton = document.getElementById("closeSearchBar");

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies: Movie[] = await getTrendingMoviesWeek(1).then(
          (movies) => movies.movies
        );
        setMovies(movies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    if (query && query !== "") {
      try {
        const newMovies = await getMovieByName(query);
        setMovies(newMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    } else {
      const movies: Movie[] = await getTrendingMoviesWeek(1).then(
        (movies) => movies.movies
      );
      setMovies(movies);
    }
  };

  const openSearchBar = () => {
    if (searchWrapper) {
      searchWrapper.classList.remove("opacity-0", "-z-50");
      searchWrapper.classList.add("z-50", "opacity-100");
      if (html) html.style.overflow = "hidden";

      if (searchContainer) {
        setTimeout(() => {
          searchContainer.classList.remove("-translate-y-14", "opacity-0");
          searchContainer.classList.add("opacity-100", "translate-y-0");
        }, 100);
      }
    }
  };

  const closeSearchBar = () => {
    if (closeSearchBarButton) {
      closeSearchBarButton.addEventListener("click", () => {
        if (searchContainer) {
          searchContainer.classList.add("-translate-y-14", "opacity-0");
          searchContainer.classList.remove("opacity-100", "translate-y-0");
        }

        if (searchWrapper && html) {
          setTimeout(() => {
            searchWrapper.classList.remove("opacity-100", "z-50");
            searchWrapper.classList.add("opacity-0", "-z-50");
            html.style.overflow = "auto";
          }, 400);
        }
      });
    }
  };

  return (
    <>
      <button id="searchButton" type="button" onClick={openSearchBar}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-search size-6"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
          <path d="M21 21l-6 -6" />
        </svg>
      </button>

      <div
        id="searchWrapper"
        className="flex opacity-0 -z-50 w-screen h-screen bg-black bg-opacity-60 absolute top-0 left-0 justify-center pt-40 "
      >
        <div>
          <button
            id="closeSearchBar"
            type="button"
            className="absolute top-0 right-0 p-4"
            aria-label="Cerrar"
            onClick={closeSearchBar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div
          id="searchContainer"
          className="flex flex-col items-start max-w-[800px] w-full max-h-[500px] h-full  opacity-0 -translate-y-14 transition-all duration-300 ease-in-out"
        >
          <input
            onChange={handleSearch}
            autoFocus={false}
            type="text"
            id="searchInput"
            placeholder="Buscar..."
            className=" max-w-[800px] w-full h-10 px-4 py-6 text-md text-white bg-[var(--background-color)] rounded-lg rounded-b-none focus:outline-0 focus:shadow-none focus:ring-0 focus:border-0  "
          />
          <div className="bg-[var(--background-color)] rounded-lg rounded-t-none w-full h-full overflow-scroll overflow-x-hidden">
            <ul className="flex flex-col gap-4 p-4">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-trending-up size-6"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 17l6 -6l4 4l8 -8" />
                  <path d="M14 7l7 0l0 7" />
                </svg>
                Tendencias
              </h2>
              {movies.map((movie: Movie, index: number) => (
                <li key={index}>
                  <a
                    className="flex items-start gap-4"
                    href={`/peliculas/${movie.id}`}
                  >
                    <img
                      className="w-20 h-20 object-cover rounded-lg"
                      src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                      alt={movie.title || movie.name}
                    />
                    <div className="flex flex-col items-start">
                      <h3 className="text-white font-semibold">
                        {movie.title || movie.name}
                      </h3>
                      <p className="text-gray-300">
                        {movie.release_date
                          ? formatDate(movie.release_date)
                          : movie.first_air_date
                          ? formatDate(movie.first_air_date)
                          : ""}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
