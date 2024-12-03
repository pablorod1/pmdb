import React from "react";
import { formatDate } from "src/common";
import { getPopularMoviesAndSeries, searchMediabyName } from "@lib/api/media";
import { type Movie } from "@lib/api/movies";
import type { Serie } from "@lib/api/series";

const SearchBar: React.FC = () => {
  const [media, setMedia] = React.useState<(Movie | Serie)[]>([]);
  const searchWrapper = document.getElementById("searchWrapper");
  const searchContainer = document.getElementById("searchContainer");
  const html = document.querySelector("html");
  const closeSearchBarButton = document.getElementById("closeSearchBar");

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const newMedia = await getPopularMoviesAndSeries();
        console.log(newMedia);
        setMedia(newMedia.media);
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
        const newMedia = await searchMediabyName(query);
        setMedia(newMedia.media);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    } else {
      const newMedia = await getPopularMoviesAndSeries();
      setMedia(newMedia.media);
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
        className="flex opacity-0 -z-50 w-screen h-screen bg-black bg-opacity-60 absolute top-0 left-0 justify-center pt-40 px-12 "
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
              {media.map((item: Movie | Serie, index: number) => (
                <li key={index}>
                  <a
                    className="flex items-start gap-4"
                    href={
                      "title" in item
                        ? `/peliculas/${item.id}`
                        : `/series/${item.id}`
                    }
                  >
                    <img
                      className="aspect-[2/3] max-w-24 object-cover rounded-lg"
                      src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                      alt={"title" in item ? item.title : item.name}
                    />
                    <div className="flex flex-col items-start gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-white font-semibold">
                          {"title" in item ? item.title : item.name}
                        </h3>
                        <p className="text-gray-300">
                          {"release_date" in item
                            ? formatDate(item.release_date)
                            : formatDate(item.first_air_date)}
                        </p>
                      </div>
                      <div>
                        <ul className="flex items-center gap-2">
                          {item.providers &&
                            item.providers.length > 0 &&
                            item.providers.map((provider, index) => (
                              <li key={index}>
                                <img
                                  className="size-10 rounded-lg"
                                  src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                  alt={provider.provider_name}
                                />
                              </li>
                            ))}
                        </ul>
                      </div>
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
