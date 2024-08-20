const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";
const apiUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=`;

// Reuse the `fetchSeries`, `displaySeries`, and `setupPagination` functions
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

const displaySeries = async (page = 1) => {
  const seriesList = await fetchSeries(page);
  let container = "";

  for (let i = 0; i < seriesList.length; i++) {
    const series = seriesList[i];
    container += `
        <div class="col-md-3 mb-4">
            <div class="card">
                <a href="seriesDetails.html?seriesId=${series.id}" class="text-decoration-none">
                    <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" class="card-img-top" alt="${series.name}">
                    <div class="card-body">
                        <h5 class="card-title">${series.name}</h5>
                    </div>
                </a>
            </div>
        </div>
        `;
  }
  document.getElementById("popularSeries").innerHTML = container;
};

const setupPagination = (currentPage, totalPages) => {
  const prevButton = document.getElementById("prevPopularSeriesPage");
  const nextButton = document.getElementById("nextPopularSeriesPage");

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

const init = async () => {
  let currentPage = 1;
  const totalPages = 10; // Adjust as needed or determine dynamically
  await displaySeries(currentPage);
  setupPagination(currentPage, totalPages);
};

init();
