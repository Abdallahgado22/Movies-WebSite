document.addEventListener("DOMContentLoaded", () => {
  const movieId = new URLSearchParams(window.location.search).get("movieId");
  const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
  const apiUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
  const videoApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;
  const similarMoviesApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apiKey}&language=en-US`;
  const castAndCrewApiUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=en-US`;

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  const fetchMovieTrailer = async () => {
    try {
      const response = await fetch(videoApiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
      console.error("Error fetching movie trailer:", error);
      return null;
    }
  };

  const fetchSimilarMovies = async () => {
    try {
      const response = await fetch(similarMoviesApiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching similar movies:", error);
      return { results: [] };
    }
  };

  const fetchCastAndCrew = async () => {
    try {
      const response = await fetch(castAndCrewApiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching cast and crew:", error);
      return { cast: [] };
    }
  };

  const displayMovieDetails = async () => {
    const movie = await fetchMovieDetails();
    if (!movie) return;

    const trailerUrl = await fetchMovieTrailer();
    const similarMovies = await fetchSimilarMovies();
    const castAndCrew = await fetchCastAndCrew();

    document.getElementById("movieDetails").innerHTML = `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500/${
          movie.poster_path
        }" class="card-img-top" alt="${movie.original_title}">
        <div class="card-body">
          <h5 class="card-title">${movie.original_title}</h5>
          <p class="card-text">${movie.overview}</p>
          <p class="card-text"><strong>Release Date:</strong> ${
            movie.release_date
          }</p>
          <p class="card-text"><strong>Average Rating:</strong> ${
            movie.vote_average
          }</p>
          <p class="card-text"><strong>Genres:</strong> ${movie.genres
            .map((genre) => genre.name)
            .join(", ")}</p>
          ${
            trailerUrl
              ? `
            <div class="trailer">
              <h6>Trailer:</h6>
              <iframe src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
            </div>`
              : `
            <p>No trailer available</p>`
          }
          <a href="#" id="addToWatchlist" class="btn btn-primary mb-3">Add to Watchlist</a>
          <a href="index.html" id="backToMovies" class="btn btn-secondary">Back to Movies</a>
        </div>
      </div>
      <section class="cast-crew">
        <h3>Cast and Crew</h3>
        <div class="row">
          ${castAndCrew.cast
            .slice(0, 6)
            .map(
              (person) => `
            <div class="crew-card col-md-2">
              <img src="https://image.tmdb.org/t/p/w500/${
                person.profile_path
              }" alt="${person.name}" class="img-fluid">
              <div class="card-body">
                <h5 class="card-title">${person.name}</h5>
                <p class="card-text">${
                  person.character || "Role not specified"
                }</p>
              </div>
            </div>`
            )
            .join("")}
        </div>
      </section>
      <section class="similar-movies">
        <h3>Similar Movies</h3>
        <div class="row">
          ${similarMovies.results
            .map(
              (movie) => `
            <div class="movie-card col-md-3">
              <a href="moviePage.html?movieId=${movie.id}" class="movie-card-link text-decoration-none">
                <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title}" class="img-fluid">
                <div class="movie-card-body">
                  <h5 class="movie-card-title">${movie.title}</h5>
                  <p class="movie-card-date">${movie.release_date}</p>
                </div>
              </a>
            </div>`
            )
            .join("")}
        </div>
      </section>
    `;

    document.getElementById("addToWatchlist").addEventListener("click", () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        alert("You need to sign in to add to watchlist.");
        return;
      }

      const movieData = {
        id: movie.id,
        title: movie.original_title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      };

      addToWatchlist(currentUser, movieData);
    });

    document
      .getElementById("backToMovies")
      .addEventListener("click", (event) => {
        event.preventDefault();
        window.history.back();
      });
  };

  const addToWatchlist = (user, movie) => {
    let userWatchlist =
      JSON.parse(localStorage.getItem(`watchlist_${user}`)) || [];
    if (!userWatchlist.some((item) => item.id === movie.id)) {
      userWatchlist.push(movie);
      localStorage.setItem(`watchlist_${user}`, JSON.stringify(userWatchlist));
      alert(`${movie.title} has been added to your watchlist!`);
    } else {
      alert(`${movie.title} is already in your watchlist.`);
    }
  };

  displayMovieDetails();
});
