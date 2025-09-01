# Project NETRA - Frontend

<div align="center">

<pre>
███╗   ██╗███████╗████████╗██████╗  █████╗
████╗  ██║██╔════╝╚══██╔══╝██╔══██╗██╔══██╗
██╔██╗ ██║█████╗     ██║   ██████╔╝███████║
██║╚██╗██║██╔══╝     ██║   ██╔══██╗██╔══██║
██║ ╚████║███████╗   ██║   ██║  ██║██║  ██║
╚═╝  ╚═══╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>

**Frontend Application for AI-Powered Financial Intelligence Platform**

[![React](https://img.shields.io/badge/react-18.2+-blue.svg)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/vite-5.1+-purple.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.4+-teal.svg)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/firebase-10.8+-orange.svg)](https://firebase.google.com)

</div>

## 🔍 Overview

The Project Netra frontend is a sophisticated React application that provides law enforcement and financial intelligence units with an intuitive, powerful interface for detecting and analyzing money laundering networks. Built with modern web technologies, it offers real-time data visualization, AI-powered insights, and comprehensive case management capabilities.

## ✨ Key Features

### 🏠 **Dashboard**

- **Real-time Alert Monitoring**: Live feed of suspicious activity alerts
- **Priority-based Filtering**: Organize alerts by risk severity levels
- **Quick Action Cards**: One-click access to investigation tools
- **Statistics Overview**: Key metrics and performance indicators

### 🔍 **Investigation Workspace**

- **Interactive Network Graphs**: 3D visualization of financial networks using React-Force-Graph-2D
- **Entity Deep Dive**: Comprehensive profiles for persons, companies, and accounts
- **Transaction Timeline**: Chronological view of financial activities
- **Case Notes System**: Real-time collaborative note-taking
- **Multi-tab Interface**: Seamless navigation between investigation components

### 🎯 **Triage System**

- **Risk Factor Analysis**: AI-powered risk assessment summaries
- **Case Prioritization**: Smart routing based on threat levels
- **Batch Processing**: Handle multiple alerts efficiently
- **Decision Support**: Data-driven recommendations for investigators

### 📊 **Reporting & Analytics**

- **PDF Report Generation**: Professional, court-ready documentation
- **Interactive Charts**: Dynamic data visualization with Recharts
- **Export Capabilities**: Multiple format support for data sharing
- **Custom Dashboards**: Personalized analytics views

### � **Security & Authentication**

- **Firebase Authentication**: Secure login with multi-factor support
- **Role-based Access Control**: Granular permissions management
- **Session Management**: Automatic timeout and token refresh
- **Audit Trail**: Complete user activity logging

## 🛠️ Technology Stack

### **Core Framework**

- **React 18.2+** - Modern UI framework with concurrent features
- **Vite 5.1+** - Lightning-fast build tool and dev server
- **React Router 6.22+** - Client-side routing and navigation

### **Styling & UI**

- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **Responsive Design** - Mobile-first approach with adaptive layouts

### **Data Visualization**

- **React-Force-Graph-2D 1.28+** - Interactive network graph visualization
- **Recharts 2.12+** - Composable charting library
- **ReactFlow 11.11+** - Advanced flow and node-based diagrams

### **Authentication & Backend**

- **Firebase 10.8+** - Authentication, Firestore, and hosting
- **RESTful API Integration** - Communication with Flask backend
- **Real-time Updates** - Live data synchronization

### **Development Tools**

- **ESLint** - Code quality and consistency
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixes
- **TypeScript Support** - Type definitions for better development

## 📁 Project Structure

```
frontend/
├── public/                     # Static assets
│   ├── index.html             # HTML template
│   └── favicon.ico            # Application icon
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── LoginForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── common/           # Shared components
│   │   │   ├── Button.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── dashboard/        # Dashboard specific
│   │   │   ├── AlertCard.jsx
│   │   │   ├── AlertsList.jsx
│   │   │   └── PriorityFilter.jsx
│   │   ├── triage/           # Triage system
│   │   │   ├── RiskFactorSummary.jsx
│   │   │   └── TriageActions.jsx
│   │   └── workspace/        # Investigation workspace
│   │       ├── CaseSummary.jsx
│   │       ├── EntityDetailsCard.jsx
│   │       ├── FinancialTimeline.jsx
│   │       ├── NetworkGraph.jsx
│   │       └── NotesPanel.jsx
│   ├── pages/                # Page components
│   │   ├── Dashboard.jsx
│   │   ├── InvestigationWorkspace.jsx
│   │   ├── LoginPage.jsx
│   │   ├── NotFound.jsx
│   │   ├── Reporting.jsx
│   │   ├── SettingsPage.jsx
│   │   └── Triage.jsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.jsx
│   │   └── useFetchData.jsx
│   ├── services/             # API and external services
│   │   └── api.js
│   ├── firebase/             # Firebase configuration
│   │   └── firebaseConfig.js
│   ├── styles/               # Global styles
│   │   └── index.css
│   ├── assets/               # Static assets
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Application entry point
├── docs/                     # Documentation
│   ├── Project_Architecture.png
│   └── Hackathon_Presentation.pptx
├── package.json             # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## 🏗️ Architecture Overview

### **Data Flow**

```
User Interface → React Components → Custom Hooks → API Service → Flask Backend
      ↓              ↓                ↓            ↓            ↓
   Firebase Auth → State Management → HTTP Requests → Data Processing → Neo4j/ML Models
```

### **Component Hierarchy**

```
App.jsx
├── Header.jsx (Navigation & User Menu)
├── Sidebar.jsx (Main Navigation)
└── Router
    ├── Dashboard.jsx
    │   ├── AlertsList.jsx
    │   └── PriorityFilter.jsx
    ├── InvestigationWorkspace.jsx
    │   ├── NetworkGraph.jsx
    │   ├── EntityDetailsCard.jsx
    │   ├── FinancialTimeline.jsx
    │   └── NotesPanel.jsx
    ├── Triage.jsx
    └── Reporting.jsx
```

A detailed architecture diagram is available in `frontend/docs/Project_Architecture.png`.

## 🚀 Quick Start

### Prerequisites

Before starting, ensure you have the following installed:

- **Node.js 18.x+** - [Download here](https://nodejs.org)
- **npm or yarn** - Package manager (comes with Node.js)
- **Git** - Version control system
- **Firebase Account** - For authentication and database
- **Neo4j Instance** - For graph database (handled by backend)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnuragWaskle/project-NETRA.git
   cd project-NETRA/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**

   Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)

   Update `src/firebase/firebaseConfig.js` with your configuration:

   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id",
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory (optional for additional config):

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Project NETRA
VITE_FIREBASE_API_KEY=your_firebase_api_key
```

### Vite Configuration

The project uses a custom Vite configuration (`vite.config.js`):

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts", "react-force-graph-2d"],
          ui: ["lucide-react"],
        },
      },
    },
  },
});
```

## 📱 User Interface Components

### Authentication Flow

```
LoginPage → Firebase Auth → Protected Routes → Dashboard
    ↓
Error Handling → Redirect to Login
    ↓
Success → Store User Context → Enable Navigation
```

### Main Navigation Structure

- **Dashboard** - Overview and alert monitoring
- **Investigation** - Detailed case analysis workspace
- **Triage** - Case prioritization and routing
- **Reporting** - PDF generation and analytics
- **Settings** - User preferences and configuration

### Component Reusability

All components are designed with reusability in mind:

- **Atomic Design** - Atoms, molecules, organisms pattern
- **Props Interface** - Well-defined prop types
- **Theme Consistency** - Unified design system
- **Accessibility** - WCAG 2.1 AA compliance

## 🧪 Testing & Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Run tests (if configured)
npm test
```

### Development Workflow

1. **Feature Development**

   ```bash
   git checkout -b feature/new-feature
   npm run dev
   # Make changes
   npm run lint
   npm run build  # Test production build
   ```

2. **Component Testing**

   - Use React Developer Tools for debugging
   - Test responsive design with browser dev tools
   - Verify Firebase authentication flow
   - Check API integration with Network tab

3. **Performance Monitoring**
   - Use Lighthouse for performance audits
   - Monitor bundle size with `npm run build`
   - Check for memory leaks in long-running sessions

### Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🔄 API Integration

### Backend Communication

The frontend communicates with the Flask backend through REST APIs:

```javascript
// src/services/api.js
const API_BASE_URL = "http://localhost:5000";

export const apiService = {
  // Authentication
  login: (credentials) =>
    fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    }),

  // Data fetching
  getAlerts: () => fetch(`${API_BASE_URL}/api/alerts`),
  getPersons: () => fetch(`${API_BASE_URL}/api/persons`),
  getTransactions: () => fetch(`${API_BASE_URL}/api/transactions`),

  // Case management
  createCase: (caseData) =>
    fetch(`${API_BASE_URL}/api/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(caseData),
    }),

  // Report generation
  generateReport: (reportConfig) =>
    fetch(`${API_BASE_URL}/api/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reportConfig),
    }),
};
```

### Data Flow

```
React Component → Custom Hook → API Service → Backend → Database
     ↓              ↓             ↓           ↓         ↓
State Update ← Response ← HTTP Response ← Processing ← Query Result
```

## 🎨 Styling & Theming

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        danger: {
          500: "#ef4444",
          700: "#b91c1c",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
```

### Design System

- **Typography** - Inter font family with consistent sizing
- **Color Palette** - Professional blue/gray theme with accent colors
- **Spacing** - 8px grid system for consistent layouts
- **Components** - Reusable button, card, and form components

## 🔐 Security Considerations

### Authentication Security

- **Firebase Auth** - Industry-standard authentication
- **JWT Tokens** - Secure token-based authentication
- **Route Protection** - Protected routes for authenticated users
- **Session Management** - Automatic token refresh and logout

### Data Security

- **HTTPS Only** - Secure communication in production
- **Input Validation** - Client-side and server-side validation
- **XSS Protection** - React's built-in XSS protection
- **CSRF Protection** - Token-based request validation

## 📈 Performance Optimization

### Build Optimization

- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Unused code elimination
- **Asset Optimization** - Image and bundle optimization
- **Caching Strategy** - Service worker for offline support

### Runtime Performance

- **Lazy Loading** - Components loaded on demand
- **Memoization** - React.memo for expensive components
- **Virtual Scrolling** - For large data lists
- **Debounced Inputs** - Optimized search and filtering

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

1. **Vercel** (Recommended)

   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Netlify**

   ```bash
   npm run build
   # Upload dist/ folder to Netlify
   ```

3. **Firebase Hosting**

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   npm run build
   firebase deploy
   ```

4. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 5173
   CMD ["npm", "run", "preview"]
   ```

### Environment-Specific Configuration

- **Development** - Hot reload, source maps, debugging tools
- **Staging** - Production build with debugging enabled
- **Production** - Optimized build, error tracking, analytics

## 🛠️ Troubleshooting

### Common Issues

#### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### Firebase Connection Issues

- Verify Firebase configuration in `firebaseConfig.js`
- Check Firebase project settings and API keys
- Ensure Firebase Authentication is enabled

#### API Connection Issues

- Verify backend server is running on port 5000
- Check CORS settings in Flask backend
- Verify API endpoints in `src/services/api.js`

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---