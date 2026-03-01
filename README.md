##PPT & Video link
- https://drive.google.com/drive/folders/1f3yvD1QWZyqiAdcGc5QbNKoNmVGEzTvL?usp=sharing
# SyncCanvas: Distributed Real-Time Collaborative Whiteboard

## 🧠 The Problem Statement

Real-time collaboration tools have become essential in modern development, design, and remote teamwork workflows. Whiteboards are commonly used for brainstorming, architecture design, and planning sessions. However, most collaborative tools rely on centralized servers for synchronization.

In distributed environments, centralized systems introduce latency, single points of failure, and dependency on internet connectivity. Peer-to-peer systems offer resilience and decentralization, but handling concurrent edits without conflicts remains technically complex.

Conflict-Free Replicated Data Types (CRDTs) provide a mathematical framework for enabling real-time collaboration without central coordination, ensuring eventual consistency across distributed nodes.

### The Challenge
There is no lightweight, peer-to-peer whiteboard system that:
- Synchronizes graphical elements in real time
- Handles concurrent edits without merge conflicts
- Works without a central server
- Maintains state consistency across devices on a local network

**Key challenges include:**
- Implementing CRDTs for graphical objects (shapes, text, sticky notes)
- Managing peer discovery over local networks
- Handling simultaneous drawing operations
- Ensuring eventual consistency without overwriting changes

Distributed graphical state synchronization is significantly more complex than text-based collaboration.

### The Consequence
Without a robust synchronization model:
- Conflicts occur during simultaneous edits
- Data inconsistencies appear across users
- Edits may be lost or overwritten
- Centralized dependencies reduce resilience
- Teams lack a decentralized, reliable collaboration tool for local or offline environments.

---

## 💡 The Solution

We designed **SyncCanvas**, a real-time collaborative whiteboard that embraces distributed systems principles to deliver a visually interactive, conflict-free collaboration tool.

**Key features of our solution:**
- **Incremental State Syncing:** Instead of re-transmitting entire canvas states (which causes lag and overwrites), the system isolates individual stroke boundaries and emits strictly versioned object deltas to peers.
- **Conflict-Free Reconciliation:** Using Excalidraw's component tree and Socket.IO, incoming graphical deltas from multiple simultaneous users are spliced into the local state tree dynamically. A "last-writer-wins" strategy is executed at the individual element level (via version tagging), preventing entire canvas overwrites.
- **Yjs for Extensible Data:** Alongside the canvas, we integrate **Yjs** (a modular CRDT framework) traversing over WebRTC/WebSockets to gracefully guarantee mathematical eventual consistency for text-based collaboration (like side-panel Minigames and awareness presence).
- **Persistent Snapshotting:** The database acts not as a bottleneck, but rather as an asynchronous persistent snapshotter. When users leave, the eventual state is packed into a JSON BLOB and mapped to the relational ecosystem.

## 🌟 Features That Stand Out
Beyond core whiteboard synchronization, this project includes several auxiliary systems that elevate it from a tech demo to a fully-fledged collaboration platform:

- **Integrated Video Calling (WebRTC):** Users in a room can instantly connect via video directly inside the sidebar, enabling face-to-face brainstorming without switching apps.
- **Embedded Real-Time Chat:** A persistent, socket-driven chat interface overlaying the board for quick text-based communication that is saved automatically to the database.
- **Unified Dark/Light Mode Engine:** A deeply integrated theming system that synchronizes Excalidraw's canvas palette seamlessly with the application's Tailwind CSS wrapping shell.

---

## 🛠 Tech Stack

### Frontend
- **React 19 & Vite:** Lightning-fast UI rendering and building.
- **Excalidraw:** Embedded virtual canvas engine for rich graphical drawing (shapes, freehand, arrows, text).
- **Yjs:** Core Conflict-Free Replicated Data Type (CRDT) implementation for deterministic state resolution.
- **Socket.io-client:** Real-time bidirectional event-based communication.
- **TailwindCSS & Lucide-React:** Rapid, modern, responsive styling and iconography.

### Backend
- **Node.js & Express:** Lightweight, scalable server environment for handling API routing and WebSocket handshakes.
- **Socket.IO:** Powers the WebSocket rooms, emitting peer-to-peer drawing signals and WebRTC signaling for video/audio.
- **Prisma ORM:** Type-safe database client and schema management.
- **MySQL:** Relational database for storing user accounts, board metadata, and serialized Canvas JSON data.

---

## 🗄 Database Schema Structure

The application's persistent layer uses a relational MySQL database orchestrated through Prisma. The schema is optimized for managing ownership and multi-session historical data.

### 1. `User` Table
Maintains authentication and identities for the platform.
- `id` (UUID, Primary Key)
- `email` (Unique String)
- `password` (Hashed String)
- `name` (String)
- **Relations:** 
  - `boards` (One-to-Many: Boards owned by the user)
  - `shared` (Many-to-Many: Boards where the user is a collaborator)

### 2. `Board` Table
Represents a physical whiteboard project.
- `id` (UUID, Primary Key)
- `name` (String)
- `data` (JSON Blob): The serialized, persistent array of Excalidraw's graphical elements.
- `ownerId` (Foreign Key -> User)
- **Relations:** 
  - `sessions` (One-to-Many)
  - `collaborators` (Many-to-Many -> User)
  - `messages` (One-to-Many -> ChatMessage)

### 3. `Session` Table
Tracks active collaborative connections for analytics and ghost-prevention.
- `id` (UUID, Primary Key)
- `boardId` (Foreign Key -> Board)
- `isActive` (Boolean): Active state of drawing.
- `startTime` & `endTime` (DateTime)

### 4. `ChatMessage` Table
Persists the real-time chat history bounding to a specific board.
- `id` (UUID, Primary Key)
- `boardId` (Foreign Key -> Board)
- `userName` (String)
- `message` (Text)
- `createdAt` (DateTime)
