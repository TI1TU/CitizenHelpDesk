document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('animated-root');
  container.style.width = '100%';
  container.style.height = 'calc(100vh - 120px)';

  // Scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(5, 5, 5);
  scene.add(dir);

  // Group for everything (for parallax/rotation)
  const group = new THREE.Group();
  scene.add(group);

  // Main object: smooth icosahedron
  const geo = new THREE.IcosahedronGeometry(1.4, 3);
  const mat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.2 });
  const main = new THREE.Mesh(geo, mat);
  group.add(main);

  // Accent small orb
  const orbGeo = new THREE.SphereGeometry(0.12, 24, 24);
  const orbMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, metalness: 0.8, roughness: 0.2, emissive: 0x3b82f6, emissiveIntensity: 0.4 });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  orb.position.set(2.2, 1.0, 0.5);
  group.add(orb);

  // Particles
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 2.6 + Math.random() * 4.0;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    positions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
    positions[i * 3 + 1] = r * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);
  }
  const particlesGeo = new THREE.BufferGeometry();
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMat = new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.03, opacity: 0.9, transparent: true });
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // Mouse interaction variables
  let mouseX = 0, mouseY = 0;
  let targetRX = 0, targetRY = 0;

  // cursor dot
  const cursorDot = document.getElementById('cursorDot');

  function onMove(e) {
    const x = e.clientX - container.getBoundingClientRect().left;
    const y = e.clientY - container.getBoundingClientRect().top;
    const nx = (x / container.clientWidth) * 2 - 1;
    const ny = -(y / container.clientHeight) * 2 + 1;
    mouseX = nx; mouseY = ny;

    // move CSS cursor dot
    cursorDot.style.transform = `translate(${x}px, ${y}px)`;

    // Make orb follow with some offset
    const orbTargetX = nx * 2.4;
    const orbTargetY = ny * 1.5;
    gsap.to(orb.position, { x: orbTargetX, y: orbTargetY, duration: 0.6, ease: 'power3.out' });

    // Slight parallax of particles
    gsap.to(particles.rotation, { x: -ny * 0.4, y: nx * 0.8, duration: 0.8, ease: 'power2.out' });

    // target rotation for group
    targetRX = ny * 0.35;
    targetRY = nx * 0.6;
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', (ev) => {
    if (ev.touches && ev.touches[0]) onMove(ev.touches[0]);
  }, { passive: true });

  // Toggle particles control
  const toggleBtn = document.getElementById('toggleParticles');
  let particlesOn = true;
  toggleBtn.addEventListener('click', () => {
    particlesOn = !particlesOn;
    gsap.to(particles.material, { opacity: particlesOn ? 0.9 : 0.0, duration: 0.6 });
    toggleBtn.textContent = particlesOn ? 'Hide particles' : 'Show particles';
  });

  // Responsive resize
  window.addEventListener('resize', onResize);
  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  // Animate
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // soft rotate main object
    main.rotation.y += 0.005;
    main.rotation.x += 0.0025;

    // floating
    main.position.y = Math.sin(t * 0.6) * 0.08;

    // smooth group rotation towards target
    group.rotation.x += (targetRX - group.rotation.x) * 0.06;
    group.rotation.y += (targetRY - group.rotation.y) * 0.06;

    // slow particle drift
    particles.rotation.z += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  // initial shake-in using GSAP
  gsap.from(main.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.9, ease: 'elastic.out(1,0.6)' });
  gsap.from('.ui-top .hint', { opacity: 0, y: -8, duration: 0.8, delay: 0.2 });

});
