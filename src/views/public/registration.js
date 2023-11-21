const registrationForm = document.getElementById("registration-form");
const passwordInput = document.getElementById("password");
const password2Input = document.getElementById("password2");

registrationForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = passwordInput.value;
  const password2 = password2Input.value;

  if (password === password2) {
    password2Input.setCustomValidity('');
  } else {
    password2Input.setCustomValidity('Passwords do not match');
    registrationForm.reportValidity();
    return;
  }

  const response = await fetch("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
  
 
});