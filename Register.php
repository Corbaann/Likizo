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



<?php
// paymenrt.php
session_start();
require 'vendor/autoload.php'; // For PHPMailer

// Capture form data
$amount = $_POST['amount'];
$phone = $_POST['phone'];
$email = $_POST['email'];

// Store email temporarily (use database in production)
$_SESSION['pending_payment'] = [
    'email' => $email,
    'amount' => $amount,
    'phone' => $phone,
    'timestamp' => time()
];

// --- M-Pesa STK Push Logic ---
$consumerKey = "YOUR_CONSUMER_KEY";
$consumerSecret = "YOUR_CONSUMER_SECRET";
$BusinessShortCode = '174379'; // Sandbox test number
$Passkey = "YOUR_PASSKEY";

$timestamp = date("YmdHis");
$password = base64_encode($BusinessShortCode . $Passkey . $timestamp);

// Get OAuth token
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials");
curl_setopt($curl, CURLOPT_HTTPHEADER, [
    "Authorization: Basic " . base64_encode($consumerKey . ":" . $consumerSecret)
]);
curl_setopt($curl, CURLOPT_HEADER, false);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

$response = json_decode(curl_exec($curl));
$token = $response->access_token;
curl_close($curl);

// Send STK Push
$curl2 = curl_init();
curl_setopt($curl2, CURLOPT_URL, "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest");
curl_setopt($curl2, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $token",
    "Content-Type: application/json"
]);
curl_setopt($curl2, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl2, CURLOPT_POST, true);

$phoneNumber = ltrim($phone, '0'); // 07XX → 7XX
$phoneNumber = '254' . $phoneNumber;

$callbackUrl = "https://yourdomain.com/callback.php"; // Must be HTTPS

$stkData = [
    'BusinessShortCode' => $BusinessShortCode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerBuyGoodsOnline',
    'Amount' => $amount,
    'PartyA' => $phoneNumber,
    'PartyB' => $BusinessShortCode,
    'PhoneNumber' => $phoneNumber,
    'CallBackURL' => $callbackUrl,
    'AccountReference' => 'Order123',
    'TransactionDesc' => 'Payment for order'
];

curl_setopt($curl2, CURLOPT_POSTFIELDS, json_encode($stkData));
$result = curl_exec($curl2);
curl_close($curl2);

echo "Payment request sent! Check your phone.";
?>

<?php
// callback.php
session_start();
require 'vendor/autoload.php'; // Load PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

// Read M-Pesa callback
$data = file_get_contents('php://input');
file_put_contents('logs/callback.json', $data . "\n", FILE_APPEND); // Log for debugging

$callback = json_decode($data, true);

// Only proceed if payment was successful
if (isset($callback['Body']['stkCallback']['ResultCode']) && $callback['Body']['stkCallback']['ResultCode'] == 0) {
    $result = $callback['Body']['stkCallback']['CallbackMetadata']['Item'];

    $amount = $result[0]['Value'];
    $mpesaCode = $result[1]['Value'];
    $timestamp = $result[3]['Value'];
    $phoneNumber = $result[4]['Value'];

    // Get stored email from session
    if (isset($_SESSION['pending_payment']) && $_SESSION['pending_payment']['phone'] == $phoneNumber) {
        $email = $_SESSION['pending_payment']['email'];

        // Send confirmation email
        $mail = new PHPMailer(true);

        try {
            // SMTP Configuration (example: Gmail)
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = 'youremail@gmail.com'; // Your email
            $mail->Password   = 'your-app-password';  // Use App Password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('no-reply@yourwebsite.com', 'Your Website');
            $mail->addAddress($email);

            $mail->isHTML(true);
            $mail->Subject = 'Payment Confirmation - Order #123';
            $mail->Body    = "
                <h2>Payment Successful!</h2>
                <p>Hi there,</p>
                <p>Thank you for your payment of <strong>KES $amount</strong>.</p>
                <p><strong>Transaction ID:</strong> $mpesaCode</p>
                <p><strong>Date:</strong> " . date('d-M-Y H:i', strtotime($timestamp)) . "</p>
                <p>We’ll process your order shortly.</p>
                <p>Best regards,<br><strong>Your Website Team</strong></p>
            ";

            $mail->send();
            file_put_contents('logs/email_sent.log', "Email sent to $email\n", FILE_APPEND);
        } catch (Exception $e) {
            file_put_contents('logs/email_error.log', "Email failed to $email: " . $mail->ErrorInfo . "\n", FILE_APPEND);
        }

        // Clear session
        unset($_SESSION['pending_payment']);
    }
}
?>