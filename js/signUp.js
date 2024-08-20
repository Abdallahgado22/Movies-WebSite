document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("signUpForm");

  if (signUpForm) {
    signUpForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("passwordConfirm").value;

      if (password !== passwordConfirm) {
        alert("Passwords do not match.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userExists = users.some((u) => u.email === email);

      if (userExists) {
        alert("User already exists.");
      } else {
        users.push({ username, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Sign up successful!");
        window.location.href = "signIn.html";
      }
    });
  }
});
