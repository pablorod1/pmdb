export const formatVoteAverage = (vote_average: number): number => {
  return Math.round(vote_average * 10);
};

export const formatDate = (date: string): string => {
  const fecha = new Date(date);
  const day = fecha.getDate();
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const month = months[fecha.getMonth()];
  const year = fecha.getFullYear();
  return `${day} ${month} ${year}`;
};

export const formatRating = (rating: number) => {
  return rating.toFixed(1);
};

export const formatVotes = (votes: number): string => {
  if (votes >= 1000000) {
    return `${(votes / 1000000).toFixed(1)}M`;
  } else {
    return votes.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return "";
};

export const formatRuntime = (runtime: number): string => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}min`;
};
