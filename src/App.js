import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieCard from "./components/MovieCard";
import YouTube from "react-youtube";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedMovie, setSelectedMovie] = useState({});
  const [playTrailer, setPlayTrailer] = useState(false);

  const API_URL = "https://api.themoviedb.org/3";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/w1280/";

  const fetchMovie = async (searchKey) => {
    const searchType = searchKey ? "search" : "discover";

    const {
      data: { results },
    } = await axios.get(`${API_URL}/${searchType}/movie`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_APP_API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    await selectMovie(results[0]);
  };

  const fetchMovieTrailer = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: process.env.REACT_APP_MOVIE_APP_API_KEY,
        append_to_response: "videos",
      },
    });
    return data;
  };

  const selectMovie = async (movie) => {
    setPlayTrailer(false);
    const data = await fetchMovieTrailer(movie.id);
    // console.log("this is trailer data: ", data);
    setSelectedMovie(data);
  };

  useEffect(() => {
    fetchMovie();
  }, []);

  const renderMovies = () =>
    movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} selectMovie={selectMovie} />
    ));

  const search = (e) => {
    e.preventDefault();
    fetchMovie(searchKey);
  };

  const renderTrailer = () => {
    const trailer = selectedMovie.videos.results.find(
      (vid) => vid.name === "Official Trailer"
    );
    const key = trailer ? trailer.key : selectedMovie.videos.results[0].key;
    return (
      <YouTube
        videoId={key}
        className="youtube-container"
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: true,
            controls: 0,
          },
        }}
      />
    );
  };

  return (
    <div>
      <header className="max-center">
        <h1>Movie Trailer App</h1>
        <form onSubmit={search}>
          <input
            className="search-box"
            type="text"
            placeholder="Search Movies.."
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
          />
          <button className="search-btn" type="submit">
            Search
          </button>
        </form>
      </header>

      <div
        className="hero"
        style={{
          backgroundImage: `url('${IMAGE_PATH}${selectedMovie.backdrop_path}')`,
        }}
      >
        {playTrailer ? (
          <button
            className="btn close-btn"
            onClick={() => {
              setPlayTrailer(false);
            }}
          >
            Close
          </button>
        ) : null}

        {selectedMovie.videos && playTrailer ? renderTrailer() : null}

        <div className="hero-content max-center">
          <button
            className="btn play-btn"
            onClick={() => {
              setPlayTrailer(true);
            }}
          >
          <span className="play"></span>
            Play Trailer
          </button>
          <h1>{selectedMovie.title}</h1>
          {selectedMovie.overview ? <p>{selectedMovie.overview}</p> : null}
        </div>
      </div>
      <div className="container max-center">{renderMovies()}</div>

      <footer className="max-center">
      <span class="ml-3 text-xl">Dhruv Mishra</span>
      <p class="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
          © 2022 https://github.com/dhruv35m —
          <a
          href="https://github.com/dhruv35m"
          class="text-gray-600 ml-1"
          rel="noopener noreferrer"
          target="_blank"
          >
          @dhruv35m
          </a>
          </p>
      </footer>
        
    </div>
  );
};

export default App;
