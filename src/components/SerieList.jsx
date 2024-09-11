import { useState, useEffect } from "react";
import {
  getPopularSeries,
  getTopRatedSeries,
  getTrendingSeriesDay,
  getTrendingSeriesWeek,
  getNowPlayingSeries,
  getUpcomingSeries,
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

const fetchSeries = async (type, page) => {
  switch (type) {
    case "top-rated":
      return await getTopRatedSeries(page);
    case "trendingDay":
      return await getTrendingSeriesDay(page);
    case "trendingWeek":
      return await getTrendingSeriesWeek(page);
    case "nowPlaying":
      return await getNowPlayingSeries(page);
    case "upcoming":
      return await getUpcomingSeries(page);
    default:
      return await getPopularSeries(page);
  }
};

export default function SerieList({ initialSeries, initialType }) {
  const [series, setSeries] = useState(initialSeries.series);
  const [page, setPage] = useState(2);
  const [totalPages, setTotalPages] = useState(initialSeries.totalPages);
  const [type, setType] = useState(initialType);

  // Función para comprobar si una película ya existe en el array
  const isSerieInList = (serieId) => {
    return series.some((serie) => serie.id === serieId);
  };


  const loadMoreSeries = async () => {
    const loader = document.getElementById("loader");
    const showMoreButton = document.getElementById("showMoreButton");
    if (loader && showMoreButton){
      showMoreButton.style.display = "none";
      loader.classList.remove("hidden");
      loader.classList.add("flex");
      setTimeout(() => {
        loader.classList.remove("flex");
        loader.classList.add("hidden");
        showMoreButton.style.display = "flex";
      }, 3000);

    }
    const { series: newSeries, totalPages: newTotalPages } = await fetchSeries(
      type,
      page
    );

    // Filtrar las películas nuevas para eliminar duplicados
    const uniqueNewSeries = newSeries.filter(
      (serie) => !isSerieInList(serie.id)
    );

    setSeries((prevSeries) => [...prevSeries, ...uniqueNewSeries]);
    setPage((prevPage) => prevPage + 1);
    setTotalPages(newTotalPages);
  };

  const handleTypeChange = async (newType) => {
    setType(newType);
    setPage(1);
    const { series: newSeries, totalPages: newTotalPages } = await fetchSeries(
      newType,
      1
    );
    setSeries(newSeries);
    // Ordenar por vote_average
    setSeries((prevSeries) =>
      prevSeries.sort((a, b) => b.vote_average - a.vote_average)
    );
    setTotalPages(newTotalPages);
  };

  const serieDetails = async (serieId) => {
    window.open(`/series/${serieId}`, "_self");
  };

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
        return "En Emisión";
      default:
        return "Más Populares";
    }
  }

  return (
    <div className="mx-12 pb-20">
      <div className="flex items-center gap-x-8 mb-12">
        <h1 className="text-3xl font-bold text-white">Series</h1>

        <button id="dropdownDefaultButton" data-dropdown-toggle="dropdown" className="text-white bg-[var(--background-color)] focus:ring-2 focus:outline-none focus:ring-[var(--primary-color)] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center capitalize" type="button"> {translateType(type)} <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
        </svg>
        </button>


        <div id="dropdown" className="z-10 hidden bg-[var(--background-color)] shadow-[2px_2px_5px_0_rgba(203,196,0,1)] divide-y divide-gray-100 rounded-lg  w-44">
            <ul className="py-2 text-sm text-white" aria-labelledby="dropdownDefaultButton">
              <li>
                <button
                type="button"
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
                  En Emisión
                </button>
              </li>
            </ul>
        </div>

        {/* <div className="text-white text-nowrap rounded-full flex items-center  gap-x-2 border-2 border-[var(--primary-color)] max-w-96 overflow-scroll xl:max-w-max">
          
          
        </div> */}
      </div>
      <div className="movies-container grid grid-cols-1 gap-10 md:gap-8 md:grid-cols-4 lg:grid-cols-5 mb-24">
        {series.map((serie, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-y-4 w-full h-full"
          >
            <img
              className="w-80 md:w-full md:h-full md:min-h-[280px] md:max-h-[280px] lg:min-h-[320px] lg:max-h-[320px] rounded-xl object-fill cursor-pointer"
              src={`https://image.tmdb.org/t/p/original${serie.poster_path}`}
              loading="lazy"
              onClick={() => serieDetails(serie.id)}
              alt={serie.name}
            />
            <div className="flex flex-col gap-y-4">
              <h1 className="text-white text-2xl font-medium cursor-pointer hover:underline"
              onClick={() => serieDetails(serie.id)}
              >{serie.name}</h1>
              <span className="text-gray-300">
                Puntuación: {formatRating(serie.vote_average)} ({formatVotes(serie.vote_count)})
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
        <div  className="w-full flex justify-center items-center relative">
          <div id="loader" class="hidden absolute flex-col justify-center items-center max-w-[300px] w-full">
            <button disabled type="button" class="w-full py-2.5 px-5 text-2xl font-semibold text-[var(--primary-color)] bg-transparent rounded-lg   flex flex-col justify-center items-center gap-y-4">
              <svg aria-hidden="true" role="status" class="inline size-14 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#13151a"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#CBC400"/>
              </svg>
              Loading...
            </button>
          </div>
          <button
            id="showMoreButton"
            onClick={loadMoreSeries}
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
