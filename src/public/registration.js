const registrationForm = document.getElementById('registration-form');
const registerButton = document.getElementById('registerButton');

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (response.status === 201) {
    alert('Registration successful! You can now login.');
    window.location.href = '/login';
  } else {
    alert('Registration failed. Please try again.');
  }
});