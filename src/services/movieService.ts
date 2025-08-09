import axios from "axios";
import type { Movie } from "../types/movie";

const myKey = import.meta.env.VITE_TMDB_TOKEN;
// console.log(myKey);

interface MovieHttpResponse {
  results: Movie[];
  total_pages: number;
}
export async function fetchMovies(
  query: string,
  page: number
): Promise<MovieHttpResponse> {
  const url = "https://api.themoviedb.org/3/search/movie";
  const res = await axios.get<MovieHttpResponse>(url, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return res.data;
}

export const imgURL = "https://image.tmdb.org/t/p/w500";
