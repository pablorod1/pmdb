import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import { getNowPlayingMovies } from "@lib/tmdb";
import Loader from "@components/UI/Loader";

const HeaderGlide: React.FC = () => {
  const [movies, setMovies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const glideRef = React.useRef<Glide | null>(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getNowPlayingMovies(1);
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

        const glideInstance = new Glide.default(".header-glide", {
          type: "carousel",
          perView: 1,
          gap: 20,
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
    <div className="header-glide group relative pb-20">
      <div
        className="glide__track mx-12 !overflow-visible"
        data-glide-el="track"
      >
        <ul className="glide__slides !overflow-visible">
          {movies.map((item: any, index: number) => {
            return (
              <li
                key={index}
                className="glide__slide rounded-lg overflow-hidden"
              >
                <a href={`/peliculas/${item.id}`}>
                  <img
                    className="w-full max-h-[540px] h-full object-cover object-top"
                    src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                    alt=""
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="glide__bullets" data-glide-el="controls[nav]">
        {movies.map((movie, index: number) => (
          <button
            key={`button-${index}`}
            className="glide__bullet"
            data-glide-dir={`=${index}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeaderGlide;
