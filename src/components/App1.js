import NavBar from "./NavBar";
import { Main } from "./Main";
import { useEffect, useState } from "react";
import axios from "axios";

import Search from "./Search";
import NumResults from "./NumResults";
import Box from "./Box";
import {
  MovieList,
  MovieDetails,
  WatchedMovieList,
  WatchedSummery,
} from "./Main";

export const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const api_key = "8c44a585";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("fast");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectMovie(id) {
    setSelectedId((currentId) => (currentId === id ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  // send movie data to the backend
  function sendWatchedMovie(movie) {
    axios
      .post("https://moviexpress.vercel.app/api/movies", { movie })
      .then((res) => console.log("Movie data sent successfully:", res.data))
      .catch((error) => {
        console.log("Error sending movie data: ", error);
      });
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    sendWatchedMovie(movie);
  }

  function handleDeleteWatched(id) {
    axios
      .delete(`https://moviexpress.vercel.app/api/movies/${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.error("Error deleting movie:", err);
      });
  }

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMovies() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?&apikey=${api_key}&s="${query}"`,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found.");
        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    handleCloseMovie();
    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    axios
      .get("https://moviexpress.vercel.app/api/all-movies")
      .then((res) => {
        setWatched(res.data);
      })
      .catch((error) => {
        console.log("Error retrieving watched movies: ", error);
      });
  }, [watched]);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main movies={movies}>
        <Box movies={movies}>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              api_key={api_key}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummery watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
                onSelectMovie={handleSelectMovie}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

export function Loader() {
  return <p className="loader">Loading</p>;
}

function ErrorMessage({ message }) {
  return <p className="error">⛔ {message}</p>;
}
