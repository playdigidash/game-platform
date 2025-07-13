# DigiDash Core 🎮

> Open source 3D educational trivia game engine built with React Three Fiber

[![License: BSL-1.1](https://img.shields.io/badge/License-BSL--1.1-blue.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/%40digidash%2Fcore.svg)](https://www.npmjs.com/package/@digidash/core)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

Create immersive 3D educational trivia games with customizable content, themes, and gameplay. Perfect for universities, training programs, and educational initiatives.

## ✨ Features

- 🎯 **Interactive 3D Trivia Runner** - Engaging gameplay with obstacle courses
- 📚 **Flexible Content System** - JSON-based game configuration
- 🎨 **Customizable Themes** - Brand your games with custom assets and colors
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔧 **Data Provider Pattern** - Replace MongoDB with local storage or custom backends
- 🚀 **React Integration** - Drop-in component for React applications
- 📊 **Progress Tracking** - Built-in session and user progress management
- ♿ **Accessibility** - Screen reader support and keyboard navigation

## 🚀 Quick Start

### Installation

```bash
npm install @digidash/core @digidash/data
```

### Basic Usage

```tsx
import React from 'react';
import { DigiDashApp, JSONFileDataProvider } from '@digidash/core';

function App() {
  const dataProvider = new JSONFileDataProvider('/games/');

  return (
    <DigiDashApp
      gameId="sustainability-dash"
      dataProvider={dataProvider}
      onGameComplete={(session) => {
        console.log('Game completed!', session);
      }}
    />
  );
}
```

### Game Configuration

Create a `game.json` file:

```json
{
  "moduleId": "my-trivia-game",
  "settings": {
    "gTitle": "Campus Sustainability Challenge",
    "gDesc": "Learn while you run!",
    "music": true,
    "limit": 10,
    "random": false
  },
  "trivia": [
    {
      "id": "q1",
      "question": "What percentage of campus energy comes from renewable sources?",
      "answers": ["25%", "50%", "75%"],
      "correctAnswer": 2,
      "explanation": "Our campus runs on 75% renewable energy!"
    }
  ]
}
```

## 📦 Architecture

DigiDash Core follows a modular architecture:

```
@digidash/core          # Main game engine
├── @digidash/data      # Data abstraction layer
├── examples/           # Ready-to-use templates
└── docs/              # Documentation
```

### Data Providers

Choose your data source:

```tsx
// Local Storage (for development)
import { LocalStorageDataProvider } from '@digidash/data';
const provider = new LocalStorageDataProvider();

// Static JSON Files (for demos)
import { JSONFileDataProvider } from '@digidash/data';
const provider = new JSONFileDataProvider('/games/');

// Custom Implementation
class CustomDataProvider implements IGameDataProvider {
  async loadGame(gameId: string) {
    // Your custom logic here
  }
}
```

## 🎨 Customization

### Themes

```tsx
const customTheme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#8BC34A'
  },
  background: {
    textures: {
      baseColor: 'backgrounds/campus-quad.jpg'
    }
  }
};

<DigiDashApp theme={customTheme} /* ... */ />
```

### Custom Assets

Structure your assets folder:

```
public/
├── assets/
│   ├── models/         # .glb/.gltf 3D models
│   ├── textures/       # Background images
│   └── sounds/         # Audio files
└── games/
    └── my-game/
        └── game.json   # Game configuration
```

## 🛠️ Development

### Setup

```bash
git clone https://github.com/digidash/digidash-core.git
cd digidash-core
npm install
npm run build
```

### Running Examples

```bash
cd examples/basic-trivia
npm install
npm start
```

### Building Packages

```bash
npm run build        # Build all packages
npm run dev         # Watch mode
npm run clean       # Clean build artifacts
```

## 📖 Examples

### University Onboarding

Perfect for new student orientation with campus-specific trivia.

### Corporate Training

Gamify compliance training, safety procedures, or product knowledge.

### Marketing Campaigns

Create branded experiences that educate customers about your products.

### Educational Content

Transform any curriculum into an engaging 3D experience.

## 🔧 API Reference

### DigiDashApp Props

| Prop | Type | Description |
|------|------|-------------|
| `gameId` | `string` | ID of the game to load |
| `gameData` | `IGameModule` | Pre-loaded game data |
| `dataProvider` | `IGameDataProvider` | Data source implementation |
| `theme` | `object` | Custom theme configuration |
| `onGameComplete` | `function` | Callback when game ends |
| `onError` | `function` | Error handler |

### Game Configuration Schema

```typescript
interface IGameModule {
  moduleId: string;
  settings: IGameSettings;
  trivia: ITrivia[];
  obstacles?: IObstacle[];
  avatars?: IAvatar[];
  theme?: IGameTheme;
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the Business Source License 1.1 (BSL-1.1).

**Summary:**
- ✅ **Open Source**: Full source code available
- ✅ **Free for Non-Production**: Use freely for development, testing, education
- ✅ **Modification Allowed**: Create derivatives and improvements
- ⚠️ **Production Licensing**: Contact us for commercial production use
- 🔄 **Converts to Apache 2.0**: Becomes fully open source after 4 years

See [LICENSE](LICENSE) for the full license text.

## 🆘 Support

- 📖 **Documentation**: [Full API Docs](https://digidash.github.io/digidash-core)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/digidash/digidash-core/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/digidash/digidash-core/discussions)
- 💼 **Commercial Support**: [Contact LidVizion](mailto:support@lidvizion.com)

## 🌟 Roadmap

- [ ] **Q1 2024**: VR/AR support with WebXR
- [ ] **Q2 2024**: Multiplayer capabilities
- [ ] **Q3 2024**: Visual game editor
- [ ] **Q4 2024**: Analytics dashboard

## 🙏 Acknowledgments

Built with love using:
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - 3D rendering
- [Three.js](https://threejs.org/) - 3D graphics library
- [MobX](https://mobx.js.org/) - State management
- [Material-UI](https://mui.com/) - UI components

---

<div align="center">
  <strong>Ready to create amazing educational experiences?</strong>
  <br />
  <a href="https://github.com/digidash/digidash-core/stargazers">⭐ Star us on GitHub</a>
</div> 
