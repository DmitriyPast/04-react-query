import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginate from "react-paginate";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export default function App() {
  // const [movies, setMovies] = useState<Movie[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  // const [totalPages, setTotalPages] = useState<number>(0);
  const [query, setQuery] = useState<string>("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    // queryFn: () => fetchMovies(query, page),
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  async function handleSubmit(query: string) {
    setQuery(query);
    setPage(1);
    try {
      // setIsError(false);
      // setIsLoading(true);
      const data = await fetchMovies(query, page);
      if (!data?.results.length) toast("No movies found for your request.");
      // setMovies(data?.results ?? []);
      // setTotalPages(data?.total_pages ?? 0);
    } catch {
      // console.log(e);
      // setIsError(true);
    }
    // setIsLoading(false);
  }

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  function handleClose() {
    setSelectedMovie(null);
    setIsModalOpen(false);
  }

  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />

      {}
      {/* {query && isLoading && !data && <Loader />} */}

      {/* {isError && <ErrorMessage />} */}

      {isSuccess && data.results.length > 0 && (
        <>
          {data.total_pages > 1 && (
            <ReactPaginate
              pageCount={data.total_pages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}

          <MovieGrid onSelect={handleSelect} movies={data.results} />
        </>
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
      <Toaster />
    </div>
  );
}
