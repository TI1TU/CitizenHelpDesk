// --- 1. Custom Cursor ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .product-card');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        follower.classList.add('cursor-hover');
    });
    link.addEventListener('mouseleave', () => {
        follower.classList.remove('cursor-hover');
    });
});

// --- 2. Mobile Menu ---
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    // Animate hamburger to X (simple CSS toggle class if we added it, but just menu for now)
});

// --- 3. Three.js Hero Scene (Abstract 3D Shape) ---
const initHero3D = () => {
    const container = document.getElementById('hero-canvas-container');
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Geometry - Abstract Torus Knot to represent "Interwoven threads" or "Cyberpunk aesthetics"
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);

    // Material - Wireframe style for futuristic look
    const material = new THREE.MeshNormalMaterial({
        wireframe: true,
    });

    // Alternatively, a cool dark shiny material
    // const material = new THREE.MeshStandardMaterial({ 
    //     color: 0x111111, 
    //     roughness: 0.1, 
    //     metalness: 0.8 
    // });

    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    // Lights (If using StandardMaterial)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f3ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xbd00ff, 1);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Animation Loop
    let mouseX = 0;
    let mouseY = 0;

    // Parallax Effect
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Constant rotation
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;

        // Interaction rotation
        torusKnot.rotation.x += mouseY * 0.01;
        torusKnot.rotation.y += mouseX * 0.01;

        // Floating animation
        torusKnot.position.y = Math.sin(Date.now() * 0.001) * 0.2;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initHero3D();

// --- 4. GSAP Animations ---
gsap.registerPlugin(ScrollTrigger);

// Hero Text Reveal
gsap.from('.hero-content > *', {
    y: 50,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.5
});

// Scroll Triggers for Sections
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 1
    });
});

gsap.from('.product-card', {
    scrollTrigger: {
        trigger: '.product-grid',
        start: "top 75%"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2
});
