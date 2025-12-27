# Cabinet CAD Designer - AI-Powered Web App

A modern web-based CAD application for designing wooden cabinets using natural language prompts. Built with Three.js for 3D visualization.

## 🚀 Features

- **Natural Language Design**: Describe your cabinet in plain English
- **3D Visualization**: Real-time 3D rendering with Three.js
- **Parametric Design**: Automatically generates cabinets based on specifications
- **Multiple Cabinet Types**: Base, wall, tall, vanity, bookshelf, and display cabinets
- **Wood Materials**: Oak, Pine, Maple, Walnut, Cherry, Mahogany, Birch, and White painted finish
- **Interactive Controls**: Rotate, pan, and zoom with mouse controls
- **Export Functionality**: Export design specifications and material lists
- **Responsive UI**: Clean, modern interface with gradient design

## 🎯 Quick Start

1. **Open the Application**
   - Simply open `index.html` in a modern web browser
   - No build process or dependencies required (uses CDN for Three.js)

2. **Design a Cabinet**
   - Enter a prompt like: "Kitchen cabinet 48 inches wide, 36 inches tall, oak finish"
   - Click "Generate Cabinet" or press Ctrl+Enter
   - View your design in the 3D viewport

3. **Interact with the Design**
   - **Left click + drag**: Rotate view
   - **Right click + drag**: Pan view
   - **Scroll**: Zoom in/out
   - Use view buttons for preset camera angles

## 📝 Example Prompts

Try these example prompts to get started:

```
Kitchen cabinet 36" wide, 30" tall, 24" deep, oak finish
Tall bookshelf cabinet 72" high, walnut wood, 5 shelves
Bathroom vanity 48" wide, white painted finish, 2 drawers
Display cabinet 40" wide, glass doors, cherry wood
Base cabinet 60 inches wide, 3 shelves, 2 doors, maple
Wall cabinet 30" wide, 18" tall, pine, natural finish
```

## 🔧 How It Works

### Prompt Parser
The application uses a natural language parser that extracts:
- **Dimensions**: Width, height, depth (in inches)
- **Components**: Number of shelves, doors, drawers
- **Materials**: Wood type (oak, pine, maple, walnut, cherry, etc.)
- **Finish**: Natural, stained, or painted
- **Cabinet Type**: Automatically detected from keywords

### 3D Generation
- Uses Three.js for WebGL rendering
- Parametric cabinet model generation
- Realistic wood materials and textures
- Shadow mapping for depth perception
- Interactive camera controls with OrbitControls

### Supported Features
- **Dimensions**: 12" to 120" width, 12" to 96" height, 12" to 36" depth
- **Shelves**: 0-10 adjustable shelves
- **Doors**: 0-4 doors with handles
- **Drawers**: 0-6 drawers with hardware
- **Materials**: 8 wood types + painted finishes

## 📁 Project Structure

```
cad-web-app/
├── index.html           # Main HTML file
├── styles.css           # Application styles
├── app.js              # Main application controller
├── cabinetGenerator.js # 3D model generation logic
├── promptParser.js     # Natural language parser
└── README.md           # This file
```

## 🎨 Technologies Used

- **Three.js**: 3D graphics rendering
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and animations
- **HTML5**: Semantic markup

## 🖥️ Browser Compatibility

Requires a modern browser with WebGL support:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Future Enhancements

Potential features for future versions:
- AI integration with GPT models for more complex prompts
- STL/OBJ export for 3D printing
- Material cost calculator
- Cut list generator for woodworking
- Photo-realistic rendering
- Save/load designs
- Collaboration features
- Mobile touch controls optimization

## 📖 Usage Tips

1. **Be Specific**: Include dimensions for best results
   - Good: "48 inch wide kitchen cabinet"
   - Better: "48" wide, 30" tall, 24" deep kitchen cabinet"

2. **Use Keywords**: Mention wood type, cabinet type, and components
   - Examples: "oak", "walnut", "kitchen", "bookshelf", "shelves", "doors"

3. **Standard Dimensions**: The app works best with typical cabinet sizes
   - Kitchen base: 24" deep, 30-36" tall
   - Kitchen wall: 12" deep, 30-42" tall
   - Bathroom vanity: 21" deep, 30-36" tall

4. **View Controls**:
   - Use preset view buttons for standard angles
   - Reset view if you lose orientation
   - Toggle grid for reference

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Share your designs

## 📄 License

MIT License - Feel free to use and modify for your projects.

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Cabinet Making Basics](https://www.woodmagazine.com/woodworking-plans/cabinets)

---

**Enjoy designing your custom cabinets!** 🪵✨

For questions or support, please open an issue on GitHub.
