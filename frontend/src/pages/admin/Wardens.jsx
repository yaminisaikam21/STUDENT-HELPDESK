import React, { useEffect, useState } from 'react';
import {
  Search,
  Plus,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
  Mail,
  Phone,
  User,
  Eye,
  EyeOff
} from 'lucide-react';

import { adminService } from '../../services/adminService';

const Wardens = () => {
  const [wardens, setWardens] = useState([]);
  const [search, setSearch] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  // =========================
  // LOAD WARDENS
  // =========================

  useEffect(() => {
    loadWardens();
  }, []);

  const loadWardens = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await adminService.getWardens();

      setWardens(data || []);
    } catch (err) {
      console.error('Error loading wardens:', err);
      setError('Unable to load wardens.');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FORM HANDLING
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // =========================
  // CREATE WARDEN
  // =========================

  const handleAddWarden = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError('');
      setMessage('');

      await adminService.createWarden(formData);

      setMessage('Warden account created successfully.');

      resetForm();
      setShowAddModal(false);

      await loadWardens();
    } catch (err) {
      console.error('Error creating warden:', err);

      const data = err?.response?.data;

      if (data) {
        const firstError = Object.values(data).flat()[0];

        setError(
          firstError || 'Unable to create warden.'
        );
      } else {
        setError('Unable to create warden.');
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================

  const handleToggleActive = async (id) => {
    try {
      setError('');
      setMessage('');

      await adminService.toggleUserActive(id);

      setMessage('Warden account status updated.');

      await loadWardens();
    } catch (err) {
      console.error('Error updating warden:', err);

      setError('Unable to update warden status.');
    }
  };

  // =========================
  // SEARCH
  // =========================

  const filteredWardens = wardens.filter((warden) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      warden.username
        ?.toLowerCase()
        .includes(searchText) ||

      warden.email
        ?.toLowerCase()
        .includes(searchText) ||

      warden.first_name
        ?.toLowerCase()
        .includes(searchText) ||

      warden.last_name
        ?.toLowerCase()
        .includes(searchText) ||

      warden.phone
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // =========================
  // INPUT STYLE
  // =========================

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-white text-sm text-brand-dark placeholder:text-brand-muted outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 transition-all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-brown" />
          </div>

          <div>
            <h1 className="text-2xl font-heading font-bold text-brand-dark">
              Wardens
            </h1>

            <p className="text-sm text-brand-muted mt-0.5">
              Manage warden accounts and access
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() => {
            setShowAddModal(true);
            setMessage('');
            setError('');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-brown hover:bg-brand-brown/90 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Warden
        </button>

      </div>

      {/* =========================================
          SUCCESS MESSAGE
      ========================================= */}

      {message && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* =========================================
          ERROR MESSAGE
      ========================================= */}

      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================================
          SEARCH
      ========================================= */}

      <div className="bg-white rounded-xl border border-brand-border shadow-sm p-4 mb-6">

        <div className="relative">

          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-brand-muted"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search warden by name, username, email or phone..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-brand-border bg-brand-cream/20 text-sm text-brand-dark placeholder:text-brand-muted outline-none focus:border-brand-brown focus:ring-2 focus:ring-brand-brown/10 transition-all"
          />

        </div>

      </div>

      {/* =========================================
          SECTION TITLE
      ========================================= */}

      <div className="flex items-end justify-between mb-4 px-1">

        <div>

          <h2 className="text-lg font-heading font-bold text-brand-dark">
            Warden Accounts
          </h2>

          <p className="text-xs text-brand-muted mt-1">
            {filteredWardens.length}{' '}
            {filteredWardens.length === 1
              ? 'warden'
              : 'wardens'}{' '}
            found
          </p>

        </div>

      </div>

      {/* =========================================
          LOADING
      ========================================= */}

      {loading ? (

        <div className="bg-white rounded-xl border border-brand-border p-10 text-center">

          <div className="w-9 h-9 mx-auto mb-3 rounded-full border-4 border-brand-cream border-t-brand-brown animate-spin" />

          <p className="text-sm text-brand-muted">
            Loading wardens...
          </p>

        </div>

      ) : filteredWardens.length === 0 ? (

        /* =========================================
           EMPTY STATE
        ========================================= */

        <div className="bg-white rounded-xl border border-brand-border p-10 text-center">

          <div className="w-14 h-14 mx-auto rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center mb-4">
            <ShieldCheck className="w-7 h-7 text-brand-brown" />
          </div>

          <h3 className="font-heading font-bold text-brand-dark">
            No wardens found
          </h3>

          <p className="text-sm text-brand-muted mt-2 max-w-md mx-auto">
            {search
              ? 'No warden matches your search. Try another name, username, email or phone number.'
              : 'There are no warden accounts yet. Add a warden to get started.'}
          </p>

          {!search && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-brown hover:bg-brand-brown/90 text-white text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Warden
            </button>
          )}

        </div>

      ) : (

        /* =========================================
           WARDEN CARDS - 3 COLUMN GRID
        ========================================= */

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {filteredWardens.map((warden) => {

            const displayName =
              warden.first_name || warden.last_name
                ? `${warden.first_name || ''} ${warden.last_name || ''}`.trim()
                : warden.username;

            const initial = (
              warden.first_name?.[0] ||
              warden.username?.[0] ||
              'W'
            ).toUpperCase();

            return (

              <div
                key={warden.id}
                className="bg-white rounded-xl border border-brand-border p-5 shadow-sm hover:shadow-md hover:border-brand-brown/30 transition-all"
              >

                {/* CARD HEADER */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3 min-w-0">

                    <div className="w-11 h-11 shrink-0 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center text-brand-brown font-heading font-bold text-lg">
                      {initial}
                    </div>

                    <div className="min-w-0">

                      <h3 className="font-heading font-bold text-brand-dark text-sm truncate">
                        {displayName}
                      </h3>

                      <p className="text-xs text-brand-muted mt-0.5 truncate">
                        @{warden.username}
                      </p>

                    </div>

                  </div>

                  {/* STATUS */}

                  <span
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                      warden.is_active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {warden.is_active
                      ? 'Active'
                      : 'Inactive'}
                  </span>

                </div>

                {/* CARD DETAILS */}

                <div className="mt-4 space-y-2.5">

                  {warden.email && (
                    <div className="flex items-center gap-2.5 min-w-0">

                      <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-cream flex items-center justify-center">
                        <Mail className="w-3.5 h-3.5 text-brand-brown" />
                      </div>

                      <span className="text-xs text-brand-muted truncate">
                        {warden.email}
                      </span>

                    </div>
                  )}

                  {warden.phone && (
                    <div className="flex items-center gap-2.5">

                      <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-cream flex items-center justify-center">
                        <Phone className="w-3.5 h-3.5 text-brand-brown" />
                      </div>

                      <span className="text-xs text-brand-muted">
                        {warden.phone}
                      </span>

                    </div>
                  )}

                  <div className="flex items-center gap-2.5">

                    <div className="w-8 h-8 shrink-0 rounded-lg bg-brand-cream flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-brand-brown" />
                    </div>

                    <span className="text-xs text-brand-muted">
                      Warden Account
                    </span>

                  </div>

                </div>

                {/* ACTION */}

                <div className="mt-4 pt-4 border-t border-brand-border">

                  <button
                    type="button"
                    onClick={() =>
                      handleToggleActive(warden.id)
                    }
                    className={`w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      warden.is_active
                        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                        : 'bg-brand-cream text-brand-brown border border-brand-border hover:bg-brand-cream/70'
                    }`}
                  >

                    {warden.is_active ? (
                      <>
                        <UserX className="w-3.5 h-3.5" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        Activate
                      </>
                    )}

                  </button>

                </div>

              </div>

            );
          })}

        </div>

      )}

      {/* =========================================
          ADD WARDEN MODAL
      ========================================= */}

      {showAddModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >

          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl">

            {/* MODAL HEADER */}

            <div className="px-6 py-5 border-b border-brand-border">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-brand-cream border border-brand-border flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-brand-brown" />
                  </div>

                  <div>

                    <h2 className="text-lg font-heading font-bold text-brand-dark">
                      Add New Warden
                    </h2>

                    <p className="text-xs text-brand-muted mt-0.5">
                      Create a new account for the warden
                    </p>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 shrink-0 rounded-lg hover:bg-brand-cream flex items-center justify-center text-brand-muted hover:text-brand-dark transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* MODAL FORM */}

            <form
              onSubmit={handleAddWarden}
              className="px-6 py-5"
            >

              {/* PERSONAL INFORMATION */}

              <div className="mb-5">

                <div className="mb-3">

                  <h3 className="text-sm font-heading font-bold text-brand-dark">
                    Personal Information
                  </h3>

                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Enter the basic details of the warden.
                  </p>

                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3">

                  {/* FIRST NAME */}

                  <div>

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      placeholder="First name"
                      className={inputClass}
                    />

                  </div>

                  {/* LAST NAME */}

                  <div>

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      placeholder="Last name"
                      className={inputClass}
                    />

                  </div>

                  {/* PHONE */}

                  <div>

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                      className={inputClass}
                    />

                  </div>

                  {/* EMAIL */}

                  <div>

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className={inputClass}
                    />

                  </div>

                </div>

              </div>

              {/* ACCOUNT INFORMATION */}

              <div className="pt-4 border-t border-brand-border">

                <div className="mb-3">

                  <h3 className="text-sm font-heading font-bold text-brand-dark">
                    Account Information
                  </h3>

                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Set the login credentials for the warden.
                  </p>

                </div>

                <div className="space-y-3">

                  {/* USERNAME */}

                  <div>

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Username{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Enter username"
                      className={inputClass}
                    />

                  </div>

                  {/* PASSWORDS */}

                <div className="grid grid-cols-2 gap-x-4">

                  <div className="relative">

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Password{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-brown transition-colors"
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

                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">
                      Confirm Password{' '}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-brand-muted hover:text-brand-brown transition-colors"
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

              </div>

              {/* MODAL ACTIONS */}

              <div className="mt-5 pt-4 border-t border-brand-border flex justify-end gap-3">

                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-lg border border-brand-border bg-white text-sm font-semibold text-brand-dark hover:bg-brand-cream transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-lg bg-brand-brown hover:bg-brand-brown/90 disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors"
                >
                  {saving
                    ? 'Creating...'
                    : 'Create Warden'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Wardens;