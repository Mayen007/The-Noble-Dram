/**
 * The Noble Dram - Main JavaScript
 * Handles all core functionality of the website including:
 * - Navigation and UI interactions
 * - Product management and filtering
 * - Shopping cart operations
 * - User authentication state
 * - Form submissions and validation
 */

// Main application namespace to avoid global scope pollution
const NobleDram = (function () {
  // Private variables
  let cart = [];
  let wishlist = [];
  let currentFilter = 'all';
  let isUserLoggedIn = false;

  // DOM Elements - Cache references to commonly used elements
  const DOM = {
    header: document.querySelector('.site-header'),
    countEl: document.getElementById('count-el'),
    flashMessage: document.getElementById('alert'),
    backToTop: document.getElementById('back-to-top'),
    scrollProgress: document.querySelector('.scroll-progress'),
    searchToggle: document.querySelector('.search-toggle'),
    searchOverlay: document.querySelector('.search-overlay'),
    searchClose: document.querySelector('.search-close'),
    cartToggle: document.querySelector('.cart-toggle'),
    cartSidebar: document.querySelector('.cart-sidebar'),
    cartClose: document.querySelector('.cart-close'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
    mainNavigation: document.querySelector('.main-navigation'),
    sliderDots: document.querySelectorAll('.slider-dot'),
    sliderArrows: document.querySelectorAll('.slider-arrow'),
    heroSlides: document.querySelectorAll('.hero-slide'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    productGrid: document.getElementById('product-id'),
    ageVerification: document.getElementById('age-verification'),
    testimonialDots: document.querySelectorAll('.testimonial-dot')
  };

  /**
   * Initialize the application
   */
  function init() {
    // Load saved data from localStorage
    loadUserData();

    // Bind event listeners
    bindEvents();

    // Initialize UI components
    initAgeVerification();
    initHeroSlider();

    // Display products if on relevant page
    if (DOM.productGrid) {
      displayProducts(products);
    }

    // Update copyright year
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /**
   * Bind all event listeners
   */
  function bindEvents() {
    // Header and navigation
    if (DOM.mobileMenuToggle) {
      DOM.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (DOM.searchToggle) {
      DOM.searchToggle.addEventListener('click', toggleSearch);
    }

    if (DOM.searchClose) {
      DOM.searchClose.addEventListener('click', toggleSearch);
    }

    if (DOM.cartToggle) {
      DOM.cartToggle.addEventListener('click', toggleCart);
    }

    if (DOM.cartClose) {
      DOM.cartClose.addEventListener('click', toggleCart);
    }

    // Back to top button
    if (DOM.backToTop) {
      DOM.backToTop.addEventListener('click', scrollToTop);
    }

    // Hero slider controls
    if (DOM.sliderDots.length) {
      DOM.sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => changeSlide(index));
      });
    }

    if (DOM.sliderArrows.length && DOM.heroSlides.length) {
      DOM.sliderArrows[0].addEventListener('click', prevSlide);
      DOM.sliderArrows[1].addEventListener('click', nextSlide);
    }

    // Product filtering
    if (DOM.filterButtons.length) {
      DOM.filterButtons.forEach(btn => {
        btn.addEventListener('click', function () {
          currentFilter = this.dataset.filter;
          updateFilters();
          filterProducts(currentFilter);
        });
      });
    }

    // Age verification
    if (DOM.ageVerification) {
      const yesBtn = document.getElementById('age-yes');
      const noBtn = document.getElementById('age-no');

      if (yesBtn) yesBtn.addEventListener('click', confirmAge);
      if (noBtn) noBtn.addEventListener('click', rejectAge);
    }

    // Testimonial carousel
    if (DOM.testimonialDots.length) {
      DOM.testimonialDots.forEach(dot => {
        dot.addEventListener('click', function () {
          const slideIndex = this.getAttribute('data-slide');
          changeTestimonial(parseInt(slideIndex));
        });
      });
    }

    // Scroll events
    document.addEventListener('scroll', handleScroll);

    // Global click handler for dynamic elements
    document.addEventListener('click', handleGlobalClick);

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', handleSignup);
    }

    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    if (passwordToggles.length) {
      passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', togglePasswordVisibility);
      });
    }

    // Password strength meter
    const passwordInput = document.querySelector('input[name="password"]');
    if (passwordInput && document.getElementById('strength-value')) {
      passwordInput.addEventListener('input', checkPasswordStrength);
    }
  }

  /**
   * Handle global click events for dynamically created elements
   */
  function handleGlobalClick(e) {
    // Add to cart buttons
    if (e.target.closest('.add-to-cart')) {
      const button = e.target.closest('.add-to-cart');
      const productId = button.dataset.id;
      addToCart(productId);
      e.preventDefault();
    }

    // Quick view buttons
    if (e.target.closest('.quick-view')) {
      const button = e.target.closest('.quick-view');
      const productId = button.dataset.id;
      openQuickView(productId);
      e.preventDefault();
    }

    // Add to wishlist buttons
    if (e.target.closest('.add-to-wishlist')) {
      const button = e.target.closest('.add-to-wishlist');
      const productId = button.dataset.id;
      toggleWishlist(productId);
      e.preventDefault();
    }

    // Close modal if clicking overlay
    if (e.target.classList.contains('modal-overlay')) {
      closeModals();
    }

    // Dropdown menus
    if (e.target.closest('.nav-item.has-dropdown')) {
      const dropdown = e.target.closest('.nav-item.has-dropdown');
      if (window.innerWidth < 992) { // Only for mobile
        toggleDropdown(dropdown);
      }
    }
  }

  /**
   * Handle scroll events
   */
  function handleScroll() {
    // Update scroll progress bar
    if (DOM.scrollProgress) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
      DOM.scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Show/hide back to top button
    if (DOM.backToTop) {
      if (document.documentElement.scrollTop > 300) {
        DOM.backToTop.classList.add('active');
      } else {
        DOM.backToTop.classList.remove('active');
      }
    }

    // Sticky header behavior
    if (DOM.header) {
      if (document.documentElement.scrollTop > 100) {
        DOM.header.classList.add('sticky');
      } else {
        DOM.header.classList.remove('sticky');
      }
    }
  }

  /**
   * Toggle mobile menu
   */
  function toggleMobileMenu() {
    DOM.mainNavigation.classList.toggle('active');
    DOM.mobileMenuToggle.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  /**
   * Toggle search overlay
   */
  function toggleSearch() {
    DOM.searchOverlay.classList.toggle('active');
    document.body.classList.toggle('overlay-open');

    // Focus search input when opening
    if (DOM.searchOverlay.classList.contains('active')) {
      setTimeout(() => {
        DOM.searchOverlay.querySelector('input').focus();
      }, 100);
    }
  }

  /**
   * Toggle cart sidebar
   */
  function toggleCart() {
    DOM.cartSidebar.classList.toggle('active');
    document.body.classList.toggle('overlay-open');
  }

  /**
   * Scroll to top of page
   */
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Hero slider functionality
   */
  let currentSlide = 0;

  function initHeroSlider() {
    // Auto-rotate slides
    if (DOM.heroSlides.length > 1) {
      setInterval(() => {
        nextSlide();
      }, 7000);
    }
  }

  function changeSlide(index) {
    // Hide all slides
    DOM.heroSlides.forEach(slide => slide.classList.remove('active'));
    DOM.sliderDots.forEach(dot => dot.classList.remove('active'));

    // Show selected slide
    DOM.heroSlides[index].classList.add('active');
    DOM.sliderDots[index].classList.add('active');

    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= DOM.heroSlides.length) {
      nextIndex = 0;
    }
    changeSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) {
      prevIndex = DOM.heroSlides.length - 1;
    }
    changeSlide(prevIndex);
  }

  /**
   * Testimonial carousel
   */
  function changeTestimonial(index) {
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');

    // Hide all slides and remove active class from dots
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    // Show selected slide and add active class to corresponding dot
    testimonialSlides[index].classList.add('active');
    testimonialDots[index].classList.add('active');
  }

  /**
   * Product filtering
   */
  function updateFilters() {
    // Update filter button active states
    DOM.filterButtons.forEach(btn => {
      if (btn.dataset.filter === currentFilter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function filterProducts(filter = 'all') {
    if (filter === 'all') {
      displayProducts(products);
    } else {
      const filteredProducts = products.filter(product =>
        product.keywords.includes(filter)
      );
      displayProducts(filteredProducts);
    }
  }

  /**
   * Display products in the grid
   */
  function displayProducts(productsToDisplay) {
    if (!DOM.productGrid) return;

    DOM.productGrid.innerHTML = ''; // Clear existing content

    if (productsToDisplay.length === 0) {
      DOM.productGrid.innerHTML = `
        <div class="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      `;
      return;
    }

    productsToDisplay.forEach(product => {
      const isInWishlist = wishlist.includes(product.id);
      const productCard = createProductCard(product, isInWishlist);
      DOM.productGrid.innerHTML += productCard;
    });
  }

  /**
   * Create HTML for a product card
   */
  function createProductCard(product, isInWishlist = false) {
    const wishlistClass = isInWishlist ? 'in-wishlist' : '';
    const badgeHtml = product.badge ?
      `<div class="product-badge">${product.badge}</div>` : '';

    return `
      <div class="product-card" data-id="${product.id}" data-category="${product.keywords[0]}">
        ${badgeHtml}
        
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <div class="product-actions">
            <button class="quick-view" data-id="${product.id}" aria-label="Quick view">
              <i class="fas fa-eye"></i>
            </button>
            <button class="add-to-cart" data-id="${product.id}" aria-label="Add to cart">
              <i class="fas fa-shopping-cart"></i>
            </button>
            <button class="add-to-wishlist ${wishlistClass}" data-id="${product.id}" aria-label="Add to wishlist">
              <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
            </button>
          </div>
        </div>
        
        <div class="product-info">
          <div class="product-rating">
            ${generateStars(product.rating.stars)}
            <span class="rating-count">(${product.rating.count})</span>
          </div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">${formatPrice(product.priceCents)}</p>
        </div>
      </div>
    `;
  }

  /**
   * Shopping cart functionality
   */
  function addToCart(productId) {
    const product = findProductById(productId);
    if (!product) return;

    // Check if product is already in cart
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
      // Increment quantity if already in cart
      cartItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.priceCents,
        image: product.image,
        quantity: 1
      });
    }

    // Update UI and storage
    updateCartCount();
    updateCartDisplay();
    saveCart();
    showFlashMessage(`${product.name} added to cart`);
  }

  function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      const removedItem = cart[index];
      cart.splice(index, 1);

      // Update UI and storage
      updateCartCount();
      updateCartDisplay();
      saveCart();
      showFlashMessage(`${removedItem.name} removed from cart`);
    }
  }

  function updateQuantity(productId, newQuantity) {
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
      // Ensure quantity is at least 1
      newQuantity = Math.max(1, newQuantity);
      cartItem.quantity = newQuantity;

      // Update UI and storage
      updateCartDisplay();
      saveCart();
    }
  }

  function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);

    if (DOM.countEl) {
      DOM.countEl.textContent = count;

      // Add animation effect
      DOM.countEl.classList.add('animate');
      setTimeout(() => {
        DOM.countEl.classList.remove('animate');
      }, 300);
    }
  }

  function updateCartDisplay() {
    if (!DOM.cartItems || !DOM.cartTotal) return;

    if (cart.length === 0) {
      // Show empty cart message
      DOM.cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-bag"></i>
          <p>Your cart is empty</p>
          <a href="./src/products.html" class="btn btn-primary">Shop Now</a>
        </div>
      `;
      DOM.cartTotal.textContent = formatPrice(0);
      return;
    }

    // Generate cart items HTML
    let cartHtml = '';
    let total = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartHtml += `
        <div class="cart-item" data-id="${item.id}">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h4>${item.name}</h4>
            <div class="item-price">${formatPrice(item.price)}</div>
            <div class="item-quantity">
              <button class="quantity-decrease" data-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="remove-item" data-id="${item.id}" aria-label="Remove item">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    });

    // Add checkout button
    cartHtml += `
      <div class="cart-buttons">
        <a href="./src/checkout.html" class="btn btn-checkout">Checkout</a>
      </div>
    `;

    DOM.cartItems.innerHTML = cartHtml;
    DOM.cartTotal.textContent = formatPrice(total);

    // Add event listeners for cart item buttons
    DOM.cartItems.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
      });
    });

    DOM.cartItems.querySelectorAll('.quantity-decrease').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id);
        if (item && item.quantity > 1) {
          updateQuantity(btn.dataset.id, item.quantity - 1);
        } else {
          removeFromCart(btn.dataset.id);
        }
      });
    });

    DOM.cartItems.querySelectorAll('.quantity-increase').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = cart.find(i => i.id === btn.dataset.id);
        if (item) {
          updateQuantity(btn.dataset.id, item.quantity + 1);
        }
      });
    });
  }

  /**
   * Wishlist functionality
   */
  function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);

    if (index === -1) {
      // Add to wishlist
      wishlist.push(productId);
      showFlashMessage('Added to your wishlist');
    } else {
      // Remove from wishlist
      wishlist.splice(index, 1);
      showFlashMessage('Removed from your wishlist');
    }

    // Update UI and storage
    updateWishlistButtons();
    saveWishlist();
  }

  function updateWishlistButtons() {
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
      const productId = btn.dataset.id;
      const isInWishlist = wishlist.includes(productId);

      if (isInWishlist) {
        btn.classList.add('in-wishlist');
        btn.querySelector('i').classList.replace('far', 'fas');
      } else {
        btn.classList.remove('in-wishlist');
        btn.querySelector('i').classList.replace('fas', 'far');
      }
    });
  }

  /**
   * Quick view modal
   */
  function openQuickView(productId) {
    const product = findProductById(productId);
    if (!product) return;

    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    const isInWishlist = wishlist.includes(product.id);
    const wishlistIcon = isInWishlist ? 'fas' : 'far';

    modal.innerHTML = `
      <div class="quick-view-modal">
        <button class="modal-close" aria-label="Close modal">
          <i class="fas fa-times"></i>
        </button>
        <div class="modal-content">
          <div class="product-quickview">
            <div class="quickview-image">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quickview-details">
              <h2>${product.name}</h2>
              <div class="product-rating">
                ${generateStars(product.rating.stars)}
                <span class="rating-count">(${product.rating.count} reviews)</span>
              </div>
              <p class="product-price">${formatPrice(product.priceCents)}</p>
              <div class="product-description">
                <p>Experience the exceptional quality and distinct character of this premium spirit. The perfect addition to your collection.</p>
              </div>
              <div class="quickview-actions">
                <div class="quantity-selector">
                  <button class="quantity-btn decrease">-</button>
                  <input type="number" value="1" min="1" class="quantity-input">
                  <button class="quantity-btn increase">+</button>
                </div>
                <div class="action-buttons">
                  <button class="btn btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                  <button class="btn-wishlist" data-id="${product.id}">
                    <i class="${wishlistIcon} fa-heart"></i>
                  </button>
                </div>
              </div>
              <div class="product-meta">
                <p class="category">Category: ${product.keywords[0].charAt(0).toUpperCase() + product.keywords[0].slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add modal to DOM
    document.body.appendChild(modal);
    document.body.classList.add('modal-open');

    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      closeModals();
    });

    const addToCartBtn = modal.querySelector('.btn-add-to-cart');
    addToCartBtn.addEventListener('click', () => {
      const quantity = parseInt(modal.querySelector('.quantity-input').value);
      addToCartWithQuantity(product.id, quantity);
      closeModals();
    });

    const wishlistBtn = modal.querySelector('.btn-wishlist');
    wishlistBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
      const icon = wishlistBtn.querySelector('i');
      if (icon.classList.contains('far')) {
        icon.classList.replace('far', 'fas');
      } else {
        icon.classList.replace('fas', 'far');
      }
    });

    const decreaseBtn = modal.querySelector('.decrease');
    decreaseBtn.addEventListener('click', () => {
      const input = modal.querySelector('.quantity-input');
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
      }
    });

    const increaseBtn = modal.querySelector('.increase');
    increaseBtn.addEventListener('click', () => {
      const input = modal.querySelector('.quantity-input');
      input.value = parseInt(input.value) + 1;
    });
  }

  function addToCartWithQuantity(productId, quantity) {
    const product = findProductById(productId);
    if (!product) return;

    // Check if product is already in cart
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
      // Increment quantity if already in cart
      cartItem.quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.priceCents,
        image: product.image,
        quantity: quantity
      });
    }

    // Update UI and storage
    updateCartCount();
    updateCartDisplay();
    saveCart();
    showFlashMessage(`${product.name} added to cart`);
  }

  function closeModals() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
      modal.remove();
    });
    document.body.classList.remove('modal-open');
  }

  /**
   * Age verification
   */
  function initAgeVerification() {
    if (!DOM.ageVerification) return;

    // Check if age has been verified before
    const verified = localStorage.getItem('age-verified');
    if (verified === 'true') {
      DOM.ageVerification.style.display = 'none';
    }
  }

  function confirmAge() {
    if (DOM.ageVerification) {
      DOM.ageVerification.style.opacity = '0';
      setTimeout(() => {
        DOM.ageVerification.style.display = 'none';
      }, 500);
      localStorage.setItem('age-verified', 'true');
    }
  }

  function rejectAge() {
    window.location.href = 'https://www.responsibility.org/prevent-underage-drinking';
  }

  /**
   * Authentication forms
   */
  function handleLogin(e) {
    e.preventDefault();

    // Simulated login - in a real app, this would send a request to the server
    const email = e.target.querySelector('[name="email"]').value;
    const password = e.target.querySelector('[name="password"]').value;
    const remember = e.target.querySelector('[name="remember"]')?.checked || false;

    // Simple validation
    if (!email || !password) {
      showFlashMessage('Please fill in all fields', 5000);
      return;
    }

    // Simulate API call delay
    showFlashMessage('Signing in...');

    setTimeout(() => {
      isUserLoggedIn = true;
      localStorage.setItem('user-logged-in', 'true');

      if (remember) {
        localStorage.setItem('user-email', email);
      }

      // Redirect to home page or account page
      window.location.href = '../index.html';
    }, 1500);
  }

  function handleSignup(e) {
    e.preventDefault();

    // Get form values
    const firstName = e.target.querySelector('[name="firstName"]').value;
    const lastName = e.target.querySelector('[name="lastName"]').value;
    const email = e.target.querySelector('[name="email"]').value;
    const password = e.target.querySelector('[name="password"]').value;
    const birthdate = e.target.querySelector('[name="birthdate"]').value;
    const newsletter = e.target.querySelector('[name="newsletter"]')?.checked || false;
    const terms = e.target.querySelector('[name="terms"]')?.checked || false;

    // Simple validation
    if (!firstName || !lastName || !email || !password || !birthdate) {
      showFlashMessage('Please fill in all required fields', 5000);
      return;
    }

    if (!terms) {
      showFlashMessage('You must agree to the Terms of Service', 5000);
      return;
    }

    // Age verification
    const today = new Date();
    const birth = new Date(birthdate);
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      showFlashMessage('You must be at least 18 years old to create an account', 5000);
      return;
    }

    // Simulate API call delay
    showFlashMessage('Creating your account...');

    setTimeout(() => {
      isUserLoggedIn = true;
      localStorage.setItem('user-logged-in', 'true');
      localStorage.setItem('user-name', firstName);
      localStorage.setItem('user-email', email);

      // Redirect to home page or account page
      window.location.href = '../index.html';
    }, 1500);
  }

  /**
   * Password visibility toggle
   */
  function togglePasswordVisibility(e) {
    const button = e.currentTarget;
    const passwordField = button.closest('.password-field');
    const passwordInput = passwordField.querySelector('input');
    const icon = button.querySelector('i');

    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      passwordInput.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

  /**
   * Password strength meter
   */
  function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthIndicator = document.getElementById('strength-value');
    const meterSections = document.querySelectorAll('.meter-section');

    // Calculate strength
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    // Update UI
    meterSections.forEach((section, index) => {
      if (index < strength) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    // Update text
    let strengthText = '';
    let strengthColor = '';

    switch (strength) {
      case 0:
        strengthText = 'Weak';
        strengthColor = '#ff4d4d';
        break;
      case 1:
        strengthText = 'Fair';
        strengthColor = '#ffa64d';
        break;
      case 2:
        strengthText = 'Good';
        strengthColor = '#ffff4d';
        break;
      case 3:
        strengthText = 'Strong';
        strengthColor = '#4dff4d';
        break;
      case 4:
        strengthText = 'Very Strong';
        strengthColor = '#4d4dff';
        break;
    }

    strengthIndicator.textContent = strengthText;
    strengthIndicator.style.color = strengthColor;
  }

  /**
   * Newsletter submission
   */
  function handleNewsletterSubmit(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;
    const consent = e.target.querySelector('input[type="checkbox"]')?.checked || false;

    if (!email) {
      showFlashMessage('Please enter your email address', 5000);
      return;
    }

    if (!consent) {
      showFlashMessage('Please agree to receive email communications', 5000);
      return;
    }

    // Simulate API call delay
    showFlashMessage('Subscribing...');

    setTimeout(() => {
      showFlashMessage('Thank you for subscribing!');
      e.target.reset();
    }, 1500);
  }

  /**
   * Show flash message
   */
  function showFlashMessage(message, duration = 3000) {
    if (!DOM.flashMessage) return;

    DOM.flashMessage.textContent = message;
    DOM.flashMessage.style.display = 'block';
    DOM.flashMessage.style.opacity = '1';

    setTimeout(() => {
      DOM.flashMessage.style.opacity = '0';
      setTimeout(() => {
        DOM.flashMessage.style.display = 'none';
      }, 500);
    }, duration);
  }

  /**
   * Toggle dropdown menu
   */
  function toggleDropdown(dropdown) {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');

    if (dropdownMenu.style.display === 'block') {
      dropdownMenu.style.display = 'none';
    } else {
      // Close other open dropdowns
      const openDropdowns = document.querySelectorAll('.dropdown-menu');
      openDropdowns.forEach(menu => {
        menu.style.display = 'none';
      });

      dropdownMenu.style.display = 'block';
    }
  }

  /**
   * Helper functions
   */
  function findProductById(productId) {
    return products.find(p => p.id === productId);
  }

  function formatPrice(cents) {
    return `KSh${(cents / 100).toFixed(2)}`;
  }

  function generateStars(starCount) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < starCount ? '★' : '☆';
    }
    return stars;
  }

  /**
   * Local storage functions
   */
  function loadUserData() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('noble-dram-cart');
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartDisplay();
      } catch (e) {
        console.error('Error loading cart data', e);
        cart = [];
      }
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('noble-dram-wishlist');
    if (savedWishlist) {
      try {
        wishlist = JSON.parse(savedWishlist);
        updateWishlistButtons();
      } catch (e) {
        console.error('Error loading wishlist data', e);
        wishlist = [];
      }
    }

    // Check login status
    isUserLoggedIn = localStorage.getItem('user-logged-in') === 'true';
  }

  function saveCart() {
    localStorage.setItem('noble-dram-cart', JSON.stringify(cart));
  }

  function saveWishlist() {
    localStorage.setItem('noble-dram-wishlist', JSON.stringify(wishlist));
  }

  // Return public API
  return {
    init,
    addToCart,
    showFlashMessage,
    filterProducts
  };
})();

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', NobleDram.init);