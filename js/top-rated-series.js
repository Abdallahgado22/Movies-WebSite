const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
const apiUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=`;

// Function to fetch series data with pagination
const fetchSeries = async (page = 1) => {
  try {
    const response = await fetch(apiUrl + page);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching series data:", error);
    return [];
  }
};

// Function to display series in a grid layout
const displaySeries = async (page = 1) => {
  const seriesList = await fetchSeries(page);
  let container = "";

  for (let i = 0; i < seriesList.length; i++) {
    const series = seriesList[i];
    container += `
      <div class="col-md-3 mb-4">
          <a href="seriesDetails.html?seriesId=${series.id}" class="text-decoration-none">
              <div class="card h-100">
                  <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" class="card-img-top" alt="${series.name}">
                  <div class="card-body">
                      <h5 class="card-title">${series.name}</h5>
                  </div>
              </div>
          </a>
      </div>
      `;
  }
  document.getElementById("topRatedSeries").innerHTML = container;
};

// Function to setup pagination controls
const setupPagination = (currentPage, totalPages) => {
  const prevButton = document.getElementById("prevTopRatedSeriesPage");
  const nextButton = document.getElementById("nextTopRatedSeriesPage");

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;

  prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      await displaySeries(currentPage - 1);
      currentPage--;
      document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
    }
  });

  nextButton.addEventListener("click", async () => {
    if (currentPage < totalPages) {
      await displaySeries(currentPage + 1);
      currentPage++;
      document.getElementById("pageNumber").textContent = `Page ${currentPage}`;
      prevButton.disabled = currentPage === 1;
      nextButton.disabled = currentPage === totalPages;
    }
  });
};

// Initialize the page
const init = async () => {
  let currentPage = 1;
  const totalPages = 10; // Set this dynamically if possible
  await displaySeries(currentPage);
  setupPagination(currentPage, totalPages);
};

init();
