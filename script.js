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

// Update Navbar Background on Scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
        header.style.background = 'rgba(26, 31, 44, 0.95)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Detect Dark Mode Changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const header = document.querySelector('header');
    if (e.matches) {
        header.style.background = 'rgba(26, 31, 44, 0.95)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
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
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.testimonials-slider');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    // Initialize first slide
    slides[0].classList.add('active');

    function goToSlide(n) {
        slides[currentSlide].classList.remove('active');
        document.querySelectorAll('.slider-dot')[currentSlide].classList.remove('active');
        
        currentSlide = n;
        
        slides[currentSlide].classList.add('active');
        document.querySelectorAll('.slider-dot')[currentSlide].classList.add('active');
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    // Auto advance slides
    setInterval(nextSlide, 5000);
});
