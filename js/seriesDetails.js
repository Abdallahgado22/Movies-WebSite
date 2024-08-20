document.addEventListener("DOMContentLoaded", () => {
  const seriesId = new URLSearchParams(window.location.search).get("seriesId");
  const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
  const apiUrl = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&language=en-US`;
  const videoApiUrl = `https://api.themoviedb.org/3/tv/${seriesId}/videos?api_key=${apiKey}&language=en-US`;
  const similarSeriesApiUrl = `https://api.themoviedb.org/3/tv/${seriesId}/similar?api_key=${apiKey}&language=en-US`;
  const castAndCrewApiUrl = `https://api.themoviedb.org/3/tv/${seriesId}/credits?api_key=${apiKey}&language=en-US`;

  const fetchSeriesDetails = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching series details:", error);
      return null;
    }
  };

  const fetchSeriesTrailer = async () => {
    try {
      const response = await fetch(videoApiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
    } catch (error) {
      console.error("Error fetching series trailer:", error);
      return null;
    }
  };

  const fetchSimilarSeries = async () => {
    try {
      const response = await fetch(similarSeriesApiUrl);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching similar series:", error);
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

  const displaySeriesDetails = async () => {
    const series = await fetchSeriesDetails();
    if (!series) return;

    const trailerUrl = await fetchSeriesTrailer();
    const similarSeries = await fetchSimilarSeries();
    const castAndCrew = await fetchCastAndCrew();

    document.getElementById("seriesDetails").innerHTML = `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w500/${
          series.poster_path
        }" class="card-img-top" alt="${series.name}">
        <div class="card-body">
          <h5 class="card-title">${series.name}</h5>
          <p class="card-text">${series.overview}</p>
          <p class="card-text"><strong>First Air Date:</strong> ${
            series.first_air_date
          }</p>
          <p class="card-text"><strong>Average Rating:</strong> ${
            series.vote_average
          }</p>
          <p class="card-text"><strong>Genres:</strong> ${series.genres
            .map((genre) => genre.name)
            .join(", ")}</p>
          ${
            trailerUrl
              ? `<div class="trailer">
                  <h6><i class="fas fa-video icon"></i>Trailer:</h6>
                  <iframe src="${trailerUrl}" frameborder="0" allowfullscreen></iframe>
                </div>`
              : `<p><i class="fas fa-video icon"></i>No trailer available</p>`
          }
          <a href="#" id="addToWatchlist" class="btn btn-primary mb-3"><i class="fas fa-bookmark icon"></i>Add to Watchlist</a>
          <a href="index.html" id="backToSeries" class="btn btn-secondary"><i class="fas fa-arrow-left icon"></i>Back to Series</a>
        </div>
      </div>
      <section class="cast-crew">
        <h3><i class="fas fa-users icon"></i> Cast and Crew</h3>
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
            </div>
          `
            )
            .join("")}
        </div>
      </section>
      <section class="similar-series">
        <h3><i class="fas fa-th-large icon"></i>Similar Series</h3>
        <div class="row">
          ${similarSeries.results
            .map(
              (series) => `
            <div class="series-card col-md-3">
              <a href="seriesPage.html?seriesId=${series.id}" class="series-card-link text-decoration-none">
                <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}" class="img-fluid">
                <div class="series-card-body">
                  <h5 class="series-card-title">${series.name}</h5>
                  <p class="series-card-date"><i class="fas fa-calendar-alt icon"></i>${series.first_air_date}</p>
                </div>
              </a>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;

    // Handle Add to Watchlist Button
    document.getElementById("addToWatchlist").addEventListener("click", () => {
      const currentUser = localStorage.getItem("currentUser");
      if (!currentUser) {
        alert("You need to sign in to add to watchlist.");
        return;
      }

      const seriesData = {
        id: series.id,
        name: series.name,
        poster_path: series.poster_path,
        overview: series.overview,
        first_air_date: series.first_air_date,
        vote_average: series.vote_average,
      };

      addToWatchlist(currentUser, seriesData);
    });

    document
      .getElementById("backToSeries")
      .addEventListener("click", (event) => {
        event.preventDefault();
        window.history.back();
      });
  };

  const addToWatchlist = (user, series) => {
    let userWatchlist =
      JSON.parse(localStorage.getItem(`watchlist_${user}`)) || [];
    if (!userWatchlist.some((item) => item.id === series.id)) {
      userWatchlist.push(series);
      localStorage.setItem(`watchlist_${user}`, JSON.stringify(userWatchlist));
      alert(`${series.name} has been added to your watchlist!`);
    } else {
      alert(`${series.name} is already in your watchlist.`);
    }
  };

  displaySeriesDetails();
});
