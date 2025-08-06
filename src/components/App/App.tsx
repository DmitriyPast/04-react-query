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

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  async function handleSubmit(query: string) {
    try {
      setIsError(false);
      setIsLoading(true);
      const data = await fetchMovies(query);
      if (!data.length) toast("No movies found for your request.");
      setMovies(data);
    } catch {
      // console.log(e);
      setIsError(true);
    }
    setIsLoading(false);
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
      <MovieGrid onSelect={handleSelect} movies={movies} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalOpen && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
      <Toaster />
    </div>
  );
}
