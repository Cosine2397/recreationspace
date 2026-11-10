<?php
// Database configuration template
// Copy this file to php/db.php and fill in your actual database credentials

$db_host = "localhost";        // e.g. "localhost" or "sqlXXX.infinityfree.com"
$db_user = "your_username";     // your database username
$db_pass = "your_password";     // your database password
$db_name = "your_dbname";       // your database name
$db_port = 3306;                // default MySQL port (or 8889 for local MAMP)

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name, $db_port);

// Check connection
if ($conn->connect_error) {
    die("Database Connection failed: " . $conn->connect_error);
}
?>
