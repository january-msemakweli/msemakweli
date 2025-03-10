// Mobile Navigation Menu
const navLinks = document.getElementById("navLinks");

// Mobile Menu Toggle
const menuBtn = document.createElement('div');
menuBtn.className = 'menu-btn';
menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('nav').appendChild(menuBtn);

let menuOpen = false;

menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;
    navLinks.classList.toggle('active');
    menuBtn.innerHTML = menuOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuOpen && !navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
        menuOpen = false;
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Close menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuOpen = false;
        navLinks.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Blog Post Overlay Functionality
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const post = button.closest('.blog-post');
        const title = post.querySelector('h3').textContent;
        const image = post.querySelector('img').src;
        const content = post.getAttribute('data-full-content');

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'blog-overlay';
        overlay.innerHTML = `
            <div class="blog-overlay-content">
                <button class="close-overlay"><i class="fas fa-times"></i></button>
                <img src="${image}" alt="${title}">
                <h3>${title}</h3>
                <div class="blog-content">
                    ${content}
                </div>
            </div>
        `;

        // Add overlay to body
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('active'), 10);

        // Close overlay functionality
        const closeBtn = overlay.querySelector('.close-overlay');
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        });

        // Close on outside click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
                setTimeout(() => overlay.remove(), 300);
            }
        });
    });
});

// Admin Login Handler
document.getElementById('adminLoginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            window.location.href = '/admin/dashboard.html';
        } else {
            alert('Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    } finally {
        submitBtn.textContent = 'Login';
        submitBtn.disabled = false;
    }
});

// Chatbox User Message Styling
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.message.user .message-content').forEach(el => {
        el.style.background = '#28a745'; // Green background
        el.style.color = '#ffffff'; // White text
    });
});

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function () {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;

    // Ensure the required elements are present
    if (!slider || slides.length === 0 || !dotsContainer) return;

    // Create dots for each slide
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active'); // Mark the first dot as active
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Initialize the first slide as active
    slides[0].classList.add('active');

    // Function to switch slides
    function goToSlide(n) {
        // Remove active classes from current slide and dot
        slides[currentSlide].classList.remove('active');
        dotsContainer.children[currentSlide].classList.remove('active');

        // Update current slide index
        currentSlide = n;

        // Add active classes to new slide and dot
        slides[currentSlide].classList.add('active');
        dotsContainer.children[currentSlide].classList.add('active');

        // Shift the slider to show the active slide
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Automatically move to the next slide every 5 seconds
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length; // Loop back to the start
        goToSlide(nextIndex);
    }

    setInterval(nextSlide, 5000); // Adjust time interval as needed
});
// Add this new code for colleagues page functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all read more buttons and overlays
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    const overlays = document.querySelectorAll('.colleague-overlay');
    const closeButtons = document.querySelectorAll('.close-overlay');

    // Add click event to each read more button
    readMoreBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            overlays[index].style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when overlay is open
        });
    });

    // Add click event to each close button
    closeButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            overlays[index].style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        });
    });

    // Close overlay when clicking outside content
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
});
