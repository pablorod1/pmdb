import React from "react";

import { formatRating, formatVotes } from "src/common";
import { initFlowbite } from "flowbite";
import {
  type Serie,
  type SeriesResponse,
  PROVIDERS,
  discoverSeriesByProvider,
} from "@lib/api/series";
import type { Provider } from "@lib/api/media";
interface Props {
  initialSeries: SeriesResponse;
  initialProvider: Provider[];
}

const SerieList: React.FC<Props> = (props) => {
  const { initialSeries, initialProvider } = props;
  const [series, setSeries] = React.useState<Serie[]>(initialSeries.series);
  const [provider, setProvider] = React.useState<Provider[]>(initialProvider);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(initialSeries.totalPages);

  React.useEffect(() => {
    initFlowbite();
  });

  const loadMoreSeries = async () => {
    const newPage = page + 1;
    const newSeries = await discoverSeriesByProvider(
      newPage,
      provider.map((p) => p.provider_id).join("|")
    );
    setSeries([...series, ...newSeries.series]);
    setPage(newPage);
  };

  const handleProviderChange = async (newProvider: Provider) => {
    const newSeries = await discoverSeriesByProvider(
      1,
      newProvider.provider_id.toString()
    );
    setSeries(newSeries.series);
    setProvider([newProvider]);
    setPage(1);
    setTotalPages(newSeries.totalPages);
  };

  return (
    <div className="flex flex-col justify-center mx-6 md:mx-12 pb-20">
      <div className="flex items-center gap-x-4 mb-12">
        {provider.length > 1 ? (
          <h1 className="text-3xl font-bold text-white">Todas las series</h1>
        ) : provider.length === 1 ? (
          <h1 className="text-3xl font-bold text-white">
            Series en {provider && provider[0].provider_name}
          </h1>
        ) : null}

        <button
          id="seriesProviderDropdownButton"
          data-dropdown-toggle="seriesProviderDropdown"
          className="text-white bg-[var(--background-color)] focus:outline-none font-medium rounded-lg text-center inline-flex items-center capitalize"
          type="button"
        >
          {provider.length === 1 ? (
            <img
              className="size-10 rounded-lg"
              src={`https://image.tmdb.org/t/p/original${provider[0].logo_path}`}
            />
          ) : (
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-filter"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
              </svg>{" "}
              plataforma
            </span>
          )}
          <svg
            className="w-2.5 h-2.5 ms-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>

        <div
          id="seriesProviderDropdown"
          className="z-10 max-w-56 hidden bg-[var(--background-color)] shadow-[2px_2px_5px_0_rgba(203,196,0,1)] divide-y divide-gray-100 rounded-lg "
        >
          <ul
            className="py-2 text-sm text-white max-h-96 overflow-y-auto "
            aria-labelledby="seriesProviderDropdownButton"
          >
            {PROVIDERS.map((provider: Provider, index: number) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-[--primary-color]  cursor-pointer group transition-all duration-300 ease-in-out"
              >
                <button
                  onClick={() => handleProviderChange(provider)}
                  type="button"
                  className="flex items-center gap-4 w-full text-left group-hover:text-[var(--background-color)]  group-hover:translate-x-2 transition-all duration-300 ease-in-out"
                >
                  <img
                    className="size-8 rounded-md"
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  />
                  <span>{provider.provider_name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className=" grid grid-cols-2  sm:grid-cols-3 md:gap-8  lg:grid-cols-5 xl:grid-cols-7 items-stretch justify-center w-full gap-10 mb-24">
        {series.map((serie: Serie, index: number) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-y-4 w-full h-full"
          >
            <a
              className="w-full h-auto aspect-auto rounded-xl"
              href={`/series/${serie.id}`}
            >
              <img
                className="w-full h-full rounded-xl flex-grow object-cover cursor-pointer"
                src={`https://image.tmdb.org/t/p/original${serie.poster_path}`}
                loading="lazy"
                alt={serie.name}
              />
            </a>
            <div className="flex flex-col">
              <a
                href={`/peliculas/${serie.id}`}
                className="text-white text-lg md:text-base font-medium cursor-pointer hover:underline"
              >
                {serie.name}
              </a>
              <span className="text-gray-300 text-base md:text-sm">
                Puntuación: {formatRating(serie.vote_average)} (
                {formatVotes(serie.vote_count)})
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
};

export default SerieList;
