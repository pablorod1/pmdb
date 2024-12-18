import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import {
  PROVIDERS,
  discoverMoviesByProvider,
  type Movie,
} from "@lib/api/movies";
import type { Provider } from "@lib/api/media";
import Loader from "@components/UI/Loader";
import SliderMediaCard from "@components/UI/SliderMediaCard";
import ProvidersDropdown from "@components/UI/ProvidersDropdown";

const ProviderMoviesGlide: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [provider, setProvider] = React.useState<Provider>(
    PROVIDERS[0] as Provider
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  const handleProviderChange = async (newProvider: Provider) => {
    setProvider(newProvider);
    setLoading(true);
    try {
      const newMovies = await discoverMoviesByProvider(
        1,
        newProvider.provider_id.toString()
      );
      setMovies(newMovies.movies);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const newMovies = await discoverMoviesByProvider(
          1,
          provider.provider_id.toString()
        );
        setMovies(newMovies.movies);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  React.useEffect(() => {
    const initializeGlide = () => {
      if (!loading && movies.length > 0) {
        if (glideRef.current) {
          glideRef.current.destroy();
        }

        const glideInstance = new Glide.default(".provider-movies-glide", {
          type: "carousel",
          startAt: 0,
          focusAt: 0,
          perView: 10,
          gap: 30,
          breakpoints: {
            2000: {
              perView: 7,
            },
            1600: {
              perView: 6,
            },
            1200: {
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

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [loading, movies]);

  // if (loading)
  //   return (
  //     <div className="w-full !h-[300px] md:!h-[500px] flex flex-col justify-center items-center gap-4 my-12">
  //       <Loader />
  //     </div>
  //   );
  if (movies.length === 0 && !loading) {
    return (
      <div className="bg-gray-200 mb-8 py-2 px-4 w-full">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col ps-6 ">
      <div className="flex items-center gap-4 ">
        <h1 className="flex text-white font-bold text-3xl">
          Top 20 películas de {provider.provider_name}
        </h1>
        <ProvidersDropdown
          buttonId="providerMoviesDropdownButton"
          dropdownId="providerMoviesDropdown"
          provider={provider}
          handleProviderChange={handleProviderChange}
        />
      </div>
      {loading && (
        <div className="w-full  flex flex-col justify-center items-center gap-4 my-12">
          <Loader />
        </div>
      )}
      {!loading && (
        <div className="provider-movies-glide relative py-12">
          <div className="glide__track mx-12" data-glide-el="track">
            <ul className="glide__slides">
              {movies.map((movie: Movie, index: number) => (
                <li key={index} className="glide__slide h-full">
                  <SliderMediaCard item={movie} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderMoviesGlide;
