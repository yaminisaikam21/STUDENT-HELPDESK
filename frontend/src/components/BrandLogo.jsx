import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({
  className = '',
  light = false,
  linkTo = '/',
}) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>

      {/* Logo Icon */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6B4A35] to-[#2B211B] border border-[#8B6A4F]/50 shadow-sm overflow-hidden group">

        <div className="absolute inset-0 bg-gradient-to-tr from-[#6B4A35]/30 via-transparent to-[#B58A4A]/25" />

        <svg
          className="relative w-5 h-5 text-[#D4B477] transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 10 12 5 2 10l10 5 10-5Z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
          <path d="M22 10v6" />
        </svg>
      </div>

      {/* Logo Title */}
      <div className="flex flex-col">

        <span
          className={`font-heading text-lg font-extrabold tracking-tight leading-tight ${
            light
              ? 'text-white'
              : 'text-[#6B4A35]'
          }`}
        >
          Student HelpDesk
        </span>

        {/* Subtitle */}
        <span
          className={`text-[9px] tracking-[.14em] uppercase font-bold ${
            light
              ? 'text-[#E7D8C5]/75'
              : 'text-[#8B6A4F]'
          }`}
        >
          Campus Service Platform
        </span>

      </div>
    </div>
  );

  return linkTo ? (
    <Link
      to={linkTo}
      className="inline-block hover:opacity-90 transition-opacity"
      aria-label="Student HelpDesk home"
    >
      {content}
    </Link>
  ) : (
    content
  );
}