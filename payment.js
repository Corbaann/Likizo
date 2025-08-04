// Function to handle class booking
function bookClass(className) {
    // Create URL with query parameters
    const amount = 100; // Fixed amount
   const encodedClassName = encodeURIComponent(className);
    const url = `form.html?class=${encodedClassName}&amount=${amount}`;
  
    // Redirect to form page
    window.location.href = url;
  }
  
  // Optional: Add event listeners for better user experience
  document.addEventListener('DOMContentLoaded', function() {
    // You can add additional functionality here if needed
    console.log('Class booking page loaded');
  });
  
  //////////////////////////////////////////////////////////////////////////
  
  // Function to get query parameters from URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Function to populate form with class details
  function populateForm() {
    // Get query parameters
    const className = getQueryParam('class');
    const amount = getQueryParam('amount') || '100';
    
    // Populate form fields
    if (className) {
        document.getElementById('className').value = decodeURIComponent(className);
    }
    
    if (amount) {
        document.getElementById('amount').value = amount;
    }
  }
  
  // Function to handle form submission
  function handleFormSubmission(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get form data
    const className = document.getElementById('className').value;
    const amount = document.getElementById('amount').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    
    // Simple validation
    if (!className || !amount || !phone || !email) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Validate phone number format (Kenyan format)
    const phoneRegex = /^2547\d{8}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        alert('Please enter a valid Kenyan phone number (e.g., 254712345678)');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate payment processing
    processPayment(className, amount, phone, email);
  }
  
  // Function to simulate payment processing
  function processPayment(className, amount, phone, email) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing Payment...';
    submitBtn.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
        // Simulate successful payment
        const success = Math.random() > 0.2; // 80% success rate for demo
        
        if (success) {
            // Send confirmation email (simulated)
            sendConfirmationEmail(className, amount, phone, email);
        } else {
            alert('Payment failed. Please try again.');
        }
        
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
  }
  
  // Function to simulate sending confirmation email
  function sendConfirmationEmail(className, amount, phone, email) {
    // Create class link based on class name
    const classSlug = className.toLowerCase().replace(/\s+/g, '-');
    const classLink = `https://learn.example.com/classes/${classSlug}`;
    
    // Create confirmation message
    const message = `
  Thank you for booking your class!
  
  Class: ${className}
  Amount Paid: KES ${amount}
  Phone Number: ${phone}
  
  You can access your class materials at:
  ${classLink}
  
  Best regards,
  Learning Platform Team
    `.trim();
    
    // Show success message
    alert(`Payment successful! A confirmation email would be sent to ${email} with the class link.`);
    
    // In a real application, you would make an API call here:
    /*
    fetch('/api/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            className: className,
            amount: amount,
            phone: phone,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Payment successful! Check your email for the class link.');
            window.location.href = 'success.html';
        } else {
            alert('Payment failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
    */
    
    // For demo purposes, redirect to success page or show confirmation
    if (confirm('Would you like to see a sample confirmation message?')) {
        showConfirmationDetails(className, amount, classLink, email);
    }
  }
  
  // Function to show confirmation details
  function showConfirmationDetails(className, amount, classLink, email) {
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
        <h1>Payment Successful!</h1>
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; color: #28a745; margin-bottom: 20px;">✓</div>
            <h2>Thank You for Your Booking!</h2>
            <p><strong>Class:</strong> ${className}</p>
            <p><strong>Amount Paid:</strong> KES ${amount}</p>
            <p><strong>Email:</strong> ${email}</p>
            <div style="margin: 30px 0;">
                <p>Your class materials are now available:</p>
                <a href="${classLink}" target="_blank" style="background-color: #007bff; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">
                    Access Your Class
                </a>
            </div>
            <p>A confirmation email has been sent to your email address.</p>
            <a href="index.html" style="display: inline-block; margin-top: 20px; color: #007bff; text-decoration: none;">
                ← Back to Classes
            </a>
        </div>
    `;
  }
  
  // Initialize the form when page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Populate form with class details
    populateForm();
    
    // Add event listener for form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handleFormSubmission);
    }
  });