let BackBtn = document.getElementById("backBtn");
let ForwardBtn = document.getElementById("forwardBtn");
let Box = document.getElementsByClassName("card-wrapper")[0];
let DotsContainer = document.getElementsByClassName("dots-container")[0];

if (Box && BackBtn && ForwardBtn && DotsContainer) {
    let cards = document.getElementsByClassName("card");
    // Initial dot creation
    for (let i = 0; i < cards.length; i++) {
        let dot = document.createElement("span");
        dot.classList.add("dot");
        dot.dataset.index = i;
        DotsContainer.appendChild(dot);
    }
    
    let dots = document.getElementsByClassName("dot");

    function updateDots() {
        if (!cards.length) return; // Prevent error if no cards exist
        const currentCardIndex = Math.round(Box.scrollLeft / cards[0].offsetWidth);
        
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
        }
        
        if (dots[currentCardIndex]) {
            dots[currentCardIndex].classList.add("active");
        }
    }

    // Set the first dot to active on page load
    updateDots();

    // Add scroll event listener to update dots on scroll
    Box.addEventListener("scroll", () => {
        updateDots();
    });

    // Event listeners for the buttons
    BackBtn.addEventListener("click", () => {
        if (cards.length) {
            Box.scrollLeft -= cards[0].offsetWidth;
        }
    });

    ForwardBtn.addEventListener("click", () => {
        if (cards.length) {
            Box.scrollLeft += cards[0].offsetWidth;
        }
    });
} else {
    console.error("One or more elements for the carousel were not found.");
}

// --- TOAST NOTIFICATION CODE (REMAINS THE SAME) ---
let cards = document.querySelectorAll(".card");
let notificationBox = document.getElementById("notificationBox");
let notificationMessage = document.querySelector(".toast-message");
let closeBtn = document.querySelector(".toast-close-btn");
let timeoutId = null;

cards.forEach(card => {
    card.addEventListener("click", (event) => {
        event.preventDefault(); // Prevents the link from navigating

        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        let className = card.querySelector('span').textContent;
        notificationMessage.textContent = `You have successfully enrolled in the ${className}.`;
        notificationBox.classList.add("active");

        timeoutId = setTimeout(() => {
            notificationBox.classList.remove("active");
        }, 5000);
    });
});

closeBtn.addEventListener("click", () => {
    notificationBox.classList.remove("active");
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
});


// --- NEW CODE FOR DYNAMIC PAGE ANIMATIONS ---
document.addEventListener("DOMContentLoaded", () => {
    // Select all elements that need to animate on load
    const elementsToAnimate = document.querySelectorAll(".animate-on-load");

    elementsToAnimate.forEach((element, index) => {
        // For individual cards, we'll apply a staggered delay
        if (element.classList.contains('card')) {
            element.style.animationDelay = `${0.8 + index * 0.1}s`; // Staggered start after card-container
        }
        // Remove the hidden class to trigger the CSS animation
        element.classList.remove("hidden");
    });
});