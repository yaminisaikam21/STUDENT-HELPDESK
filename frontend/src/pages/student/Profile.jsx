import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building2,
  BookOpen,
  Hash,
  ShieldCheck,
  Save,
  CheckCircle2,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    roll_number: '',
    department: '',
    hostel: '',
    room_number: '',
    guardian_name: '',
    guardian_phone: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        roll_number: user.student_profile?.roll_number || '',
        department: user.student_profile?.department || '',
        hostel: user.student_profile?.hostel || '',
        room_number: user.student_profile?.room_number || '',
        guardian_name: user.student_profile?.guardian_name || '',
        guardian_phone: user.student_profile?.guardian_phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await authService.updateProfile(formData);

      updateUser(res.user);

      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to update profile:', err);
      addToast('Failed to update profile details.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'Student';

  const initials = user?.first_name
    ? user.first_name[0].toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'S';

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-[#F4EBDD] border border-[#D8CBB9] text-[#2B211B] text-sm placeholder:text-[#8C8177] outline-none transition-all duration-200 focus:border-[#B58A4A] focus:ring-2 focus:ring-[#B58A4A]/20';

  const labelClass =
    'block text-[11px] font-bold uppercase tracking-[0.08em] text-[#75685D] mb-2';

  return (
    <div className="min-h-full bg-[#F4EBDD] text-[#2B211B]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-7"
        >
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75685D] hover:text-[#B58A4A] mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B58A4A] mb-3">
            <User className="w-3.5 h-3.5" />
            Student HelpDesk
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#2B211B]">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#75685D] max-w-2xl">
            Manage your personal, academic, residential and guardian details.
          </p>
        </motion.div>

        {/* PROFILE HERO */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative overflow-hidden rounded-[28px] border border-[#6E4A35] bg-[#3A2A20] px-6 sm:px-8 py-7 sm:py-8 mb-6 shadow-[0_10px_30px_rgba(43,33,27,0.12)]"
        >
          {/* Decorative circles */}
          <div className="absolute -right-16 -top-24 w-64 h-64 rounded-full border border-[#B58A4A]/20" />
          <div className="absolute -right-8 -bottom-32 w-64 h-64 rounded-full border border-[#B58A4A]/20" />
          <div className="absolute right-28 top-10 w-2 h-2 rounded-full bg-[#B58A4A]/70" />

          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl bg-[#5B3D2C] border border-[#8A6447] flex items-center justify-center shadow-lg">
              <span className="font-heading text-3xl sm:text-4xl font-bold text-[#B58A4A]">
                {initials}
              </span>
            </div>

            {/* Identity */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#B58A4A]">
                  Student Account
                </span>

                <span className="px-2.5 py-1 rounded-full bg-[#F3EBDD] text-[#6F4B35] text-[10px] font-bold">
                  {user?.role || 'STUDENT'}
                </span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#FFF9EF]">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-[#D7C8B8]">
                {user?.email || 'No email registered'}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#D7C8B8]">

                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#B58A4A]" />
                  {formData.roll_number || 'Roll number not set'}
                </span>

                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#B58A4A]" />
                  {formData.hostel || 'Hostel not assigned'}
                </span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#B58A4A]" />
                  Room {formData.room_number || '—'}
                </span>

              </div>
            </div>

            {/* Profile status */}
            <div className="hidden md:flex items-center gap-2 self-start px-3 py-2 rounded-xl border border-[#8A6447] bg-[#5B3D2C] text-xs text-[#E8DCCB]">
              <CheckCircle2 className="w-4 h-4 text-[#B58A4A]" />
              Profile
            </div>
          </div>
        </motion.div>

        {/* MAIN FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-[28px] border border-[#D8CBB9] bg-[#FFF9EF] overflow-hidden shadow-[0_8px_25px_rgba(43,33,27,0.08)]"
        >

          {/* FORM HEADER */}
          <div className="px-6 sm:px-8 py-6 border-b border-[#E3D8C9] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#B58A4A] mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Account Information
              </div>

              <h3 className="font-heading text-xl font-bold text-[#2B211B]">
                Edit Profile
              </h3>

              <p className="text-xs text-[#81756B] mt-1">
                Keep your campus information up to date.
              </p>
            </div>

            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#F4EBDD] border border-[#D8CBB9] items-center justify-center">
              <User className="w-5 h-5 text-[#B58A4A]" />
            </div>
          </div>

          {/* PERSONAL INFORMATION */}
          <div className="px-6 sm:px-8 py-7 border-b border-[#E3D8C9]">

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A6447]">
                Personal Information
              </h4>

              <p className="text-xs text-[#81756B] mt-1">
                Your basic contact and identity details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* First Name */}
              <div>
                <label className={labelClass}>
                  First Name
                </label>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className={labelClass}>
                  Last Name
                </label>

                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  Mobile Phone
                </label>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* ACADEMIC + RESIDENTIAL */}
          <div className="px-6 sm:px-8 py-7 border-b border-[#E3D8C9]">

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A6447]">
                Academic & Residential
              </h4>

              <p className="text-xs text-[#81756B] mt-1">
                Information used for campus and hostel services.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Roll Number */}
              <div>
                <label className={labelClass}>
                  Roll / USN
                </label>

                <div className="relative">
                  <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    className={`${inputClass} pl-10 font-mono uppercase`}
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className={labelClass}>
                  Department
                </label>

                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Hostel */}
              <div>
                <label className={labelClass}>
                  Hostel Block
                </label>

                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Room */}
              <div>
                <label className={labelClass}>
                  Room Number
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* GUARDIAN INFORMATION */}
          <div className="px-6 sm:px-8 py-7">

            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#8A6447]">
                Guardian Details
              </h4>

              <p className="text-xs text-[#81756B] mt-1">
                Contact information used for outpass verification.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Guardian Name */}
              <div>
                <label className={labelClass}>
                  Guardian Name
                </label>

                <div className="relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Guardian Phone */}
              <div>
                <label className={labelClass}>
                  Guardian Phone
                </label>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A08D7D] pointer-events-none" />

                  <input
                    type="text"
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

            </div>
          </div>

          {/* FOOTER / SAVE */}
          <div className="px-6 sm:px-8 py-5 bg-[#F4EBDD] border-t border-[#D8CBB9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div className="flex items-start gap-2.5 text-xs text-[#81756B]">
              <ShieldCheck className="w-4 h-4 text-[#B58A4A] shrink-0 mt-0.5" />

              <span>
                Your profile information is used for campus services and
                residential verification.
              </span>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C9A66B] hover:bg-[#B58A4A] text-[#2B211B] font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(181,138,74,0.18)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-[#2B211B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>

          </div>
        </motion.form>
      </div>
    </div>
  );
}
