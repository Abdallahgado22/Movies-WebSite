document.addEventListener("DOMContentLoaded", () => {
  const currentUser = localStorage.getItem("currentUser");
  if (!currentUser) {
    alert("You need to sign in to view your watchlist.");
    window.location.href = "signin.html";
    return;
  }

  let userWatchlist =
    JSON.parse(localStorage.getItem(`watchlist_${currentUser}`)) || [];

  const displayWatchlist = () => {
    const watchlistContainer = document.getElementById("watchlist");
    if (userWatchlist.length === 0) {
      watchlistContainer.innerHTML = "<p>Your watchlist is empty.</p>";
      return;
    }

    watchlistContainer.innerHTML = `
      <div class="row margin">
        ${userWatchlist
          .map(
            (item) => `
          <div class="col-md-4 mb-4">
            <div class="card h-100">
              <img src="https://image.tmdb.org/t/p/w500/${
                item.poster_path
              }" class="card-img-top" alt="${item.title || item.name}">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.title || item.name}</h5>
                <p class="card-text flex-grow-1">${item.overview}</p>
                <p class="card-text"><strong>Release Date:</strong> ${
                  item.release_date || item.first_air_date
                }</p>
                <p class="card-text"><strong>Average Rating:</strong> ${
                  item.vote_average
                }</p>
                <div class="mt-auto">
                  <a href="moviePage.html?movieId=${
                    item.id
                  }" class="btn btn-primary me-2">View Details</a>
                  <button class="btn btn-danger" data-id="${
                    item.id
                  }">Remove</button>
                </div>
              </div>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Attach the event listener to the remove buttons
    document.querySelectorAll(".btn-danger").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemId = parseInt(event.target.getAttribute("data-id"), 10);
        removeFromWatchlist(itemId);
      });
    });
  };

  const removeFromWatchlist = (itemId) => {
    userWatchlist = userWatchlist.filter((item) => item.id !== itemId);
    localStorage.setItem(
      `watchlist_${currentUser}`,
      JSON.stringify(userWatchlist)
    );
    displayWatchlist();
  };

  displayWatchlist();
});
