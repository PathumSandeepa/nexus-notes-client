# Nexus Notes Client

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_8-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

## 1. Project Overview

**Nexus Notes Client** is the frontend application for the Nexus Notes cloud engineering technical assessment. It provides a clean, responsive user interface to view, create, edit, and delete notes along with file attachments.

### Tech Stack
- **React 19 + TypeScript**: For building strongly-typed, modern UI components.
- **Vite 8**: Provides an extremely fast development server and optimized production builds.
- **Tailwind CSS v3 + shadcn/ui**: For highly customizable, utility-first styling and accessible UI components (Nova preset).
- **Axios**: Promise-based HTTP client for the browser to interact with the backend API.
- **pnpm**: Fast, disk-space efficient package manager.

## 2. Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm package manager

### Setup Steps
1. **Clone the repository:**
   `ash
   git clone <repository-url>
   cd nexus-notes-client
   `

2. **Install dependencies:**
   `ash
   pnpm install
   `

3. **Configure Environment Variables:**
   Create a .env file in the root directory and set your API endpoint:
   `env
   # Local Development
   VITE_API_URL=http://localhost:8000
   
   # Production (Example)
   # VITE_API_URL=http://13.229.118.243
   `

4. **Run the development server:**
   `ash
   pnpm dev
   `
   The application will be accessible at http://localhost:5173

## 3. Available Scripts

| Command | Description |
| :--- | :--- |
| pnpm dev | Starts the Vite development server with Hot Module Replacement (HMR). |
| pnpm build | Compiles TypeScript and builds the app for production in the dist/ directory. |
| pnpm lint | Runs ESLint to identify and report on patterns/errors in the codebase. |
| pnpm preview | Boots up a local web server to preview the production-built dist/ locally. |

## 4. Docker Build

This project utilizes a **multi-stage Dockerfile** for optimal production deployments:

- **Stage 1 (Builder)**: Uses 
ode:20-alpine to install dependencies via pnpm and compile the React application.
- **Stage 2 (Production)**: Uses 
ginx:alpine to serve the built static files (dist/) on port 80.

**Why this approach?** 
Serving static HTML/JS/CSS assets through an Nginx container creates an incredibly lightweight production image size. It safely isolates the application by ensuring the Node.js runtime and 
ode_modules are not running or exposed in the final production layer.

## 5. API Integration

The application interfaces with the backend via the base URL defined primarily by VITE_API_URL.

**Endpoints Used:**
- GET /api/notes/ - Retrieves all notes.
- POST /api/notes/ - Creates a new note.
- PUT /api/notes/:id/ - Updates an existing note.
- DELETE /api/notes/:id/ - Deletes a note.
- POST /api/notes/upload/ - Uploads a file.

**File Upload Flow:**
1. User attaches a file in the Note form interface.
2. The form converts the file to FormData and dispatches POST to /api/notes/upload/.
3. The backend stores the file (e.g. S3) and returns a public URL.
4. The client includes this retrieved ileUrl when completing the /api/notes/ generic payload.

## 6. Component Architecture

React state successfully flows top-down utilizing a custom hook pattern.

### hooks/useNotes.ts
The core logic handler maintaining the application's generic 
otes state. Serves loading constraints, error conditions, and executes CRUD network actions (etchNotes, createNote, updateNote, deleteNote, uploadFile).

### Key Components
- **HomePage.tsx**: Base wrapper connecting the API context (useNotes) to UI logic. Handles structural state forms/modals.
- **NoteList.tsx**: Presents a CSS grid containing a loading skeleton, zero-state fallback messaging, or a mapped iteration of Note elements.
- **NoteCard.tsx**: Renders an individual note object. Displays dynamic inline image previews based on the target extension falling back gracefully to standard UI badges.
- **NoteForm.tsx**: Toggleable Dialog handling form entries for creating and editing distinct notes. Oversees the dual staging file attachment pipeline logic.
- **DeleteDialog.tsx**: A confirmation safeguard alerting users before note destruction.
- **components/ui/***: Highly stylized, copy-and-paste accessible primitives maintained via shadcn/ui.
