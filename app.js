// app.js - Main Application Controller

// Global variables
let scene, camera, renderer, controls;
let cabinetGenerator, promptParser;
let currentSpecs = null;
let gridHelper;

// Initialize the application
function init() {
    // Initialize Three.js scene
    initThreeJS();
    
    // Initialize cabinet tools
    promptParser = new PromptParser();
    cabinetGenerator = new CabinetGenerator(scene);
    
    // Set up event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
    
    console.log('Cabinet CAD Designer initialized successfully');
}

// Initialize Three.js scene, camera, renderer
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    scene.fog = new THREE.Fog(0xf0f0f0, 50, 100);
    
    // Create camera
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // Add orbit controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 30;
    controls.maxPolarAngle = Math.PI / 2;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Add hemisphere light for better ambient lighting
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    hemisphereLight.position.set(0, 20, 0);
    scene.add(hemisphereLight);
    
    // Add grid
    gridHelper = new THREE.GridHelper(20, 20, 0x888888, 0xcccccc);
    scene.add(gridHelper);
    
    // Add ground plane for shadows
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Set up event listeners
function setupEventListeners() {
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', generateCabinet);
    
    // Enter key in prompt textarea
    document.getElementById('promptInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            generateCabinet();
        }
    });
    
    // Example prompts
    document.querySelectorAll('.example-prompt').forEach(example => {
        example.addEventListener('click', (e) => {
            document.getElementById('promptInput').value = e.target.textContent;
            generateCabinet();
        });
    });
    
    // Export button
    document.getElementById('exportBtn').addEventListener('click', exportDesign);
    
    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearScene);
    
    // Toggle grid button
    document.getElementById('toggleGridBtn').addEventListener('click', toggleGrid);
    
    // Toggle measurements button
    document.getElementById('toggleMeasurementsBtn').addEventListener('click', toggleMeasurements);
    
    // View buttons
    document.getElementById('resetViewBtn').addEventListener('click', resetView);
    document.getElementById('topViewBtn').addEventListener('click', () => setView('top'));
    document.getElementById('frontViewBtn').addEventListener('click', () => setView('front'));
    document.getElementById('sideViewBtn').addEventListener('click', () => setView('side'));
}

// Generate cabinet from prompt
function generateCabinet() {
    const prompt = document.getElementById('promptInput').value;
    
    if (!prompt.trim()) {
        alert('Please enter a design prompt');
        return;
    }
    
    // Show loading indicator
    showLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
        try {
            // Parse the prompt
            currentSpecs = promptParser.parse(prompt);
            
            // Generate the cabinet
            cabinetGenerator.generate(currentSpecs);
            
            // Update properties display
            updatePropertiesDisplay(currentSpecs);
            
            // Enable export button
            document.getElementById('exportBtn').disabled = false;
            
            // Reset camera view
            resetView();
            
            showLoading(false);
        } catch (error) {
            console.error('Error generating cabinet:', error);
            alert('Error generating cabinet. Please try a different prompt.');
            showLoading(false);
        }
    }, 500);
}

// Update properties display
function updatePropertiesDisplay(specs) {
    const propertiesDisplay = document.getElementById('propertiesDisplay');
    const formattedSpecs = promptParser.formatSpecs(specs);
    
    let html = '';
    for (const [key, value] of Object.entries(formattedSpecs)) {
        html += `
            <div class="property-item">
                <span class="property-label">${key}:</span>
                <span class="property-value">${value}</span>
            </div>
        `;
    }
    
    propertiesDisplay.innerHTML = html;
}

// Export design
function exportDesign() {
    if (!currentSpecs) {
        alert('No design to export');
        return;
    }
    
    const exportData = cabinetGenerator.exportDesign(currentSpecs);
    
    // Create download
    const blob = new Blob([exportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cabinet-design-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Design exported successfully');
}

// Clear scene
function clearScene() {
    cabinetGenerator.clear();
    currentSpecs = null;
    document.getElementById('promptInput').value = '';
    document.getElementById('propertiesDisplay').innerHTML = 
        '<p class="no-design">No design loaded. Enter a prompt above to get started.</p>';
    document.getElementById('exportBtn').disabled = true;
}

// Toggle grid visibility
function toggleGrid() {
    gridHelper.visible = !gridHelper.visible;
}

// Toggle measurements
function toggleMeasurements() {
    const showing = cabinetGenerator.toggleMeasurements();
    console.log(`Measurements ${showing ? 'shown' : 'hidden'}`);
    // In a full implementation, this would show/hide 2D measurement overlays
}

// Reset camera view
function resetView() {
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Set specific view
function setView(view) {
    const distance = 10;
    
    switch(view) {
        case 'top':
            camera.position.set(0, distance, 0);
            camera.lookAt(0, 0, 0);
            break;
        case 'front':
            camera.position.set(0, 3, distance);
            camera.lookAt(0, 3, 0);
            break;
        case 'side':
            camera.position.set(distance, 3, 0);
            camera.lookAt(0, 3, 0);
            break;
    }
    
    controls.target.set(0, 2, 0);
    controls.update();
}

// Show/hide loading indicator
function showLoading(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = show ? 'block' : 'none';
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
