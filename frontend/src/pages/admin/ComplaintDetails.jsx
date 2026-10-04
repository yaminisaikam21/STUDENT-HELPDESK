import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  MapPin,
  Calendar,
  Clock,
  Pencil,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

import { complaintService } from '../../services/complaintService';
import StatusBadge, {
  PriorityBadge,
} from '../../components/StatusBadge';

import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function AdminComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await complaintService.getComplaint(id);
      setComplaint(data);
    } catch (err) {
      console.error('Failed to load complaint:', err);

      setError(
        err.response?.data?.detail ||
          'Unable to load this complaint.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleBack = () => {
    navigate('/admin/complaints');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen bg-[#f7f1e8] px-4 py-10">
        <div className="max-w-5xl mx-auto">

          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm font-semibold text-[#76513c] hover:text-[#4f3426] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Complaints
          </button>

          <div className="bg-white rounded-[28px] border border-[#eadccd] p-12 text-center shadow-sm">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>

            <h2 className="text-xl font-bold text-[#35251d]">
              Complaint Not Found
            </h2>

            <p className="text-sm text-[#806e62] mt-2">
              {error || 'This complaint could not be found.'}
            </p>
          </div>

        </div>
      </div>
    );
  }

  const attachmentUrl = complaint.attachment || '';

  const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(
    attachmentUrl
  );

  const attachmentName = attachmentUrl
    ? decodeURIComponent(
        attachmentUrl.split('/').pop()?.split('?')[0] ||
          'Attachment'
      )
    : 'Attachment';

  return (
    <div className="min-h-screen bg-[#f7f1e8]">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">

        {/* TOP NAV */}
        <div className="flex items-center justify-between mb-6">

          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-sm font-semibold text-[#76513c] hover:text-[#4f3426] transition"
          >
            <span className="w-8 h-8 rounded-xl bg-white border border-[#eadccd] flex items-center justify-center group-hover:bg-[#f1e5d7] transition">
              <ArrowLeft className="w-4 h-4" />
            </span>

            Back to Complaints
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs text-[#9a887b]">
              Admin View
            </span>

            <span className="px-3 py-1.5 rounded-full bg-[#ead8c4] text-[#63412f] text-xs font-bold">
              #{complaint.id}
            </span>
          </div>

        </div>

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#68452f] via-[#80563b] to-[#a47751] text-white shadow-lg mb-6">

          <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-[-100px] w-56 h-56 rounded-full bg-[#e8c79f]/10" />

          <div className="relative p-7 sm:p-9">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">

              <div className="max-w-3xl">

                <div className="flex flex-wrap items-center gap-2 mb-5">

                  <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-white text-[11px] font-bold">
                    {complaint.category || 'Uncategorized'}
                  </div>

                  <StatusBadge
                    status={complaint.status}
                    size="xs"
                  />

                  <PriorityBadge
                    priority={complaint.priority}
                  />

                </div>

                <p className="text-[11px] uppercase tracking-[0.18em] text-[#f1d7b7] font-bold mb-2">
                  Complaint Details
                </p>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                  {complaint.title}
                </h1>

                <p className="text-sm text-white/70 mt-3 max-w-2xl">
                  Review the complaint information, submitted evidence,
                  student details, and current resolution status.
                </p>

              </div>

              <Link
                to="/admin/complaints"
                state={{
                  editComplaint: complaint,
                }}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-[#62422f] hover:bg-[#fff8ef] text-sm font-bold shadow-sm transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Complaint
              </Link>

            </div>

            {/* HERO META */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 mt-7 pt-5 border-t border-white/15">

              <div className="flex items-center gap-2 text-xs text-white/75">
                <MapPin className="w-4 h-4 text-[#f1d7b7]" />
                {complaint.location || 'Location not specified'}
              </div>

              <div className="flex items-center gap-2 text-xs text-white/75">
                <Calendar className="w-4 h-4 text-[#f1d7b7]" />
                {complaint.created_at
                  ? new Date(
                      complaint.created_at
                    ).toLocaleString()
                  : 'Date unavailable'}
              </div>

            </div>

          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* MAIN COLUMN */}
          <main className="lg:col-span-2 space-y-6">

            {/* DESCRIPTION */}
            <section className="rounded-[26px] bg-white border border-[#eadccd] shadow-sm overflow-hidden">

              <div className="px-6 sm:px-7 py-5 bg-[#fffaf4] border-b border-[#eee2d5]">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#ead8c4] text-[#704a32] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#35251d]">
                      Complaint Description
                    </h2>

                    <p className="text-xs text-[#917d6f] mt-0.5">
                      Details provided by the student
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6 sm:p-7">

                <div className="relative pl-5 border-l-[3px] border-[#c69a6b]">

                  <p className="text-sm sm:text-[15px] text-[#55443a] leading-7 whitespace-pre-wrap">
                    {complaint.description ||
                      'No description provided.'}
                  </p>

                </div>

              </div>

            </section>

            {/* ATTACHMENT */}
            {attachmentUrl && (
              <section className="rounded-[26px] bg-white border border-[#eadccd] shadow-sm overflow-hidden">

                <div className="px-6 sm:px-7 py-5 bg-[#fffaf4] border-b border-[#eee2d5]">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-2xl bg-[#f2e5d4] text-[#a06a36] flex items-center justify-center">
                        <Paperclip className="w-5 h-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-bold text-[#35251d]">
                          Submitted Attachment
                        </h2>

                        <p className="text-xs text-[#917d6f] mt-0.5">
                          Evidence uploaded with this complaint
                        </p>
                      </div>

                    </div>

                    <a
                      href={attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#704a32] hover:bg-[#5c3d2b] text-white text-xs font-bold transition"
                    >
                      Open Full Size
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                  </div>

                </div>

                <div className="p-5 sm:p-7">

                  {isImage ? (
                    <div className="rounded-2xl overflow-hidden border border-[#e6d9cb] bg-[#f5eee6]">

                      <a
                        href={attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <div className="flex items-center justify-center min-h-[280px] max-h-[540px] p-4 sm:p-6">

                          <img
                            src={attachmentUrl}
                            alt="Complaint attachment"
                            className="max-w-full max-h-[500px] object-contain rounded-xl shadow-sm"
                          />

                        </div>
                      </a>

                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[#e6d9cb] bg-[#faf6f0] p-5">

                      <div className="flex items-center gap-4">

                        <div className="w-12 h-12 rounded-2xl bg-white border border-[#eadccd] flex items-center justify-center">
                          <FileText className="w-5 h-5 text-[#704a32]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#35251d] truncate">
                            {attachmentName}
                          </p>

                          <p className="text-xs text-[#917d6f] mt-1">
                            Uploaded attachment
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {isImage && (
                    <div className="flex items-center gap-2 mt-3 text-xs text-[#9a887b]">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Click the image to view it in full size.
                    </div>
                  )}

                </div>

              </section>
            )}

            {/* ADMIN RESPONSE */}
            {complaint.admin_response && (
              <section className="rounded-[26px] bg-white border border-[#eadccd] shadow-sm overflow-hidden">

                <div className="px-6 sm:px-7 py-5 bg-[#fffaf4] border-b border-[#eee2d5]">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-2xl bg-[#f7e8c9] text-[#8c642f] flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-[#35251d]">
                        Administrative Response
                      </h2>

                      <p className="text-xs text-[#917d6f] mt-0.5">
                        Response from the administration
                      </p>
                    </div>

                  </div>

                </div>

                <div className="p-6 sm:p-7">

                  <div className="rounded-2xl bg-[#fff7e8] border border-[#efdcb9] p-5">

                    <p className="text-sm text-[#654b2e] leading-7 whitespace-pre-wrap">
                      {complaint.admin_response}
                    </p>

                  </div>

                </div>

              </section>
            )}

          </main>

          {/* SIDEBAR */}
          <aside className="space-y-6">

            {/* STUDENT CARD */}
            <section className="rounded-[26px] bg-white border border-[#eadccd] shadow-sm overflow-hidden">

              <div className="px-6 py-5 bg-gradient-to-r from-[#fffaf4] to-[#f8eee2] border-b border-[#eee2d5]">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#d9c0a4] text-[#62422f] flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#35251d]">
                      Student
                    </h2>

                    <p className="text-xs text-[#917d6f]">
                      Complaint reporter
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6 space-y-5">

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#a28d7e]">
                    Name
                  </p>

                  <p className="text-sm font-bold text-[#35251d] mt-1.5">
                    {complaint.student_name || 'Unknown'}
                  </p>
                </div>

                {complaint.student_email && (
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#a28d7e]">
                      Email
                    </p>

                    <p className="text-sm text-[#55443a] mt-1.5 break-all">
                      {complaint.student_email}
                    </p>
                  </div>
                )}

                {complaint.assigned_to && (
                  <div className="pt-4 border-t border-[#eee2d5]">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#a28d7e]">
                      Assigned To
                    </p>

                    <p className="text-sm font-bold text-[#704a32] mt-1.5">
                      {complaint.assigned_to}
                    </p>
                  </div>
                )}

              </div>

            </section>

            {/* STATUS CARD */}
            <section className="rounded-[26px] bg-white border border-[#eadccd] shadow-sm overflow-hidden">

              <div className="px-6 py-5 bg-gradient-to-r from-[#f2eee5] to-[#f8f3ea] border-b border-[#e8dfd4]">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-2xl bg-[#dce9dc] text-[#4f7953] flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#35251d]">
                      Complaint Status
                    </h2>

                    <p className="text-xs text-[#917d6f]">
                      Current progress
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6">

                <div className="space-y-4">

                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#faf7f3] border border-[#eee4da]">

                    <span className="text-xs font-semibold text-[#806e62]">
                      Status
                    </span>

                    <StatusBadge
                      status={complaint.status}
                      size="xs"
                    />

                  </div>

                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#faf7f3] border border-[#eee4da]">

                    <span className="text-xs font-semibold text-[#806e62]">
                      Priority
                    </span>

                    <PriorityBadge
                      priority={complaint.priority}
                    />

                  </div>

                </div>

                <div className="flex items-start gap-2 mt-5 pt-4 border-t border-[#eee4da] text-xs text-[#9a887b]">

                  <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />

                  <span>
                    Last updated:{' '}
                    {complaint.updated_at
                      ? new Date(
                          complaint.updated_at
                        ).toLocaleString()
                      : 'Not available'}
                  </span>

                </div>

              </div>

            </section>

          </aside>

        </div>

        {/* BOTTOM INFO */}
        <div className="mt-6 rounded-[22px] bg-[#6d4933] text-white px-5 py-4 shadow-sm">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="w-4 h-4 text-[#e8c89f] mt-0.5 shrink-0" />

            <p className="text-xs leading-5 text-white/75">
              Use <strong className="text-white">Edit Complaint</strong>{' '}
              to update the status, assignment, or administrative response.
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
  