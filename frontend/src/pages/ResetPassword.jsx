import React, { useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

import BrandLogo from '../components/BrandLogo';
import { authService } from '../services/authService';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!uid || !token) {
      setError('This password reset link is invalid.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please enter both password fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      const data = await authService.resetPassword({
        uid,
        token,
        new_password: password,
        confirm_password: confirmPassword,
      });

      setSuccess(data.message);

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1800);

    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.new_password?.[0] ||
        err.response?.data?.confirm_password?.[0] ||
        'This password reset link is invalid or expired.';

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">

        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-[#6B4A35] bg-transparent px-3 py-2 text-xs font-semibold text-[#6B4A35] hover:bg-[#6B4A35]/10 transition-colors"
          >
            <ArrowLeft className="w-4" />
            Back to login
          </Link>

          <BrandLogo linkTo="/" />
        </div>

        <div className="rounded-3xl border border-[#6B4A35] bg-[#3A2A20] p-7 sm:p-8 shadow-2xl">

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4A3426] text-[#C9A66B]">
            {success ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A66B]">
            Password Reset
          </p>

          <h1 className="mt-2 font-heading text-2xl font-extrabold text-[#F7F1E8]">
            Create a new password
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#B89B7A]">
            Choose a new password for your Student HelpDesk account.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3.5 text-xs text-rose-300 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-3.5 text-xs text-emerald-300 flex gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {!success && (
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#E7D8C5]">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-[#6B4A35] bg-[#241B16] px-4 py-3 pr-12 text-sm text-[#F7F1E8] placeholder-[#A58F79] outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#A58F79] hover:text-[#C9A66B] transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#E7D8C5]">
                  Confirm New Password
                </label>

                <div className="relative">

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    className="w-full rounded-xl border border-[#6B4A35] bg-[#241B16] px-4 py-3 pr-12 text-sm text-[#F7F1E8] placeholder-[#A58F79] outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    disabled={loading}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#A58F79] hover:text-[#C9A66B] transition-colors"
                    aria-label={
                      showConfirmPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>

                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#C9A66B] px-4 py-3 text-sm font-bold text-[#2B211B] hover:bg-[#B58A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          {success && (
            <p className="mt-4 text-center text-xs text-[#B89B7A]">
              Redirecting you to the login page...
            </p>
          )}

        </div>
      </div>
    </div>
  );
}
      