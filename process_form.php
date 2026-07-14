<?php
// Include PHPMailer library files
// Note: Adjust these paths if you installed via Composer (use vendor/autoload.php instead)
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Sanitize and capture the form data
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars(strip_tags(trim($_POST["phone"])));
    $interest = htmlspecialchars(strip_tags(trim($_POST["interest"])));
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // Basic validation
    if (empty($name) || empty($email) || empty($phone) || empty($message)) {
        die("Please fill out all required fields.");
    }

    // 2. Initialize PHPMailer
    $mail = new PHPMailer(true);

    try {
        
        // --- SERVER SETTINGS ---
        $mail->isSMTP();                                      
        $mail->Host       = 'smtp.hostinger.com';         // Hostinger's SMTP server
        $mail->SMTPAuth   = true;                                   
        $mail->Username   = 'enquiry@arkayfurniture.com'; // Your Hostinger email address
        $mail->Password   = 'Btbc$@2026';        // Replace with your actual email password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;  // Enable SSL encryption
        $mail->Port       = 465;                          // TCP port for SSL;                          // TCP port to connect to; use 587 if you have set `SMTPSecure = ENCRYPTION_STARTTLS`

        // --- RECIPIENTS ---
        // Who the email is from (Must match your SMTP Username to avoid spam filters)
        $mail->setFrom('enquiry@arkayfurniture.com', 'Arkay Website System'); 
        
        // Who the email goes to (You want it to go to your custom mailbox)
        $mail->addAddress('enquiry@arkayfurniture.com', 'Arkay Furniture Enquiries'); 
        
        // Allows you to hit "Reply" in your email client and reply directly to the customer
        $mail->addReplyTo($email, $name); 

        // --- EMAIL CONTENT ---
        $mail->isHTML(true);                                  
        $mail->Subject = 'New Website Enquiry from ' . $name;
        
        // Build the email body
        $mailBody = "
            <h2>New Website Lead</h2>
            <p><strong>Name:</strong> {$name}</p>
            <p><strong>Email:</strong> {$email}</p>
            <p><strong>Phone:</strong> {$phone}</p>
            <p><strong>Product Interest:</strong> {$interest}</p>
            <p><strong>Message/Requirements:</strong><br/>" . nl2br($message) . "</p>
        ";
        
        $mail->Body    = $mailBody;
        $mail->AltBody = strip_tags(str_replace('<br/>', "\n", $mailBody)); // Plain text version for non-HTML mail clients

        // Send the email
        $mail->send();
        
        // Redirect back to the contact page or a success page
        echo "<script>
                alert('Thank you! Your enquiry has been sent. We will reply within one business day.');
                window.location.href = 'contact.html';
              </script>";
              
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    // If someone tries to access this file directly without submitting the form
    header("Location: contact.html");
    exit;
}
?>