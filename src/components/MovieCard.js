import React from "react";

const MovieCard = ({ movie, selectMovie }) => {
  const IMG_PATH = "https://image.tmdb.org/t/p/w500/";

  return (
    <div className="movie-card" onClick={() => selectMovie(movie)}>
      {movie.poster_path ? (
        <img
          className="movie-cover"
          src={`${IMG_PATH}${movie.poster_path}`}
          alt=""
        />
      ) : (
        <div className="movie-placeholder">No Poster Found!</div>
      )}
      <h3 className="movie-title">{movie.title}</h3>
    </div>
  );
};

export default MovieCard;
