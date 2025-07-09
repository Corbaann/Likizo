// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const studentsFilter = document.getElementById('students-filter');
    const coursesFilter = document.getElementById('courses-filter');
    const searchButton = document.getElementById('search-button');

    // Update filters dynamically based on form inputs
    

    // Handle the search button click
    searchButton.addEventListener('click', () => {
        const formData = new FormData(searchForm);
        const query = Object.fromEntries(formData.entries());

        // Simulate a search action (you can replace this with an API call)
        console.log('Search Query:', query);

        alert(`Searching for ${studentsFilter.textContent} on ${coursesFilter.textContent}`);
    });
});
// Example: Toggle filter visibility (optional)
document.querySelectorAll('.clear-filters').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
    });
  });
  
    // Select elements
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
    
  
// Define fees for each biology unit
const unitFees = {
    Introduction: 50,
    Genetics: 75,
    Ecology: 60,
    Microbiology: 80,
  };
  
  // Select elements
  const unitSelector = document.getElementById("unitSelector");
  const feeDisplay = document.getElementById("feeDisplay");
  const bookClassBtn = document.getElementById("bookClassBtn");
  const paymentForm = document.getElementById("paymentForm");
  
  // Event listener for unit selection
  unitSelector.addEventListener("change", () => {
    const selectedUnit = unitSelector.value;
    const fee = unitFees[selectedUnit] || 0; // Default to 0 if no fee is found
    feeDisplay.textContent = `Fee for ${selectedUnit}: $${fee}`;
  });
  
  // Event listener for "Book Class" button
  bookClassBtn.addEventListener("click", () => {
    // Display the payment form
    paymentForm.style.display = "block";
  });
  
  // Event listener for "Submit Payment" button
  document.getElementById("submitPaymentBtn").addEventListener("click", () => {
    // Get payment details
    const cardNumber = document.getElementById("cardNumber").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const cvv = document.getElementById("cvv").value;
  
    // Validate payment details (basic validation)
    if (!cardNumber || !expiryDate || !cvv) {
      alert("Please fill out all payment details.");
      return;
    }
  
    // Simulate payment submission
    alert(`Payment submitted successfully!\nCard Number: ${cardNumber}\nExpiry Date: ${expiryDate}\nCVV: ${cvv}`);
  });

  