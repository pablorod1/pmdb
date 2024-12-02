import type {
  Credits,
  Provider,
  SerieDetails,
  SeriesResponse,
  Video,
} from "./series.api-model";

const API_KEY = "0a233d84fc55a74ae5753ab6a5e22375";
const SERIE_URL = "https://api.themoviedb.org/3/tv";

const getSerieCredits = async (id: number): Promise<Credits> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${id}/credits?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as Credits;
};

const getSerieVideos = async (id: number): Promise<Video[]> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${id}/videos?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

const getWhatchProviders = async (id: number): Promise<Provider> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${id}/watch/providers?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results.ES.flatrate;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as Provider;
};

export const discoverAllSeries = async (
  page: number
): Promise<SeriesResponse> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?language=es-ES&page=${page}&watch_region=ES&sort_by=popularity.desc&api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      series: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    series: [],
    totalPages: 0,
  };
};

export const getSeriesByType = async (
  type: string,
  page: number
): Promise<SeriesResponse> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${type}?api_key=${API_KEY}&language=es-ES&page=${page}&watch_region=es`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      series: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    series: [],
    totalPages: 0,
  };
};

export const getSerieById = async (id: number): Promise<SerieDetails> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${id}?api_key=${API_KEY}&language=es-ES`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const providers = await getWhatchProviders(id);
    const videos = await getSerieVideos(id);
    const credits = await getSerieCredits(id);
    return {
      ...data,
      providers,
      videos,
      credits,
    } as SerieDetails;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {} as SerieDetails;
};

export const discoverSeriesByProvider = async (
  page: number,
  provider: string
): Promise<SeriesResponse> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?language=es-ES&page=${page}&with_watch_providers=${provider}&watch_region=ES&sort_by=popularity.desc&api_key=0a233d84fc55a74ae5753ab6a5e22375`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      series: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    series: [],
    totalPages: 0,
  };
};

export const getTVProviders = async (): Promise<Provider[]> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/watch/providers/tv?language=es-ES&watch_region=ES&sort_by=display_priority.desc&api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return [];
};

export const getSimilarSeries = async (id: number): Promise<SeriesResponse> => {
  try {
    const response = await fetch(
      `${SERIE_URL}/${id}/similar?api_key=${API_KEY}&language=es-ES&watch_country=ES&page=1`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      series: data.results,
      totalPages: data.total_pages,
    };
  } catch (error) {
    console.error("Error fetching data", error);
  }

  return {
    series: [],
    totalPages: 0,
  };
};
