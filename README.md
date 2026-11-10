# Recreation Space

An interactive full-stack web application combining a cozy virtual cafe, playable browser mini-games, and a community art gallery.

**Live Demo:** http://recreationspace.infinityfreeapp.com

---

## Key Features

### Cozy Cafe & Smart Music Player
- **Interactive Vinyl Player:** Embedded in the navigation bar with an animated spinning disc (`#RotatingMusic`).
- **Randomized Playback:** Starts with a randomized track from the curated jazz and coffee shop library on first click.
- **Toggle & Progression:** Clicking while playing pauses and resets the track; clicking again advances sequentially to the next track in the library.
- **Natural Track Progression:** Listens for audio `ended` events to smoothly reset player state when a track finishes.

### Games Corner
- **Classic Snake Game:** Retro grid-based gameplay built with HTML5 Canvas and JavaScript.
- **Coffee Quiz:** Interactive multiple-choice trivia testing coffee and brewing knowledge.
- **Memory Card Flip:** Coffee and pastry themed concentration flip game.
- **Bucket Game & Discount Arcade:** Catching arcade mini-games designed to unlock discounts.

### Community Art Gallery (ArtSpace)
- **Artwork Uploads:** Multipart file upload supporting JPG, JPEG, PNG, and GIF formats.
- **Dynamic Database Rendering:** Fetches artwork records from MySQL and dynamically renders a responsive grid view.
- **Artwork Management:** Integrated modal confirmation to safely delete art pieces and remove associated server files.

### Bakery & Cafe Menu
- Illustrated showcase of handcrafted coffees, teas, and freshly baked pastries.

---

## Architecture & Tech Stack

```text
+-----------------------------------------------------------+
|                        Frontend                           |
|       HTML5  •  CSS3 (Flexbox/Grid/Keyframes)  •  JS      |
+-----------------------------+-----------------------------+
                              |
                     HTTP / POST Requests
                              |
+-----------------------------v-----------------------------+
|                      Backend (PHP 8)                      |
|       php/db.php  •  php/upload.php  •  php/display.php   |
+-----------------------------+-----------------------------+
                              |
                     mysqli Prepared Stmts
                              |
+-----------------------------v-----------------------------+
|                     Database (MySQL)                      |
|                artspace  ->  uploads table                |
+-----------------------------------------------------------+

Frontend: HTML5, CSS3, Vanilla JavaScript (DOM manipulation, HTML5 Audio API).
Backend: PHP 8.x for routing, file processing, and server-side rendering.
Database: MySQL relational database managing image filenames and upload timestamps.
Web Server: Apache (developed with MAMP, deployed to InfinityFree LAMP hosting).

