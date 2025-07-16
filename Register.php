<?php
// Database connection
$conn = new mysqli("localhost", "root", "", "likizo");

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Check if all required fields are set
    if (
        isset($_POST['first_name'], $_POST['surname'], $_POST['username'], $_POST['email'], $_POST['password'])
    ) {
        $first_name = $conn->real_escape_string($_POST['first_name']);
        $surname = $conn->real_escape_string($_POST['surname']);
        $username = $conn->real_escape_string($_POST['username']);
        $email = $conn->real_escape_string($_POST['email']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Hash password

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO users (first_name, surname, username, email, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $first_name, $surname, $username, $email, $password);

        if ($stmt->execute()) {
            // ✅ Registration successful — redirect to next page
            header("Location: about.html");
            exit(); // Always call exit() after header redirect
        } else {
            die("Error inserting data: " . $stmt->error);
        }

        $stmt->close();
    } else {
        die("All fields are required.");
    }
} else {
    die("Invalid request method.");
}

$conn->close();
?>