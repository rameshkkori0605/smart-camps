/**
 * SMART CAMPUS - Interactive 3D Campus Model & Holographic Visual Canvas
 * Powered by Three.js with ambient light, cursor raycasting, and interactive building nodes.
 */

export function init3DCampus(containerId = 'campus-3d-canvas-container') {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  container.innerHTML = ''; // Clear container

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b0f19, 0.035);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 12, 22);
  camera.lookAt(0, 2, 0);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
  directionalLight.position.set(10, 20, 15);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x3b82f6, 3, 30);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // Holographic Campus Ground Grid
  const gridHelper = new THREE.GridHelper(30, 30, 0x06b6d4, 0x1f2937);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // Campus Buildings Group
  const campusGroup = new THREE.Group();
  scene.add(campusGroup);

  const buildingMaterials = {
    main: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8, wireframe: false }),
    glass: new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 }),
    highlight: new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, metalness: 0.5, emissive: 0x06b6d4, emissiveIntensity: 0.2 }),
    gold: new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3, metalness: 0.8 })
  };

  // Building 1: Main Admin Block (Tower)
  const adminGeo = new THREE.BoxGeometry(4, 8, 4);
  const adminBuilding = new THREE.Mesh(adminGeo, buildingMaterials.main);
  adminBuilding.position.set(0, 4, 0);
  adminBuilding.name = "Administrative Tower";
  campusGroup.add(adminBuilding);

  // Glass Roof Spire
  const spireGeo = new THREE.ConeGeometry(2, 3, 4);
  const spire = new THREE.Mesh(spireGeo, buildingMaterials.glass);
  spire.position.set(0, 9.5, 0);
  campusGroup.add(spire);

  // Building 2: Central Library (Dome structure)
  const libBaseGeo = new THREE.CylinderGeometry(3, 3, 3, 16);
  const libBase = new THREE.Mesh(libBaseGeo, buildingMaterials.highlight);
  libBase.position.set(-8, 1.5, -2);
  libBase.name = "Central Digital Library";
  campusGroup.add(libBase);

  const domeGeo = new THREE.SphereGeometry(3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const dome = new THREE.Mesh(domeGeo, buildingMaterials.glass);
  dome.position.set(-8, 3, -2);
  campusGroup.add(dome);

  // Building 3: Science & AI Labs Complex
  const labGeo = new THREE.BoxGeometry(6, 4, 3);
  const labBuilding = new THREE.Mesh(labGeo, buildingMaterials.main);
  labBuilding.position.set(7, 2, -4);
  labBuilding.name = "Advanced AI & Robotics Labs";
  campusGroup.add(labBuilding);

  // Building 4: Auditorium & Cultural Center
  const audGeo = new THREE.CylinderGeometry(4, 5, 2.5, 8);
  const audBuilding = new THREE.Mesh(audGeo, buildingMaterials.gold);
  audBuilding.position.set(-6, 1.25, 6);
  audBuilding.name = "Grand Campus Auditorium";
  campusGroup.add(audBuilding);

  // Building 5: Student Hostel Towers
  const hostel1 = new THREE.Mesh(new THREE.BoxGeometry(3, 6, 2), buildingMaterials.main);
  hostel1.position.set(6, 3, 6);
  hostel1.name = "Student Hostels (Block A-D)";
  campusGroup.add(hostel1);

  // Rotating Floating Energy Core (Iconic Hackathon Element)
  const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
  const energyCore = new THREE.Mesh(coreGeo, coreMat);
  energyCore.position.set(0, 13, 0);
  scene.add(energyCore);

  // Mouse Raycaster for Interactivity
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  container.addEventListener('mousemove', (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
  });

  // Animation Loop
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    // Smooth rotation
    campusGroup.rotation.y += 0.003;
    energyCore.rotation.x += 0.01;
    energyCore.rotation.y += 0.015;

    // Raycast check for hover effect
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(campusGroup.children);

    if (intersects.length > 0) {
      document.body.style.cursor = 'pointer';
      const hovered = intersects[0].object;
      if (hovered.name) {
        let labelEl = document.getElementById('3d-building-label');
        if (!labelEl) {
          labelEl = document.createElement('div');
          labelEl.id = '3d-building-label';
          labelEl.className = 'absolute bottom-4 left-4 bg-gray-900/90 text-cyan-400 text-xs px-3 py-1.5 rounded-lg border border-cyan-500/30 shadow-lg pointer-events-none font-semibold uppercase tracking-wider';
          container.appendChild(labelEl);
        }
        labelEl.innerText = `🏢 Selected: ${hovered.name}`;
      }
    } else {
      document.body.style.cursor = 'default';
    }

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
}
