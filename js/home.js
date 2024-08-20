import { initializeSlider } from "./slider.js";

const apiKey = "39afdbbccf5a98c1fb814132bb49d25b";

// URLs for different movie categories
const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const topRatedMoviesUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=en-US&page=1`;
const incomingMoviesUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1`;
const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;

// Function to fetch movie data
const fetchMovies = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results; // Return the movie results
  } catch (error) {
    console.error("Error fetching movie data:", error);
    return []; // Return an empty array in case of an error
  }
};

// Function to display movies in the slider
const displayMovies = async (url, containerId) => {
  const movieList = await fetchMovies(url);
  let container = "";
  for (let i = 0; i < movieList.length; i++) {
    const movie = movieList[i];
    container += `
        <div class="card">
            <a href="moviePage.html?movieId=${movie.id}" class="card-link text-decoration-none">
                <div class="card-img-wrapper">
                    <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.original_title}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${movie.original_title}</h3>
                </div>
            </a>
        </div>
        `;
  }
  document.getElementById(containerId).innerHTML = container;

  // Initialize slider functionality after loading movies
  initializeSlider(containerId);
};

// Call the displayMovies function to load and display the movie data for all sections
displayMovies(popularMoviesUrl, "popularMovies");
displayMovies(topRatedMoviesUrl, "topRatedMovies");
displayMovies(incomingMoviesUrl, "incomingMovies");
displayMovies(trendingMoviesUrl, "trendingMovies");

// Similar logic for series
const popularSeriesUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=1`;
const topRatedSeriesUrl = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}&language=en-US&page=1`;

// Function to display series in the slider
const displaySeries = async (url, containerId) => {
  const seriesList = await fetchMovies(url); // Use fetchMovies function
  let container = "";
  for (let i = 0; i < seriesList.length; i++) {
    const series = seriesList[i];
    container += `
        <div class="card">
            <a href="seriesDetails.html?seriesId=${series.id}" class="card-link text-decoration-none">
                <div class="card-img-wrapper">
                    <img src="https://image.tmdb.org/t/p/w500/${series.poster_path}" alt="${series.name}">
                </div>
                <div class="card-content">
                    <h3 class="card-title">${series.name}</h3>
                </div>
            </a>
        </div>
        `;
  }
  document.getElementById(containerId).innerHTML = container;

  // Initialize slider functionality after loading series
  initializeSlider(containerId);
};

// Call the displaySeries function to load and display the series data
displaySeries(popularSeriesUrl, "popularSeries");
displaySeries(topRatedSeriesUrl, "topRatedSeries");
