// three-handler.js
// Removed imports for file:// compatibility
// using global THREE and THREE.OrbitControls

console.log('Three Handler Loaded');

const heroContainer = document.getElementById('hero-canvas-container');
const productContainer = document.getElementById('product-canvas-container');

// Only run if we are on a page with a container
if (heroContainer) {
    initHeroScene();
}

if (productContainer) {
    initProductScene();
}

// --- Hero Section Scene ---
function initHeroScene() {
    const scene = new THREE.Scene();
    // Transparent background for hero to blend with CSS gradient if needed, or dark bg
    // scene.background = new THREE.Color(0x0a0a0a); // Let CSS handle bg? No, canvas covers it. 
    // For Hero, we might want transparency to see the gradient behind? 
    // Or we set the canvas to be transparent.

    const camera = new THREE.PerspectiveCamera(75, heroContainer.clientWidth / heroContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    heroContainer.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f3ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Placeholder 3D Model (TorusKnot representing complex fabric flow?)
    const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);
    const material = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4,
        metalness: 0.7
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.005;

        // Float effect
        cube.position.y = Math.sin(Date.now() * 0.001) * 0.2;

        renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
    });
}

// --- Product Viewer Scene ---
function initProductScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Darker studio background

    const camera = new THREE.PerspectiveCamera(75, productContainer.clientWidth / productContainer.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(productContainer.clientWidth, productContainer.clientHeight);
    productContainer.appendChild(renderer.domElement);

    // Controls
    // Use global THREE.OrbitControls (ensure the script is loaded in HTML)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    // Placeholder Product Model (Sphere/Capsule)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16); // Using TorusKnot again for cool factor
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111, // Initial black
        roughness: 0.5,
        metalness: 0.1
    });
    const productMesh = new THREE.Mesh(geometry, material);
    scene.add(productMesh);

    // Event Listener for Color Change
    window.addEventListener('colorChange', (e) => {
        // e.detail.color is expected to be a hex number or string
        const newColor = new THREE.Color(e.detail.color);
        gsap.to(productMesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
            duration: 0.5
        });
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = productContainer.clientWidth / productContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(productContainer.clientWidth, productContainer.clientHeight);
    });
}
