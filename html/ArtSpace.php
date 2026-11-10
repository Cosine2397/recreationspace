<?php
// --- SETUP & DATABASE CONNECTION ---
require_once __DIR__ . "/../php/db.php";
$targetDir = "uploads/";
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ArtSpace Gallery</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-color: #00aaff;
      --background-image: url(images/download.jpg); /* Make sure you have this image */
    }
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Poppins', sans-serif;
      background: var(--background-image) no-repeat center center fixed;
      background-size: cover;
      color: #f0f0f0;
      line-height: 1.6;
    }
    .navbar {
        padding: 1rem 2rem;
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .navbar .logo {
        font-weight: 700;
        font-size: 1.5rem;
        text-decoration: none;
        color: #fff;
    }
    .navbar .nav-links a {
        color: #fff;
        text-decoration: none;
        padding: 0.5rem 1rem;
        margin: 0 0.5rem;
        border-radius: 8px;
        transition: background 0.3s ease;
    }
    .navbar .nav-links a:hover, .navbar .nav-links a.active {
        background-color: var(--primary-color);
    }
    .hero {
        text-align: center;
        padding: 6rem 2rem;
    }
    .hero h1 {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
    }
    .hero p {
        font-size: 1.2rem;
        font-weight: 300;
        max-width: 600px;
        margin: auto;
        opacity: 0.9;
    }
    .gallery-container {
        max-width: 1400px;
        margin: 2rem auto;
        padding: 0 2rem;
    }
    .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
    }
    .gallery-item {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 8px 32px 0 rgba(0,0,0,0.37);
        backdrop-filter: blur(4px);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    .gallery-item:hover {
        transform: translateY(-10px);
        box-shadow: 0 16px 40px 0 rgba(0,0,0,0.5);
    }
    .gallery-item img {
        width: 100%;
        height: 250px;
        object-fit: cover;
        display: block;
    }
    footer {
        text-align: center;
        padding: 2rem;
        margin-top: 4rem;
        background: rgba(0,0,0,0.4);
        border-top: 1px solid rgba(255,255,255,0.1);
    }
    /* Responsive */
    @media (max-width: 768px) {
        .hero h1 { font-size: 2.5rem; }
        .gallery-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  
  <nav class="navbar">
    <a href="#" class="logo">ArtSpace</a>
    <div class="nav-links">
      <a href="ArtSpace.php" class="active">Gallery</a>
      <a href="gallery.php">Manage</a>
    </div>
  </nav>
  
  <header class="hero">
    <h1>A Canvas of Digital Dreams</h1>
    <p>Explore a curated collection of unique and inspiring digital artwork from creators around the globe.</p>
  </header>

  <main class="gallery-container">
    <div class="gallery-grid">
      <?php
      $result = $conn->query("SELECT * FROM uploads ORDER BY uploaded_at DESC");
      if ($result && $result->num_rows > 0) {
          while ($row = $result->fetch_assoc()) {
              $imageFile = htmlspecialchars($row['filename']);
              echo "
              <div class='gallery-item'>
                <img src='{$targetDir}{$imageFile}' alt='Artwork from the gallery'>
              </div>";
          }
      } else {
          echo "<p style='text-align:center; grid-column: 1 / -1;'>The gallery is empty. <a href='gallery.php'>Upload the first piece!</a></p>";
      }
      ?>
    </div>
  </main>
  
  <footer>
    <p>&copy; 2025 ArtSpace Gallery. All Rights Reserved.</p>
  </footer>

</body>
</html>
<?php $conn->close(); ?>