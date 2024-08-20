export const initializeSlider = (containerId) => {
  const slidesContainer = document.getElementById(containerId);
  if (!slidesContainer) return;

  const slides = slidesContainer.querySelectorAll(".card");
  const totalSlides = slides.length;
  let currentIndex = 0;

  function showSlide(index) {
    if (index >= totalSlides) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = totalSlides - 1;
    } else {
      currentIndex = index;
    }
    slidesContainer.style.transform = `translateX(${-currentIndex * 100}%)`;
  }

  // Show the first slide initially
  showSlide(currentIndex);

  // Navigation buttons
  const prevButton = document.getElementById(
    `prev${containerId.charAt(0).toUpperCase() + containerId.slice(1)}Slide`
  );
  const nextButton = document.getElementById(
    `next${containerId.charAt(0).toUpperCase() + containerId.slice(1)}Slide`
  );

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showSlide(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showSlide(currentIndex + 1);
    });
  }

  // Function to start automatic slide change
  const startSlideInterval = () => {
    return setInterval(() => {
      showSlide(currentIndex + 1);
    }, 4000);
  };

  // Start automatic slide change
  let slideInterval = startSlideInterval();

  // Stop automatic slide change when user hovers over the slider
  slidesContainer.addEventListener("mouseover", () => {
    clearInterval(slideInterval);
  });

  // Start automatic slide change when user stops hovering over the slider
  slidesContainer.addEventListener("mouseout", () => {
    slideInterval = startSlideInterval();
  });
};
