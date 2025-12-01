// 3D Scene Setup using Three.js

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0xf8fafc); // Match --background-color

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Objects
    const geometryGroup = new THREE.Group();
    scene.add(geometryGroup);

    // Materials using site colors
    // Primary: #2563eb, Accent: #3b82f6, Secondary: #64748b
    const materialPrimary = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.4,
        metalness: 0.1
    });
    const materialAccent = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        roughness: 0.3,
        metalness: 0.2
    });
    const materialSecondary = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.5,
        metalness: 0.1
    });
    const materialGlass = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0,
        roughness: 0,
        transmission: 0.9, // Add transparency
        thickness: 0.5, // Add refraction
        transparent: true,
        opacity: 0.8
    });


    // Main floating shape (Icosahedron)
    const mainShapeGeo = new THREE.IcosahedronGeometry(1.5, 0);
    const mainShape = new THREE.Mesh(mainShapeGeo, materialPrimary);
    mainShape.position.set(0, 0, 0);
    geometryGroup.add(mainShape);

    // Orbiting shapes
    const torusGeo = new THREE.TorusGeometry(2.2, 0.1, 16, 100);
    const torus = new THREE.Mesh(torusGeo, materialAccent);
    torus.rotation.x = Math.PI / 2;
    geometryGroup.add(torus);

    const cubeGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    const cube1 = new THREE.Mesh(cubeGeo, materialSecondary);
    cube1.position.set(2.5, 1.5, -1);
    geometryGroup.add(cube1);

    const cube2 = new THREE.Mesh(cubeGeo, materialGlass);
    cube2.position.set(-2.5, -1, 1);
    geometryGroup.add(cube2);

    const sphereGeo = new THREE.SphereGeometry(0.3, 32, 32);
    const sphere1 = new THREE.Mesh(sphereGeo, materialAccent);
    sphere1.position.set(1.5, -2, 0.5);
    geometryGroup.add(sphere1);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x2563eb, 2, 10);
    pointLight.position.set(-2, 3, 2);
    scene.add(pointLight);

    // Animation variables
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    // Mouse interaction
    document.addEventListener('mousemove', (event) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);

        // Continuous rotation
        mainShape.rotation.y += 0.005;
        mainShape.rotation.x += 0.002;

        torus.rotation.z -= 0.003;
        torus.rotation.x += 0.002;

        cube1.rotation.x += 0.01;
        cube1.rotation.y += 0.01;

        cube2.rotation.x -= 0.01;
        cube2.rotation.z += 0.01;

        // Floating effect
        const time = Date.now() * 0.001;
        cube1.position.y += Math.sin(time) * 0.002;
        cube2.position.y += Math.cos(time * 0.8) * 0.002;
        sphere1.position.y += Math.sin(time * 1.2) * 0.002;

        // Mouse interaction smoothing
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;

        geometryGroup.rotation.x += 0.05 * (targetRotationX - geometryGroup.rotation.x);
        geometryGroup.rotation.y += 0.05 * (targetRotationY - geometryGroup.rotation.y);

        renderer.render(scene, camera);
    };

    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    });
});
