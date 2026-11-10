<?php
$targetDir = "../uploads/";
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

if (isset($_FILES["image"])) {
    $fileName = time() . "_" . basename($_FILES["image"]["name"]);
    $targetFile = $targetDir . $fileName;
    $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

    $allowedTypes = ["jpg", "jpeg", "png", "gif"];
    if (in_array($imageFileType, $allowedTypes)) {
        if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFile)) {
            // save only filename to DB
            require_once __DIR__ . "/db.php";
            $stmt = $conn->prepare("INSERT INTO uploads (filename) VALUES (?)");
            $stmt->bind_param("s", $fileName);
            $stmt->execute();
            $stmt->close();
            $conn->close();

            header("Location: ../html/ArtSpace.php");
            exit;
        } else {
            echo "Error uploading file.";
        }
    } else {
        echo "Only JPG, JPEG, PNG & GIF allowed.";
    }
}
?>
