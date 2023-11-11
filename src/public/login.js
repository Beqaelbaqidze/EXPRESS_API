// Retrieve the authenticated username from the session or cookie
const authenticatedUsername = localStorage.getItem('authenticatedUsername');

// Get the username element
const usernameElement = document.getElementById('username');

if (authenticatedUsername) {
  // Display the authenticated username in the "Welcome" message
  usernameElement.textContent = authenticatedUsername;
} else {
  // If the user is not authenticated, redirect to the login page
  alert('Please log in to access your profile.');
  window.location.href = '/login';
}