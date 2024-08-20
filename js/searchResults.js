const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
const searchMoviesUrl =
  "https://api.themoviedb.org/3/search/movie?api_key=" +
  apiKey +
  "&language=en-US&query=";

let currentPage = 1;
let totalPages = 1;
let query = "";

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  query = urlParams.get("query");
  if (query) {
    fetchMovies(query, currentPage);
  }
});

async function fetchMovies(query, page) {
  try {
    const response = await fetch(
      `${searchMoviesUrl}${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    totalPages = data.total_pages;
    displayMovies(data.results);
    setupPagination();
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

function displayMovies(movies) {
  const container = document.getElementById("searchResultsContainer");
  if (movies.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }
  let content = "";
  for (const movie of movies) {
    content += `
      <div class="card">
        <a href="moviePage.html?movieId=${movie.id}" class="card-link text-decoration-none">
          <div class="row g-0 d-flex align-items-center">
            <div class="col-3">
              <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.original_title}">
            </div>
            <div class="col-8">
              <div class="card-body">
                <h3 class="card-title">${movie.original_title}</h3>
                <p class="card-text">${movie.overview}</p>
              </div>
            </div>
          </div>
        </a>
      </div>
    `;
  }
  container.innerHTML = content;
}

function setupPagination() {
  const paginationContainer = document.getElementById("paginationContainer");
  let paginationHtml = "";

  if (totalPages > 1) {
    paginationHtml += `
      <button id="prevButton" class="pagination-button" ${
        currentPage === 1 ? "disabled" : ""
      }>Previous</button>
      <span>Page ${currentPage} of ${totalPages}</span>
      <button id="nextButton" class="pagination-button" ${
        currentPage === totalPages ? "disabled" : ""
      }>Next</button>
    `;
  }

  paginationContainer.innerHTML = paginationHtml;

  // Add event listeners to buttons
  document.getElementById("prevButton")?.addEventListener("click", () => {
    if (currentPage > 1) {
      changePage(currentPage - 1);
    }
  });

  document.getElementById("nextButton")?.addEventListener("click", () => {
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  });
}

function changePage(page) {
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  fetchMovies(query, currentPage);
}
