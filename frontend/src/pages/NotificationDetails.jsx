import React, { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

import {
  ArrowLeft,
  Bell,
  Radio,
  MessageSquare,
  FileText,
  ShieldCheck,
  Clock
} from 'lucide-react';

import { notificationService } from '../services/notificationService';

export default function NotificationDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [notification, setNotification] = useState(
    location.state?.notification || null
  );

  const [loading, setLoading] = useState(!notification);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await notificationService.getNotification(id);

        setNotification(data);
        setError(false);
      } catch (err) {
        console.error(
          'Failed to load notification:',
          err
        );

        if (!notification) {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [id]);

  const getIcon = () => {
    switch (notification?.notification_type) {
      case 'BROADCAST':
        return (
          <Radio className="w-7 h-7 text-[#C9A66B]" />
        );

      case 'COMPLAINT':
        return (
          <MessageSquare className="w-7 h-7 text-[#8B684D]" />
        );

      case 'OUTPASS':
        return (
          <FileText className="w-7 h-7 text-[#C9A66B]" />
        );

      case 'VERIFICATION':
        return (
          <ShieldCheck className="w-7 h-7 text-[#8B684D]" />
        );

      default:
        return (
          <Bell className="w-7 h-7 text-[#C9A66B]" />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#2B211B] flex items-center justify-center px-4">

        <div className="bg-[#3A2A20] rounded-3xl border border-[#6B4A35] shadow-2xl p-8 max-w-md w-full text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#33251D] border border-[#6B4A35] flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[#C9A66B] animate-pulse" />
          </div>

          <h1 className="font-heading text-xl font-bold text-[#F7F1E8]">
            Loading notification...
          </h1>

        </div>

      </div>
    );
  }

  if (error || !notification) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#2B211B] flex items-center justify-center px-4">

        <div className="bg-[#3A2A20] rounded-3xl border border-[#6B4A35] shadow-2xl p-8 max-w-md w-full text-center">

          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#33251D] border border-[#6B4A35] flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-[#C9A66B]" />
          </div>

          <h1 className="font-heading text-xl font-bold text-[#F7F1E8]">
            Notification not found
          </h1>

          <p className="text-sm text-[#B89B7A] mt-2">
            This notification may have been deleted or
            you may not have permission to view it.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#C9A66B] text-[#2B211B] font-semibold text-sm hover:bg-[#B58A4A] transition-colors"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F3EBDD]">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A66B] hover:text-[#B58A4A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to notifications
        </button>

        <div className="bg-[#3A2A20] rounded-3xl border border-[#6B4A35] shadow-2xl overflow-hidden">

          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B211B] via-[#3A2A20] to-[#2B211B] text-[#F7F1E8] border-b border-[#6B4A35]">

            <div className="flex items-start gap-4">

              <div className="w-14 h-14 rounded-2xl bg-[#3A2A20] border border-[#6B4A35] flex items-center justify-center shrink-0">
                {getIcon()}
              </div>

              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-2 mb-2">

                  <span className="px-2.5 py-1 rounded-full bg-[#6B4A35]/60 border border-[#275d4d] text-xs font-semibold uppercase tracking-wider text-[#C9A66B]">
                    {notification.notification_type}
                  </span>

                </div>

                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F7F1E8]">
                  {notification.title}
                </h1>

                <div className="flex items-center gap-2 mt-3 text-xs text-[#B89B7A]">

                  <Clock className="w-3.5 h-3.5 text-[#8B684D]" />

                  {new Date(
                    notification.created_at
                  ).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}

                </div>

              </div>

            </div>

          </div>

          <div className="p-6 sm:p-8">

            <h2 className="font-heading font-bold text-lg text-[#F7F1E8] mb-3">
              Notification
            </h2>

            <div className="rounded-2xl bg-[#F3EBDD] border border-[#C9A66B] p-5">

              <p className="text-sm sm:text-base text-[#2B211B] leading-7 whitespace-pre-wrap">
                {notification.message}
              </p>

            </div>

            {notification.notification_type === 'BROADCAST' && (
              <div className="mt-6 p-4 rounded-2xl bg-[#132c23] border border-[#235342]">

                <div className="flex items-start gap-3">

                  <Radio className="w-5 h-5 text-[#C9A66B] mt-0.5 shrink-0" />

                  <div>

                    <h3 className="font-semibold text-sm text-[#F7F1E8]">
                      Campus Announcement
                    </h3>

                    <p className="text-xs text-[#B89B7A] mt-1 leading-relaxed">
                      This message was sent as a campus-wide
                      announcement by the administration.
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}