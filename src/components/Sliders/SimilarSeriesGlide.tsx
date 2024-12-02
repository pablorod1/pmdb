import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import {
  allProviders,
  discoverSeriesByProvider,
  type Provider,
  type Serie,
} from "@lib/api/series";
import { formatDate, formatVoteAverage } from "src/common";
import { ProgressSpinner } from "@components/UI/ProgressSpinner";
import Loader from "@components/UI/Loader";
import { initFlowbite } from "flowbite";

interface Props {
  id: number;
}

const SimilarSeriesGlide: React.FC<Props> = (props) => {
  const { id } = props;
  const [series, setSeries] = React.useState<Serie[]>([]);
  const [provider, setProvider] = React.useState<Provider>({} as Provider);
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  React.useEffect(() => {
    const fetchSeries = async () => {
      try {
        const series = await discoverSeriesByProvider(1, id.toString());
        const newProvider: Provider =
          allProviders.find((p: Provider) => p.provider_id === id) ||
          ({} as Provider);
        setProvider(newProvider);
        setSeries(series.series);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
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

        const glideInstance = new Glide.default(".similar-series-glide", {
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
    <div className="flex flex-col ps-4 ">
      <div className="flex items-center gap-4">
        <h1 className=" text-white font-bold text-3xl">
          Más de {provider.provider_name}
        </h1>
        <img
          className="size-12 rounded-md"
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt=""
        />
      </div>
      <div className="similar-series-glide relative py-12">
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

export default SimilarSeriesGlide;
