const authenticatedUsername = localStorage.getItem("authenticatedUsername");

const usernameElement = document.getElementById("username");

if (authenticatedUsername) {
  usernameElement.textContent = authenticatedUsername;
} else {
  alert("Please log in to access your profile.");
  window.location.href = "/profile";
}
