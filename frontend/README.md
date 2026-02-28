# Premium Collaborative Whiteboard

A decentralized, real-time collaborative whiteboard built with React, Vite, and CRDTs (Yjs). This project enables multiple users to brainstorm, draw, and collaborate in real-time without a central server, ensuring eventual consistency through P2P synchronization.

## 🚀 Key Features

- **P2P Collaboration**: Real-time synchronization using WebRTC and CRDTs.
- **Premium Design**: Glassmorphic UI with backdrop blur and smooth animations.
- **Tools**: Pencil, Rectangle, Circle, Sticky Notes, and Text support.
- **Live Cursors**: See where your team is working with smooth cursor tracking.
- **Burst Pings**: Visual pings to grab attention or give feedback.
- **User List**: Floating indicator of active collaborators.

## 🔄 System Flow

Based on our decentralized architecture:

1. **User Joins Board**: The application initializes a local `Y.Doc` and connects to the P2P network.
2. **Peers Connect**: Discovery and signaling occur via WebRTC; nodes establish direct connections.
3. **Canvas Loads**: Local state is initialized, and synchronized with any existing peers.
4. **CRDT Operations**: Every graphical element (Path, Shape, Note, Text) is stored as a Conflict-Free Replicated Data Type.
5. **Broadcast**: Changes are broadcast peer-to-peer immediately upon interaction.
6. **Merge**: Distributed nodes merge changes mathematically, resolving conflicts automatically.
7. **Consistent UI**: All nodes update their rendering layers simultaneously for a unified experience.
8. **Smart Features**: Collaboration tools like live cursors and pings enhance the shared workspace.

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Collaboration**: [Yjs](https://yjs.dev/) + [y-webrtc](https://github.com/yjs/y-webrtc)
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **Icons**: Lucide React
- **Gestures**: @use-gesture/react

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔒 Security & Privacy

Since the system is P2P, data is shared directly between participants in the room. This reduces reliance on centralized databases and enhances user privacy for local or private brainstorming sessions.
