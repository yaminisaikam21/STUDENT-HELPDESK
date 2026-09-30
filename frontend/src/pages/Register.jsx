import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlus,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import BrandLogo from '../components/BrandLogo';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirm_password: '',
    roll_number: '',
    department: '',
    hostel: '',
    room_number: '',

    // Parent / Guardian details
    guardian_name: '',
    guardian_phone: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirm_password) {
      setErrors({
        confirm_password: ['Passwords do not match.'],
      });
      return;
    }

    if (!formData.guardian_name.trim()) {
      setErrors({
        guardian_name: ['Parent / Guardian name is required.'],
      });
      return;
    }

    if (!formData.guardian_phone.trim()) {
      setErrors({
        guardian_phone: ['Parent / Guardian phone number is required.'],
      });
      return;
    }

    try {
      setLoading(true);

      await register(formData);

      addToast(
        'Student account registered successfully! Welcome to HelpDesk.',
        'success'
      );

      navigate('/student', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);

      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: ['Network error. Please try again.'],
        });
      }

      addToast(
        'Registration could not be completed. Check the errors.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-cream">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full space-y-6"
      >
        {/* Back to Home */}

        <div className="mb-5 flex justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#6B4A35] bg-transparent px-3 py-2 text-xs font-semibold text-[#6B4A35] hover:bg-[#6B4A35]/10 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        {/* Header */}

        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <BrandLogo linkTo="/" />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#6B4A35]">
            Student Registration
          </h2>

          <p className="text-xs sm:text-sm text-[#8B684D]">
            Create your official campus service profile to raise
            tickets and apply for outpasses
          </p>
        </div>

        {/* Registration Information */}

        <div className="p-3.5 rounded-2xl bg-[#33251D] border border-[#6B4A35] text-xs text-[#E7D8C5] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#C9A66B]" />

          <span>
            Public registration provisions{' '}
            <strong className="text-[#F7F1E8]">
              Student accounts
            </strong>
            . Warden and Admin accounts are provisioned securely
            by Campus Authorities.
          </span>
        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-[#3A2A20] border border-[#6B4A35] shadow-2xl space-y-5"
        >
          {/* General Errors */}

          {errors.non_field_errors && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />

              <span>
                {Array.isArray(errors.non_field_errors)
                  ? errors.non_field_errors[0]
                  : errors.non_field_errors}
              </span>
            </div>
          )}

          {/* =====================================================
              ACCOUNT & CREDENTIALS
          ===================================================== */}

          <div className="border-b border-[#6B4A35] pb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A66B] mb-3">
              Account & Credentials
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Username */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Username *
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="e.g. harshitha"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />

                {errors.username && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.username)
                      ? errors.username[0]
                      : errors.username}
                  </p>
                )}
              </div>

              {/* Email */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Campus Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@student.campus.edu"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />

                {errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.email)
                      ? errors.email[0]
                      : errors.email}
                  </p>
                )}
              </div>

              {/* First Name */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  First Name *
                </label>

                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Harshitha"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />
              </div>

              {/* Last Name */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Last Name
                </label>

                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Rao"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                />
              </div>

              {/* Password */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Password *
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />

                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.password)
                      ? errors.password[0]
                      : errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Confirm Password *
                </label>

                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />

                {errors.confirm_password && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.confirm_password)
                      ? errors.confirm_password[0]
                      : errors.confirm_password}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* =====================================================
              STUDENT & HOSTEL DETAILS
          ===================================================== */}

          <div className="pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A66B] mb-3">
              Student & Hostel Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Roll Number */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Roll / USN Number *
                </label>

                <input
                  type="text"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  placeholder="e.g. 21CS042"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none uppercase font-mono transition-all"
                  required
                />

                {errors.roll_number && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.roll_number)
                      ? errors.roll_number[0]
                      : errors.roll_number}
                  </p>
                )}
              </div>

              {/* Student Phone */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Mobile Contact *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                  required
                />

                {errors.phone && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.phone)
                      ? errors.phone[0]
                      : errors.phone}
                  </p>
                )}
              </div>

              {/* Department */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                />
              </div>

              {/* Hostel */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Hostel Block
                </label>

                <input
                  type="text"
                  name="hostel"
                  value={formData.hostel}
                  onChange={handleChange}
                  placeholder="e.g. Cauvery Hostel (Block B)"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                />
              </div>

              {/* Room Number */}

              <div>
                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Room Number
                </label>

                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleChange}
                  placeholder="e.g. B-304"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                />
              </div>

            </div>
          </div>

          {/* =====================================================
              PARENT / GUARDIAN DETAILS
          ===================================================== */}

          <div className="pt-4 border-t border-[#6B4A35]">

            <div className="flex items-center gap-2 mb-1">

              <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />

              <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A66B]">
                Parent / Guardian Details
              </h3>

            </div>

            <p className="text-[11px] text-[#B89B7A] mb-4">
              Enter the parent or guardian details used for official
              outpass verification.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Guardian Name */}

              <div>

                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Parent / Guardian Name *
                </label>

                <div className="relative">

                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B]" />

                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                    required
                  />

                </div>

                {errors.guardian_name && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.guardian_name)
                      ? errors.guardian_name[0]
                      : errors.guardian_name}
                  </p>
                )}

              </div>

              {/* Guardian Phone */}

              <div>

                <label className="block text-xs font-semibold text-[#E7D8C5] mb-1">
                  Parent / Guardian Phone *
                </label>

                <div className="relative">

                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B]" />

                  <input
                    type="tel"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F7F1E8] placeholder-[#A58F79] focus:ring-2 focus:ring-[#C9A66B] outline-none transition-all"
                    required
                  />

                </div>

                {errors.guardian_phone && (
                  <p className="text-[11px] text-rose-400 mt-1">
                    {Array.isArray(errors.guardian_phone)
                      ? errors.guardian_phone[0]
                      : errors.guardian_phone}
                  </p>
                )}

              </div>

            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#241B16] border border-[#6B4A35] flex items-start gap-2">

              <ShieldCheck className="w-4 h-4 text-[#C9A66B] mt-0.5 shrink-0" />

              <p className="text-[11px] text-[#B89B7A] leading-relaxed">
                The registered parent / guardian contact will be
                used for outpass verification.
              </p>

            </div>

          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#C9A66B] hover:bg-[#B58A4A] text-[#2B211B] font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-[#2B211B] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>
                  Complete Student Registration
                </span>
              </>
            )}
          </button>

          {/* Login */}

          <div className="text-center pt-2">

            <span className="text-xs text-[#B89B7A]">
              Already registered?{' '}

              <Link
                to="/login"
                className="font-semibold text-[#C9A66B] hover:underline"
              >
                Sign in here
              </Link>
            </span>

          </div>

        </form>
      </motion.div>
    </div>
  );
}