import type { Movie } from "@lib/api/movies";
import type { Serie } from "@lib/api/series";
import React from "react";
import { formatDate, formatVoteAverage } from "src/common";
import { ProgressSpinner } from "./ProgressSpinner";

interface Props {
  item: Movie | Serie;
}

const SliderMediaCard: React.FC<Props> = (props) => {
  const { item } = props;
  return (
    <a
      href={
        "title" in item
          ? `/peliculas/${item.id}`
          : "name" in item
          ? `/series/${item.id}`
          : ""
      }
      no-opener="true"
      no-referer="true"
      data-id={item.id}
      className="relative w-full flex flex-col items-start justify-center gap-2"
    >
      <div className="movie-img-container h-full w-full overflow-hidden relative flex items-center justify-center rounded-xl  cursor-pointer ">
        <img
          className=" h-full object-cover"
          src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
          loading="lazy"
        />
      </div>
      {/* <div className="flex justify-between items-center w-full">
        <div className="flex flex-col items-start ">
          <h2 className="text-white text-sm font-light">
            {"title" in item ? item.title : "name" in item ? item.name : null}
          </h2>
          <p className="text-gray-300 text-sm font-light">
            {"release_date" in item
              ? formatDate(item.release_date)
              : "first_air_date" in item
              ? formatDate(item.first_air_date)
              : null}
          </p>
        </div>
        <ProgressSpinner
          percentage={formatVoteAverage(item.vote_average)}
          size={40}
        />
      </div> */}
    </a>
  );
};

export default SliderMediaCard;
