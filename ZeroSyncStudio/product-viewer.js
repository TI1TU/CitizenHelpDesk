// --- Custom Cursor Logic (Shared) ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0 });
    gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.1 });
});

// --- 3D Viewer Logic ---
const initViewer = () => {
    const container = document.getElementById('product-canvas');
    if (!container) return; // Guard clause

    const scene = new THREE.Scene();

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x050505, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // Shadow settings
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // Geometry - Using a Capsule or Cylinder to mimic a hoodie/body shape roughly
    // Since we don't have a model, we'll compose a few shapes
    const group = new THREE.Group();

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.8, 0.8, 2.5, 32);
    const material = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.7,
        metalness: 0.1
    });
    const torso = new THREE.Mesh(torsoGeo, material);
    torso.castShadow = true;
    group.add(torso);

    // Hood (Sphere cut in half roughly)
    const hoodGeo = new THREE.SphereGeometry(0.85, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const hood = new THREE.Mesh(hoodGeo, material);
    hood.position.y = 1.3;
    hood.castShadow = true;
    group.add(hood);

    // Arms (Simple cylinders)
    const armGeo = new THREE.CylinderGeometry(0.25, 0.2, 2, 32);
    const leftArm = new THREE.Mesh(armGeo, material);
    leftArm.position.set(-1.1, 0.5, 0);
    leftArm.rotation.z = Math.PI / 4;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, material);
    rightArm.position.set(1.1, 0.5, 0);
    rightArm.rotation.z = -Math.PI / 4;
    group.add(rightArm);

    scene.add(group);

    // Floor
    const planeGeo = new THREE.PlaneGeometry(50, 50);
    const planeMat = new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.8,
        metalness: 0.5
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(5, 10, 5);
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add(spotLight);

    const rimLight = new THREE.PointLight(0x00f3ff, 2, 10);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // Animation Loop
    const animate = () => {
        requestAnimationFrame(animate);
        controls.update();

        // Gentle floating
        group.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // UI Interactions

    // Color Switching
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class
            colorBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Change material color
            const colorHex = e.target.getAttribute('data-color');
            const newColor = new THREE.Color(parseInt(colorHex));

            gsap.to(material.color, {
                r: newColor.r,
                g: newColor.g,
                b: newColor.b,
                duration: 0.5,
                onUpdate: () => {
                    material.needsUpdate = true;
                }
            });
        });
    });

    // Rotation Toggle
    const rotateBtn = document.getElementById('rotate-btn');
    if (rotateBtn) {
        let isRotating = true;
        rotateBtn.addEventListener('click', () => {
            isRotating = !isRotating;
            controls.autoRotate = isRotating;
            // Visual feedback
            rotateBtn.style.color = isRotating ? 'white' : '#555';
        });
    }
};

initViewer();
