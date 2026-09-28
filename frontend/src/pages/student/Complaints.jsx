import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Building2,
  MessageSquare,
  Paperclip,
  ShieldOff,
  CheckCircle2
} from 'lucide-react';

import { complaintService } from '../../services/complaintService';
import {
  COMPLAINT_CATEGORIES,
  COMPLAINT_STATUSES
} from '../../utils/constants';

import StatusBadge, {
  PriorityBadge
} from '../../components/StatusBadge';

import LoadingSkeleton, {
  EmptyState
} from '../../components/LoadingSkeleton';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search) params.search = search;

      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }

      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      const data = await complaintService.getComplaints(params);

      setComplaints(data.results || data || []);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchComplaints();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen w-full bg-[#F4EBDD] text-[#2B211B]">

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="font-heading text-2xl font-bold text-[#2B211B] sm:text-3xl">
              Campus Grievance & Maintenance Desk
            </h1>

            <p className="mt-1 text-xs text-[#6F6259] sm:text-sm">
              Track your open complaints, dialogue with technicians,
              and review resolutions
            </p>
          </div>

          <Link
            to="/complaints/create"
            className="inline-flex items-center gap-2 self-start rounded-xl bg-[#C9A66B] px-4 py-2.5 text-xs font-bold text-[#2B211B] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#D8B979] sm:self-auto"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Lodge New Complaint</span>
          </Link>

        </div>

        {/* Search and Filters */}

        <div className="flex flex-col gap-3 rounded-2xl border border-[#D8CBB9] bg-[#FFF9EF] p-4 shadow-sm md:flex-row">

          {/* Search */}

          <div className="relative flex-1">

            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8B684D]">
              <Search className="h-4 w-4" />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, room number, or description..."
              className="w-full rounded-xl border border-[#D8CBB9] bg-[#F4EBDD] py-2.5 pl-10 pr-4 text-xs text-[#4A3426] outline-none placeholder:text-[#8B7A6C] focus:border-[#C9A66B] focus:ring-2 focus:ring-[#C9A66B]/30 sm:text-sm"
            />

          </div>

          {/* Category Filter */}

          <div className="w-full md:w-56">

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-[#D8CBB9] bg-[#F4EBDD] px-3 py-2.5 text-xs text-[#4A3426] outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#C9A66B]/30 sm:text-sm"
            >

              <option value="All">
                All Categories
              </option>

              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}

            </select>

          </div>

          {/* Status Filter */}

          <div className="w-full md:w-44">

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-[#D8CBB9] bg-[#F4EBDD] px-3 py-2.5 text-xs text-[#4A3426] outline-none focus:border-[#C9A66B] focus:ring-2 focus:ring-[#C9A66B]/30 sm:text-sm"
            >

              <option value="All">
                All Statuses
              </option>

              {COMPLAINT_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* Complaints List */}

        {loading ? (

          <div className="rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-4">
            <LoadingSkeleton count={4} />
          </div>

        ) : complaints.length === 0 ? (

          <div className="rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-8">

            <EmptyState
              title="No complaints found"
              message="There are no complaint tickets matching your selected filters or search query."
              actionLabel="Clear Filters & Refresh"
              onAction={() => {
                setSearch('');
                setSelectedCategory('All');
                setSelectedStatus('All');
              }}
              icon={CheckCircle2}
            />

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {complaints.map((item) => (

              <Link
                key={item.id}
                to={`/complaints/${item.id}`}
                className="group flex flex-col justify-between rounded-2xl border border-[#6B4A35] bg-[#3A2A20] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#8B684D] hover:bg-[#4A3426]"
              >

                <div className="space-y-4">

                  {/* Complaint Header */}

                  <div className="flex items-center justify-between gap-2">

                    <div className="flex flex-wrap items-center gap-2">

                      <span className="font-mono text-xs font-bold text-[#907D6F]">
                        #{item.id}
                      </span>

                      <span className="rounded-md border border-[#6B4A35]/50 bg-[#6B4A35]/30 px-2.5 py-0.5 text-xs font-semibold text-[#C9A66B]">
                        {item.category}
                      </span>

                      <PriorityBadge priority={item.priority} />

                    </div>

                    <StatusBadge status={item.status} />

                  </div>

                  {/* Complaint Details */}

                  <div>

                    <h3 className="font-heading text-base font-bold text-[#F4EFE5] transition-colors group-hover:text-[#C9A66B]">
                      {item.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#A99688]">
                      {item.description}
                    </p>

                  </div>

                  {/* Location and Assignment */}

                  <div className="space-y-1.5 text-xs text-[#907D6F]">

                    <div className="flex items-center gap-1.5">

                      <Building2 className="h-3.5 w-3.5 shrink-0 text-[#C9A66B]" />

                      <span className="truncate">
                        {item.location}
                      </span>

                    </div>

                    {item.assigned_to && (
                      <div className="font-medium text-[#C9A66B]">
                        Assigned: {item.assigned_to}
                      </div>
                    )}

                  </div>

                </div>

                {/* Complaint Footer */}

                <div className="mt-5 flex items-center justify-between border-t border-[#6B4A35]/60 pt-3 text-xs">

                  <div className="flex items-center gap-3">

                    {item.anonymous && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#D8B979]">
                        <ShieldOff className="h-3 w-3" />
                        Anonymous
                      </span>
                    )}

                    {item.attachment && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#C9A66B]">
                        <Paperclip className="h-3 w-3" />
                        Attachment
                      </span>
                    )}

                    {item.comments_count > 0 && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-[#907D6F]">
                        <MessageSquare className="h-3 w-3" />
                        {item.comments_count} remarks
                      </span>
                    )}

                  </div>

                  <span className="text-[11px] text-[#796A5F]">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}
