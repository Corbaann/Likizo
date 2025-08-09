const form = document.getElementById("loginForm");
const messageDiv = document.getElementById("message");

  
// Event listener for form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get input values
  const firstName = document.getElementById("firstName").value.trim();
  const surname = document.getElementById("surname").value.trim();
  const username = document.getElementById("usernamer").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Reset any previous messages
  messageDiv.textContent = "";

  // Basic validation
  if (!firstName || !surname || !username || !email || !password) {
    messageDiv.textContent = "Please fill out all fields.";
    messageDiv.className = "error";
    return;
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    messageDiv.textContent = "Please enter a valid email address.";
    messageDiv.className = "error";
    return;
  }

  // Password validation (e.g., at least 8 characters)
  if (password.length < 8) {
    messageDiv.textContent = "Password must be at least 8 characters long.";
    messageDiv.className = "error";
    return;
  }

  // If all validations pass, show success message
  messageDiv.textContent = "Enrollment successful!";
  messageDiv.className = "success";

  // Clear the form after successful enrollment
  form.reset();
});
    