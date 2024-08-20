document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const signInLink = document.getElementById("nav-signin");
  const signUpLink = document.getElementById("nav-signup");
  const signOutLink = document.getElementById("nav-signout");
  const usernameDisplay = document.getElementById("nav-username");
  const userNav = document.getElementById("nav-user");

  if (currentUser) {
    // Show Sign Out link and username
    if (signInLink) signInLink.style.display = "none";
    if (signUpLink) signUpLink.style.display = "none";
    if (signOutLink) signOutLink.style.display = "block";
    if (userNav) userNav.style.display = "inline-block"; // Ensure the user nav item is visible

    // Extract first name and display it
    const firstName = currentUser.username.split(" ")[0];
    if (usernameDisplay) {
      usernameDisplay.textContent = `${firstName}`;
    }

    // Add Sign Out event listener
    signOutLink.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      alert("Signed out successfully!");
      window.location.href = "index.html";
    });
  } else {
    // Show Sign In and Sign Up links
    if (signInLink) signInLink.style.display = "block";
    if (signUpLink) signUpLink.style.display = "block";
    if (signOutLink) signOutLink.style.display = "none";
    if (userNav) userNav.style.display = "none"; // Hide user nav item if not logged in
    if (usernameDisplay) {
      usernameDisplay.textContent = "";
    }
  }
});
