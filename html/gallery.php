<?php
require_once __DIR__ . "/../php/db.php";


if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    $stmt = $conn->prepare("SELECT filename FROM uploads WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $filePath = "uploads/" . $row['filename'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        $deleteStmt = $conn->prepare("DELETE FROM uploads WHERE id = ?");
        $deleteStmt->bind_param("i", $id);
        $deleteStmt->execute();
    }
    header("Location: gallery.php");
    exit;
}

$uploadMessage = '';
if (isset($_FILES['image'])) {
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }
    $fileName = time() . '_' . basename($_FILES['image']['name']);
    $targetFile = $targetDir . $fileName;
    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
        $stmt = $conn->prepare("INSERT INTO uploads (filename) VALUES (?)");
        $stmt->bind_param("s", $fileName);
        $stmt->execute();
        $uploadMessage = "The file ". htmlspecialchars($fileName). " has been uploaded.";
    } else {
        $uploadMessage = "Sorry, there was an error uploading your file.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ArtSpace Gallery</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/gallery.css">
</head>
<body>
    <div class="container">
        <header style="text-align: center;">
            <a href="../html/ArtSpace.html" class="header-link">Return to Art Space.</a>
            <h1>ArtSpace Gallery</h1>
        </header>

        <?php if (!empty($uploadMessage)): ?>
            <p class="message"><?php echo $uploadMessage; ?></p>
        <?php endif; ?>

        <form class="upload-form" action="gallery.php" method="post" enctype="multipart/form-data">
            <input type="file" name="image" required>
            <button type="submit">Upload</button>
        </form>

        <div class="gallery">
            <?php
            $result = $conn->query("SELECT * FROM uploads ORDER BY uploaded_at DESC");
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<div class='card'>
                            <img src='uploads/{$row['filename']}' alt='Art Piece'>
                            <div class='card-footer'>
                                <button class='delete-btn' data-delete-url='gallery.php?delete={$row['id']}'>Delete</button>
                            </div>
                          </div>";
                }
            } else {
                echo "<p class='no-images'>No images have been uploaded yet.</p>";
            }
            ?>
        </div>
    </div>

    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <h3 style="color: #f0f0f0;">Are you sure?</h3>
            <p style="color: rgba(255, 255, 255, 0.8);">This action cannot be undone.</p>
            <div class="modal-buttons">
                <button id="cancel-delete" class="modal-btn">Cancel</button>
                <button id="confirm-delete" class="modal-btn">Delete</button>
            </div>
        </div>
    </div>
    
    <script>
        document.addEventListener("DOMContentLoaded", () => {
            // Delete Confirmation Modal Logic
            const deleteModal = document.getElementById('deleteModal');
            const confirmDeleteBtn = document.getElementById('confirm-delete');
            const cancelDeleteBtn = document.getElementById('cancel-delete');
            let deleteUrl = null;

            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    event.preventDefault(); // Prevent immediate navigation
                    deleteUrl = event.target.dataset.deleteUrl;
                    deleteModal.style.display = 'block';
                });
            });

            confirmDeleteBtn.addEventListener('click', () => {
                if (deleteUrl) {
                    window.location.href = deleteUrl;
                }
            });

            cancelDeleteBtn.addEventListener('click', () => {
                deleteModal.style.display = 'none';
                deleteUrl = null;
            });
            
            window.addEventListener('click', (event) => {
                if (event.target === deleteModal) {
                    deleteModal.style.display = 'none';
                    deleteUrl = null;
                }
            });
        });
    </script>
</body>
</html>
<?php
// Close the database connection at the end
$conn->close();
?>
