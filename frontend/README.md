# Frontend Documentation

## Overview

A modern React application built with Vite for project management, featuring JWT authentication, responsive design, and seamless backend integration.

![React](https://img.shields.io/badge/React-19.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.3-orange)
![React Router](https://img.shields.io/badge/React_Router-7.6-lightgrey)
![Axios](https://img.shields.io/badge/Axios-1.9-green)

## Project Structure

```bash
frontend/
├── src/
│   ├── api/               # API configuration
│   ├── components/        # UI components
│   │   ├── auth/          # Authentication forms
│   │   ├── layout/        # App layout
│   │   ├── projects/      # Project management
│   │   └── tasks/         # Task management
│   ├── contexts/          # React contexts
│   └── App.jsx            # Root component
├── public/
├── .eslintrc.js           # ESLint configuration
└── package.json           # Dependencies
```

## ✨Key Features

### 🔐Authentication Flow

```mermaid
sequenceDiagram
    User->>Login: Submit credentials
    Login->>API: POST /login
    API->>AuthContext: JWT token
    AuthContext->>LocalStorage: Store token
    AuthContext->>PrivateRoute: Grant access
    PrivateRoute->>ProjectList: Render content
```

### 🧩Component Architecture

```mermaid
flowchart TD
    App --> AuthProvider
    App --> BrowserRouter
    BrowserRouter --> Header
    BrowserRouter --> Routes
    Routes --> Login
    Routes --> Register
    Routes --> PrivateRoute
    PrivateRoute --> ProjectList
    PrivateRoute --> ProjectDetail
    ProjectDetail --> TaskList
    TaskList --> TaskForm
```

## 🛠️Getting Started

### Prerequisites

* Node.js 18+
* npm 9+

### Installation

To install the project locally, simply run the `setup_local_dev.sh` script located in the root directory.

### Dependencies

Full list in `package.json`

### Available Scripts

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Create production build  |
| `npm run lint`    | Run ESLint checks        |
| `npm run preview` | Preview production build |

### Vite Features

* Lightning fast HMR
* SWC React plugin
* Production optimizations
* Environment variables support

## 🚀Deployment

### Infrastructure Overview

```mermaid
flowchart TD
    A[Client] --> B[AWS EC2]
    B --> C[Nginx:443]
    C --> D[Frontend:80]
    C --> E[Backend API:5512]
    D --> F[React Build]
    E --> G[Gunicorn/Flask]
```

## 🔒 Security Features

* JWT authentication
* Protected routes
* Secure HTTP headers
* CSRF protection
* Form validation
* Error boundary handling
* SSL certificate
