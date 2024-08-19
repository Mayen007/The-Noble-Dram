function openNav() {
  document.getElementById("mySidenav").style.width = "350px";
  document.getElementById("main").style.marginLeft = "350px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

const countEl = document.getElementById("count-el");
const flashMessage = document.getElementById("alert");

let count = parseInt(countEl.textContent, 10);

function addToCart() {
  count++;
  countEl.textContent = count;
  showFlashMessage("Item added to cart!");
}

function showFlashMessage(message, duration = 3000) {
  flashMessage.textContent = message; // Set the message text
  flashMessage.style.display = "block"; // Show the message
  flashMessage.style.opacity = "1"; // Make it visible

  // Hide the message after the specified duration
  setTimeout(() => {
    flashMessage.style.opacity = "0"; // Fade out the message
    // Optionally hide it completely after fading out
    setTimeout(() => {
      flashMessage.style.display = "none";
    }, 500); // Match this with the CSS transition duration
  }, duration);
}

// Ensure buttons trigger addToCart function
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', addToCart);
});
