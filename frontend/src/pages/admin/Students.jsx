import React, { useState, useEffect } from 'react';

import {
  Search,
  Users,
  Power,
  Plus,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

import { adminService } from '../../services/adminService';

import { useToast } from '../../context/ToastContext';

import LoadingSkeleton, {
  EmptyState
} from '../../components/LoadingSkeleton';

export default function AdminStudents() {

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  const [togglingId, setTogglingId] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);

  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    guardian_name: '',
    guardian_phone: '',
  });

  const { addToast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const data = await adminService.getStudents(search);

      setStudents(
        data.results || data || []
      );

    } catch (err) {
      console.error(
        'Failed to load students:',
        err
      );

      addToast(
        'Failed to load students.',
        'error'
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchStudents();
    }, 250);

    return () => clearTimeout(delay);
  }, [search]);

  const handleToggleActive = async (
    studentId,
    currentStatus
  ) => {
    try {
      setTogglingId(studentId);

      const res =
        await adminService.toggleUserActive(
          studentId
        );

      setStudents((prev) =>
        prev.map((student) =>
          student.id === studentId
            ? {
                ...student,
                is_active: res.is_active
              }
            : student
        )
      );

      addToast(
        res.message,
        'success'
      );

    } catch (err) {
      console.error(
        'Error toggling user status:',
        err
      );

      addToast(
        'Failed to toggle user status.',
        'error'
      );

    } finally {
      setTogglingId(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
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
      guardian_name: '',
      guardian_phone: '',
    });
  };

  const closeModal = () => {
    if (saving) return;

    setShowAddModal(false);
    resetForm();
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const response =
        await adminService.createStudent(formData);

      addToast(
        response.message ||
          'Student account created successfully.',
        'success'
      );

      setShowAddModal(false);

      resetForm();

      await fetchStudents();

    } catch (err) {
      console.error(
        'Failed to create student:',
        err
      );

      const errors = err.response?.data;

      if (errors?.confirm_password) {
        addToast(
          errors.confirm_password[0],
          'error'
        );
      } else if (errors?.username) {
        addToast(
          errors.username[0],
          'error'
        );
      } else if (errors?.guardian_phone) {
        addToast(
          errors.guardian_phone[0],
          'error'
        );
      } else if (errors?.guardian_name) {
        addToast(
          errors.guardian_name[0],
          'error'
        );
      } else {
        addToast(
          'Failed to create student account.',
          'error'
        );
      }

    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brand-dark">
            Student Registry & Account Controls
          </h1>

          <p className="text-xs sm:text-sm text-brand-muted">
            Active roster of campus students, residential assignments, and account authorization status
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-brown text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>

      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white border border-brand-border/80 shadow-xs">

        <div className="relative">

          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">

            <Search className="w-4 h-4" />

          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name, USN/roll number, department, or hostel..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-brand-border bg-slate-50/50 focus:ring-2 focus:ring-brand-brown outline-none"
          />

        </div>

      </div>

      {/* Student List */}
      {loading ? (

        <LoadingSkeleton count={3} />

      ) : students.length === 0 ? (

        <div className="rounded-2xl bg-[#3A2A20] border border-white/10 p-6">

          <EmptyState
            title="No students found"
            message="No records matched your search query."
            actionLabel="Clear Search"
            onAction={() => setSearch('')}
            icon={Users}
          />

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {students.map((stu) => {

            const profile =
              stu.student_profile || {};

            const isToggling =
              togglingId === stu.id;

            return (

              <div
                key={stu.id}
                className="p-5 rounded-2xl bg-[#3A2A20] border border-white/10 hover:border-brand-brown/50 transition-all flex flex-col justify-between space-y-4"
              >

                {/* Student Information */}
                <div className="space-y-3">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-[#4A3426] text-brand-gold font-bold flex items-center justify-center text-sm border border-brand-brown/30">

                        {stu.first_name
                          ? stu.first_name[0].toUpperCase()
                          : stu.username
                            ? stu.username[0].toUpperCase()
                            : 'S'}

                      </div>

                      <div>

                        <h3 className="font-heading font-bold text-sm text-white">

                          {stu.first_name
                            ? `${stu.first_name} ${stu.last_name || ''}`.trim()
                            : stu.username}

                        </h3>

                        <p className="text-[11px] text-white/55 truncate max-w-[140px]">

                          {stu.email || 'No email'}

                        </p>

                      </div>

                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        stu.is_active
                          ? 'bg-brown-400/10 text-[#C9A66B] border-[#CDBDAA]/30'
                          : 'bg-rose-400/10 text-rose-300 border-rose-300/20'
                      }`}
                    >

                      {stu.is_active
                        ? 'Active'
                        : 'Disabled'}

                    </span>

                  </div>

                  {/* Student Profile */}
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1.5">

                    <div className="flex justify-between gap-3">

                      <span className="text-white/55">
                        Roll / USN:
                      </span>

                      <span className="font-bold text-white font-mono">
                        {profile.roll_number || 'N/A'}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-white/55">
                        Department:
                      </span>

                      <span className="font-medium text-white truncate max-w-[140px]">
                        {profile.department || 'General'}
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-white/55">
                        Hostel & Room:
                      </span>

                      <span className="font-medium text-white">
                        {profile.hostel || 'Dorm'}
                        {' '}
                        ({profile.room_number || 'N/A'})
                      </span>

                    </div>

                    <div className="flex justify-between gap-3">

                      <span className="text-white/55">
                        Mobile:
                      </span>

                      <span className="font-medium text-white">
                        {stu.phone ||
                          profile.phone ||
                          'N/A'}
                      </span>

                    </div>

                  </div>

                  {/* Guardian */}
                  {profile.guardian_name && (

                    <div className="text-xs text-white/75 bg-white/5 p-2.5 rounded-xl border border-amber-300/20">

                      <span className="font-semibold text-amber-300 block mb-0.5">
                        Parent / Guardian:
                      </span>

                      <div className="flex justify-between gap-3">

                        <span>
                          {profile.guardian_name}
                        </span>

                        <span className="font-mono font-semibold text-white">
                          {profile.guardian_phone || 'N/A'}
                        </span>

                      </div>

                    </div>

                  )}

                </div>

                {/* Account Controls */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">

                  <span className="text-white/45 text-[11px]">
                    Joined{' '}
                    {stu.date_joined
                      ? new Date(
                          stu.date_joined
                        ).toLocaleDateString()
                      : 'N/A'}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(
                        stu.id,
                        stu.is_active
                      )
                    }
                    disabled={isToggling}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-1.5 ${
                      stu.is_active
                        ? 'bg-rose-400/10 text-rose-300 border-rose-300/20 hover:bg-rose-400/20'
                        : 'bg-brown-400/10 text-[#C9A66B] border-[#CDBDAA]/30 hover:bg-brown-400/20'
                    } ${
                      isToggling
                        ? 'opacity-60 cursor-not-allowed'
                        : ''
                    }`}
                  >

                    <Power className="w-3 h-3" />

                    <span>
                      {isToggling
                        ? 'Updating...'
                        : stu.is_active
                          ? 'Deactivate'
                          : 'Activate'}
                    </span>

                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}

      {/* Add Student Modal */}
      {showAddModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">

          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border flex-shrink-0">

              <div>
                <h2 className="font-heading text-xl font-bold text-brand-dark">
                  Add Student
                </h2>

                <p className="text-xs text-brand-muted mt-1">
                  Create a new student account
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleAddStudent}
              className="p-5 space-y-4 overflow-y-auto"
            >

              {/* Personal Details */}
              <div>

                <h3 className="text-sm font-bold text-brand-dark mb-2.5">
                  Personal Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Student Mobile Number"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                </div>

              </div>

              {/* Academic Details */}
              <div>

                <h3 className="text-sm font-bold text-brand-dark mb-2.5">
                  Academic & Hostel Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <input
                    name="roll_number"
                    value={formData.roll_number}
                    onChange={handleChange}
                    placeholder="Roll Number / USN"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Department"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="hostel"
                    value={formData.hostel}
                    onChange={handleChange}
                    placeholder="Hostel"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                    placeholder="Room Number"
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                </div>

              </div>

              {/* Guardian Details */}
              <div>

                <h3 className="text-sm font-bold text-brand-dark mb-2.5">
                  Parent / Guardian Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <input
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    placeholder="Parent / Guardian Name"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                  <input
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    placeholder="Parent / Guardian Phone"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <h3 className="text-sm font-bold text-brand-dark mb-2.5">
                  Account Password
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                  <div className="relative">

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 pr-11 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-brown transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                  </div>

                  <div className="relative">

                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      minLength={6}
                      className="w-full px-3 py-2 pr-11 rounded-xl border border-brand-border text-sm outline-none focus:ring-2 focus:ring-brand-brown"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-brown transition-colors"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                  </div>

                </div>

              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-1">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl border border-brand-border text-sm font-semibold text-brand-dark hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-brand-brown text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {saving
                    ? 'Creating...'
                    : 'Create Student'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}