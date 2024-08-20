const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=`;

// Function to fetch movie data with pagination
const fetchMovies = async (page = 1) => {
  try {
    const response = await fetch(apiUrl + page);
    const data = await response.json();
    return data.results; // Return the movie results
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to display movies in a grid layout
const displayMovies = async (page = 1) => {
  const movieList = await fetchMovies(page);
  let container = "";

  for (let i = 0; i < movieList.length; i++) {
    const movie = movieList[i];
    container += `
        <div class="col-md-3 mb-4">
            <div class="card">
                <a href="moviePage.html?movieId=${movie.id}" class="text-decoration-none">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.original_title}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.original_title}</h5>
                       
                    </div>
                </a>
            </div>
        </div>
        `;
  }
  document.getElementById("topRatedMovies").innerHTML = container;
  document.getElementById("pageNumber").textContent = `Page ${page}`;
};

// Pagination controls
const setupPagination = (currentPage) => {
  const prevButton = document.getElementById("prevTopRatedPage");
  const nextButton = document.getElementById("nextTopRatedPage");

  prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      await displayMovies(currentPage - 1);
      currentPage--;
      document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
    }
  });

  nextButton.addEventListener("click", async () => {
    await displayMovies(currentPage + 1);
    currentPage++;
    document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
  });
};

// Initial setup
const init = async () => {
  let currentPage = 1;
  await displayMovies(currentPage);
  setupPagination(currentPage);
};

init();
