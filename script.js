document.addEventListener('DOMContentLoaded', () => {
    // --- Dark Mode Logic ---
    const darkModeKey = 'rulesSimplifiedDarkMode';
    const isDarkMode = localStorage.getItem(darkModeKey) === 'true';

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }

    // Create Toggle Button
    const navContainer = document.querySelector('.nav-container');
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = isDarkMode ? '☀️' : '🌙';
    toggleBtn.className = 'btn';
    toggleBtn.style.padding = '0.5rem';
    toggleBtn.style.fontSize = '1.2rem';
    toggleBtn.style.marginLeft = '1rem';
    toggleBtn.style.background = 'transparent';
    toggleBtn.style.boxShadow = 'none';

    // Insert before mobile menu button
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    navContainer.insertBefore(toggleBtn, mobileMenuBtn);

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem(darkModeKey, isDark);
        toggleBtn.innerHTML = isDark ? '☀️' : '🌙';
    });


    // --- Mobile Menu Toggle ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navLinks.classList.contains('active') ? '✕' : '☰';
            mobileBtn.textContent = icon;
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileBtn.textContent = '☰';
                }
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.card, .section h2, .hero-subtitle, .btn');
    animatedElements.forEach(el => {
        el.classList.add('fade-in-scroll');
        observer.observe(el);
    });
});
