<?php
require_once __DIR__ . "/db.php";
$result = $conn->query("SELECT * FROM uploads ORDER BY uploaded_at DESC");

while ($row = $result->fetch_assoc()) {
    echo "<div class='gallery-item'>
            <img src='../uploads/" . $row['filename'] . "' alt='artwork'>
          </div>";
}

$conn->close();
?>
