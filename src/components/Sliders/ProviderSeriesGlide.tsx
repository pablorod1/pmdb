import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import {
  discoverSeriesByProvider,
  PROVIDERS,
  type Provider,
  type Serie,
} from "@lib/api/series";
import { formatDate, formatVoteAverage } from "src/common";
import { ProgressSpinner } from "@components/UI/ProgressSpinner";
import Loader from "@components/UI/Loader";
import { initFlowbite } from "flowbite";

const ProviderSeriesGlide: React.FC = () => {
  const [series, setSeries] = React.useState<Serie[]>([]);
  const [provider, setProvider] = React.useState<Provider>(PROVIDERS[0]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  const handleProviderChange = async (newProvider: Provider) => {
    setProvider(newProvider);
    setLoading(true);
    try {
      const series = await discoverSeriesByProvider(
        1,
        newProvider.provider_id.toString()
      );
      setSeries(series.series);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching series:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchSeries = async () => {
      try {
        const series = await discoverSeriesByProvider(
          1,
          provider.provider_id.toString()
        );
        setSeries(series.series);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching series:", error);
        setLoading(false);
      }
    };

    fetchSeries();
  }, []);

  React.useEffect(() => {
    const initializeGlide = () => {
      if (!loading && series.length > 0) {
        if (glideRef.current) {
          glideRef.current.destroy();
        }

        const glideInstance = new Glide.default(".provider-series-glide", {
          type: "carousel",
          startAt: 0,
          focusAt: 0,
          perView: 10,
          gap: 30,
          breakpoints: {
            1600: {
              perView: 5,
            },
            1024: {
              perView: 4,
            },
            768: {
              perView: 3,
            },
            600: {
              perView: 2,
            },
          },
        });

        requestAnimationFrame(() => {
          glideInstance.mount();
          glideRef.current = glideInstance;
        });
      }
    };

    initializeGlide();
    initFlowbite();

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [loading, series]);

  if (loading)
    return (
      <div className="w-full h-auto flex flex-col justify-center items-center gap-4 my-12">
        <Loader />
      </div>
    );
  if (series.length === 0) {
    return (
      <div className="bg-gray-200 mb-8 py-2 px-4 w-full">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col ps-6 ">
      <div className="flex items-center gap-4">
        <h1 className="flex items-center text-white font-bold text-3xl">
          Top series en {provider.provider_name}
        </h1>

        <button
          id="providerSeriesDropdownButton"
          data-dropdown-toggle="providerSeriesDropdown"
          className="text-white bg-[var(--background-color)]  focus:outline-none  font-medium rounded-lg text-sm text-center inline-flex items-center capitalize"
          type="button"
        >
          <img
            className="size-10 rounded-lg"
            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          />
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
          id="providerSeriesDropdown"
          className="z-10 hidden max-w-52 w-full bg-[var(--background-color)] shadow-[0px_0px_4px_rgba(203,196,0,14)] divide-y divide-gray-100 rounded-lg"
        >
          <ul
            className="py-2 text-sm text-white"
            aria-labelledby="providerSeriesDropdownButton"
          >
            {PROVIDERS.map((provider: Provider, index: number) => (
              <li key={index}>
                <button
                  onClick={() => handleProviderChange(provider)}
                  type="button"
                  className="flex items-center gap-2 w-full text-left px-6 py-2 hover:bg-[--primary-color] hover:text-[var(--background-color)] transition-colors duration-200 ease-in-out"
                >
                  <img
                    className="size-6 rounded-md"
                    src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                  />
                  <span>{provider.provider_name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="provider-series-glide relative py-12">
        <div className="glide__track mx-12" data-glide-el="track">
          <ul className="glide__slides">
            {series.map((serie: Serie, index: number) => (
              <li key={index} className="glide__slide h-full">
                <a
                  href={`/series/${serie.id}`}
                  no-opener="true"
                  no-referer="true"
                  data-id={serie.id}
                  className="relative flex flex-col items-start justify-center gap-2"
                >
                  <div className="movie-img-container relative flex items-center justify-center rounded-xl overflow-hidden cursor-pointer ">
                    <img
                      className="w-full"
                      src={`https://image.tmdb.org/t/p/original${serie.poster_path}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-start ">
                      <h2 className="text-white text-sm font-light">
                        {serie.name}
                      </h2>
                      <p className="text-gray-300 text-sm font-light">
                        {formatDate(serie.first_air_date)}
                      </p>
                    </div>
                    <ProgressSpinner
                      percentage={formatVoteAverage(serie.vote_average)}
                      size={40}
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProviderSeriesGlide;
