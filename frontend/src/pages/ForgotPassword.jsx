import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Mail,
  CheckCircle2,
} from 'lucide-react';

import BrandLogo from '../components/BrandLogo';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);

      const data = await authService.forgotPassword(
        email.trim()
      );

      setSuccess(data.message);
      setEmail('');
    } catch (err) {
      const message =
        err.response?.data?.email?.[0] ||
        err.response?.data?.detail ||
        'Unable to process your request. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* Back to Login */}

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

        {/* Card */}

        <div className="rounded-3xl border border-[#6B4A35] bg-[#3A2A20] p-7 sm:p-8 shadow-2xl">

          {/* Icon */}

          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4A3426] text-[#C9A66B]">
            <KeyRound className="w-6 h-6" />
          </div>

          {/* Heading */}

          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C9A66B]">
            Account Recovery
          </p>

          <h1 className="mt-2 font-heading text-2xl font-extrabold text-[#F7F1E8]">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#B89B7A]">
            Enter the email address associated with your Student
            HelpDesk account. We'll send you a secure password reset
            link.
          </p>

          {/* Success */}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald-700/50 bg-emerald-950/30 p-3.5 text-xs text-emerald-300 flex gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="mt-5 rounded-xl border border-rose-800/60 bg-rose-950/40 p-3.5 text-xs text-rose-300">
              {error}
            </div>
          )}

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold text-[#E7D8C5]"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A58F79]" />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-[#6B4A35] bg-[#241B16] py-3 pl-10 pr-4 text-sm text-[#F7F1E8] placeholder-[#A58F79] outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#C9A66B] px-4 py-3 text-sm font-bold text-[#2B211B] hover:bg-[#B58A4A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {/* Security Message */}

          <div className="mt-6 rounded-2xl border border-[#6B4A35] bg-[#33251D] p-4">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 shrink-0 text-[#C9A66B]" />

              <p className="text-xs leading-5 text-[#E7D8C5]">
                For security, we don't reveal whether an email
                address is registered with the system.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-[#B89B7A]">
              Remember your password?{' '}

              <Link
                to="/login"
                className="font-semibold text-[#C9A66B] hover:underline"
              >
                Sign in
              </Link>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}