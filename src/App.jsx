
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context providers
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Authentication
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Workspace pages
import { Dashboard } from './pages/Dashboard';
import { Roadmaps } from './pages/Roadmaps';
import { AIWorkspace } from './pages/AIWorkspace';
import { Education } from './pages/Education';
import { DeveloperTools } from './pages/DeveloperTools';
import { Documents } from './pages/Documents';
import { Productivity } from './pages/Productivity';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>

            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected workspace routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/ai-workspace" element={<AIWorkspace />} />
                <Route path="/education" element={<Education />} />
                <Route path="/developer-tools" element={<DeveloperTools />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/productivity" element={<Productivity />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
