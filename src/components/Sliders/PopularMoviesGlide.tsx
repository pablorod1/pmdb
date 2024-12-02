import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import type { Movie } from "@lib/api/movies";
import { formatDate, formatVoteAverage } from "src/common";
import { getPopularMovies } from "@lib/tmdb";
import { ProgressSpinner } from "@components/UI/ProgressSpinner";
import Loader from "@components/UI/Loader";

const PopularMoviesGlide: React.FC = () => {
  const title = "Películas Populares";
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getPopularMovies(1);
        setMovies(movies.movies);
        setLoading(false);
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

        const glideInstance = new Glide.default(".popular-movies-glide", {
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

    return () => {
      if (glideRef.current) {
        glideRef.current.destroy();
        glideRef.current = null;
      }
    };
  }, [loading, movies]);

  if (loading)
    return (
      <div className="w-full !h-[300px] md:!h-[500px] flex flex-col justify-center items-center gap-4 my-12">
        <Loader />
      </div>
    );
  if (movies.length === 0) {
    return (
      <div className="bg-gray-200 mb-8 py-2 px-4 w-full">
        <p>No items found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col ps-4 lg:px-24">
      <div className="flex items-center gap-4 lg:gap-8">
        <h1 className="flex text-white font-bold text-3xl">{title}</h1>
      </div>
      <div className="popular-movies-glide relative py-12">
        <div className="glide__track mx-12" data-glide-el="track">
          <ul className="glide__slides">
            {movies.map((item: any, index: number) => (
              <li key={index} className="glide__slide h-full">
                <a
                  href={`/peliculas/${item.id}`}
                  no-opener="true"
                  no-referer="true"
                  data-id={item.id}
                  className="relative flex flex-col items-start justify-center gap-2"
                >
                  <div className="movie-img-container relative flex items-center justify-center rounded-xl overflow-hidden cursor-pointer ">
                    <img
                      className="w-full"
                      src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-4 w-full">
                    <div className="flex flex-col items-start ">
                      <h2 className="text-white text-sm font-light text-balance">
                        {item.title}
                      </h2>
                      <p className="text-gray-300 text-sm font-light">
                        {formatDate(item.release_date)}
                      </p>
                    </div>
                    <ProgressSpinner
                      percentage={formatVoteAverage(item.vote_average)}
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

export default PopularMoviesGlide;
