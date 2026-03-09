# 🚀 Lightweight Drag & Drop Newsletter Builder

A high-performance, accessible Drag & Drop editor prototype built with React, Vite, and `@dnd-kit`. 

**Live Demo:** [newsletterdrop.netlify.app](https://newsletterdrop.netlify.app/)

## 🧠 Architecture & Technical Decisions

This project was built to demonstrate modern React architecture, focusing on performance, state management, and testability-key requirements for building scalable tools like a newsletter editor.

### 1. Drag & Drop Engine (`@dnd-kit`)
Instead of relying on heavy, legacy HTML5 drag-and-drop wrappers, I chose `@dnd-kit`. 
* **Why?** It's modular, headless, and doesn't mutate the DOM directly. It relies on React state, making it extremely fast and accessible out of the box (screen-reader friendly).

### 2. State Management (Data over DOM)
The canvas state is managed as an array of JSON objects (e.g., `{ id: '1', type: 'button', content: '...' }`).
* **Why?** Storing structural data rather than raw HTML nodes allows for lightning-fast React reconciliation, easy serialization for REST APIs, and straightforward implementation of features like Undo/Redo or exporting to email-safe HTML.

### 3. Performance Optimization (Addressing large component trees)
Rendering hundreds of blocks in an editor can cause the main thread to bottleneck. To mitigate this:
* **Memoization:** Components rendered inside the droppable canvas are wrapped in `React.memo` to prevent unnecessary re-renders when the drag state of other components changes.
* **Scalability:** For a production environment with thousands of nodes, this architecture is primed for DOM virtualization (e.g., `react-window`), ensuring only visible blocks are rendered.

## 🧪 Testing Strategy

Writing maintainable code means writing testable code. This prototype includes a testing suite configured with **Vitest** and **React Testing Library**.

* **Unit Tests (`Canvas.test.tsx`):** Verifies that the Canvas component correctly renders the empty state placeholder and accurately maps through the state array when blocks are passed via props.
* **Why Vitest?** It provides instant feedback loops and native support for Vite's module resolution and TypeScript, making the testing experience seamless.

## 💻 Tech Stack
* **Framework:** React 18 + TypeScript + Vite
* **UI/Styling:** Tailwind CSS + shadcn/ui + Lucide Icons
* **DND Logic:** `@dnd-kit/core` & `@dnd-kit/sortable`
* **Testing:** Vitest + jsdom + React Testing Library

## 🚀 Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Run tests: `npm run test`
