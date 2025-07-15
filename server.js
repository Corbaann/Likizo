//server.js
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
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
   

     
    });
  
//get access token
    const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const getToken = async () => {
    const auth = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                authorization: `Basic ${auth}`,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting token:', error.response?.data || error.message);
    }
};

// Initiate payment
const initiatePayment = async (phoneNumber, amount) => {
  const token = await getToken();
  const url = ' https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest ';

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${process.env.BUSINESS_SHORTCODE}${process.env.PASSKEY}${timestamp}`).toString('base64');

  const data = {
      BusinessShortCode: process.env.BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.BUSINESS_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: 'https://yourdomain.com/callback ',
      AccountReference: 'TestCompany',
      TransactionDesc: 'Payment for Order #123'
  };

  try {
      const response = await axios.post(url, data, {
          headers: {
              authorization: `Bearer ${token}`
          }
      });
      console.log(response.data);
  } catch (error) {
      console.error('Payment initiation failed:', error.response?.data || error.message);
  }
};


// Callback endpoint for M-Pesa
app.post('/callback', (req, res) => {
  const callbackData = req.body;
  console.log('Callback received:', callbackData);

  // Log or save the result to your DB
  if (callbackData.Body.stkCallback.ResultCode === 0) {
      console.log("Payment successful!");
      // Update order status here
  } else {
      console.log("Payment failed:", callbackData.Body.stkCallback.ResultDesc);
  }

  res.status(200).send("OK");
});

