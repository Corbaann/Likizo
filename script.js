// script.js
document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const studentsFilter = document.getElementById('students-filter');
    const coursesFilter = document.getElementById('courses-filter');
    const searchButton = document.getElementById('search-button');

    // Update filters dynamically based on form inputs
    searchForm.addEventListener('change', (event) => {
        const target = event.target;

        if (target.id === 'academic-year') {
            studentsFilter.textContent = `students from ${target.value}`;
        } else if (target.id === 'school') {
            studentsFilter.textContent = `students from ${target.value}`;
        } else if (target.id === 'programme') {
            studentsFilter.textContent = `students in ${target.value}`;
        } else if (target.id === 'year-of-programme') {
            studentsFilter.textContent = `students in year ${target.value}`;
        } else if (target.id === 'enrolled-on-course') {
            coursesFilter.textContent = `course ${target.value}`;
        }
    });

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
// Function to validate login form
function validateLoginForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === '' || password === '') {
        alert('Please fill in all fields.');
        return false;
    }
    return true;
}

// Handle login form submission
document.getElementById('login-form').addEventListener('submit', (event) => {
    if (!validateLoginForm()) {
        event.preventDefault(); // Prevent form submission if validation fails
    }
});
  
