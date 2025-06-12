function openNav() {
  document.getElementById("mySidenav").style.width = "350px";

}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
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

document.addEventListener('scroll', () => {
  const scrollProgress = document.querySelector('.scroll-progress');
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;
  const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
  scrollProgress.style.width = `${scrollPercent}%`;
});

function formatPrice(cents) {
  return `KSh${(cents / 100).toFixed(2)}`;
}

// Function to generate star ratings
function generateStars(starCount) {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += i < starCount ? '★' : '☆';
  }
  return stars;
}

const products = [
  {
    id: "77a845b1-16ed-4eac-bdf9-5b591882113d",
    image: "./static/images/jameson.jpg",
    name: "Jameson Irish Whiskey",
    rating: {
      stars: 4,
      count: 25
    },
    priceCents: 375000,
    keywords: [
      "whiskey",
      "irish",
      "alcohol"
    ]
  },
  {
    id: "d25b7c44-a849-4d0d-8f6d-05df33c3dcb8",
    image: "./static/images/smirnoff.webp",
    name: "Smirnoff Vodka",
    rating: {
      stars: 5,
      count: 30
    },
    priceCents: 300000,
    keywords: [
      "vodka",
      "russian",
      "alcohol"
    ]
  },
  {
    id: "b3f23b10-8e99-4b59-b2a5-8c68b114832f",
    image: "./static/images/asian-rum.webp",
    name: "Tanduay Gold Asian Rum",
    rating: {
      stars: 3,
      count: 10
    },
    priceCents: 200000,
    keywords: [
      "rum",
      "filipino",
      "alcohol"
    ]
  },
  {
    id: "92e8b50c-d15c-4c2c-8b91-5f91c01c8f43",
    image: "./static/images/royal_stag.webp",
    name: "Royal Stag Whiskey",
    rating: {
      stars: 4,
      count: 18
    },
    priceCents: 111999,
    keywords: [
      "whiskey",
      "indian",
      "alcohol"
    ]
  }
  // Add more products here as needed
];

// Function to display products
function displayProducts(productsToDisplay) {
  const productGrid = document.getElementById('product-id');
  productGrid.innerHTML = ''; // Clear existing content

  productsToDisplay.forEach(product => {
    const productCard = `
      <div class="product-card" id="${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="rating">Rating: ${generateStars(product.rating.stars)} (${product.rating.count} reviews)</p>
        <p class="price">${formatPrice(product.priceCents)}</p>
        <p class="keywords" hidden>Keywords: ${product.keywords.join(', ')}</p>
        <p class="flash-message"></p>
        <button class="add-to-cart" onclick="addToCart('${product.name}')">Add to Cart</button>
      </div>
    `;
    productGrid.innerHTML += productCard; // Append each product card to the grid
  });
}

// Filter products by keyword
function filterProducts() {
  const category = document.getElementById('category-filter').value;
  if (category === 'all') {
    displayProducts(products);
  } else {
    const filteredProducts = products.filter(product =>
      product.keywords.includes(category)
    );
    displayProducts(filteredProducts);
  }
}

// Load all products when the page loads
document.addEventListener('DOMContentLoaded', () => {
  displayProducts(products);
});