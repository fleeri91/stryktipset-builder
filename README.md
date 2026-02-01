# Stryktipset Builder

A **Nuxt-based application** for building and managing **Stryktipset** entries.

Learn more about Nuxt in the official documentation:  
https://nuxt.com/docs/getting-started/introduction

---

## Setup

Install the project dependencies:

```bash
npm install
```

---

## Development

Start the development server at:

http://localhost:3000

```bash
npm run dev
```

---

## Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

For deployment options and best practices, see the Nuxt deployment guide:  
https://nuxt.com/docs/getting-started/deployment

---

# Project Architecture Documentation

This project is a **Nuxt-based full-stack application** with a clear separation between:

- **Frontend (App)**
- **Backend (Server)**
- **Shared code**

The goal is to keep features modular, reusable, and easy to scale.

---

## App (Frontend)

The `app/` directory contains all client-side code and UI-related logic.

### Assets

Static assets used across the frontend.

```
assets/
└── css/
    └── tailwind.css
```

- **tailwind.css**
  - Main Tailwind CSS entry file
  - Includes Tailwind directives and global styles

---

### Components

Reusable Vue components.

```
components/
├── functional/
└── ui/
```

- **functional/**
  - App-specific components
  - Stateless or logic-focused components
- **ui/**
  - Imported and wrapped components from **Shadcn**
  - Used as the base UI building blocks

---

### Composables

```
composables/
```

- Custom Vue composables (`useXxx`)
- Encapsulates reusable logic (API calls, state handling, helpers)
- Keeps components lean and readable

---

### Layouts

```
layouts/
```

- Defines different page layouts
- Examples:
  - Auth layout
  - Dashboard layout
  - Default layout
- Used by pages via `definePageMeta({ layout })`

---

### Libraries

```
libraries/
```

- Frontend-only utility functions
- Formatting helpers, constants, and shared logic
- No direct Vue or DOM dependencies (when possible)

---

### Middlewares

```
middlewares/
```

- Nuxt route middlewares
- Used for:
  - Authentication guards
  - Role-based access
  - Redirect logic

---

### Pages (Features)

```
pages/
├── auth/
├── event/
├── profile/
├── result/
└── team/
```

Pages are organized **by feature**, not by technical role.

- **Auth**
  - Login
  - Register
- **Event**
  - Create and manage events
  - Handles new event bongs
- **Profile**
  - User profile
  - Settings
- **Result**
  - Event results
- **Team**
  - Team creation and management

Each feature can contain:
- Pages
- Sub-routes
- Feature-specific components or composables

---

## Server (Backend)

The `server/` directory contains backend logic using Nuxt server routes.

---

### API

```
server/api/
├── auth/
├── bong/
├── event/
├── results/
├── team/
└── user/
```

- API endpoints grouped by domain
- Each folder represents a REST-like resource
- Handles request validation, authentication, and responses

---

### Models

```
server/models/
├── event-bong/
├── team/
└── user/
```

- Database models (e.g. Mongo/Mongoose)
- Defines schemas and relationships
- One folder per domain model

---

### Services

```
server/services/
```

- Business logic layer
- Used by API routes
- Keeps controllers thin and reusable
- Examples:
  - Event creation logic
  - Team membership rules
  - Result calculation

---

### Utilities

```
server/utilities/
```

- Backend-only helper functions
- No direct API or DB coupling
- Used across services and API routes

---

## Shared

Code shared between frontend and backend.

```
shared/
└── types/
```

---

### Types

```
shared/types/
├── bong/
├── mongo/
├── svenskaspel/
├── team/
└── user/
```

- Shared TypeScript types and interfaces
- Ensures type safety across the stack
- Used by:
  - Frontend components & composables
  - Backend services & API routes

---

## Design Principles

- Feature-first structure
- Clear separation of concerns
- Shared types for end-to-end safety
- Thin API routes, fat services
- Reusable UI and logic
