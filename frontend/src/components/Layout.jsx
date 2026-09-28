import React from 'react';
import Navbar from './Navbar';
import NotificationDrawer from './NotificationDrawer';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <main className={isAuthenticated ? 'md:pl-[260px] min-h-screen' : ''}>{children}</main>
      <NotificationDrawer />
    </div>
  );
}
