import React, { useEffect, useRef, useState } from 'react';

import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  FileCheck2,
  Home,
  Users,
  MessageSquare,
  BarChart3,
  Send,
  ChevronDown,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react';

import BrandLogo from './BrandLogo';

import { useAuth } from '../context/AuthContext';

import { useNotifications } from '../context/NotificationContext';

const publicLinks = [
  ['Roles', '#roles'],
  ['Why Us', '#why-us'],
  ['Problems', '#problems'],
  ['How It Works', '#how-it-works'],
  ['Services', '#services'],
  ['FAQs', '#faq'],
];

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
    isStudent,
    isWarden,
    isAdmin,
  } = useAuth();

  const { unreadCount, setIsDrawerOpen } = useNotifications();

  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  /*
   * Decide which dashboard belongs to the logged-in user.
   */
  const dashboardPath = isStudent
    ? '/student'
    : isWarden
      ? '/warden'
      : isAdmin
        ? '/admin'
        : '/';

  /*
   * Close profile dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /*
   * Close menus whenever route changes.
   */
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /*
   * Prevent background scrolling when mobile menu is open.
   */
  useEffect(() => {
    document.body.style.overflow = mobileOpen
      ? 'hidden'
      : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  /*
   * Logout.
   */
  const handleLogout = async () => {
    setMobileOpen(false);
    setProfileOpen(false);

    await logout();

    navigate('/');
  };

  /*
   * Navigate to landing-page sections.
   */
  const handlePublicNavigation = (href) => {
    setMobileOpen(false);

    if (location.pathname !== '/') {
      navigate(`/${href}`);
      return;
    }

    const element = document.querySelector(href);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      window.location.hash = href.replace('#', '');
    }
  };

  /*
   * Dashboard sidebar navigation.
   */
  const links = isStudent
    ? [
        ['Overview', '/student', Home],
        ['Complaints', '/complaints', MessageSquare],
        ['Outpasses', '/outpasses', FileCheck2],
      ]
    : isWarden
      ? [
          ['Overview', '/warden', LayoutDashboard],
          ['Outpass Desk', '/warden/outpasses', ClipboardList],
          ['Students', '/warden/students', Users],
        ]
      : isAdmin
        ? [
            ['Overview', '/admin', LayoutDashboard],
            ['Complaints', '/admin/complaints', MessageSquare],
            ['Outpasses', '/admin/outpasses', FileCheck2],
            ['Students', '/admin/students', Users],
            ['Reports', '/admin/reports', BarChart3],
            ['Broadcast', '/admin/broadcast', Send],
            ['Wardens', '/admin/wardens', ShieldCheck],
          ]
        : [];

  /*
   * Dashboard navigation item.
   */
  const nav = links.map(([label, to, Icon]) => (
    <NavLink
      key={to}
      to={to}
      end={
        to === '/student' ||
        to === '/warden' ||
        to === '/admin'
      }
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
          isActive
            ? 'bg-[#6B4A35] text-white shadow-sm'
            : 'text-[#E7D8C5]/75 hover:bg-white/10 hover:text-white'
        }`
      }
    >
      <Icon className="w-[17px]" />
      <span>{label}</span>
    </NavLink>
  ));

  /*
   * ============================================================
   * PUBLIC / LANDING PAGE NAVBAR
   *
   * Used when:
   * - User is not logged in
   * - OR logged-in user is currently on "/"
   * ============================================================
   */

  if (!isAuthenticated || isLandingPage) {
    return (
      <>
        <header className="sticky top-0 z-50 border-b border-[#D8CBB9] bg-brand-cream/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-5 sm:px-8">

            {/* Logo */}

            <div className="shrink-0">
              <BrandLogo linkTo="/" />
            </div>

            {/* Desktop Public Links */}

            <nav className="hidden lg:flex items-center gap-1">
              {publicLinks.map(([label, href]) => (
                <button
                  key={href}
                  type="button"
                  onClick={() =>
                    handlePublicNavigation(href)
                  }
                  className="rounded-lg px-3 py-2 text-sm font-semibold text-[#6B5B4E] hover:bg-[#EDE0D0] hover:text-[#6B4A35] transition-colors"
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Right Side */}

            <div className="hidden sm:flex items-center gap-2">

              {isAuthenticated ? (
                <>
                  {/* Dashboard */}

                  <Link
                    to={dashboardPath}
                    className="rounded-xl bg-[#EDE0D0] px-4 py-2 text-sm font-semibold text-[#6B4A35] hover:bg-[#E2D2BF] transition-colors"
                  >
                    Dashboard
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-xl bg-[#6B4A35] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#5B3D2C] transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Login */}

                  <Link
                    to="/login"
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-[#6B4A35] hover:bg-[#EDE0D0] transition-colors"
                  >
                    Login
                  </Link>

                  {/* Register */}

                  <Link
                    to="/register"
                    className="rounded-xl bg-[#6B4A35] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#5B3D2C] transition-colors"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Button */}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-xl p-2 text-[#6B4A35]"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Public Mobile Menu */}

        {mobileOpen && (
          <div className="fixed inset-0 z-[70] bg-[#2B211B]/50 lg:hidden">

            <div className="ml-auto h-full w-[min(88vw,360px)] bg-brand-cream p-5 shadow-2xl">

              <div className="flex items-center justify-between mb-7">
                <BrandLogo linkTo="/" />

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-[#6B4A35] hover:bg-[#EDE0D0]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-2">

                {publicLinks.map(([label, href]) => (
                  <button
                    key={href}
                    type="button"
                    onClick={() =>
                      handlePublicNavigation(href)
                    }
                    className="block w-full rounded-xl p-3 text-left font-semibold text-[#5B3D2C] hover:bg-[#EDE0D0] transition-colors"
                  >
                    {label}
                  </button>
                ))}

              </div>

              <div className="mt-8 grid gap-2">

                {isAuthenticated ? (
                  <>
                    <Link
                      to={dashboardPath}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="rounded-xl bg-[#EDE0D0] p-3 text-center font-semibold text-[#6B4A35]"
                    >
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-xl bg-[#6B4A35] p-3 text-center font-bold text-white"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="rounded-xl border border-[#D8CBB9] p-3 text-center font-semibold text-[#6B4A35]"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="rounded-xl bg-[#6B4A35] p-3 text-center font-bold text-white"
                    >
                      Create account
                    </Link>
                  </>
                )}

              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  /*
   * ============================================================
   * AUTHENTICATED DASHBOARD NAVBAR
   *
   * This is the IMPORTANT part that restores your sidebar.
   * ============================================================
   */

  return (
    <>
      {/* ========================================================
          DESKTOP SIDEBAR
      ======================================================== */}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[260px] flex-col border-r border-[#5B4030] bg-[#2B211B] md:flex">

        {/* Sidebar Logo */}

        <div className="flex h-[72px] items-center border-b border-white/10 px-5">
          <BrandLogo light linkTo="/" />
        </div>

        {/* Sidebar Navigation */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-2 text-[10px] font-extrabold uppercase tracking-[.18em] text-[#B89B7A]">
            Workspace
          </p>

          <nav className="space-y-1">
            {nav}
          </nav>

        </div>

        {/* Sidebar Bottom */}

        <div className="border-t border-white/10 p-4 space-y-2">

          {/* Notifications */}

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E7D8C5]/75 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Bell className="w-[17px]" />

            Notifications

            {unreadCount > 0 && (
              <span className="ml-auto rounded-full bg-[#B58A4A] px-1.5 py-0.5 text-[9px] font-black text-[#2B211B]">
                {unreadCount > 9
                  ? '9+'
                  : unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}

          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#E7D8C5]/75 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-[17px]" />

            Settings
          </Link>

          {/* Profile */}

          <div
            className="relative"
            ref={profileRef}
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(!profileOpen)
              }
              className="flex w-full items-center gap-3 rounded-xl bg-white/5 p-2.5 text-left hover:bg-white/10 transition-colors"
            >

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#6B4A35] font-bold text-[#F3EBDD]">
                {user?.first_name?.[0]?.toUpperCase() ||
                  user?.username?.[0]?.toUpperCase() ||
                  'U'}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {user?.first_name
                    ? `${user.first_name} ${
                        user.last_name || ''
                      }`
                    : user?.username}
                </p>

                <p className="text-[9px] font-bold uppercase tracking-wider text-[#B89B7A]">
                  {user?.role}
                </p>
              </div>

              <ChevronDown
                className={`w-4 text-[#B89B7A] transition-transform ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />

            </button>

            {/* Profile Dropdown */}

            {profileOpen && (
              <div className="absolute bottom-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-xl border border-[#D8CBB9] bg-[#FAF7F1] shadow-2xl">

                <div className="p-3 border-b border-[#D8CBB9]">
                  <p className="text-xs font-bold text-[#3A2A20] truncate">
                    {user?.email || user?.username}
                  </p>
                </div>

                {isStudent && (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#3A2A20] hover:bg-[#EDE0D0]"
                  >
                    <User className="w-4" />

                    My Profile
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-xs font-semibold text-[#7A563D] hover:bg-[#EDE0D0]"
                >
                  <LogOut className="w-4" />

                  Sign out
                </button>

              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================
          MOBILE DASHBOARD HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 flex h-[72px] items-center border-b border-[#D8CBB9] bg-brand-cream/95 px-4 backdrop-blur-xl md:hidden">

        <BrandLogo linkTo="/" />

        <div className="ml-auto flex items-center gap-1">

          {/* Notifications */}

          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="relative rounded-xl p-2 text-[#6B4A35]"
            aria-label="Open notifications"
          >
            <Bell className="w-5" />

            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#B58A4A]" />
            )}
          </button>

          {/* Menu */}

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2 text-[#6B4A35]"
            aria-label="Open menu"
          >
            <Menu className="w-6" />
          </button>

        </div>
      </header>

      {/* ========================================================
          MOBILE DASHBOARD MENU
      ======================================================== */}

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] bg-[#2B211B]/55 md:hidden">

          <div className="h-full w-[min(88vw,360px)] bg-[#2B211B] p-4 shadow-2xl">

            {/* Header */}

            <div className="mb-7 flex items-center justify-between">

              <BrandLogo light linkTo="/" />

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-2 text-[#E7D8C5] hover:bg-white/10"
              >
                <X />
              </button>

            </div>

            {/* Navigation */}

            <nav className="space-y-1">
              {nav}
            </nav>

            {/* Bottom Links */}

            <div className="mt-6 border-t border-white/10 pt-4">

              {/* Notifications */}

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setIsDrawerOpen(true);
                }}
                className="relative flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#E7D8C5] hover:bg-white/10"
              >
                <Bell className="w-4" />

                Notifications

                {unreadCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#B58A4A] px-1.5 py-0.5 text-[9px] font-black text-[#2B211B]">
                    {unreadCount > 9
                      ? '9+'
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Settings */}

              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#E7D8C5] hover:bg-white/10"
              >
                <Settings className="w-4" />

                Settings
              </Link>

              {/* Profile */}

              {isStudent && (
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#E7D8C5] hover:bg-white/10"
                >
                  <User className="w-4" />

                  My Profile
                </Link>
              )}

              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-sm font-semibold text-[#E7D8C5] hover:bg-white/10"
              >
                <LogOut className="w-4" />

                Sign out
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}