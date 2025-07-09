//server.js
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
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
   

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User registered successfully' });
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});
  