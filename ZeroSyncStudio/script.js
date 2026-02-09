// script.js
console.log('ZeroSync Script Loaded');

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    hamburger.classList.toggle('active'); // Optional: Add animation to hamburger icon itself
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// GSAP Animations (Basic Page Load)
gsap.from('.navbar', { duration: 1, y: -100, opacity: 0, ease: 'power3.out' });
gsap.from('.hero-content', { duration: 1, x: -50, opacity: 0, delay: 0.5, ease: 'power3.out' });
gsap.from('.product-card', {
    scrollTrigger: {
        trigger: '.products',
        start: 'top 80%',
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'back.out(1.7)'
});

// Global Function for Color Changing (called from HTML)
window.changeColor = function(colorValue) {
    // Dispatch a custom event that three-handler.js can listen for
    const event = new CustomEvent('colorChange', { detail: { color: colorValue } });
    window.dispatchEvent(event);
    
    // Update UI selection
    const buttons = document.querySelectorAll('.color-btn');
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        // Simple check based on background color or data attribute logic could be better, 
        // but for now, we just rely on the user clicking to set the 'selected' class.
    });
    // This part assumes the clicked button triggered the function, 
    // but since we passed the color value directly, we might need event.target.
    // Let's rely on event delegation or update this to accept the event object if needed.
    // For simplicity, we'll re-implement the UI update in the click handler listener if needed, 
    // or better yet, pass 'event' or use 'this' in HTML. 
    // Updating 'onclick' in HTML to pass 'this' is cleaner.
};

// Fix for color button UI toggle:
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});
