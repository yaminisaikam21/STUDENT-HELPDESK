import React from 'react';
import { useLocation } from 'react-router-dom';

import Navbar from './Navbar';
import NotificationDrawer from './NotificationDrawer';

import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  /*
   * The landing page "/" must use the full screen.
   * Dashboard pages need 260px space for the sidebar.
   */
  const isLandingPage =
    location.pathname === '/';

  const showDashboardSpacing =
    isAuthenticated && !isLandingPage;

  return (
    <div className="min-h-screen bg-brand-cream">

      <Navbar />

      <main
        className={
          showDashboardSpacing
            ? 'md:pl-[260px] min-h-screen'
            : 'min-h-screen'
        }
      >
        {children}
      </main>

      <NotificationDrawer />

    </div>
  );
}