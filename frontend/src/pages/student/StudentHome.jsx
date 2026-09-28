import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  PlusCircle,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Building2,
  Compass,
  Calendar,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import { outpassService } from '../../services/outpassService';

import StatusBadge, {
  PriorityBadge,
} from '../../components/StatusBadge';

import LoadingSkeleton from '../../components/LoadingSkeleton';

export default function StudentHome() {
  const { user } = useAuth();

  const [complaints, setComplaints] = useState([]);
  const [outpasses, setOutpasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // TIME-AWARE GREETING
  // ============================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 17) {
      return 'Good afternoon';
    }

    return 'Good evening';
  };

  // ============================================================
  // LOAD DASHBOARD DATA
  // ============================================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        const [complaintsData, outpassesData] = await Promise.all([
          complaintService.getComplaints(),
          outpassService.getOutpasses(),
        ]);

        setComplaints(
          complaintsData?.results || complaintsData || []
        );

        setOutpasses(
          outpassesData?.results || outpassesData || []
        );
      } catch (err) {
        console.error(
          'Failed to load student dashboard:',
          err
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // ============================================================
  // FILTER DATA
  // ============================================================

  const activeComplaints = complaints.filter(
    (c) =>
      c.status === 'Pending' ||
      c.status === 'Assigned' ||
      c.status === 'In Progress'
  );

  const activeOutpass = outpasses.find(
    (o) =>
      o.status !== 'Completed' &&
      o.status !== 'Rejected'
  );

  const resolvedComplaints = complaints.filter(
    (c) => c.status === 'Resolved'
  ).length;

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen w-full bg-[#F4EBDD] text-[#2B211B]">
      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">

        {/* ======================================================
            WELCOME SECTION
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-[#6B4A35] bg-[#3A2A20] shadow-xl"
        >
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#6B4A35]/20 blur-3xl" />

          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#C9A66B]/10 blur-3xl" />

          <div className="relative z-10 px-6 py-7 sm:px-8 sm:py-9">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              {/* Welcome text */}

              <div>
                <div className="mb-4 inline-flex items-center gap-2 text-[#C9A66B]">
                  <Sparkles className="h-4 w-4" />

                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                    Student HelpDesk
                  </span>
                </div>

                <h1 className="font-heading text-2xl font-bold tracking-tight text-[#F4EFE5] sm:text-4xl">
                  {getGreeting()},{' '}
                  {user?.first_name || user?.username}!
                </h1>

                <p className="mt-2 max-w-xl text-sm text-[#C9BDB3]">
                  {user?.student_profile?.hostel ? (
                    <>
                      Resident at{' '}

                      <span className="font-semibold text-[#F4EFE5]">
                        {user.student_profile.hostel}
                      </span>

                      {user.student_profile.room_number
                        ? ` • Room ${user.student_profile.room_number}`
                        : ''}
                    </>
                  ) : (
                    'Manage your campus requests, complaints and outpasses from one place.'
                  )}
                </p>
              </div>

              {/* Action buttons */}

              <div className="flex flex-wrap gap-2.5">
                <Link
                  to="/complaints/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C9A66B] px-4 py-2.5 text-xs font-bold text-[#2B211B] transition-all hover:-translate-y-0.5 hover:bg-[#D8B979]"
                >
                  <PlusCircle className="h-4 w-4" />
                  Raise Complaint
                </Link>

                <Link
                  to="/outpasses/create"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#CDBDAA]/30 bg-[#241B16] px-4 py-2.5 text-xs font-semibold text-[#F4EFE5] transition-all hover:-translate-y-0.5 hover:bg-[#4A3426]"
                >
                  <FileCheck2 className="h-4 w-4 text-[#C9A66B]" />
                  Apply Outpass
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ======================================================
            QUICK OVERVIEW
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >

          {/* Active Complaints */}

          <div className="group rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4 transition-all hover:border-[#8B684D] hover:bg-[#4A3426]">
            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B4A35]/50 bg-[#6B4A35]/30 text-[#C9A66B]">
                  <Compass className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#B8A99E]">
                    Active Complaints
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-[#F4EFE5]">
                    {activeComplaints.length}
                  </p>
                </div>
              </div>

              <Link
                to="/complaints"
                className="rounded-lg p-2 text-[#A99688] transition-colors hover:bg-[#6B4A35]/30 hover:text-[#C9A66B]"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Active Outpass */}

          <div className="group rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4 transition-all hover:border-[#8B684D] hover:bg-[#4A3426]">
            <div className="flex items-center justify-between gap-3">

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B4A35]/50 bg-[#6B4A35]/30 text-[#C9A66B]">
                  <Calendar className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#B8A99E]">
                    Current Outpass
                  </p>

                  {activeOutpass ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-[#F4EFE5]">
                        {activeOutpass.destination}
                      </span>

                      <StatusBadge
                        status={activeOutpass.status}
                        size="xs"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-[#A99688]">
                      No active outpass
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={
                  activeOutpass
                    ? `/outpasses/${activeOutpass.id}`
                    : '/outpasses'
                }
                className="rounded-lg p-2 text-[#A99688] transition-colors hover:bg-[#6B4A35]/30 hover:text-[#C9A66B]"
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Resolved */}

          <div className="group rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4 transition-all hover:border-[#8B684D] hover:bg-[#4A3426]">
            <div className="flex items-center justify-between gap-3">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#6B4A35]/50 bg-[#6B4A35]/30 text-[#C9A66B]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#B8A99E]">
                    Resolved
                  </p>

                  <p className="mt-0.5 text-lg font-bold text-[#F4EFE5]">
                    {resolvedComplaints}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A66B]">
                Tracked
              </span>
            </div>
          </div>
        </motion.section>

        {/* ======================================================
            ACTIVE COMPLAINTS
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
        >
          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A66B]">
                Requests
              </p>

              <h2 className="font-heading text-xl font-bold text-[#2B211B]">
                Active complaints
              </h2>

              <p className="mt-1 text-xs text-[#6F6259]">
                Your current campus requests
              </p>
            </div>

            <Link
              to="/complaints"
              className="hidden items-center gap-1.5 text-xs font-semibold text-[#79563F] hover:text-[#5C402F] sm:flex"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4">
              <LoadingSkeleton count={2} />
            </div>
          ) : activeComplaints.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#6B4A35] bg-[#3A2A20] px-6 py-8 text-center">

              <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6B4A35]/20 blur-3xl" />

              <div className="relative">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#6B4A35]/40 bg-[#6B4A35]/30 text-[#C9A66B]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <h3 className="text-sm font-semibold text-[#F4EFE5]">
                  Everything looks good
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs text-[#A99688]">
                  You currently have no active complaints.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 scrollbar-thin">
              {activeComplaints.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to={`/complaints/${item.id}`}
                  className="group min-w-[280px] max-w-[320px] flex-1 snap-start rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B684D] hover:bg-[#4A3426]"
                >
                  <div className="flex items-center justify-between gap-2">

                    <span className="font-mono text-[10px] font-bold text-[#907D6F]">
                      #{item.id}
                    </span>

                    <StatusBadge
                      status={item.status}
                      size="xs"
                    />
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center gap-2">

                      <span className="truncate rounded-md border border-[#6B4A35]/40 bg-[#6B4A35]/30 px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#C9A66B]">
                        {item.category}
                      </span>

                      <PriorityBadge
                        priority={item.priority}
                      />
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-sm font-bold text-[#F4EFE5] group-hover:text-[#C9A66B]">
                      {item.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#A99688]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#6B4A35]/50 pt-3 text-[10px]">

                    <span className="flex min-w-0 items-center gap-1.5 text-[#907D6F]">
                      <Building2 className="h-3.5 w-3.5 shrink-0 text-[#C9A66B]" />

                      <span className="truncate">
                        {item.location || 'Campus'}
                      </span>
                    </span>

                    <ChevronRight className="h-3.5 w-3.5 text-[#907D6F] transition-transform group-hover:translate-x-1 group-hover:text-[#C9A66B]" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* ======================================================
            OUTPASSES
        ====================================================== */}

        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <div className="mb-4 flex items-end justify-between gap-4">

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#C9A66B]">
                Permissions
              </p>

              <h2 className="font-heading text-xl font-bold text-[#2B211B]">
                Outpass activity
              </h2>

              <p className="mt-1 text-xs text-[#6F6259]">
                Recent requests and approvals
              </p>
            </div>

            <Link
              to="/outpasses"
              className="hidden items-center gap-1.5 text-xs font-semibold text-[#79563F] hover:text-[#5C402F] sm:flex"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4">
              <LoadingSkeleton count={1} />
            </div>
          ) : outpasses.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-[#6B4A35] bg-[#3A2A20] px-6 py-8 text-center">

              <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#C9A66B]/10 blur-3xl" />

              <div className="relative">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#6B4A35]/40 bg-[#6B4A35]/30 text-[#C9A66B]">
                  <Calendar className="h-5 w-5" />
                </div>

                <h3 className="text-sm font-semibold text-[#F4EFE5]">
                  No outpass applications
                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs text-[#A99688]">
                  Your outpass requests will appear here once you apply.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              {outpasses.slice(0, 2).map((item) => (
                <Link
                  key={item.id}
                  to={`/outpasses/${item.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B684D] hover:bg-[#4A3426]"
                >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#C9A66B]/5 blur-2xl transition-all group-hover:bg-[#C9A66B]/10" />

                  <div className="relative">

                    <div className="flex items-center justify-between">

                      <span className="font-mono text-[10px] font-bold text-[#907D6F]">
                        OUTPASS #{item.id}
                      </span>

                      <StatusBadge
                        status={item.status}
                        size="xs"
                      />
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-base font-bold text-[#F4EFE5] group-hover:text-[#C9A66B]">
                      {item.destination}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-[#A99688]">
                      {item.reason}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-2">

                      {/* Departure */}

                      <div className="rounded-xl border border-[#6B4A35] bg-[#241B16] px-3 py-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#907D6F]">
                          Departure
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#D8CDC4]">
                          {new Date(
                            item.from_date
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Return */}

                      <div className="rounded-xl border border-[#6B4A35] bg-[#241B16] px-3 py-2.5">
                        <p className="text-[9px] uppercase tracking-wider text-[#907D6F]">
                          Return
                        </p>

                        <p className="mt-1 text-xs font-semibold text-[#D8CDC4]">
                          {new Date(
                            item.to_date
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-[#6B4A35]/50 pt-3">

                      <span className="flex items-center gap-1.5 text-[10px] font-medium text-[#C9A66B]">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Parent: {item.verification_status}
                      </span>

                      <ChevronRight className="h-4 w-4 text-[#907D6F] transition-transform group-hover:translate-x-1 group-hover:text-[#C9A66B]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

      </div>
    </div>
  );
}
