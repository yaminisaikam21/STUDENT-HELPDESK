import React, { useEffect, useState } from 'react';

import {
  KeyRound,
  Bell,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Lock,
  CheckCircle2,
} from 'lucide-react';

import { authService } from '../../services/authService';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // =========================================================
  // NOTIFICATION PREFERENCES
  // =========================================================

  const defaultNotifications = {
    complaints: true,
    outpasses: true,
    safety: true,
  };

  const [notifications, setNotifications] = useState(
    defaultNotifications
  );

  const [notificationLoading, setNotificationLoading] =
    useState(true);

  const [notificationSaving, setNotificationSaving] =
    useState(false);

  // Load notification preferences from Django
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        setNotificationLoading(true);

        const data =
          await notificationService.getPreferences();

        setNotifications({
          complaints: data.complaints ?? true,
          outpasses: data.outpasses ?? true,
          safety: data.safety ?? true,
        });
      } catch (err) {
        console.error(
          'Failed to load notification preferences:',
          err
        );

        addToast(
          'Could not load notification preferences.',
          'error'
        );
      } finally {
        setNotificationLoading(false);
      }
    };

    loadNotificationPreferences();
  }, [addToast]);

  // Update notification preference in Django
  const handleNotificationToggle = async (type) => {
    if (
      notificationLoading ||
      notificationSaving
    ) {
      return;
    }

    const previous = notifications;

    const updated = {
      ...previous,
      [type]: !previous[type],
    };

    // Update UI immediately
    setNotifications(updated);

    setNotificationSaving(true);

    try {
      const saved =
        await notificationService.updatePreferences(
          updated
        );

      setNotifications({
        complaints:
          saved.complaints ?? updated.complaints,

        outpasses:
          saved.outpasses ?? updated.outpasses,

        safety:
          saved.safety ?? updated.safety,
      });

      addToast(
        'Notification preference updated.',
        'success'
      );
    } catch (err) {
      console.error(
        'Failed to update notification preferences:',
        err
      );

      // Restore previous state if API fails
      setNotifications(previous);

      addToast(
        'Failed to save notification preference.',
        'error'
      );
    } finally {
      setNotificationSaving(false);
    }
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (
      passwords.new_password !==
      passwords.confirm_new_password
    ) {
      setError('New passwords do not match.');
      return;
    }

    if (passwords.new_password.length < 6) {
      setError(
        'New password must be at least 6 characters long.'
      );
      return;
    }

    try {
      setLoading(true);

      await authService.changePassword({
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      });

      addToast(
        'Password changed successfully.',
        'success'
      );

      setPasswords({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      });
    } catch (err) {
      const msg =
        err.response?.data?.old_password?.[0] ||
        'Failed to change password. Check current password.';

      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* =========================================================
          PAGE HEADER
      ========================================================= */}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-brand-cream border border-brand-border flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-brand-brown" />
          </div>

          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-brand-brown">
            Account Control
          </span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
          Account & Security
        </h1>

        <p className="mt-1 text-xs sm:text-sm text-brand-muted">
          Manage your credentials, notifications, and active session.
        </p>
      </div>

      {/* =========================================================
          SECURITY OVERVIEW
      ========================================================= */}

      <div className="rounded-2xl border border-brand-border bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4 text-brand-brown" />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-brown mb-1">
                Security Status
              </p>

              <h2 className="text-sm sm:text-base font-heading font-bold text-brand-dark">
                Your account is protected
              </h2>

              <p className="text-xs text-brand-muted mt-0.5">
                Keep your password private and use a strong password for your account.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-full bg-brand-cream border border-brand-border text-brand-brown text-[10px] font-bold uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Secure
          </div>
        </div>
      </div>

      <div className="space-y-5">

        {/* =======================================================
            CHANGE PASSWORD
        ======================================================= */}

        <section className="rounded-3xl bg-white border border-brand-border/80 overflow-hidden shadow-xs">

          <div className="px-5 sm:px-7 py-5 border-b border-brand-border">
            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-brand-brown" />
              </div>

              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Change Password
                </h3>

                <p className="text-xs text-brand-muted mt-0.5">
                  Update your account password securely.
                </p>
              </div>

            </div>
          </div>

          <div className="p-5 sm:p-7">

            <form
              onSubmit={handlePasswordChange}
              className="max-w-2xl space-y-5"
            >

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">

                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

                  <span>{error}</span>

                </div>
              )}

              {/* Current Password */}

              <div>

                <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-2">
                  Current Password *
                </label>

                <div className="relative">

                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                  <input
                    type="password"
                    value={passwords.old_password}
                    onChange={(e) =>
                      setPasswords((p) => ({
                        ...p,
                        old_password: e.target.value,
                      }))
                    }
                    placeholder="Enter your current password"
                    className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-border bg-slate-50/50 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20"
                    required
                  />

                </div>

              </div>

              {/* New Passwords */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-2">
                    New Password *
                  </label>

                  <div className="relative">

                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                    <input
                      type="password"
                      value={passwords.new_password}
                      onChange={(e) =>
                        setPasswords((p) => ({
                          ...p,
                          new_password: e.target.value,
                        }))
                      }
                      placeholder="At least 6 characters"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-border bg-slate-50/50 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20"
                      required
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-[11px] font-bold uppercase tracking-wide text-slate-700 mb-2">
                    Confirm New Password *
                  </label>

                  <div className="relative">

                    <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                    <input
                      type="password"
                      value={passwords.confirm_new_password}
                      onChange={(e) =>
                        setPasswords((p) => ({
                          ...p,
                          confirm_new_password: e.target.value,
                        }))
                      }
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-brand-border bg-slate-50/50 text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/20"
                      required
                    />

                  </div>

                </div>

              </div>

              {/* Password Requirement */}

              <div className="rounded-xl bg-brand-cream border border-brand-border p-3.5">

                <div className="flex items-start gap-2.5">

                  <ShieldCheck className="w-4 h-4 text-brand-brown shrink-0 mt-0.5" />

                  <div>

                    <p className="text-xs font-semibold text-brand-dark">
                      Password requirement
                    </p>

                    <p className="text-[11px] text-brand-muted mt-0.5 leading-relaxed">
                      Your new password must contain at least 6 characters.
                    </p>

                  </div>

                </div>

              </div>

              {/* Submit */}

              <div className="pt-1">

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-gold hover:bg-brand-gold-hover text-brand-dark font-bold text-xs sm:text-sm shadow-gold-glow transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin" />

                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />

                      <span>Update Password</span>
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </section>

        {/* =======================================================
            NOTIFICATION PREFERENCES
        ======================================================= */}

        <section className="rounded-3xl bg-white border border-brand-border/80 overflow-hidden shadow-xs">

          <div className="px-5 sm:px-7 py-5 border-b border-brand-border">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center">
                <Bell className="w-5 h-5 text-brand-brown" />
              </div>

              <div>

                <h3 className="font-heading font-bold text-base sm:text-lg text-brand-dark">
                  Notification Preferences
                </h3>

                <p className="text-xs text-brand-muted mt-0.5">
                  Choose which campus notifications you want to receive.
                </p>

              </div>

            </div>

          </div>

          <div className="p-5 sm:p-7">

            <div className="space-y-3">

              {/* Complaint Notifications */}

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border">

                <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-brand-brown" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-brand-dark">
                    Complaint lifecycle updates
                  </p>

                  <p className="text-[11px] text-brand-muted mt-1">
                    Submission, assignment, progress, and resolution updates.
                  </p>

                </div>

                <div className="flex items-center gap-3 shrink-0">

                  <span
                    className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider ${
                      notifications.complaints
                        ? 'text-brand-brown'
                        : 'text-slate-400'
                    }`}
                  >
                    {notificationLoading
                      ? '...'
                      : notifications.complaints
                        ? 'ON'
                        : 'OFF'}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.complaints}
                    aria-label="Toggle complaint notifications"
                    disabled={
                      notificationLoading ||
                      notificationSaving
                    }
                    onClick={() =>
                      handleNotificationToggle(
                        'complaints'
                      )
                    }
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                      notifications.complaints
                        ? 'bg-brand-brown'
                        : 'bg-slate-300'
                    }`}
                  >

                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                        notifications.complaints
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />

                  </button>

                </div>

              </div>

              {/* Outpass Notifications */}

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border">

                <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-brand-brown" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-brand-dark">
                    Hostel outpass updates
                  </p>

                  <p className="text-[11px] text-brand-muted mt-1">
                    Outpass status and parent verification confirmations.
                  </p>

                </div>

                <div className="flex items-center gap-3 shrink-0">

                  <span
                    className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider ${
                      notifications.outpasses
                        ? 'text-brand-brown'
                        : 'text-slate-400'
                    }`}
                  >
                    {notificationLoading
                      ? '...'
                      : notifications.outpasses
                        ? 'ON'
                        : 'OFF'}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.outpasses}
                    aria-label="Toggle outpass notifications"
                    disabled={
                      notificationLoading ||
                      notificationSaving
                    }
                    onClick={() =>
                      handleNotificationToggle(
                        'outpasses'
                      )
                    }
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                      notifications.outpasses
                        ? 'bg-brand-brown'
                        : 'bg-slate-300'
                    }`}
                  >

                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                        notifications.outpasses
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />

                  </button>

                </div>

              </div>

              {/* Safety Notifications */}

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-brand-cream border border-brand-border">

                <div className="w-10 h-10 rounded-xl bg-white border border-brand-border flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-brand-brown" />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-sm font-semibold text-brand-dark">
                    Campus safety announcements
                  </p>

                  <p className="text-[11px] text-brand-muted mt-1">
                    Important campus-wide safety and maintenance alerts.
                  </p>

                </div>

                <div className="flex items-center gap-3 shrink-0">

                  <span
                    className={`hidden sm:block text-[10px] font-bold uppercase tracking-wider ${
                      notifications.safety
                        ? 'text-brand-brown'
                        : 'text-slate-400'
                    }`}
                  >
                    {notificationLoading
                      ? '...'
                      : notifications.safety
                        ? 'ON'
                        : 'OFF'}
                  </span>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={notifications.safety}
                    aria-label="Toggle campus safety notifications"
                    disabled={
                      notificationLoading ||
                      notificationSaving
                    }
                    onClick={() =>
                      handleNotificationToggle(
                        'safety'
                      )
                    }
                    className={`relative w-12 h-7 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-brown/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                      notifications.safety
                        ? 'bg-brand-brown'
                        : 'bg-slate-300'
                    }`}
                  >

                    <span
                      className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                        notifications.safety
                          ? 'left-6'
                          : 'left-1'
                      }`}
                    />

                  </button>

                </div>

              </div>

            </div>

            <div className="mt-5 pt-4 border-t border-brand-border flex items-center gap-2 text-[10px] text-brand-muted">

              <Bell className="w-3.5 h-3.5 text-brand-brown shrink-0" />

              <span>
                {notificationLoading
                  ? 'Loading your notification preferences...'
                  : notificationSaving
                    ? 'Saving your notification preferences...'
                    : 'Your notification preferences are saved to your account.'}
              </span>

            </div>

          </div>

        </section>

        {/* =======================================================
            SIGN OUT
        ======================================================= */}

        <section className="rounded-2xl bg-rose-50 border border-rose-200 p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                <LogOut className="w-4 h-4 text-rose-600" />
              </div>

              <div>

                <h4 className="text-sm font-bold text-rose-800">
                  Sign Out of Current Session
                </h4>

                <p className="text-xs text-rose-600/70 mt-0.5">
                  You can sign back in at any time with your credentials.
                </p>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors self-start sm:self-auto"
            >

              <LogOut className="w-3.5 h-3.5" />

              <span>Sign Out</span>

            </button>

          </div>

        </section>

      </div>

    </div>
  );
}