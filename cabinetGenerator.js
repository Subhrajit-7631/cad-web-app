// cabinetGenerator.js - 3D Cabinet Model Generator

class CabinetGenerator {
    constructor(scene) {
        this.scene = scene;
        this.cabinet = null;
        this.measurements = [];
        this.showMeasurements = false;
    }

    generate(specs) {
        // Clear existing cabinet
        this.clear();

        // Create cabinet group
        this.cabinet = new THREE.Group();
        this.cabinet.name = 'cabinet';

        // Get material color
        const parser = new PromptParser();
        const materialInfo = parser.getMaterialInfo(specs.material);
        
        // Convert inches to scene units (1 inch = 0.1 units for better visualization)
        const scale = 0.1;
        const width = specs.width * scale;
        const height = specs.height * scale;
        const depth = specs.depth * scale;
        const thickness = 0.75 * scale; // Standard 3/4" plywood

        // Materials
        const woodMaterial = new THREE.MeshStandardMaterial({
            color: materialInfo.color,
            roughness: 0.7,
            metalness: 0.1
        });

        const edgeMaterial = new THREE.MeshStandardMaterial({
            color: materialInfo.color * 0.8,
            roughness: 0.8,
            metalness: 0.1
        });

        // Create cabinet structure
        this.createBox(width, height, depth, thickness, woodMaterial, edgeMaterial);
        
        // Add shelves
        if (specs.shelves > 0) {
            this.createShelves(width, height, depth, thickness, specs.shelves, woodMaterial);
        }

        // Add doors
        if (specs.doors > 0) {
            this.createDoors(width, height, depth, thickness, specs.doors, woodMaterial, edgeMaterial);
        }

        // Add drawers
        if (specs.drawers > 0) {
            this.createDrawers(width, height, depth, thickness, specs.drawers, woodMaterial, edgeMaterial);
        }

        // Add hardware
        this.addHardware(width, height, depth, specs.doors, specs.drawers);

        // Position cabinet
        this.cabinet.position.y = height / 2;

        // Add to scene
        this.scene.add(this.cabinet);

        // Create measurements
        this.createMeasurements(specs);

        return this.cabinet;
    }

    createBox(width, height, depth, thickness, woodMaterial, edgeMaterial) {
        // Bottom
        const bottom = new THREE.Mesh(
            new THREE.BoxGeometry(width, thickness, depth),
            woodMaterial
        );
        bottom.position.y = -height / 2 + thickness / 2;
        bottom.castShadow = true;
        bottom.receiveShadow = true;
        this.cabinet.add(bottom);

        // Top
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(width, thickness, depth),
            woodMaterial
        );
        top.position.y = height / 2 - thickness / 2;
        top.castShadow = true;
        top.receiveShadow = true;
        this.cabinet.add(top);

        // Left side
        const left = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, height, depth),
            woodMaterial
        );
        left.position.x = -width / 2 + thickness / 2;
        left.castShadow = true;
        left.receiveShadow = true;
        this.cabinet.add(left);

        // Right side
        const right = new THREE.Mesh(
            new THREE.BoxGeometry(thickness, height, depth),
            woodMaterial
        );
        right.position.x = width / 2 - thickness / 2;
        right.castShadow = true;
        right.receiveShadow = true;
        this.cabinet.add(right);

        // Back panel
        const back = new THREE.Mesh(
            new THREE.BoxGeometry(width - thickness * 2, height - thickness * 2, thickness / 2),
            woodMaterial
        );
        back.position.z = -depth / 2 + thickness / 4;
        back.castShadow = true;
        back.receiveShadow = true;
        this.cabinet.add(back);
    }

    createShelves(width, height, depth, thickness, count, material) {
        const usableHeight = height - thickness * 2;
        const spacing = usableHeight / (count + 1);

        for (let i = 1; i <= count; i++) {
            const shelf = new THREE.Mesh(
                new THREE.BoxGeometry(width - thickness * 2, thickness, depth - thickness),
                material
            );
            shelf.position.y = -height / 2 + thickness + spacing * i;
            shelf.position.z = -thickness / 2;
            shelf.castShadow = true;
            shelf.receiveShadow = true;
            this.cabinet.add(shelf);
        }
    }

    createDoors(width, height, depth, thickness, count, woodMaterial, edgeMaterial) {
        const doorWidth = (width - thickness * 2) / count - 0.05 * count; // Small gap between doors
        const doorHeight = height - thickness * 2 - 0.1;
        const gap = 0.025;

        for (let i = 0; i < count; i++) {
            const door = new THREE.Group();

            // Door panel
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(doorWidth, doorHeight, thickness / 2),
                woodMaterial
            );
            panel.castShadow = true;
            panel.receiveShadow = true;
            door.add(panel);

            // Door frame
            const frameThickness = 0.05;
            const frame = new THREE.Mesh(
                new THREE.BoxGeometry(doorWidth - 0.2, doorHeight - 0.2, thickness / 3),
                edgeMaterial
            );
            frame.position.z = thickness / 4;
            door.add(frame);

            // Position door
            const xPos = -width / 2 + thickness + doorWidth / 2 + gap + i * (doorWidth + gap * 2);
            door.position.set(xPos, 0, depth / 2 + thickness / 4);

            this.cabinet.add(door);
        }
    }

    createDrawers(width, height, depth, thickness, count, woodMaterial, edgeMaterial) {
        const drawerWidth = width - thickness * 2 - 0.1;
        const drawerHeight = (height - thickness * 2) / (count + 2);
        const drawerDepth = depth - thickness - 0.2;

        for (let i = 0; i < count; i++) {
            const drawer = new THREE.Group();

            // Drawer front
            const front = new THREE.Mesh(
                new THREE.BoxGeometry(drawerWidth, drawerHeight - 0.1, thickness / 2),
                woodMaterial
            );
            front.castShadow = true;
            front.receiveShadow = true;
            drawer.add(front);

            // Position drawer
            const yPos = -height / 2 + thickness + drawerHeight / 2 + i * drawerHeight;
            drawer.position.set(0, yPos, depth / 2 + thickness / 4);

            this.cabinet.add(drawer);
        }
    }

    addHardware(width, height, depth, doorCount, drawerCount) {
        const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            roughness: 0.3,
            metalness: 0.8
        });

        // Door handles
        const doorWidth = (width - 0.075 * 2) / doorCount - 0.05 * doorCount;
        const doorHeight = height - 0.075 * 2 - 0.1;
        const gap = 0.025;

        for (let i = 0; i < doorCount; i++) {
            const handle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, 0.3, 16),
                handleMaterial
            );
            handle.rotation.z = Math.PI / 2;
            
            const xPos = -width / 2 + 0.075 + doorWidth / 2 + gap + i * (doorWidth + gap * 2);
            if (i < doorCount / 2) {
                handle.position.set(xPos + doorWidth / 3, 0, depth / 2 + 0.1);
            } else {
                handle.position.set(xPos - doorWidth / 3, 0, depth / 2 + 0.1);
            }
            
            handle.castShadow = true;
            this.cabinet.add(handle);
        }

        // Drawer handles
        if (drawerCount > 0) {
            const drawerHeight = (height - 0.075 * 2) / (drawerCount + 2);
            
            for (let i = 0; i < drawerCount; i++) {
                const handle = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.02, 0.02, width / 4, 16),
                    handleMaterial
                );
                handle.rotation.z = Math.PI / 2;
                
                const yPos = -height / 2 + 0.075 + drawerHeight / 2 + i * drawerHeight;
                handle.position.set(0, yPos, depth / 2 + 0.1);
                handle.castShadow = true;
                this.cabinet.add(handle);
            }
        }
    }

    createMeasurements(specs) {
        this.measurements = [
            { label: `${specs.width}"`, type: 'width' },
            { label: `${specs.height}"`, type: 'height' },
            { label: `${specs.depth}"`, type: 'depth' }
        ];
    }

    toggleMeasurements() {
        this.showMeasurements = !this.showMeasurements;
        // In a full implementation, this would show/hide measurement overlays
        return this.showMeasurements;
    }

    clear() {
        if (this.cabinet) {
            this.scene.remove(this.cabinet);
            this.cabinet.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
            this.cabinet = null;
        }
        this.measurements = [];
    }

    exportDesign(specs) {
        const parser = new PromptParser();
        const formattedSpecs = parser.formatSpecs(specs);
        
        let exportData = 'Cabinet Design Specifications\n';
        exportData += '================================\n\n';
        
        for (const [key, value] of Object.entries(formattedSpecs)) {
            exportData += `${key}: ${value}\n`;
        }
        
        exportData += '\n\nMaterial Requirements:\n';
        exportData += '- Plywood sheets: Based on dimensions\n';
        exportData += '- Edge banding: Perimeter of all visible edges\n';
        exportData += `- Hinges: ${specs.doors * 2} pieces\n`;
        exportData += `- Handles: ${specs.doors + specs.drawers} pieces\n`;
        exportData += '- Drawer slides: Based on drawer count\n';
        exportData += '- Wood screws and fasteners\n';
        
        return exportData;
    }
}
