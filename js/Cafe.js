let MusicLibrary = [
  "../songs/after-midnight-slow-blues-1724.mp3",
  "../songs/coffee-shop-338785.mp3",
  "../songs/relaxing-jazz-podcast-coffee-shop-music-192283.mp3"
];
let clickTimes = 1;
let currentSongIndex = -1;
let isPlaying = false;
let audioElement = new Audio();

// Handle song ending naturally
audioElement.addEventListener("ended", function () {
  let StopRotate = document.getElementById("RotatingMusic");
  if (StopRotate) {
    StopRotate.removeAttribute("id");
  }
  isPlaying = false;
});

// Music Function Start Here!
function Music() {
  clickTimes++;
  if (isPlaying) {
    StopMusic();
  } else {
    PlayMusic();
  }
}

function PlayMusic() {
  if (currentSongIndex === -1) {
    // Randomize starting song on first play
    currentSongIndex = Math.floor(Math.random() * MusicLibrary.length);
  } else {
    // Play next song when clicked again after stopping
    currentSongIndex = (currentSongIndex + 1) % MusicLibrary.length;
  }

  audioElement.src = MusicLibrary[currentSongIndex];
  audioElement.play().catch(function (error) {
    console.log("Audio playback error:", error);
  });

  let Rotate = document.getElementsByClassName("MusicDisc")[0];
  if (Rotate) {
    Rotate.id = "RotatingMusic";
  }
  isPlaying = true;
}

function StopMusic() {
  let StopRotate = document.getElementById("RotatingMusic");
  if (StopRotate) {
    StopRotate.removeAttribute("id");
  }
  if (audioElement) {
    audioElement.pause();
    audioElement.currentTime = 0;
  }
  isPlaying = false;
}
// Music Function End Here

window.addEventListener("load", function () {
  let RotatingDisc = document.getElementsByClassName("MusicDisc")[0];
  if (RotatingDisc) {
    RotatingDisc.classList.add("BouncingDisc");
  }
});
