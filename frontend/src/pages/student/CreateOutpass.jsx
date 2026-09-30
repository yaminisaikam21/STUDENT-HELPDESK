import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import {
  ArrowLeft,
  Send,
  MapPin,
  Calendar,
  Phone,
  PhoneCall,
  User,
  FileText,
  AlertCircle,
  ShieldCheck,
  Clock3,
} from 'lucide-react';

import { outpassService } from '../../services/outpassService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function CreateOutpass() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    reason: '',
    from_date: '',
    to_date: '',
    parent_name: user?.student_profile?.guardian_name || '',
    parent_contact: user?.student_profile?.guardian_phone || '',
    emergency_contact: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (new Date(formData.from_date) >= new Date(formData.to_date)) {
      setErrors({
        to_date: ['Return date must be strictly after departure date.'],
      });
      return;
    }

    if (!formData.emergency_contact.trim()) {
      setErrors({
        emergency_contact: ['Emergency contact number is required.'],
      });
      return;
    }

    try {
      setLoading(true);

      const res = await outpassService.createOutpass(formData);

      addToast(
        `Outpass #${res.id} submitted for parent verification!`,
        'success'
      );

      navigate(`/outpasses/${res.id}`);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({
          non_field_errors: ['Network error. Please try again.'],
        });
      }

      addToast('Failed to submit outpass application.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3E8D7] text-brand-dark">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <Link
            to="/outpasses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#6F5A4A] hover:text-[#3A2A20] transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Outpasses</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#6B4A35]/20 border border-[#6B4A35]/40 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-[#8B6337]" />
                </div>

                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8B6337]">
                  Student HelpDesk
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-[#2B211B]">
                Apply for Outpass
              </h1>

              <p className="mt-2 text-sm text-[#6F5A4A] max-w-xl">
                Submit your travel details for hostel verification.
              </p>
            </div>

            <div className="inline-flex self-start lg:self-auto items-center gap-2 px-4 py-2.5 rounded-xl border border-[#6B4A35] bg-[#3A2A20] text-[11px] font-bold uppercase tracking-wide text-[#F0DFC6]">
              <ShieldCheck className="w-4 h-4 text-[#C9A66B]" />
              <span>Secure Application</span>
            </div>
          </div>
        </div>

        {/* SAFETY POLICY */}
        <div className="mb-7 rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#6B4A35]/40 border border-[#6B4A35] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#F0DFC6]" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-[#F4EFE5] mb-1">
                Residential Safety Policy
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-[#C9BDB3]">
                All outpass requests require direct phone confirmation with
                your registered parent/guardian by the hostel warden before
                gate departure authorization is granted.
              </p>
            </div>
          </div>
        </div>

        {/* APPLICATION CARD */}
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl overflow-hidden border border-[#6B4A35] bg-[#3A2A20] shadow-card-soft"
        >
          <div className="px-5 sm:px-7 py-5 border-b border-[#6B4A35] bg-[#3A2A20]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#F4EFE5]">
                  Outpass Application
                </h2>

                <p className="text-xs text-[#C9BDB3] mt-1">
                  Fill in the details below to continue.
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#6B4A35]/30 border border-[#6B4A35] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[#F0DFC6]" />
              </div>
            </div>
          </div>

          {errors.non_field_errors && (
            <div className="mx-5 sm:mx-7 mt-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.non_field_errors[0]}</span>
            </div>
          )}

          {/* TRAVEL ITINERARY */}
          <section className="px-5 sm:px-7 py-7 border-b border-[#6B4A35]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#6B4A35]/40 border border-[#6B4A35] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#F0DFC6]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#F4EFE5]">
                  Travel Itinerary
                </h3>

                <p className="text-[11px] text-[#C9BDB3] mt-0.5">
                  Where and when are you travelling?
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                  Destination City / Address *
                </label>

                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="e.g. Bangalore (Home) or NIE Campus, Mysore"
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] placeholder:text-[#A58F79] outline-none transition-all focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40"
                    required
                  />
                </div>

                {errors.destination && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.destination[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                  Purpose / Reason for Travel *
                </label>

                <textarea
                  rows={4}
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Detail the family function, competition, medical appointment, or personal reason..."
                  className="w-full px-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] placeholder:text-[#A58F79] outline-none transition-all resize-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40 leading-relaxed"
                  required
                />

                {errors.reason && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.reason[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                    Departure Date & Time *
                  </label>

                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                    <input
                      type="datetime-local"
                      name="from_date"
                      value={formData.from_date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] outline-none transition-all focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40"
                      required
                    />
                  </div>

                  {errors.from_date && (
                    <p className="text-xs text-rose-300 mt-1.5">
                      {errors.from_date[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                    Expected Return Date & Time *
                  </label>

                  <div className="relative">
                    <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                    <input
                      type="datetime-local"
                      name="to_date"
                      value={formData.to_date}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] outline-none transition-all focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40"
                      required
                    />
                  </div>

                  {errors.to_date && (
                    <p className="text-xs text-rose-300 mt-1.5">
                      {errors.to_date[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACT INFORMATION */}
          <section className="px-5 sm:px-7 py-7 border-b border-[#6B4A35]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#6B4A35]/40 border border-[#6B4A35] flex items-center justify-center">
                <Phone className="w-4 h-4 text-[#F0DFC6]" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#F4EFE5]">
                  Contact Information
                </h3>

                <p className="text-[11px] text-[#C9BDB3] mt-0.5">
                  Parent details are taken from your registered profile.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Parent Name */}
              <div>
                <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                  Parent / Guardian Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                  <input
                    type="text"
                    name="parent_name"
                    value={formData.parent_name}
                    readOnly
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16]/70 text-[#C9BDB3] outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Parent Contact */}
              <div>
                <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                  Parent / Guardian Phone
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                  <input
                    type="text"
                    name="parent_contact"
                    value={formData.parent_contact}
                    readOnly
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16]/70 text-[#C9BDB3] outline-none cursor-not-allowed"
                  />
                </div>

                <p className="text-[11px] text-[#A58F79] mt-1.5">
                  This number is taken automatically from your registered
                  guardian details.
                </p>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
                  Emergency Contact Number *
                </label>

                <div className="relative">
                  <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A66B] pointer-events-none" />

                  <input
                    type="tel"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleChange}
                    placeholder="Enter emergency contact number"
                    className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] placeholder:text-[#A58F79] outline-none transition-all focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40"
                    required
                  />
                </div>

                {errors.emergency_contact && (
                  <p className="text-xs text-rose-300 mt-1.5">
                    {errors.emergency_contact[0]}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* NOTES */}
          <section className="px-5 sm:px-7 py-7">
            <label className="block text-xs font-bold text-[#F0DFC6] mb-2">
              Additional Notes
            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional information for the warden..."
              className="w-full px-4 py-3.5 text-sm rounded-xl border border-[#6B4A35] bg-[#241B16] text-[#F4EFE5] placeholder:text-[#A58F79] outline-none transition-all resize-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#6B4A35]/40 leading-relaxed"
            />

            {errors.notes && (
              <p className="text-xs text-rose-300 mt-1.5">
                {errors.notes[0]}
              </p>
            )}
          </section>

          {/* SUBMIT */}
          <div className="px-5 sm:px-7 py-5 border-t border-[#6B4A35] bg-[#241B16] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />

              <p className="text-[11px] leading-relaxed text-[#A58F79] max-w-xl">
                Please ensure all travel and emergency contact information is
                accurate before submitting.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C9A66B] hover:bg-[#D6B87D] text-[#2B211B] text-xs font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Outpass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}