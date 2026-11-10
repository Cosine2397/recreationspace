// --- EXISTING CODE FOR CLOCK AND DAY ---

function getTime() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("clock").textContent = hours + ":" + minutes;
}
setInterval(getTime, 1000);
getTime();

function getDay() {
  let date = new Date();
  let days = date.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  document.getElementById("days").textContent = dayNames[days];
}
setInterval(getDay, 20000);
getDay();


// --- NEW CODE FOR DYNAMIC ANIMATIONS ---

document.addEventListener("DOMContentLoaded", () => {
  const elementsToAnimate = document.querySelectorAll(".animate-on-load");

  elementsToAnimate.forEach((element) => {
      // Remove the hidden class and add the slide-in class
      // to trigger the CSS animation
      element.classList.remove("hidden");
      element.classList.add("slide-in");
  });
});