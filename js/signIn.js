// signIn.js
document.addEventListener("DOMContentLoaded", () => {
  const signInForm = document.getElementById("signInForm");

  if (signInForm) {
    signInForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Sign in successful!");
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password.");
      }
    });
  }
});
