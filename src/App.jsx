
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

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
            {/* Public pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected workspace */}
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

            {/* Unknown pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
