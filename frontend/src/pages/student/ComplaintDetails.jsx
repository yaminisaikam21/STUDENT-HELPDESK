import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Building2,
  Paperclip,
  User,
  Send,
  Wrench,
  MessageSquareQuote
} from 'lucide-react';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge, { PriorityBadge } from '../../components/StatusBadge';
import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [complaint, setComplaint] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);

      const data = await complaintService.getComplaint(id);
      setComplaint(data);

      const commentsData = await complaintService.getComments(id);
      setComments(commentsData || []);
    } catch (err) {
      console.error('Failed to load complaint details:', err);
      addToast('Could not load complaint details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);

      const created = await complaintService.addComment(
        id,
        newComment.trim()
      );

      setComments((prev) => [...prev, created]);
      setNewComment('');

      addToast('Remark posted successfully.', 'success');
    } catch (err) {
      console.error('Error posting comment:', err);
      addToast('Failed to post comment. Try again.', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#F3EBDD]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <LoadingSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen w-full bg-[#F3EBDD]">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <p className="text-white/70">
            Complaint not found or you don't have access.
          </p>

          <Link
            to="/complaints"
            className="mt-3 inline-block text-[#C9A66B] font-semibold text-sm"
          >
            Return to complaints list
          </Link>
        </div>
      </div>
    );
  }

  const stages = [
    'Pending',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  const currentStageIndex = stages.indexOf(complaint.status);

  return (
    <div className="min-h-screen w-full bg-[#F3EBDD] text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Back to Complaint Register */}
        <div>
          <Link
            to={
              user.role === 'ADMIN'
                ? '/admin/complaints'
                : user.role === 'WARDEN'
                ? '/warden'
                : '/complaints'
            }
           className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C9A66B] hover:text-[#D8B878] transition-colors"
>
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Complaint Register</span>
          </Link>
        </div>

        {/* Complaint Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#3A2A20] border border-[#6B4A35] shadow-card-soft space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#6B4A35]">

            <div className="space-y-2">

              <div className="flex items-center gap-2 flex-wrap">

                <span className="text-xs font-mono font-bold text-white/50">
                  Complaint #{complaint.id}
                </span>

                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#4A3426] border border-[#7A5A40] text-[#C9A66B]">
                  {complaint.category}
                </span>

                <PriorityBadge priority={complaint.priority} />

              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                {complaint.title}
              </h1>

            </div>

            <StatusBadge
              status={complaint.status}
              size="md"
            />

          </div>

          {/* Resolution Activity Progression */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#4A3426] border border-[#6B4A35] space-y-4">

            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">

              <Clock className="w-4 h-4 text-[#C9A66B]" />

              <span>
                Resolution Activity Progression
              </span>

            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              {stages.map((stg, idx) => {

                const isPassed =
                  currentStageIndex >= idx;

                const isCurrent =
                  complaint.status === stg;

                return (
                  <div
                    key={stg}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#C9A66B] text-[#2B211B] border-[#C9A66B] shadow-xs'
                        : isPassed
                        ? 'bg-[#4A3426] border-[#8B684D] text-[#C9A66B] font-semibold'
                        : 'bg-[#F3EBDD] border-[#C9A66B] text-[#2B211B] font-semibold'
                    }`}
                  >

                    <div className="text-[10px] font-mono uppercase mb-0.5">
                      Stage 0{idx + 1}
                    </div>

                    <div className="text-xs font-bold">
                      {stg}
                    </div>

                  </div>
                );

              })}

            </div>

          </div>

          {/* Complaint Information */}
          <div className="space-y-5">

            {/* Issue Description */}
            <div>

              <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">
                Issue Description
              </h4>

              <p className="text-sm text-white/80 leading-relaxed bg-[#4A3426] p-4 rounded-xl border border-[#6B4A35]">
                {complaint.description}
              </p>

            </div>

            {/* Complaint Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Campus Location */}
              <div className="p-4 rounded-xl bg-[#4A3426] border border-[#6B4A35] text-xs">

                <span className="text-white/50 block mb-1">
                  Campus Location
                </span>

                <span className="font-semibold text-white flex items-center gap-1.5">

                  <Building2 className="w-3.5 h-3.5 text-[#C9A66B]" />

                  {complaint.location}

                </span>

              </div>

              {/* Assigned Department */}
              <div className="p-4 rounded-xl bg-[#4A3426] border border-[#6B4A35] text-xs">

                <span className="text-white/50 block mb-1">
                  Assigned Department
                </span>

                <span className="font-semibold text-[#C9A66B] flex items-center gap-1.5">

                  <Wrench className="w-3.5 h-3.5" />

                  {complaint.assigned_to || 'Pending Assignment'}

                </span>

              </div>

              {/* Reported By */}
              <div className="p-4 rounded-xl bg-[#4A3426] border border-[#6B4A35] text-xs">

                <span className="text-white/50 block mb-1">
                  Reported By
                </span>

                <span className="font-semibold text-white flex items-center gap-1.5">

                  <User className="w-3.5 h-3.5 text-[#C9A66B]" />

                  {complaint.student_name}

                </span>

              </div>

            </div>

            {/* Admin Response */}
            {complaint.admin_response && (
              <div className="p-4 rounded-2xl bg-[#4A3426] border border-[#8B684D] space-y-2">

                <div className="flex items-center gap-2 text-xs font-bold text-[#C9A66B]">

                  <MessageSquareQuote className="w-4 h-4 text-[#C9A66B]" />

                  <span>
                    Official Campus Resolution Remarks
                  </span>

                </div>

                <p className="text-xs sm:text-sm text-white/75 leading-relaxed pt-1">
                  {complaint.admin_response}
                </p>

              </div>
            )}

            {/* Attachment */}
            {complaint.attachment && (
              <div className="pt-1">

                <h4 className="text-xs font-semibold text-white/50 uppercase mb-2">
                  Photo Evidence
                </h4>

                <a
                  href={complaint.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A3426] hover:bg-[#6B4A35] text-white text-xs font-medium border border-[#6B4A35] transition-colors"
                >

                  <Paperclip className="w-4 h-4 text-[#C9A66B]" />

                  <span>
                    View Attached Photo Evidence ↗
                  </span>

                </a>

              </div>
            )}

          </div>

        </div>

        {/* Dialogue & Technician Updates */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#3A2A20] border border-[#6B4A35] shadow-card-soft space-y-6">

          <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">

            <span>
              Dialogue & Technician Updates
            </span>

            <span className="text-xs font-normal text-white/50">
              ({comments.length})
            </span>

          </h3>

          {/* Comments */}
          <div className="space-y-4">

            {comments.length === 0 ? (

              <p className="text-xs text-white/50 italic py-2">
                No remarks yet. You can post an update or inquiry below.
              </p>

            ) : (

              comments.map((c) => (

                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#4A3426] border border-[#6B4A35] space-y-2 text-xs sm:text-sm"
                >

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <span className="font-bold text-white">
                        {c.user_name}
                      </span>

                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#4A3426] text-[#C9A66B]">
                        {c.user_role}
                      </span>

                    </div>

                    <span className="text-[11px] text-white/40">

                      {new Date(c.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}

                      {' • '}

                      {new Date(c.created_at).toLocaleDateString()}

                    </span>

                  </div>

                  <p className="text-white/80 leading-relaxed">
                    {c.comment}
                  </p>

                </div>

              ))

            )}

          </div>

          {/* Add Comment */}
          <form
            onSubmit={handleAddComment}
            className="pt-4 border-t border-[#6B4A35] flex gap-3"
          >

            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Type your message or technician inquiry..."
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#8B684D] bg-[#F3EBDD] focus:ring-2 focus:ring-[#C9A66B] outline-none text-[#4A3426] placeholder:text-slate-500"
              disabled={submittingComment}
            />

            <button
              type="submit"
              disabled={
                submittingComment ||
                !newComment.trim()
              }
              className="px-5 py-2.5 rounded-xl bg-[#C9A66B] hover:bg-[#c99b4c] text-[#2B211B] text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >

              {submittingComment ? (

                <div className="w-4 h-4 border-2 border-[#2B211B] border-t-transparent rounded-full animate-spin" />

              ) : (

                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </>

              )}

            </button>

          </form>

        </div>

      </div>
    </div>
  );
}