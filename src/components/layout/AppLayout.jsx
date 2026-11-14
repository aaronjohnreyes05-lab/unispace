
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';

export const AppLayout = () => {
  const location = useLocation();

  // Dashboard already has its own Alien X background.
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-hidden">

        {/* Navbar */}
        <Navbar />

        {/* Main workspace */}
        <main className="flex-1 min-h-0 relative isolate overflow-y-auto overflow-x-hidden bg-slate-950">

          {/* Alien X background for workspace pages */}
          {!isDashboard && (
            <div className="workspace-cosmos" aria-hidden="true">

              <div className="workspace-stars" />

              <div className="workspace-nebula workspace-nebula-one" />
              <div className="workspace-nebula workspace-nebula-two" />
              <div className="workspace-nebula workspace-nebula-three" />

              <div className="workspace-energy workspace-energy-one" />
              <div className="workspace-energy workspace-energy-two" />

            </div>
          )}

          {/* Current page */}
          <div
            key={location.pathname}
            className={`page-transition relative z-10 p-6 lg:p-8 max-w-full ${
              isDashboard ? '' : 'workspace-page'
            }`}
          >
            <Outlet />
          </div>

        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette />

    </div>
  );
};
