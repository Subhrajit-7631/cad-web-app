// promptParser.js - Natural Language Parser for Cabinet Specifications

class PromptParser {
    constructor() {
        // Default cabinet specifications
        this.defaults = {
            width: 36,
            height: 30,
            depth: 24,
            shelves: 2,
            doors: 2,
            drawers: 0,
            material: 'oak',
            finish: 'natural',
            type: 'base'
        };

        // Material mappings
        this.materials = {
            oak: { color: 0xC19A6B, name: 'Oak' },
            pine: { color: 0xE3C16F, name: 'Pine' },
            maple: { color: 0xF0E68C, name: 'Maple' },
            walnut: { color: 0x654321, name: 'Walnut' },
            cherry: { color: 0x9B4D4F, name: 'Cherry' },
            mahogany: { color: 0x7B3F00, name: 'Mahogany' },
            birch: { color: 0xD6C7A5, name: 'Birch' },
            white: { color: 0xF5F5F5, name: 'White' }
        };

        // Cabinet types
        this.types = {
            base: 'Base Cabinet',
            wall: 'Wall Cabinet',
            tall: 'Tall Cabinet',
            vanity: 'Vanity',
            bookshelf: 'Bookshelf',
            display: 'Display Cabinet'
        };
    }

    parse(prompt) {
        if (!prompt || prompt.trim() === '') {
            return { ...this.defaults, error: 'Empty prompt' };
        }

        const lowerPrompt = prompt.toLowerCase();
        const specs = { ...this.defaults };

        // Extract dimensions
        specs.width = this.extractDimension(lowerPrompt, ['width', 'wide', 'w:']) || specs.width;
        specs.height = this.extractDimension(lowerPrompt, ['height', 'tall', 'high', 'h:']) || specs.height;
        specs.depth = this.extractDimension(lowerPrompt, ['depth', 'deep', 'd:']) || specs.depth;

        // Extract components
        specs.shelves = this.extractNumber(lowerPrompt, ['shelf', 'shelves']) || specs.shelves;
        specs.doors = this.extractNumber(lowerPrompt, ['door', 'doors']) || specs.doors;
        specs.drawers = this.extractNumber(lowerPrompt, ['drawer', 'drawers']) || specs.drawers;

        // Extract material
        for (const [key, value] of Object.entries(this.materials)) {
            if (lowerPrompt.includes(key)) {
                specs.material = key;
                break;
            }
        }

        // Extract cabinet type
        for (const type of Object.keys(this.types)) {
            if (lowerPrompt.includes(type)) {
                specs.type = type;
                break;
            }
        }

        // Special keywords for type detection
        if (lowerPrompt.includes('kitchen')) specs.type = 'base';
        if (lowerPrompt.includes('bathroom')) specs.type = 'vanity';
        if (lowerPrompt.includes('bookshelf') || lowerPrompt.includes('book')) specs.type = 'bookshelf';
        if (lowerPrompt.includes('display') || lowerPrompt.includes('glass')) {
            specs.type = 'display';
            specs.doors = Math.max(specs.doors, 2); // Display cabinets typically have doors
        }

        // Extract finish
        if (lowerPrompt.includes('painted') || lowerPrompt.includes('paint')) {
            specs.finish = 'painted';
        } else if (lowerPrompt.includes('stained') || lowerPrompt.includes('stain')) {
            specs.finish = 'stained';
        } else if (lowerPrompt.includes('natural')) {
            specs.finish = 'natural';
        }

        // Adjust dimensions based on type
        if (specs.type === 'tall' || specs.type === 'bookshelf') {
            specs.height = Math.max(specs.height, 60);
        } else if (specs.type === 'wall') {
            specs.height = Math.min(specs.height, 36);
        }

        // Validate and adjust specs
        specs.width = Math.max(12, Math.min(120, specs.width));
        specs.height = Math.max(12, Math.min(96, specs.height));
        specs.depth = Math.max(12, Math.min(36, specs.depth));
        specs.shelves = Math.max(0, Math.min(10, specs.shelves));
        specs.doors = Math.max(0, Math.min(4, specs.doors));
        specs.drawers = Math.max(0, Math.min(6, specs.drawers));

        return specs;
    }

    extractDimension(text, keywords) {
        for (const keyword of keywords) {
            // Look for patterns like "width 36", "36 inches wide", "36" wide", "36in wide"
            const patterns = [
                new RegExp(`${keyword}\\s*:?\\s*(\\d+\\.?\\d*)\\s*(?:inch|in|"|')?`, 'i'),
                new RegExp(`(\\d+\\.?\\d*)\\s*(?:inch|in|"|')?\\s*${keyword}`, 'i')
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match && match[1]) {
                    return parseFloat(match[1]);
                }
            }
        }
        return null;
    }

    extractNumber(text, keywords) {
        for (const keyword of keywords) {
            // Look for patterns like "3 shelves", "with 3 shelves"
            const pattern = new RegExp(`(\\d+)\\s*${keyword}`, 'i');
            const match = text.match(pattern);
            if (match && match[1]) {
                return parseInt(match[1], 10);
            }
        }
        return null;
    }

    getMaterialInfo(materialKey) {
        return this.materials[materialKey] || this.materials.oak;
    }

    getTypeInfo(typeKey) {
        return this.types[typeKey] || this.types.base;
    }

    formatSpecs(specs) {
        const material = this.getMaterialInfo(specs.material);
        const type = this.getTypeInfo(specs.type);

        return {
            'Type': type,
            'Dimensions': `${specs.width}" W × ${specs.height}" H × ${specs.depth}" D`,
            'Material': material.name,
            'Finish': specs.finish.charAt(0).toUpperCase() + specs.finish.slice(1),
            'Shelves': specs.shelves,
            'Doors': specs.doors,
            'Drawers': specs.drawers
        };
    }
}
