import React from "react";
import * as Glide from "@glidejs/glide";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Loader from "@components/UI/Loader";
import { getMoviesVideos, type Movie } from "@lib/api/movies";

const TeasersGlide: React.FC = () => {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [title, setTitle] = React.useState("Películas en Cartelera");
  const [loading, setLoading] = React.useState(true);
  const glideRef = React.useRef<Glide | null>(null);

  React.useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await getMoviesVideos();
        console.log("movies", movies);
        setMovies(movies);
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

        const glideInstance = new Glide.default(".teasers-glide", {
          type: "slider",
          perView: 3,
          focusAt: 0,
          startAt: 0,
          bound: true,
          gap: 15,
          breakpoints: {
            1024: { perView: 2 },
            768: { perView: 1 },
          },
        });

        requestAnimationFrame(() => {
          glideInstance.mount();
          glideRef.current = glideInstance;
        });
      }
    };

    initializeGlide();

    const teasersContainer = document.getElementById("teasers-container");
    const teaserPlayerDialog = document.getElementById("video-modal");
    const closeTeaserPlayerDialog = document.getElementById("close-modal");

    if (teasersContainer && teasersContainer instanceof HTMLDivElement) {
      teasersContainer.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movies[0].backdrop_path})`;

      const teaserItems = teasersContainer.querySelectorAll('[id^="movie-"]');
      teaserItems.forEach((teaser) => {
        teaser.addEventListener("mouseover", () => {
          let teaserId = teaser.getAttribute("data-id");
          // Check if teaserId === nowPlayingMovies[teaserId]
          if (teaserId) {
            let movieIndex = parseInt(teaserId);
            teasersContainer.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movies[movieIndex].backdrop_path})`;
          }
        });
      });

      const playIcons = teasersContainer.querySelectorAll(".play-icon");
      if (playIcons) {
        playIcons.forEach((playIcon) => {
          playIcon.addEventListener("click", () => {
            let teaserId = playIcon.closest("li")?.getAttribute("data-id");
            if (teaserId) {
              let movieIndex = parseInt(teaserId);
              let movieTrailer =
                teaserPlayerDialog?.querySelector(".movie-trailer");
              if (movieTrailer) {
                movieTrailer.textContent = movies[movieIndex].title;
              }
              if (
                teaserPlayerDialog &&
                teaserPlayerDialog instanceof HTMLDivElement
              ) {
                const iframe = teaserPlayerDialog.querySelector("iframe");
                if (iframe) {
                  iframe.setAttribute(
                    "src",
                    `https://www.youtube.com/embed/${movies[movieIndex].videos[0].key}`
                  );
                }
                const html = document.querySelector("html");
                if (html) {
                  html.style.overflow = "hidden";
                }
                teaserPlayerDialog.classList.remove("hidden");
                teaserPlayerDialog.classList.add(
                  "flex",
                  "justify-center",
                  "items-center",
                  "flex-col"
                );
              }
            }
          });
        });
      }
    }

    if (closeTeaserPlayerDialog && teaserPlayerDialog) {
      closeTeaserPlayerDialog.addEventListener("click", () => {
        const html = document.querySelector("html");
        if (html) {
          html.style.overflow = "auto";
        }
        teaserPlayerDialog.classList.add("hidden");
        teaserPlayerDialog.classList.remove(
          "flex",
          "justify-center",
          "items-center",
          "flex-col"
        );
        teaserPlayerDialog.querySelector("iframe")?.setAttribute("src", "");
      });
    }

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
    <div
      id="teasers-container"
      className="flex flex-col px-4 lg:px-24 w-full py-12 h-full bg-no-repeat bg-cover bg-center"
    >
      <h1 className="text-white font-bold text-3xl">{title}</h1>
      <div className="teasers-glide relative py-12">
        <div
          className="glide__track mx-12 !overflow-visible"
          data-glide-el="track"
        >
          <ul className="glide__slides !overflow-visible">
            {movies.map((movie: Movie, index: number) => (
              <li
                key={index}
                id={`movie-${index}`}
                data-id={index}
                slot="slides"
                className="glide__slide overflow-visible"
              >
                <div className="flex flex-col justify-center items-center gap-y-4">
                  <div className="teaser-container group relative flex justify-center items-center rounded-xl ">
                    <img
                      className="w-full brightness-90 rounded-xl group-hover:scale-[1.01] transition-transform duration-200 ease-in-out"
                      src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                      loading="lazy"
                    />
                    <span className="play-icon group-hover:scale-110 size-14 absolute cursor-pointer transition-transform duration-200 ease-in-out">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="icon icon-tabler icons-tabler-filled icon-tabler-player-play"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center">
                    <h2 className="text-white text-xl font-medium">
                      {movie.title}
                    </h2>
                    {/* <p className="text-gray-300 text-sm text-center">
                      {movie.videos[0].name}
                    </p> */}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeasersGlide;
